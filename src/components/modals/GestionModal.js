import React from 'react';
import './GestionModal.css';
import BaseModal from './BaseModal';

function GestionLink({ icon, label, to, onClose, navigate }) {
  return (
    <button className="gestion-btn" onClick={() => { onClose(); navigate(to); }}>
      <i className={`fa ${icon}`}></i> {label}
    </button>
  );
}

function GestionModal({ show, onClose, navigate }) {
  // Décoder le token pour obtenir le rôle
  let userRole = null;
  const token = localStorage.getItem('token');
  if (token && token !== 'mock-token') {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        userRole = payload.role;
      }
    } catch {}
  }
  return (
    <BaseModal show={show} onClose={onClose} className="gestion-modal-container">
      <div className="gestion-modal-title">Gestion</div>
      <div className="gestion-modal-links">
        {userRole === 'admin' && (
          <GestionLink icon="fa-users" label="Utilisateurs" to="/users" onClose={onClose} navigate={navigate} />
        )}
        <GestionLink icon="fa-address-book" label="Bénéficiaires" to="/beneficiaires" onClose={onClose} navigate={navigate} />
        <GestionLink icon="fa-shopping-basket" label="Produits" to="/produits" onClose={onClose} navigate={navigate} />
        <GestionLink icon="fa-tags" label="Catégories" to="/categories-management" onClose={onClose} navigate={navigate} />
        <GestionLink icon="fa-list-alt" label="Historique des achats" to="/liste-achats" onClose={onClose} navigate={navigate} />
      </div>
      <button className="gestion-modal-close" onClick={onClose}>Fermer</button>
    </BaseModal>
  );
}

export default GestionModal;
