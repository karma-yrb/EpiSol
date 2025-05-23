import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../commun/UniForm.css';
import './ManageCategories.css';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import CategoryAddForm from './CategoryAddForm';
import SortableTable from '../commun/SortableTable';
import ActionIconButton from '../commun/ActionIconButton';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../../api/categoriesApi';

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [notif, setNotif] = useState({ type: '', message: '' });
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [catToDelete, setCatToDelete] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [deleteMsg, setDeleteMsg] = useState('');

  useEffect(() => {
    fetchCategories()
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    try {
      const data = await addCategory(newCat);
      const newCategories = [...categories, { id: data.id, nom: data.nom }];
      newCategories.sort((a, b) => a.nom.localeCompare(b.nom, 'fr', { sensitivity: 'base' }));
      setCategories(newCategories);
      setNewCat('');
      setNotif({ type: 'success', message: 'Catégorie ajoutée !' });
    } catch {
      setNotif({ type: 'error', message: 'Erreur lors de l\'ajout.' });
    }
  };

  const handleDelete = (id) => {
    setCatToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setDeleteStatus('loading');
    setDeleteMsg('');
    try {
      await deleteCategory(catToDelete);
      setCategories(categories.filter(c => c.id !== catToDelete));
      setDeleteStatus('success');
      setDeleteMsg('Catégorie supprimée.');
    } catch (err) {
      setDeleteStatus('error');
      setDeleteMsg(err.apiMsg || 'Erreur lors de la suppression.');
    }
  };

  // Fermer la modale après confirmation affichée 1s
  useEffect(() => {
    if (deleteStatus === 'success' || deleteStatus === 'error') {
      const timer = setTimeout(() => {
        setShowDeleteModal(false);
        setCatToDelete(null);
        setDeleteStatus('idle');
        setDeleteMsg('');
        if (deleteStatus === 'success') setNotif({ type: 'success', message: 'Catégorie supprimée.' });
        if (deleteStatus === 'error') setNotif({ type: 'error', message: deleteMsg });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [deleteStatus, deleteMsg]);

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCatToDelete(null);
  };

  const handleEdit = (id, nom) => {
    setEditId(id);
    setEditValue(nom);
  };

  const handleEditSubmit = async (id) => {
    if (!editValue.trim()) return;
    try {
      await updateCategory(id, editValue);
      setCategories(categories.map(c => c.id === id ? { ...c, nom: editValue } : c));
      setNotif({ type: 'success', message: 'Catégorie modifiée.' });
      setEditId(null);
    } catch {
      setNotif({ type: 'error', message: 'Erreur lors de la modification.' });
    }
  };

  useEffect(() => {
    if (notif.message) {
      const timer = setTimeout(() => setNotif({ type: '', message: '' }), 2000);
      return () => clearTimeout(timer);
    }
  }, [notif]);

  // Colonnes pour le tableau triable
  const columns = [
    { label: 'Nom', key: 'nom', sortable: true },
    { label: 'Actions', key: 'actions', sortable: false, render: (row) => (
      <div style={{display:'flex',flexDirection:'row',alignItems:'center',gap:8,justifyContent:'center'}}>
        <ActionIconButton type="edit" title="Éditer" onClick={() => handleEdit(row.id, row.nom)} />
        <ActionIconButton type="delete" title="Supprimer" onClick={() => handleDelete(row.id)} />
      </div>
    ) },
  ];

  return (
    <div className="page-centered-container">
      <h1>
        <i className="fa fa-tags icon-blue icon-lg mr-8"></i>
        Gestion des catégories
      </h1>
      {editId !== 'add' && (
        <button className="create-button" onClick={() => setEditId('add')}><i className="fa fa-plus mr-6"></i>Ajouter une catégorie</button>
      )}
      {editId === 'add' && (
        <CategoryAddForm
          newCat={newCat}
          setNewCat={setNewCat}
          onAdd={() => { handleAdd({ preventDefault: () => {} }); setEditId(null); }}
          onCancel={() => { setEditId(null); setNewCat(''); }}
        />
      )}
      <SortableTable
        columns={columns}
        data={categories}
        initialSort={{ col: 'nom', dir: 'asc' }}
      />
      {showDeleteModal && (
        <ConfirmDeleteModal
          show={showDeleteModal}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          status={deleteStatus}
          message={deleteMsg}
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          title="Confirmer la suppression ?"
          icon={<i className="fa fa-exclamation-triangle icon-red icon-action mr-8"></i>}
        />
      )}
    </div>
  );
}

export default ManageCategories;
