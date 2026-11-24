---
name: rails-endpoint
description: Criar ou alterar um endpoint da API Rails (api/v1) do RoterizadorApp — rota, controller, policy Pundit, serializer e spec rswag. Use quando a tarefa envolver novo endpoint, nova ação em controller, mudança de resposta JSON ou permissão de acesso no backend.
---

# Criar/alterar endpoint da API (backend)

Siga na ordem. Cada passo tem uma verificação.

## 1. Mapear o que já existe
```bash
cd backend
bin/rails routes -g <recurso>            # rotas atuais
ls app/controllers/api/v1 app/policies app/serializers/api/v1
```
Leia o controller, a policy e o serializer do recurso **inteiros** antes de mudar.

## 2. Rota — `config/routes.rb`
Dentro de `namespace :api { namespace :v1 { ... } }`. Prefira `resources` com `only:`; ações extras em `member`/`collection`.
Verifique: `bin/rails routes -g <recurso>`.

## 3. Controller — `app/controllers/api/v1/<recurso>_controller.rb`
Modelo mínimo:
```ruby
# frozen_string_literal: true
class Api::V1::ThingsController < Api::V1::ApplicationController
  before_action :set_thing, only: %i[show update]

  def index
    things = policy_scope(Thing).order(created_at: :desc)
    render json: things, each_serializer: Api::V1::ThingSerializer
  end

  def show
    authorize @thing
    render json: @thing, serializer: Api::V1::ThingSerializer
  end

  def update
    authorize @thing
    if @thing.update(thing_params)
      render json: @thing, serializer: Api::V1::ThingSerializer
    else
      render json: { error: @thing.errors.full_messages.join(", ") }, status: :unprocessable_entity
    end
  end

  private

  def set_thing
    @thing = Thing.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Registro não encontrado." }, status: :not_found
  end

  def thing_params
    params.require(:thing).permit(:name)
  end
end
```
- Herda de `Api::V1::ApplicationController` (autentica + trata 403). Usuário: `current_api_v1_user`.
- Namespace admin (`/api/v1/admin/...`): arquivo em `app/controllers/api/v1/admin/`, classe `Api::V1::Admin::XController`, e `authorize` com policy que exige `user.admin?`.

## 4. Policy — `app/policies/<model>_policy.rb`
Um método `<acao>?` por ação, sem duplicar. `Scope#resolve` filtra por papel (admin → tudo; entregador → só o dele e da loja).

## 5. Serializer — `app/serializers/api/v1/<model>_serializer.rb`
Chaves snake_case. Mudou o JSON? → aplique a skill `feature-fullstack` (atualizar `front-app/src/app/types/index.ts`).

## 6. Spec rswag — `spec/integration/api/v1/<recurso>_spec.rb`
Cubra 200/201, 401 (sem token), 403 (papel errado), 404/422. Token: veja `.claude/rules/backend-testes.md`.

## 7. Verificar
```bash
bundle exec rspec spec/integration/api/v1/<recurso>_spec.rb
bundle exec rubocop app/controllers/api/v1 app/policies app/serializers
bundle exec brakeman --no-pager -q
bundle exec rake rswag:specs:swaggerize   # atualiza a doc em /api-docs
```
Só declare pronto com os testes passando (ou explique por que não puderam rodar).
