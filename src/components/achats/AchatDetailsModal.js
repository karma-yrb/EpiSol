import React from 'react';
import './AchatModal.css';
import ActionIconButton from '../commun/ActionIconButton';

function AchatDetailsModal({ show, details, loading, onClose }) {
  if (!show) return null;

  // Fonctions d'export simples (mock, à remplacer par une vraie logique si besoin)
  const handleExportPDF = () => {
    alert('Export PDF non implémenté (démo)');
  };
  const handleExportXLS = () => {
    alert('Export XLS non implémenté (démo)');
  };
  const handleExportExcel = () => {
    alert('Export Excel non implémenté (démo)');
  };

  // Calcul quantité totale
  const quantiteTotale = details && details.lignes
    ? details.lignes.reduce((sum, l) => sum + (l.quantite || 0), 0)
    : (typeof details?.quantite === 'number' ? details.quantite : '');

  // Formatage date : jjjj jj mmmm aaaa hh.mm
  function formatDateFR(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const jours = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
    const mois = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
    const jourSemaine = jours[d.getDay()];
    const jour = d.getDate().toString().padStart(2,'0');
    const moisNom = mois[d.getMonth()];
    const annee = d.getFullYear();
    const heures = d.getHours().toString().padStart(2,'0');
    const minutes = d.getMinutes().toString().padStart(2,'0');
    return `${jourSemaine} ${jour} ${moisNom} ${annee} ${heures}:${minutes}`;
  }

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="achat-modal-container" onClick={e => e.stopPropagation()}>
        <div className="achat-modal-title">Détail de l'achat</div>
        {loading ? (
          <div className="centered-text"><i className="fa fa-spinner fa-spin"></i> Chargement...</div>
        ) : details ? (
          <>
            <div className="mb-10">
              <b>Bénéficiaire :</b> {details.beneficiaire_nom} {details.beneficiaire_prenom}<br/>
              <b>Date :</b> {details.date_achat ? formatDateFR(details.date_achat) : ''}<br/>
              <b>Total :</b> {Number(details.total).toFixed(2)} €<br/>
              <b>Quantité totale :</b> {quantiteTotale}
            </div>
            <table className="produits-table achats-list-table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Quantité</th>
                  <th>Prix unitaire</th>
                  <th>Sous-total</th>
                </tr>
              </thead>
              <tbody>
                {details.lignes && details.lignes.map((l, idx) => (
                  <tr key={idx}>
                    <td>{l.produit_nom}</td>
                    <td>{l.quantite}</td>
                    <td>{Number(l.prix_unitaire).toFixed(2)} €</td>
                    <td>{(l.quantite * l.prix_unitaire).toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="achat-details-actions-row">
              <div className="achat-details-export-btns">
                <ActionIconButton
                  type="custom"
                  icon="fa-file-pdf-o"
                  title="Exporter en PDF"
                  className="bg-red"
                  onClick={handleExportPDF}
                />
                <ActionIconButton
                  type="custom"
                  icon="fa-file-excel-o"
                  title="Exporter en XLS"
                  className="bg-excel"
                  onClick={handleExportXLS}
                />
                <ActionIconButton
                  type="custom"
                  icon="fa-file-excel-o"
                  title="Exporter en Excel"
                  className="bg-excel"
                  onClick={handleExportExcel}
                />
              </div>
              <ActionIconButton
                type="custom"
                icon="fa-times"
                title="Fermer"
                className="bg-grey"
                onClick={onClose}
              >
                Fermer
              </ActionIconButton>
            </div>
          </>
        ) : (
          <div>Erreur lors du chargement du détail.</div>
        )}
      </div>
    </div>
  );
}

export default AchatDetailsModal;
