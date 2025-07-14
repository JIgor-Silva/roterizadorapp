# RoterizadorApp - Projeto Completo

Este repositório contém o projeto completo do RoterizadorApp, que consiste em um backend Ruby on Rails e um frontend mobile desenvolvido com React Native.

## 🚀 Visão Geral do Projeto

O RoterizadorApp é uma aplicação que visa otimizar a gestão de entregas, permitindo que administradores de loja e entregadores gerenciem pedidos, visualizem rotas e acessem informações relevantes para o processo de entrega.

### Estrutura do Repositório

*   `backend/`: Contém o código-fonte do serviço de backend (Ruby on Rails).
*   `front-app/`: Contém o código-fonte do aplicativo mobile (React Native).

## 🛠️ Como Rodar o Projeto Localmente

Para ter o projeto RoterizadorApp funcionando em sua máquina local, siga os passos abaixo para configurar tanto o backend quanto o frontend.

### Pré-requisitos Globais

Certifique-se de ter as seguintes ferramentas instaladas:

*   **Git**
*   **Docker** e **Docker Compose** (recomendado para facilitar a configuração do ambiente)
*   **Ruby** (versão 3.3.0)
*   **Node.js** (versão LTS recomendada)
*   **npm** ou **Yarn**
*   **Expo CLI** (`npm install -g expo-cli`)
*   **PostgreSQL** (se não for usar Docker para o banco de dados)

### 1. Configuração do Backend

Siga as instruções detalhadas no `backend/README.md` para configurar e iniciar o servidor Rails. Em resumo:

1.  **Navegue até o diretório do backend:**
    ```bash
    cd backend
    ```

2.  **Instale as dependências do Ruby:**
    ```bash
    bundle install
    ```

3.  **Configure o banco de dados:**
    ```bash
    rails db:create
    rails db:migrate
    rails db:seed # Popula o banco com dados de exemplo
    ```

4.  **Configure as credenciais da API:**
    Edite `config/credentials.yml.enc` para adicionar as chaves de API necessárias (OpenRouteService, WeatherAPI, Google Geocoding, Devise JWT). Consulte o `backend/README.md` para mais detalhes.

5.  **Inicie o servidor Rails:**
    ```bash
    rails s
    ```
    O backend estará disponível em `http://localhost:3000`.

### 2. Configuração do Frontend

Siga as instruções detalhadas no `front-app/README.md` para configurar e iniciar o aplicativo React Native. Em resumo:

1.  **Navegue até o diretório do frontend (em um novo terminal):**
    ```bash
    cd front-app
    ```

2.  **Instale as dependências do Node.js:**
    ```bash
    npm install # ou yarn install
    ```

3.  **Ajuste a URL da API:**
    Edite `front-app/src/app/api/api.ts` e defina `API_URL` para o endereço IP da sua máquina onde o backend está rodando (ex: `http://SEU_IP_LOCAL:3000/api/v1`).

4.  **Inicie o aplicativo Expo:**
    ```bash
    npm start # ou yarn start
    ```
    Isso abrirá o Expo Dev Tools no seu navegador, onde você pode escolher como rodar o aplicativo (emulador, dispositivo físico, web).

## 🧪 Como Testar o Projeto

### Testes do Backend

Para rodar os testes do backend (RSpec):

```bash
cd backend
bundle exec rspec
```

### Testes do Frontend

Atualmente, o frontend não possui testes automatizados configurados. A verificação é feita manualmente através da interface do usuário.

## 🤝 Contribuição

Sinta-se à vontade para contribuir com o projeto. Por favor, siga os padrões de código existentes e as melhores práticas de desenvolvimento. Para mais detalhes sobre como contribuir, consulte os `README.md` individuais de cada subprojeto.

---
