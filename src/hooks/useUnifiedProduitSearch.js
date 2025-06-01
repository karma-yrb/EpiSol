import { useGenericSearch } from './useGenericSearch';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

/**
 * Hook unifié pour la recherche de produits basé sur useGenericSearch
 * @returns {Object} Tous les états et handlers nécessaires à la recherche produit
 */
export function useUnifiedProduitSearch() {
  // Fonction de recherche spécialisée pour les produits (recherche via API)
  const searchProductsApi = async (searchText) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/produits?search=${encodeURIComponent(searchText)}`);
      if (!response.ok) throw new Error('Erreur lors de la recherche');
      return await response.json();
    } catch (error) {
      console.error('[useUnifiedProduitSearch] Erreur recherche produits:', error);
      return [];
    }
  };

  const searchHook = useGenericSearch({
    filterFunction: searchProductsApi,
    formatDisplayText: (produit) => produit.nom,
    minSearchLength: 3
  });

  // Mapping des propriétés pour maintenir la compatibilité
  return {
    // États de recherche
    produitSearch: searchHook.searchText,
    setProduitSearch: searchHook.setSearchText,
    produitResults: searchHook.filteredResults,
    setProduitResults: (results) => {
      // Cette fonction est principalement utilisée pour vider les résultats
      if (results.length === 0) {
        searchHook.resetSearch();
      }
    },
    
    // Sélection
    selectedProduit: searchHook.selectedItem,
    setSelectedProduit: searchHook.setSelectedItem,
    
    // États d'affichage
    produitLoading: searchHook.loading,
    setProduitLoading: () => {}, // Géré automatiquement par useGenericSearch
    produitDropdown: searchHook.showDropdown,
    setProduitDropdown: searchHook.setShowDropdown,
    
    // Navigation
    produitInputRef: searchHook.searchRef,
    highlightedProduit: searchHook.highlighted,
    setHighlightedProduit: searchHook.setHighlighted,
    
    // Handlers
    handleSelectProduit: searchHook.handleSelectItem,
    handleProduitKeyDown: searchHook.handleKeyDown,
    resetSearch: searchHook.resetSearch
  };
}
