require 'swagger_helper'

describe 'Registrations API V1', type: :request do
  path '/api/v1/users' do
    post 'Registra um novo usuário' do
      tags 'Users'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :user, in: :body, schema: {
        type: :object,
        properties: {
          user: {
            type: :object,
            properties: {
              email: { type: :string, format: :email, description: 'Email do usuário' },
              password: { type: :string, format: :password, description: 'Senha do usuário (mínimo 6 caracteres)' },
              password_confirmation: { type: :string, format: :password, description: 'Confirmação da senha' }
            },
            required: [ 'email', 'password', 'password_confirmation' ]
          }
        },
        required: [ 'user' ]
      }

      response '200', 'usuário criado com sucesso' do
        schema type: :object,
               properties: {
                 id: { type: :integer },
                 email: { type: :string, format: :email }
               },
               required: [ 'id', 'email' ]
        run_test!
      end

      response '422', 'entidade não processável (erro de validação)' do
        schema type: :object,
               properties: {
                 errors: {
                   type: :object,
                   description: 'Detalhes dos erros de validação'
                 }
               }
        run_test!
      end
    end
  end
end
