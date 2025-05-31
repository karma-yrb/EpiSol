import React from 'react';

/**
 * Composant générique de barre de recherche réutilisable
 * @param {string} search - Valeur de recherche actuelle
 * @param {function} onSearchChange - Callback pour changement de recherche
 * @param {string} placeholder - Texte du placeholder
 * @param {string} className - Classes CSS additionnelles
 * @param {Array} actions - Boutons d'action à afficher
 * @param {boolean} showClearFilters - Afficher le bouton supprimer filtres
 * @param {function} onClearFilters - Callback pour supprimer les filtres
 * @param {boolean} hasActiveFilters - Indique si des filtres sont actifs
 */
function GenericSearchBar({ 
  search, 
  onSearchChange, 
  placeholder = "Rechercher...", 
  className = "",
  actions = [],
  showClearFilters = false,
  onClearFilters,
  hasActiveFilters = false
}) {
  return (
    <div className={`search-bar-container ${className}`}>
      {/* Groupe de boutons d'action (si fourni) */}
      {actions.length > 0 && (
        <div className="search-actions-group">
          {actions.map((action, index) => (
            <button 
              key={index}
              onClick={action.onClick} 
              className={action.className || "search-action-btn"} 
              title={action.title}
              type="button"
            >
              {action.icon && <i className={action.icon}></i>}
              {action.label && <span className="ml-6">{action.label}</span>}
            </button>
          ))}
        </div>
      )}
      
      {/* Champ de recherche */}
      <div className="search-input-group">
        <input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className="search-input"
        />
        
        {/* Bouton supprimer filtres */}
        {showClearFilters && hasActiveFilters && (
          <button
            className="clear-filters-btn"
            onClick={onClearFilters}
            type="button"
            title="Supprimer les filtres"
          >
            <i className="fa fa-times-circle" aria-hidden="true"></i>
            <span className="clear-filters-label">Supprimer les filtres</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default GenericSearchBar;