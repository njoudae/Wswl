async function loadNotifications() {
  const el = document.getElementById('notifications');
  try {
    const data = await apiRequest('/drivers/me/notifications');
    if (!data.length) {
      el.textContent = 'No notifications.';
      return;
    }
    el.innerHTML = data.map(n => `
      <div class="card">
        <p>${n.message}</p>
        <small>${new Date(n.created_at).toLocaleString()}</small>
      </div>
    `).join('');
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
  loadNotifications();
});
