---
name: feature-fullstack
description: Implementar uma funcionalidade que atravessa backend Rails e app React Native (ex.: novo campo no pedido, nova ação do entregador, tela admin de usuários), mantendo o contrato JSON sincronizado entre serializer, tipos TS e spec rswag. Use quando a mudança precisa aparecer no app e na API.
---

# Feature ponta a ponta (backend → front)

Trabalhe **de trás para frente**: banco → model → policy → controller → serializer → spec → tipos TS → API call → UI.

## Checklist
1. **Planejar** em 3–6 passos e confirmar com o usuário se houver decisão de produto (quem pode fazer o quê).
2. **Banco** (se precisar): skill `rails-migration`.
3. **Backend**: skill `rails-endpoint` (rota, controller, policy, serializer).
4. **Teste backend**: skill `testes-backend`. Rode o spec — precisa passar antes de ir para o front.
5. **Contrato**: copie o JSON real de resposta (do spec ou `curl`) e atualize `front-app/src/app/types/index.ts`
   com as **mesmas chaves snake_case**. Veja `.claude/rules/contrato-api.md`.
6. **Front**: chamada via `api` (`src/app/api/api.ts`) + UI com skill `rn-tela-componente`.
   Respeite o papel: `user.role === 'admin'` para ações administrativas.
7. **Verificar tudo**: `/check` (rspec + rubocop + tsc).
8. **Documentar**: endpoint novo → `bundle exec rake rswag:specs:swaggerize`; problema do backlog resolvido → remova do `CLAUDE.md`.

## Testar manualmente a API (opcional, servidor rodando)
```bash
TOKEN=$(curl -s -X POST localhost:3000/api/v1/users/sign_in -H 'Content-Type: application/json' \
  -d '{"user":{"email":"admin.loja1@example.com","password":"password"}}' | jq -r .token)
curl -s localhost:3000/api/v1/orders -H "Authorization: Bearer $TOKEN" | jq '.[0]'
```
(Usuários de `db/seeds.rb`; senha de seed `password`.)

## Commits sugeridos
`feat(backend): ...` e `feat(front): ...` separados, ou um só se forem inseparáveis.
