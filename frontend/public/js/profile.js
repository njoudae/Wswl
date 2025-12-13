async function loadProfile() {
  const el = document.getElementById('profile');
  try {
    const data = await apiRequest('/drivers/me/profile');
    el.innerHTML = `
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>National ID:</strong> ${data.national_id}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Role:</strong> ${data.role}</p>
      <p><strong>Bus:</strong> ${data.bus_model || ''} #${data.bus_number || ''}</p>
      <p><strong>Maintenance Report:</strong> ${data.maintenance_report_path || 'N/A'}</p>
      <p><strong>Health Report:</strong> ${data.health_report_path || 'N/A'}</p>
    `;
  } catch (err) {
    el.textContent = err.message;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('logout-link').addEventListener('click', (e) => {
    e.preventDefault();
    clearToken();
    window.location.href = '/login.html';
  });
  loadProfile();
});
