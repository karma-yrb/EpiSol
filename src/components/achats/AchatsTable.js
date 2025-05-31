import React from 'react';

/**
 * Composant pour afficher la liste des achats avec totaux et rabais
 */
function AchatsTable({
  achatList,
  applyDiscount,
  setApplyDiscount,
  discountValue,
  totalSansRabais,
  montantRabais,
  totalAvecRabais,
  handleIncreaseQuantite,
  handleDecreaseQuantite,
  handleDeleteAchat,
  handleSaveAchats,
  selectedB
}) {
  if (achatList.length === 0) return null;

  return (
    <div className="achats-list-wrapper">
      <h2 className="achats-list-title">Achats en cours</h2>
      
      {/* Section rabais */}
      <div className="achats-form-section">
        {selectedB && (
          <label className="switch-label">
            <span className="switch">
              <input
                type="checkbox"
                checked={applyDiscount}
                onChange={e => setApplyDiscount(e.target.checked)}
              />
              <span className="slider round"></span>
            </span>
            <span className="switch-text">
              {applyDiscount
                ? `${discountValue}% appliqués`
                : `Appliquer les ${discountValue}% du bénéficiaire`}
            </span>
          </label>
        )}
      </div>

      {/* Table des achats */}
      <table className="produits-table achats-list-table">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Quantité</th>
            <th>Prix total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {achatList.map((a, idx) => (
            <tr key={idx}>
              <td>{a.produit.nom}</td>
              <td>{a.quantite}</td>
              <td>{(a.quantite * a.prix).toFixed(2)} €</td>
              <td>
                <button 
                  title="Diminuer la quantité" 
                  className="achats-qty-btn moins" 
                  onClick={() => handleDecreaseQuantite(idx)}
                >
                  -
                </button>
                <button 
                  title="Augmenter la quantité" 
                  className="achats-qty-btn plus" 
                  onClick={() => handleIncreaseQuantite(idx)}
                >
                  +
                </button>
                <button 
                  title="Supprimer" 
                  className="achats-delete-btn" 
                  onClick={() => handleDeleteAchat(idx)}
                >
                  <i className="fa fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}

          {/* Ligne de total original barré : affichée seulement si rabais appliqué */}
          {applyDiscount && (
            <tr className="achats-total-row">
              <td colSpan={2} className="achats-total-cell-label">Total initial</td>
              <td className="achats-total-cell-initial">
                {totalSansRabais.toFixed(2)} €
              </td>
              <td></td>
            </tr>
          )}

          {/* Ligne de rabais */}
          {applyDiscount && (
            <tr className="achats-total-row">
              <td colSpan={2} className="achats-total-cell-label">Rabais</td>
              <td className="achats-total-cell-rabais">- {montantRabais.toFixed(2)} €</td>
              <td></td>
            </tr>
          )}

          {/* Ligne de total après rabais */}
          <tr className="achats-total-row">
            <td colSpan={2} className="achats-total-cell-label">Total à payer</td>
            <td className="achats-total-cell-final">
              {totalAvecRabais.toFixed(2)} €
            </td>
            <td className="achats-total-cell-final">
              {achatList.reduce((sum, a) => sum + a.quantite, 0)} produit{achatList.reduce((sum, a) => sum + a.quantite, 0) > 1 ? 's' : ''}
            </td>
          </tr>
        </tbody>
      </table>

      <button 
        className="achats-save-btn"
        onClick={handleSaveAchats}
      >
        <i className="fa fa-save"></i> Enregistrer les achats
      </button>
    </div>
  );
}

export default AchatsTable;
