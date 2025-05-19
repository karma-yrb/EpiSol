import React from 'react';
import './AjoutProduitModal.css';

function AjoutProduitModal({
  nom, setNom,
  prix, setPrix,
  categorie, setCategorie,
  categories = [],
  error,
  success,
  onCreate,
  onCancel
}) {
  return (
    <div id="mini-modal-ajout-produit">
      <div className="ajout-produit-title">Nouveau produit</div>
      <div style={{marginBottom:8}}>
        <label>Nom&nbsp;:</label><br/>
        <input type="text" value={nom} onChange={e=>setNom(e.target.value)} />
      </div>
      <div style={{marginBottom:8}}>
        <label>Prix unitaire (€)&nbsp;:</label><br/>
        <input type="number" min="0" step="0.01" value={prix} onChange={e=>setPrix(e.target.value)} />
      </div>
      <div style={{marginBottom:8}}>
        <label>Catégorie&nbsp;:</label><br/>
        <select value={categorie} onChange={e=>setCategorie(e.target.value)}>
          <option value="">Choisir une catégorie</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.nom}>{cat.nom}</option>
          ))}
        </select>
      </div>
      <div className="ajout-produit-actions">
        <button className="ajout-produit-create-btn" onClick={onCreate}>Créer</button>
        <button className="ajout-produit-cancel-btn" onClick={onCancel}>Annuler</button>
      </div>
      {error && <div className="ajout-produit-error">{error}</div>}
      {typeof success === 'string' && success && <div className="ajout-produit-success">{success}</div>}
    </div>
  );
}

export default AjoutProduitModal;
