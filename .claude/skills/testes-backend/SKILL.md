---
name: testes-backend
description: Escrever ou consertar testes RSpec do backend (request specs rswag, models, policies, services, jobs) com dados criados à mão, JWT de teste e stubs de APIs externas. Use ao adicionar cobertura, reproduzir um bug com teste ou quando a suíte falhar.
---

# Testes do backend (RSpec)

## Rodar
```bash
cd backend
bundle exec rspec                                   # tudo
bundle exec rspec spec/integration/api/v1/orders_spec.rb:42   # um exemplo
bundle exec rspec --only-failures                   # só os que falharam (requer example_status_persistence)
```
Se abortar com *pending migrations*: `bin/rails db:migrate && RAILS_ENV=test bin/rails db:prepare`.

## Dados (sem FactoryBot)
```ruby
let!(:store)    { Store.create!(name: "Loja 1", address: "Rua A, Fortaleza", latitude: -3.75, longitude: -38.48) }
let!(:admin)    { User.create!(email: "admin@ex.com", password: "password", role: :admin, store: store) }
let!(:courier)  { User.create!(email: "ent@ex.com", password: "password", role: :delivery_person, store: store) }
let!(:client)   { Client.create!(name: "Cliente", address: "Rua B", latitude: -3.74, longitude: -38.50) }
let!(:order)    { Order.create!(client: client, store: store, delivery_address: "Rua B", delivery_person: courier) }
```
Sempre passe `latitude/longitude` para não disparar geocodificação. `Order.create!` enfileira `CalculateRouteJob`
(o serviço de rota está stubado; para testar o job use `include ActiveJob::TestHelper` + `perform_enqueued_jobs`).

## Autenticação
```ruby
def auth_header(user)
  token, _payload = Warden::JWTAuth::UserEncoder.new.call(user, :api_v1_user, nil)
  "Bearer #{token}"
end
let(:Authorization) { auth_header(admin) }   # rswag
# request spec puro: get "/api/v1/orders", headers: { "Authorization" => auth_header(admin) }
```

## APIs externas
- `RouteCalculationService` já é stubado globalmente (`spec/support/route_calculation_service_mock.rb`).
  Para testar o **serviço real**, desfaça o stub no spec e use `stub_request`-like com `allow(HTTParty).to receive(:post).and_return(double(success?: true, body: {...}.to_json))`.
- WeatherService: `allow(Faraday).to receive(:get).and_return(double(body: {...}.to_json))`.

## Matriz mínima por endpoint
| Caso | Esperado |
|------|----------|
| admin, dados válidos | 200/201 + formato do serializer |
| sem token | 401 |
| entregador acessando o que não é dele | 403 (ou 404 via scope) |
| id inexistente | 404 |
| params inválidos | 400/422 com `{ error: ... }` |

## Policy spec (exemplo)
```ruby
RSpec.describe OrderPolicy do
  subject { described_class.new(user, order) }
  context "entregador de outra loja" do
    let(:user) { other_store_courier }
    it { expect(subject.show?).to be(false) }
  end
end
```
Bug encontrado? Escreva primeiro o teste que falha, depois corrija.
