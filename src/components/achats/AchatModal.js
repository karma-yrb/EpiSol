import React, { useEffect, useRef, useState } from 'react';
import AjoutProduitModal from '../produits/AjoutProduitModal';
import './AchatModal.css';
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

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

  // Pour éviter la réouverture du dropdown après sélection
  const justSelectedRef = useRef(false);

  // State pour ajout produit (doit être AVANT tout useEffect qui l'utilise)
  const [showAddProduit, setShowAddProduit] = useState(false);
  const [newProduitNom, setNewProduitNom] = useState("");
  const [newProduitPrix, setNewProduitPrix] = useState("");
  const [newProduitCategorie, setNewProduitCategorie] = useState("");
  const [addProduitError, setAddProduitError] = useState("");
  const [categories, setCategories] = useState([]);
  const [addProduitSuccess, setAddProduitSuccess] = useState("");
  const [ajoutAchatError, setAjoutAchatError] = useState("");

  // Récupère les catégories à l'ouverture du modal d'ajout produit
  useEffect(() => {
    if (showAddProduit) {
      fetch(`${API_BASE_URL}/api/categories`)
        .then(res => res.json())
        .then(data => setCategories(Array.isArray(data) ? data : []))
        .catch(() => setCategories([]));
    }
  }, [showAddProduit]);

  // Handler local pour la sélection produit (clic ou clavier)
  const handleSelectProduit = (p) => {
    setSelectedProduit(p);
    setProduitSearch(p.nom);
    setProduitDropdown(false);
    setHighlightedProduit(-1);
    if (produitInputRef.current) produitInputRef.current.blur();
  };

  // Désactive la fermeture automatique du modal sur clic en dehors :
  // Le modal ne se ferme plus que via les boutons (Terminer, Annuler)
  useEffect(() => {
    // Ne rien faire ici : on ne ferme plus le modal automatiquement
    return () => {};
  }, [show]);

  // Log la valeur de produitSearch à chaque update pour debug
  useEffect(() => {
    // Nettoyage : suppression du log debug
  }, [produitSearch]);

  // Ferme le dropdown produit dès qu'un produit est sélectionné
  useEffect(() => {
    if (selectedProduit) {
      setProduitDropdown(false);
      justSelectedRef.current = true;
    }
  }, [selectedProduit, setProduitDropdown]);

  // Gestion fermeture du dropdown produit ET du mini-modal ajout produit sur clic en dehors
  useEffect(() => {
    if (!show) return;
    function handleClickOutside(e) {
      console.log('[AchatModal] handleClickOutside', e.target);
      // Si le champ principal produit ou le mini-modal d'ajout produit contient la cible, ne rien faire
      if (
        (produitInputRef.current && produitInputRef.current.parentNode.contains(e.target)) ||
        (document.getElementById('mini-modal-ajout-produit') && document.getElementById('mini-modal-ajout-produit').contains(e.target))
      ) {
        console.log('[AchatModal] Clic à l\'intérieur du champ produit ou mini-modal, on ne ferme rien');
        return;
      }
      console.log('[AchatModal] Clic à l\'extérieur, fermeture dropdown');
      setProduitDropdown(false);
      // Ne plus fermer le mini-modal d'ajout produit automatiquement
      // setShowAddProduit(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, setProduitDropdown]);

  const handleCreateProduit = async () => {
    setAddProduitError("");
    setAddProduitSuccess("");
    if (!newProduitNom.trim()) {
      setAddProduitError("Le nom du produit est requis.");
      return;
    }
    if (!newProduitPrix || isNaN(Number(newProduitPrix)) || Number(newProduitPrix) <= 0) {
      setAddProduitError("Le prix doit être un nombre positif.");
      return;
    }
    try {
      // Cherche l'id de la catégorie sélectionnée
      const catObj = categories.find(cat => cat.nom === newProduitCategorie);
      const categorie_id = catObj ? catObj.id : null;
      if (!categorie_id) {
        setAddProduitError("Veuillez choisir une catégorie.");
        return;
      }
      const res = await fetch(`${API_BASE_URL}/produits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: newProduitNom,
          prix: Number(newProduitPrix),
          categorie_id
        })
      });
      if (!res.ok) {
        let errorMsg = `Erreur lors de la création du produit (status: ${res.status})`;
        try {
          const errorData = await res.json();
          if (errorData && errorData.error) errorMsg += `: ${errorData.error}`;
        } catch (e) {
          // ignore JSON parse error
        }
        setAddProduitError(errorMsg);
        console.error('[AchatModal] Création produit échouée:', errorMsg);
        return;
      }
      const produitCree = await res.json();
      setAddProduitSuccess("Produit créé avec succès !");
      setTimeout(() => {
        setSelectedProduit(produitCree);
        setProduitSearch(produitCree.nom);
        setShowAddProduit(false);
        setNewProduitNom("");
        setNewProduitPrix("");
        setNewProduitCategorie("");
        setProduitDropdown(false);
        setAddProduitSuccess("");
      }, 1000);
    } catch (err) {
      setAddProduitError("Erreur lors de la création du produit.");
    }
  };

  // Log pour debug filtrage produits dans le modal
  useEffect(() => {
    console.log('[AchatModal] produitSearch:', produitSearch);
    console.log('[AchatModal] produitResults:', produitResults);
  }, [produitSearch, produitResults]);

  if (!show) return null;

  return (
    <div className="modal-bg">
      <div ref={modalRef} className="achat-modal-container">
        <div className="achat-modal-title">Ajouter un achat</div>
        <label className="achat-modal-label">Produit</label>
        <div style={{position:'relative',marginBottom:18}}>
          <input
            type="text"
            placeholder="Nom du produit..."
            value={produitSearch}
            ref={produitInputRef}
            onChange={e => { 
              setProduitSearch(e.target.value); 
              setSelectedProduit(null); 
              setHighlightedProduit(-1); 
              setProduitDropdown(e.target.value.length >= 3 && produitResults.length > 0);
              justSelectedRef.current = false;
            }}
            onBlur={e => {
              setTimeout(() => {
                setProduitDropdown(false);
                justSelectedRef.current = false;
              }, 120);
            }}
            onKeyDown={e => {
              handleProduitKeyDown(e);
              if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && produitResults.length > 0 && produitSearch.length >= 3) {
                setProduitDropdown(true);
              }
            }}
            className="achat-modal-input"
            autoComplete="off"
          />
          <div className="achat-modal-hint">
            Commencer à écrire pour voir les suggestions
          </div>
          {produitDropdown && produitResults.length === 0 && produitSearch.length >= 3 && !showAddProduit && (
            <button
              className="achat-modal-add-btn"
              onMouseDown={e => {
                e.preventDefault();
                e.stopPropagation();
                setShowAddProduit(true);
                setNewProduitNom(produitSearch);
              }}
            >
              <i className="fa fa-plus-circle" style={{marginRight:6}}></i>
              Ajouter "{produitSearch}" comme nouveau produit
            </button>
          )}
          {produitDropdown && produitResults.length > 0 && (
            <ul className="achat-modal-dropdown-list">
              {produitResults.map((p, idx) => (
                <li key={p.id}
                  onMouseDown={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelectProduit(p);
                  }}
                  className={highlightedProduit===idx?"selected":""}
                  onMouseEnter={()=>setHighlightedProduit(idx)}
                >
                  {p.nom} <span style={{color:'#888',fontSize:13}} onMouseDown={e => e.stopPropagation()}>({Number(p.prix).toFixed(2)} €)</span>
                </li>
              ))}
            </ul>
          )}
          {produitLoading && <div style={{position:'absolute',right:10,top:10,color:'#888'}}><i className="fa fa-spinner fa-spin"></i></div>}
        </div>
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
            onCreate={e => {
              handleCreateProduit();
              if (e && e.stopPropagation) e.stopPropagation();
            }}
            onCancel={e => {
              setShowAddProduit(false);
              if (e && e.stopPropagation) e.stopPropagation();
            }}
          />
        )}
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
          <button type="button" className="add-btn" onClick={() => {
            if (!produitSearch || !selectedProduit) {
              setAjoutAchatError('Veuillez sélectionner un produit avant d\'ajouter.');
              setTimeout(() => setAjoutAchatError(''), 2000);
              return;
            }
            setAjoutAchatError("");
            handleAddAchat(false);
          }}>
            Ajouter
          </button>
          <button type="button" className="cancel-btn" onClick={onClose}>
            Terminer
          </button>
        </div>
      </div>
    </div>
  );
}

export default AchatModal;
