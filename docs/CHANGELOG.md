# Changelog - EpiSol

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

**Note**: Ce projet utilise un versioning unifié pour le frontend et le backend.

## [1.0.7] - 2025-07-04

### ✨ Ajout : Séparation complète des rôles admin/superadmin côté frontend
- Le contexte d'authentification (`AuthContext`) expose désormais le rôle de l'utilisateur (`userRole`) dans toute l'application.
- Le rôle est extrait du token JWT au chargement et lors de la connexion, puis stocké dans le contexte.
- Les composants sensibles (ex : gestion des utilisateurs) utilisent directement ce rôle pour appliquer les restrictions d'UI (affichage, actions, filtrage).
- Plus besoin de passer le rôle en prop : tout est centralisé et cohérent.
- L'UI est donc parfaitement alignée avec la sécurité backend pour la gestion des droits admin/superadmin.

### Correctifs et améliorations
- Le menu "Utilisateurs" est désormais visible pour les rôles "admin" ET "superadmin".
- Un admin ne voit plus son propre profil dans la liste des utilisateurs.
- Sécurité et expérience utilisateur renforcées pour la gestion des droits.

## [1.0.6] - 2025-06-13

### 🐛 Corrections Critiques
- **Fix React Error #31** : Résolution de l'erreur "Minified React error #31" lors de la modification des catégories
- **Sécurisation des types de données** : Ajout de validations `parseInt()` et `String()` dans `categoriesApi.js`
- **Amélioration de la robustesse** : Protection contre les objets passés comme enfants React
- **Hook useGenericData** : Ajout de `trim()` pour nettoyer les données d'entrée
- **Composant ManageCategories** : Conversion explicite avec `String()` pour éviter les erreurs de rendu

### 🔧 Technique
- Modification de `src/api/categoriesApi.js` pour formatter les réponses API
- Mise à jour de `src/hooks/useGenericData.js` avec validation des données
- Correction de `src/components/categories/ManageCategories.js` pour le rendu sécurisé
- Tests de régression validés : modification des catégories fonctionne sans erreur

## [1.0.5] - 2025-06-05

### ✨ Améliorations
- **Harmonisation complète des tableaux** : Application de `width: 100%` sur toutes les tailles d'écran
- **Optimisation de l'utilisation de l'espace** : Transition de `width: 80%; max-width: 600px` vers `width: 100%`
- **Rétrocompatibilité maintenue** : Classe `.produits-table` mise à jour pour cohérence

### 🔧 Technique
- Modification de `UnifiedTable.css` pour largeur maximale des tableaux
- Validation CSS réussie avec compilation sans erreurs
- Documentation mise à jour (`CENTRAGE_TABLEAUX_FIX.md`, `todo_list.md`)

### 📱 Responsive
- Comportement responsive préservé pour tablettes (≤700px) et mobile (≤395px)
- Largeur 100% appliquée de manière cohérente sur tous les breakpoints

## [1.0.1] - 2025-06-03

### 🔄 Modifié
- Mise à jour de version vers v1.0.1

n## [1.0.2] - 2025-06-03

### 🔄 Modifié
- Mise à jour de version vers v1.0.2

n## [1.0.3] - 2025-06-03

### 🔄 Modifié
- Mise à jour de version vers v1.0.3

n## [1.0.4] - 2025-06-05

### 🔄 Modifié
- Mise à jour de version vers v1.0.4

## [1.0.0] - 2025-06-03

### 🎉 Version Stable Initiale

Cette version marque la première release stable de l'application EpiSol avec toutes les fonctionnalités principales opérationnelles.

### ✅ Frontend
- **Gestion des bénéficiaires** : CRUD complet avec édition inline
- **Gestion des catégories** : CRUD complet avec édition inline  
- **Gestion des produits** : CRUD complet avec édition inline
- **Dashboard** : Vue d'ensemble avec statistiques
- **Exports** : Génération PDF et Excel des données
- **Interface responsive** : Optimisation mobile et desktop
- **Composant VersionInfo** : Affichage de la version en temps réel

### ✅ Backend  
- **API RESTful** : Endpoints complets pour toutes les entités
- **Authentification** : JWT sécurisé avec middleware
- **Base de données** : Structure MySQL optimisée
- **CORS** : Configuration production et développement
- **Endpoint /api/version** : Informations de version et statut du serveur
- **Logs startup** : Informations détaillées au démarrage

### 🔧 Résolu
- **Bug critique** : Fonctions d'édition inline manquantes dans `/categories-management`
- **Conflits CSS** : Isolation des styles par page avec attributs `data-page`
- **Optimisation mobile** : Interface ≤395px avec boutons compacts et champs centrés
- **Imports obsolètes** : Nettoyage des dépendances CSS redondantes

### 🏗️ Technique
- **Versioning unifié** : Frontend et backend synchronisés sur la même version
- **Hook useGenericData** : Gestion centralisée des opérations CRUD avec édition inline
- **Architecture CSS** : Système d'isolation par attribut `data-page`
- **Responsive design** : Breakpoints optimisés pour mobile (≤395px, ≤768px)
- **Structure modulaire** : Composants réutilisables et maintenables

### 📊 Statistiques
- **24/24 tâches principales** complétées (100%)
- **0 bugs critiques** en production
- **Interface responsive** sur tous devices
- **Architecture stable** et maintenable
- **API complète** avec tous les endpoints fonctionnels

---

n## [1.0.1] - 2025-06-03

### 🔄 Modifié
- Mise à jour de version vers v1.0.1

n## [1.0.2] - 2025-06-03

### 🔄 Modifié
- Mise à jour de version vers v1.0.2

n## [1.0.3] - 2025-06-03

### 🔄 Modifié
- Mise à jour de version vers v1.0.3

n## [1.0.4] - 2025-06-05

### 🔄 Modifié
- Mise à jour de version vers v1.0.4

## [1.0.5] - 2025-06-05

### 🐛 Corrections
- Harmonisation du modal de suppression dans la gestion des catégories (utilisation de ConfirmDeleteModal)
- Correction de l'affichage des notifications lors de l'ajout/suppression de catégorie
- Correction de l'appel à l'API d'ajout de catégorie (paramètre)
- Correction du système de suppression pour cohérence avec la gestion des produits
- Correction de bugs d'affichage et d'expérience utilisateur sur la page catégories

## [0.1.0] - 2024-12-01

### 🚀 Version Initiale de Développement
- Mise en place de l'architecture de base
- Premiers composants et fonctionnalités
- Configuration de l'environnement de développement

---

## Types de modifications

- **✅ Ajouté** : pour les nouvelles fonctionnalités
- **🔄 Modifié** : pour les modifications des fonctionnalités existantes  
- **❌ Obsolète** : pour les fonctionnalités qui seront supprimées
- **🗑️ Supprimé** : pour les fonctionnalités supprimées
- **🔧 Résolu** : pour les corrections de bugs
- **🔒 Sécurité** : en cas de vulnérabilités
