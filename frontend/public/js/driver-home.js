async function loadHome() {
  const summaryEl = document.getElementById('summary');
  try {
    const data = await apiRequest('/drivers/me/home');
    summaryEl.innerHTML = `
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>National ID:</strong> ${data.national_id}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Bus:</strong> ${data.bus_model} (#${data.bus_number})</p>
    `;
  } catch (err) {
    summaryEl.textContent = err.message;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('logout-link').addEventListener('click', (e) => {
    e.preventDefault();
    clearToken();
    window.location.href = '/login.html';
  });
  loadHome();
});
