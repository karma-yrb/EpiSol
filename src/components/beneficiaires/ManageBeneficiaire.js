import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../commun/UniForm.css';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import { fetchBeneficiaires, deleteBeneficiaire } from '../../api/beneficiairesApi';
import { fetchAchats } from '../../api/achatsApi';
import ActionIconButton from '../commun/ActionIconButton';
import SortableTable from '../commun/SortableTable';
import '../commun/SortableTable.css';
import { postData } from '../../utils/apiUtils';

function ManageBeneficiaire() {
  const [beneficiaires, setBeneficiaires] = useState([]);
  const [achats, setAchats] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [beneficiaireToDelete, setBeneficiaireToDelete] = useState(null);
  const [notif, setNotif] = useState({ type: '', message: '' });
  const [deleteStatus, setDeleteStatus] = useState('idle');
  const [deleteMsg, setDeleteMsg] = useState('');
  const navigate = useNavigate();

  // Adjust role validation to allow both 'admin' and 'user'
  // Add logging for debugging token validation
  // Add validation to ensure the token is a valid JWT
  // Temporarily allow mock-token for development
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token récupéré :', token);
    if (token === 'mock-token') {
      console.warn('Token fictif détecté, validation ignorée pour le développement.');
    } else if (token) {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Token mal formé :', token);
        navigate('/access-denied');
        return;
      }

      try {
        const payload = JSON.parse(atob(parts[1]));
        console.log('Payload décodé :', payload);
        const isExpired = payload.exp * 1000 < Date.now();
        console.log('Token expiré :', isExpired);
        if (isExpired) {
          throw new Error('Token expiré');
        }
        if (payload.role !== 'admin' && payload.role !== 'user') {
          throw new Error('Accès refusé : rôle non autorisé');
        }
      } catch (error) {
        console.error('Erreur lors de la validation du token :', error);
        navigate('/access-denied');
        return;
      }
    } else {
      console.warn('Aucun token trouvé, redirection vers /access-denied');
      navigate('/access-denied');
      return;
    }

    fetchBeneficiaires()
      .then((data) => setBeneficiaires(data))
      .catch((error) => console.error('Erreur lors de la récupération des bénéficiaires :', error));
    fetchAchats()
      .then((data) => setAchats(data))
      .catch((error) => console.error('Erreur lors de la récupération des achats :', error));
  }, [navigate]);

  const confirmDelete = async () => {
    setDeleteStatus('loading');
    setDeleteMsg('');
    try {
      await deleteBeneficiaire(beneficiaireToDelete);
      setBeneficiaires(beneficiaires.filter(b => b.id !== beneficiaireToDelete));
      setDeleteStatus('success');
      setDeleteMsg('Bénéficiaire supprimé.');
    } catch {
      setDeleteStatus('error');
      setDeleteMsg('Erreur lors de la suppression.');
    }
  };

  useEffect(() => {
    if (deleteStatus === 'success' || deleteStatus === 'error') {
      const timer = setTimeout(() => {
        setShowDeleteModal(false);
        setBeneficiaireToDelete(null);
        setDeleteStatus('idle');
        setDeleteMsg('');
        if (deleteStatus === 'success') setNotif({ type: 'success', message: 'Bénéficiaire supprimé.' });
        if (deleteStatus === 'error') setNotif({ type: 'error', message: deleteMsg });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [deleteStatus, deleteMsg]);

  // Calcul du nombre de passages (achats) par bénéficiaire
  const passagesByBenef = {};
  achats.forEach(a => {
    if (a.beneficiaire_nom && a.beneficiaire_prenom) {
      const key = `${a.beneficiaire_nom}|||${a.beneficiaire_prenom}`;
      passagesByBenef[key] = (passagesByBenef[key] || 0) + 1;
    }
  });

  // Colonnes pour le tableau triable
  const columns = [
    { label: 'Numéro bénéficiaire', key: 'numero', sortable: true },
    { label: 'Nom', key: 'nom', sortable: true },
    { label: 'Prénom', key: 'prenom', sortable: true },
    { label: 'Rabais (%)', key: 'discount', sortable: true, render: row => (row.discount !== undefined ? Math.round(Number(row.discount)) : 50) },
    { label: 'Passages', key: 'passages', sortable: true, render: row => {
      const key = `${row.nom}|||${row.prenom}`;
      const passages = passagesByBenef[key] || 0;
      return (
        <>
          <span className="passages-count">{passages}</span>
          {passages > 0 && (
            <i
              className="fa fa-eye icon-action passages-eye"
              title="Voir les achats de ce bénéficiaire"
              tabIndex={0}
              style={{opacity:1, pointerEvents:'auto', cursor:'pointer', color:'#007bff'}}
              onClick={() => navigate(`/liste-achats?beneficiaireId=${row.id}&beneficiaireNom=${encodeURIComponent(row.nom)}&beneficiairePrenom=${encodeURIComponent(row.prenom)}`)}
            />
          )}
        </>
      );
    } },
    { label: 'Actions', key: 'actions', sortable: false, render: (row) => (
      <div className="actions-cell">
        <Link to={`/beneficiaires/edit/${row.id}`} className="edit-link">
          <ActionIconButton type="edit" title="Éditer" onClick={e => e.stopPropagation()} />
        </Link>
        <ActionIconButton type="delete" title="Supprimer" onClick={() => { setBeneficiaireToDelete(row.id); setShowDeleteModal(true); }} />
      </div>
    ) },
  ];

  return (
    <div className="page-centered-container">
      <h1>
        <i className="fa fa-users icon-blue icon-lg mr-8"></i>
        Gestion des bénéficiaires
      </h1>
      <Link to="/beneficiaires/add">
        <button className="create-button"><i className="fa fa-plus mr-6"></i>Ajouter un bénéficiaire</button>
      </Link>
      <SortableTable
        columns={columns}
        data={beneficiaires}
        initialSort={{ col: 'nom', dir: 'asc' }}
      />
      {notif.message && (
        <div className={`notification ${notif.type}`}>
          <i className={`fa fa-${notif.type==='success'?'check-circle':'exclamation-circle'}`}></i> {notif.message}
        </div>
      )}
      {showDeleteModal && (
        <ConfirmDeleteModal
          show={showDeleteModal}
          onConfirm={confirmDelete}
          onCancel={() => { setShowDeleteModal(false); setBeneficiaireToDelete(null); setDeleteStatus('idle'); setDeleteMsg(''); }}
          status={deleteStatus}
          message={deleteMsg}
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          title="Confirmer la suppression du bénéficiaire ?"
          icon={<i className="fa fa-exclamation-triangle icon-red icon-action mr-8"></i>}
        />
      )}
    </div>
  );
}

export default ManageBeneficiaire;
