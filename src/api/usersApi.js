// Fonctions utilitaires d'accès à l'API des utilisateurs

export async function fetchUsers() {
  const res = await fetch('/api/users');
  if (!res.ok) throw new Error('Erreur lors du chargement des utilisateurs');
  return await res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erreur lors de la suppression');
  return true;
}

// Ajoutez d'autres fonctions si besoin (addUser, updateUser, etc.)
