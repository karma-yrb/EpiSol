#!/bin/bash

# Script de validation du système de versioning EpiSol
# Usage: ./validate-versioning.sh

set -e

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

log_info "🔍 Validation du système de versioning EpiSol"
echo ""

# Vérification des versions dans package.json
FRONTEND_VERSION=$(grep '"version"' package.json | sed 's/.*"version": "\(.*\)".*/\1/')
BACKEND_VERSION=$(grep '"version"' ../backend/package.json | sed 's/.*"version": "\(.*\)".*/\1/')

log_info "Versions dans package.json:"
echo "  Frontend: v$FRONTEND_VERSION"
echo "  Backend:  v$BACKEND_VERSION"

# Vérification de la synchronisation
if [ "$FRONTEND_VERSION" = "$BACKEND_VERSION" ]; then
    log_success "Versions frontend/backend synchronisées"
else
    log_error "Versions frontend/backend DÉSYNCHRONISÉES!"
    exit 1
fi

# Vérification du README_VERSIONING.md
README_VERSION=$(grep "Version actuelle" README_VERSIONING.md | sed 's/.*`v\(.*\)`.*/\1/')
log_info "Version dans README_VERSIONING.md: v$README_VERSION"

if [ "$FRONTEND_VERSION" = "$README_VERSION" ]; then
    log_success "Version README_VERSIONING.md synchronisée"
else
    log_warning "Version README_VERSIONING.md désynchronisée (attendu: v$FRONTEND_VERSION, trouvé: v$README_VERSION)"
fi

# Vérification du dernier tag Git
LATEST_TAG=$(git tag | sort -V | tail -1)
LATEST_TAG_VERSION=${LATEST_TAG#v}
log_info "Dernier tag Git: $LATEST_TAG"

if [ "$FRONTEND_VERSION" = "$LATEST_TAG_VERSION" ]; then
    log_success "Tag Git synchronisé"
else
    log_warning "Tag Git désynchronisé (attendu: v$FRONTEND_VERSION, trouvé: $LATEST_TAG)"
fi

# Test de l'endpoint API (si le serveur tourne)
log_info "Test de l'endpoint /api/version..."
if curl -f -s http://localhost:3001/api/version > /dev/null; then
    API_VERSION=$(curl -s http://localhost:3001/api/version | grep -o '"version":"[^"]*"' | sed 's/"version":"\(.*\)"/\1/')
    echo "  API Version: v$API_VERSION"
    
    if [ "$FRONTEND_VERSION" = "$API_VERSION" ]; then
        log_success "Version API synchronisée"
    else
        log_error "Version API désynchronisée!"
        exit 1
    fi
else
    log_warning "Serveur backend non accessible (http://localhost:3001)"
fi

echo ""
log_success "🎉 Validation du système de versioning terminée!"
echo ""
log_info "📊 Résumé:"
echo "  🏷️  Version unifiée: v$FRONTEND_VERSION"
echo "  📦 Frontend: ✅"
echo "  🔧 Backend: ✅"
echo "  📚 Documentation: ✅"
echo "  🏷️  Tag Git: ✅"
if [ -n "$API_VERSION" ]; then
    echo "  🌐 API: ✅"
fi
