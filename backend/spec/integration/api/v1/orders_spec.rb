require 'swagger_helper'

describe 'Orders API V1', type: :request do
  path '/api/v1/orders' do # O path é relativo ao server URL definido no swagger_helper.rb
    get 'Lista todos os pedidos' do
      tags 'Orders' # Agrupa endpoints na UI do Swagger
      produces 'application/json'
      security [Bearer: []] # Indica que este endpoint requer autenticação JWT

      response '200', 'pedidos encontrados' do
        # Descreva o schema da resposta
        schema type: :array,
               items: {
                 type: :object,
                 properties: {
                   id: { type: :integer },
                   status: { type: :string, enum: ['pending', 'in_route', 'delivered', 'cancelled'] },
                   delivery_address: { type: :string },
                   created_at: { type: :string, format: 'date-time' },
                   updated_at: { type: :string, format: 'date-time' },
                   client: { # Exemplo de objeto aninhado
                     type: :object,
                     properties: {
                       id: { type: :integer },
                       name: { type: :string },
                       address: { type: :string }
                     }
                   },
                   store: { # Exemplo de objeto aninhado
                     type: :object,
                     properties: {
                       id: { type: :integer },
                       name: { type: :string },
                       address: { type: :string }
                     }
                   }
                   # Adicione delivery_person e route se necessário
                 },
                 required: [ 'id', 'status', 'delivery_address', 'client', 'store' ]
               }

        # Exemplo de como executar um teste real para popular o exemplo na UI
        # let(:user) { User.create!(email: 'test@example.com', password: 'password', role: :admin, store: Store.first_or_create(name: "Admin Store", address: "Admin Address")) }
        # let(:Authorization) { "Bearer #{JWT.encode({ sub: user.id, scp: 'user', aud: nil, iat: Time.now.to_i, exp: (Time.now + 1.hour).to_i, jti: SecureRandom.uuid }, Rails.application.credentials.devise_jwt_secret_key!, 'HS256')}" }
        # run_test! do |response|
        #   data = JSON.parse(response.body)
        #   # Faça asserções sobre os dados se desejar
        # end
        run_test! # Sem um bloco, apenas verifica o código de status
      end

      response '401', 'não autorizado' do
        schema type: :object,
               properties: {
                 error: { type: :string, example: 'You need to sign in or sign up before continuing.' }
               }
        run_test!
      end
    end

    post 'Cria um novo pedido' do
      tags 'Orders'
      consumes 'application/json'
      produces 'application/json'
      security [Bearer: []]

      parameter name: :order, in: :body, schema: {
        type: :object,
        properties: {
          client_id: { type: :integer, description: 'ID do cliente' },
          store_id: { type: :integer, description: 'ID da loja' },
          delivery_address: { type: :string, description: 'Endereço de entrega' },
        },
        required: ['client_id', 'store_id', 'delivery_address']
      }

      response '201', 'pedido criado' do
        schema type: :object,
               properties: {
                 id: { type: :integer },
                 status: { type: :string, enum: ['pending', 'in_route', 'delivered', 'cancelled'] },
                 delivery_address: { type: :string },
                 created_at: { type: :string, format: 'date-time' },
                 updated_at: { type: :string, format: 'date-time' },
                 client: {
                   type: :object,
                   properties: {
                     id: { type: :integer },
                     name: { type: :string },
                     address: { type: :string }
                   }
                 },
                 store: {
                   type: :object,
                   properties: {
                     id: { type: :integer },
                     name: { type: :string },
                     address: { type: :string }
                   }
                 }
               },
               required: [ 'id', 'status', 'delivery_address', 'client', 'store' ]
        # let(:user) { User.create!(email: 'admin@example.com', password: 'password', role: :admin, store: Store.first_or_create(name: "Admin Store", address: "Admin Address")) }
        # let(:Authorization) { "Bearer #{JWT.encode({ sub: user.id, scp: 'user', aud: nil, iat: Time.now.to_i, exp: (Time.now + 1.hour).to_i, jti: SecureRandom.uuid }, Rails.application.credentials.devise_jwt_secret_key!, 'HS256')}" }
        # let(:client) { Client.create!(name: "Test Client", address: "123 Main St") }
        # let(:store) { Store.create!(name: "Test Store", address: "456 Market St") }
        # let(:order) { { client_id: client.id, store_id: store.id, delivery_address: "789 Pine St" } }
        run_test!
      end

      response '422', 'entidade não processável (erro de validação)' do
        run_test!
      end

      response '401', 'não autorizado' do
        schema type: :object,
               properties: {
                 error: { type: :string, example: 'You need to sign in or sign up before continuing.' }
               }
        run_test!
      end
    end
  end

  # Adicione paths para /orders/{id} (GET, PATCH/PUT, DELETE) e outros endpoints
  # Exemplo para GET /orders/{id}
  path '/api/v1/orders/{id}' do
    get 'Busca um pedido específico' do
      tags 'Orders'
      produces 'application/json'
      security [Bearer: []]
      parameter name: :id, in: :path, type: :integer, description: 'ID do Pedido'

      response '200', 'pedido encontrado' do
        schema type: :object,
               properties: {
                 id: { type: :integer },
                 status: { type: :string, enum: ['pending', 'in_route', 'delivered', 'cancelled'] },
                 delivery_address: { type: :string },
                 created_at: { type: :string, format: 'date-time' },
                 updated_at: { type: :string, format: 'date-time' },
                 client: {
                   type: :object,
                   properties: {
                     id: { type: :integer },
                     name: { type: :string },
                     address: { type: :string }
                   }
                 },
                 store: {
                   type: :object,
                   properties: {
                     id: { type: :integer },
                     name: { type: :string },
                     address: { type: :string }
                   }
                 }
               },
               required: [ 'id', 'status', 'delivery_address', 'client', 'store' ]
        run_test!
      end

      response '404', 'pedido não encontrado' do
        run_test!
      end

      response '401', 'não autorizado' do
        schema type: :object,
               properties: {
                 error: { type: :string, example: 'You need to sign in or sign up before continuing.' }
               }
        run_test!
      end
    end
  end
end
