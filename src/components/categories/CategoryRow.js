import React from 'react';

function CategoryRow({ cat, editId, editValue, setEditValue, handleEdit, handleEditSubmit, setEditId, handleDelete }) {
  return (
    <tr>
      <td>
        {editId === cat.id ? (
          <form className="category-row-form-row" onSubmit={e => {e.preventDefault(); handleEditSubmit(cat.id);}}>
            <input value={editValue} onChange={e => setEditValue(e.target.value)} className="category-row-input" autoFocus />
            <button type="submit" className="save-button" title="Enregistrer"><i className="fa fa-check"></i></button>
            <button type="button" className="cancel-button" onClick={() => setEditId(null)} title="Annuler"><i className="fa fa-times"></i></button>
          </form>
        ) : (
          cat.nom
        )}
      </td>
      <td className="actions-cell">
        <button className="edit-button" title="Éditer" onClick={() => handleEdit(cat.id, cat.nom)}>
          <i className="fa fa-edit"></i>
        </button>
        <button className="delete-button" onClick={() => handleDelete(cat.id)} title="Supprimer">
          <i className="fa fa-trash"></i>
        </button>
      </td>
    </tr>
  );
}

export default CategoryRow;
