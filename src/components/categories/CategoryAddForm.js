import React from 'react';

function CategoryAddForm({ newCat, setNewCat, onAdd, onCancel }) {
  return (
    <form className="category-add-form-row" onSubmit={e => {e.preventDefault(); onAdd();}}>
      <input
        value={newCat}
        onChange={e => setNewCat(e.target.value)}
        placeholder="Nom de la nouvelle catégorie"
        className="category-add-input"
        autoFocus
      />
      <button type="submit" className="save-button" title="Ajouter"><i className="fa fa-check"></i></button>
      <button type="button" className="cancel-button" onClick={onCancel} title="Annuler"><i className="fa fa-times"></i></button>
    </form>
  );
}

export default CategoryAddForm;
