import React from 'react';
import BaseModal from '../modals/BaseModal';
import '../commun/UniForm.css';
import './UnifiedProductModal.css';

/**
 * Modal unifiée pour la gestion des produits
 * Remplace à la fois ProduitsFormModal et AjoutProduitModal
 * 
 * @param {boolean} show - Affichage du modal
 * @param {string} mode - Mode: 'add', 'edit', 'inline' (pour création rapide dans achats)
 * @param {object} formData - Données du formulaire {nom, categorie_id, prix}
 * @param {string} formError - Message d'erreur
 * @param {string} successMessage - Message de succès (pour mode inline)
 * @param {array} categories - Liste des catégories
 * @param {function} onSubmit - Fonction de soumission du formulaire
 * @param {function} onChange - Fonction de changement des champs
 * @param {function} onClose - Fonction de fermeture
 * @param {boolean} loading - État de chargement
 */
const UnifiedProductModal = ({ 
  show, 
  mode = 'add', // 'add', 'edit', 'inline'
  formData = { nom: '', categorie_id: '', prix: '' }, 
  formError, 
  successMessage,
  categories = [], 
  onSubmit, 
  onChange, 
  onClose,
  loading = false
}) => {
  if (!show) return null;

  // Gestion des changements de champs pour mode inline
  const handleInlineChange = (field) => (e) => {
    if (onChange) {
      onChange({ target: { name: field, value: e.target.value } });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  // Rendu en mode inline (pour AchatModal)
  if (mode === 'inline') {
    return (
      <div className="unified-product-modal-inline">
        <div className="unified-product-modal-title">Nouveau produit</div>
        <form onSubmit={handleSubmit}>
          <div className="field-group">
            <label>Nom :</label>
            <input 
              type="text" 
              value={formData.nom || ''} 
              onChange={handleInlineChange('nom')}
              required
              disabled={loading}
            />
          </div>
          <div className="field-group">
            <label>Prix unitaire (€) :</label>
            <input 
              type="number" 
              min="0" 
              step="0.01" 
              value={formData.prix || ''} 
              onChange={handleInlineChange('prix')}
              required
              disabled={loading}
            />
          </div>
          <div className="field-group">
            <label>Catégorie :</label>
            <select 
              value={formData.categorie_id || ''} 
              onChange={handleInlineChange('categorie_id')}
              required
              disabled={loading}
            >
              <option value="">Choisir une catégorie</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nom}</option>
              ))}
            </select>
          </div>
          
          <div className="inline-actions">
            <button 
              type="submit" 
              className="create-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fa fa-spinner fa-spin"></i> Création...
                </>
              ) : (
                'Créer'
              )}
            </button>
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </button>
          </div>
          
          {formError && (
            <div className="unified-error">{formError}</div>
          )}
          {successMessage && (
            <div className="unified-success">{successMessage}</div>
          )}
        </form>
      </div>
    );
  }

  // Rendu en mode modal complet (pour ManageProduits)
  return (
    <BaseModal show={show} onClose={onClose}>
      <form className="uni-form" onSubmit={handleSubmit}>
        <h2>
          {mode === 'add' ? 'Ajouter un produit' : 'Éditer le produit'}
        </h2>
        
        <label>
          Nom
          <input 
            name="nom" 
            value={formData.nom || ''} 
            onChange={onChange} 
            required 
            disabled={loading}
          />
        </label>
        
        <label>
          Catégorie
          <select 
            name="categorie_id" 
            value={formData.categorie_id || ''} 
            onChange={onChange} 
            required
            disabled={loading}
          >
            <option value="" disabled>Choisir une catégorie</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nom}</option>
            ))}
          </select>
        </label>
        
        <label>
          Prix (€)
          <input 
            name="prix" 
            value={formData.prix || ''} 
            onChange={onChange} 
            required 
            type="number" 
            step="0.01" 
            min="0" 
            disabled={loading}
          />
        </label>
        
        {formError && <div className="form-error">{formError}</div>}
        
        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {loading ? (
              <>
                <i className="fa fa-spinner fa-spin"></i> 
                {mode === 'add' ? 'Ajout...' : 'Sauvegarde...'}
              </>
            ) : (
              mode === 'add' ? 'Ajouter' : 'Enregistrer'
            )}
          </button>
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default UnifiedProductModal;
