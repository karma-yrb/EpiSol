# Système de Tableaux Unifié - EpiSol Frontend

## Vue d'ensemble

Ce document décrit le système de tableaux unifié mis en place pour harmoniser tous les tableaux de l'application EpiSol.

## Architecture

### Fichiers principaux

1. **`UnifiedTable.css`** : Fichier CSS central contenant tous les styles de base pour les tableaux
2. **`SortableTable.js`** : Composant React principal pour les tableaux triables
3. **`SortableTable.css`** : Styles spécifiques aux fonctionnalités de tri

### Classes CSS de base

#### Classe principale
- `.unified-table` : Classe de base obligatoire pour tous les nouveaux tableaux

#### Classes modificatrices
- `.unified-table--full-width` : Pour les tableaux pleine largeur
- `.unified-table--compact` : Pour les tableaux avec espacement réduit
- `.unified-table--light-bg` : Pour les tableaux avec fond clair

#### Classes utilitaires
- `.text-center`, `.text-right`, `.text-left` : Alignement du texte
- `.col-actions`, `.col-date`, `.col-number` : Largeurs prédéfinies
- `.status-active`, `.status-inactive`, `.status-warning`, `.status-danger` : Indicateurs visuels

## Migration

### Étapes réalisées

1. ✅ **Création du système unifié** : `UnifiedTable.css` créé avec toutes les règles harmonisées
2. ✅ **Mise à jour des composants** : Tous les composants utilisant `SortableTable` importent maintenant `UnifiedTable.css`
3. ✅ **Nettoyage des styles redondants** : Suppression des styles de tableaux dupliqués dans `UniForm.css`
4. ✅ **Harmonisation des imports** : Ajout de `UnifiedTable.css` dans tous les composants de tableaux

### Composants mis à jour

- ✅ `ManageCategories.js`
- ✅ `ManageProduits.js`
- ✅ `ManageUsers.js`
- ✅ `ManageBeneficiaire.js`
- ✅ `AchatsTable.js`
- ✅ `AchatsTableList.js`
- ✅ `SortableTable.js` (utilise maintenant `.unified-table`)

## Rétrocompatibilité

### Classes héritées maintenues

Pour assurer la transition en douceur, les anciennes classes sont conservées dans `UnifiedTable.css` :

- `.produits-table` : Redirigée vers les styles unifiés
- `.achats-list-table` : Conservée avec ses spécificités
- `.beneficiaires-table` : Conservée avec ses spécificités

## Responsive Design

### Breakpoints standardisés

1. **Desktop** : > 700px
   - Tableaux avec largeur fixe (80%, max 600px)
   - Espacement complet

2. **Tablette** : ≤ 700px
   - Tableaux pleine largeur
   - Espacement réduit

3. **Mobile** : ≤ 395px
   - Tableaux pleine largeur obligatoire
   - Police et padding très réduits
   - Boutons d'action compacts

### Règles spécifiques par page

Les règles spécifiques restent dans les fichiers CSS individuels :
- `ManageCategories.css` : Règles pour la gestion des catégories
- `ManageBeneficiaire.css` : Règles pour la gestion des bénéficiaires
- `AchatsTable.css` : Règles pour les tableaux d'achats

## Utilisation

### Pour un nouveau tableau

```jsx
import SortableTable from '../commun/SortableTable';

const columns = [
  { label: 'Nom', key: 'nom', sortable: true },
  { label: 'Actions', key: 'actions', sortable: false, render: (row) => (
    <div className="actions-cell">
      <ActionIconButton type="edit" onClick={() => handleEdit(row.id)} />
      <ActionIconButton type="delete" onClick={() => handleDelete(row.id)} />
    </div>
  )}
];

<SortableTable 
  columns={columns} 
  data={data} 
  className="unified-table--full-width" 
/>
```

### Classes recommandées

- Pour les tableaux de gestion : `unified-table`
- Pour les listes larges : `unified-table unified-table--full-width`
- Pour les tableaux compacts : `unified-table unified-table--compact`

## Avantages du système unifié

1. **Consistance** : Tous les tableaux suivent les mêmes règles de design
2. **Maintenabilité** : Un seul fichier CSS à maintenir pour les styles de base
3. **Performance** : Suppression des styles dupliqués
4. **Responsive** : Règles responsive harmonisées
5. **Évolutivité** : Facile d'ajouter de nouvelles variantes

## Prochaines étapes

1. **Tests complets** : Vérifier le rendu sur toutes les pages
2. **Suppression progressive** : Retirer les anciennes classes une fois la migration complète
3. **Documentation** : Mettre à jour la documentation développeur
4. **Optimisation** : Ajuster les breakpoints si nécessaire

## Notes techniques

- Les styles sont appliqués avec des spécificités appropriées
- La rétrocompatibilité est assurée pendant la phase de transition
- Les media queries sont organisées du plus large au plus étroit
- Les classes utilitaires utilisent `!important` pour garantir leur application
