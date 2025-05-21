// Fonctions utilitaires d'accès à l'API des achats

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export async function fetchAchats() {
  const res = await fetch(`${API_BASE_URL}/achats`);
  if (!res.ok) throw new Error('Erreur lors du chargement des achats');
  return await res.json();
}

export async function addAchat(beneficiaire_id, lignes) {
  const url = `${API_BASE_URL}/achats`;
  const payload = { beneficiaire_id, lignes };
  console.log('[achatsApi] POST', url, payload);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }
  console.log('[achatsApi] Réponse:', res.status, data);
  if (!res.ok) throw new Error('Erreur lors de l\'enregistrement des achats');
  return data;
}

// Ajoutez d'autres fonctions si besoin (updateAchat, deleteAchat, etc.)
