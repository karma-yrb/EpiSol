import React from 'react';
import '../styles/AchatModal.css';
import ActionIconButton from '../../commun/ActionIconButton';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function AchatDetailsModal({ show, details, loading, onClose }) {
  if (!show) return null;

  // Export PDF corrigé : utiliser autoTable(doc, ...)
  const handleExportPDF = () => {
    if (!details || !details.lignes) return;
    const doc = new jsPDF();
    doc.text(`Détail de l'achat`, 14, 14);
    doc.text(`Bénéficiaire : ${details.beneficiaire_nom} ${details.beneficiaire_prenom || ''}`, 14, 22);
    doc.text(`Date : ${details.date_achat ? formatDateFR(details.date_achat) : ''}`, 14, 30);
    doc.text(`Total : ${Number(details.total).toFixed(2)} €`, 14, 38);
    doc.text(`Quantité totale : ${quantiteTotale}`, 14, 46);
    autoTable(doc, {
      startY: 54,
      head: [['Produit', 'Quantité', 'Prix unitaire', 'Sous-total']],
      body: details.lignes.map(l => [
        l.produit_nom,
        l.quantite,
        Number(l.prix_unitaire).toFixed(2) + ' €',
        (l.quantite * l.prix_unitaire).toFixed(2) + ' €'
      ]),
      styles: { fontSize: 10 }
    });
    doc.save(`achat_${details.id || 'details'}.pdf`);
  };
  // Export XLSX (Excel)
  const handleExportXLS = () => {
    if (!details || !details.lignes) return;
    const ws = XLSX.utils.json_to_sheet(details.lignes.map(l => ({
      'Produit': l.produit_nom,
      'Quantité': l.quantite,
      'Prix unitaire': Number(l.prix_unitaire).toFixed(2),
      'Sous-total': (l.quantite * l.prix_unitaire).toFixed(2)
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Achats');
    XLSX.writeFile(wb, `achat_${details.id || 'details'}.xlsx`);
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
                  className="bg-xls"
                  onClick={handleExportXLS}
                />
              </div>
              <ActionIconButton
                type="custom"
                icon="fa-times"
                title="Fermer"
                className="bg-grey"
                onClick={onClose}
              >
                <span style={{marginLeft:8}}>Fermer</span>
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
