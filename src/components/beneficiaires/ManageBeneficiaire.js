import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../commun/UniForm.css';
import { fetchBeneficiaires, addBeneficiaire, updateBeneficiaire } from '../../api/beneficiairesApi';
import { fetchAchats } from '../achats/api/achatsApi';
import ActionIconButton from '../commun/ActionIconButton';
import SortableTable from '../commun/SortableTable';
import '../commun/SortableTable.css';
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
    entityName: 'bénéficiaire',
    entityNamePlural: 'bénéficiaires'
  };    // Utilisation du hook générique pour les données
  const {
    data: beneficiaires,
    notif,
    loading,
    error
  } = useGenericData(apiConfig);
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
    { 
      label: (
        <>
          Rabais
          <br />
          (%)
        </>
      ), 
      key: 'discount', 
      sortable: true, 
      render: row => (row.discount !== undefined ? Math.round(Number(row.discount)) : 50) 
    },    { label: 'Depuis', key: 'depuis', sortable: true, render: row => {
      // Utilisation de la vraie date de création depuis la colonne created_at
      if (row.created_at) {
        const creationDate = new Date(row.created_at);
        
        // Format adaptatif : compact sur mobile ≤395px, normal sinon
        const day = creationDate.getDate().toString().padStart(2, '0');
        const month = (creationDate.getMonth() + 1).toString().padStart(2, '0');
        const year = creationDate.getFullYear().toString().slice(-2);
        
        // Mois en format 3 lettres pour mobile
        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        const monthShort = monthNames[creationDate.getMonth()];
        const fullYear = creationDate.getFullYear();
        
        // Format mobile multi-lignes pour ≤395px
        return (
          <span className="beneficiaire-date">
            <span className="date-desktop">{day}/{month}/{year}</span>
            <span className="date-mobile">
              <div>{day}</div>
              <div>{monthShort}</div>
              <div>{fullYear}</div>
            </span>
          </span>
        );
      }
      return 'N/A';
    } },
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
        </Link>        <Link 
          to={`/achats?beneficiaireId=${row.id}&beneficiaireNom=${encodeURIComponent(row.nom)}&beneficiairePrenom=${encodeURIComponent(row.prenom)}`} 
          className="new-achat-link"
        >
          <ActionIconButton type="cart" title="Enregistrer un nouvel achat" onClick={e => e.stopPropagation()} />
        </Link>
      </div>
    ) },];  // Ajout d'une clé 'prenomNom', 'passages' et 'depuis' pour le tri
  const beneficiairesWithPrenomNom = beneficiaires ? beneficiaires.map(b => {
    const key = `${b.nom}|||${b.prenom}`;
    
    // Utilisation de la vraie date created_at pour le tri
    const creationTimestamp = b.created_at ? new Date(b.created_at).getTime() : 0;
    
    return {
      ...b,
      prenomNom: `${b.prenom} ${b.nom}`.trim(),
      passages: passagesByBenef[key] || 0,
      depuis: creationTimestamp // Timestamp pour le tri
    };
  }) : [];  return (
    <div className="page-centered-container" data-page="manage-beneficiaires">
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
    </div>
  );
}

export default ManageBeneficiaire;
