import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../commun/UniForm.css';
import { fetchBeneficiaires, deleteBeneficiaire, addBeneficiaire, updateBeneficiaire } from '../../api/beneficiairesApi';
import { fetchAchats } from '../../api/achatsApi';
import ActionIconButton from '../commun/ActionIconButton';
import SortableTable from '../commun/SortableTable';
import '../commun/SortableTable.css';
import { useGenericDeleteModal } from '../../hooks/useGenericDeleteModal';
import { useGenericData } from '../../hooks/useGenericData';
import './ManageBeneficiaire.css';

function ManageBeneficiaire() {
  const navigate = useNavigate();
  const [achats, setAchats] = useState([]);
  
  // Configuration pour useGenericData
  const apiConfig = {
    fetchFunction: fetchBeneficiaires,
    addFunction: addBeneficiaire,
    updateFunction: updateBeneficiaire,
    deleteFunction: deleteBeneficiaire,
    entityName: 'bénéficiaire',
    entityNamePlural: 'bénéficiaires'
  };
    // Utilisation du hook générique pour les données
  const {
    data: beneficiaires,
    notif,
    loading,
    error
  } = useGenericData(apiConfig);
    // Modal de suppression avec useGenericDeleteModal
  const {
    handleDelete,
    ModalComponent: DeleteModal
  } = useGenericDeleteModal({
    deleteFunction: deleteBeneficiaire,
    entityName: 'bénéficiaire',
    onSuccess: () => {
      // La suppression est gérée par useGenericData
    }
  });
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
    
    // Chargement des achats (les bénéficiaires sont déjà chargés par useGenericData)
    fetchAchats()
      .then((data) => setAchats(data))
      .catch((error) => console.error('Erreur lors de la récupération des achats :', error));
  }, [navigate]);

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
    { label: '#', key: 'numero', sortable: true },
    { label: 'Bénéficiaire', key: 'prenomNom', sortable: true, render: row => `${row.prenom} ${row.nom}` },
    { label: 'Rabais (%)', key: 'discount', sortable: true, render: row => (row.discount !== undefined ? Math.round(Number(row.discount)) : 50) },
    { label: 'Passages', key: 'passages', sortable: true, render: row => {
      const key = `${row.nom}|||${row.prenom}`;
      const passages = passagesByBenef[key] || 0;
      return (
        <>          <span className="passages-count">{passages}</span>
          {passages > 0 && (
            <i
              className="fa fa-eye icon-action passages-eye"
              title="Voir les achats de ce bénéficiaire"
              tabIndex={0}
              role="button"
              onClick={() => navigate(`/liste-achats?beneficiaireId=${row.id}&beneficiaireNom=${encodeURIComponent(row.nom)}&beneficiairePrenom=${encodeURIComponent(row.prenom)}`, { replace: false })}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate(`/liste-achats?beneficiaireId=${row.id}&beneficiaireNom=${encodeURIComponent(row.nom)}&beneficiairePrenom=${encodeURIComponent(row.prenom)}`, { replace: false });
                }
              }}
            />
          )}
        </>
      );
    } },    { label: 'Actions', key: 'actions', sortable: false, render: (row) => (
      <div className="actions-cell">
        <Link to={`/beneficiaires/edit/${row.id}`} className="edit-link">
          <ActionIconButton type="edit" title="Éditer" onClick={e => e.stopPropagation()} />
        </Link>
        <ActionIconButton type="delete" title="Supprimer" onClick={() => handleDelete(row.id)} />
      </div>
    ) },  ];

  // Ajout d'une clé 'prenomNom' et 'passages' pour le tri
  const beneficiairesWithPrenomNom = beneficiaires ? beneficiaires.map(b => {
    const key = `${b.nom}|||${b.prenom}`;
    return {
      ...b,
      prenomNom: `${b.prenom} ${b.nom}`.trim(),
      passages: passagesByBenef[key] || 0
    };
  }) : [];
  return (
    <div className="page-centered-container">
      <h1>
        <i className="fa fa-users icon-blue icon-lg mr-8"></i>
        Gestion des bénéficiaires
      </h1>
      <Link to="/beneficiaires/add">
        <button className="create-button"><i className="fa fa-plus mr-6"></i>Ajouter un bénéficiaire</button>
      </Link>
      
      {loading ? (
        <div className="loading-indicator">
          <i className="fa fa-spinner fa-spin"></i> Chargement des bénéficiaires...
        </div>
      ) : error ? (
        <div className="error-message">
          <i className="fa fa-exclamation-triangle"></i> {error}
        </div>
      ) : (
        <SortableTable
          columns={columns}
          data={beneficiairesWithPrenomNom}
          initialSort={{ col: 'prenomNom', dir: 'asc' }}
        />
      )}
      
      {notif.message && (
        <div className={`notification ${notif.type}`}>
          <i className={`fa fa-${notif.type==='success'?'check-circle':'exclamation-circle'}`}></i> {notif.message}
        </div>
      )}
      <DeleteModal />
    </div>
  );
}

export default ManageBeneficiaire;
