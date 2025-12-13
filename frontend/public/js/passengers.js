async function loadPassengers() {
  const listEl = document.getElementById("list");

  const dummyPassengers = [
    {
      name: "Alya Nasser",
      national_id: "1093324567",
      student_id: "S12345",
      location: { lat: 24.7136, lng: 46.6753 },
    },
    {
      name: "Fatima Alqahtani",
      national_id: "1082243355",
      student_id: "S67890",
      location: { lat: 24.7201, lng: 46.68 },
    },
    {
      name: "Fatima Alqahtani",
      national_id: "1082243355",
      student_id: "S67890",
      location: { lat: 24.7201, lng: 46.68 },
    },
    {
      name: "Fatima Alqahtani",
      national_id: "1082243355",
      student_id: "S67890",
      location: { lat: 24.7201, lng: 46.68 },
    },
  ];

  dummyPassengers.forEach((p) => {
    const div = document.createElement("div");
    div.className = "passenger";
    div.className = "card";
    div.innerHTML = `
      <strong>${p.name}</strong><br/>
      National ID: ${p.national_id}<br/>
      Student ID: ${p.student_id}<br/>
      <a href="https://www.google.com/maps?q=${p.location.lat},${p.location.lng}" target="_blank">View Location</a>
    `;
    listEl.appendChild(div);
  }

);
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("logout-link").addEventListener("click", (e) => {
    e.preventDefault();
    clearToken();
    window.location.href = "/login.html";
  });
  loadPassengers();
});
