#!/usr/bin/env bash
# PostToolUse(Edit|Write|MultiEdit): verificação rápida do arquivo editado.
#  - Ruby (.rb em backend/): checa sintaxe, aplica rubocop -a (correções seguras) e reporta o que sobrou.
#  - TS/TSX (front-app/): roda tsc --noEmit e reporta erros DO ARQUIVO editado.
source "$(dirname "$0")/lib.sh"

file="$(json_get '.tool_input.file_path')"
[ -z "$file" ] || [ ! -f "$file" ] && exit 0
rel="$(relpath "$file")"

feedback() { # bloqueante: o modelo precisa corrigir
  jq -n --arg r "$(printf '%b' "$1")" '{decision:"block",reason:$r}'
  exit 0
}
context() { # informativo
  jq -n --arg c "$(printf '%b' "$1")" '{hookSpecificOutput:{hookEventName:"PostToolUse",additionalContext:$c}}'
  exit 0
}

case "$rel" in
  backend/*.rb|backend/*.rake|backend/Gemfile)
    if ! syntax="$(ruby -c "$file" 2>&1)"; then
      feedback "Erro de sintaxe Ruby em $rel:\n$syntax"
    fi
    cd "$ROOT/backend" || exit 0
    inner="${rel#backend/}"
    bundle exec rubocop -a --force-exclusion "$inner" >/dev/null 2>&1
    out="$(bundle exec rubocop --force-exclusion --format simple "$inner" 2>/dev/null | grep -E '^[CWEF]:' | head -15)"
    if [ -n "$out" ]; then
      context "RuboCop aplicou correções seguras em $rel (releia o arquivo antes do próximo Edit). Ofensas restantes:\n$out"
    fi
    ;;
  front-app/*.ts|front-app/*.tsx)
    cd "$ROOT/front-app" || exit 0
    inner="${rel#front-app/}"
    errs="$(npx --no-install tsc --noEmit 2>/dev/null | grep -F "$inner(" | head -15)"
    if [ -n "$errs" ]; then
      feedback "TypeScript encontrou erros em $rel (corrija antes de seguir):\n$errs"
    fi
    ;;
esac

exit 0
