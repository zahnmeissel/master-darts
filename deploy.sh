#!/usr/bin/env bash
set -Eeuo pipefail

CONTAINER_NAME="my-react-app"
COMPOSE_FILE="docker-compose.yml"   # falls anders: z.B. docker-compose.prod.yml

log() {
  echo
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

on_error() {
  local exit_code=$?
  log "FEHLER beim Deployment (Exit-Code: $exit_code)"
  log "Container-Status:"
  docker compose -f "$COMPOSE_FILE" ps || true

  log "Letzte Logs (falls verfügbar):"
  docker logs --tail 100 "$CONTAINER_NAME" || true

  exit "$exit_code"
}

trap on_error ERR

log "Stoppe Container (falls er läuft): $CONTAINER_NAME"
docker stop "$CONTAINER_NAME" >/dev/null 2>&1 || true

log "Entferne Container (falls vorhanden): $CONTAINER_NAME"
docker rm "$CONTAINER_NAME" >/dev/null 2>&1 || true

log "Ziehe aktuelle Images"
docker compose -f "$COMPOSE_FILE" pull

log "Starte Container"
docker compose -f "$COMPOSE_FILE" up -d

log "Prüfe Status"
docker compose -f "$COMPOSE_FILE" ps

log "Zeige letzte Logs"
docker logs --tail 50 "$CONTAINER_NAME" || true

log "Deployment successfully"
