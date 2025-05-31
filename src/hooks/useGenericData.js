import { useState, useEffect } from 'react';

/**
 * Hook générique pour gérer les données avec fetch, suppression et notifications
 * @param {Object} config - Configuration de l'API
 * @param {function} config.fetchFunction - Fonction personnalisée de fetch
 * @param {function} config.addFunction - Fonction personnalisée d'ajout
 * @param {function} config.updateFunction - Fonction personnalisée de mise à jour
 * @param {function} config.deleteFunction - Fonction personnalisée de suppression
 * @param {string} config.entityName - Nom de l'entité (singulier)
 * @param {string} config.entityNamePlural - Nom de l'entité (pluriel)
 * @param {function} config.sortFunction - Fonction optionnelle pour trier les données
 */
export function useGenericData(config, options = {}) {
  const {
    fetchFunction,
    addFunction,
    updateFunction,
    deleteFunction,
    entityName = 'élément',
    entityNamePlural = 'éléments',
    sortFunction
  } = config || {};

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
        throw new Error('Fonction de récupération des données non fournie');
      }
      
      // Applique la fonction de tri si elle existe
      const dataToSet = sortFunction ? sortFunction([...result]) : result;
      setData(Array.isArray(dataToSet) ? dataToSet : []);
    } catch (error) {
      console.error('[useGenericData] Erreur fetch:', error);
      setData([]);
      setNotif({ type: 'error', message: `Erreur lors du chargement des ${entityNamePlural}.` });
    } finally {
      setLoading(false);
    }
  };
  // Fetch initial
  useEffect(() => {
    fetchData();
  }, []);

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
        throw new Error('Fonction de suppression non fournie');
      }
      
      setData(prevData => prevData.filter(item => item.id !== deleteId));
      setDeleteStatus('success');
      setNotif({ type: 'success', message: `${entityName} supprimé avec succès.` });
      
      setTimeout(() => {
        setShowDeleteModal(false);
        setDeleteId(null);
        setDeleteStatus('idle');
      }, 1200);
    } catch (error) {
      setDeleteStatus('error');
      setNotif({ type: 'error', message: `Erreur lors de la suppression du ${entityName}.` });
      
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