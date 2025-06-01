# 📋 Todo List - EpiSol Frontend

> Suivi des bugs, features et améliorations du projet EpiSol

---

## 🐛 Bugs

### 🖥️ Desktop
- ✅ **TERMINÉ** - `/liste-achats` : Erreur lors du chargement du détail
- ✅ **TERMINÉ** - Correction erreur dans `ManageBeneficiaire` après migration vers `useGenericData`
- ✅ **TERMINÉ** - Correction du hook `useGenericData` pour accepter correctement un objet de configuration au lieu d'une URL
- ✅ **TERMINÉ** - Correction erreur dans `CategoryTable.js` (null check dans la boucle `.map`)
- ✅ **TERMINÉ** - Correction erreur dans `ManageUsers.js` (format incorrect de la configuration dans `useGenericData`)
- ✅ **TERMINÉ** - `/users/add` : Les données de l'utilisateur connecté sont chargées alors que le form devrait être vide
- ✅ **TERMINÉ** - **Régressions UI post-refactorisation (Mai 2025)** :
  - Bouton profil/déconnexion sans background
  - Menu latéral sans textes affichés

### 📱 Mobile
- ✅ **TERMINÉ** - `/liste-achats` : Régression > Les boutons doivent faire 100% de la largeur en mode mobile, le bouton "edit-btn" ne respecte pas ça
- ✅ **TERMINÉ** - `/beneficiaires` : Le style n'est pas pris en compte : `@media (max-width: 393px) {.produits-table th, .produits-table td {padding: 10px;}}`
- ✅ **TERMINÉ** - Menu mobile ne prenant pas toute la largeur

---

## ⚡ Améliorations

### 🖥️ Desktop
- ✅ **TERMINÉ** - **Mutualisation des composants (09/2024)** :
  - Création de hooks génériques : `useGenericData`, `useGenericSearch`, `useGenericDeleteModal`
  - Remplacement des composants redondants par `GenericSearchBar`
  - Migration de `ManageUsers` vers l'approche générique
  - Migration de `ManageCategories` vers `useGenericData` et `useGenericDeleteModal`
  - Migration complète de `ManageBeneficiaire` vers `useGenericData` et `useGenericDeleteModal`
  - Suppression de 4 fichiers redondants (`AchatsSearchBar`, `ProduitsSearchBar`, `useDeleteModal`, `ListeAchatsRefactored`)
  - **Réduction significative de la duplication de code**

- ✅ **TERMINÉ** - **Backend maintenance (Mai 2025)** :
  - Ajout d'un fichier `.gitignore` complet pour Node.js
  - Restoration du fichier `authUtils.js` (était accidentellement vidé)
  - Synchronisation et déploiement des modifications

- ✅ **TERMINÉ** - **Amélioration UI page `/produits` (Juin 2025)** :
  - Boutons "Ajouter produit" et "Gérer catégories" : même largeur, côte à côte, 80% espace desktop
  - Champ de recherche : 80% largeur desktop
  - Création de `GenericSearchBar.css` pour layout responsive
  - **Alignement parfait des boutons d'action**

- ✅ **TERMINÉ** - **Corrections et optimisations UI (Mai 2025)** :
  - Correction du bouton profil avec background approprié (`#eaf4ff`)
  - Amélioration du style des initiales utilisateur (cercle bleu avec texte blanc)
  - Correction de l'affichage des textes dans le menu latéral

- [ ] **Prochaines étapes de mutualisation identifiées** :
  - Unifier les modales de formulaire (`ProduitsFormModal` vs `AjoutProduitModal`)
  - Remplacer les hooks de recherche spécialisés par `useGenericSearch`

### 📱 Mobile
- ✅ **TERMINÉ** - **UX Mobile ≤395px - Page `/achats` (Juin 2025)** :
  - Alignement des boutons de quantité avec `actions-cell` et réduction de taille mobile
  - Optimisation responsive des contrôles de quantité (-, +, delete)
  - Amélioration de la hiérarchie des polices :
    - **"Rabais"** : Police plus petite (14px desktop, 12px mobile)
    - **"Prix total"** : Police plus grande (18px mobile)

- ✅ **TERMINÉ** - **UX Mobile ≤395px - Pages `/users` et `/beneficiaires` (Juin 2025)** :
  - Tableaux 100% largeur mobile et réduction marges boutons
  - Optimisation de l'affichage responsive

- ✅ **TERMINÉ** - **Navigation mobile optimisée (Mai 2025)** :
  - Menu mobile responsive prenant toute la largeur écran (`100vw`)
  - Gestion dynamique de la taille d'écran

- ✅ **TERMINÉ** - **Page `/produits` mobile (Juin 2025)** :
  - Design mobile préservé avec `flex-direction: column`

---

## 🚀 Nouvelles fonctionnalités

### 🖥️ Desktop
- ✅ **TERMINÉ** - `/beneficiaires` : La colonne "Numéro bénéficiaire" doit s'appeler "#"
- ✅ **TERMINÉ** - `/beneficiaires` : La colonne "nom" et "prenom" doit être fusionnée pour ne faire qu'une qui s'appelle "prénom nom"
- ✅ **TERMINÉ** - Afficher les initiales du user à la place du role pour le bouton d'accès au profil et déconnexion

### 📱 Mobile
*Aucune nouvelle fonctionnalité spécifique mobile en cours*

---

## 📊 Statistiques du projet

| Catégorie | Desktop | Mobile | Total |
|-----------|---------|--------|-------|
| 🐛 Bugs | 6 | 3 | 9 |
| ⚡ Améliorations | 4 + 2 à venir | 4 | 10 |
| 🚀 Fonctionnalités | 3 | 0 | 3 |
| **TOTAL** | **13** | **7** | **22** |

> **Progression globale : 20/22 tâches terminées (91%)** 🎯  
> **Restant : 2 améliorations desktop en attente** 🔮
