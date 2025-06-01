import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://episol-backend.onrender.com' 
  : 'http://localhost:3001';

/**
 * Hook unifié pour la création/édition de produits
 * Remplace useProductCreation et s'intègre avec UnifiedProductModal
 */
export function useUnifiedProductForm(onProductCreated) {
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState('add'); // 'add', 'edit', 'inline'
  const [formData, setFormData] = useState({ nom: '', categorie_id: '', prix: '' });
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  // Récupère les catégories à l'ouverture du modal
  useEffect(() => {
    if (showModal) {
      fetch(`${API_BASE_URL}/api/categories`)
        .then(res => res.json())
        .then(data => setCategories(Array.isArray(data) ? data : []))
        .catch(() => setCategories([]));
    }
  }, [showModal]);

  // Gestion auto-disparition des messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        if (mode === 'inline') {
          // Pour le mode inline, fermer automatiquement après succès
          setTimeout(() => {
            closeModal();
          }, 500);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);

    // Validation
    if (!formData.nom || !formData.categorie_id || formData.prix === '') {
      setFormError('Tous les champs sont requis.');
      setLoading(false);
      return;
    }

    if (isNaN(Number(formData.prix)) || Number(formData.prix) < 0) {
      setFormError('Le prix doit être un nombre positif.');
      setLoading(false);
      return;
    }

    try {
      const url = mode === 'edit' 
        ? `${API_BASE_URL}/api/produits/${editId}`
        : `${API_BASE_URL}/api/produits`;
      
      const method = mode === 'edit' ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: formData.nom,
          prix: Number(formData.prix),
          categorie_id: formData.categorie_id
        })
      });

      if (!res.ok) {
        let errorMsg = `Erreur lors de ${mode === 'edit' ? 'la modification' : 'la création'} du produit (status: ${res.status})`;
        try {
          const errorData = await res.json();
          if (errorData && errorData.error) errorMsg += `: ${errorData.error}`;
        } catch (e) {
          // ignore JSON parse error
        }
        setFormError(errorMsg);
        setLoading(false);
        return;
      }

      const produitResult = await res.json();
      
      setSuccessMessage(
        mode === 'edit' 
          ? 'Produit modifié avec succès !' 
          : 'Produit créé avec succès !'
      );
      
      // Notify parent component
      if (onProductCreated) {
        onProductCreated(produitResult, mode);
      }

      // Reset form for add mode, close for edit mode
      if (mode === 'add' || mode === 'inline') {
        resetForm();
      } else {
        setTimeout(() => {
          closeModal();
        }, 1000);
      }

    } catch (err) {
      setFormError(`Erreur lors de ${mode === 'edit' ? 'la modification' : 'la création'} du produit.`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ nom: '', categorie_id: '', prix: '' });
    setFormError('');
    setSuccessMessage('');
    setEditId(null);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const openAddModal = (modalMode = 'add', initialNom = '') => {
    setMode(modalMode);
    setFormData({ nom: initialNom, categorie_id: '', prix: '' });
    setFormError('');
    setSuccessMessage('');
    setEditId(null);
    setShowModal(true);
  };

  const openEditModal = (produit) => {
    setMode('edit');
    setFormData({
      nom: produit.nom,
      categorie_id: produit.categorie_id,
      prix: produit.prix
    });
    setFormError('');
    setSuccessMessage('');
    setEditId(produit.id);
    setShowModal(true);
  };

  // Mode inline spécifique (pour AchatModal)
  const openInlineCreation = (initialNom = '') => {
    openAddModal('inline', initialNom);
  };

  return {
    // States
    showModal,
    mode,
    formData,
    formError,
    successMessage,
    categories,
    loading,
    
    // Actions
    handleChange,
    handleSubmit,
    closeModal,
    openAddModal,
    openEditModal,
    openInlineCreation,
    resetForm
  };
}
