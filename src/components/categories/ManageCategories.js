import React, { useState } from 'react';
import '../commun/UniForm.css';
import './ManageCategories.css';
import CategoryAddForm from './CategoryAddForm';
import CategoryTable from './CategoryTable';
import { useGenericData } from '../../hooks/useGenericData';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../../api/categoriesApi';

function ManageCategories() {
  const [newCat, setNewCat] = useState('');
  
  const apiConfig = {
    fetchFunction: fetchCategories,
    addFunction: addCategory,
    updateFunction: updateCategory,
    deleteFunction: deleteCategory,
    entityName: 'catégorie',
    entityNamePlural: 'catégories',
    sortFunction: (items) => items.sort((a, b) => a.nom.localeCompare(b.nom, 'fr', { sensitivity: 'base' }))
  };  const {
    data: categories,
    notif,
    loading,
    error,
    setNotif,
    addItem,
    editId,
    editValue,
    setEditValue,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
    showDeleteModal,
    confirmDelete,
    cancelDelete,
    deleteStatus
  } = useGenericData(apiConfig);

  // Fonction pour ajouter une catégorie
  const handleAdd = async () => {
    if (!newCat.trim()) {
      setNotif({ type: 'error', message: 'Le nom de la catégorie ne peut pas être vide.' });
      return;
    }
    
    try {
      const newCategory = await addCategory({ nom: newCat });
      addItem(newCategory);
      setNewCat('');
      setNotif({ type: 'success', message: 'Catégorie ajoutée avec succès.' });
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      setNotif({ type: 'error', message: 'Erreur lors de l\'ajout de la catégorie.' });
    }
  };  return (
    <div className="page-centered-container" data-page="categories">
      <h1>
        <i className="fa fa-tags icon-blue icon-lg mr-8"></i>
        Gestion des catégories
      </h1>
      {editId !== 'add' && (
        <button className="create-button" onClick={() => handleEdit('add')}><i className="fa fa-plus mr-6"></i>Ajouter une catégorie</button>
      )}
      {editId === 'add' && (
        <CategoryAddForm
          newCat={newCat}
          setNewCat={setNewCat}
          onAdd={(e) => { handleAdd(e); handleCancelEdit(); }}
          onCancel={handleCancelEdit}
        />
      )}      <CategoryTable
        categories={categories}
        editId={editId}
        editValue={editValue}
        setEditValue={setEditValue}
        handleEdit={handleEdit}
        handleEditSubmit={handleSaveEdit}
        setEditId={handleCancelEdit}
        handleDelete={handleDelete}
      />
      
      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmer la suppression</h3>
            <p>Êtes-vous sûr de vouloir supprimer cette catégorie ?</p>
            <div className="modal-buttons">
              <button 
                className="btn btn-secondary" 
                onClick={cancelDelete}
                disabled={deleteStatus === 'loading'}
              >
                Annuler
              </button>
              <button 
                className="btn btn-danger" 
                onClick={confirmDelete}
                disabled={deleteStatus === 'loading'}
              >
                {deleteStatus === 'loading' ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
            {deleteStatus === 'success' && (
              <p className="success-message">Suppression réussie !</p>
            )}
            {deleteStatus === 'error' && (
              <p className="error-message">Erreur lors de la suppression</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageCategories;
