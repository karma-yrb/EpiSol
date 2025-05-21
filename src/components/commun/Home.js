import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Home.css';
import GestionModal from '../modals/GestionModal';

function Home({ user }) {
  const [showGestionModal, setShowGestionModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Bienvenue sur l'application de gestion</h1>
      {user && (
        <div className="home-btns">
          <button className="main-action-btn home-btn-green" onClick={()=>navigate('/achats')}>
            <i className="fa fa-shopping-basket"></i>
            Nouvel achat
          </button>
          <button className="main-action-btn home-btn-blue" onClick={()=>setShowGestionModal(true)}>
            <i className="fa fa-cog"></i>
            Gestion
          </button>
        </div>
      )}
      <GestionModal show={showGestionModal} onClose={()=>setShowGestionModal(false)} navigate={navigate} />
    </div>
  );
}

export default Home;