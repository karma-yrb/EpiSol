import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UniForm.css';
import './Profile.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

function Profile() {
  const [user, setUser] = useState({ nom: '', prenom: '', email: '', username: '' });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/access-denied');
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;
      fetch(`${API_BASE_URL}/api/users/${userId}`)
        .then((response) => response.json())
        .then((data) => setUser(data))
        .catch(() => navigate('/access-denied'));
    } catch {
      navigate('/access-denied');
    }
  }, [navigate]);

  function validatePassword(pw) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(pw);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    if (name === 'currentPassword') setCurrentPassword(value);
    if (name === 'newPassword') setNewPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setSuccessMsg('');
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        setPasswordError('Tous les champs de mot de passe sont obligatoires pour changer le mot de passe.');
        return;
      }
      if (!validatePassword(newPassword)) {
        setPasswordError('Le nouveau mot de passe doit contenir au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError('Les deux nouveaux mots de passe ne correspondent pas.');
        return;
      }
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: user.username, password: currentPassword })
        });
        if (!response.ok) {
          setPasswordError('Mot de passe actuel incorrect.');
          setLoading(false);
          return;
        }
        const updateRes = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...user, password: newPassword })
        });
        if (updateRes.ok) {
          setSuccessMsg('Mot de passe modifié avec succès.');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          setPasswordError('Erreur lors de la mise à jour du mot de passe.');
        }
      } catch (err) {
        setPasswordError('Erreur serveur.');
      }
      setLoading(false);
    } else {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;
        const updateRes = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        });
        if (updateRes.ok) {
          setSuccessMsg('Profil mis à jour avec succès.');
        } else {
          setPasswordError('Erreur lors de la mise à jour du profil.');
        }
      } catch (err) {
        setPasswordError('Erreur serveur.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="page-centered-container">
      <h1 className="profile-title">
        <i className="fa fa-user-circle"></i>
        Mon profil
      </h1>
      <form className="uni-form" onSubmit={handleSubmit}>
        <label>Nom</label>
        <input type="text" name="nom" value={user.nom} onChange={handleChange} />
        <label>Prénom</label>
        <input type="text" name="prenom" value={user.prenom} onChange={handleChange} />
        <label>Email</label>
        <input type="email" name="email" value={user.email} onChange={handleChange} />
        <label>Nom d'utilisateur</label>
        <input type="text" name="username" value={user.username} onChange={handleChange} />
        <label htmlFor="currentPassword">Mot de passe actuel *</label>
        <div className="password-field-wrapper">
          <input
            id="currentPassword"
            type={showCurrent ? 'text' : 'password'}
            name="currentPassword"
            value={currentPassword}
            onChange={handleChange}
            autoComplete="current-password"
            className="password-input"
          />
          <i
            className={showCurrent ? "fa fa-eye-slash" : "fa fa-eye"}
            aria-hidden="true"
            title={showCurrent ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            tabIndex={0}
            onClick={() => setShowCurrent(v => !v)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setShowCurrent(v => !v); }}
          />
        </div>
        <label htmlFor="newPassword">Nouveau mot de passe *</label>
        <div className="password-field-wrapper">
          <input
            id="newPassword"
            type={showNew ? 'text' : 'password'}
            name="newPassword"
            value={newPassword}
            onChange={handleChange}
            autoComplete="new-password"
            className="password-input"
          />
          <i
            className={showNew ? "fa fa-eye-slash" : "fa fa-eye"}
            aria-hidden="true"
            title={showNew ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            tabIndex={0}
            onClick={() => setShowNew(v => !v)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setShowNew(v => !v); }}
          />
        </div>
        <div className="form-help">
          {`8 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 spécial.`}
        </div>
        <label htmlFor="confirmPassword">Vérifier le nouveau mot de passe *</label>
        <div className="password-field-wrapper">
          <input
            id="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            className="password-input"
          />
          <i
            className={showConfirm ? "fa fa-eye-slash" : "fa fa-eye"}
            aria-hidden="true"
            title={showConfirm ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            tabIndex={0}
            onClick={() => setShowConfirm(v => !v)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setShowConfirm(v => !v); }}
          />
        </div>
        {passwordError && <div className="form-error">{passwordError}</div>}
        {successMsg && <div className="form-success">{successMsg}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Mise à jour...' : 'Mettre à jour'}</button>
      </form>
    </div>
  );
}

export default Profile;