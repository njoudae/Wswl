import express from "express";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
import multer from "multer";

import db from "../db/db.js";
import { signToken } from "../middleware/auth.js";
import {
  computeEuclideanDistance,
  FACE_MATCH_THRESHOLD,
} from "../utils/face.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Ensure upload directories exist
const uploadsRoot = path.join(__dirname, "../../uploads");
const healthDir = path.join(uploadsRoot, "health_reports");
const maintenanceDir = path.join(uploadsRoot, "maintenance_reports");

[uploadsRoot, healthDir, maintenanceDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "health_report") {
      cb(null, healthDir);
    } else if (file.fieldname === "maintenance_report") {
      cb(null, maintenanceDir);
    } else {
      cb(null, uploadsRoot);
    }
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const unique = Date.now() + "_" + Math.round(Math.random() * 1e9);
    cb(null, `${unique}_${safeName}`);
  },
});

const upload = multer({
  storage,
  preservePath: true,
  limits: { fieldSize: 5 * 1024 * 1024 },
});

const router = express.Router();

// Helper: get user by national_id
function getUserByNationalId(national_id) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM users WHERE national_id = ?",
      [national_id],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
}

// Signup for driver 
router.post("/signup-driver", upload.any(), async (req, res) => {
  try {
    const {
      name,
      national_id,
      phone,
      password,
      bus_model,
      bus_number,
      supervisor_id,
      face_descriptor,
    } = req.body;

    if (
      !name ||
      !national_id ||
      !phone ||
      !password ||
      !bus_model ||
      !bus_number ||
      !face_descriptor
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Parse face descriptor from JSON string
    let faceDescArray;
    try {
      faceDescArray = JSON.parse(face_descriptor);
    } catch (e) {
      console.error("Invalid face_descriptor JSON", e);
      return res.status(400).json({ message: "Invalid face_descriptor" });
    }

    const existing = await getUserByNationalId(national_id);
    if (existing) {
      return res
        .status(400)
        .json({ message: "User with this national ID already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    // Extract uploaded files
    const fileMap = Object.fromEntries(req.files.map((f) => [f.fieldname, f]));

    const healthFile = fileMap.health_report || null;
    const maintenanceFile = fileMap.maintenance_report || null;

    // Store relative paths (so they can be used in links later)
    const healthPath = healthFile
      ? path.posix.join("uploads", "health_reports", healthFile.filename)
      : null;
    const maintenancePath = maintenanceFile
      ? path.posix.join(
          "uploads",
          "maintenance_reports",
          maintenanceFile.filename
        )
      : null;

    db.serialize(() => {
      db.run(
        `INSERT INTO users (name, national_id, phone, password_hash, role)
           VALUES (?, ?, ?, ?, 'driver')`,
        [name, national_id, phone, password_hash],
        function (err) {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error creating user" });
          }
          const userId = this.lastID;

          db.run(
            `INSERT INTO drivers
                 (user_id, supervisor_id, bus_model, bus_number,
                  maintenance_report_path, health_report_path)
               VALUES (?, ?, ?, ?, ?, ?)`,
            [
              userId,
              supervisor_id || null,
              bus_model,
              bus_number,
              maintenancePath,
              healthPath,
            ],
            function (err2) {
              if (err2) {
                console.error(err2);
                return res
                  .status(500)
                  .json({ message: "Error creating driver profile" });
              }

              db.run(
                `INSERT INTO face_templates (user_id, descriptor_json)
                   VALUES (?, ?)`,
                [userId, JSON.stringify(faceDescArray)],
                function (err3) {
                  if (err3) {
                    console.error(err3);
                    return res.status(500).json({
                      message: "Error saving face template",
                    });
                  }
                  return res
                    .status(201)
                    .json({ message: "Driver signup successful" });
                }
              );
            }
          );
        }
      );
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Step 1: credential login (password + national_id)
router.post("/login-credentials", async (req, res) => {
  try {
    const { national_id, password } = req.body;
    if (!national_id || !password) {
      return res
        .status(400)
        .json({ message: "Missing national_id or password" });
    }

    const user = await getUserByNationalId(national_id);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Issue a short-lived temp token limited to face verification
    // in login-credentials handler
    const tempToken = Buffer.from(
      JSON.stringify({ userId: user.id, ts: Date.now() }) // ms since epoch
    ).toString("base64");

    return res.json({
      message: "Credentials ok, proceed to face verification",
      tempToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Step 2: face verification
router.post("/verify-face", (req, res) => {
  const { tempToken, face_descriptor } = req.body;

  if (!tempToken || !face_descriptor) {
    console.log(">>> Missing fields:", {
      tempToken: !!tempToken,
      hasDescriptor: !!face_descriptor,
    });
    return res
      .status(400)
      .json({ message: "Missing tempToken or face_descriptor" });
  }

  let payload;
  try {
    payload = JSON.parse(Buffer.from(tempToken, "base64").toString("utf8"));
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Invalid temp token" });
  }

  const { userId, ts } = payload || {};
  if (!userId) {
    return res.status(400).json({ message: "Temp token invalid (no userId)" });
  }

  db.get(
    `SELECT u.*, f.descriptor_json
     FROM users u
     JOIN face_templates f ON f.user_id = u.id
     WHERE u.id = ?`,
    [userId],
    (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }
      if (!row) {
        return res
          .status(404)
          .json({ message: "User or face template not found" });
      }

      let storedDescriptor;
      try {
        storedDescriptor = JSON.parse(row.descriptor_json);
      } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Corrupted face template" });
      }

      const distance = computeEuclideanDistance(
        storedDescriptor,
        face_descriptor
      );
      const match = distance <= FACE_MATCH_THRESHOLD;

      if (!match) {
        return res
          .status(401)
          .json({ message: "Face does not match", distance });
      }

      const token = signToken(row);
      return res.json({
        message: "Face verified; login complete",
        token,
        distance,
      });
    }
  );
});

export default router;
