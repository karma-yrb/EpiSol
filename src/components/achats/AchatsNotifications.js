import React from 'react';

/**
 * Composant pour afficher les notifications de succès et d'erreur
 */
function AchatsNotifications({ saveSuccess, saveError }) {
  if (!saveSuccess && !saveError) return null;

  return (
    <>
      {saveSuccess && (
        <div className="notification success achats-notification">
          <i className="fa fa-check-circle"></i> Achats enregistrés avec succès !
        </div>
      )}
      {saveError && (
        <div className="notification error achats-notification">
          <i className="fa fa-exclamation-circle"></i> {saveError}
        </div>
      )}
    </>
  );
}

export default AchatsNotifications;
