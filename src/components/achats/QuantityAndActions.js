import React from 'react';

/**
 * Composant pour la saisie de quantité et les actions du modal d'achat
 */
function QuantityAndActions({
  selectedProduit,
  quantite,
  setQuantite,
  ajoutAchatError,
  onAddAchat,
  onClose,
  setAjoutAchatError,
  produitSearch
}) {
  
  const handleAddClick = () => {
    if (!produitSearch || !selectedProduit) {
      setAjoutAchatError('Veuillez sélectionner un produit avant d\'ajouter.');
      setTimeout(() => setAjoutAchatError(''), 2000);
      return;
    }
    setAjoutAchatError("");
    onAddAchat(false);
  };

  return (
    <>
      {selectedProduit && (
        <div style={{marginBottom:14,color:'#1a7f1a',fontWeight:500,fontSize:15}}>
          Prix unitaire : {Number(selectedProduit.prix).toFixed(2)} €
        </div>
      )}
      
      <label className="achat-modal-label">Quantité</label>
      <input
        type="number"
        min={1}
        value={quantite}
        onChange={e => setQuantite(e.target.value)}
        className="achat-modal-input"
        style={{marginBottom:18}}
      />
      
      {ajoutAchatError && (
        <div className="achat-modal-error">
          {ajoutAchatError}
        </div>
      )}
      
      <div className="achat-modal-actions">
        <button type="button" className="add-btn" onClick={handleAddClick}>
          Ajouter
        </button>
        <button type="button" className="cancel-btn" onClick={onClose}>
          Terminer
        </button>
      </div>
    </>
  );
}

export default QuantityAndActions;
