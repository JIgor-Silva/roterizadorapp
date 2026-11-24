#!/usr/bin/env bash
# Verificação completa (equivalente local do CI). Uso: bash .claude/scripts/check.sh [back|front|all]
# Sai com código != 0 se alguma etapa falhar, mas executa todas.
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
export PATH="$HOME/.rbenv/shims:$HOME/.rbenv/bin:$PATH"
target="${1:-all}"
fail=0
step() { echo; echo "──── $1"; }
run()  { if "$@"; then echo "✔ ok"; else echo "✘ FALHOU: $*"; fail=1; fi; }

if [ "$target" = "back" ] || [ "$target" = "all" ]; then
  cd "$ROOT/backend" || exit 1
  step "Backend · RSpec"
  run bundle exec rspec --format progress
  step "Backend · RuboCop (só arquivos alterados vs HEAD)"
  changed="$(git diff --name-only --diff-filter=ACMR HEAD -- . | grep -E '\.rb$' | sed 's#^backend/##')"
  untracked="$(git ls-files --others --exclude-standard -- . | grep -E '\.rb$')"
  files="$(printf '%s\n%s\n' "$changed" "$untracked" | grep -v '^$' | sort -u)"
  if [ -n "$files" ]; then run bundle exec rubocop --force-exclusion $files; else echo "(nenhum .rb alterado)"; fi
  step "Backend · Brakeman"
  run bundle exec brakeman --no-pager -q --no-summary
fi

if [ "$target" = "front" ] || [ "$target" = "all" ]; then
  cd "$ROOT/front-app" || exit 1
  step "Front · TypeScript"
  out="$(npx --no-install tsc --noEmit 2>/dev/null)"
  n="$(printf '%s' "$out" | grep -c 'error TS')"
  printf '%s\n' "$out" | grep 'error TS' | head -30
  if [ "$n" -gt 7 ]; then echo "✘ $n erros (baseline era 7 — você introduziu erros novos)"; fail=1
  elif [ "$n" -gt 0 ]; then echo "⚠ $n erros (baseline conhecido: 7 — ideal é zerar)"
  else echo "✔ ok"; fi
fi

echo
[ "$fail" = 0 ] && echo "RESULTADO: tudo passou" || echo "RESULTADO: há falhas acima"
exit "$fail"
