import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../commun/UniForm.css';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import { fetchBeneficiaires, deleteBeneficiaire } from '../../api/beneficiairesApi';
import ActionIconButton from '../commun/ActionIconButton';

function ManageBeneficiaire() {
  const [beneficiaires, setBeneficiaires] = useState([]);
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

  return (
    <div className="page-centered-container">
      <h1>
        <i className="fa fa-users icon-blue icon-lg mr-8"></i>
        Gestion des bénéficiaires
      </h1>
      <Link to="/beneficiaires/add">
        <button className="create-button"><i className="fa fa-plus mr-6"></i>Ajouter un bénéficiaire</button>
      </Link>
      <table className="produits-table">
        <thead>
          <tr><th>Nom</th><th>Prénom</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {beneficiaires.map(ben => (
            <tr key={ben.id}>
              <td>{ben.nom}</td>
              <td>{ben.prenom}</td>
              <td className="actions-cell">
                <Link to={`/beneficiaires/edit/${ben.id}`} className="edit-link">
                  <ActionIconButton type="edit" title="Éditer" onClick={e => e.stopPropagation()} />
                </Link>
                <ActionIconButton type="delete" title="Supprimer" onClick={() => { setBeneficiaireToDelete(ben.id); setShowDeleteModal(true); }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
