# CONSIGNE IA (rappel permanent)
Après chaque modification de code dans ce projet (frontend ou backend),
proposer systématiquement :
- git add
- git commit
- git push
- un déploiement avec 'npm run deploy'
Ceci est une consigne permanente pour l'ensemble du projet.

> Note : Par défaut, toutes les commandes (git, npm, etc.) sont à exécuter dans le dossier `frontend/` sauf indication contraire.

# EpiSol - Application de Gestion

Application de gestion complète avec frontend React et backend Node.js utilisant un système de versioning unifié.

## 🏷️ Système de Versioning

**Version actuelle : v1.0.5**

EpiSol utilise un système de versioning unifié basé sur [Semantic Versioning](https://semver.org/). Pour plus de détails, consultez :
- [`docs/README_VERSIONING.md`](./docs/README_VERSIONING.md) - Guide utilisateur complet
- [`docs/VERSIONING.md`](./docs/VERSIONING.md) - Documentation technique
- [`docs/CHANGELOG.md`](./docs/CHANGELOG.md) - Historique des versions

### Mise à jour de version rapide
```bash
# Correction de bug (patch)
./update-version.sh patch "Description du fix"

# Nouvelle fonctionnalité (minor)
./update-version.sh minor "Description de la feature"

# Breaking change (major)
./update-version.sh major "Description du changement"
```

### Validation du système
```bash
./validate-versioning.sh
```

## 🚀 Démarrage Rapide

## Scripts Disponibles

Dans le répertoire du projet, vous pouvez exécuter :

### `npm start`

Lance l'application en mode développement.\
Ouvrez [http://localhost:3000](http://localhost:3000) pour l'afficher dans votre navigateur.

La page se rechargera lorsque vous apporterez des modifications.\
Vous pourrez également voir les erreurs de lint dans la console.

### `npm test`

Lance le runner de tests en mode interactif.\
Consultez la section sur [l'exécution des tests](https://facebook.github.io/create-react-app/docs/running-tests) pour plus d'informations.

### `npm run build`

Construit l'application pour la production dans le dossier `build`.\
Il regroupe correctement React en mode production et optimise la construction pour les meilleures performances.

La construction est minifiée et les noms de fichiers incluent les hashes.\
Votre application est prête à être déployée !

Consultez la section sur [le déploiement](https://facebook.github.io/create-react-app/docs/deployment) pour plus d'informations.

### `npm run eject`

**Note : il s'agit d'une opération à sens unique. Une fois que vous `eject`, vous ne pouvez plus revenir en arrière !**

Si vous n'êtes pas satisfait de l'outil de construction et des choix de configuration, vous pouvez `eject` à tout moment. Cette commande supprimera la dépendance de construction unique de votre projet.

Au lieu de cela, elle copiera tous les fichiers de configuration et les dépendances transitives (webpack, Babel, ESLint, etc) directement dans votre projet afin que vous ayez un contrôle total sur eux. Toutes les commandes sauf `eject` fonctionneront toujours, mais elles pointeront vers les scripts copiés afin que vous puissiez les modifier. À ce stade, vous êtes seul maître à bord.

Vous n'avez jamais besoin d'utiliser `eject`. L'ensemble de fonctionnalités organisé convient aux déploiements petits et moyens, et vous ne devriez pas vous sentir obligé d'utiliser cette fonctionnalité. Cependant, nous comprenons que cet outil ne serait pas utile si vous ne pouviez pas le personnaliser quand vous êtes prêt.

## En Savoir Plus

Vous pouvez en savoir plus dans la [documentation Create React App](https://facebook.github.io/create-react-app/docs/getting-started).

Pour apprendre React, consultez la [documentation React](https://reactjs.org/).

### Division du Code

Cette section a été déplacée ici : [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyse de la Taille du Bundle

Cette section a été déplacée ici : [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Création d'une Progressive Web App

Cette section a été déplacée ici : [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Configuration Avancée

Cette section a été déplacée ici : [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Déploiement

Cette section a été déplacée ici : [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` échoue lors de la minification

Cette section a été déplacée ici : [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## 📚 Documentation Complète

Toute la documentation technique et de gestion du projet se trouve dans le dossier [`docs/`](./docs/) :

- **[Todo List Nettoyée](./docs/todo_list_cleaned.md)** - Tâches restantes pour v1.1.x
- **[Rapport Final v1.0.5](./docs/RAPPORT_FINAL_V1.0.5.md)** - Bilan complet de la version stable
- **[Changelog](./docs/CHANGELOG.md)** - Historique détaillé des versions
- **[Documentation Versioning](./docs/VERSIONING.md)** - Système unifié frontend/backend

Consultez le [README de la documentation](./docs/README.md) pour une navigation complète.
