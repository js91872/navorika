#!/usr/bin/env bash
# Build a reviewed release separately, then swap with rollback on startup failure.
set -Eeuo pipefail
APP=${NAVORIKA_APP_DIR:-/var/www/navorika}
BACKUP_ROOT=${NAVORIKA_BACKUP_ROOT:-/var/backups/navorika}
TARGET=${1:?Pass the full reviewed release commit SHA}
if [[ ! "$TARGET" =~ ^[0-9a-f]{40}$ ]]; then
  echo "STOP: Expected a full release commit SHA."
  exit 1
fi
cd "$APP"

if [ -n "$(git status --porcelain)" ]; then
  git status --short
  echo "STOP: Local changes need review. Nothing was deployed."
  exit 1
fi
[ "$(git branch --show-current)" = main ] || {
  echo "STOP: Expected the main branch. Nothing was deployed."
  exit 1
}
pm2 describe navorika >/dev/null
git fetch origin main
git merge-base --is-ancestor HEAD "$TARGET" || {
  echo "STOP: VPS commits differ from this reviewed release."
  exit 1
}
PREVIOUS=$(git rev-parse HEAD)
STAGE=$(mktemp -d "$(dirname "$APP")/navorika-release.XXXXXX")
git worktree add --detach "$STAGE" "$TARGET"
for ENVFILE in .env .env.local .env.production .env.production.local; do
  if [ -f "$APP/$ENVFILE" ]; then
    install -m 600 "$APP/$ENVFILE" "$STAGE/$ENVFILE"
  fi
done

(
  cd "$STAGE"
  npm ci --include=dev --no-audit --no-fund
  npm run validate:architecture
  npm run test:i18n
  NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=2048 npm run build
)

mkdir -p "$BACKUP_ROOT"
BACKUP=$(mktemp -d "$BACKUP_ROOT/release.XXXXXX")
printf '%s\n' "$PREVIOUS" > "$BACKUP/previous-commit"
rollback() {
  trap - ERR
  set +e
  echo "Deployment failed; restoring the previous release."
  pm2 stop navorika
  for ITEM in .next node_modules; do
    if [ -d "$BACKUP/$ITEM" ]; then
      if [ -e "$APP/$ITEM" ]; then
        mv "$APP/$ITEM" "$BACKUP/failed-${ITEM#.}"
      fi
      mv "$BACKUP/$ITEM" "$APP/$ITEM"
    fi
  done
  git -C "$APP" switch --detach "$PREVIOUS"
  pm2 restart navorika --update-env
  echo "Rollback attempted. Check PM2. Backup: $BACKUP"
  exit 1
}
trap rollback ERR
pm2 stop navorika
git merge --ff-only "$TARGET"
if [ -d .next ]; then mv .next "$BACKUP/.next"; fi
if [ -d node_modules ]; then mv node_modules "$BACKUP/node_modules"; fi
mv "$STAGE/.next" "$APP/.next"
mv "$STAGE/node_modules" "$APP/node_modules"
pm2 restart navorika --update-env

for PAGE in / /tools/rgb-cmyk-image-checker /fr /it /pt /es /ar /ru /de /fr/tools/pdf-bleed-trim-checker /ar/tools/image-print-size-calculator /fr/tools/css-gradient-generator /ar/tools/css-clamp-font-generator /de/tools/image-scaling-calculator; do
  curl --fail --silent --show-error --retry 5 --retry-connrefused --retry-delay 2 --max-time 20 \
    -o /dev/null -w "$PAGE: HTTP %{http_code}\n" "http://127.0.0.1:3000$PAGE"
done
trap - ERR
pm2 save
echo "DEPLOYED. Previous release backup: $BACKUP"
echo "Public checks:"
for PAGE in /fr /ar/tools/rgb-cmyk-image-checker /fr/tools/pdf-bleed-trim-checker /ar/tools/image-print-size-calculator /sitemap.xml; do
  curl --silent --show-error --max-time 20 -o /dev/null \
    -w "$PAGE: HTTP %{http_code}\n" "https://navorika.com$PAGE"
done
