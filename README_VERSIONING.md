# 🏷️ Système de Versioning EpiSol

## Vue d'ensemble

EpiSol utilise un **système de versioning unifié** basé sur [Semantic Versioning](https://semver.org/) pour synchroniser les versions entre le frontend et le backend.

## 📋 État Actuel

- **Version actuelle** : `v1.0.2`
- **Frontend** : `episol-frontend@1.0.1`
- **Backend** : `episol-backend@1.0.1`
- **Statut** : ✅ Synchronisé

## 🚀 Utilisation

### Option 1 : Scripts automatisés (RECOMMANDÉ)

#### Git Bash (Windows/Linux/macOS)
```bash
# Correction de bug (1.0.0 → 1.0.1)
./update-version.sh patch "Correction bug critique"

# Nouvelle fonctionnalité (1.0.0 → 1.1.0)  
./update-version.sh minor "Nouvelle fonctionnalité export"

# Breaking change (1.0.0 → 2.0.0)
./update-version.sh major "Refactoring architecture"
```

### Option 2 : Manuel

1. **Mettre à jour les versions** dans `frontend/package.json` et `backend/package.json`
2. **Documenter** dans `CHANGELOG.md`
3. **Commiter** : `git commit -m "chore: bump version to vX.Y.Z"`
4. **Créer le tag** : `git tag -a vX.Y.Z -m "Release version X.Y.Z"`
5. **Pousser** : `git push origin master --tags`

## 📊 Monitoring des Versions

### Frontend - Composant VersionInfo
Le composant `VersionInfo` affiche en temps réel :
- ✅ Versions synchronisées (frontend = backend)
- ⚠️ Versions désynchronisées
- 🕐 Uptime du serveur
- 📋 Informations détaillées (clic pour étendre)

### Backend - Endpoint `/api/version`
```json
{
  "name": "episol-backend",
  "version": "1.0.0",
  "startTime": "2025-06-03T10:30:00.000Z",
  "uptime": 3600,
  "nodeVersion": "v18.17.0",
  "platform": "linux"
}
```

## 📁 Structure des Fichiers

```
EpiSol/
├── frontend/
│   ├── package.json (version: 1.0.0)
│   ├── src/components/common/VersionInfo.js
│   ├── src/api/versionApi.js
│   ├── CHANGELOG.md
│   ├── VERSIONING.md
│   └── update-version.sh
└── backend/
    ├── package.json (version: 1.0.0)
    ├── utils/versionInfo.js
    └── server.js (endpoint /api/version)
```

## 🔄 Types de Versions

| Type | Quand utiliser | Exemple |
|------|---------------|---------|
| **PATCH** | Corrections de bugs | `1.0.0 → 1.0.1` |
| **MINOR** | Nouvelles fonctionnalités | `1.0.0 → 1.1.0` |
| **MAJOR** | Breaking changes | `1.0.0 → 2.0.0` |

## 📝 Historique des Versions

- **v1.0.0** (2025-06-03) : Version stable initiale
  - ✅ Frontend complet (24/24 tâches)
  - ✅ Backend API fonctionnel
  - ✅ Système de versioning unifié
  - ✅ Interface responsive
  - ✅ Tous bugs critiques résolus

## 🛠️ Développement

### Tests avant release
```bash
# Frontend
cd frontend && npm test

# Backend  
cd backend && npm test

# Vérification versions
curl http://localhost:3001/api/version
```

### Validation post-release
1. ✅ Versions synchronisées (frontend = backend)
2. ✅ Tag Git créé
3. ✅ CHANGELOG.md mis à jour
4. ✅ Tests passent
5. ✅ Déploiement réussi

## 🔗 Liens Utiles

- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Git Tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging)

---
*Dernière mise à jour : 2025-06-03*
