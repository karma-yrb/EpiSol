// Fonctions utilitaires d'accès à l'API des achats (historique)

export async function fetchAchats() {
  const res = await fetch('/achats');
  if (!res.ok) throw new Error('Erreur lors du chargement des achats');
  return await res.json();
}

export async function deleteAchat(id) {
  const res = await fetch(`/achats/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erreur lors de la suppression');
  return true;
}

export async function fetchAchatDetails(id) {
  const res = await fetch(`/achats/${id}`);
  if (!res.ok) throw new Error('Erreur lors du chargement des détails');
  return await res.json();
}
