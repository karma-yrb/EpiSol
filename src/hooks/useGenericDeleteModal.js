import { useState, useEffect } from 'react';

/**
 * Hook générique pour gérer les suppressions avec modal de confirmation
 * @param {function} deleteFunction - Fonction de suppression async
 * @param {Object} options - Options de configuration
 * @param {string} options.successMessage - Message de succès personnalisé
 * @param {string} options.errorMessage - Message d'erreur personnalisé
 * @param {number} options.successDelay - Délai avant fermeture après succès (ms)
 * @param {number} options.errorDelay - Délai avant fermeture après erreur (ms)
 */
export const useGenericDeleteModal = (deleteFunction, options = {}) => {
  const {
    successMessage = 'Élément supprimé avec succès.',
    errorMessage = 'Erreur lors de la suppression.',
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

  return {
    showDeleteModal,
    deleteStatus,
    deleteMsg,
    itemToDelete,
    handleDelete,
    confirmDelete,
    cancelDelete,
    setShowDeleteModal,
    setItemToDelete,
    setDeleteStatus
  };
};
