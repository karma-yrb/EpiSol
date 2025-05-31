import { useState, useMemo } from 'react';

/**
 * Hook personnalisé pour gérer la logique des rabais et calculs de totaux
 */
export function useDiscountCalculations(selectedB, achatList) {
  const [applyDiscount, setApplyDiscount] = useState(true); // coché par défaut

  // Calcul du discount value
  const discountValue = selectedB && typeof selectedB.discount === 'number' ? selectedB.discount : 50;

  // Calculs mémorisés pour optimiser les performances
  const calculations = useMemo(() => {
    const totalSansRabais = achatList.reduce((sum, a) => sum + a.quantite * a.prix, 0);
    const montantRabais = applyDiscount ? totalSansRabais * (discountValue / 100) : 0;
    const totalAvecRabais = totalSansRabais - montantRabais;

    return {
      totalSansRabais,
      montantRabais,
      totalAvecRabais
    };
  }, [achatList, applyDiscount, discountValue]);

  return {
    applyDiscount,
    setApplyDiscount,
    discountValue,
    ...calculations
  };
}
