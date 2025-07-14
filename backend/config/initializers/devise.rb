# frozen_string_literal: true

Devise.setup do |config|
  # Configurações básicas
  config.navigational_formats = []
  config.mailer_sender = 'please-change-me-at-config-initializers-devise@example.com'
  
  # Configuração JWT
  config.jwt do |jwt|
    jwt.secret = Rails.application.credentials.devise[:jwt_secret_key] || 
                 Rails.application.secret_key_base
    jwt.expiration_time = 1.day.to_i
  end

  # Configuração Warden
  config.warden do |manager|
    manager.default_strategies(scope: :user).unshift :jwt_authenticatable
      # Comentando a personalização do failure_app para usar o padrão do Devise,
      # que deve retornar {"error": "You need to sign in or sign up before continuing."} para JSON.
      # manager.failure_app = ->(env) {
      #   [
      #     401,
      #     { 'Content-Type' => 'application/json' },
      #     [{ error: "Authentication failed" }.to_json]
      #   ]
      # }
  end

  # ORM
  require 'devise/orm/active_record'

  # Autenticação
  config.case_insensitive_keys = [:email]
  config.strip_whitespace_keys = [:email]
  config.skip_session_storage = [:http_auth, :params_auth]
  config.stretches = Rails.env.test? ? 1 : 12
  config.reconfirmable = true
  config.expire_all_remember_me_on_sign_out = true
  config.password_length = 6..128
  config.email_regexp = /\A[^@\s]+@[^@\s]+\z/
  config.reset_password_within = 6.hours

  # Configurações de segurança
  config.navigational_formats = []
  config.sign_out_via = :delete
  config.responder.error_status = :unprocessable_entity
  config.responder.redirect_status = :see_other
end
