import express from 'express';
import db from '../db/db.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

// Get driver home summary
router.get('/me/home', authRequired, (req, res) => {
  const userId = req.user.id;
  db.get(
    `SELECT u.id as user_id, u.name, u.national_id, u.phone, d.bus_model, d.bus_number
     FROM users u
     JOIN drivers d ON d.user_id = u.id
     WHERE u.id = ?`,
    [userId],
    (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
      if (!row) return res.status(404).json({ message: 'Driver not found' });
      return res.json(row);
    }
  );
});

// List passengers for this driver
router.get('/me/passengers', authRequired, (req, res) => {
  const userId = req.user.id;
  db.get(
    `SELECT id FROM drivers WHERE user_id = ?`,
    [userId],
    (err, driverRow) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
      if (!driverRow) return res.status(404).json({ message: 'Driver profile not found' });

      const driverId = driverRow.id;
      db.all(
        `SELECT p.id as passenger_id, u.name, u.national_id, u.phone, u.location
         FROM passengers p
         JOIN users u ON u.id = p.user_id
         WHERE p.driver_id = ?`,
        [driverId],
        (err2, rows) => {
          if (err2) {
            console.error(err2);
            return res.status(500).json({ message: 'Database error' });
          }
          return res.json(rows);
        }
      );
    }
  );
});

// Get supervisor for this driver
router.get('/me/supervisor', authRequired, (req, res) => {
  const userId = req.user.id;
  db.get(
    `SELECT d.supervisor_id
     FROM drivers d
     WHERE d.user_id = ?`,
    [userId],
    (err, drow) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
      if (!drow || !drow.supervisor_id) {
        return res.status(404).json({ message: 'Supervisor not assigned' });
      }
      db.get(
        `SELECT s.id as supervisor_id, u.name, u.national_id, u.phone
         FROM supervisors s
         JOIN users u ON u.id = s.user_id
         WHERE s.id = ?`,
        [drow.supervisor_id],
        (err2, row) => {
          if (err2) {
            console.error(err2);
            return res.status(500).json({ message: 'Database error' });
          }
          if (!row) return res.status(404).json({ message: 'Supervisor not found' });
          return res.json(row);
        }
      );
    }
  );
});

// For now, notifications endpoint returns static data
router.get('/me/notifications', authRequired, (req, res) => {
  const notifications = [
    { id: 1, message: 'Bus maintenance due in 7 days', created_at: new Date().toISOString() },
    { id: 2, message: 'New passenger assigned to your route', created_at: new Date().toISOString() }
  ];
  res.json(notifications);
});

// Profile info block (driver)
router.get('/me/profile', authRequired, (req, res) => {
  const userId = req.user.id;
  db.get(
    `SELECT u.id as user_id, u.name, u.national_id, u.phone, u.role,
            d.bus_model, d.bus_number, d.maintenance_report_path, d.health_report_path
     FROM users u
     LEFT JOIN drivers d ON d.user_id = u.id
     WHERE u.id = ?`,
    [userId],
    (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
      if (!row) return res.status(404).json({ message: 'User not found' });
      return res.json(row);
    }
  );
});

export default router;
