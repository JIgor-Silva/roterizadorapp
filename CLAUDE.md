# RoterizadorApp — Contexto Principal

Sistema de **gestão de entregas com roteirização**: administradores de loja criam pedidos,
o backend geocodifica o endereço do cliente e calcula a rota loja → cliente; entregadores
veem seus pedidos e a rota no mapa.

Monorepo com dois projetos independentes (cada um com suas dependências):

| Pasta        | Stack                                                                 |
|--------------|-----------------------------------------------------------------------|
| `backend/`   | Ruby 3.3.6 · Rails 8.0.2 (API-only) · PostgreSQL · Devise-JWT · Pundit · ActiveModelSerializers · Rswag · Solid Queue/Cache/Cable |
| `front-app/` | Expo 53 · React Native 0.79 · React 19 · TypeScript strict · NativeWind 4 (Tailwind 3) · React Navigation 7 · axios · react-native-maps |

Idioma do projeto: **português (pt-BR)** em mensagens de erro da API, textos de UI, comentários e commits.

---

## Comandos essenciais

Sempre rode a partir da pasta do subprojeto.

### Backend (`cd backend`)
```bash
bundle exec rspec                        # todos os testes
bundle exec rspec spec/integration/api/v1/orders_spec.rb   # um arquivo
bundle exec rubocop                      # lint (rubocop-rails-omakase)
bundle exec rubocop -a <arquivo>         # autocorreção segura em 1 arquivo
bundle exec brakeman --no-pager          # scanner de segurança
bin/rails routes -g orders               # rotas filtradas
bin/rails db:migrate:status              # migrações pendentes
bin/rails db:migrate                     # aplica migrações (dev)
RAILS_ENV=test bin/rails db:prepare      # prepara banco de teste
bundle exec rake rswag:specs:swaggerize  # regenera swagger/v1/swagger.yaml
bin/rails s                              # servidor em http://localhost:3000 (Swagger em /api-docs)
```

### Frontend (`cd front-app`)
```bash
npx tsc --noEmit        # type-check (~3s) — principal verificação do front
npm start               # Expo dev server
npm run web             # versão web
npm run find-dead-code  # ts-prune
```

Atalhos prontos: veja `.claude/commands/` (`/check`, `/test-back`, `/typecheck`, `/db-status`, etc.).

---

## Ambiente local (já verificado nesta máquina)

- Ruby via **rbenv** (3.3.6), Node via **fnm** (v22). Docker **não** está instalado.
- PostgreSQL local na **porta 5433** (`config/database.yml`: user `postgres`, bancos `backend_development` / `backend_test`).
- Front lê a URL da API de `EXPO_PUBLIC_API_URL` (fallback `http://localhost:3000/api/v1`). Em celular físico use o IP da máquina.
- Credenciais em `config/credentials.yml.enc` (chave em `config/master.key`, **nunca ler/commitar**):
  `devise.jwt_secret_key`, `open_route_service.api_key`, `weather_map.api_key`, `google_geocoding_api_key`.
- **Chaves de integração via `.env`** (gem `dotenv-rails`, só dev/test): `cp backend/.env.example backend/.env` e preencha
  `ORS_API_KEY` e `WEATHER_API_KEY`. O `.env` é ignorado pelo git; se a variável estiver vazia, o serviço usa a credential.

---

## Domínio e regras de negócio

**Modelos** (`backend/app/models`):
- `Store` — loja (name, address, lat/lng; geocodifica via Geocoder se lat/lng vazios).
- `User` — Devise + JWT. `role` enum: `delivery_person: 0` (padrão), `admin: 1`. Entregador **exige** `store_id`.
- `Client` — cliente final (name, address, phone, lat/lng; geocodifica automaticamente).
- `Order` — pertence a client, store e (opcional) `delivery_person` (User). `status` enum:
  `pending: 0 → in_route: 1 → delivered: 2` ou `canceled: 3`. Campos `total`, `is_late`, `delivery_address`.
  `after_create` enfileira `CalculateRouteJob`.
- `Route` — 1:1 com Order; origem (loja) / destino (cliente), `travel_mode` (driving/walking/bicycling/transit),
  `distance` (metros), `duration` (segundos), `polyline` (string JSON de `[[lng, lat], ...]`).
- `RoutePoint` — pontos ordenados da rota (`order` = índice).
- `JwtDenylist` — revogação de tokens no logout.

**Autorização** (Pundit, `app/policies/order_policy.rb`):
- Admin: vê e gerencia todos os pedidos; pode alterar `status` **e** `delivery_person_id`.
- Entregador: escopo = pedidos onde `delivery_person_id == user.id` **e** mesma loja; só altera `status`.
- `pundit_user` é `current_api_v1_user` (Devise com namespace `api/v1`).

**Fluxo principal**
1. `POST /api/v1/users/sign_in` → JWT no header `Authorization` e em `token` no corpo (expira em 1 dia).
2. Admin `POST /api/v1/orders` com `client_name`, `client_address`, `travel_mode` → cria/acha Client, cria Order,
   cria Route (sem polyline) e marca pedido `in_route`.
