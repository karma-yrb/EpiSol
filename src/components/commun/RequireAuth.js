import React from 'react';
import { Navigate } from 'react-router-dom';

function RequireAuth({ children, requiredRole }) {
  const token = localStorage.getItem('token');

  // Redirige vers /login pour les utilisateurs non connectés
  if (!token) {
    console.warn('Utilisateur non connecté, redirection vers /login');
    return <Navigate to="/login" replace />;
  }

  // Allow mock-token for development purposes
  if (token === 'mock-token') {
    console.warn('Token fictif détecté, validation ignorée pour le développement.');
    return children;
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Token mal formé :', token);
      return <Navigate to="/login" replace />;
    }

    const payload = JSON.parse(atob(parts[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    if (isExpired) {
      console.warn('Token expiré, redirection vers /login');
      return <Navigate to="/login" replace />;
    }
    // Vérifie le rôle si nécessaire
    if (requiredRole && payload.role !== requiredRole) {
      console.warn(`Accès refusé : rôle requis = ${requiredRole}, rôle utilisateur = ${payload.role}`);
      return <Navigate to="/access-denied" replace />;
    }
  } catch (error) {
    console.error('Erreur lors de la validation du token :', error);
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RequireAuth;
