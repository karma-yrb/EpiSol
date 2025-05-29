import React, { useEffect, useState, useContext } from 'react';
import { UserAuthContext } from '../../contexts/UserAuthProvider';
import './Achats.css';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import AchatDetailsModal from './AchatDetailsModal';
import ActionIconButton from '../commun/ActionIconButton';
import SortableTable from '../commun/SortableTable';
import { fetchAchats, deleteAchat, fetchAchatDetails } from '../../api/achatsHistoriqueApi';
import { isAdminFromToken } from '../../utils/auth';

function ListeAchats() {
  const isAdmin = isAdminFromToken();
  // DEBUG
  console.log('[ListeAchats] isAdmin:', isAdmin);

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

  // Colonnes pour le tableau triable
  const columns = [
    {
      label: 'Date',
      key: 'date_achat',
      sortable: true,
      render: row => row.date_achat ? formatDateShort(row.date_achat) : ''
    },
    {
      label: 'Bénéficiaire',
      key: 'beneficiaire',
      sortable: true,
      render: row => `${row.beneficiaire_nom} ${row.beneficiaire_prenom}`
    },
    {
      label: 'Quantité',
      key: 'quantite',
      sortable: true,
      render: row => {
        let val = Array.isArray(row.lignes)
          ? row.lignes.reduce((sum, l) => sum + (l.quantite || 0), 0)
          : (row.quantite ? Number(row.quantite) : '');
        console.log('DEBUG Quantité - row:', row, 'val:', val);
        return val;
      }
    },
    {
      label: 'Total (€)',
      key: 'total',
      sortable: true,
      render: row => Number(row.total).toFixed(2)
    },
    {
      label: 'Actions',
      key: 'actions',
      sortable: false,
      render: row => (
        <>
          <ActionIconButton
            type="view"
            title="Détails"
            onClick={() => handleDetails(row.id)}
            style={{ marginRight: 4 }}
          />
          {isAdmin && (
            <ActionIconButton
              type="delete"
              title="Supprimer"
              onClick={() => handleDelete(row.id)}
            />
          )}
        </>
      )
    }
  ];

  // Filtrage et tri (on garde la logique de recherche et de tri)
  const achatsFiltres = achats.filter(a => {
    if (!search) return true;
    const searchStr = `${a.beneficiaire_nom} ${a.beneficiaire_prenom} ${a.date_achat} ${a.total}`.toLowerCase();
    return searchStr.includes(search.toLowerCase());
  });

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
        <SortableTable
          columns={columns}
          data={achatsFiltres}
          initialSort={{ col: sortCol, dir: sortDir }}
          className="achats-list-table"
        />
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
