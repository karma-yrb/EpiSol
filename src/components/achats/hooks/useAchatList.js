import { useState } from 'react';

/**
 * Hook personnalisé pour la gestion de la liste d'achats (ajout, suppression, modification de quantité).
 * @returns {Object} États et handlers pour la liste d'achats.
 */
export function useAchatList() {
  const [achatList, setAchatList] = useState([]);

  const addAchat = (produit, quantite) => {
    if (!produit || !quantite || quantite <= 0) return;
    setAchatList(list => [
      ...list,
      {
        produit,
        quantite: Number(quantite),
        prix: Number(produit.prix)
      }
    ]);
  };

  const increaseQuantite = (idx) => {
    setAchatList(list => list.map((a, i) => i === idx ? { ...a, quantite: a.quantite + 1 } : a));
  };

  const decreaseQuantite = (idx) => {
    setAchatList(list => list.map((a, i) => i === idx ? { ...a, quantite: Math.max(1, a.quantite - 1) } : a));
  };

  const deleteAchat = (idx) => {
    setAchatList(list => list.filter((_, i) => i !== idx));
  };

  const resetAchatList = () => setAchatList([]);

  return {
    achatList,
    setAchatList,
    addAchat,
    increaseQuantite,
    decreaseQuantite,
    deleteAchat,
    resetAchatList
  };
}
