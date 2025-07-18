import React from 'react';
import '../commun/UniForm.css';

function BeneficiaireForm({ formData, handleChange, handleSubmit, handleDelete, id }) {
  return (
    <form onSubmit={handleSubmit} className="uni-form uni-form-container">
      <label>Nom *</label>
      <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />

      <label>Prénom *</label>
      <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />      <label>Numéro de bénéficiaire *</label>
      <input 
        type="text" 
        name="numero" 
        value={formData.numero} 
        onChange={handleChange} 
        required 
        maxLength="5"
        pattern="[0-9]{1,5}"
        title="Le numéro doit contenir uniquement des chiffres (1 à 5 chiffres maximum)"
        placeholder="Ex: 12345"
      />

      <label>Rabais (%)</label>
      <input
        type="number"
        name="discount"
        min="0"
        max="90"
        step="1"
        value={formData.discount ?? 50}
        onChange={handleChange}
        required
        placeholder="Ex: 50"
      />      <label>Téléphone</label>
      <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} />

      <label>Email</label>
      <input type="email" name="email" value={formData.email} onChange={handleChange} />

      <label>Date de naissance</label>
      <input type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} />

      <label>Ville</label>
      <input type="text" name="ville" value={formData.ville} onChange={handleChange} />

      <label>Adresse</label>
      <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} />

      <div className="form-buttons">
        <button type="submit" className="submit-btn">
          {id ? 'Mettre à jour' : 'Créer'}
        </button>        {id && handleDelete && (
          <button 
            type="button" 
            className="delete-btn" 
            onClick={handleDelete}
            title="Supprimer ce bénéficiaire"
          >
            Supprimer
          </button>
        )}
      </div>
    </form>
  );
}

export default BeneficiaireForm;
