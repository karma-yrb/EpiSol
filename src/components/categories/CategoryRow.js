import React from 'react';
import ActionIconButton from '../commun/ActionIconButton';

function CategoryRow({ cat, editId, editValue, setEditValue, handleEdit, handleEditSubmit, setEditId, handleDelete }) {
  return (
    <tr>
      <td>
        {editId === cat.id ? (
          <form className="category-row-form-row" onSubmit={e => {e.preventDefault(); handleEditSubmit(cat.id);}}>
            <input value={editValue} onChange={e => setEditValue(e.target.value)} className="category-row-input" autoFocus />
          </form>
        ) : (
          cat.nom
        )}
      </td>
      <td className="actions-cell">
        {editId === cat.id ? (
          <>
            <ActionIconButton type="save" title="Enregistrer" onClick={() => handleEditSubmit(cat.id)} />
            <ActionIconButton type="custom" icon="fa-times" title="Annuler" onClick={() => setEditId(null)} />
            <ActionIconButton type="delete" title="Supprimer" onClick={() => handleDelete(cat.id)} />
          </>
        ) : (
          <>
            <ActionIconButton type="edit" title="Éditer" onClick={() => handleEdit(cat.id, cat.nom)} />
            <ActionIconButton type="delete" title="Supprimer" onClick={() => handleDelete(cat.id)} />
          </>
        )}
      </td>
    </tr>
  );
}

export default CategoryRow;
