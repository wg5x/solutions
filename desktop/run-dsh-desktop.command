#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

APP_PATH="release/mac-green/DSH Desktop.app"
if [[ -d "$APP_PATH" ]]; then
  open -a "$APP_PATH"
elif [[ -x "node_modules/electron/dist/Electron.app/Contents/MacOS/Electron" ]]; then
  "node_modules/electron/dist/Electron.app/Contents/MacOS/Electron" .
else
  npm start
fi
