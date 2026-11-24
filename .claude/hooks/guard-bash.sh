#!/usr/bin/env bash
# PreToolUse(Bash): bloqueia comandos destrutivos e pede confirmação nos arriscados.
source "$(dirname "$0")/lib.sh"

cmd="$(json_get '.tool_input.command')"
[ -z "$cmd" ] && exit 0

# --- Bloqueios definitivos ---------------------------------------------------
if grep -Eq 'git[[:space:]]+push[^|;&]*(--force|[[:space:]]-f([[:space:]]|$)|--force-with-lease)' <<<"$cmd"; then
  deny "Force push é proibido neste projeto. Faça push normal (e só quando o usuário pedir)."
fi
if grep -Eq '(rails|rake)[[:space:]]+db:(drop|reset|purge|schema:load)' <<<"$cmd"; then
  deny "db:drop/reset/purge/schema:load destroem o banco de desenvolvimento. Use bin/rails db:migrate ou RAILS_ENV=test bin/rails db:prepare."
fi
if grep -Eq "master\.key|credentials\.yml\.enc|(^|[[:space:]/'\"])\.env([[:space:]'\"]|$|\.[a-z]+)" <<<"$cmd" && ! grep -Eq 'git[[:space:]]+(status|check-ignore)' <<<"$cmd"; then
  deny "Não leia, copie nem versione segredos (master.key, credentials.yml.enc, .env). Peça ao usuário para configurá-los."
fi
if grep -Eq 'rm[[:space:]]+-[a-zA-Z]*r[a-zA-Z]*f?[[:space:]]+(/|~|\$HOME|\.\.?/?)([[:space:]]|$)' <<<"$cmd"; then
  deny "rm -rf em diretório raiz/home/projeto inteiro bloqueado. Remova arquivos específicos."
fi
if grep -Eq -- '--no-verify' <<<"$cmd"; then
  deny "Não pule hooks do git (--no-verify). Corrija o problema apontado."
fi

# --- Precisa de confirmação ---------------------------------------------------
if grep -Eq '(rails|rake)[[:space:]]+db:seed' <<<"$cmd"; then
  ask "db/seeds.rb executa destroy_all em TODAS as tabelas antes de recriar os dados. Confirmar?"
fi
if grep -Eq 'git[[:space:]]+push' <<<"$cmd"; then
  ask "Push para o remoto (github.com/JIgor-Silva/roterizadorapp). Confirmar?"
fi
if grep -Eq 'npm[[:space:]]+(install|i|add)[[:space:]]+[^-]|bundle[[:space:]]+add|gem[[:space:]]+install' <<<"$cmd"; then
  ask "Adicionar dependência nova muda package.json/Gemfile. Confirmar com o usuário? (No front prefira 'npx expo install <pkg>' para versões compatíveis com o Expo 53.)"
fi

exit 0
