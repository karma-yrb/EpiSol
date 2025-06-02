#!/bin/bash

# Script de mise à jour de version pour EpiSol
# Usage: ./update-version.sh [patch|minor|major] [message]

set -e

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$PROJECT_ROOT"
BACKEND_DIR="$(dirname "$PROJECT_ROOT")/backend"

# Fonctions utilitaires
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Fonction pour obtenir la version actuelle
get_current_version() {
    grep '"version"' "$FRONTEND_DIR/package.json" | sed 's/.*"version": "\(.*\)".*/\1/'
}

# Fonction pour incrémenter la version
increment_version() {
    local version=$1
    local type=$2
    
    IFS='.' read -r -a version_parts <<< "$version"
    local major=${version_parts[0]}
    local minor=${version_parts[1]}
    local patch=${version_parts[2]}
    
    case $type in
        "patch")
            patch=$((patch + 1))
            ;;
        "minor")
            minor=$((minor + 1))
            patch=0
            ;;
        "major")
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        *)
            log_error "Type de version invalide: $type (utilisez: patch, minor, major)"
            exit 1
            ;;
    esac
    
    echo "$major.$minor.$patch"
}

# Fonction pour mettre à jour package.json
update_package_json() {
    local file=$1
    local new_version=$2
    
    # Sauvegarde
    cp "$file" "$file.backup"
    
    # Mise à jour avec sed
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/\"version\": \".*\"/\"version\": \"$new_version\"/" "$file"
    else
        # Linux/Windows
        sed -i "s/\"version\": \".*\"/\"version\": \"$new_version\"/" "$file"
    fi
    
    log_success "Mis à jour $(basename "$file") vers v$new_version"
}

# Fonction principale
main() {
    local version_type=${1:-"patch"}
    local commit_message=${2:-""}
    
    log_info "🚀 Démarrage de la mise à jour de version EpiSol"
    
    # Vérification que nous sommes dans un repo git
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Ce script doit être exécuté dans un repository Git"
        exit 1
    fi
    
    # Vérification que le working directory est propre
    if ! git diff-index --quiet HEAD --; then
        log_warning "Il y a des changements non commitées. Continuer? (y/N)"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            log_info "Arrêt du script"
            exit 0
        fi
    fi
    
    # Obtenir la version actuelle
    local current_version
    current_version=$(get_current_version)
    log_info "Version actuelle: v$current_version"
    
    # Calculer la nouvelle version
    local new_version
    new_version=$(increment_version "$current_version" "$version_type")
    log_info "Nouvelle version: v$new_version"
    
    # Confirmation
    log_warning "Mettre à jour de v$current_version vers v$new_version? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        log_info "Annulation"
        exit 0
    fi
    
    # Mise à jour du package.json frontend
    log_info "Mise à jour du package.json frontend..."
    update_package_json "$FRONTEND_DIR/package.json" "$new_version"
    
    # Mise à jour du package.json backend (si accessible)
    if [[ -f "$BACKEND_DIR/package.json" ]]; then
        log_info "Mise à jour du package.json backend..."
        update_package_json "$BACKEND_DIR/package.json" "$new_version"
    else
        log_warning "Backend package.json non trouvé à $BACKEND_DIR"
        log_info "N'oubliez pas de mettre à jour manuellement la version backend !"
    fi
    
    # Mise à jour du CHANGELOG.md
    log_info "Mise à jour du CHANGELOG.md..."
    local date=$(date +%Y-%m-%d)
    local changelog_entry="\n## [$new_version] - $date\n\n### 🔄 Modifié\n- Mise à jour de version vers v$new_version\n"
    
    # Insérer après la ligne "## ["
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "/^## \[/i\\
$changelog_entry" "$FRONTEND_DIR/CHANGELOG.md"
    else
        sed -i "/^## \[/i $changelog_entry" "$FRONTEND_DIR/CHANGELOG.md"
    fi
    
    # Commit des changements
    log_info "Commit des changements..."
    git add .
    
    if [[ -n "$commit_message" ]]; then
        git commit -m "chore: bump version to v$new_version - $commit_message"
    else
        git commit -m "chore: bump version to v$new_version"
    fi
    
    # Création du tag
    log_info "Création du tag v$new_version..."
    if [[ -n "$commit_message" ]]; then
        git tag -a "v$new_version" -m "Release version $new_version - $commit_message"
    else
        git tag -a "v$new_version" -m "Release version $new_version"
    fi
    
    log_success "✨ Version v$new_version créée avec succès!"
    log_info "Pour pousser les changements: git push origin main --tags"
    
    # Nettoyage des sauvegardes
    rm -f "$FRONTEND_DIR/package.json.backup"
    [[ -f "$BACKEND_DIR/package.json.backup" ]] && rm -f "$BACKEND_DIR/package.json.backup"
}

# Aide
show_help() {
    echo "Usage: $0 [patch|minor|major] [message]"
    echo ""
    echo "Types de version:"
    echo "  patch  - Correction de bugs (1.0.0 -> 1.0.1)"
    echo "  minor  - Nouvelles fonctionnalités (1.0.0 -> 1.1.0)"
    echo "  major  - Breaking changes (1.0.0 -> 2.0.0)"
    echo ""
    echo "Exemples:"
    echo "  $0 patch \"Correction bug critique\""
    echo "  $0 minor \"Nouvelle fonctionnalité export PDF\""
    echo "  $0 major \"Refactoring architecture\""
}

# Point d'entrée
if [[ "${1}" == "-h" ]] || [[ "${1}" == "--help" ]]; then
    show_help
    exit 0
fi

main "$@"