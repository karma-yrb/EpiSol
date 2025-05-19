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
        <div className="home-btns" style={{display:'flex',gap:32,justifyContent:'center',margin:'40px 0'}}>
          <button className="main-action-btn" onClick={()=>navigate('/achats')} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8,padding:'28px 38px',fontSize:22,borderRadius:16,background:'#1a7f1a',color:'#fff',border:'none',fontWeight:700,boxShadow:'0 2px 8px rgba(0,0,0,0.10)',cursor:'pointer'}}>
            <i className="fa fa-shopping-basket" style={{fontSize:38}}></i>
            Achats
          </button>
          <button className="main-action-btn" onClick={()=>setShowGestionModal(true)} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8,padding:'28px 38px',fontSize:22,borderRadius:16,background:'#0071bc',color:'#fff',border:'none',fontWeight:700,boxShadow:'0 2px 8px rgba(0,0,0,0.10)',cursor:'pointer'}}>
            <i className="fa fa-cog" style={{fontSize:38}}></i>
            Gestion
          </button>
        </div>
      )}
      <GestionModal show={showGestionModal} onClose={()=>setShowGestionModal(false)} navigate={navigate} />
    </div>
  );
}

export default Home;