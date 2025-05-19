import React from 'react';

function CategoryAddForm({ newCat, setNewCat, onAdd, onCancel }) {
  return (
    <form style={{display:'flex',gap:8,alignItems:'center',margin:'16px 0'}} onSubmit={e => {e.preventDefault(); onAdd();}}>
      <input
        value={newCat}
        onChange={e => setNewCat(e.target.value)}
        placeholder="Nom de la nouvelle catégorie"
        style={{width: '180px'}}
        autoFocus
      />
      <button type="submit" className="save-button" title="Ajouter"><i className="fa fa-check"></i></button>
      <button type="button" className="cancel-button" onClick={onCancel} title="Annuler"><i className="fa fa-times"></i></button>
    </form>
  );
}

export default CategoryAddForm;
