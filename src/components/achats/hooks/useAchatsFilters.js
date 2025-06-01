import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Hook personnalisé pour gérer la recherche et les filtres
 */
export function useAchatsFilters(achats) {
  const [search, setSearch] = useState('');
  const [sortCol, setSortCol] = useState('date_achat');
  const [sortDir, setSortDir] = useState('desc');
  
  const location = useLocation();
  const navigate = useNavigate();

  // Lecture des paramètres d'URL
  const params = new URLSearchParams(location.search);
  const beneficiaireId = params.get('beneficiaireId');

  // Pré-remplissage du champ recherche depuis les paramètres d'URL
  useEffect(() => {
    const benef = params.get('beneficiaire');
    if (benef && benef.length > 0) {
      setSearch(benef.trim());
    }
  }, [location.search]);

  // Pré-remplissage avec le nom/prénom si beneficiaireId présent
  useEffect(() => {
    if (beneficiaireId && achats && achats.length > 0) {
      const achat = achats.find(a => String(a.beneficiaire_id) === String(beneficiaireId));
      if (achat) {
        setSearch(s => s || `${achat.beneficiaire_nom} ${achat.beneficiaire_prenom}`.trim());
        return;
      }
    }
    const nom = params.get('beneficiaireNom');
    const prenom = params.get('beneficiairePrenom');
    if (beneficiaireId && (nom || prenom)) {
      setSearch(s => s || `${nom || ''} ${prenom || ''}`.trim());
    }
  }, [beneficiaireId, achats, params]);

  // Fonction pour supprimer les filtres
  const handleClearFilters = () => {
    setSearch('');
    navigate('/liste-achats', { replace: false });
  };

  // Filtrage des achats
  const achatsArray = Array.isArray(achats) ? achats : [];
  const achatsFiltres = achatsArray.filter(a => {
    if (search && search.length > 0) {
      const nomComplet = `${a.beneficiaire_nom} ${a.beneficiaire_prenom}`.toLowerCase();
      return nomComplet.includes(search.toLowerCase()) ||
        (a.beneficiaire_nom && a.beneficiaire_nom.toLowerCase().includes(search.toLowerCase())) ||
        (a.beneficiaire_prenom && a.beneficiaire_prenom.toLowerCase().includes(search.toLowerCase()));
    }
    if (beneficiaireId) {
      return String(a.beneficiaire_id) === String(beneficiaireId);
    }
    return true;
  });

  // Tri des achats
  const achatsTries = [...achatsFiltres].sort((a, b) => {
    let vA, vB;
    if (sortCol === 'date_achat') {
      vA = a.date_achat || '';
      vB = b.date_achat || '';
    } else if (sortCol === 'beneficiaire') {
      vA = `${a.beneficiaire_nom} ${a.beneficiaire_prenom}`.toLowerCase();
      vB = `${b.beneficiaire_nom} ${b.beneficiaire_prenom}`.toLowerCase();
    } else if (sortCol === 'total') {
      vA = Number(a.total);
      vB = Number(b.total);
    }
    if (vA < vB) return sortDir === 'asc' ? -1 : 1;
    if (vA > vB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  // Gestion du clic sur l'en-tête pour trier
  const handleSort = col => {
    if (sortCol === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  return {
    search,
    setSearch,
    sortCol,
    sortDir,
    beneficiaireId,
    achatsTries,
    handleClearFilters,
    handleSort
  };
}
