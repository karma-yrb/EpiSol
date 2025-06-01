// Fonctions utilitaires d'accès à l'API des bénéficiaires

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export async function fetchBeneficiaires() {
  const res = await fetch(`${API_BASE_URL}/api/beneficiaires`);
  if (!res.ok) throw new Error('Erreur lors du chargement des bénéficiaires');
  return await res.json();
}

export async function fetchBeneficiaire(id) {
  const res = await fetch(`${API_BASE_URL}/api/beneficiaires/${id}`);
  if (!res.ok) throw new Error('Erreur lors du chargement du bénéficiaire');
  return await res.json();
}

export async function addBeneficiaire(data) {
  const res = await fetch(`${API_BASE_URL}/api/beneficiaires`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch (e) {}
    const msg = errorData && errorData.error ? errorData.error : 'Erreur lors de l\'ajout du bénéficiaire';
    throw new Error(msg);
  }
  return await res.json();
}

export async function updateBeneficiaire(id, data) {
  const res = await fetch(`${API_BASE_URL}/api/beneficiaires/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  let errorData;
  if (!res.ok) {
    try {
      errorData = await res.json();
    } catch (e) {}
    const msg = errorData && errorData.error ? errorData.error : 'Erreur lors de la modification du bénéficiaire';
    throw new Error(msg);
  }
  return await res.json();
}

export async function deleteBeneficiaire(id) {
  const res = await fetch(`${API_BASE_URL}/api/beneficiaires/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erreur lors de la suppression du bénéficiaire');
  return true;
}

// Ajoutez d'autres fonctions si besoin (addBeneficiaire, updateBeneficiaire, etc.)
