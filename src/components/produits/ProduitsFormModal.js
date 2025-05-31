import React from 'react';

const ProduitsFormModal = ({ 
  show, 
  formMode, 
  formData, 
  formError, 
  categories, 
  onSubmit, 
  onChange, 
  onClose 
}) => {
  if (!show) return null;

  return (
    <div className="modal-bg">
      <form className="uni-form" onSubmit={onSubmit}>
        <h2>{formMode === 'add' ? 'Ajouter un produit' : 'Éditer le produit'}</h2>
        <label>Nom
          <input 
            name="nom" 
            value={formData.nom} 
            onChange={onChange} 
            required 
          />
        </label>
        <label>Catégorie
          <select 
            name="categorie_id" 
            value={formData.categorie_id} 
            onChange={onChange} 
            required
          >
            <option value="" disabled>Choisir une catégorie</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nom}</option>
            ))}
          </select>
        </label>
        <label>Prix (€)
          <input 
            name="prix" 
            value={formData.prix} 
            onChange={onChange} 
            required 
            type="number" 
            step="0.01" 
            min="0" 
          />
        </label>
        {formError && <div className="form-error">{formError}</div>}
        <div className="form-buttons">
          <button type="submit">
            {formMode === 'add' ? 'Ajouter' : 'Enregistrer'}
          </button>
          <button type="button" className="cancel-btn" onClick={onClose}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProduitsFormModal;
