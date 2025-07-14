# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...
Relacionamentos Principais entre Modelos:

User: Pode ser um admin ou delivery_person. Pertence opcionalmente a uma Store. Um entregador tem muitos Orders (pedidos) atribuídos (orders_as_delivery_person).
Store: Possui muitos Users, Orders e Routes. É geocodificada pelo endereço.
Client: Possui muitos Orders. É geocodificado pelo endereço.
Order: Pertence a um Client e a uma Store. Pode ter um delivery_person (User) atribuído e uma Route. Possui um status (ex: pendente, em rota, entregue).
Route: Pertence a uma Store e opcionalmente a um Order. Contém informações de origem, destino, modo de viagem, distância e múltiplos RoutePoints.
RoutePoint: Representa um ponto geográfico em uma Route, com latitude, longitude e uma ordem sequencial.
Controle de Acesso e Permissões:

A autenticação é obrigatória para todas as rotas da API V1 (Api::V1::ApplicationController). As permissões são gerenciadas pelo Pundit, principalmente através da OrderPolicy.

Administrador (admin):

Pode listar todos os pedidos (OrderPolicy.Scope).
Pode visualizar, criar e atualizar qualquer pedido (OrderPolicy).
Pode atribuir pedidos a entregadores e alterar o status dos pedidos (OrderPolicy.update_status_and_delivery_person?).
Pode calcular/visualizar detalhes de rotas para qualquer pedido (OrderPolicy).
Pode gerenciar lojas (visualizar e atualizar via StoresController, outras ações não explicitamente definidas mas implícitas pela estrutura).
A criação de usuários via Api::V1::RegistrationsController#create atualmente permite apenas email/senha. A atribuição de role e store_id precisaria de um mecanismo de atualização posterior ou ser feita por outros meios (ex: console, seeds), já que sign_up_params não é usado na action create.
Entregador (delivery_person):

Pode listar apenas os pedidos que lhe foram atribuídos (OrderPolicy.Scope).
Pode visualizar detalhes dos seus pedidos (OrderPolicy.show?).
Pode atualizar o status dos seus pedidos (OrderPolicy.update_status?).
Pode calcular/visualizar detalhes de rotas para os seus pedidos (OrderPolicy.calculate_route?, OrderPolicy.route_details?).
Não pode criar pedidos ou atribuir pedidos a outros entregadores.
Precisa estar associado a uma store_id (User model validation).
Criação de Rotas:

Para criar uma rota (geralmente no contexto da criação ou cálculo para um Order):

Informações Necessárias:

Origem: Coordenadas da Store (latitude, longitude).
Destino: Coordenadas do Client (obtidas geocodificando o delivery_address do Order).
Modo de Viagem: (travel_mode, ex: 'driving', 'walking').
Um Order associado.
Uma Store associada.
Processo (via OrdersController#create ou OrdersController#calculate_route):

O delivery_address do cliente é geocodificado para obter latitude/longitude (usando RouteCalculationService.geocode_address).
As coordenadas da loja (Store) são usadas como origem.
O RouteCalculationService.calculate_route é chamado com as coordenadas de origem, destino e modo de viagem. Este serviço, quando não mockado, interage com uma API externa (OpenRouteService) para obter a geometria da rota, distância e duração.
Um registro Route é salvo com os dados da rota e associado ao Order e Store.
Múltiplos RoutePoints (coordenadas da geometria da rota) são salvos e associados à Route.
Responsabilidades dos Controladores (Principais Endpoints da API V1):

Api::V1::RegistrationsController (/api/v1/users)
POST /: Criação (registro) de novos usuários.
Api::V1::SessionsController (/api/v1/users/sign_in, /api/v1/users/sign_out)
POST /sign_in: Login de usuários, retorna token JWT.
DELETE /sign_out: Logout de usuários (revoga o token JWT).
Api::V1::OrdersController (/api/v1/orders)
GET /: Lista pedidos (filtrados pela política de acesso).
POST /: Cria um novo pedido e sua rota inicial.
GET /:id: Mostra detalhes de um pedido específico.
PATCH/PUT /:id: Atualiza um pedido (ex: status, entregador).
GET /:id/route_details: Retorna os detalhes da rota de um pedido.
POST /:id/calculate_route: Calcula (ou recalcula) e salva a rota para um pedido.
Api::V1::StoresController (/api/v1/stores)
GET /:id: Mostra detalhes de uma loja.
PATCH/PUT /:id: Atualiza detalhes de uma loja.
O RouteCalculationService é um serviço auxiliar, não um controlador, responsável pela lógica de geocodificação e cálculo de rotas, interagindo com APIs externas quando não está em modo mock.
