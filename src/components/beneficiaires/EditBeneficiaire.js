import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BeneficiaireForm from './BeneficiaireForm';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

function EditBeneficiaire() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    numero: '',
    telephone: '',
    email: '',
    dateNaissance: '',
    ville: '',
    adresse: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (id) {
      // Fetch beneficiary data by ID for editing
      fetch(`${API_BASE_URL}/beneficiaires/${id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('Données reçues du backend pour édition :', data);
          // Correction : mapping date_naissance -> dateNaissance au format YYYY-MM-DD
          setFormData({
            ...data,
            dateNaissance: data.date_naissance ? new Date(data.date_naissance).toISOString().slice(0, 10) : '',
          });
        })
        .catch((error) => console.error('Erreur lors de la récupération des données :', error));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    // Correction : toujours envoyer la date au format YYYY-MM-DD
    let dataToSend = { ...formData };
    if (dataToSend.dateNaissance) {
      // Si déjà au bon format, on garde, sinon on convertit
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dataToSend.dateNaissance)) {
        const d = new Date(dataToSend.dateNaissance);
        if (!isNaN(d.getTime())) {
          dataToSend.dateNaissance = d.toISOString().slice(0, 10);
        }
      }
    }
    console.log('Données envoyées au backend :', dataToSend);

    const url = id
      ? `${API_BASE_URL}/beneficiaires/${id}`
      : `${API_BASE_URL}/beneficiaires`;
    const method = id ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    })
      .then(async (response) => {
        if (response.ok) {
          alert(id ? 'Bénéficiaire mis à jour avec succès !' : 'Bénéficiaire créé avec succès !');
          navigate('/beneficiaires');
        } else {
          let msg = 'Erreur lors de la soumission du formulaire.';
          let data = null;
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            try {
              data = await response.json();
              if (data.error && data.error.toLowerCase().includes('numéro de bénéficiaire')) {
                msg = "Le numéro de bénéficiaire est déjà utilisé. Veuillez en choisir un autre.";
              } else if (data.error) {
                msg = data.error;
              }
            } catch (e) {
              // JSON mal formé
            }
          }
          console.log('Message d\'erreur à afficher :', msg);
          setErrorMsg(msg);
          // Scroll en haut pour afficher l'erreur
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      })
      .catch((error) => {
        setErrorMsg('Erreur réseau ou serveur.');
        console.error('Erreur :', error);
      });
  };

  return (
    <div className="page-centered-container">
      <h1 className="profile-title">
        <i className="fa fa-address-book"></i>
        {id ? 'Modifier un bénéficiaire' : 'Créer un nouveau bénéficiaire'}
      </h1>
      {errorMsg && (
        <div className="notification error" style={{marginBottom:16}}>
          <i className="fa fa-exclamation-circle"></i> {errorMsg}
        </div>
      )}
      <BeneficiaireForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        id={id}
      />
    </div>
  );
}

export default EditBeneficiaire;
