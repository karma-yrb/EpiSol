import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Achats.css';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import AchatDetailsModal from './AchatDetailsModal';
import { getApiUrl } from '../../utils/apiUtils';
import ActionIconButton from '../commun/ActionIconButton';

function ListeAchats() {
  const [achats, setAchats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notif, setNotif] = useState({ type: '', message: '' });
  const [detailsId, setDetailsId] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [search, setSearch] = useState('');
  const [sortCol, setSortCol] = useState('date_achat');
  const [sortDir, setSortDir] = useState('desc'); // 'asc' | 'desc'

  // Ajout : lecture du paramètre d’URL 'beneficiaire'
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const benef = params.get('beneficiaire');
    if (benef && benef.length > 0) {
      setSearch(benef.trim());
    }
  }, [location.search]);

  useEffect(() => {
    fetch(getApiUrl('/api/achats'))
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          console.log('[ListeAchats] ids reçus du backend:', data.map(a => a.id)); // LOG DEBUG
        }
        setAchats(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteStatus('idle');
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setDeleteStatus('loading');
    try {
      const res = await fetch(`/api/achats/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setAchats(list => list.filter(a => a.id !== deleteId));
      setDeleteStatus('success');
      setNotif({ type: 'success', message: 'Achat supprimé.' });
      setTimeout(() => {
        setShowDeleteModal(false);
        setDeleteId(null);
        setDeleteStatus('idle');
      }, 1200);
    } catch {
      setDeleteStatus('error');
      setNotif({ type: 'error', message: 'Erreur lors de la suppression.' });
      setTimeout(() => {
        setShowDeleteModal(false);
        setDeleteId(null);
        setDeleteStatus('idle');
      }, 1800);
    }
    setTimeout(() => setNotif({ type: '', message: '' }), 2500);
  };

  const handleDetails = async (id) => {
    console.log('[ListeAchats] handleDetails - id envoyé au backend:', id); // LOG DEBUG
    setDetailsId(id);
    setDetailsLoading(true);
    setDetails(null);
    try {
      const res = await fetch(getApiUrl(`/api/achats/${id}`));
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDetails(data);
    } catch {
      setDetails(null);
    }
    setDetailsLoading(false);
  };

  // Fonction utilitaire pour formater la date jj mmm aaaa (une seule ligne)
  function formatDateShort(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const jour = d.getDate().toString().padStart(2, '0');
    const mois = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
    const moisStr = mois[d.getMonth()];
    const annee = d.getFullYear();
    return `${jour} ${moisStr} ${annee}`;
  }

  // Lecture du paramètre d’URL 'beneficiaireId' (id numérique)
  const params = new URLSearchParams(location.search);
  const beneficiaireId = params.get('beneficiaireId');

  // Pré-remplissage du champ recherche avec le nom/prénom si beneficiaireId présent
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

  // Ajout du bouton pour supprimer les filtres
  const handleClearFilters = () => {
    setSearch('');
    navigate('/liste-achats');
  };

  // Ajout : filtrage selon l’id bénéficiaire OU la recherche texte
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

  // Fonction de tri
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

  return (
    <div className="page-centered-container">
      <h1 className="page-title"><i className="fa fa-list-alt" style={{color:'#007bff',fontSize:28,marginRight:8}}></i>Historique des achats</h1>
      {notif.message && (
        <div className={`notification ${notif.type}`}>{notif.message}</div>
      )}
      {loading ? (
        <div className="loading"><i className="fa fa-spinner fa-spin"></i> Chargement...</div>
      ) : (
        <>
        <div className="achats-list-search-row">
          <input
            type="text"
            placeholder="Recherche globale..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="achats-list-search-input"
          />
          {(beneficiaireId || (search && search.trim().length > 0)) && (
            <button
              className="clear-filters-btn"
              onClick={handleClearFilters}
              type="button"
            >
              <i className="fa fa-times-circle" aria-hidden="true"></i>
              <span className="clear-filters-label">Supprimer les filtres</span>
            </button>
          )}
        </div>
        <table className="produits-table achats-list-table">
          <thead>
            <tr>
              <th style={{cursor:'pointer'}} onClick={() => handleSort('date_achat')}>
                Date
                {sortCol === 'date_achat' && (
                  <i className={`fa fa-caret-${sortDir === 'asc' ? 'up' : 'down'}`} style={{marginLeft:4}}></i>
                )}
              </th>
              <th style={{cursor:'pointer'}} onClick={() => handleSort('beneficiaire')}>
                Bénéficiaire
                {sortCol === 'beneficiaire' && (
                  <i className={`fa fa-caret-${sortDir === 'asc' ? 'up' : 'down'}`} style={{marginLeft:4}}></i>
                )}
              </th>
              <th>Quantité</th>
              <th style={{cursor:'pointer'}} onClick={() => handleSort('total')}>
                Total (€)
                {sortCol === 'total' && (
                  <i className={`fa fa-caret-${sortDir === 'asc' ? 'up' : 'down'}`} style={{marginLeft:4}}></i>
                )}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {achatsTries.map(a => (
              <tr key={a.id}>
                <td>{a.date_achat ? formatDateShort(a.date_achat) : ''}</td>
                <td>{a.beneficiaire_nom} {a.beneficiaire_prenom}</td>
                <td>{Array.isArray(a.lignes) ? a.lignes.reduce((sum, l) => sum + (l.quantite || 0), 0) : (typeof a.quantite === 'number' ? a.quantite : '')}</td>
                <td>{Number(a.total).toFixed(2)}</td>
                <td>
                  <div className="actions-cell">
                    <ActionIconButton type="view" title="Détails" onClick={() => handleDetails(a.id)} />
                    <ActionIconButton type="delete" title="Supprimer" onClick={() => handleDelete(a.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </>
      )}
      {showDeleteModal && (
        <ConfirmDeleteModal
          show={showDeleteModal}
          onConfirm={confirmDelete}
          onCancel={() => { setShowDeleteModal(false); setDeleteId(null); setDeleteStatus('idle'); }}
          status={deleteStatus}
          message={deleteStatus === 'error' ? "Erreur lors de la suppression." : deleteStatus === 'success' ? "Achat supprimé." : "Confirmer la suppression de cet achat ?"}
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          title="Supprimer l'achat ?"
          icon={<i className="fa fa-exclamation-triangle" style={{color:'#c00',marginRight:8}}></i>}
        />
      )}
      {/* Modal de détails */}
      <AchatDetailsModal
        show={!!detailsId}
        details={details}
        loading={detailsLoading}
        onClose={() => setDetailsId(null)}
      />
      {/* Message de développement */}
      <div className="achats-info">
        <i className="fa fa-info-circle"></i>
        Cette section est en cours de développement.
      </div>
    </div>
  );
}

export default ListeAchats;
