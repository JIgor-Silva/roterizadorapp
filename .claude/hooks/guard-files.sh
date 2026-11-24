#!/usr/bin/env bash
# PreToolUse(Edit|Write|MultiEdit): protege arquivos sensíveis ou gerados.
source "$(dirname "$0")/lib.sh"

file="$(json_get '.tool_input.file_path')"
[ -z "$file" ] && exit 0
rel="$(relpath "$file")"

case "$rel" in
  backend/config/master.key|backend/config/credentials.yml.enc|*/.env|.env|*/.env.*|*.key)
    deny "Arquivo de segredo ($rel). Não edite; peça ao usuário (EDITOR=nano bin/rails credentials:edit)." ;;
  backend/db/schema.rb|backend/db/*_schema.rb)
    deny "$rel é gerado pelo Rails. Crie uma migração (bin/rails g migration ...) e rode bin/rails db:migrate." ;;
  */Gemfile.lock|*/package-lock.json)
    deny "$rel é gerado pelo gerenciador de pacotes. Use bundle/npm em vez de editar à mão." ;;
  */node_modules/*|backend/vendor/*|*/.expo/*|backend/tmp/*|backend/log/*)
    deny "$rel é dependência/arquivo gerado; não edite." ;;
  backend/db/migrate/*.rb)
    # Migração já versionada no git não pode ser alterada: crie uma nova.
    if git -C "$ROOT" ls-files --error-unmatch "$rel" >/dev/null 2>&1; then
      deny "$rel já está versionada. Nunca edite migrações existentes; crie uma nova com bin/rails g migration."
    fi ;;
esac

exit 0
