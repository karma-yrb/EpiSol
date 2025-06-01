# Organisation CSS du module Achats

## Vue d'ensemble

Le fichier CSS monolithique `Achats.css` (487 lignes) a été décomposé en plusieurs fichiers CSS spécialisés pour améliorer la maintenance et réduire la duplication de code.

## Structure des fichiers CSS

```
src/components/achats/styles/
├── Achats.css                 # Styles principaux du composant Achats.js (allégé)
├── AchatModal.css            # Styles pour les modales d'achat
├── AchatsTable.css           # Styles pour les tableaux et switches
├── BeneficiaireSelector.css  # Styles pour le sélecteur de bénéficiaire
├── QuantityAndActions.css    # Styles pour les boutons de quantité et actions
└── common.css                # Styles partagés entre composants
```

## Mapping composant → CSS

| Composant | Fichier CSS | Responsabilité |
|-----------|-------------|----------------|
| `Achats.js` | `Achats.css` | Container principal, boutons d'action, layout général |
| `AchatModal.js` | `AchatModal.css` | Styles des modales d'ajout/modification |
| `AchatsTable.js` | `AchatsTable.css` | Tableaux, switches, filtres, responsive mobile |
| `BeneficiaireSelector.js` | `BeneficiaireSelector.css` | Dropdown bénéficiaires, recherche, boutons |
| `QuantityAndActions.js` | `QuantityAndActions.css` | Boutons +/-, suppression, responsive |

## Avantages de cette organisation

1. **Maintenabilité** : Chaque composant a ses propres styles
2. **Réutilisabilité** : Les styles communs sont centralisés
3. **Performance** : Import sélectif des CSS nécessaires
4. **Lisibilité** : Fichiers plus petits et focalisés
5. **Évolutivité** : Ajout facile de nouveaux composants

## Imports CSS

Chaque composant importe son fichier CSS correspondant :

```javascript
// Dans BeneficiaireSelector.js
import '../styles/BeneficiaireSelector.css';

// Dans AchatsTable.js  
import '../styles/AchatsTable.css';

// etc.
```

## Styles responsive

Les media queries sont réparties selon leur contexte :
- **Mobile général** : `Achats.css`
- **Tableaux mobile** : `AchatsTable.css`
- **Boutons mobile** : `QuantityAndActions.css`

## Migration réalisée

- ✅ Ancien fichier monolithique `Achats.css` (487 lignes) → supprimé
- ✅ 6 fichiers CSS spécialisés créés
- ✅ Imports mis à jour dans tous les composants
- ✅ Structure centralisée dans `/styles/`
- ✅ Tests de compilation validés

Cette organisation respecte les bonnes pratiques React et facilite grandement la maintenance du code CSS.
