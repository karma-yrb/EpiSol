import { useState, useEffect, useRef } from 'react';

/**
 * Hook personnalisé pour la recherche de produits avec dropdown et navigation clavier.
 * @returns {Object} Tous les états et handlers nécessaires à la recherche produit.
 */
export function useProduitSearch() {
  const [produitSearch, setProduitSearch] = useState('');
  const [produitResults, setProduitResults] = useState([]);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [produitLoading, setProduitLoading] = useState(false);
  const [produitDropdown, setProduitDropdown] = useState(false);
  const produitInputRef = useRef();
  const [highlightedProduit, setHighlightedProduit] = useState(-1);

  useEffect(() => {
    if (produitSearch.length >= 3) {
      setProduitLoading(true);
      fetch(`/produits?search=${encodeURIComponent(produitSearch)}`)
        .then(res => res.json())
        .then(data => {
          setProduitResults(data);
          setProduitDropdown(true);
        })
        .finally(() => setProduitLoading(false));
    } else {
      setProduitResults([]);
      setProduitDropdown(false);
    }
  }, [produitSearch]);

  const handleSelectProduit = (p) => {
    setSelectedProduit(p);
    setProduitSearch(p.nom);
    setProduitDropdown(false);
    setHighlightedProduit(-1);
    if (produitInputRef.current) produitInputRef.current.blur();
  };

  const handleProduitKeyDown = (e) => {
    if (!produitDropdown || produitResults.length === 0) return;
    if (e.key === 'ArrowDown') {
      setHighlightedProduit(h => Math.min(h + 1, produitResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      setHighlightedProduit(h => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && highlightedProduit >= 0) {
      handleSelectProduit(produitResults[highlightedProduit]);
    }
  };

  return {
    produitSearch,
    setProduitSearch,
    produitResults,
    setProduitResults,
    selectedProduit,
    setSelectedProduit,
    produitLoading,
    setProduitLoading,
    produitDropdown,
    setProduitDropdown,
    produitInputRef,
    highlightedProduit,
    setHighlightedProduit,
    handleSelectProduit,
    handleProduitKeyDown
  };
}
