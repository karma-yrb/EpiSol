import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Composant pour la sélection d'un bénéficiaire
 */
function BeneficiaireSelector({
  searchB,
  setSearchB,
  filteredB,
  selectedB,
  setSelectedB,
  showDropdown,
  setShowDropdown,
  showNoResults,
  searchRef,
  highlighted,
  setHighlighted,
  handleSelectB,
  handleKeyDown
}) {
  const navigate = useNavigate();

  return (
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
              <li 
                key={b.id} 
                onMouseDown={() => handleSelectB(b)}
                className={highlighted === idx ? "selected" : ""}
                onMouseEnter={() => setHighlighted(idx)}
              >
                {b.nom} {b.prenom} <span className="achats-beneficiaire-num">({b.numero})</span>
              </li>
            ))}
          </ul>
        )}
        {showNoResults && (
          <div className="achats-no-results">
            <div className="achats-no-results-message">
              <i className="fa fa-search"></i>
              Aucun bénéficiaire trouvé avec "{searchB}"
            </div>
            <button 
              className="achats-add-beneficiaire-btn"
              onClick={() => navigate('/beneficiaires/add')}
            >
              <i className="fa fa-plus"></i>
              Ajouter un nouveau bénéficiaire
            </button>
          </div>
        )}
      </div>
      {selectedB && (
        <div className="achats-beneficiaire-selected">
          <i className="fa fa-check-circle"></i>
          Bénéficiaire sélectionné : {selectedB.nom} {selectedB.prenom}
        </div>
      )}
    </div>
  );
}

export default BeneficiaireSelector;
