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

**Version actuelle : v1.0.3**

EpiSol utilise un système de versioning unifié basé sur [Semantic Versioning](https://semver.org/). Pour plus de détails, consultez :
- [`README_VERSIONING.md`](./README_VERSIONING.md) - Guide utilisateur complet
- [`VERSIONING.md`](./VERSIONING.md) - Documentation technique
- [`CHANGELOG.md`](./CHANGELOG.md) - Historique des versions

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

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
