import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../commun/UniForm.css';
import './ManageUsers.css';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import { fetchUsers, deleteUser } from '../../api/usersApi';

function ManageUsers({ userConnected }) {
  const [users, setUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [notif, setNotif] = useState({ type: '', message: '' });
  const [deleteStatus, setDeleteStatus] = useState('idle');
  const [deleteMsg, setDeleteMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userConnected) {
      navigate('/access-denied');
      return;
    }
    fetchUsers()
      .then((data) => {
        // Exclure l'utilisateur connecté et l'utilisateur "Admin" (username === 'admin')
        const filteredUsers = data.filter(
          (user) => user.username !== userConnected && user.username !== 'admin'
        );
        setUsers(filteredUsers);
      })
      .catch((error) => console.error('Erreur lors de la récupération des utilisateurs :', error));
  }, [userConnected, navigate]);

  const confirmDelete = async () => {
    setDeleteStatus('loading');
    setDeleteMsg('');
    try {
      await deleteUser(userToDelete);
      setUsers(users.filter(u => u.id !== userToDelete));
      setDeleteStatus('success');
      setDeleteMsg('Utilisateur supprimé.');
    } catch {
      setDeleteStatus('error');
      setDeleteMsg('Erreur lors de la suppression.');
    }
  };

  useEffect(() => {
    if (deleteStatus === 'success' || deleteStatus === 'error') {
      const timer = setTimeout(() => {
        setShowDeleteModal(false);
        setUserToDelete(null);
        setDeleteStatus('idle');
        setDeleteMsg('');
        if (deleteStatus === 'success') setNotif({ type: 'success', message: 'Utilisateur supprimé.' });
        if (deleteStatus === 'error') setNotif({ type: 'error', message: deleteMsg });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [deleteStatus, deleteMsg]);

  return (
    <div className="page-centered-container">
      <h1>
        <i className="fa fa-user icon-blue icon-lg mr-8"></i>
        Gestion des utilisateurs
      </h1>
      <Link to="/users/add">
        <button className="create-button"><i className="fa fa-plus mr-6"></i>Ajouter un utilisateur</button>
      </Link>
      <table className="produits-table">
        <thead>
          <tr><th>Nom</th><th>Prénom</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.nom}</td>
              <td>{user.prenom}</td>
              <td className="actions-cell">
                <Link to={`/users/edit/${user.id}`} className="edit-link">
                  <button className="edit-button" title="Éditer">
                    <i className="fa fa-edit"></i>
                  </button>
                </Link>
                <button className="delete-button" onClick={() => { setUserToDelete(user.id); setShowDeleteModal(true); }} title="Supprimer">
                  <i className="fa fa-trash"></i>
                </button>
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
      {showDeleteModal && (
        <ConfirmDeleteModal
          show={showDeleteModal}
          onConfirm={confirmDelete}
          onCancel={() => { setShowDeleteModal(false); setUserToDelete(null); setDeleteStatus('idle'); setDeleteMsg(''); }}
          status={deleteStatus}
          message={deleteMsg}
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          title="Confirmer la suppression de l'utilisateur ?"
          icon={<i className="fa fa-exclamation-triangle icon-red mr-8"></i>}
        />
      )}
    </div>
  );
}

export default ManageUsers;
