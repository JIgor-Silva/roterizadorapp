---
paths:
  - "backend/app/controllers/**/*.rb"
  - "backend/app/policies/**/*.rb"
  - "backend/config/initializers/**/*.rb"
  - "backend/config/routes.rb"
---

# Autenticação, autorização e segurança

## Papéis
| Papel | `role` | Pode |
|-------|--------|------|
| Admin | `admin` (1) | tudo da loja/sistema; atribuir entregador; criar pedido; calcular rota |
| Entregador | `delivery_person` (0, padrão) | ver/atualizar `status` dos **próprios** pedidos da **própria** loja |

## Regras
- Toda ação nova precisa de um método correspondente na policy (`<acao>?`). Se a policy não existir, crie
  `app/policies/<model>_policy.rb` herdando de `ApplicationPolicy` (que nega tudo por padrão) + `Scope#resolve`.
- Escopo de entregador sempre filtra por `delivery_person_id: user.id` **e** `store_id: user.store_id`.
- 401 = não autenticado (Devise cuida). 403 = autenticado sem permissão (use `authorize` → Pundit → 403).
- Não duplique métodos na policy (Ruby usa o último silenciosamente — já aconteceu em `OrderPolicy`).
- JWT: emitido apenas em `POST /api/v1/users/sign_in`, revogado em `DELETE /api/v1/users/sign_out`
  (`config/initializers/warden_jwt.rb`). Ao adicionar rota de auth, atualize `dispatch_requests`/`revocation_requests`.
- Registro público não pode permitir escolher `role: admin`. Criação de entregadores deve ser feita por admin.
- CORS: hoje `origins '*'`. Ao mexer, restrinja por ambiente (env var) sem quebrar o Expo web (`http://localhost:8081`).
- Rode `bundle exec brakeman --no-pager` após mudanças em controllers/params.
