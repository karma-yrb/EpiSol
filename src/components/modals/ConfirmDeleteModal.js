import React from 'react';
import '../commun/UniForm.css';
import BaseModal from './BaseModal';
import './ConfirmDeleteModal.css';

function ConfirmDeleteModal({
  show,
  onConfirm,
  onCancel,
  status = 'idle',
  message = '',
  confirmLabel = 'Supprimer',
  cancelLabel = 'Annuler',
  title = 'Confirmer la suppression ?',
  icon = <i className="fa fa-exclamation-triangle icon-action confirm-modal-icon-danger"></i>,
  successColor = 'green',
  errorColor = '#c00',
}) {
  return (
    <BaseModal show={show} onClose={onCancel} className="confirm-modal">
      <div className="confirm-modal-title">{icon}{title}</div>
      <div className="confirm-modal-actions">
        {status === 'idle' && (
          <>
            <button className="delete-button" onClick={onConfirm}>{confirmLabel}</button>
            <button className="cancel-button" onClick={onCancel}>{cancelLabel}</button>
          </>
        )}
        {status === 'loading' && <span>Suppression...</span>}        {(status === 'success' || status === 'error') && (
          <span className={`confirm-modal-status-${status}`}>{message}</span>
        )}
      </div>
    </BaseModal>
  );
}

export default ConfirmDeleteModal;
