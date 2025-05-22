import React, { useState } from 'react';
import './SortableTable.css';

/**
 * columns: [
 *   { label: 'Nom', key: 'nom', sortable: true },
 *   { label: 'Catégorie', key: 'categorie', sortable: true },
 *   { label: 'Actions', key: 'actions', sortable: false, render: (row) => ... }
 * ]
 * data: array of objects
 */
function SortableTable({ columns, data, initialSort, className = '' }) {
  const [sortCol, setSortCol] = useState(initialSort?.col || null);
  const [sortDir, setSortDir] = useState(initialSort?.dir || 'asc');

  const handleSort = (col) => {
    if (!col.sortable) return;
    if (sortCol === col.key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(col.key);
      setSortDir('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortCol) return data;
    const col = columns.find((c) => c.key === sortCol);
    if (!col || !col.sortable) return data;
    return [...data].sort((a, b) => {
      let vA = a[sortCol], vB = b[sortCol];
      if (typeof vA === 'string') vA = vA.toLowerCase();
      if (typeof vB === 'string') vB = vB.toLowerCase();
      if (vA < vB) return sortDir === 'asc' ? -1 : 1;
      if (vA > vB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortCol, sortDir, columns]);

  return (
    <table className={`produits-table ${className}`}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className={col.sortable ? 'sortable-col' : ''}
              onClick={() => handleSort(col)}
              style={{ cursor: col.sortable ? 'pointer' : 'default' }}
            >
              {col.label}
              {col.sortable && sortCol === col.key && (
                <i className={`fa fa-caret-${sortDir === 'asc' ? 'up' : 'down'} icon-sm ml-4`}></i>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row, idx) => (
          <tr key={row.id || idx}>
            {columns.map((col) => (
              <td key={col.key}>
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SortableTable;
