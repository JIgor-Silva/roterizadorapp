---
paths:
  - "backend/app/**/*.rb"
  - "backend/config/**/*.rb"
  - "backend/lib/**/*"
---

# Backend Rails — convenções

## Estrutura
- API versionada: tudo novo vai em `app/controllers/api/v1/` e herda de **`Api::V1::ApplicationController`**
  (que já faz `authenticate_api_v1_user!`, inclui Pundit e trata `Pundit::NotAuthorizedError` → 403).
  ⚠️ Não herde de `::ApplicationController` (é o erro do `WeatherController`: fica sem autenticação).
- Declaração de classe: siga o padrão do arquivo (`class Api::V1::XController < Api::V1::ApplicationController`).
- Usuário atual: **`current_api_v1_user`** (Devise com namespace). Não existe `current_user`.
- Lógica de negócio/integração fora do controller: `app/services/*_service.rb` (métodos de classe, retornam Hash).
- Trabalho lento/externo: `app/jobs/` com `perform_later` (dev usa adapter `:async`, prod Solid Queue).

## Controllers
- Sempre `authorize` (Pundit) em ações que leem/alteram um registro; listas usam `policy_scope` / `pundit_policy_scope`.
- Strong params explícitos (`params.require(:x).permit(...)`); campos sensíveis (`role`, `store_id`, `delivery_person_id`)
  só para admin — use a policy para decidir (veja `order_update_params`).
- Respostas JSON:
  - sucesso → serializer: `render json: obj, serializer: Api::V1::XSerializer` (coleção: `each_serializer:`);
  - erro → `{ error: "mensagem em pt-BR" }` com status correto
    (`:bad_request` 400, `:unauthorized` 401 = não logado, `:forbidden` 403 = sem permissão, `:not_found` 404, `:unprocessable_entity` 422).
- `before_action :set_x` com `rescue ActiveRecord::RecordNotFound` → 404 (padrão existente).
- Transações com `ActiveRecord::Base.transaction` + métodos `!` quando criar vários registros relacionados.

## Models
- Enums com sintaxe Rails 8: `enum :status, { pending: 0, ... }`. **Nunca reordene/renumere** valores existentes
  (estão persistidos como inteiro). Novos valores no final.
- Validações no model; regras de permissão na policy, não no model.
- Coordenadas: internamente `[latitude, longitude]`; APIs GeoJSON/ORS usam `[longitude, latitude]`.

## Serviços externos
- Nunca levantar exceção para o controller: capture erros de rede/JSON e retorne `{ error: "..." }` + `Rails.logger.error`.
- Sempre definir `timeout`. Usar HTTPS. Chave via `Rails.application.credentials.dig(:servico, :api_key)`.
- Ao mudar o contrato do serviço, atualize o stub global em `spec/support/route_calculation_service_mock.rb`.

## Estilo
- RuboCop `rubocop-rails-omakase` (aspas duplas, espaços dentro de `[ ]`). O hook pós-edição roda `rubocop -a` no arquivo.
- `# frozen_string_literal: true` no topo de arquivos novos.