3. `GET /api/v1/orders/:id/route_details` → se a rota não tem polyline, chama OpenRouteService, salva
   distance/duration/polyline e recria RoutePoints.
4. Front: `DashboardScreen` lista pedidos (admin → `/orders`; entregador → `/orders/delivery_person/:id`),
   `MapScreen` desenha a rota.

## Integrações externas

| Serviço         | Onde                                         | Observações |
|-----------------|----------------------------------------------|-------------|
| OpenRouteService | `app/services/route_calculation_service.rb` | perfil `driving-hgv`; **ORS usa `[lng, lat]`**, o app usa `[lat, lng]` internamente — sempre `.reverse` na fronteira. Retorna `{distance, duration, geometry}` ou `{error:}` (nunca levanta exceção). |
| WeatherAPI      | `app/services/weather_service.rb`            | current + forecast, `lang=pt`. |
| Geocoder (Nominatim) | `config/initializers/geocoder.rb`, models | `geocoded_by :address` em Store/Client. Nominatim tem rate limit (1 req/s). |
| Devise-JWT      | `config/initializers/warden_jwt.rb`          | dispatch no sign_in, revogação no sign_out. |

Nos testes, `spec/support/route_calculation_service_mock.rb` **stuba globalmente** `RouteCalculationService`
(`calculate_route` e `geocode_address`). Nunca faça chamadas HTTP reais em specs.

---

## Problemas conhecidos (backlog de melhorias)

Verificados em 2026-11-23. Ao corrigir um item, remova-o desta lista.

**Bloqueadores**
1. Specs rswag de `orders_spec.rb`, `sessions_spec.rb` e `registrations_spec.rb` são esqueletos: não definem
   `let(:Authorization)`, `let(:id)` nem o corpo da requisição → 14 falhas. Modelo pronto: `stores_spec.rb`.
3. `config/routes.rb` declara `namespace :admin { resources :users }`, mas **não existe** `Api::V1::Admin::UsersController`.

**Segurança**
6. CORS `origins '*'` (`config/initializers/cors.rb`).
7. `RegistrationsController` aberto: `user_params` não aceita `store_id`/`role`, então cadastro de entregador
   sempre falha na validação; `sign_up_params` não é usado.
8. Front loga resposta de login (com token) no console (`AuthContext.tsx`).

**Correção / consistência**
9. `OrderPolicy` tem `route_details?` e `calculate_route?` duplicados; `update?` deixa qualquer usuário da loja alterar qualquer pedido.
10. `Order#after_create` enfileira `CalculateRouteJob` que concorre com a rota criada no controller; o job
    salva `polyline` como `to_json`, `route_details` salva array cru → formatos inconsistentes.
11. `orders#create` geocodifica 2x o mesmo endereço e, se achar rota existente para o endereço, **não cria o pedido**.
12. `delivery_person_orders` responde 401 onde deveria ser 403.
13. `AppConfig.use_route_service_mock` existe mas não é usado.
14. `spec/services/route_calculation_service_spec.rb` testa o próprio stub (não testa nada real).
15. CI (`backend/.github/workflows`) chama `bin/rubocop` e `bin/brakeman`, que não existem em `bin/`;
    os workflows estão dentro de `backend/` e não na raiz (GitHub não os executa).

**Frontend**
16. `npx tsc --noEmit` tem 7 erros (theme sem `popoverForeground`, `Client.phone`, `estimatedDelivery`,
    imports de `./components` e `../components/toaster` inexistentes).
17. `src/services/weatherService.ts` tem IP fixo e usa axios cru (sem token) — deve usar `src/app/api/api.ts`.
18. Tipos duplicados/desalinhados: `RootStackParamList` em `navigation/navigation.ts` e `types/index.ts`;
    `Order` do front (`customerName`, `address`) ≠ serializer (`customer_name`, `delivery_address`).
19. `AuthContext` lê `error.response.data.error`, mas o backend devolve `message` no 401.
20. Sem testes, ESLint ou Prettier no front.

---

## Como trabalhar neste repo

- Leia as regras em `.claude/rules/` (carregadas por caminho) e use as skills em `.claude/skills/` para tarefas recorrentes.
- **Mudanças pequenas e verificáveis.** Depois de editar: backend → `bundle exec rspec <spec relevante>` + rubocop no arquivo;
  front → `npx tsc --noEmit`. Não diga que algo funciona sem ter rodado a verificação.
- Mudou um serializer? Atualize `front-app/src/app/types/index.ts` e o spec rswag correspondente (contrato da API).
- Nunca edite migrações já versionadas, `db/schema.rb` à mão, `config/master.key` ou `credentials.yml.enc`.
- `db/seeds.rb` **apaga todos os dados** (`destroy_all`) — só rode com pedido explícito.
- Commits: Conventional Commits em pt-BR (`feat:`, `fix:`, `refactor:`, `test:`, `chore:`, `docs:`). Não faça push sem pedir.
