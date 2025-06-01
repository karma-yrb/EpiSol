// Fonctions utilitaires d'accès à l'API des achats (historique)

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export async function fetchAchats() {
  const res = await fetch(`${API_BASE_URL}/api/achats`);
  if (!res.ok) throw new Error('Erreur lors du chargement des achats');
  return await res.json();
}

export async function deleteAchat(id) {
  const res = await fetch(`${API_BASE_URL}/api/achats/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erreur lors de la suppression');
  return true;
}

export async function fetchAchatDetails(id) {
  const res = await fetch(`${API_BASE_URL}/api/achats/${id}`);
  if (!res.ok) throw new Error('Erreur lors du chargement des détails');
  return await res.json();
}
