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
    role: ''
  });

  useEffect(() => {
    const fetchUserId = id || userId; // Utilise l'ID de l'utilisateur connecté si aucun ID n'est fourni
    console.log('Fetching user with ID:', fetchUserId); // Vérifie l'ID utilisé

    fetch(`http://localhost:3001/api/users/${fetchUserId}`) // Correction de l'URL pour inclure le préfixe /api
      .then((response) => {
        console.log('Response status:', response.status); // Vérifie le statut de la réponse
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched user data:', data); // Vérifie les données récupérées
        setUser(data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
        alert('Impossible de récupérer les données de l\'utilisateur. Veuillez réessayer plus tard.');
      });
  }, [id, userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = id ? 'PUT' : 'POST';
    const url = id ? `http://localhost:3001/users/${id}` : 'http://localhost:3001/users';

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
      <UserForm
        formData={user}
        handleChange={(e) => setUser({ ...user, [e.target.name]: e.target.value })}
        handleSubmit={handleSubmit}
        id={id}
      />
    </div>
  );
}

export default EditUser;
