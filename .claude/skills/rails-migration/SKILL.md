---
name: rails-migration
description: Alterar o schema do banco PostgreSQL do backend com migração Rails segura (nova coluna, tabela, índice, enum) e sincronizar schema.rb, banco de teste e model. Use quando a tarefa precisar mudar tabelas, ou quando rspec reclamar de migrações pendentes.
---

# Migração de banco (backend)

## 0. Estado atual
```bash
cd backend
pg_isready -h localhost -p 5433        # banco no ar?
bin/rails db:migrate:status | tail -20 # "down" = pendente
```
Se houver pendentes antigas (backlog item 1 do CLAUDE.md), aplique-as primeiro: `bin/rails db:migrate`.

## 1. Gerar
```bash
bin/rails g migration AddPriorityToOrders priority:integer
bin/rails g migration CreateDeliveryZones name:string store:references
```
Edite apenas o arquivo **recém-criado**. Migrações já commitadas são imutáveis (hook bloqueia).

## 2. Boas práticas no arquivo
- `change` reversível; `null: false` + `default:` em colunas novas obrigatórias.
- Índices para colunas de filtro: `add_index :orders, :status`.
- Dinheiro: `:decimal, precision: 10, scale: 2`. Coordenadas: `:float`.
- Enum inteiro → no model `enum :campo, { a: 0, b: 1 }` (nunca renumerar).

## 3. Aplicar e sincronizar
```bash
bin/rails db:migrate                    # atualiza db/schema.rb
RAILS_ENV=test bin/rails db:prepare     # banco de teste
git diff db/schema.rb                   # confira só o esperado
```
Rollback de teste (opcional, peça confirmação): `bin/rails db:rollback && bin/rails db:migrate`.

## 4. Propagar
- Model: validações/enum/associações.
- Serializer + `front-app/src/app/types/index.ts` se o campo for exposto (skill `feature-fullstack`).
- Seeds (`db/seeds.rb`) se o campo for obrigatório.

## 5. Verificar
`bundle exec rspec` (suíte inteira — mudança de schema afeta tudo). Commite migração + `schema.rb` juntos.
