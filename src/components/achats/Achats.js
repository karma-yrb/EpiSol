import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './styles/Achats.css';
import AchatModal from './forms/AchatModal';
import BeneficiaireSelector from './ui/BeneficiaireSelector';
import AchatsTable from './lists/AchatsTable';
import AchatsNotifications from './AchatsNotifications';
import { addAchat as addAchatApi } from './api/achatsApi';
import { useUnifiedBeneficiaireSearch } from '../../hooks/useUnifiedBeneficiaireSearch';
import { useAchatList } from './hooks/useAchatList';
import { useUnifiedProduitSearch } from '../../hooks/useUnifiedProduitSearch';
import { useDiscountCalculations } from '../../hooks/useDiscountCalculations';

function Achats() {
  // --- Gestion des paramètres URL ---
  const location = useLocation();
  
  // --- Bénéficiaires ---
  const beneficiaireSearch = useUnifiedBeneficiaireSearch();
  const { selectedB, setSelectedB, setSearchB, beneficiaires } = beneficiaireSearch;

  // --- Produits & Modal ---
  const produitSearch = useUnifiedProduitSearch();
  const { selectedProduit, setSelectedProduit, setProduitSearch, produitInputRef } = produitSearch;

  // --- Liste d'achats ---
  const achatListHook = useAchatList();
  const { achatList, addAchat, increaseQuantite, decreaseQuantite, deleteAchat, resetAchatList } = achatListHook;

  // --- Calculs de rabais ---
  const discountCalculations = useDiscountCalculations(selectedB, achatList);

  // --- État modal et quantité produit ---
  const [quantite, setQuantite] = useState(1);
  const [showModal, setShowModal] = useState(false);

  // --- États pour notifications ---
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Traitement des paramètres URL pour pré-sélectionner un bénéficiaire
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const beneficiaireId = params.get('beneficiaireId');
    const beneficiaireNom = params.get('beneficiaireNom');
    const beneficiairePrenom = params.get('beneficiairePrenom');

    if (beneficiaireId && beneficiaireNom && beneficiairePrenom && beneficiaires.length > 0) {
      // Chercher le bénéficiaire dans la liste
      const beneficiaire = beneficiaires.find(b => String(b.id) === String(beneficiaireId));
      
      if (beneficiaire && !selectedB) {
        // Pré-sélectionner le bénéficiaire
        setSelectedB(beneficiaire);
        setSearchB(`${beneficiaire.nom} ${beneficiaire.prenom}`);
        console.log('[Achats] Bénéficiaire pré-sélectionné depuis URL:', beneficiaire);
      }
    }
  }, [location.search, beneficiaires, selectedB, setSelectedB, setSearchB]);

  const handleAddAchat = (closeModal = false) => {
    if (!selectedProduit || !quantite || quantite <= 0) return;
    addAchat(selectedProduit, quantite);
    setProduitSearch('');
    setSelectedProduit(null);
    setQuantite(1);
    produitSearch.setProduitResults([]);
    produitSearch.setHighlightedProduit(-1);
    if (closeModal) {
      setShowModal(false);
    } else {
      if (produitInputRef.current) produitInputRef.current.focus();
    }
  };

  // Ajoute une fonction pour enregistrer le panier (achats)
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
      // Vider le champ bénéficiaire après un achat réussi
      setSelectedB(null);
      setSearchB('');
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
        {/* Section bénéficiaire */}
        <BeneficiaireSelector {...beneficiaireSearch} />
        
        {/* Ajout d'achat */}
        {selectedB && (
          <div className="achats-add-btn-wrapper">
            <button className="main-action-btn achats-add-btn" onClick={() => setShowModal(true)}>
              <i className="fa fa-plus"></i> Ajouter un produit
            </button>
          </div>
        )}

        {/* Modal d'ajout d'achat */}
        <AchatModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onAddAchat={handleAddAchat}
          {...produitSearch}
          quantite={quantite}
          setQuantite={setQuantite}
          handleAddAchat={handleAddAchat}
        />

        {/* Liste des achats en cours */}
        <AchatsTable
          achatList={achatList}
          {...discountCalculations}
          handleIncreaseQuantite={increaseQuantite}
          handleDecreaseQuantite={decreaseQuantite}
          handleDeleteAchat={deleteAchat}
          handleSaveAchats={handleSaveAchats}
          selectedB={selectedB}
        />

        {/* Notifications globales */}
        <AchatsNotifications saveSuccess={saveSuccess} saveError={saveError} />
      </div>
    </div>
  );
}

export default Achats;
