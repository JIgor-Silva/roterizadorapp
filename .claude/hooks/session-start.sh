#!/usr/bin/env bash
# SessionStart: injeta um retrato rápido do estado do repo no contexto.
source "$(dirname "$0")/lib.sh"
cd "$ROOT" || exit 0

echo "## Estado do RoterizadorApp ($(date +%F))"
echo "- Branch: $(git branch --show-current 2>/dev/null)"
changes="$(git status --short 2>/dev/null | head -20)"
if [ -n "$changes" ]; then
  echo "- Alterações não commitadas:"
  printf '%s\n' "$changes" | sed 's/^/    /'
else
  echo "- Working tree limpo."
fi

# Migrações pendentes em relação ao schema.rb (sem precisar do banco).
schema_ver="$(grep -oE 'version: [0-9_]+' backend/db/schema.rb 2>/dev/null | grep -oE '[0-9_]+' | tr -d '_')"
if [ -n "$schema_ver" ]; then
  pending=0
  for f in backend/db/migrate/*.rb; do
    v="$(basename "$f" | cut -d_ -f1)"
    [ "$v" -gt "$schema_ver" ] && pending=$((pending + 1))
  done
  [ "$pending" -gt 0 ] && echo "- ATENÇÃO: $pending migração(ões) mais novas que db/schema.rb (banco de teste atrasado) → rode /db-status antes de testar."
fi

if command -v pg_isready >/dev/null 2>&1; then
  if pg_isready -h localhost -p 5433 -q 2>/dev/null; then
    echo "- PostgreSQL: ok (localhost:5433)"
  else
    echo "- PostgreSQL: NÃO responde em localhost:5433 (testes do backend vão falhar)."
  fi
fi

echo "- Contexto completo e backlog de problemas conhecidos: CLAUDE.md. Regras: .claude/rules/. Skills: .claude/skills/."
exit 0
