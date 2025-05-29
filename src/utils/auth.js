// utils/auth.js
// Helper pour décoder le rôle utilisateur à partir du token JWT

export function getUserRoleFromToken() {
  const token = localStorage.getItem('token');
  if (token && token !== 'mock-token') {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        return payload.role || null;
      }
    } catch {}
  }
  return null;
}

export function isAdminFromToken() {
  return getUserRoleFromToken() === 'admin';
}
