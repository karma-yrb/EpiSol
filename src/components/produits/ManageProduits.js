import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../commun/UniForm.css';
import '../commun/UnifiedTable.css';
import './ManageProduits.css';
import ActionIconButton from '../commun/ActionIconButton';
import SortableTable from '../commun/SortableTable';
import '../commun/SortableTable.css';
import { useProduitsData } from '../../hooks/useProduitsData';
import { useProduitsForm } from '../../hooks/useProduitsForm';
import { useGenericDeleteModal } from '../../hooks/useGenericDeleteModal';
import GenericSearchBar from '../commun/GenericSearchBar';
import UnifiedProductModal from './UnifiedProductModal';

function ManageProduits() {  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Custom hooks
  const {
    produits,
    categories,
    loading,
    notif,
    addNewProduit,
    updateExistingProduit,
    deleteExistingProduit
  } = useProduitsData();

  const {
    showForm,
    formMode,
    formData,
    formError,
    handleAdd,
    handleEdit,
    handleFormChange,
    handleFormSubmit,
    handleFormClose
  } = useProduitsForm(categories, async (mode, editId, data) => {
    if (mode === 'add') {
      await addNewProduit(data);
    } else {
      await updateExistingProduit(editId, data);
    }
  });  const {
    showDeleteModal,
    deleteStatus,
    deleteMsg,
    handleDelete,
    confirmDelete,
    cancelDelete,
    ModalComponent
  } = useGenericDeleteModal({
    deleteFunction: deleteExistingProduit,
    successMessage: 'Produit supprimé avec succès.',
    errorMessage: 'Erreur lors de la suppression du produit.',
    successDelay: 1000,
    errorDelay: 1800
  });

  // Helper functions
  const handleEditProduit = (id) => {
    const prod = produits.find(p => p.id === id);
    if (prod) {
      handleEdit(prod);
    }
  };

  // Filtrage et recherche
  const produitsFiltres = produits.filter(p => {
    const matchSearch = search ? 
      (p.nom.toLowerCase().includes(search.toLowerCase()) || 
       (p.categorie && p.categorie.toLowerCase().includes(search.toLowerCase()))) : 
      true;
    return matchSearch;
  });

  // Colonnes pour le tableau triable
  const columns = [
    { label: 'Nom', key: 'nom', sortable: true },
    { label: 'Catégorie', key: 'categorie', sortable: true },
    { label: 'Prix (€)', key: 'prix', sortable: true, render: row => Number(row.prix).toFixed(2) },
    { label: 'Actions', key: 'actions', sortable: false, render: (row) => (
      <div style={{display:'flex',flexDirection:'row',alignItems:'center',gap:8,justifyContent:'center'}}>
        <ActionIconButton type="edit" title="Éditer" onClick={() => handleEditProduit(row.id)} />
        <ActionIconButton type="delete" title="Supprimer" onClick={() => handleDelete(row.id)} />
      </div>
    ) },
  ];
  return (
    <div className="page-centered-container" data-page="manage-produits">
      <h1 className="page-title">
        <i className="fa fa-shopping-basket icon-blue icon-lg mr-8"></i>
        Gestion des produits
      </h1>      <div className="page-header-bar"></div>
      
      <GenericSearchBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Recherche par nom ou catégorie..."
        className="produits-filtres"
        actions={[
          {
            onClick: handleAdd,
            className: "add-produit-btn",
            title: "Ajouter un produit",
            icon: "fa fa-plus mr-6",
            label: "Ajouter un produit"
          },
          {
            onClick: () => navigate('/categories-management'),
            className: "produits-categories-btn special",
            icon: "fa fa-tags mr-6",
            label: "Gérer les catégories"
          }
        ]}
      />

      {/* Notifications */}
      {notif.message && (
        <div className={`notification ${notif.type}`}>
          <i className={`fa fa-${notif.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i> 
          {notif.message}
        </div>
      )}      <UnifiedProductModal
        show={showForm}
        mode={formMode}
        formData={formData}
        formError={formError}
        categories={categories}
        onSubmit={handleFormSubmit}
        onChange={handleFormChange}
        onClose={handleFormClose}
        loading={loading}
      />      <ModalComponent />

      {loading ? (
        <div className="loading centered-text">
          <i className="fa fa-spinner fa-spin"></i> Chargement...
        </div>
      ) : (
        <SortableTable
          columns={columns}
          data={produitsFiltres}
          initialSort={{ col: 'nom', dir: 'asc' }}
        />
      )}
    </div>
  );
}

export default ManageProduits;
