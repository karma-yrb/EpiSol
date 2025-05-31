import React from 'react';

/**
 * Composant pour la barre de recherche et les filtres
 */
function AchatsSearchBar({ search, setSearch, beneficiaireId, handleClearFilters }) {
  return (
    <div className="achats-list-search-row">
      <input
        type="text"
        placeholder="Recherche globale..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="achats-list-search-input"
      />
      {(beneficiaireId || (search && search.trim().length > 0)) && (
        <button
          className="clear-filters-btn"
          onClick={handleClearFilters}
          type="button"
        >
          <i className="fa fa-times-circle" aria-hidden="true"></i>
          <span className="clear-filters-label">Supprimer les filtres</span>
        </button>
      )}
    </div>
  );
}

export default AchatsSearchBar;
