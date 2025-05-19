// Fonctions utilitaires d'accès à l'API des bénéficiaires

export async function fetchBeneficiaires() {
  const res = await fetch('/beneficiaires');
  if (!res.ok) throw new Error('Erreur lors du chargement des bénéficiaires');
  return await res.json();
}

export async function deleteBeneficiaire(id) {
  const res = await fetch(`/beneficiaires/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erreur lors de la suppression');
  return true;
}

// Ajoutez d'autres fonctions si besoin (addBeneficiaire, updateBeneficiaire, etc.)
