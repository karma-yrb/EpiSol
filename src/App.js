import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import ManageBeneficiaire from './components/beneficiaires/ManageBeneficiaire';
import Home from './components/commun/Home';
import Login from './components/commun/Login';
import Profile from './components/commun/Profile';
import EditBeneficiaire from './components/beneficiaires/EditBeneficiaire';
import ManageUsers from './components/users/ManageUsers';
import EditUser from './components/users/EditUser';
import AccessDenied from './components/commun/AccessDenied';
import RequireAuth from './components/commun/RequireAuth';
import NavMenu from './components/commun/NavMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import ManageProduits from './components/produits/ManageProduits';
import ManageCategories from './components/categories/ManageCategories';
import Achats from './components/achats/Achats';
import ListeAchats from './components/achats/ListeAchats';

// Initialize navigate using useNavigate
function App() {
  const [user, setUser] = useState(() => {
    // Vérifie le token au chargement initial (pour le refresh)
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp * 1000 < Date.now()) return null;
      return payload.username;
    } catch {
      return null;
    }
  });
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogin = (token, username) => {
    localStorage.setItem('token', token);
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login', { state: { message: 'Vous avez été déconnecté avec succès.' } });
  };

  return (
    <div>
      {user && <NavMenu user={user} />}
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        {/* Toutes les routes sauf /login et /access-denied sont protégées */}
        <Route
          path="/*"
          element={
            <RequireAuth>
              <Routes>
                <Route path="/" element={<Home user={user} />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/beneficiaires" element={<ManageBeneficiaire />} />
                <Route path="/beneficiaires/add" element={<EditBeneficiaire />} />
                <Route path="/beneficiaires/edit/:id" element={<EditBeneficiaire />} />
                {/* ADMIN ONLY: Gestion des utilisateurs */}
                <Route path="/users" element={
                  <RequireAuth requiredRole="admin">
                    <ManageUsers userConnected={user} />
                  </RequireAuth>
                } />
                <Route path="/users/add" element={
                  <RequireAuth requiredRole="admin">
                    <EditUser />
                  </RequireAuth>
                } />
                <Route path="/users/edit/:id" element={
                  <RequireAuth requiredRole="admin">
                    <EditUser />
                  </RequireAuth>
                } />
                <Route path="/produits" element={<ManageProduits />} />
                <Route path="/categories-management" element={<ManageCategories />} />
                <Route path="/achats" element={<Achats />} />
                <Route path="/liste-achats" element={<ListeAchats />} />
                {/* Ajoutez ici d'autres routes protégées si besoin */}
              </Routes>
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
