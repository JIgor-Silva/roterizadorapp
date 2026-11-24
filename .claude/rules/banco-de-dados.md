---
paths:
  - "backend/db/**/*"
  - "backend/app/models/**/*.rb"
---

# Banco de dados e migrações

- PostgreSQL local na porta **5433**. Bancos: `backend_development`, `backend_test`.
- Mudança de schema = **nova migração**: `bin/rails g migration AddXToY campo:tipo`. Nunca edite migração já commitada
  nem `db/schema.rb` à mão (os hooks bloqueiam).
- Depois de criar: `bin/rails db:migrate` (atualiza `schema.rb`) e `RAILS_ENV=test bin/rails db:prepare`. Commite migração + `schema.rb` juntos.
- Migrações reversíveis (`change` com operações reversíveis, ou `up`/`down`).
- Colunas de FK: `t.references :x, foreign_key: true` (cria índice). Adicione índice para colunas usadas em `where` (`status`, `delivery_person_id`).
- Coordenadas são `float`; valores monetários (`total`) devem ser `decimal, precision: 10, scale: 2`.
- Enums inteiros: adicione `default:` e `null: false` quando fizer sentido.
- `db/seeds.rb` faz `destroy_all` em tudo — não rode sem o usuário pedir. Usuários de seed usam senha `password`.
