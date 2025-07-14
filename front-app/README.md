# RoterizadorApp - Frontend (Mobile)

Aplicativo móvel do RoterizadorApp, desenvolvido com React Native e Expo. Interface intuitiva para administradores de loja e entregadores gerenciarem pedidos, visualizarem rotas e acessarem informações importantes.

## 📱 Tecnologias Utilizadas

*   **React Native:** Framework para construção de aplicativos móveis multiplataforma.
*   **Expo:** Plataforma desenvolvimento de aplicativos React Native.
*   **TypeScript:** Linguagem.
*   **NativeWind (Tailwind CSS):** Estilização rápida e responsiva.
*   **React Navigation:** Gerenciamento de navegação entre telas.
*   **Axios:** Cliente HTTP para comunicação com o backend.
*   **AsyncStorage:** Armazenamento local de dados do pedido.
*   **React Native Maps & React Native Maps Directions:** Exibição de mapas e rotas.

## ✨ Funcionalidades

*   **Autenticação de Usuários:** Login e logout integrados com o backend.
*   **Dashboard Dinâmico:** Exibição de estatísticas de pedidos (todos, em rota, entregues, cancelados) com base no papel do usuário.
*   **Listagem e Detalhes de Pedidos:** Visualização de informações detalhadas de cada pedido.
*   **Visualização de Rotas no Mapa:** Exibição da rota de entrega no mapa, com origem, destino e polyline.
*   **Navegação Externa:** Opção de abrir a rota em aplicativos de mapa externos (Google Maps, Apple Maps).
*   **Exibição de Clima:** Informações climáticas relevantes para a localização do pedido urgente.
*   **Interface Responsiva:** Design adaptável a diferentes tamanhos de tela e orientações.

## 🛠️ Configuração e Desenvolvimento Local

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

*   **Node.js** (versão LTS recomendada)
*   **npm** ou **Yarn**
*   **Expo CLI** (`npm install -g expo-cli`)

### Instalação

1.  **Navegue até o diretório do frontend:**
    ```bash
    cd rota/front-app
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou yarn install
    ```

3.  **Configuração da API:**
    O arquivo `src/app/api/api.ts` contém a URL base do backend. Certifique-se de que `API_URL` aponte para o endereço correto do seu backend (geralmente `http://SEU_IP_LOCAL:3000/api/v1` se estiver rodando localmente).

    ```typescript
    // src/app/api/api.ts
    const API_URL = 'http://SEU_IP_LOCAL:3000/api/v1'; // Altere para o IP da sua máquina
    ```
    **Importante:** Se você estiver usando um emulador ou dispositivo físico, `localhost` não funcionará. Você precisará usar o endereço IP da sua máquina na rede local.

### Executando o Aplicativo

Para iniciar o servidor de desenvolvimento do Expo:

```bash
npm start
# ou yarn start
```

Isso abrirá uma nova aba no seu navegador com o Expo Dev Tools. Você pode então:

*   Escanear o código QR com o aplicativo Expo Go (disponível para iOS e Android) no seu dispositivo físico.
*   Pressionar `a` para abrir no emulador Android.
*   Pressionar `i` para abrir no simulador iOS.
*   Pressionar `w` para abrir no navegador web.

### Padrões de Código

Este projeto utiliza TypeScript e segue as convenções de estilo definidas pelo NativeWind (Tailwind CSS). Para verificar e corrigir problemas de código, você pode usar:

```bash
npm run ts-prune # Para encontrar código não utilizado
```

## 🤝 Contribuição

Sinta-se à vontade para contribuir com o projeto. Por favor, siga os padrões de código existentes e as melhores práticas de desenvolvimento.

---
