import React, { useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../commun/UniForm.css';
import '../commun/UnifiedTable.css';
import './ManageUsers.css';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import { fetchUsers, deleteUser } from '../../api/usersApi';
import ActionIconButton from '../commun/ActionIconButton';
import SortableTable from '../commun/SortableTable';
import '../commun/SortableTable.css';
import UserLastLogin from './UserLastLogin';
import { useGenericData } from '../../hooks/useGenericData';
import { AuthContext } from '../../context/AuthContext';

function ManageUsers({ userConnected }) {
  const { userRole } = useContext(AuthContext);
  const navigate = useNavigate();
  // Utilisation du hook générique avec options personnalisées
  const {
    data: users,
    loading,
    showDeleteModal,
    notif,
    deleteStatus,
    handleDelete,
    confirmDelete,
    cancelDelete
  } = useGenericData({
    fetchFunction: async () => {
      const data = await fetchUsers();
      // Filtrage côté UI pour plus de sécurité (en plus du backend)
      if (userRole === 'admin') {
        return data.filter(user => user.role !== 'admin' && user.role !== 'superadmin');
      }
      return data;
    },
    deleteFunction: deleteUser,
    entityName: 'utilisateur',
    entityNamePlural: 'utilisateurs'
  });
  useEffect(() => {
    if (!userConnected) {
      navigate('/access-denied');
      return;
    }
  }, [userConnected, navigate]);

  // Colonnes pour le tableau triable
  const columns = [
    { label: 'Nom', key: 'nom', sortable: true },
    { label: 'Prénom', key: 'prenom', sortable: true },
    { label: 'Dernière connexion', key: 'derniere_connexion', sortable: false, render: (row) => (
      <UserLastLogin userId={row.id} />
    ) },
    { label: 'Actions', key: 'actions', sortable: false, render: (row) => (
      <div className="actions-cell">
        {/* Masquer édition/suppression si admin simple et cible admin/superadmin */}
        {!(userRole === 'admin' && (row.role === 'admin' || row.role === 'superadmin')) && (
          <Link to={`/users/edit/${row.id}`} className="edit-link">
            <ActionIconButton type="edit" title="Éditer" onClick={e => e.stopPropagation()} />
          </Link>
        )}
        {!(userRole === 'admin' && (row.role === 'admin' || row.role === 'superadmin')) && (
          <ActionIconButton type="delete" title="Supprimer" onClick={() => handleDelete(row.id)} />
        )}
        <ActionIconButton type="view" title="Voir logs" onClick={() => window.location.href = `/users/${row.id}/logs`} />
      </div>
    ) },
  ];
  if (loading) {
    return (
      <div className="page-centered-container" data-page="manage-users">
        <div className="loading">
          <i className="fa fa-spinner fa-spin"></i> Chargement...
        </div>
      </div>
    );
  }

  return (
    <div className="page-centered-container" data-page="manage-users">
      <h1>
        <i className="fa fa-user icon-blue icon-lg mr-8"></i>
        Gestion des utilisateurs
      </h1>
      {/* Masquer le bouton d'ajout si admin simple */}
      {userRole !== 'admin' && (
        <Link to="/users/add">
          <button className="create-button"><i className="fa fa-plus mr-6"></i>Ajouter un utilisateur</button>
        </Link>
      )}

      {loading ? (
        <div className="loading centered-text">
          <i className="fa fa-spinner fa-spin"></i> Chargement...
        </div>
      ) : (
        <SortableTable
          columns={columns}
          data={users || []}
          initialSort={{ col: 'nom', dir: 'asc' }}
        />
      )}
      {notif.message && (
        <div className={`notification ${notif.type}`}>
          <i className={`fa fa-${notif.type==='success'?'check-circle':'exclamation-circle'}`}></i> {notif.message}
        </div>
      )}
      {showDeleteModal && (        <ConfirmDeleteModal
          show={showDeleteModal}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          status={deleteStatus}
          message=""
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          title="Confirmer la suppression de l'utilisateur ?"
          icon={<i className="fa fa-exclamation-triangle icon-red icon-action mr-8"></i>}
        />
      )}
    </div>
  );
}

export default ManageUsers;
