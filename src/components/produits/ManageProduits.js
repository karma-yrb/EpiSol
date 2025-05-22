import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../commun/UniForm.css';
import './ManageProduits.css';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import { fetchProduits, addProduit, updateProduit, deleteProduit } from '../../api/produitsApi';
import ActionIconButton from '../commun/ActionIconButton';
import SortableTable from '../commun/SortableTable';
import '../commun/SortableTable.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

function ManageProduits() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [formData, setFormData] = useState({ nom: '', categorie_id: '', prix: '' });
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState('');
  const [notif, setNotif] = useState({ type: '', message: '' });
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [produitToDelete, setProduitToDelete] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState('idle');
  const [deleteMsg, setDeleteMsg] = useState('');
  const navigate = useNavigate();

  // Récupère toutes les catégories
  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement des catégories');
        return res.json();
      })
      .then(data => {
        setCategories(Array.isArray(data) ? data : []);
        setNotif({ type: '', message: '' }); // Efface la notif d'erreur si succès
      })
      .catch((err) => {
        setCategories([]);
        setNotif({ type: 'error', message: 'Erreur lors du chargement des catégories : ' + (err.message || err) });
      });
  }, []);

  // Récupère tous les produits
  useEffect(() => {
    setLoading(true);
    fetchProduits()
      .then(data => {
        setProduits(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setNotif({ type: 'error', message: 'Erreur lors du chargement des produits: ' + err });
      });
  }, []);

  // Notification auto-disparition
  useEffect(() => {
    if (notif.message) {
      const timer = setTimeout(() => setNotif({ type: '', message: '' }), 2500);
      return () => clearTimeout(timer);
    }
  }, [notif]);

  const handleEdit = (id) => {
    const prod = produits.find(p => p.id === id);
    if (!prod) return;
    setFormMode('edit');
    setFormData({ nom: prod.nom, categorie_id: prod.categorie_id, prix: prod.prix });
    setFormError('');
    setShowForm(true);
    setEditId(id);
  };

  const handleDelete = (id) => {
    setProduitToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setDeleteStatus('loading');
    setDeleteMsg('');
    try {
      await deleteProduit(produitToDelete);
      setProduits(produits => produits.filter(p => p.id !== produitToDelete));
      setDeleteStatus('success');
      setDeleteMsg('Produit supprimé avec succès.');
    } catch {
      setDeleteStatus('error');
      setDeleteMsg('Erreur lors de la suppression du produit.');
    }
  };

  useEffect(() => {
    if (deleteStatus === 'success' || deleteStatus === 'error') {
      const timer = setTimeout(() => {
        setShowDeleteModal(false);
        setProduitToDelete(null);
        setDeleteStatus('idle');
        setDeleteMsg('');
        if (deleteStatus === 'success') setNotif({ type: 'success', message: 'Produit supprimé avec succès.' });
        if (deleteStatus === 'error') setNotif({ type: 'error', message: deleteMsg });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [deleteStatus, deleteMsg]);

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProduitToDelete(null);
  };

  const handleAdd = () => {
    setFormMode('add');
    setFormData({ nom: '', categorie_id: '', prix: '' });
    setFormError('');
    setShowForm(true);
    setEditId(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  // Soumission du formulaire (ajout ou édition)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!formData.nom || !formData.categorie_id || formData.prix === '') {
      setFormError('Tous les champs sont requis.');
      return;
    }
    if (isNaN(Number(formData.prix))) {
      setFormError('Le prix doit être un nombre.');
      return;
    }
    try {
      let data;
      if (formMode === 'add') {
        data = await addProduit({ ...formData, prix: Number(formData.prix) });
      } else {
        data = await updateProduit(editId, { ...formData, prix: Number(formData.prix) });
      }
      const cat = categories.find(c => c.id === Number(formData.categorie_id));
      if (formMode === 'add') {
        setProduits(p => [...p, { ...data, categorie: cat ? cat.nom : '', categorie_id: data.categorie_id }]);
        setNotif({ type: 'success', message: 'Produit ajouté !' });
      } else {
        setProduits(p => p.map(prod => prod.id === editId ? { ...prod, ...formData, prix: Number(formData.prix), categorie: cat ? cat.nom : '', categorie_id: Number(formData.categorie_id) } : prod));
        setNotif({ type: 'success', message: 'Produit modifié !' });
      }
      setShowForm(false);
    } catch {
      setFormError('Erreur lors de l\'enregistrement du produit.');
    }
  };

  // Ferme la modale
  const handleFormClose = () => {
    setShowForm(false);
    setFormError('');
  };

  // Filtrage et recherche
  const produitsFiltres = produits.filter(p => {
    // Suppression du filtrage par catégorie (filterCat)
    const matchSearch = search ? (p.nom.toLowerCase().includes(search.toLowerCase()) || (p.categorie && p.categorie.toLowerCase().includes(search.toLowerCase()))) : true;
    return matchSearch;
  });

  // Colonnes pour le tableau triable
  const columns = [
    { label: 'Nom', key: 'nom', sortable: true },
    { label: 'Catégorie', key: 'categorie', sortable: true },
    { label: 'Prix (€)', key: 'prix', sortable: true, render: row => Number(row.prix).toFixed(2) },
    { label: 'Actions', key: 'actions', sortable: false, render: (row) => (
      <>
        <ActionIconButton type="edit" title="Éditer" onClick={() => handleEdit(row.id)} />
        <ActionIconButton type="delete" title="Supprimer" onClick={() => handleDelete(row.id)} />
      </>
    ) },
  ];

  // Détection mobile (largeur < 900px)
  const isMobile = window.innerWidth < 900;

  return (
    <div className="page-centered-container">
      {/* Un seul h1 harmonisé */}
      <h1 className="page-title"><i className="fa fa-shopping-basket icon-blue icon-lg mr-8"></i>Gestion des produits</h1>
      <div className="page-header-bar"></div>
      <div className="produits-filtres">
        <div className="produits-btn-group">
          <button onClick={handleAdd} className="add-produit-btn" title="Ajouter un produit">
            <i className="fa fa-plus mr-6"></i> Ajouter un produit
          </button>
          <button type="button" className="produits-categories-btn special" onClick={()=>navigate('/categories-management')}>
            <i className="fa fa-tags mr-6"></i>Gérer les catégories
          </button>
        </div>
        <input
          type="text"
          placeholder="Recherche par nom ou catégorie..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="produits-search-input"
        />
      </div>
      {/* Notifications */}
      {notif.message && (
        <div className={`notification ${notif.type}`}>
          <i className={`fa fa-${notif.type==='success'?'check-circle':'exclamation-circle'}`}></i> {notif.message}
        </div>
      )}
      {showForm && (
        <div className="modal-bg">
          <form className="uni-form" onSubmit={handleFormSubmit}>
            <h2>{formMode === 'add' ? 'Ajouter un produit' : 'Éditer le produit'}</h2>
            <label>Nom
              <input name="nom" value={formData.nom} onChange={handleFormChange} required />
            </label>
            <label>Catégorie
              <select name="categorie_id" value={formData.categorie_id} onChange={handleFormChange} required>
                <option value="" disabled>Choisir une catégorie</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nom}</option>
                ))}
              </select>
            </label>
            <label>Prix (€)
              <input name="prix" value={formData.prix} onChange={handleFormChange} required type="number" step="0.01" min="0" />
            </label>
            {formError && <div className="form-error">{formError}</div>}
            <div className="form-buttons">
              <button type="submit">{formMode === 'add' ? 'Ajouter' : 'Enregistrer'}</button>
              <button type="button" className="cancel-btn" onClick={handleFormClose}>Annuler</button>
            </div>
          </form>
        </div>
      )}
      {showDeleteModal && (
        <ConfirmDeleteModal
          show={showDeleteModal}
          onConfirm={confirmDelete}
          onCancel={() => { setShowDeleteModal(false); setProduitToDelete(null); setDeleteStatus('idle'); setDeleteMsg(''); }}
          status={deleteStatus}
          message={deleteMsg}
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          title="Confirmer la suppression du produit ?"
          icon={<i className="fa fa-exclamation-triangle icon-red mr-8"></i>}
        />
      )}
      {loading ? (
        <div className="loading centered-text"><i className="fa fa-spinner fa-spin"></i> Chargement...</div>
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
