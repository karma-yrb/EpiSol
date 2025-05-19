import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AccessDenied.css';

function AccessDenied() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login', { replace: true });
    }, 15000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="access-denied-container">
      <h1>Accès refusé</h1>
      <p>Vous n'avez pas les autorisations nécessaires pour accéder à cette page.</p>
      <p>Vous serez redirigé vers la page de connexion dans 15 secondes.</p>
      <img src="/images/access-denied.webp" alt="Accès refusé" />
      <button onClick={handleGoToLogin}>Retour à la page de connexion</button>
    </div>
  );
}

export default AccessDenied;
