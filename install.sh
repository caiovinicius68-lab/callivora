#!/usr/bin/env bash
set -e

echo "Instalando CalLivora..."
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js 20+ não encontrado. Instale Node.js antes de continuar."
  exit 1
fi

npm install
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Arquivo .env criado. Configure OPENAI_API_KEY para usar IA online."
fi

echo "Pronto. Rode: npm start"
