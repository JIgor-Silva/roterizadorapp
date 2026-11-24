#!/usr/bin/env bash
# Diagnóstico do ambiente local do RoterizadorApp. Uso: bash .claude/scripts/doctor.sh
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
export PATH="$HOME/.rbenv/shims:$HOME/.rbenv/bin:$PATH"
ok()   { printf '  \033[32m✔\033[0m %s\n' "$1"; }
bad()  { printf '  \033[31m✘\033[0m %s\n' "$1"; }
info() { printf '  • %s\n' "$1"; }

echo "== Ferramentas"
want_ruby="$(cat "$ROOT/backend/.ruby-version")"
have_ruby="$(ruby -e 'print RUBY_VERSION' 2>/dev/null)"
[ "$have_ruby" = "$want_ruby" ] && ok "Ruby $have_ruby" || bad "Ruby '$have_ruby' (esperado $want_ruby)"
command -v bundle >/dev/null && ok "Bundler $(bundle -v 2>/dev/null | awk '{print $NF}')" || bad "bundle não encontrado"
command -v node >/dev/null && ok "Node $(node -v 2>/dev/null)" || bad "node não encontrado (fnm env?)"
command -v psql >/dev/null && ok "psql presente" || bad "psql não encontrado"

echo "== PostgreSQL"
if pg_isready -h localhost -p 5433 -q 2>/dev/null; then ok "aceitando conexões em localhost:5433"; else bad "não responde em localhost:5433"; fi

echo "== Backend"
cd "$ROOT/backend" || exit 1
[ -f config/master.key ] && ok "config/master.key presente" || bad "config/master.key ausente (credentials não decifram)"
if bundle check >/dev/null 2>&1; then ok "gems instaladas"; else bad "rode: bundle install"; fi
pending="$(bin/rails db:migrate:status 2>/dev/null | grep -c '^\s*down')"
if [ -z "$pending" ] || [ "$pending" = "0" ]; then ok "sem migrações pendentes (development)"; else bad "$pending migração(ões) pendente(s) → bin/rails db:migrate"; fi
for k in "devise jwt_secret_key" "open_route_service api_key" "weather_map api_key"; do
  set -- $k
  if bin/rails runner "exit(Rails.application.credentials.dig(:$1, :$2).present? ? 0 : 1)" >/dev/null 2>&1; then
    ok "credencial $1.$2 configurada"
  else
    info "credencial $1.$2 ausente (recurso dependente fica limitado)"
  fi
done

echo "== Front"
cd "$ROOT/front-app" || exit 1
[ -d node_modules ] && ok "node_modules instalado" || bad "rode: npm install"
info "EXPO_PUBLIC_API_URL=${EXPO_PUBLIC_API_URL:-<não definido → http://localhost:3000/api/v1>}"
n="$(npx --no-install tsc --noEmit 2>/dev/null | grep -c 'error TS')"
[ "$n" = "0" ] && ok "tsc sem erros" || info "tsc: $n erro(s) (baseline conhecido: 7)"
