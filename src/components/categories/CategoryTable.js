import React from 'react';
import CategoryRow from './CategoryRow';

function CategoryTable({ categories, editId, editValue, setEditValue, handleEdit, handleEditSubmit, setEditId, handleDelete }) {
  return (
    <table className="produits-table">
      <thead>
        <tr><th>Nom</th><th>Actions</th></tr>
      </thead>
      <tbody>
        {categories.map(cat => (
          <CategoryRow
            key={cat.id}
            cat={cat}
            editId={editId}
            editValue={editValue}
            setEditValue={setEditValue}
            handleEdit={handleEdit}
            handleEditSubmit={handleEditSubmit}
            setEditId={setEditId}
            handleDelete={handleDelete}
          />
        ))}
      </tbody>
    </table>
  );
}

export default CategoryTable;
