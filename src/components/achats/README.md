# 📁 Structure du dossier /src/achats

Cette documentation décrit la nouvelle organisation du module achats après la réorganisation de juin 2025.

## 🏗️ Structure des dossiers

```
src/components/achats/
├── forms/                      # Modales et formulaires
│   ├── AchatModal.js          # Modale d'ajout d'achat
│   ├── AchatModal.css         # Styles pour les modales
│   └── AchatDetailsModal.js   # Modale de détails d'achat
├── lists/                      # Composants de listes et tableaux
│   ├── AchatsTable.js         # Tableau des achats en cours
│   ├── AchatsTableList.js     # Liste des achats historiques
│   └── ListeAchats.js         # Page principale de la liste
├── ui/                         # Composants UI réutilisables
│   ├── BeneficiaireSelector.js # Sélecteur de bénéficiaire
│   ├── ProductSearchDropdown.js # Recherche de produits
│   └── QuantityAndActions.js  # Contrôles de quantité
├── hooks/                      # Hooks spécifiques aux achats
│   ├── useAchatList.js        # Gestion liste d'achats en cours
│   ├── useAchatsData.js       # Données des achats (fetch/delete)
│   └── useAchatsFilters.js    # Filtres et recherche
├── api/                        # Services API
│   ├── achatsApi.js           # API principale des achats
│   └── achatsHistoriqueApi.js # API historique des achats
├── styles/                     # Styles partagés
│   └── common.css             # Classes CSS communes
├── Achats.js                   # Page principale d'ajout d'achat
├── Achats.css                  # Styles spécifiques à Achats.js
└── AchatsNotifications.js      # Composant de notifications
```

## 🎯 Principes d'organisation

### 1. **Séparation par fonctionnalité**
- **forms/** : Tout ce qui concerne les modales et formulaires
- **lists/** : Composants d'affichage de listes et tableaux
- **ui/** : Composants réutilisables dans plusieurs contextes

### 2. **Centralisation des ressources**
- **hooks/** : Tous les hooks spécifiques aux achats regroupés
- **api/** : Services API centralisés pour éviter la duplication
- **styles/** : CSS commun pour réduire la redondance

### 3. **Facilité de maintenance**
- Structure logique facilitant la recherche de fichiers
- Imports courts et clairs
- Évite la redondance de code

## 📋 Mapping des anciens chemins

| Ancien chemin | Nouveau chemin |
|---------------|----------------|
| `./AchatModal` | `./forms/AchatModal` |
| `./BeneficiaireSelector` | `./ui/BeneficiaireSelector` |
| `./AchatsTable` | `./lists/AchatsTable` |
| `../../api/achatsApi` | `./api/achatsApi` |
| `../../hooks/useAchatList` | `./hooks/useAchatList` |

## ✅ Validation post-réorganisation

- [x] Compilation réussie sans erreurs
- [x] Tous les imports mis à jour
- [x] Structure logique et cohérente
- [x] Suppression des fichiers dupliqués
- [x] CSS commun créé pour réduire la redondance

## 🚀 Prochaines étapes

1. **Styles spécifiques** : Créer des CSS dédiés pour chaque composant ayant des besoins spécifiques
2. **Tests** : Valider le fonctionnement en environnement de développement
3. **Documentation** : Mettre à jour les README des autres modules si nécessaire

---
*Réorganisation réalisée le 1er juin 2025*
