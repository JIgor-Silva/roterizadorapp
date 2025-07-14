# config/routes.rb
Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'
  namespace :api do
    namespace :v1 do
      # Devise usuários
      devise_for :users,
                 path: '',
                 controllers: {
                   sessions: 'api/v1/sessions',
                   registrations: 'api/v1/registrations'
                 },
                 path_names: {
                   sign_in: 'users/sign_in',
                   sign_out: 'users/sign_out',
                   registration: 'users'
                 },
                 defaults: { format: :json }

      # Rotas (admin/atualiza)
      resources :stores, only: [:show, :update]

      # Rotas pedidos
      resources :orders, only: [:index, :show, :create, :update] do
        member do
          post 'calculate_route' # Admin aciona cálculo de rota
          get 'route_details'    # Admin ou entregador vê detalhes da rota
        end
        collection do
          get 'delivery_person/:id', to: 'orders#delivery_person_orders'
        end
      end

      # Rotas específicas para admin (gerenciamento de usuários)
      namespace :admin do
        resources :users, only: [:index, :create, :update, :destroy] # Admin gerencia entregadores
      end

      # Rota para dados climáticos
      get 'weather', to: 'weather#show'
    end
  end

  # Health check
  get "up" => "rails/health#show", as: :rails_health_check
end
