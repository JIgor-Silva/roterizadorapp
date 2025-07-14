# RoterizadorApp - Backend

Este é o serviço de backend da aplicação RoterizadorApp, construído com Ruby on Rails. Responsável por gerenciar usuários, pedidos, calcular rotas, integrar com serviços de clima e fornecer uma API robusta para o frontend.

## 🚀 Tecnologias Utilizadas

*   **Ruby on Rails 8.0.2:** Framework web principal.
*   **PostgreSQL:** Banco de dados relacional.
*   **Devise-JWT:** Autenticação de usuários com JSON Web Tokens.
*   **Pundit:** Autorização e controle de acesso baseado em papéis.
*   **Rswag (Swagger/OpenAPI):** Geração e visualização de documentação da API.
*   **Geocoder:** Geocodificação de endereços para coordenadas.
*   **HTTParty & Faraday:** Clientes para integração com APIs externas (OpenRouteService, WeatherAPI).
*   **Solid Cache, Solid Queue, Solid Cable:** Soluções de cache, filas e Action Cable baseadas em banco de dados.
*   **Kamal:** Ferramenta para deploy contêinerizado (Docker).
*   **Rubocop:** Análise de código estática para garantir padrões de estilo.
*   **RSpec:** Framework de testes.

## ✨ Funcionalidades

*   **Autenticação de Usuários:** Registro, login e logout com JWT para administradores de loja e entregadores.
*   **Controle de Acesso Baseado em Papéis (RBAC):** Diferentes permissões para `admin` e `delivery_person`.
*   **Gestão de Pedidos:** Criação, listagem, visualização e atualização de pedidos.
*   **Cálculo de Rotas:** Integração com OpenRouteService para calcular distância, duração e polylines de rotas de entrega.
*   **Dados Climáticos:** Integração com WeatherAPI para obter informações de clima.
*   **API RESTful:** Interface bem definida para comunicação com o frontend.
*   **Documentação Interativa da API:** Swagger UI disponível em `/api-docs`.

## 🛠️ Configuração e Desenvolvimento Local

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

*   **Ruby** (versão 3.3.0, conforme `.ruby-version`)
*   **Bundler** (`gem install bundler`)
*   **PostgreSQL** (servidor de banco de dados)
*   **Docker** (opcional, para ambiente de desenvolvimento contêinerizado ou deploy)

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/RubyLe/rota.git
    cd rota/backend
    ```

2.  **Instale as dependências do Ruby:**
    ```bash
    bundle install
    ```

3.  **Configuração do Banco de Dados:**
    Edite `config/database.yml` se necessário, mas as configurações padrão para desenvolvimento (`backend_development`) e teste (`backend_test`) geralmente funcionam com um servidor PostgreSQL local.

    Crie e migre o banco de dados:
    ```bash
    rails db:create
    rails db:migrate
    ```

4.  **Preenchimento de Dados (Seeding):**
    O arquivo `db/seeds.rb` contém dados de exemplo para lojas, usuários (administradores e entregadores) e pedidos. Ele também tenta geocodificar endereços e criar rotas de exemplo.

    ```bash
    rails db:seed
    ```
    **Nota sobre o Seeding:** O processo de seeding pode demorar um pouco devido às chamadas de geocodificação. Se houver erros de geocodificação, o script tentará continuar, mas alguns clientes podem ser ignorados.

5.  **Variáveis de Ambiente / Credenciais:**
    Este projeto utiliza `Rails.application.credentials` para armazenar chaves de API sensíveis. Você precisará configurar as seguintes chaves:

    *   `devise.jwt_secret_key`: Chave secreta para JWT (Devise).
    *   `open_route_service.api_key`: Chave da API do OpenRouteService para cálculo de rotas.
    *   `weather_map.api_key`: Chave da API do WeatherAPI para dados climáticos.
    *   `google_geocoding_api_key`: Chave da API do Google Geocoding (usada pelo Geocoder).

    Para editar suas credenciais, execute:
    ```bash
    EDITOR="nano" rails credentials:edit
    ```
    Substitua `"nano"` pelo seu editor de texto preferido. Adicione as chaves no formato YAML:

    ```yaml
    devise:
      jwt_secret_key: SEU_JWT_SECRET_KEY_AQUI

    open_route_service:
      api_key: SUA_OPENROUTESERVICE_API_KEY_AQUI

    weather_map:
      api_key: SUA_WEATHERAPI_API_KEY_AQUI

    google_geocoding_api_key: SUA_GOOGLE_GEOCODING_API_KEY_AQUI
    ```

### Executando o Servidor

Inicie o servidor Rails no modo de desenvolvimento:

```bash
rails s
```

O backend estará disponível em `http://localhost:3000`.

### API Endpoints

A documentação completa da API está disponível em `http://localhost:3000/api-docs` após o servidor estar rodando.

Alguns endpoints importantes incluem:

*   `POST /api/v1/users/sign_in`: Login de usuário.
*   `DELETE /api/v1/users/sign_out`: Logout de usuário.
*   `GET /api/v1/stores/:id`: Detalhes da loja.
*   `GET /api/v1/orders`: Listar todos os pedidos (requer autenticação).
*   `POST /api/v1/orders/:id/calculate_route`: Calcular rota para um pedido (apenas admin).
*   `GET /api/v1/orders/delivery_person/:id`: Pedidos de um entregador específico.
*   `GET /api/v1/weather`: Dados climáticos.

### Testes

Para rodar os testes da aplicação:

```bash
bundle exec rspec
```

### Padrões de Código

Este projeto segue os padrões de código definidos pelo Rubocop. Para verificar e corrigir automaticamente problemas de estilo:

```bash
bundle exec rubocop
bundle exec rubocop -a # Para corrigir automaticamente
```

## 🐳 Docker

O `Dockerfile` na raiz do diretório `backend` é otimizado para produção. Para construir a imagem Docker:

```bash
docker build -t roterizadorapp-backend .
```

Para rodar o contêiner (substitua `<your_rails_master_key>` pela sua chave mestra do Rails):

```bash
docker run -d -p 3000:3000 -e RAILS_MASTER_KEY=<your_rails_master_key> --name roterizadorapp-backend roterizadorapp-backend
```

## 🚀 Deploy com Kamal

Este projeto está configurado para deploy com Kamal. Consulte a documentação do Kamal para configurar seu ambiente de deploy.

---
