# 📋 Todo List - EpiSol Frontend

> Suivi des bugs, features et améliorations du projet EpiSol

---

## 🐛 Bugs

### 🖥️ Global
- ✅ **TERMINÉ** - `/liste-achats` : Erreur lors du chargement du détail
- ✅ **TERMINÉ** - Correction erreur dans `ManageBeneficiaire` après migration vers `useGenericData`
- ✅ **TERMINÉ** - Correction du hook `useGenericData` pour accepter correctement un objet de configuration au lieu d'une URL
- ✅ **TERMINÉ** - Correction erreur dans `CategoryTable.js` (null check dans la boucle `.map`)
- ✅ **TERMINÉ** - Correction erreur dans `ManageUsers.js` (format incorrect de la configuration dans `useGenericData`)
- ✅ **TERMINÉ** - `/users/add` : Les données de l'utilisateur connecté sont chargées alors que le form devrait être vide
- ✅ **TERMINÉ** - **Régressions UI post-refactorisation (Mai 2025)** :
  - Bouton profil/déconnexion sans background
  - Menu latéral sans textes affichés

- ✅ **TERMINÉ** - page /beneficiaires 
    - ✅ l'ajout de beneficiaire ne fontionne pas, voir message d'erreur (problème : champs obligatoires manquants dans le formulaire)
    - le lien pour aller vers /achats ne fontionne pas correctement, le champ de choix du beneficiaire est vide. il devrait etre rempli avec le beneficieire selectionné et le bouton "ajouter un produit" devrait apparaitre


### 📱 Mobile
- ✅ **TERMINÉ** - `/liste-achats` : Régression > Les boutons doivent faire 100% de la largeur en mode mobile, le bouton "edit-btn" ne respecte pas ça
- ✅ **TERMINÉ** - `/beneficiaires` : Le style n'est pas pris en compte : `@media (max-width: 393px) {.produits-table th, .produits-table td {padding: 10px;}}`
- ✅ **TERMINÉ** - Menu mobile ne prenant pas toute la largeur

---

## ⚡ Améliorations

### 🖥️ Global
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

- ✅ **TERMINÉ** - **Unification des modales de formulaire (Juin 2025)** :
  - Création de `UnifiedProductModal` remplaçant `ProduitsFormModal` et `AjoutProduitModal`
  - Nouveau hook `useUnifiedProductForm` unifiant la logique de création/édition
  - Mode 'inline' pour création rapide dans `AchatModal`, mode 'add'/'edit' pour `ManageProduits`
  - Suppression de 4 fichiers obsolètes et réduction significative de la duplication de code

- ✅ **TERMINÉ** - **Unification des hooks de recherche (Juin 2025)** :
  - Création de `useUnifiedBeneficiaireSearch` et `useUnifiedProduitSearch` basés sur `useGenericSearch`
  - Remplacement des hooks spécialisés `useBeneficiaireSearch` et `useProduitSearch`
  - Migration réussie dans `Achats.js` sans régression fonctionnelle
  - Suppression de 2 fichiers obsolètes et finalisation de la mutualisation du code

- ✅ **TERMINÉ** - Dans la page beneficiaires/ 
    - ✅ enlever le bouton "supprimer" et rajouter un bouton "enregistrer un nouvel achat" qui aménera vers la page /achats avec ce bénéficiaire déjà sélectionné    - ✅ rajouter le bouton "supprimer" dans la page beneficiaires/edit/:id a coté du bouton mettre à jour, le comportement lui doit rester le meme. Aprés suppression retourner dans la pages benenficiaire et afficher un message de confirmation de suppression
    - ✅ Le message de confirmation de suppresion doit etre dans un modal et non en bas de page
    - ✅ rajouter une colonne "depuis" ou apparaitra la date de creation du beneficiaire format jj/mm/aa
    - ✅ Limiter le numéro de bénéficiaire à maximum 5 chiffres (validation DB + frontend)

- [ ] Réorganiser le dossier /src/achats
  - Garder un achats.css pour les classe communes mais attribuer un css pour chaque composant ayant des spécificités
  - Faire des sous dossiers peut-etre 

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

- [] Largeur des formulaires, ils dépassent de l'écran en gnénéral pour cette largeur d'écran, il faut corriger ça

---

## 🚀 Nouvelles fonctionnalités

### 🖥️ Global
- ✅ **TERMINÉ** - `/beneficiaires` : La colonne "Numéro bénéficiaire" doit s'appeler "#"
- ✅ **TERMINÉ** - `/beneficiaires` : La colonne "nom" et "prenom" doit être fusionnée pour ne faire qu'une qui s'appelle "prénom nom"
- ✅ **TERMINÉ** - Afficher les initiales du user à la place du role pour le bouton d'accès au profil et déconnexion

### 📱 Mobile
*Aucune nouvelle fonctionnalité spécifique mobile en cours*

---

## 📊 Statistiques du projet

| Catégorie | Global | Mobile | Total |
|-----------|---------|--------|-------|
| 🐛 Bugs | 6 | 3 | 9 |
| ⚡ Améliorations | 6 + 2 à venir | 4 | 12 |
| 🚀 Fonctionnalités | 3 | 0 | 3 |
| **TOTAL** | **16** | **7** | **24** |

> **Progression globale : 22/24 tâches terminées (92%)** 🎯  
> **Restant : 2 améliorations desktop en attente** 🔮
> **Restant : 1 amélioration desktop en attente** 🔮
