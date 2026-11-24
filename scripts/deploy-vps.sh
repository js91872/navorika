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
# Read the actual PM2 start port, not a hard-coded Next.js default.
PM2_PORT=$(pm2 jlist | node -e '
let data = "";
process.stdin.on("data", chunk => data += chunk);
process.stdin.on("end", () => {
  const app = JSON.parse(data).find(item => item.name === "navorika");
  if (!app) process.exit(1);
  const args = app.pm2_env?.args ?? [];
  const tokens = Array.isArray(args) ? args.map(String) : String(args).split(/\s+/);
  const index = tokens.findIndex(token => token === "-p" || token === "--port");
  const port = index >= 0 ? tokens[index + 1] : null;
  if (!port || !/^\d+$/.test(port) || +port < 1 || +port > 65535) process.exit(1);
  process.stdout.write(port);
});
') || { echo "STOP: Cannot determine Navorika port from PM2 arguments."; exit 1; }
# The current VPS Nginx site routes Navorika through a proxy_pass directive.
# Refuse deployment when it targets a different port; do not silently alter Nginx.
# Nginx server blocks can contain nested location blocks before location /.
# Track braces so closing a nested location does not end the server block.
NGINX_PORT=$(nginx -T 2>/dev/null | awk '
/server_name navorika\.com www\.navorika\.com;/ { in_site=1; next }
in_site && /proxy_pass http:\/\/127\.0\.0\.1:[0-9]+/ {
  line=$0; sub(/^.*127\.0\.0\.1:/, "", line); sub(/[^0-9].*$/, "", line);
  print line; exit
}
in_site && /server_name / { in_site=0 }
') || true
if [[ -z "$NGINX_PORT" || "$NGINX_PORT" != "$PM2_PORT" ]]; then
  echo "STOP: Navorika port mismatch: PM2=$PM2_PORT, Nginx=${NGINX_PORT:-unknown}."
  echo "Verify and align the live Nginx upstream before deploying; no changes made."
  exit 1
fi
curl --fail --silent --show-error --max-time 15 -o /dev/null "http://127.0.0.1:$PM2_PORT/" || {
  echo "STOP: Navorika is not responding on PM2 port $PM2_PORT. Nothing deployed."
  exit 1
}
echo "Preflight OK: PM2 and Nginx both use port $PM2_PORT."
git fetch origin main
git merge-base --is-ancestor HEAD "$TARGET" || {
  echo "STOP: VPS commits differ from this reviewed release."
  exit 1
}
PREVIOUS=$(git rev-parse HEAD)
# Prune only completed, marked backups. Never remove the active release.
prune_backups() {
  [[ -d "$BACKUP_ROOT" ]] || return 0
  local -a releases=()
  local candidate
  mapfile -t releases < <(
    find "$BACKUP_ROOT" -mindepth 1 -maxdepth 1 -type d -name 'release.*' -printf '%T@ %p\n' |
      sort -nr | cut -d' ' -f2-
  )
  for candidate in "${releases[@]:2}"; do
    if [[ -f "$candidate/previous-commit" && -d "$candidate/.next" ]]; then
      echo "Pruning old rollback backup: $candidate"
      rm -rf -- "$candidate"
    else
      echo "Skipping unverified backup: $candidate"
    fi
  done
}
prune_backups
# Fail before allocating another multi-gigabyte build workspace.
MIN_FREE_GB=${NAVORIKA_MIN_FREE_GB:-15}
[[ "$MIN_FREE_GB" =~ ^[0-9]+$ ]] || { echo "STOP: NAVORIKA_MIN_FREE_GB must be an integer."; exit 1; }
FREE_KB=$(df -Pk "$APP" | awk 'NR==2 {print $4}')
if (( FREE_KB < MIN_FREE_GB * 1024 * 1024 )); then
  echo "STOP: Only $((FREE_KB / 1024 / 1024)) GiB available; require at least ${MIN_FREE_GB} GiB."
  echo "Review disk usage and stale navorika-release.* directories before retrying."
  exit 1
fi
STAGE=$(mktemp -d "$(dirname "$APP")/navorika-release.XXXXXX")
cleanup_stage() {
  # Always remove this invocation's temporary worktree, including failed builds.
  git -C "$APP" worktree remove --force "$STAGE" 2>/dev/null || true
  if [[ -d "$STAGE" ]]; then rm -rf -- "$STAGE"; fi
}
trap cleanup_stage EXIT
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
    -o /dev/null -w "$PAGE: HTTP %{http_code}\n" "http://127.0.0.1:$PM2_PORT$PAGE"
done
trap - ERR
pm2 save
echo "DEPLOYED. Previous release backup: $BACKUP"
# Keep the two newest rollback backups after the release is healthy.
prune_backups
echo "Public checks:"
for PAGE in /fr /ar/tools/rgb-cmyk-image-checker /fr/tools/pdf-bleed-trim-checker /ar/tools/image-print-size-calculator /sitemap.xml; do
  curl --silent --show-error --max-time 20 -o /dev/null \
    -w "$PAGE: HTTP %{http_code}\n" "https://navorika.com$PAGE"
done
