import React from 'react';

/**
 * Composant pour la recherche et sélection de produits avec dropdown
 */
function ProductSearchDropdown({
  produitSearch,
  setProduitSearch,
  produitResults,
  produitLoading,
  selectedProduit,
  setSelectedProduit,
  produitDropdown,
  setProduitDropdown,
  produitInputRef,
  highlightedProduit,
  setHighlightedProduit,
  handleProduitKeyDown,
  onOpenAddProduit,
  showAddProduit
}) {
  
  const handleSelectProduit = (p) => {
    setSelectedProduit(p);
    setProduitSearch(p.nom);
    setProduitDropdown(false);
    setHighlightedProduit(-1);
    if (produitInputRef.current) produitInputRef.current.blur();
  };

  return (
    <div style={{position:'relative', marginBottom:18}}>
      <input
        type="text"
        placeholder="Nom du produit..."
        value={produitSearch}
        ref={produitInputRef}        onChange={e => { 
          setProduitSearch(e.target.value); 
          setSelectedProduit(null); 
          setHighlightedProduit(-1); 
          setProduitDropdown(e.target.value.length >= 3);
        }}        onBlur={e => {
          // Ne pas fermer le dropdown si l'utilisateur clique sur le bouton d'ajout
          setTimeout(() => {
            if (!e.relatedTarget || !e.relatedTarget.classList.contains('achat-modal-add-btn')) {
              setProduitDropdown(false);
            }
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
      </div>      {/* Bouton pour ajouter un nouveau produit */}
      {(produitDropdown || produitResults.length === 0) && produitSearch.length >= 3 && !showAddProduit && !selectedProduit && (
        <button
          className="achat-modal-add-btn"
          onMouseDown={e => {
            e.preventDefault();
            e.stopPropagation();
            onOpenAddProduit(produitSearch);
            setProduitDropdown(false); // Fermer le dropdown après ouverture du modal
          }}
        >
          <i className="fa fa-plus-circle" style={{marginRight:6}}></i>
          Ajouter "{produitSearch}" comme nouveau produit
        </button>
      )}
      
      {/* Liste déroulante des résultats */}
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
              {p.nom} <span style={{color:'#888',fontSize:13}}>({Number(p.prix).toFixed(2)} €)</span>
            </li>
          ))}
        </ul>
      )}
      
      {/* Indicateur de chargement */}
      {produitLoading && (
        <div style={{position:'absolute',right:10,top:10,color:'#888'}}>
          <i className="fa fa-spinner fa-spin"></i>
        </div>
      )}
    </div>
  );
}

export default ProductSearchDropdown;
