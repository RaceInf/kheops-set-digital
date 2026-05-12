#!/bin/bash

# Script de démarrage du système sécurisé KHEOPS SET DIGITAL
# Ce script démarre le backend sécurisé et le frontend

echo "🚀 Démarrage du système sécurisé KHEOPS SET DIGITAL..."
echo ""

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    print_error "Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier la version de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 ou supérieure est requise. Version actuelle: $(node -v)"
    exit 1
fi

print_success "Node.js $(node -v) détecté"

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    print_warning "Dépendances frontend non installées. Installation en cours..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    print_warning "Dépendances backend non installées. Installation en cours..."
    cd backend
    npm install
    cd ..
fi

# Vérifier si le fichier .env existe dans le backend
if [ ! -f "backend/.env" ]; then
    print_warning "Fichier .env manquant dans le backend. Création en cours..."
    cd backend
    cp env.example .env
    
    # Générer des clés sécurisées
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
    ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    
    # Mettre à jour le fichier .env
    sed -i '' "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
    sed -i '' "s/ENCRYPTION_KEY=.*/ENCRYPTION_KEY=$ENCRYPTION_KEY/" .env
    
    print_success "Fichier .env créé avec des clés sécurisées"
    cd ..
fi

# Fonction pour nettoyer les processus au démarrage
cleanup() {
    print_status "Arrêt des processus..."
    pkill -f "node.*backend/server.js" 2>/dev/null
    pkill -f "vite" 2>/dev/null
    print_success "Processus arrêtés"
}

# Nettoyer les processus existants
cleanup

# Démarrer le backend en arrière-plan
print_status "Démarrage du backend sécurisé..."
cd backend
npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Attendre que le backend démarre
sleep 3

# Vérifier si le backend fonctionne
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    print_success "Backend démarré avec succès sur http://localhost:3001"
else
    print_error "Le backend n'a pas démarré correctement. Vérifiez backend.log"
    exit 1
fi

# Démarrer le frontend
print_status "Démarrage du frontend..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

# Attendre que le frontend démarre
sleep 5

# Vérifier si le frontend fonctionne
if curl -s https://localhost:8081 > /dev/null 2>&1; then
    print_success "Frontend démarré avec succès sur https://localhost:8081"
elif curl -s http://localhost:8081 > /dev/null 2>&1; then
    print_success "Frontend démarré avec succès sur http://localhost:8081"
else
    print_warning "Le frontend pourrait ne pas être encore prêt. Vérifiez frontend.log"
fi

echo ""
echo "🎉 Système sécurisé KHEOPS SET DIGITAL démarré !"
echo ""
echo "📱 Frontend: https://localhost:8081"
echo "🔒 Backend:  http://localhost:3001"
echo "👤 Admin:    https://localhost:8081/admin"
echo ""
echo "🔑 Identifiants par défaut:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "⚠️  IMPORTANT: Changez le mot de passe immédiatement !"
echo ""
echo "📋 Logs:"
echo "   Backend:  backend.log"
echo "   Frontend: frontend.log"
echo ""
echo "🛑 Pour arrêter: Ctrl+C"

# Fonction de nettoyage à la sortie
trap 'cleanup; exit' INT TERM

# Attendre que l'utilisateur arrête le script
wait 