import React, { useState, useEffect } from 'react';
import '../commun/UniForm.css';

function UserForm({ formData, handleChange, id, hidePasswordField, userRole }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <label>Nom *</label>
      <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />

      <label>Prénom *</label>
      <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />

      <label>Email *</label>
      <input type="email" name="email" value={formData.email} onChange={handleChange} required />

      <label>Nom d'utilisateur *</label>
      <input type="text" name="username" value={formData.username} onChange={handleChange} required />

      {/* On masque le champ mot de passe si hidePasswordField est true */}
      {!hidePasswordField && (
        <>
          <label htmlFor="password">{id ? 'Changer le mot de passe' : 'Mot de passe *'}</label>
          <div className="password-field-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              className="password-input"
            />
            <i
              className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}
              aria-hidden="true"
              title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              tabIndex={0}
              onClick={() => setShowPassword((v) => !v)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setShowPassword(v => !v); }}
            />
          </div>
        </>
      )}

      {/* Afficher le champ rôle sauf si création par admin */}
      {!(userRole === 'admin' && !id) && (
        <>
          <label>Rôle</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="">Sélectionnez un rôle</option>
            <option value="admin">Admin</option>
            <option value="user">Utilisateur</option>
          </select>
        </>
      )}
    </>
  );
}

export default UserForm;
