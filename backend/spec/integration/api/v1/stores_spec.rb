require 'swagger_helper'

describe 'Stores API V1', type: :request do
  path '/api/v1/stores/{id}' do
    parameter name: :id, in: :path, type: :integer, description: 'ID da Loja'

    let(:store_record) { Store.create!(name: "Loja Exemplo", address: "Rua Exemplo, 123", latitude: -3.75, longitude: -38.48) }
    let(:user) { User.create!(email: "admin@example.com", password: "password", role: :admin, store: store_record) }
    let(:id) { store_record.id }
    let(:Authorization) { "Bearer #{Warden::JWTAuth::UserEncoder.new.call(user, :api_v1_user, nil).first}" }

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

        run_test!
      end

      response '401', 'não autorizado' do
        let(:Authorization) { "" }

        schema type: :object,
               properties: {
                 error: { type: :string, example: 'You need to sign in or sign up before continuing.' }
               }
        run_test!
      end

      response '404', 'loja não encontrada' do
        let(:id) { 0 }

        run_test!
      end

      response '403', 'entregador de outra loja' do
        let(:other_store) { Store.create!(name: "Outra Loja", address: "Rua B, 1", latitude: -3.7, longitude: -38.5) }
        let(:user) { User.create!(email: "entregador@example.com", password: "password", role: :delivery_person, store: other_store) }

        run_test!
      end
    end

    patch 'Atualiza uma loja' do
      tags 'Stores'
      consumes 'application/json'
      produces 'application/json'
      security [ Bearer: [] ]

      parameter name: :store, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string, description: 'Novo nome da loja', nullable: true },
          address: { type: :string, description: 'Novo endereço da loja', nullable: true }
        }
      }

      let(:store) { { store: { name: "Loja Atualizada" } } }

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
        let(:Authorization) { "" }

        schema type: :object,
               properties: {
                 error: { type: :string, example: 'You need to sign in or sign up before continuing.' }
               }
        run_test!
      end

      response '404', 'loja não encontrada' do
        let(:id) { 0 }

        run_test!
      end

      response '403', 'entregador não pode atualizar loja' do
        let(:user) { User.create!(email: "entregador2@example.com", password: "password", role: :delivery_person, store: store_record) }

        run_test!
      end

      response '422', 'entidade não processável (erro de validação)' do
        let(:store) { { store: { name: "" } } }

        run_test!
      end
    end
  end
end
