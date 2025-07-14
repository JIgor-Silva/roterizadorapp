require 'swagger_helper'

describe 'Sessions API V1', type: :request do
  path '/api/v1/users/sign_in' do
    post 'Realiza o login de um usuário' do
      tags 'Users'
      consumes 'application/json'
      produces 'application/json'
      description 'Permite que qualquer tipo de usuário registrado (administrador ou entregador) realize o login para obter um token JWT.'
      parameter name: :user, in: :body, schema: {
        type: :object,
        properties: {
          user: {
            type: :object,
            properties: {
              email: { type: :string, format: :email, description: 'Email do usuário' },
              password: { type: :string, format: :password, description: 'Senha do usuário' }
            },
            required: [ 'email', 'password' ]
          }
        },
        required: [ 'user' ]
      }

      response '200', 'login bem-sucedido' do
        schema type: :object,
               properties: {
                 status: { type: :integer, example: 200 },
                 message: { type: :string, example: 'Logged in successfully.' },
                 user: {
                   type: :object,
                   properties: {
                     id: { type: :integer },
                     email: { type: :string, format: :email }
                   },
                   required: ['id', 'email']
                 },
                 token: { type: :string, description: 'Bearer token JWT' }
               },
               required: [ 'status', 'message', 'user', 'token' ]

        # Para popular o exemplo, você precisaria criar um usuário
        # let(:store) { Store.create!(name: "Test Store", address: "123 Main St") }
        # let(:user) { User.create!(email: 'test@example.com', password: 'password', store: store) }
        # let(:credentials) { { user: { email: user.email, password: 'password' } } }
        run_test!
      end

      response '401', 'não autorizado (credenciais inválidas)' do
        schema type: :object,
               properties: {
                 error: { type: :string, example: 'Invalid Email or password.' }
               }
        run_test!
      end
    end
  end

  path '/api/v1/users/sign_out' do
    delete 'Realiza o logout de um usuário' do
      tags 'Users'
      security [ Bearer: [] ] # Requer token JWT para invalidá-lo
      description 'Permite que qualquer usuário autenticado (administrador ou entregador) realize o logout, invalidando o token JWT atual.'

      response '200', 'logout bem-sucedido' do
        # O Devise JWT retorna 200 OK com uma mensagem de sucesso no corpo
        schema type: :object,
               properties: {
                 message: { type: :string }
               }
        # let(:store) { Store.create!(name: "Test Store", address: "123 Main St") }
        # let(:user) { User.create!(email: 'test@example.com', password: 'password', store: store) }
        # let(:Authorization) { "Bearer #{JWT.encode({ sub: user.id, scp: 'user', aud: nil, iat: Time.now.to_i, exp: (Time.now + 1.hour).to_i, jti: SecureRandom.uuid }, Rails.application.credentials.devise_jwt_secret_key!, 'HS256')}" }
        run_test!
      end

      response '401', 'não autorizado (token inválido ou ausente)' do
        # A mensagem pode variar dependendo se o token está ausente ou é inválido.
        # "You need to sign in or sign up before continuing." é um padrão do Devise.
        schema type: :object,
               properties: {
                 error: { type: :string, example: 'You need to sign in or sign up before continuing.' }
               }
        run_test!
      end
    end
  end
end
