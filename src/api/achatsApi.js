// Fonctions utilitaires d'accès à l'API des achats

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export async function fetchAchats() {
  const res = await fetch(`${API_BASE_URL}/achats`);
  if (!res.ok) throw new Error('Erreur lors du chargement des achats');
  return await res.json();
}

export async function addAchat(beneficiaire_id, lignes) {
  const res = await fetch(`${API_BASE_URL}/achats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ beneficiaire_id, lignes })
  });
  if (!res.ok) throw new Error('Erreur lors de l\'enregistrement des achats');
  return await res.json();
}

// Ajoutez d'autres fonctions si besoin (updateAchat, deleteAchat, etc.)
