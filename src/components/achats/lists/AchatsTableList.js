import React from 'react';
import ActionIconButton from '../../commun/ActionIconButton';

/**
 * Fonction utilitaire pour formater la date jj mmm aaaa
 */
function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const jour = d.getDate().toString().padStart(2, '0');
  const mois = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
  const moisStr = mois[d.getMonth()];
  const annee = d.getFullYear();
  return `${jour} ${moisStr} ${annee}`;
}

/**
 * Composant pour la table des achats avec tri
 */
function AchatsTableList({ 
  achatsTries, 
  sortCol, 
  sortDir, 
  handleSort, 
  handleDetails, 
  handleDelete 
}) {
  return (
    <table className="produits-table achats-list-table">
      <thead>
        <tr>
          <th style={{cursor:'pointer'}} onClick={() => handleSort('date_achat')}>
            Date
            {sortCol === 'date_achat' && (
              <i className={`fa fa-caret-${sortDir === 'asc' ? 'up' : 'down'}`} style={{marginLeft:4}}></i>
            )}
          </th>
          <th style={{cursor:'pointer'}} onClick={() => handleSort('beneficiaire')}>
            Bénéficiaire
            {sortCol === 'beneficiaire' && (
              <i className={`fa fa-caret-${sortDir === 'asc' ? 'up' : 'down'}`} style={{marginLeft:4}}></i>
            )}
          </th>
          <th>Quantité</th>
          <th style={{cursor:'pointer'}} onClick={() => handleSort('total')}>
            Total (€)
            {sortCol === 'total' && (
              <i className={`fa fa-caret-${sortDir === 'asc' ? 'up' : 'down'}`} style={{marginLeft:4}}></i>
            )}
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {achatsTries.map(a => (
          <tr key={a.id}>
            <td>{a.date_achat ? formatDateShort(a.date_achat) : ''}</td>
            <td>{a.beneficiaire_nom} {a.beneficiaire_prenom}</td>            <td>
              {Array.isArray(a.lignes) 
                ? a.lignes.reduce((sum, l) => sum + (l.quantite || 0), 0) 
                : (a.quantite || 0)
              }
            </td>
            <td>{Number(a.total).toFixed(2)}</td>
            <td>
              <div className="actions-cell">
                <ActionIconButton 
                  type="view" 
                  title="Détails" 
                  onClick={() => handleDetails(a.id)} 
                />
                <ActionIconButton 
                  type="delete" 
                  title="Supprimer" 
                  onClick={() => handleDelete(a.id)} 
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AchatsTableList;
