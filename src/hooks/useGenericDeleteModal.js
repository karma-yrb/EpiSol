import { useState, useEffect } from 'react';
import React from 'react';

/**
 * Hook générique pour gérer les suppressions avec modal de confirmation
 * @param {function} deleteFunction - Fonction de suppression async
 * @param {Object} options - Options de configuration
 * @param {string} options.successMessage - Message de succès personnalisé
 * @param {string} options.errorMessage - Message d'erreur personnalisé
 * @param {number} options.successDelay - Délai avant fermeture après succès (ms)
 * @param {number} options.errorDelay - Délai avant fermeture après erreur (ms)
 */
export const useGenericDeleteModal = (options = {}) => {
  const {
    deleteFunction,
    entityName = 'élément',
    onSuccess,
    successMessage = `${entityName} supprimé avec succès.`,
    errorMessage = `Erreur lors de la suppression du ${entityName}.`,
    successDelay = 1000,
    errorDelay = 1800
  } = options;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState('idle');
  const [deleteMsg, setDeleteMsg] = useState('');

  const handleDelete = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
    setDeleteStatus('idle');
    setDeleteMsg('');
  };
  const confirmDelete = async () => {
    setDeleteStatus('loading');
    setDeleteMsg('');
    try {
      await deleteFunction(itemToDelete);
      setDeleteStatus('success');
      setDeleteMsg(successMessage);
      
      // Appeler le callback onSuccess si fourni
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(itemToDelete);
      }
    } catch (error) {
      setDeleteStatus('error');
      setDeleteMsg(errorMessage);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
    setDeleteStatus('idle');
    setDeleteMsg('');
  };

  useEffect(() => {
    if (deleteStatus === 'success' || deleteStatus === 'error') {
      const delay = deleteStatus === 'success' ? successDelay : errorDelay;
      const timer = setTimeout(() => {
        setShowDeleteModal(false);
        setItemToDelete(null);
        setDeleteStatus('idle');
        setDeleteMsg('');
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [deleteStatus, successDelay, errorDelay]);
  // Définition du composant Modal à retourner
  const ModalComponent = () => {
    if (!showDeleteModal) return null;
    
    return (
      <div className="modal-overlay">
        <div className="modal-content delete-modal">
          <div className="modal-header">
            <h3>
              <i className="fa fa-exclamation-triangle icon-red icon-action mr-8"></i>
              Confirmer la suppression ?
            </h3>
          </div>
          
          <div className="modal-body">
            {deleteStatus === 'loading' && (
              <div className="loading-indicator">
                <i className="fa fa-spinner fa-spin"></i> Suppression en cours...
              </div>
            )}
            {deleteStatus === 'success' && (
              <div className="success-message">
                <i className="fa fa-check-circle"></i> {deleteMsg}
              </div>
            )}
            {deleteStatus === 'error' && (
              <div className="error-message">
                <i className="fa fa-exclamation-circle"></i> {deleteMsg}
              </div>
            )}
            {deleteStatus === 'idle' && (
              <p>Êtes-vous sûr de vouloir supprimer cet {entityName} ?</p>
            )}
          </div>
          
          <div className="modal-footer">
            {deleteStatus === 'idle' && (
              <>
                <button className="cancel-button" onClick={cancelDelete}>Annuler</button>
                <button className="danger-button" onClick={confirmDelete}>Supprimer</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return {
    showModal: showDeleteModal,
    deleteStatus,
    deleteMsg,
    itemToDelete,
    handleDelete,
    confirmDelete,
    cancelDelete,
    setShowModal: setShowDeleteModal,
    setItemToDelete,
    setDeleteStatus,
    ModalComponent
  };
};
