import React, { useRef, useState } from 'react';
import UnifiedProductModal from '../../produits/UnifiedProductModal';
import ProductSearchDropdown from '../ui/ProductSearchDropdown';
import QuantityAndActions from '../ui/QuantityAndActions';
import { useUnifiedProductForm } from '../../../hooks/useUnifiedProductForm';
import { useProductDropdown } from '../../../hooks/useProductDropdown';
import '../styles/AchatModal.css';

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
}) {  const modalRef = useRef();
  const [ajoutAchatError, setAjoutAchatError] = useState("");

  // Hook unifié pour la création de produits
  const {
    showModal: showAddProduit,
    formData,
    formError: addProduitError,
    successMessage: addProduitSuccess,
    categories,
    loading: addProduitLoading,
    handleChange,
    handleSubmit: handleCreateProduit,
    openInlineCreation,
    closeModal: closeAddProduit  } = useUnifiedProductForm((produitCree, mode) => {
    // Callback après création réussie
    if (produitCree) {
      setSelectedProduit(produitCree);
      setProduitSearch(produitCree.nom);
      setProduitDropdown(false);
      // Fermer le dropdown si on vient du mode inline
      if (mode === 'inline') {
        setProduitDropdown(false);
      }
    }
  });
  // Hook personnalisé pour le dropdown
  useProductDropdown({
    show,
    selectedProduit,
    setProduitDropdown,
    produitInputRef
  });

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
          highlightedProduit={highlightedProduit}          setHighlightedProduit={setHighlightedProduit}
          handleProduitKeyDown={handleProduitKeyDown}
          onOpenAddProduit={openInlineCreation}
          showAddProduit={showAddProduit}
        />

        {showAddProduit && (
          <UnifiedProductModal
            show={showAddProduit}
            mode="inline"
            formData={formData}
            formError={addProduitError}
            successMessage={addProduitSuccess}
            categories={categories}
            onSubmit={handleCreateProduit}
            onChange={handleChange}
            onClose={closeAddProduit}
            loading={addProduitLoading}
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
