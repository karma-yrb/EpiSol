import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../commun/UniForm.css';
import './ManageUsers.css';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import { fetchUsers, deleteUser, fetchUserLogs } from '../../api/usersApi';
import ActionIconButton from '../commun/ActionIconButton';
import UserLastLogin from './UserLastLogin';

function ManageUsers({ userConnected }) {
  const [users, setUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [notif, setNotif] = useState({ type: '', message: '' });
  const [deleteStatus, setDeleteStatus] = useState('idle');
  const [deleteMsg, setDeleteMsg] = useState('');
  const [logsModalUser, setLogsModalUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState("");
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

  // Récupère les logs de connexion pour un utilisateur et ouvre la modale
  const handleShowLogs = async (user) => {
    setLogsModalUser(user);
    setLogs([]);
    setLogsError("");
    setLogsLoading(true);
    try {
      const logsData = await fetchUserLogs(user.id);
      setLogs(logsData);
    } catch (e) {
      setLogsError("Erreur lors du chargement des logs.");
    }
    setLogsLoading(false);
  };

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
          <tr><th>Nom</th><th>Prénom</th><th>Dernière connexion</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(user => (
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
                <ActionIconButton type="delete" title="Supprimer" onClick={() => { setUserToDelete(user.id); setShowDeleteModal(true); }} />
                <ActionIconButton type="view" title="Voir logs" onClick={() => handleShowLogs(user)} />
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
          icon={<i className="fa fa-exclamation-triangle icon-red icon-action mr-8"></i>}
        />
      )}
      {/* Modal pour afficher les logs de l'utilisateur sélectionné */}
      {logsModalUser && (
        <div className="modal-bg" style={{zIndex:2000}}>
          <div className="gestion-modal-container" style={{maxWidth:420}}>
            <div className="gestion-modal-title">Logs de connexion<br/>{logsModalUser.nom} {logsModalUser.prenom}</div>
            {logsLoading ? (
              <div style={{textAlign:'center',margin:'18px 0'}}><i className="fa fa-spinner fa-spin"></i> Chargement...</div>
            ) : logsError ? (
              <div className="achat-modal-error">{logsError}</div>
            ) : logs.length === 0 ? (
              <div style={{color:'#888',textAlign:'center'}}>Aucune connexion enregistrée.</div>
            ) : (
              <table className="produits-table" style={{marginTop:8}}>
                <thead>
                  <tr><th>Date/heure</th><th>IP</th><th>User-Agent</th></tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id}>
                      <td>{new Date(log.created_at).toLocaleString()}</td>
                      <td>{log.ip || '-'}</td>
                      <td style={{maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{log.user_agent || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button className="gestion-modal-close" onClick={()=>setLogsModalUser(null)} style={{marginTop:18}}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
