import React from 'react';
import '../commun/UniForm.css';
import BaseModal from './BaseModal';

function ConfirmDeleteModal({
  show,
  onConfirm,
  onCancel,
  status = 'idle',
  message = '',
  confirmLabel = 'Supprimer',
  cancelLabel = 'Annuler',
  title = 'Confirmer la suppression ?',
  icon = <i className="fa fa-exclamation-triangle" style={{color:'#c00',marginRight:8}}></i>,
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
        {status === 'loading' && <span>Suppression...</span>}
        {(status === 'success' || status === 'error') && (
          <span style={{color: status==='success' ? successColor : errorColor}}>{message}</span>
        )}
      </div>
    </BaseModal>
  );
}

export default ConfirmDeleteModal;
