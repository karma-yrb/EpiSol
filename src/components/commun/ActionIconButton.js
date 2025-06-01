// Bouton d'action factorisé pour supprimer, éditer, voir, etc.
import React from 'react';
import PropTypes from 'prop-types';
import './ActionIconButton.css';

/**
 * Props :
 * - type: 'edit' | 'delete' | 'view' | 'save' | 'custom' (définit l'icône et la couleur)
 * - onClick: fonction à appeler au clic
 * - title: texte d'accessibilité
 * - icon: string FontAwesome (optionnel, pour type 'custom')
 * - className: string (optionnel)
 * - disabled: bool (optionnel)
 */
const ICONS = {
  edit:   { icon: 'fa-edit', bg: 'bg-blue' },
  delete: { icon: 'fa-trash', bg: 'bg-red' },
  view:   { icon: 'fa-eye', bg: 'bg-cyan' },
  save:   { icon: 'fa-save', bg: 'bg-green' },
  cart:   { icon: 'fa-shopping-cart', bg: 'bg-orange' },
};

function ActionIconButton({ type = 'edit', onClick, title, icon, className = '', disabled = false, ...props }) {
  const iconClass = icon || ICONS[type]?.icon || 'fa-question-circle';
  // Si type=custom, n'applique pas de bg par défaut, laisse la classe passée
  const bgClass = type === 'custom' ? '' : (ICONS[type]?.bg || 'bg-grey');
  return (
    <button
      className={`action-icon-btn ${bgClass} ${className}`.trim()}
      title={title}
      onClick={onClick}
      disabled={disabled}
      type="button"
      {...props}
    >
      <i className={`fa ${iconClass} icon-action`}></i>
    </button>
  );
}

ActionIconButton.propTypes = {
  type: PropTypes.oneOf(['edit', 'delete', 'view', 'save', 'cart', 'custom']),
  onClick: PropTypes.func,
  title: PropTypes.string,
  icon: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default ActionIconButton;
