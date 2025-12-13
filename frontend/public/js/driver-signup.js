let capturedDescriptor = null;

async function setupCamera() {
  const video = document.getElementById("video");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    const status = document.getElementById("status");
    status.textContent = "Camera access denied: " + err.message;
    status.className = "error";
    throw err;
  }
}

async function loadModels() {
  const status = document.getElementById("status");
  if (typeof faceapi === "undefined") {
    if (status) {
      status.textContent =
        "Face library failed to load. Check face-api.js script.";
      status.className = "error";
    }
    throw new Error("faceapi is not defined (script not loaded)");
  }

  try {
    const base = "/models";

    await faceapi.nets.tinyFaceDetector.loadFromUri(
      base + "/tiny_face_detector"
    );
    await faceapi.nets.faceLandmark68Net.loadFromUri(
      base + "/face_landmark_68"
    );
    await faceapi.nets.faceRecognitionNet.loadFromUri(
      base + "/face_recognition"
    );

    if (status) {
      status.textContent = "Face models loaded. You can capture your face.";
      status.className = "success";
    }
  } catch (err) {
    if (status) {
      status.textContent = "Failed to load face models: " + err.message;
      status.className = "error";
    }
    throw err;
  }
}

async function captureFaceDescriptor() {
  const video = document.getElementById("video");
  const canvas = document.getElementById("snapshot");
  const status = document.getElementById("status");

  console.log("[capture] clicked");

  // Ensure video is ready
  if (!video.videoWidth || !video.videoHeight) {
    await new Promise((resolve) => {
      if (video.readyState >= 2) return resolve();
      video.onloadedmetadata = () => resolve();
    });
  }

  // 1) Run face detection on the live video element
  const options = new faceapi.TinyFaceDetectorOptions({
    inputSize: 320, // smaller = faster, 320–416 is usually fine
    scoreThreshold: 0.2, // lower threshold to be more tolerant
  });

  const detections = await faceapi
    .detectSingleFace(video, options)
    .withFaceLandmarks()
    .withFaceDescriptor();

  console.log(
    "[capture] detections:",
    detections ? detections.detection.score : "none"
  );

  if (!detections) {
    status.textContent =
      "Image captured, but no face detected. Adjust lighting/position and try again.";
    status.className = "error";
    throw new Error("No face detected");
  }

  // 2) Draw the current frame to the canvas for visual feedback
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  canvas.style.display = "block";

  // 3) Save descriptor
  capturedDescriptor = Array.from(detections.descriptor);
  status.textContent = "Face captured successfully.";
  status.className = "success";

  return capturedDescriptor;
}

window.addEventListener("DOMContentLoaded", async () => {
  // Initialize camera + models; if either fails, we show the error and avoid attaching handlers blindly
  try {
    await setupCamera();
    await loadModels();
  } catch (err) {
    // setup error already shown in status; no need to throw
    console.error("Initialization error:", err);
  }

  const captureBtn = document.getElementById("capture-btn");
  if (captureBtn) {
    captureBtn.addEventListener("click", async () => {
      const status = document.getElementById("status");
      status.textContent = "";
      status.className = "";

      try {
        await captureFaceDescriptor();
      } catch (err) {
        // error message already set above, but we log it as well
        console.error("[capture] error:", err);
      }
    });
  }

  const form = document.getElementById("signup-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = document.getElementById("status");
      const success = document.getElementById("success");
      status.textContent = "";
      success.textContent = "";

      if (!capturedDescriptor) {
        status.textContent = "Please capture your face before signing up.";
        status.className = "error";
        return;
      }

      const healthInput = document.getElementById("health_report");
      const maintenanceInput = document.getElementById("maintenance_report");

      const fd = new FormData();
      fd.append("name", document.getElementById("name").value);
      fd.append("national_id", document.getElementById("national_id").value);
      fd.append("phone", document.getElementById("phone").value);
      fd.append("password", document.getElementById("password").value);
      fd.append("bus_model", document.getElementById("bus_model").value);
      fd.append("bus_number", document.getElementById("bus_number").value);
      fd.append("face_descriptor", JSON.stringify(capturedDescriptor));

      if (healthInput.files[0]) {
        fd.append("health_report", healthInput.files[0]);
      }
      if (maintenanceInput.files[0]) {
        fd.append("maintenance_report", maintenanceInput.files[0]);
      }

      try {
        const res = await fetch("/api/auth/signup-driver", {
          method: "POST",
          body: fd,
        });
        const json = await res.json();
        if (res.ok) {
          success.textContent = json.message || "Signup successful.";
          success.className = "success";
        } else {
          throw new Error(json.message || "Signup failed");
        }
      } catch (err) {
        status.textContent = err.message;
        status.className = "error";
      }
    });
  }
});
