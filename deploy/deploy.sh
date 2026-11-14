set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEB_DIR="${WEB_DIR:-/var/www/catiforms}"
SERVICE="${SERVICE:-catiforms-api}"    
BASE_PATH="${BASE_PATH:-/catiforms/}"  

export PATH="/usr/bin:$PATH"

step "API: instalando dependências e compilando"
cd "$REPO_DIR/api"
npm ci --no-audit --no-fund
npm run build

step "Banco: garantindo que o Postgres está rodando"
docker compose -f "$REPO_DIR/deploy/compose.yaml" up -d --wait

step "API: atualizando o banco de dados"
# Recusa mudanças que perderiam dados; nesse caso o deploy para aqui e a versão antiga segue no ar.
npm run db:update

step "Front: instalando dependências e gerando o build"
cd "$REPO_DIR/app"
npm ci --no-audit --no-fund
VITE_BASE_PATH="$BASE_PATH" npm run build

step "Front: publicando em $WEB_DIR"
mkdir -p "$WEB_DIR"
find "$WEB_DIR" -mindepth 1 -delete
cp -r dist/. "$WEB_DIR/"

step "API: reiniciando $SERVICE"
sudo systemctl restart "$SERVICE"
sleep 2
if ! systemctl is-active --quiet "$SERVICE"; then
  echo "A API não subiu. Últimos logs:" >&2
  journalctl -u "$SERVICE" -n 30 --no-pager >&2 || true
  exit 1
fi

step "Deploy concluído ✔"
