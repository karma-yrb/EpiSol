import { useState, useEffect } from 'react';

/**
 * Hook générique pour gérer les données avec fetch, suppression et notifications
 * @param {string} apiEndpoint - Point de terminaison de l'API
 * @param {Object} options - Options de configuration
 * @param {function} options.fetchFunction - Fonction personnalisée de fetch (optionnel)
 * @param {function} options.deleteFunction - Fonction personnalisée de suppression (optionnel)
 * @param {string} options.successMessage - Message de succès pour suppression
 * @param {string} options.errorMessage - Message d'erreur pour suppression
 * @param {function} options.transformData - Fonction pour transformer les données reçues
 */
export function useGenericData(apiEndpoint, options = {}) {
  const {
    fetchFunction,
    deleteFunction,
    successMessage = 'Élément supprimé avec succès.',
    errorMessage = 'Erreur lors de la suppression.',
    transformData = (data) => Array.isArray(data) ? data : []
  } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notif, setNotif] = useState({ type: '', message: '' });
  const [deleteStatus, setDeleteStatus] = useState('idle');

  // Fonction de fetch des données
  const fetchData = async () => {
    setLoading(true);
    try {
      let result;
      if (fetchFunction) {
        result = await fetchFunction();
      } else {
        const res = await fetch(apiEndpoint);
        if (!res.ok) throw new Error('Erreur lors du chargement');
        result = await res.json();
      }
      setData(transformData(result));
    } catch (error) {
      console.error('[useGenericData] Erreur fetch:', error);
      setData([]);
      setNotif({ type: 'error', message: 'Erreur lors du chargement des données.' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial
  useEffect(() => {
    fetchData();
  }, [apiEndpoint]);

  // Gestion de la suppression
  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteStatus('idle');
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setDeleteStatus('loading');
    try {
      if (deleteFunction) {
        await deleteFunction(deleteId);
      } else {
        const res = await fetch(`${apiEndpoint}/${deleteId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Erreur lors de la suppression');
      }
      
      setData(prevData => prevData.filter(item => item.id !== deleteId));
      setDeleteStatus('success');
      setNotif({ type: 'success', message: successMessage });
      
      setTimeout(() => {
        setShowDeleteModal(false);
        setDeleteId(null);
        setDeleteStatus('idle');
      }, 1200);
    } catch (error) {
      setDeleteStatus('error');
      setNotif({ type: 'error', message: errorMessage });
      
      setTimeout(() => {
        setShowDeleteModal(false);
        setDeleteId(null);
        setDeleteStatus('idle');
      }, 1800);
    }
    
    setTimeout(() => setNotif({ type: '', message: '' }), 2500);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
    setDeleteStatus('idle');
  };

  // Fonction pour ajouter un élément
  const addItem = (newItem) => {
    setData(prevData => [...prevData, newItem]);
  };

  // Fonction pour mettre à jour un élément
  const updateItem = (id, updatedItem) => {
    setData(prevData => prevData.map(item => item.id === id ? updatedItem : item));
  };

  // Fonction pour rafraîchir les données
  const refreshData = () => {
    fetchData();
  };

  return {
    data,
    loading,
    deleteId,
    showDeleteModal,
    notif,
    deleteStatus,
    handleDelete,
    confirmDelete,
    cancelDelete,
    addItem,
    updateItem,
    refreshData,
    setData,
    setNotif
  };
}