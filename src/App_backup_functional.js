import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import ManageBeneficiaire from './components/ManageBeneficiaire';
import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profile';
import EditBeneficiaire from './components/EditBeneficiaire';
import ManageUsers from './components/ManageUsers';
import EditUser from './components/EditUser';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (token, username) => {
    localStorage.setItem('token', token);
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div>
      {user && (
        <div className="header">
          <span>Connecté en tant que {user}</span>
          <button onClick={handleLogout}>Se déconnecter</button>
        </div>
      )}
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/beneficiaires" element={<ManageBeneficiaire />} />
        <Route path="/beneficiaires/edit/:id" element={<EditBeneficiaire />} />
        <Route path="/users" element={<ManageUsers />} />
        <Route path="/users/edit/:id" element={<EditUser />} />
      </Routes>
    </div>
  );
}

export default App;
