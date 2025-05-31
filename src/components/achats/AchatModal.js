import React, { useRef, useState } from 'react';
import AjoutProduitModal from '../produits/AjoutProduitModal';
import ProductSearchDropdown from './ProductSearchDropdown';
import QuantityAndActions from './QuantityAndActions';
import { useProductCreation } from '../../hooks/useProductCreation';
import { useProductDropdown } from '../../hooks/useProductDropdown';
import './AchatModal.css';

function AchatModal({
  show,
  onClose,
  onAddAchat,
  produitSearch,
  setProduitSearch,
  produitResults,
  produitLoading,
  selectedProduit,
  setSelectedProduit,
  quantite,
  setQuantite,
  handleAddAchat,
  produitDropdown,
  setProduitDropdown,
  produitInputRef,
  highlightedProduit,
  setHighlightedProduit,
  handleProduitKeyDown
}) {
  const modalRef = useRef();
  const [ajoutAchatError, setAjoutAchatError] = useState("");

  // Hook personnalisé pour la création de produits
  const {
    showAddProduit,
    newProduitNom,
    newProduitPrix,
    newProduitCategorie,
    addProduitError,
    addProduitSuccess,
    categories,
    setNewProduitNom,
    setNewProduitPrix,
    setNewProduitCategorie,
    handleCreateProduit,
    openAddProduit,
    closeAddProduit
  } = useProductCreation();

  // Hook personnalisé pour le dropdown
  useProductDropdown({
    show,
    selectedProduit,
    setProduitDropdown,
    produitInputRef
  });

  // Gestion de la création de produit avec sélection automatique
  const handleProductCreation = async () => {
    const produitCree = await handleCreateProduit();
    if (produitCree) {
      setSelectedProduit(produitCree);
      setProduitSearch(produitCree.nom);
      setProduitDropdown(false);
    }
  };

  if (!show) return null;
  return (
    <div className="modal-bg">
      <div ref={modalRef} className="achat-modal-container">
        <div className="achat-modal-title">Ajouter un achat</div>
        
        <label className="achat-modal-label">Produit</label>
        <ProductSearchDropdown
          produitSearch={produitSearch}
          setProduitSearch={setProduitSearch}
          produitResults={produitResults}
          produitLoading={produitLoading}
          selectedProduit={selectedProduit}
          setSelectedProduit={setSelectedProduit}
          produitDropdown={produitDropdown}
          setProduitDropdown={setProduitDropdown}
          produitInputRef={produitInputRef}
          highlightedProduit={highlightedProduit}
          setHighlightedProduit={setHighlightedProduit}
          handleProduitKeyDown={handleProduitKeyDown}
          onOpenAddProduit={openAddProduit}
          showAddProduit={showAddProduit}
        />

        {showAddProduit && (
          <AjoutProduitModal
            nom={newProduitNom}
            setNom={setNewProduitNom}
            prix={newProduitPrix}
            setPrix={setNewProduitPrix}
            categorie={newProduitCategorie}
            setCategorie={setNewProduitCategorie}
            categories={categories}
            error={addProduitError}
            success={addProduitSuccess}
            onCreate={handleProductCreation}
            onCancel={closeAddProduit}
          />
        )}

        <QuantityAndActions
          selectedProduit={selectedProduit}
          quantite={quantite}
          setQuantite={setQuantite}
          ajoutAchatError={ajoutAchatError}
          onAddAchat={handleAddAchat}
          onClose={onClose}
          setAjoutAchatError={setAjoutAchatError}
          produitSearch={produitSearch}
        />
      </div>
    </div>
  );
}

export default AchatModal;
