import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

/**
 * Hook personnalisé pour la création de nouveaux produits
 */
export function useProductCreation() {
  const [showAddProduit, setShowAddProduit] = useState(false);
  const [newProduitNom, setNewProduitNom] = useState("");
  const [newProduitPrix, setNewProduitPrix] = useState("");
  const [newProduitCategorie, setNewProduitCategorie] = useState("");
  const [addProduitError, setAddProduitError] = useState("");
  const [addProduitSuccess, setAddProduitSuccess] = useState("");
  const [categories, setCategories] = useState([]);

  // Récupère les catégories à l'ouverture du modal d'ajout produit
  useEffect(() => {
    if (showAddProduit) {
      fetch(`${API_BASE_URL}/api/categories`)
        .then(res => res.json())
        .then(data => setCategories(Array.isArray(data) ? data : []))
        .catch(() => setCategories([]));
    }
  }, [showAddProduit]);

  const handleCreateProduit = async () => {
    setAddProduitError("");
    setAddProduitSuccess("");
    
    if (!newProduitNom.trim()) {
      setAddProduitError("Le nom du produit est requis.");
      return null;
    }
    
    if (!newProduitPrix || isNaN(Number(newProduitPrix)) || Number(newProduitPrix) <= 0) {
      setAddProduitError("Le prix doit être un nombre positif.");
      return null;
    }

    try {
      // Cherche l'id de la catégorie sélectionnée
      const catObj = categories.find(cat => cat.nom === newProduitCategorie);
      const categorie_id = catObj ? catObj.id : null;
      
      if (!categorie_id) {
        setAddProduitError("Veuillez choisir une catégorie.");
        return null;
      }

      const res = await fetch(`${API_BASE_URL}/api/produits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: newProduitNom,
          prix: Number(newProduitPrix),
          categorie_id
        })
      });

      if (!res.ok) {
        let errorMsg = `Erreur lors de la création du produit (status: ${res.status})`;
        try {
          const errorData = await res.json();
          if (errorData && errorData.error) errorMsg += `: ${errorData.error}`;
        } catch (e) {
          // ignore JSON parse error
        }
        setAddProduitError(errorMsg);
        return null;
      }

      const produitCree = await res.json();
      setAddProduitSuccess("Produit créé avec succès !");
      
      // Reset du formulaire après succès
      setTimeout(() => {
        resetForm();
      }, 1000);

      return produitCree;
    } catch (err) {
      setAddProduitError("Erreur lors de la création du produit.");
      return null;
    }
  };

  const resetForm = () => {
    setShowAddProduit(false);
    setNewProduitNom("");
    setNewProduitPrix("");
    setNewProduitCategorie("");
    setAddProduitSuccess("");
    setAddProduitError("");
  };

  const openAddProduit = (initialNom = "") => {
    setShowAddProduit(true);
    setNewProduitNom(initialNom);
  };

  return {
    // States
    showAddProduit,
    newProduitNom,
    newProduitPrix,
    newProduitCategorie,
    addProduitError,
    addProduitSuccess,
    categories,
    
    // Setters
    setNewProduitNom,
    setNewProduitPrix,
    setNewProduitCategorie,
    
    // Actions
    handleCreateProduit,
    resetForm,
    openAddProduit,
    closeAddProduit: () => setShowAddProduit(false)
  };
}
