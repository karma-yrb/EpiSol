import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BeneficiaireForm from './BeneficiaireForm';
import { fetchBeneficiaire, updateBeneficiaire, addBeneficiaire, deleteBeneficiaire } from '../../api/beneficiairesApi';
import { useGenericDeleteModal } from '../../hooks/useGenericDeleteModal';
import './ManageBeneficiaire.css';

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
    adresse: '',
    discount: 50
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal de suppression avec useGenericDeleteModal
  const {
    handleDelete,
    ModalComponent: DeleteModal
  } = useGenericDeleteModal({
    deleteFunction: deleteBeneficiaire,
    entityName: 'bénéficiaire',
    onSuccess: () => {
      setSuccessMsg('Bénéficiaire supprimé avec succès !');
      setTimeout(() => {
        navigate('/beneficiaires');
      }, 1200);
    }
  });

  useEffect(() => {
    if (id) {
      // Fetch beneficiary data by ID for editing
      fetchBeneficiaire(id)
        .then((data) => {
          console.log('Données reçues du backend pour édition :', data);
          setFormData({
            ...data,
            dateNaissance: data.date_naissance ? new Date(data.date_naissance).toISOString().slice(0, 10) : '',
            discount: data.discount !== undefined ? data.discount : 50
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
    setSuccessMsg('');
    // Nettoyage strict : on ne garde que les champs attendus côté backend
    const dataToSend = {
      nom: formData.nom || '',
      prenom: formData.prenom || '',
      numero: formData.numero || '',
      telephone: formData.telephone || '',
      email: formData.email || '',
      dateNaissance: '', // camelCase pour le backend
      ville: formData.ville || '',
      adresse: formData.adresse || '',
      discount: formData.discount !== undefined ? Number(formData.discount) : 50
    };
    if (formData.dateNaissance) {
      // On envoie la date au format ISO complet (YYYY-MM-DDTHH:mm:ss.sssZ)
      const d = new Date(formData.dateNaissance);
      if (!isNaN(d.getTime())) {
        dataToSend.dateNaissance = d.toISOString();
      } else {
        dataToSend.dateNaissance = formData.dateNaissance;
      }
      console.log('Format dateNaissance envoyé au backend:', dataToSend.dateNaissance);
    }
    console.log('handleSubmit - Données envoyées au backend:', dataToSend); // LOG DEBUG
    const submitPromise = id
      ? updateBeneficiaire(id, dataToSend)
      : addBeneficiaire(dataToSend);
    submitPromise
      .then(() => {
        setSuccessMsg(id ? 'Bénéficiaire mis à jour avec succès !' : 'Bénéficiaire créé avec succès !');
        setTimeout(() => {
          navigate('/beneficiaires');
        }, 1200);
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
      </h1>      {errorMsg && (
        <div className="notification error beneficiaire-notification-error">
          <i className="fa fa-exclamation-circle"></i> {errorMsg}
        </div>
      )}      <BeneficiaireForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleDelete={id ? () => handleDelete(id) : null}
        id={id}
      />
      {successMsg && (
        <div className="notification success beneficiaire-notification-success">
          <i className="fa fa-check-circle"></i> {successMsg}
        </div>
      )}
      <DeleteModal />
    </div>
  );
}

export default EditBeneficiaire;
