import { useState, useEffect } from 'react';
import { getApiUrl } from '../utils/apiUtils';

/**
 * Hook personnalisé pour gérer la logique des achats (fetch, delete, details)
 */
export function useAchatsData() {
  const [achats, setAchats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notif, setNotif] = useState({ type: '', message: '' });
  const [detailsId, setDetailsId] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState('idle');  // Fetch initial des achats
  useEffect(() => {
    fetch(getApiUrl('/api/achats'))
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          console.log('[ListeAchats] ids reçus du backend:', data.map(a => a.id));
        }
        setAchats(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteStatus('idle');
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    setDeleteStatus('loading');
    try {
      const res = await fetch(getApiUrl(`/api/achats/${deleteId}`), { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setAchats(list => list.filter(a => a.id !== deleteId));
      setDeleteStatus('success');
      setNotif({ type: 'success', message: 'Achat supprimé.' });
      setTimeout(() => {
        setShowDeleteModal(false);
        setDeleteId(null);
        setDeleteStatus('idle');
      }, 1200);
    } catch {
      setDeleteStatus('error');
      setNotif({ type: 'error', message: 'Erreur lors de la suppression.' });
      setTimeout(() => {
        setShowDeleteModal(false);
        setDeleteId(null);
        setDeleteStatus('idle');
      }, 1800);
    }
    setTimeout(() => setNotif({ type: '', message: '' }), 2500);
  };

  const handleDetails = async (id) => {
    console.log('[ListeAchats] handleDetails - id envoyé au backend:', id);
    setDetailsId(id);
    setDetailsLoading(true);
    setDetails(null);
    try {
      const res = await fetch(getApiUrl(`/api/achats/${id}`));
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDetails(data);
    } catch {
      setDetails(null);
    }
    setDetailsLoading(false);
  };

  return {
    achats,
    loading,
    deleteId,
    showDeleteModal,
    setShowDeleteModal,
    setDeleteId,
    notif,
    detailsId,
    setDetailsId,
    details,
    detailsLoading,
    deleteStatus,
    setDeleteStatus,
    handleDelete,
    confirmDelete,
    handleDetails
  };
}
