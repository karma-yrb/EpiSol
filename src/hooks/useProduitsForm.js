import { useState } from 'react';

export const useProduitsForm = (categories, onSubmit) => {
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [formData, setFormData] = useState({ nom: '', categorie_id: '', prix: '' });
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState('');

  const handleAdd = () => {
    setFormMode('add');
    setFormData({ nom: '', categorie_id: '', prix: '' });
    setFormError('');
    setShowForm(true);
    setEditId(null);
  };

  const handleEdit = (produit) => {
    setFormMode('edit');
    setFormData({ 
      nom: produit.nom, 
      categorie_id: produit.categorie_id || '', 
      prix: produit.prix 
    });
    setFormError('');
    setShowForm(true);
    setEditId(produit.id);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
    setFormError(''); // Clear error when user types
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!formData.nom || !formData.categorie_id || formData.prix === '') {
      setFormError('Tous les champs sont requis.');
      return;
    }
    
    if (isNaN(Number(formData.prix)) || Number(formData.prix) < 0) {
      setFormError('Le prix doit être un nombre positif.');
      return;
    }

    try {
      await onSubmit(formMode, editId, formData);
      setShowForm(false);
      setFormError('');
    } catch (error) {
      setFormError('Erreur lors de l\'enregistrement du produit.');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setFormError('');
  };

  return {
    showForm,
    formMode,
    formData,
    formError,
    handleAdd,
    handleEdit,
    handleFormChange,
    handleFormSubmit,
    handleFormClose
  };
};
