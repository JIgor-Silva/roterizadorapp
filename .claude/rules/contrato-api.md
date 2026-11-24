---
paths:
  - "backend/app/serializers/**/*.rb"
  - "backend/config/routes.rb"
  - "backend/spec/integration/**/*.rb"
  - "front-app/src/app/types/**/*.ts"
  - "front-app/src/app/api/**/*.ts"
---

# Contrato da API (backend ↔ front)

O JSON gerado pelos serializers em `backend/app/serializers/api/v1/` **é o contrato**. Qualquer mudança aqui
precisa ser refletida nos três lugares, no mesmo commit:

1. Serializer (`Api::V1::*Serializer`) — chaves em **snake_case**.
2. Tipo TS em `front-app/src/app/types/index.ts` — mesmas chaves snake_case (não converta para camelCase).
3. Spec rswag em `backend/spec/integration/api/v1/` — `schema` da resposta.

Formato atual de `Order` (OrderSerializer):
```
id, status ('pending'|'in_route'|'delivered'|'canceled'), delivery_address, created_at, updated_at,
total (number), coordinates {latitude, longitude}, customer_name, customer_phone,
estimated_delivery ("HH:MM" | "N/A"), is_late, distance (metros | null),
client {id,name,address}, store {id,name,address}, delivery_person {id,email} | null, route {...} | null
```
`Route`: `id, origin_latitude, origin_longitude, destination_latitude, destination_longitude, travel_mode,
distance (m), duration (s), polyline [[lng, lat], ...], route_points [{id, latitude, longitude, order}]`.

Atenção: `polyline` vem como `[longitude, latitude]` (GeoJSON). O react-native-maps espera `{ latitude, longitude }` — converta no front.

Endpoints (prefixo `/api/v1`): `POST users/sign_in`, `DELETE users/sign_out`, `POST users` (cadastro),
`GET/PATCH stores/:id`, `GET/POST orders`, `GET/PATCH orders/:id`, `POST orders/:id/calculate_route`,
`GET orders/:id/route_details`, `GET orders/delivery_person/:id`, `GET weather?latitude=&longitude=`.
Confira sempre com `bin/rails routes -g api`.
