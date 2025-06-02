# Scripts de Versioning EpiSol

## Versioning Unifié Frontend + Backend

Ce projet utilise un **versioning unifié** où le frontend et le backend partagent la même version. 

### Structure du projet :
```
EpiSol/
├── frontend/package.json (version: 1.0.0)
├── backend/package.json  (version: 1.0.0)
├── CHANGELOG.md         (historique unifié)
└── VERSIONING.md        (ce fichier)
```

## Utilisation du Semantic Versioning

Ce projet utilise [Semantic Versioning](https://semver.org/) avec le format `MAJOR.MINOR.PATCH` :

- **MAJOR** : Changements incompatibles avec les versions précédentes
- **MINOR** : Nouvelles fonctionnalités compatibles
- **PATCH** : Corrections de bugs compatibles

## Workflow de versioning

### 1. Mise à jour des versions

```bash
# Mettre à jour SIMULTANÉMENT les deux package.json
# Frontend
sed -i 's/"version": ".*"/"version": "1.1.0"/' frontend/package.json
# Backend  
sed -i 's/"version": ".*"/"version": "1.1.0"/' backend/package.json

# Ou manuellement :
# - frontend/package.json : "version": "1.1.0"
# - backend/package.json : "version": "1.1.0"
```

### 2. Mise à jour du CHANGELOG.md

```bash
# Documenter les changements dans CHANGELOG.md
# Séparer les modifications frontend/backend
```

### 3. Commit et tag

```bash
# Ajouter tous les changements
git add .

# Commit avec message conventionnel
git commit -m "chore: bump version to v1.1.0

- Frontend: nouvelles fonctionnalités UI
- Backend: nouveaux endpoints API"

# Créer le tag de version
git tag -a v1.1.0 -m "Release version 1.1.0 - Nouvelles fonctionnalités"

# Pousser avec les tags
git push origin main --tags
```

### Types de versions

#### Version Patch (1.0.0 → 1.0.1)
Pour les corrections de bugs :
```bash
# Mise à jour package.json : "version": "1.0.1"
git add .
git commit -m "fix: correction bug critique"
git tag -a v1.0.1 -m "Release version 1.0.1 - Correction bugs"
git push origin main --tags
```

#### Version Minor (1.0.0 → 1.1.0)
Pour les nouvelles fonctionnalités :
```bash
# Mise à jour package.json : "version": "1.1.0"
git add .
git commit -m "feat: nouvelle fonctionnalité"
git tag -a v1.1.0 -m "Release version 1.1.0 - Nouvelles fonctionnalités"
git push origin main --tags
```

#### Version Major (1.0.0 → 2.0.0)
Pour les changements incompatibles :
```bash
# Mise à jour package.json : "version": "2.0.0"
git add .
git commit -m "feat!: refactoring majeur avec breaking changes"
git tag -a v2.0.0 -m "Release version 2.0.0 - Breaking changes"
git push origin main --tags
```

## Historique des versions

- **v1.0.0** : Version stable initiale avec toutes les fonctionnalités principales
- **v0.1.0** : Version de développement initiale

## Bonnes pratiques

1. **Toujours** mettre à jour le CHANGELOG.md avant de créer une version
2. **Tester** l'application avant de créer un tag de version
3. **Utiliser** des messages de commit conventionnels (feat, fix, chore, etc.)
4. **Documenter** les breaking changes dans le CHANGELOG
5. **Créer** les tags avec des messages descriptifs
