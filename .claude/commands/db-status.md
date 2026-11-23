---
description: Mostra estado do banco (Postgres, migrações pendentes, schema.rb) e oferece sincronizar
allowed-tools: Bash(pg_isready:*), Bash(bin/rails db:migrate:status:*), Bash(git diff:*), Bash(cd backend*)
---
Em `backend/`:
1. `pg_isready -h localhost -p 5433`
2. `bin/rails db:migrate:status` — liste as migrações `down`.
3. Compare a versão em `db/schema.rb` com a migração mais recente em `db/migrate/`.

Resuma o estado. Se houver pendências, proponha (e só execute com OK do usuário):
`bin/rails db:migrate && RAILS_ENV=test bin/rails db:prepare` e depois `git diff db/schema.rb`.
