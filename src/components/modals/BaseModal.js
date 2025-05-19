import React from 'react';
import '../commun/UniForm.css';

/**
 * Composant modal de base : gère le fond, le centrage, l'accessibilité et le rendu conditionnel.
 * Props :
 *   - show : bool (affiche ou non le modal)
 *   - onClose : fonction appelée à la fermeture (optionnel)
 *   - children : contenu du modal
 *   - className : classe CSS supplémentaire pour le conteneur (optionnel)
 */
function BaseModal({ show, onClose, children, className = '' }) {
  if (!show) return null;
  return (
    <div className="modal-bg" onClick={onClose ? (e => { if (e.target.classList.contains('modal-bg')) onClose(); }) : undefined}>
      <div className={`base-modal-container ${className}`} role="dialog" aria-modal="true">
        {children}
      </div>
    </div>
  );
}

export default BaseModal;
