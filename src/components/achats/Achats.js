import React, { useEffect, useState, useRef } from 'react';
import './Achats.css';
import AchatModal from './AchatModal';
import { addAchat as addAchatApi } from '../../api/achatsApi';
import { useBeneficiaireSearch } from '../../hooks/useBeneficiaireSearch';
import { useAchatList } from '../../hooks/useAchatList';
import { useProduitSearch } from '../../hooks/useProduitSearch';

function Achats() {
  // --- Bénéficiaires ---
  const {
    beneficiaires,
    searchB,
    setSearchB,
    filteredB,
    selectedB,
    setSelectedB,
    showDropdown,
    setShowDropdown,
    searchRef,
    highlighted,
    setHighlighted,
    handleSelectB,
    handleKeyDown
  } = useBeneficiaireSearch();

  // --- Produits & Modal ---
  const {
    produitSearch,
    setProduitSearch,
    produitResults,
    setProduitResults,
    selectedProduit,
    setSelectedProduit,
    produitLoading,
    setProduitLoading,
    produitDropdown,
    setProduitDropdown,
    produitInputRef,
    highlightedProduit,
    setHighlightedProduit,
    handleSelectProduit,
    handleProduitKeyDown
  } = useProduitSearch();

  // --- Liste d'achats ---
  const {
    achatList,
    setAchatList,
    addAchat,
    increaseQuantite,
    decreaseQuantite,
    deleteAchat,
    resetAchatList
  } = useAchatList();

  // --- État modal et quantité produit ---
  const [quantite, setQuantite] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const handleAddAchat = (closeModal = false) => {
    if (!selectedProduit || !quantite || quantite <= 0) return;
    addAchat(selectedProduit, quantite);
    setProduitSearch('');
    setSelectedProduit(null);
    setQuantite(1);
    setProduitResults([]);
    setHighlightedProduit(-1);
    if (closeModal) {
      setShowModal(false);
    } else {
      if (produitInputRef.current) produitInputRef.current.focus();
    }
  };

  // Ajoute une fonction pour augmenter la quantité d'un achat
  const handleIncreaseQuantite = increaseQuantite;

  // Ajoute une fonction pour diminuer la quantité d'un achat (min 1)
  const handleDecreaseQuantite = decreaseQuantite;

  // Suppression immédiate d'un achat (pas de confirmation)
  const handleDeleteAchat = deleteAchat;

  // Ajoute une fonction pour enregistrer le panier (achats)
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const handleSaveAchats = async () => {
    console.log('[Achats] handleSaveAchats - bouton cliqué');
    if (!selectedB || achatList.length === 0) {
      console.log('[Achats] handleSaveAchats - conditions non remplies', { selectedB, achatList });
      return;
    }
    const lignes = achatList.map(a => ({
      produit_id: a.produit.id,
      quantite: a.quantite,
      prix_unitaire: a.prix
    }));
    console.log('[Achats] handleSaveAchats - payload envoyé:', { beneficiaire_id: selectedB.id, lignes });
    try {
      const response = await addAchatApi(selectedB.id, lignes);
      console.log('[Achats] handleSaveAchats - réponse API:', response);
      resetAchatList();
      setSaveSuccess(true);
      setSaveError("");
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      setSaveError("Erreur lors de l'enregistrement des achats.");
      setTimeout(() => setSaveError(""), 3000);
      console.error('[Achats] handleSaveAchats - erreur:', err);
    }
  };

  return (
    <div className="page-centered-container">
      <h1 className="achats-title">
        <i className="fa fa-shopping-basket achats-title-icon"></i>
        Achats
      </h1>
      <div className="achats-main-card">
        <div className="achats-beneficiaire-section">
          <label className="achats-beneficiaire-label">Choisir un bénéficiaire</label>
          <div className="achats-beneficiaire-input-wrapper">
            <input
              type="text"
              placeholder="Nom ou prénom..."
              value={searchB}
              ref={searchRef}
              onChange={e => { setSearchB(e.target.value); setSelectedB(null); setHighlighted(-1); }}
              onFocus={() => { if (filteredB.length > 0) setShowDropdown(true); }}
              onKeyDown={handleKeyDown}
              className="achats-beneficiaire-input"
            />
            {showDropdown && filteredB.length > 0 && (
              <ul className="achats-beneficiaire-dropdown">
                {filteredB.map((b, idx) => (
                  <li key={b.id} onMouseDown={()=>handleSelectB(b)}
                    className={highlighted===idx?"selected":""}
                    onMouseEnter={()=>setHighlighted(idx)}
                  >
                    {b.nom} {b.prenom} <span className="achats-beneficiaire-num">({b.numero})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {selectedB && (
            <div className="achats-beneficiaire-selected">
              <i className="fa fa-check-circle"></i>
              Bénéficiaire sélectionné : {selectedB.nom} {selectedB.prenom}
            </div>
          )}
        </div>
        {/* Ajout d'achat */}
        {selectedB && (
          <div className="achats-add-btn-wrapper">
            <button className="main-action-btn achats-add-btn" onClick={()=>setShowModal(true)}>
              <i className="fa fa-plus"></i> Ajouter un produit
            </button>
          </div>
        )}
        {/* Modal d'ajout d'achat */}
        <AchatModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onAddAchat={handleAddAchat}
          produitSearch={produitSearch}
          setProduitSearch={setProduitSearch}
          produitResults={produitResults}
          produitLoading={produitLoading}
          selectedProduit={selectedProduit}
          setSelectedProduit={setSelectedProduit}
          quantite={quantite}
          setQuantite={setQuantite}
          handleAddAchat={handleAddAchat}
          produitDropdown={produitDropdown}
          setProduitDropdown={setProduitDropdown}
          produitInputRef={produitInputRef}
          highlightedProduit={highlightedProduit}
          setHighlightedProduit={setHighlightedProduit}
          handleProduitKeyDown={handleProduitKeyDown}
        />
        {/* Liste des achats en cours */}
        {achatList.length > 0 && (
          <div className="achats-list-wrapper">
            <h2 className="achats-list-title">Achats en cours</h2>
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
                      <button title="Diminuer la quantité" className="achats-qty-btn moins" onClick={() => handleDecreaseQuantite(idx)}>-</button>
                      <button title="Augmenter la quantité" className="achats-qty-btn plus" onClick={() => handleIncreaseQuantite(idx)}>+</button>
                      <button title="Supprimer" className="achats-delete-btn" onClick={() => handleDeleteAchat(idx)}>
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {/* Ligne de total */}
                <tr className="achats-total-row">
                  <td colSpan={2} style={{ fontWeight: 700, textAlign: 'right' }}>Total</td>
                  <td style={{ fontWeight: 700 }}>
                    {achatList.reduce((sum, a) => sum + a.quantite * a.prix, 0).toFixed(2)} €
                  </td>
                  <td style={{ fontWeight: 700, color: '#0071bc' }}>
                    {achatList.reduce((sum, a) => sum + a.quantite, 0)} produit{achatList.reduce((sum, a) => sum + a.quantite, 0) > 1 ? 's' : ''}
                  </td>
                </tr>
              </tbody>
            </table>
            <button 
              className="main-action-btn bg-blue enreg-achats-btn"
              style={{marginTop:24, width:'100%', maxWidth:400, display:'block', marginLeft:'auto', marginRight:'auto', fontSize:'1.1rem', padding:'12px 0'}} 
              onClick={handleSaveAchats}
            >
              <i className="fa fa-save"></i> Enregistrer les achats
            </button>
          </div>
        )}
        {/* Notifications globales */}
        {console.log('[DEBUG] saveSuccess:', saveSuccess, 'saveError:', saveError)}
        {saveSuccess && (
          <div className="notification success" style={{marginTop:16}}>
            <i className="fa fa-check-circle"></i> Achats enregistrés avec succès !
          </div>
        )}
        {saveError && (
          <div className="notification error" style={{marginTop:16}}>
            <i className="fa fa-exclamation-circle"></i> {saveError}
          </div>
        )}
      </div>
    </div>
  );
}

export default Achats;
