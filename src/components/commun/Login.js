import React, { useState, useEffect } from 'react';
import './UniForm.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Vérifie si le CDN est déjà présent
    if (!document.getElementById('fa-cdn')) {
      const link = document.createElement('link');
      link.id = 'fa-cdn';
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        window.location.href = '/';
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!username || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Erreur de connexion.');
        setLoading(false);
        return;
      }
      if (onLogin) onLogin(data.token, data.username);
      setSuccess(true);
      setLoading(false);
      // Redirige vers l'accueil après notification succès
      // window.location.href = '/';
    } catch (err) {
      setError('Erreur serveur.');
      setLoading(false);
    }
  };

  return (
    <div className="uni-form-container">
      <form onSubmit={handleSubmit} className="uni-form">
        <label htmlFor="username">Nom d'utilisateur</label>
        <input
          id="username"
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoComplete="username"
          disabled={loading}
        />
        <label htmlFor="password">Mot de passe</label>
        <div className="password-field-wrapper">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="password-input"
            autoComplete="current-password"
            disabled={loading}
          />
          <i
            className={showPassword ? "fa fa-lock-open" : "fa fa-lock"}
            aria-hidden="true"
            title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            tabIndex={0}
            onClick={() => setShowPassword(v => !v)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setShowPassword(v => !v); }}
            style={{ cursor: 'pointer', color: loading ? '#aaa' : undefined }}
          />
        </div>
        {error && <div className="form-error notification error"><i className="fa fa-exclamation-circle" /> {error}</div>}
        {success && <div className="form-success notification success"><i className="fa fa-check-circle" /> Connexion réussie !</div>}
        <button type="submit" disabled={loading}>
          {loading ? <span><i className="fa fa-spinner fa-spin" /> Connexion...</span> : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}

export default Login;
