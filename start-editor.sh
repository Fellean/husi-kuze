#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"

if command -v xdg-open >/dev/null 2>&1; then
  xdg-open http://127.0.0.1:8765 >/dev/null 2>&1 &
elif command -v open >/dev/null 2>&1; then
  open http://127.0.0.1:8765
fi

exec node local-editor/server.mjs
