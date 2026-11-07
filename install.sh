#!/bin/sh
set -e

REPO_URL=${AFTEROFFICE_REPO:-https://github.com/ShippersLab/afteroffice}
BRANCH=${AFTEROFFICE_BRANCH:-main}
SCOPE=${1:-both}
DEST=${AFTEROFFICE_DEST:-$HOME/.afteroffice/afteroffice}

say() {
  printf "%s\n" "$1"
}

script_dir() {
  CDPATH= cd -- "$(dirname -- "$0")" && pwd
}

locate_repo() {
  LOCAL=$(script_dir)
  if [ -f "$LOCAL/.claude-plugin/marketplace.json" ]; then
    DEST="$LOCAL"
    return 0
  fi
  if ! command -v git >/dev/null 2>&1; then
    say "git is required to fetch the plugins. Install git and run this again."
    exit 1
  fi
  if [ -d "$DEST/.git" ]; then
    git -C "$DEST" fetch --depth 1 origin "$BRANCH"
    git -C "$DEST" checkout "$BRANCH"
    git -C "$DEST" reset --hard FETCH_HEAD
  else
    mkdir -p "$(dirname -- "$DEST")"
    git clone --depth 1 --branch "$BRANCH" "$REPO_URL" "$DEST"
  fi
}

install_claude() {
  if ! command -v claude >/dev/null 2>&1; then
    say "claude not found, skipping the Claude Code plugin."
    return 0
  fi
  claude plugin marketplace add "$DEST" >/dev/null 2>&1 ||
    say "marketplace afteroffice already registered."
  claude plugin install afteroffice@afteroffice >/dev/null 2>&1 ||
    say "plugin afteroffice already installed."
  say "Claude Code plugin installed. Start a new claude session and run /afteroffice:club join."
}

opencode_config_path() {
  CONFIG_DIR=${XDG_CONFIG_HOME:-$HOME/.config}/opencode
  mkdir -p "$CONFIG_DIR"
  if [ -f "$CONFIG_DIR/opencode.jsonc" ]; then
    printf "%s\n" "$CONFIG_DIR/opencode.jsonc"
  else
    printf "%s\n" "$CONFIG_DIR/opencode.json"
  fi
}

install_opencode() {
  if ! command -v opencode >/dev/null 2>&1; then
    say "opencode not found, skipping the OpenCode plugin."
    return 0
  fi
  CONFIG=$(opencode_config_path)
  PLUGIN_DIR="$DEST/packages/plugin-opencode"
  if command -v node >/dev/null 2>&1; then
    RUNTIME=node
  elif command -v bun >/dev/null 2>&1; then
    RUNTIME=bun
  else
    RUNTIME=""
  fi
  if [ -z "$RUNTIME" ]; then
    say "node or bun is needed to edit $CONFIG."
    say "Add this to the plugins array in $CONFIG yourself:"
    say "  \"$PLUGIN_DIR\""
    return 0
  fi
  if "$RUNTIME" -e '
    const fs = require("fs");
    const config = process.argv[1];
    const pluginDir = process.argv[2];
    let data = {};
    let raw = "";
    try {
      raw = fs.readFileSync(config, "utf8");
    } catch {}
    if (raw.trim().length > 0) {
      try {
        data = JSON.parse(raw);
      } catch {
        process.exit(2);
      }
    }
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      process.exit(2);
    }
    if (!Array.isArray(data.plugins)) {
      data.plugins = [];
    }
    if (!data.plugins.includes(pluginDir)) {
      data.plugins.push(pluginDir);
    }
    if (data.$schema === undefined) {
      data.$schema = "https://opencode.ai/config.json";
    }
    fs.writeFileSync(config, JSON.stringify(data, null, 2) + "\n");
  ' "$CONFIG" "$PLUGIN_DIR"; then
    say "OpenCode plugin registered in $CONFIG."
    say "OpenCode reloads config on its own. If it does not, run: opencode service restart"
  else
    say "could not update $CONFIG automatically."
    say "Add this to the plugins array in $CONFIG yourself:"
    say "  \"$PLUGIN_DIR\""
  fi
}

install_cli() {
  BIN_DIR=$HOME/.local/bin
  mkdir -p "$BIN_DIR"
  ln -sf "$DEST/packages/plugin-claude/bin/afteroffice" "$BIN_DIR/afteroffice"
  case ":$PATH:" in
    *":$BIN_DIR:"*) ;;
    *) say "Add $BIN_DIR to your PATH to run afteroffice from any terminal." ;;
  esac
}

usage() {
  say "Usage: ./install.sh [claude|opencode|both]"
}

case "$SCOPE" in
  claude) ;;
  opencode) ;;
  both) ;;
  *)
    usage
    exit 1
    ;;
esac

locate_repo
say "Using the afteroffice repository at $DEST"

if [ "$SCOPE" = "claude" ] || [ "$SCOPE" = "both" ]; then
  install_claude
fi
if [ "$SCOPE" = "opencode" ] || [ "$SCOPE" = "both" ]; then
  install_opencode
fi
install_cli

say ""
say "Next steps:"
say "  afteroffice join"
say "  afteroffice name <handle>"
say "  afteroffice floor"
say "Then watch your agent move at https://afteroffice.club"
say "The club server URL can be changed with AFTEROFFICE_URL."
