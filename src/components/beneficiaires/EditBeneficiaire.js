import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BeneficiaireForm from './BeneficiaireForm';
import { fetchBeneficiaire, updateBeneficiaire, addBeneficiaire } from '../../api/beneficiairesApi';

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
      fetchBeneficiaire(id)
        .then((data) => {
          console.log('Données reçues du backend pour édition :', data);
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
    // Nettoyage strict : on ne garde que les champs attendus côté backend
    const dataToSend = {
      nom: formData.nom || '',
      prenom: formData.prenom || '',
      numero: formData.numero || '',
      telephone: formData.telephone || '',
      email: formData.email || '',
      date_naissance: formData.dateNaissance || '', // snake_case pour le backend
      ville: formData.ville || '',
      adresse: formData.adresse || ''
    };
    if (dataToSend.date_naissance) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dataToSend.date_naissance)) {
        const d = new Date(dataToSend.date_naissance);
        if (!isNaN(d.getTime())) {
          dataToSend.date_naissance = d.toISOString().slice(0, 10);
        }
      }
    }
    const submitPromise = id
      ? updateBeneficiaire(id, dataToSend)
      : addBeneficiaire(dataToSend);
    submitPromise
      .then(() => {
        alert(id ? 'Bénéficiaire mis à jour avec succès !' : 'Bénéficiaire créé avec succès !');
        navigate('/beneficiaires');
      })
      .catch((error) => {
        let msg = 'Erreur lors de la soumission du formulaire.';
        if (error && error.message) msg = error.message;
        setErrorMsg(msg);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
