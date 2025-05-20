import { useState, useEffect, useRef } from 'react';
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

/**
 * Hook personnalisé pour la recherche de bénéficiaires avec dropdown et navigation clavier.
 * @returns {Object} Tous les états et handlers nécessaires à la recherche bénéficiaire.
 */
export function useBeneficiaireSearch() {
  const [beneficiaires, setBeneficiaires] = useState([]);
  const [searchB, setSearchB] = useState('');
  const [filteredB, setFilteredB] = useState([]);
  const [selectedB, setSelectedB] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef();
  const [highlighted, setHighlighted] = useState(-1);

  useEffect(() => {
    fetch(`${API_BASE_URL}/beneficiaires`)
      .then(res => res.json())
      .then(data => setBeneficiaires(data));
  }, []);

  useEffect(() => {
    if (searchB.length >= 3) {
      setFilteredB(
        beneficiaires.filter(b =>
          (`${b.nom} ${b.prenom}`.toLowerCase().includes(searchB.toLowerCase()))
        )
      );
      setShowDropdown(true);
    } else {
      setFilteredB([]);
      setShowDropdown(false);
    }
  }, [searchB, beneficiaires]);

  const handleSelectB = (b) => {
    setSelectedB(b);
    setSearchB(`${b.nom} ${b.prenom}`);
    setShowDropdown(false);
    if (searchRef.current) searchRef.current.blur();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.parentNode.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    const handleBlur = () => {
      setTimeout(() => setShowDropdown(false), 120);
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

  const handleKeyDown = (e) => {
    if (!showDropdown || filteredB.length === 0) return;
    if (e.key === 'ArrowDown') {
      setHighlighted(h => Math.min(h + 1, filteredB.length - 1));
    } else if (e.key === 'ArrowUp') {
      setHighlighted(h => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && highlighted >= 0) {
      handleSelectB(filteredB[highlighted]);
    }
  };

  return {
    beneficiaires,
    searchB,
    setSearchB,
    filteredB,
    selectedB,
    setSelectedB,
    showDropdown,
    setShowDropdown,
    searchRef,
    highlighted,
    setHighlighted,
    handleSelectB,
    handleKeyDown
  };
}
