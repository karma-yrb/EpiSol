import React, { useEffect, useState } from 'react';
import './Achats.css';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import AchatDetailsModal from './AchatDetailsModal';
import ActionIconButton from '../commun/ActionIconButton';
import { fetchAchats, deleteAchat, fetchAchatDetails } from '../../api/achatsHistoriqueApi';

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

  useEffect(() => {
    fetchAchats()
      .then(data => setAchats(data))
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
      await deleteAchat(deleteId);
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
    setDetailsId(id);
    setDetailsLoading(true);
    setDetails(null);
    try {
      const data = await fetchAchatDetails(id);
      setDetails(data);
    } catch {
      setDetails(null);
    }
    setDetailsLoading(false);
  };

  // Fonction utilitaire pour formater la date jj/mm/aaaa
  function formatDateShort(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const jour = d.getDate().toString().padStart(2,'0');
    const mois = (d.getMonth()+1).toString().padStart(2,'0');
    const annee = d.getFullYear();
    return `${jour}/${mois}/${annee}`;
  }

  // Fonction de tri
  const achatsTries = [...achats].sort((a, b) => {
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
      <h1 className="page-title"><i className="fa fa-list-alt icon-blue icon-lg mr-8"></i>Historique des achats</h1>
      {notif.message && (
        <div className={`notification ${notif.type}`}>{notif.message}</div>
      )}
      {loading ? (
        <div className="loading centered-text"><i className="fa fa-spinner fa-spin"></i> Chargement...</div>
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
        </div>
        <table className="produits-table achats-list-table">
          <thead>
            <tr>
              <th className="sortable-col" onClick={() => handleSort('date_achat')}>
                Date
                {sortCol === 'date_achat' && (
                  <i className={`fa fa-caret-${sortDir === 'asc' ? 'up' : 'down'} icon-sm ml-4`}></i>
                )}
              </th>
              <th className="sortable-col" onClick={() => handleSort('beneficiaire')}>
                Bénéficiaire
                {sortCol === 'beneficiaire' && (
                  <i className={`fa fa-caret-${sortDir === 'asc' ? 'up' : 'down'} icon-sm ml-4`}></i>
                )}
              </th>
              <th>Quantité</th>
              <th className="sortable-col" onClick={() => handleSort('total')}>
                Total (€)
                {sortCol === 'total' && (
                  <i className={`fa fa-caret-${sortDir === 'asc' ? 'up' : 'down'} icon-sm ml-4`}></i>
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
                  <ActionIconButton
                    type="view"
                    title="Détails"
                    onClick={() => handleDetails(a.id)}
                    style={{ marginRight: 4 }}
                  />
                  <ActionIconButton
                    type="delete"
                    title="Supprimer"
                    onClick={() => handleDelete(a.id)}
                  />
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
          icon={<i className="fa fa-exclamation-triangle icon-red icon-action mr-8"></i>}
        />
      )}
      {/* Modal de détails */}
      <AchatDetailsModal
        show={!!detailsId}
        details={details}
        loading={detailsLoading}
        onClose={() => setDetailsId(null)}
      />
    </div>
  );
}

export default ListeAchats;
