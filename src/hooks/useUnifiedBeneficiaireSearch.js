import { useGenericSearch } from './useGenericSearch';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

/**
 * Hook unifié pour la recherche de bénéficiaires basé sur useGenericSearch
 * @returns {Object} Tous les états et handlers nécessaires à la recherche bénéficiaire
 */
export function useUnifiedBeneficiaireSearch() {
  const searchHook = useGenericSearch({
    apiEndpoint: `${API_BASE_URL}/api/beneficiaires`,
    formatDisplayText: (beneficiaire) => `${beneficiaire.nom} ${beneficiaire.prenom}`,
    minSearchLength: 3
  });

  // Mapping des propriétés pour maintenir la compatibilité
  return {
    // Données de base
    beneficiaires: searchHook.allItems,
    searchB: searchHook.searchText,
    setSearchB: searchHook.setSearchText,
    filteredB: searchHook.filteredResults,
    selectedB: searchHook.selectedItem,
    setSelectedB: searchHook.setSelectedItem,
    
    // États d'affichage
    showDropdown: searchHook.showDropdown,
    setShowDropdown: searchHook.setShowDropdown,
    showNoResults: searchHook.showNoResults,
    loading: searchHook.loading,
    
    // Navigation
    searchRef: searchHook.searchRef,
    highlighted: searchHook.highlighted,
    setHighlighted: searchHook.setHighlighted,
    
    // Handlers
    handleSelectB: searchHook.handleSelectItem,
    handleKeyDown: searchHook.handleKeyDown,
    resetSearch: searchHook.resetSearch
  };
}
