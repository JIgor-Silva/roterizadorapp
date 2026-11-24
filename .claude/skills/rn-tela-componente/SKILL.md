---
name: rn-tela-componente
description: Criar ou alterar telas e componentes do app Expo/React Native (front-app) seguindo o padrão do projeto — pasta com Nome.tsx/.types.ts/.styles.ts, NativeWind, navegação por papel, chamadas via api.ts e AuthContext. Use para qualquer trabalho de UI no front-app.
---

# Tela ou componente no front-app

## 1. Contexto
```bash
cd front-app
ls src/app/screens src/app/components
cat src/app/types/index.ts src/app/navigation/navigation.config.tsx
```
Veja se já existe componente pronto em `COMPONENT_GUIDE.md` (há ~45: Button, Card, Badge, Dialog, Input, Select, Skeleton, Tabs, ...).

## 2. Componente novo — `src/app/components/<kebab-name>/`
```
MeuComponente.tsx        # implementação (export default ou nomeado, siga o vizinho)
MeuComponente.types.ts   # export interface MeuComponenteProps { ... }
MeuComponente.styles.ts  # StyleSheet.create({...}) — pode ficar quase vazio se usar className
```
```tsx
import React from 'react';
import { View, Text } from 'react-native';
import type { MeuComponenteProps } from './MeuComponente.types';

export default function MeuComponente({ title }: MeuComponenteProps) {
  return (
    <View className="rounded-lg bg-zinc-900 p-4">
      <Text className="text-base font-semibold text-zinc-50">{title}</Text>
    </View>
  );
}
```
Adicione uma linha em `COMPONENT_GUIDE.md`.

## 3. Tela nova — `src/app/screens/NomeScreen.tsx`
1. Adicione a rota em `RootStackParamList` (`src/app/types/index.ts`).
2. Registre em `navigation.config.tsx` no array do(s) papel(éis) certo(s) (`publicScreens` / `authenticatedScreens` / crie `adminScreens`).
3. Navegação tipada: `useNavigation<NativeStackNavigationProp<RootStackParamList>>()`.
4. Se usar `react-native-maps`, crie também `NomeScreen.web.tsx` (maps não roda na web).

## 4. Dados da API
```tsx
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const [data, setData] = useState<Order[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  api.get<Order[]>('/orders')
    .then((r) => setData(r.data))
    .catch((e) => setError(e.response?.data?.error ?? e.response?.data?.message ?? 'Erro ao carregar.'))
    .finally(() => setLoading(false));
}, []);
```
Trate os 3 estados (loading → Skeleton, erro → mensagem/toast, vazio → texto amigável).

## 5. Verificar
```bash
npx tsc --noEmit          # sem erros novos no(s) arquivo(s) tocado(s)
npm run web               # conferência visual rápida (porta 8081) — peça ao usuário se precisar testar no celular
```
