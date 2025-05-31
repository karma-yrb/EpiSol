import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../commun/UniForm.css';
import './ManageUsers.css';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import { fetchUsers, deleteUser } from '../../api/usersApi';
import ActionIconButton from '../commun/ActionIconButton';
import UserLastLogin from './UserLastLogin';
import { useGenericData } from '../../hooks/useGenericData';

function ManageUsers({ userConnected }) {
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
      // Exclure l'utilisateur connecté et l'utilisateur "Admin"
      return data.filter(
        (user) => user.username !== userConnected && user.username !== 'admin'
      );
    },
    deleteFunction: deleteUser,
    entityName: 'utilisateur',
    entityNamePlural: 'utilisateurs'
  });

  useEffect(() => {
    if (!userConnected) {
      navigate('/access-denied');
      return;
    }  }, [userConnected, navigate]);

  if (loading) {
    return (
      <div className="page-centered-container">
        <div className="loading">
          <i className="fa fa-spinner fa-spin"></i> Chargement...
        </div>
      </div>
    );
  }

  return (
    <div className="page-centered-container">
      <h1>
        <i className="fa fa-user icon-blue icon-lg mr-8"></i>
        Gestion des utilisateurs
      </h1>
      <Link to="/users/add">
        <button className="create-button"><i className="fa fa-plus mr-6"></i>Ajouter un utilisateur</button>
      </Link>
      <table className="produits-table">        <thead>
          <tr><th>Nom</th><th>Prénom</th><th>Dernière connexion</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users && users.map(user => (
            <tr key={user.id}>
              <td>{user.nom}</td>
              <td>{user.prenom}</td>
              <td>
                <UserLastLogin userId={user.id} />
              </td>
              <td className="actions-cell">
                <Link to={`/users/edit/${user.id}`} className="edit-link">
                  <ActionIconButton type="edit" title="Éditer" onClick={e => e.stopPropagation()} />
                </Link>
                <ActionIconButton type="delete" title="Supprimer" onClick={() => handleDelete(user.id)} />
                <ActionIconButton type="view" title="Voir logs" onClick={() => window.location.href = `/users/${user.id}/logs`} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
