---
paths:
  - "backend/spec/**/*.rb"
---

# Testes do backend (RSpec + Rswag)

- Specs de API ficam em `spec/integration/api/v1/*_spec.rb` no formato **rswag** (`path`/`get`/`response`/`run_test!`).
  Eles também geram `swagger/v1/swagger.yaml` (`bundle exec rake rswag:specs:swaggerize`).
- Specs de service: `spec/services/`. Models: `spec/models/`. Policies: `spec/policies/` (crie se precisar).
- **Sem HTTP real.** `spec/support/route_calculation_service_mock.rb` stuba `RouteCalculationService.calculate_route`
  e `.geocode_address` para todos os testes. Para Geocoder use `Geocoder::Lookup::Test` / `Geocoder.configure(lookup: :test)`;
  para WeatherService use `allow(WeatherService).to receive(:get_weather)`.
- Não há FactoryBot nem fixtures: crie dados com `Model.create!` em `let`/`let!` (passe `latitude`/`longitude` para evitar geocodificação).
- Autenticação em request spec:
  ```ruby
  let(:store) { Store.create!(name: "Loja", address: "Rua A", latitude: -3.75, longitude: -38.48) }
  let(:admin) { User.create!(email: "admin@ex.com", password: "password", role: :admin, store: store) }
  let(:Authorization) { "Bearer #{Warden::JWTAuth::UserEncoder.new.call(admin, :api_v1_user, nil).first}" }
  ```
- Cubra sempre: caminho feliz, 401 sem token, 403 com papel errado, 404/422 quando aplicável.
- Rode só o arquivo afetado (`bundle exec rspec spec/...`) durante o trabalho e a suíte inteira no final.
- Se `rspec` abortar com "pending migrations": `bin/rails db:migrate && bin/rails db:schema:dump && RAILS_ENV=test bin/rails db:prepare`.
