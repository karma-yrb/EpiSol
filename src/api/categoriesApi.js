// Fonctions utilitaires d'accès à l'API des catégories

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export async function fetchCategories() {
  const res = await fetch(`${API_BASE_URL}/api/categories`);
  if (!res.ok) throw new Error('Erreur lors du chargement des catégories');
  return await res.json();
}

export async function addCategory(nom) {
  const res = await fetch(`${API_BASE_URL}/api/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nom })
  });
  if (!res.ok) throw new Error('Erreur lors de l\'ajout');
  return await res.json();
}

export async function updateCategory(id, nom) {
  const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nom })
  });
  if (!res.ok) throw new Error('Erreur lors de la modification');
  return await res.json();
}

export async function deleteCategory(id) {
  const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    let msg = 'Erreur lors de la suppression.';
    let data = null;
    try { data = await res.json(); } catch {}
    if (res.status === 404) msg = "Catégorie déjà supprimée ou inexistante.";
    else if (data && data.error && data.error.includes('RESTRICT')) msg = "Impossible de supprimer cette catégorie : elle est utilisée par au moins un produit.";
    else if (data && data.error) msg = data.error;
    const err = new Error(msg);
    err.apiMsg = msg;
    throw err;
  }
  return true;
}
