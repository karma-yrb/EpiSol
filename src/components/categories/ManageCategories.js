import React, { useState } from 'react';
import '../commun/UniForm.css';
import '../commun/UnifiedTable.css';
import './ManageCategories.css';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import CategoryAddForm from './CategoryAddForm';
import SortableTable from '../commun/SortableTable';
import '../commun/SortableTable.css';
import ActionIconButton from '../commun/ActionIconButton';
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
  } = useGenericData(apiConfig);  // Fonction pour ajouter une catégorie
  const handleAdd = async () => {
    if (!newCat.trim()) {
      setNotif({ type: 'error', message: 'Le nom de la catégorie ne peut pas être vide.' });
      return;
    }
    
    try {
      const newCategory = await addCategory(newCat);
      addItem(newCategory);
      setNewCat('');
      setNotif({ type: 'success', message: 'Catégorie ajoutée avec succès.' });
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      setNotif({ type: 'error', message: 'Erreur lors de l\'ajout de la catégorie.' });
    }
  };
  // Colonnes pour le tableau triable
  const columns = [
    { label: 'Nom', key: 'nom', sortable: true, render: (row) => (
      editId === row.id ? (
        <form className="category-row-form-row" onSubmit={e => {e.preventDefault(); handleSaveEdit(row.id);}}>
          <input value={editValue} onChange={e => setEditValue(e.target.value)} className="category-row-input" autoFocus />
        </form>
      ) : (
        String(row.nom || '')
      )
    ) },
    { label: 'Actions', key: 'actions', sortable: false, render: (row) => (
      <div className="actions-cell">
        {editId === row.id ? (
          <>
            <ActionIconButton type="save" title="Enregistrer" onClick={() => handleSaveEdit(row.id)} />
            <ActionIconButton type="custom" icon="fa-times" title="Annuler" onClick={() => handleCancelEdit()} />
            <ActionIconButton type="delete" title="Supprimer" onClick={() => handleDelete(row.id)} />
          </>
        ) : (
          <>
            <ActionIconButton type="edit" title="Éditer" onClick={() => handleEdit(row.id, row.nom)} />
            <ActionIconButton type="delete" title="Supprimer" onClick={() => handleDelete(row.id)} />
          </>
        )}
      </div>
    ) },
  ];return (
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
          onCancel={handleCancelEdit}        />
      )}
        {/* Notifications */}
      {notif.message && (
        <div className={`notification ${notif.type}`}>
          <i className={`fa fa-${notif.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i> 
          {notif.message}
        </div>
      )}

      {loading ? (
        <div className="loading centered-text">
          <i className="fa fa-spinner fa-spin"></i> Chargement...
        </div>
      ) : error ? (
        <div className="error-message">
          <i className="fa fa-exclamation-triangle"></i> {error}
        </div>
      ) : (
        <SortableTable
          columns={columns}
          data={categories}
        />
      )}
      {/* Modal de confirmation de suppression */}
      <ConfirmDeleteModal
        show={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        status={deleteStatus}
        message={deleteStatus === 'success' ? 'Catégorie supprimée avec succès.' : deleteStatus === 'error' ? 'Erreur lors de la suppression de la catégorie.' : ''}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        title="Confirmer la suppression de la catégorie ?"
        icon={<i className="fa fa-exclamation-triangle icon-red mr-8"></i>}
      />
    </div>
  );
}

export default ManageCategories;
