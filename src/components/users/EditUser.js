import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserForm from './UserForm';

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    nom: '',
    prenom: '',
    email: '',
    username: '',
    password: '',
    role: ''
  });
  const [successMsg, setSuccessMsg] = useState('');
  useEffect(() => {
    // Si on a un ID dans l'URL, on charge les données de cet utilisateur (mode édition)
    // Si pas d'ID, on reste en mode création avec un formulaire vide
    if (!id) {
      console.log('Mode création - formulaire vide');
      return;
    }

    console.log('Mode édition - chargement des données pour ID:', id);

    // Utilise l'URL de l'API en production si disponible
    const apiUrl = process.env.REACT_APP_API_URL || '';
    const fullUrl = `${apiUrl}/api/users/${id}`;
    console.log('API URL utilisée:', fullUrl);
    fetch(fullUrl)
      .then((response) => {
        console.log('Response status:', response.status); // Vérifie le statut de la réponse
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.json();
      })      .then((data) => {
        // Fusionne les données reçues avec l'état initial pour garantir tous les champs
        // IMPORTANT: Exclure le champ password pour éviter d'afficher le mot de passe hashé
        const { password, ...userDataWithoutPassword } = data;
        setUser(prev => ({ ...prev, ...userDataWithoutPassword }));
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
        alert('Impossible de récupérer les données de l\'utilisateur. Veuillez réessayer plus tard.');
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = id ? 'PUT' : 'POST';
    const apiUrl = process.env.REACT_APP_API_URL || '';
    const url = id ? `${apiUrl}/api/users/${id}` : `${apiUrl}/api/users`;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Erreur lors de la mise à jour');
        return response.json();
      })
      .then(() => {
        setSuccessMsg('Informations utilisateur mises à jour avec succès.');
        setTimeout(() => navigate('/users'), 1200);
      })
      .catch((error) => {
        console.error('Erreur lors de l\'enregistrement de l\'utilisateur :', error);
        alert('Erreur lors de la mise à jour.');
      });
  };

  useEffect(() => {
    if (successMsg) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  }, [successMsg]);

  return (
    <div className="page-centered-container">
      <h1 className="profile-title">
        <i className="fa fa-user"></i>
        {id ? 'Modifier' : 'Ajouter'} un utilisateur
      </h1>
      <form className="uni-form uni-form-container" onSubmit={handleSubmit}>
        <UserForm
          formData={user}
          handleChange={(e) => setUser({ ...user, [e.target.name]: e.target.value })}
          id={id}
        />
        <button type="submit">{id ? 'Mettre à jour' : 'Créer'}</button>
        {successMsg && (
          <div className="form-success" style={{marginTop:18, textAlign:'center'}}>
            <i className="fa fa-check-circle" style={{marginRight:6}}></i> {successMsg}
          </div>
        )}
      </form>
    </div>
  );
}

export default EditUser;
