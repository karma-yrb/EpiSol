// Fonctions utilitaires d'accès à l'API des utilisateurs

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export async function fetchUsers() {
  const res = await fetch(`${API_BASE_URL}/api/users`);
  if (!res.ok) throw new Error('Erreur lors du chargement des utilisateurs');
  return await res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${API_BASE_URL}/api/users/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erreur lors de la suppression');
  return true;
}

export async function fetchUserLogs(userId) {
  const res = await fetch(`${API_BASE_URL}/api/users/${userId}/logs`);
  if (!res.ok) throw new Error('Erreur lors du chargement des logs utilisateur');
  return await res.json();
}

export async function fetchUserInfo(id) {
  const res = await fetch(`${API_BASE_URL}/api/users/${id}`);
  if (!res.ok) throw new Error('Erreur lors du chargement des infos utilisateur');
  return await res.json();
}

// Ajoutez d'autres fonctions si besoin (addUser, updateUser, etc.)
