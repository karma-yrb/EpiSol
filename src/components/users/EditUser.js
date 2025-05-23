import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserForm from './UserForm';
import { AuthContext } from '../../context/AuthContext';

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId } = useContext(AuthContext); // Récupère l'ID de l'utilisateur connecté
  const [user, setUser] = useState({
    nom: '',
    prenom: '',
    email: '',
    username: '',
    password: '',
    role: ''
  });

  useEffect(() => {
    const fetchUserId = id || userId; // Utilise l'ID de l'utilisateur connecté si aucun ID n'est fourni
    console.log('Fetching user with ID:', fetchUserId); // Vérifie l'ID utilisé

    // Utilise l'URL de l'API en production si disponible
    const apiUrl = process.env.REACT_APP_API_URL || '';
    const fullUrl = `${apiUrl}/api/users/${fetchUserId}`;
    console.log('API URL utilisée:', fullUrl);
    fetch(fullUrl)
      .then((response) => {
        console.log('Response status:', response.status); // Vérifie le statut de la réponse
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Fusionne les données reçues avec l'état initial pour garantir tous les champs
        setUser(prev => ({ ...prev, ...data }));
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
        alert('Impossible de récupérer les données de l\'utilisateur. Veuillez réessayer plus tard.');
      });
  }, [id, userId]);

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
      .then(() => navigate('/users'))
      .catch((error) => console.error('Erreur lors de l\'enregistrement de l\'utilisateur :', error));
  };

  return (
    <div className="page-centered-container">
      <h1 className="profile-title">
        <i className="fa fa-user"></i>
        {id ? 'Modifier' : 'Ajouter'} un utilisateur
      </h1>
      <form onSubmit={handleSubmit}>
          <UserForm
            formData={user}
            handleChange={(e) => setUser({ ...user, [e.target.name]: e.target.value })}
            id={id}
          />
          <button type="submit">{id ? 'Mettre à jour' : 'Créer'}</button>
      </form>
    </div>
  );
}

export default EditUser;
