import { useState, useEffect, useRef } from 'react';

/**
 * Hook générique pour la recherche avec dropdown et navigation clavier
 * @param {Object} options - Options de configuration
 * @param {function} options.fetchFunction - Fonction pour fetch les données
 * @param {function} options.filterFunction - Fonction pour filtrer les résultats
 * @param {function} options.formatDisplayText - Fonction pour formater le texte affiché
 * @param {number} options.minSearchLength - Longueur minimale pour déclencher la recherche
 * @param {string} options.apiEndpoint - Point de terminaison API (optionnel si fetchFunction fournie)
 */
export function useGenericSearch(options = {}) {
  const {
    fetchFunction,
    filterFunction,
    formatDisplayText = (item) => item.nom || item.name || '',
    minSearchLength = 3,
    apiEndpoint
  } = options;

  const [allItems, setAllItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const searchRef = useRef();

  // Fetch initial des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        let result;
        if (fetchFunction) {
          result = await fetchFunction();
        } else if (apiEndpoint) {
          const res = await fetch(apiEndpoint);
          if (!res.ok) throw new Error('Erreur lors du chargement');
          result = await res.json();
        } else {
          console.warn('[useGenericSearch] Aucune méthode de fetch fournie');
          return;
        }
        setAllItems(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error('[useGenericSearch] Erreur fetch:', error);
        setAllItems([]);
      }
    };

    fetchData();
  }, [apiEndpoint]);

  // Filtrage basé sur la recherche
  useEffect(() => {
    if (searchText.length >= minSearchLength) {
      setLoading(true);
      
      // Si une fonction de recherche via API est fournie
      if (filterFunction && typeof filterFunction === 'function') {
        filterFunction(searchText, allItems)
          .then(results => {
            setFilteredResults(results);
            setShowDropdown(results.length > 0);
            setShowNoResults(results.length === 0);
            setLoading(false);
          })
          .catch(err => {
            console.error('[useGenericSearch] Erreur filtrage:', err);
            setFilteredResults([]);
            setShowDropdown(false);
            setShowNoResults(true);
            setLoading(false);
          });
      } else {
        // Filtrage local par défaut
        const filtered = allItems.filter(item => {
          const searchableText = formatDisplayText(item).toLowerCase();
          return searchableText.includes(searchText.toLowerCase());
        });
        
        setFilteredResults(filtered);
        setShowDropdown(filtered.length > 0);
        setShowNoResults(filtered.length === 0);
        setLoading(false);
      }
    } else {
      setFilteredResults([]);
      setShowDropdown(false);
      setShowNoResults(false);
      setLoading(false);
    }
  }, [searchText, allItems, minSearchLength]);

  // Sélection d'un élément
  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setSearchText(formatDisplayText(item));
    setShowDropdown(false);
    setShowNoResults(false);
    if (searchRef.current) searchRef.current.blur();
  };

  // Navigation clavier
  const handleKeyDown = (e) => {
    if (!showDropdown || filteredResults.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted(h => Math.min(h + 1, filteredResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted(h => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault();
      handleSelectItem(filteredResults[highlighted]);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setShowNoResults(false);
    }
  };

  // Gestion du clic extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.parentNode.contains(e.target)) {
        setShowDropdown(false);
        setShowNoResults(false);
      }
    };

    const handleBlur = () => {
      setTimeout(() => {
        setShowDropdown(false);
        setShowNoResults(false);
      }, 120);
    };

    if (searchRef.current) {
      searchRef.current.addEventListener('blur', handleBlur);
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (searchRef.current) {
        searchRef.current.removeEventListener('blur', handleBlur);
      }
    };
  }, []);

  // Reset de la recherche
  const resetSearch = () => {
    setSearchText('');
    setSelectedItem(null);
    setFilteredResults([]);
    setShowDropdown(false);
    setShowNoResults(false);
    setHighlighted(-1);
  };

  return {
    allItems,
    searchText,
    setSearchText,
    filteredResults,
    selectedItem,
    setSelectedItem,
    showDropdown,
    setShowDropdown,
    showNoResults,
    loading,
    highlighted,
    setHighlighted,
    searchRef,
    handleSelectItem,
    handleKeyDown,
    resetSearch
  };
}
