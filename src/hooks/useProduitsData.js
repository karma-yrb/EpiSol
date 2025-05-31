import { useState, useEffect } from 'react';
import { fetchProduits, addProduit, updateProduit, deleteProduit } from '../api/produitsApi';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const useProduitsData = () => {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState({ type: '', message: '' });

  // Récupère toutes les catégories
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/categories`)
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement des catégories');
        return res.json();
      })
      .then(data => {
        setCategories(Array.isArray(data) ? data : []);
        setNotif({ type: '', message: '' });
      })
      .catch((err) => {
        setCategories([]);
        setNotif({ type: 'error', message: 'Erreur lors du chargement des catégories : ' + (err.message || err) });
      });
  }, []);

  // Récupère tous les produits
  useEffect(() => {
    setLoading(true);
    fetchProduits()
      .then(data => {
        setProduits(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setNotif({ type: 'error', message: 'Erreur lors du chargement des produits: ' + err });
      });
  }, []);

  // Notification auto-disparition
  useEffect(() => {
    if (notif.message) {
      const timer = setTimeout(() => setNotif({ type: '', message: '' }), 2500);
      return () => clearTimeout(timer);
    }
  }, [notif]);

  const addNewProduit = async (produitData) => {
    const data = await addProduit({ ...produitData, prix: Number(produitData.prix) });
    const cat = categories.find(c => c.id === Number(produitData.categorie_id));
    setProduits(p => [...p, { ...data, categorie: cat ? cat.nom : '', categorie_id: data.categorie_id }]);
    setNotif({ type: 'success', message: 'Produit ajouté !' });
    return data;
  };

  const updateExistingProduit = async (id, produitData) => {
    await updateProduit(id, { ...produitData, prix: Number(produitData.prix) });
    const cat = categories.find(c => c.id === Number(produitData.categorie_id));
    setProduits(p => p.map(prod => 
      prod.id === id 
        ? { ...prod, ...produitData, prix: Number(produitData.prix), categorie: cat ? cat.nom : '', categorie_id: Number(produitData.categorie_id) } 
        : prod
    ));
    setNotif({ type: 'success', message: 'Produit modifié !' });
  };

  const deleteExistingProduit = async (id) => {
    await deleteProduit(id);
    setProduits(produits => produits.filter(p => p.id !== id));
    setNotif({ type: 'success', message: 'Produit supprimé avec succès.' });
  };

  return {
    produits,
    categories,
    loading,
    notif,
    setNotif,
    addNewProduit,
    updateExistingProduit,
    deleteExistingProduit
  };
};
