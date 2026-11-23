---
paths:
  - "front-app/**/*.ts"
  - "front-app/**/*.tsx"
  - "front-app/*.js"
---

# Frontend (Expo + React Native + TypeScript)

## Estrutura (`front-app/src/app/`)
- `api/api.ts` — **único** cliente HTTP (axios com `baseURL` de `EXPO_PUBLIC_API_URL` e interceptor que injeta o JWT
  do AsyncStorage `userToken`). Toda chamada à API usa `import api from '../api/api'` com caminhos relativos (`/orders`).
  Não crie axios novo nem URL fixa (erro existente em `src/services/weatherService.ts`).
- `context/AuthContext.tsx` — `useAuth()` → `{ user, login, logout, isLoading, error }`. `user.role` é `'admin' | 'delivery_person'`.
- `navigation/navigation.config.tsx` — telas por papel em `screenConfigByRole`. Tela nova: registre aqui **e** em `RootStackParamList` (`types/index.ts`).
- `screens/` — telas. Arquivo `.web.tsx` sobrescreve a versão nativa na web (ex.: `MapScreen.web.tsx`, pois react-native-maps não roda na web).
- `components/<kebab-name>/` — cada componente tem 3 arquivos: `Nome.tsx`, `Nome.types.ts`, `Nome.styles.ts`.
  Descreva componentes novos em `front-app/COMPONENT_GUIDE.md`.
- `types/index.ts` — tipos de domínio (`Order`, `Client`, `OrderStatus`, `RootStackParamList`). Fonte única de tipos compartilhados.
- `styles/theme.ts` — cores (`themeColors`); `styles/orderStatusStyles.ts` — cores por status.

## Convenções
- TypeScript `strict`. Evite `any` novo; tipe props via `Nome.types.ts`. Alias `@/*` → `src/*` disponível.
- Estilo: NativeWind (`className="..."` com Tailwind) é o padrão para componentes novos; `StyleSheet` em `Nome.styles.ts` quando precisar de estilos dinâmicos/animações.
- Ícones: `lucide-react-native`. Toasts: `react-native-toast-message`. Formulários: `react-hook-form`.
- Dependências novas: `npx expo install <pkg>` (garante versão compatível com Expo SDK 53). Pergunte ao usuário antes.
- Sempre trate `loading` / erro / lista vazia em telas que buscam dados.
- Erros da API: backend devolve `{ error }` (maioria) ou `{ message }` (sessions/registrations). Leia ambos:
  `err.response?.data?.error ?? err.response?.data?.message`.
- Não deixe `console.log` com dados de usuário/token. `console.error` em catch é aceitável.
- Status de pedido: `'pending' | 'in_route' | 'delivered' | 'canceled'` (iguais ao enum do backend).

## Verificação
- `npx tsc --noEmit` (o hook roda automaticamente e mostra erros do arquivo editado).
- Não há testes automatizados nem ESLint; validação visual via `npm run web` ou Expo Go.
