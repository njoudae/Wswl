let currentDescriptor = null;

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
    status.textContent =
      "Face library failed to load. Check face-api.js script.";
    status.className = "error";
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

    status.textContent = "Face models loaded. Align your face and verify.";
    status.className = "success";
  } catch (err) {
    status.textContent = "Failed to load face models: " + err.message;
    status.className = "error";
    throw err;
  }
}

async function captureDescriptor() {
  const video = document.getElementById("video");
  const canvas = document.getElementById("snapshot");
  const status = document.getElementById("status");

  if (!video.videoWidth || !video.videoHeight) {
    await new Promise((resolve) => {
      if (video.readyState >= 2) return resolve();
      video.onloadedmetadata = () => resolve();
    });
  }

  const options = new faceapi.TinyFaceDetectorOptions({
    inputSize: 320,
    scoreThreshold: 0.2,
  });

  const detections = await faceapi
    .detectSingleFace(video, options)
    .withFaceLandmarks()
    .withFaceDescriptor();

  console.log(
    "[verify] detections:",
    detections ? detections.detection.score : "none"
  );

  if (!detections) {
    status.textContent =
      "No face detected. Adjust lighting/position and try again.";
    status.className = "error";
    throw new Error("No face detected");
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  canvas.style.display = "block";

  currentDescriptor = Array.from(detections.descriptor);
  return currentDescriptor;
}

window.addEventListener("DOMContentLoaded", async () => {
  const status = document.getElementById("status");

  // 1) Get tempToken from sessionStorage (set by login)
  const tempToken = sessionStorage.getItem("tempToken");
  console.log("[verify] tempToken from sessionStorage:", tempToken);

  if (!tempToken) {
    // No temp token -> user never passed credentials step, go back to login
    window.location.href = "/login.html";
    return;
  }

  // 2) Initialize camera + models
  try {
    await setupCamera();
    await loadModels();
  } catch (err) {
    console.error("Initialization error:", err);
    return;
  }

  // 3) Wire verify button
  document.getElementById("verify-btn").addEventListener("click", async () => {
    status.textContent = "";
    status.className = "";

    try {
      await captureDescriptor();

      const payload = {
        tempToken: tempToken, // key name MUST be tempToken
        face_descriptor: currentDescriptor, // key name MUST be face_descriptor
      };

      console.log("[verify] sending payload:", payload);

      const res = await apiRequest("/auth/verify-face", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      console.log("[verify] server response:", res);

      setToken(res.token);
      sessionStorage.removeItem("tempToken");
      window.location.href = "/driver-home.html";
    } catch (err) {
      console.error("[verify] error:", err);
      status.textContent = err.message;
      status.className = "error";
    }
  });
});
