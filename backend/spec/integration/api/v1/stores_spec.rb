require 'swagger_helper'

describe 'Stores API V1', type: :request do
  path '/api/v1/stores/{id}' do
    parameter name: :id, in: :path, type: :integer, description: 'ID da Loja'

    get 'Busca detalhes de uma loja' do
      tags 'Stores'
      produces 'application/json'
      security [ Bearer: [] ]

      response '200', 'loja encontrada' do
        schema type: :object,
               properties: {
                 id: { type: :integer },
                 name: { type: :string },
                 address: { type: :string }
               },
               required: [ 'id', 'name', 'address' ]

        # let(:store_record) { Store.create!(name: "Loja Exemplo", address: "Rua Exemplo, 123") }
        # let(:id) { store_record.id }
        # let(:user) { User.create!(email: 'admin@example.com', password: 'password', role: :admin, store: store_record) } # Usuário admin para acesso
        # let(:Authorization) { "Bearer #{JWT.encode({ sub: user.id, scp: 'user', aud: nil, iat: Time.now.to_i, exp: (Time.now + 1.hour).to_i, jti: SecureRandom.uuid }, Rails.application.credentials.devise_jwt_secret_key!, 'HS256')}" }
        run_test!
      end

      response '401', 'não autorizado' do
        schema type: :object,
               properties: {
                 error: { type: :string, example: 'You need to sign in or sign up before continuing.' }
               }
        run_test!
      end

      response '404', 'loja não encontrada' do
        run_test!
      end
    end

    patch 'Atualiza uma loja' do
      tags 'Stores'
      consumes 'application/json'
      produces 'application/json'
      security [ Bearer: [] ] # Assumindo que apenas usuários autorizados (ex: admin) podem atualizar

      parameter name: :store, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string, description: 'Novo nome da loja', nullable: true },
          address: { type: :string, description: 'Novo endereço da loja', nullable: true }
        }
      }

      response '200', 'loja atualizada' do
        schema type: :object,
               properties: {
                 id: { type: :integer },
                 name: { type: :string },
                 address: { type: :string }
               },
               required: [ 'id', 'name', 'address' ]
        run_test!
      end

      response '401', 'não autorizado' do
        schema type: :object,
               properties: {
                 error: { type: :string, example: 'You need to sign in or sign up before continuing.' }
               }
        run_test!
      end

      response '404', 'loja não encontrada' do
        run_test!
      end

      response '422', 'entidade não processável (erro de validação)' do
        run_test!
      end
    end
  end
end
