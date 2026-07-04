#!/usr/bin/env bash
set -euo pipefail

# ponytail: deploy target masih generik; isi RELEASE_DIR sesuai server/hosting.
RELEASE_DIR="${RELEASE_DIR:-./release}"
ENV_SRC="${ENV_SRC:-.env}"
BUILD_DIR="${BUILD_DIR:-build}"

[ -f "$ENV_SRC" ] || { echo "missing $ENV_SRC" >&2; exit 1; }

npm run build
cp "$ENV_SRC" "$BUILD_DIR/.env"

mkdir -p "$RELEASE_DIR"
rsync -a --delete "$BUILD_DIR"/ "$RELEASE_DIR"/

echo "release ok -> $RELEASE_DIR"
