#!/usr/bin/env bash
# Build away from the live directory. Switch only after a complete build and keep rollback.
set -Eeuo pipefail

APP=${NAVORIKA_APP_DIR:-/var/www/navorika}
BACKUP_ROOT=${NAVORIKA_BACKUP_ROOT:-/var/backups/navorika}
PORT=${NAVORIKA_PORT:-3100}
TARGET=${1:?Usage: bash scripts/deploy-vps.sh <full-40-character-reviewed-commit-sha>}
[[ "$TARGET" =~ ^[0-9a-f]{40}$ ]] || { echo "STOP: Supply the full reviewed commit SHA."; exit 1; }
[[ "$PORT" =~ ^[0-9]+$ ]] || { echo "STOP: Invalid port."; exit 1; }

cd "$APP"
[[ "$(git branch --show-current)" == main ]] || { echo "STOP: Main branch required."; exit 1; }
[[ -z "$(git status --porcelain)" ]] || { echo "STOP: Working tree is not clean."; git status --short; exit 1; }
pm2 describe navorika >/dev/null
PID=$(pm2 pid navorika)
[[ "$PID" =~ ^[0-9]+$ && "$PID" -gt 0 ]] || { echo "STOP: Navorika is not running."; exit 1; }
[[ "$(readlink -f "/proc/$PID/cwd")" == "$(realpath "$APP")" ]] || {
  echo "STOP: PM2 is not running from $APP. Do not switch an unknown release."; exit 1;
}
curl -fsS --max-time 15 "http://127.0.0.1:$PORT/" -o /dev/null || {
  echo "STOP: Existing site is unhealthy. Restore it before deploying."; exit 1;
}

git fetch origin main
git cat-file -e "$TARGET^{commit}"
git merge-base --is-ancestor "$TARGET" origin/main || {
  echo "STOP: Target commit is not on origin/main."; exit 1;
}
git merge-base --is-ancestor HEAD "$TARGET" || {
  echo "STOP: Target does not descend from current main."; exit 1;
}
PREVIOUS=$(git rev-parse HEAD)
if [[ "$PREVIOUS" == "$TARGET" ]]; then
  echo "Already at target commit; no deployment required."
  exit 0
fi

MIN_FREE_GB=${NAVORIKA_MIN_FREE_GB:-15}
[[ "$MIN_FREE_GB" =~ ^[0-9]+$ ]] || { echo "STOP: Invalid minimum free space."; exit 1; }
FREE_KB=$(df -Pk "$APP" | awk 'NR==2 {print $4}')
(( FREE_KB >= MIN_FREE_GB * 1024 * 1024 )) || {
  echo "STOP: Insufficient disk space for a separate build (need ${MIN_FREE_GB} GiB)."; exit 1;
}

STAGE=$(mktemp -d "$(dirname "$APP")/navorika-stage.XXXXXX")
BACKUP=""
SWITCH_STARTED=0
HEALTHY=0

rollback() {
  local status=$?
  trap - ERR INT TERM EXIT
  set +e
  if (( SWITCH_STARTED && ! HEALTHY )); then
    echo "Deployment failed after switch; restoring previous build."
    pm2 stop navorika
    for item in .next node_modules; do
      if [[ -e "$BACKUP/$item" ]]; then
        [[ -e "$APP/$item" ]] && mv "$APP/$item" "$STAGE/failed-${item#.}"
        mv "$BACKUP/$item" "$APP/$item"
      fi
    done
    git reset --hard "$PREVIOUS"
    pm2 restart navorika --update-env
    curl -fsS --retry 5 --retry-connrefused --retry-delay 2 --max-time 15 \
      "http://127.0.0.1:$PORT/" -o /dev/null || echo "ALERT: Rollback needs manual attention."
    echo "Rollback backup directory: $BACKUP"
  fi
  git -C "$APP" worktree remove --force "$STAGE" 2>/dev/null || true
  [[ ! -d "$STAGE" ]] || rm -rf -- "$STAGE"
  exit "$status"
}
trap rollback ERR INT TERM
trap 'if (( ! HEALTHY )); then rollback; else git -C "$APP" worktree remove --force "$STAGE" 2>/dev/null || true; [[ ! -d "$STAGE" ]] || rm -rf -- "$STAGE"; fi' EXIT

git worktree add --detach "$STAGE" "$TARGET"
for envfile in .env .env.local .env.production .env.production.local; do
  [[ ! -f "$APP/$envfile" ]] || install -m 600 "$APP/$envfile" "$STAGE/$envfile"
done

echo "Building target $TARGET in isolated staging; live site remains online."
(
  cd "$STAGE"
  npm ci --include=dev --no-audit --no-fund
  npm run validate:architecture
  npm run test:i18n
  NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=2048 npm run build
  test -s .next/BUILD_ID
  test -f node_modules/next/dist/bin/next
)
# Recheck live service before starting the brief switch.
curl -fsS --max-time 15 "http://127.0.0.1:$PORT/" -o /dev/null

mkdir -p "$BACKUP_ROOT"
BACKUP=$(mktemp -d "$BACKUP_ROOT/release.XXXXXX")
printf '%s\n' "$PREVIOUS" > "$BACKUP/previous-commit"

# Stop only after staging has built successfully. Restore old files on any failure.
SWITCH_STARTED=1
pm2 stop navorika
for item in .next node_modules; do
  [[ ! -e "$APP/$item" ]] || mv "$APP/$item" "$BACKUP/$item"
  mv "$STAGE/$item" "$APP/$item"
done
git merge --ff-only "$TARGET"
pm2 restart navorika --update-env
PID=$(pm2 pid navorika)
[[ "$PID" =~ ^[0-9]+$ && "$PID" -gt 0 ]]
[[ "$(readlink -f "/proc/$PID/cwd")" == "$(realpath "$APP")" ]]
for page in / /tools/upi-qr-code-generator /fr /sitemap.xml; do
  curl -fsS --retry 5 --retry-connrefused --retry-delay 2 --max-time 20 \
    "http://127.0.0.1:$PORT$page" -o /dev/null
done
HEALTHY=1
pm2 save
echo "DEPLOYED $TARGET on port $PORT. Previous build retained: $BACKUP"
echo "No automatic deletion of earlier backups."
