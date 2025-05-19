// Fonctions utilitaires d'accès à l'API des produits

export async function fetchProduits() {
  const res = await fetch('/produits');
  if (!res.ok) throw new Error('Erreur lors du chargement des produits');
  return await res.json();
}

export async function addProduit(produit) {
  const res = await fetch('/produits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produit)
  });
  if (!res.ok) throw new Error('Erreur lors de l\'ajout');
  return await res.json();
}

export async function updateProduit(id, produit) {
  const res = await fetch(`/produits/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produit)
  });
  if (!res.ok) throw new Error('Erreur lors de la modification');
  return await res.json();
}

export async function deleteProduit(id) {
  const res = await fetch(`/produits/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erreur lors de la suppression');
  return true;
}
