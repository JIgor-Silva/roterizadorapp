#!/usr/bin/env bash
# Funções compartilhadas pelos hooks do RoterizadorApp.
# Hooks rodam em shell não interativo: garante rbenv (Ruby) e fnm (Node) no PATH.

ROOT="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
export PATH="$HOME/.rbenv/shims:$HOME/.rbenv/bin:$HOME/.local/share/fnm:$PATH"
if command -v fnm >/dev/null 2>&1 && ! command -v node >/dev/null 2>&1; then
  eval "$(fnm env --shell bash 2>/dev/null)" >/dev/null 2>&1
fi

# Lê o JSON do hook (stdin) uma única vez.
HOOK_INPUT="$(cat)"

json_get() { # json_get '.tool_input.command'
  printf '%s' "$HOOK_INPUT" | jq -r "$1 // empty" 2>/dev/null
}

# Nega a ação com motivo (PreToolUse).
deny() {
  jq -n --arg r "$1" '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$r}}'
  exit 0
}

# Pede confirmação ao usuário (PreToolUse).
ask() {
  jq -n --arg r "$1" '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"ask",permissionDecisionReason:$r}}'
  exit 0
}

# Caminho relativo à raiz do repo.
relpath() {
  local p="$1"
  case "$p" in
    "$ROOT"/*) printf '%s' "${p#"$ROOT"/}" ;;
    *) printf '%s' "$p" ;;
  esac
}
