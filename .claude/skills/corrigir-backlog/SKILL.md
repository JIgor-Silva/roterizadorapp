---
name: corrigir-backlog
description: Escolher e corrigir com segurança um item da lista "Problemas conhecidos" do CLAUDE.md (bugs, falhas de segurança, débito técnico) usando teste que reproduz o problema, correção mínima e verificação. Use quando o usuário pedir para melhorar o projeto, corrigir bugs conhecidos ou "o que dá pra arrumar".
---

# Corrigir item do backlog

## Ordem recomendada
1. **#1 schema/migrações** — destrava os testes (pré-requisito de tudo).
2. **#2 `geocode_address` inexistente** — criação de pedido quebrada em produção.
3. **#4/#5 segurança** (Weather sem auth, Store sem policy) e **#7** cadastro.
4. **#3 Admin::UsersController** — feature faltante (use `feature-fullstack` se for ter tela).
5. **#9–#12** consistência do backend. 6. **#16–#19** front (tsc zerado, tipos, weatherService).

## Fluxo por item
1. Releia o item no `CLAUDE.md` e confirme no código (`grep`/leitura) que ainda é verdade.
2. **Reproduza** com um teste que falha (skill `testes-backend`) — para o front, um erro de `tsc` ou passo manual descrito.
3. Correção **mínima** que resolve a causa, sem refatorar o entorno.
4. Verifique: spec do item + `bundle exec rspec` completo (ou `npx tsc --noEmit`) + rubocop nos arquivos tocados.
5. Remova o item do `CLAUDE.md` e renumere se quiser.
6. Commit: `fix(backend): <resumo>` / `fix(front): ...` com o número do item no corpo.

## Exemplos de correção esperada
- **#4 Weather sem auth**: `class Api::V1::WeatherController < Api::V1::ApplicationController`, HTTPS no serviço,
  `rescue` de rede → `{ error: }` com status 502, spec com 401 sem token.
- **#5 Store sem policy**: criar `StorePolicy` (`show?` → mesma loja ou admin; `update?` → admin da loja),
  `authorize @store` no controller, specs 403.
- **#9 OrderPolicy**: remover duplicatas; `update?` → admin ou `record.delivery_person_id == user.id`.
- **#17 weatherService.ts**: usar `api.get('/weather', { params })` do `src/app/api/api.ts`.

Se o item exigir decisão de produto (ex.: quem pode se cadastrar), pergunte ao usuário antes de implementar.
