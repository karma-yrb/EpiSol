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

// Helper pour extraire toutes les informations utilisateur du token
export function getUserFromToken() {
  const token = localStorage.getItem('token');
  if (token && token !== 'mock-token') {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        return {
          id: payload.id,
          username: payload.username,
          nom: payload.nom,
          prenom: payload.prenom,
          email: payload.email,
          role: payload.role
        };
      }
    } catch {}
  }
  return null;
}

// Helper pour générer les initiales de l'utilisateur à partir du token
export function getUserInitialsFromToken() {
  const user = getUserFromToken();
  if (user && user.nom && user.prenom) {
    return (user.prenom.charAt(0) + user.nom.charAt(0)).toUpperCase();
  }
  return null;
}
