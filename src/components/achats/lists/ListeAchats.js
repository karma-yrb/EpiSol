import React from 'react';
import '../styles/Achats.css';
import '../styles/ListeAchats.css';
import ConfirmDeleteModal from '../../modals/ConfirmDeleteModal';
import AchatDetailsModal from '../forms/AchatDetailsModal';
import GenericSearchBar from '../../commun/GenericSearchBar';
import AchatsTableList from './AchatsTableList';
import { useAchatsData } from '../hooks/useAchatsData';
import { useAchatsFilters } from '../hooks/useAchatsFilters';

function ListeAchats() {
  // Hooks personnalisés pour séparer les logiques
  const {
    achats,
    loading,
    deleteId,
    showDeleteModal,
    setShowDeleteModal,
    setDeleteId,
    notif,
    detailsId,
    setDetailsId,
    details,
    detailsLoading,
    deleteStatus,
    setDeleteStatus,
    handleDelete,
    confirmDelete,
    handleDetails
  } = useAchatsData();

  const {
    search,
    setSearch,
    sortCol,
    sortDir,
    beneficiaireId,
    achatsTries,
    handleClearFilters,
    handleSort
  } = useAchatsFilters(achats);

  return (
    <div className="page-centered-container">
      <h1 className="page-title">
        <i className="fa fa-list-alt" style={{color:'#007bff',fontSize:28,marginRight:8}}></i>
        Historique des achats
      </h1>
      
      {notif.message && (
        <div className={`notification ${notif.type}`}>{notif.message}</div>
      )}
      
      {loading ? (
        <div className="loading">
          <i className="fa fa-spinner fa-spin"></i> Chargement...
        </div>      ) : (
        <>
          <GenericSearchBar
            search={search}
            onSearchChange={setSearch}
            placeholder="Recherche globale..."
            className="achats-list-search-row"
            showClearFilters={true}
            onClearFilters={handleClearFilters}
            hasActiveFilters={beneficiaireId || (search && search.trim().length > 0)}
          />
          
          <AchatsTableList
            achatsTries={achatsTries}
            sortCol={sortCol}
            sortDir={sortDir}
            handleSort={handleSort}
            handleDetails={handleDetails}
            handleDelete={handleDelete}
          />
        </>
      )}

      {showDeleteModal && (
        <ConfirmDeleteModal
          show={showDeleteModal}
          onConfirm={confirmDelete}
          onCancel={() => { 
            setShowDeleteModal(false); 
            setDeleteId(null); 
            setDeleteStatus('idle'); 
          }}
          status={deleteStatus}
          message={
            deleteStatus === 'error' ? "Erreur lors de la suppression." : 
            deleteStatus === 'success' ? "Achat supprimé." : 
            "Confirmer la suppression de cet achat ?"
          }
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          title="Supprimer l'achat ?"
          icon={<i className="fa fa-exclamation-triangle" style={{color:'#c00',marginRight:8}}></i>}
        />
      )}

      <AchatDetailsModal
        show={!!detailsId}
        details={details}
        loading={detailsLoading}
        onClose={() => setDetailsId(null)}
      />

      <div className="achats-info">
        <i className="fa fa-info-circle"></i>
        Cette section est en cours de développement.
      </div>
    </div>
  );
}

export default ListeAchats;
