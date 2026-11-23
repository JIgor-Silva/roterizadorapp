---
name: ambiente-local
description: Subir, diagnosticar e consertar o ambiente de desenvolvimento local do RoterizadorApp (PostgreSQL 5433, migrações pendentes, rbenv/fnm, servidor Rails, Expo, URL da API no celular). Use quando algo "não roda", testes abortam por banco, ou o app não conecta na API.
---

# Ambiente local

Rode o diagnóstico completo primeiro:
```bash
bash .claude/scripts/doctor.sh
```

## Problemas comuns → solução
| Sintoma | Causa | Solução |
|---------|-------|---------|
| `rspec` aborta "You have N pending migrations" | `schema.rb` desatualizado / banco de teste atrasado | `cd backend && bin/rails db:migrate && bin/rails db:schema:dump && RAILS_ENV=test bin/rails db:prepare` (confira `git diff db/schema.rb`) |
| `PG::ConnectionBad ... port 5433` | Postgres parado | peça ao usuário: `sudo systemctl start postgresql` (porta 5433 no `database.yml`) |
| `database "backend_test" does not exist` | banco não criado | `RAILS_ENV=test bin/rails db:prepare` |
| `ruby: command not found` / versão errada | rbenv fora do PATH | `export PATH="$HOME/.rbenv/shims:$PATH"`; versão em `backend/.ruby-version` (3.3.6) |
| aviso "Node.js path is not on your PATH" | fnm sem `fnm env` | `eval "$(fnm env)"` — é só aviso, comandos funcionam |
| `ActiveSupport::MessageEncryptor::InvalidMessage` | falta `config/master.key` | peça ao usuário a chave; nunca gere outra por cima |
| App no celular não carrega pedidos | `localhost` aponta para o celular | `EXPO_PUBLIC_API_URL=http://<IP-da-máquina>:3000/api/v1 npm start` e `bin/rails s -b 0.0.0.0` |
| Rota/clima vazios | chave ORS/WeatherAPI ausente nas credentials | serviços retornam `{error:}`/`{}`; peça ao usuário para configurar |
| `kamal`/`ed25519` falha no `bundle install` | grupo `deploy` | `bundle config set --local without deploy` |

## Subir tudo
```bash
cd backend && bin/rails s -b 0.0.0.0          # terminal 1 — API em :3000, Swagger em /api-docs
cd front-app && npm start                     # terminal 2 — Expo (w = web, a = android)
```
Para servidores de longa duração use terminal/background — não bloqueie a sessão esperando.

## Dados de exemplo
`bin/rails db:seed` **apaga tudo** e recria lojas/usuários/pedidos (senha `password`, ex.: `admin.loja1@example.com`). Só com confirmação.
