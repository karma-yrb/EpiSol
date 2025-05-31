import { useEffect, useRef } from 'react';

/**
 * Hook pour gérer les interactions du dropdown de produits et la logique d'état
 */
export function useProductDropdown({
  show,
  selectedProduit,
  setProduitDropdown,
  produitInputRef
}) {
  const justSelectedRef = useRef(false);

  // Ferme le dropdown produit dès qu'un produit est sélectionné
  useEffect(() => {
    if (selectedProduit) {
      setProduitDropdown(false);
      justSelectedRef.current = true;
    }
  }, [selectedProduit, setProduitDropdown]);

  // Gestion fermeture du dropdown produit sur clic en dehors
  useEffect(() => {
    if (!show) return;
    
    function handleClickOutside(e) {
      // Si le champ principal produit ou le mini-modal d'ajout produit contient la cible, ne rien faire
      if (
        (produitInputRef.current && produitInputRef.current.parentNode.contains(e.target)) ||
        (document.getElementById('mini-modal-ajout-produit') && document.getElementById('mini-modal-ajout-produit').contains(e.target))
      ) {
        return;
      }
      setProduitDropdown(false);
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, setProduitDropdown, produitInputRef]);

  return {
    justSelectedRef
  };
}
