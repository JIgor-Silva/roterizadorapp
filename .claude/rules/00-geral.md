# Regras gerais (sempre ativas)

## Forma de trabalhar
1. **Entenda antes de mudar.** Leia o arquivo inteiro que vai editar e os vizinhos diretos (model ↔ policy ↔ serializer ↔ controller ↔ spec; screen ↔ component ↔ types).
2. **Mudanças pequenas e focadas.** Um objetivo por vez. Não reformate nem renomeie código que não faz parte da tarefa.
3. **Verifique sempre** antes de dizer que terminou:
   - Backend: `cd backend && bundle exec rspec <spec afetado>` e `bundle exec rubocop <arquivos>`.
   - Front: `cd front-app && npx tsc --noEmit`.
   - Se não conseguir rodar (ex.: banco fora do ar), diga isso explicitamente — nunca afirme que "funciona" sem evidência.
4. **Não invente APIs.** Antes de chamar um método (ex.: `RouteCalculationService.geocode_address`), confirme com `grep` que ele existe.
5. Ao corrigir um item do backlog em `CLAUDE.md` → "Problemas conhecidos", remova-o da lista no mesmo commit.

## Idioma e estilo
- Textos de UI, mensagens de erro da API, comentários e commits em **português (pt-BR)**.
- Nomes de código (classes, métodos, variáveis) em **inglês**, seguindo o que já existe.
- Commits: Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`), escopo opcional `(backend)` / `(front)`.

## Segurança
- Nunca leia, imprima, copie ou commite `config/master.key`, `credentials.yml.enc`, `.env*` ou tokens.
- Nunca coloque chaves de API no código; use `Rails.application.credentials.dig(...)` (backend) ou `process.env.EXPO_PUBLIC_*` (front, apenas valores não secretos).
- Não remova verificações de autenticação/autorização para "fazer funcionar".

## Git e entrega
- **Uma branch por demanda**, nome `<tipo>-<descricao-com-hifens>` (ex.: `feat-geocodificacao-service`). Nunca commite na `main`.
- Commits com **no máximo 6 linhas** (assunto + até 2 linhas de corpo). Veja `/commit`.
- Ao finalizar uma demanda, siga a esteira `/entregar`: verificação → commit → **review do Kimi** → push → PR.
- O usuário revisa e faz o merge dos PRs. Não faça merge, `reset --hard`, `rebase` ou `--force` sem pedido explícito.
- Antes de commitar: `git status` + `git diff --staged` e confirme que só entram arquivos da tarefa.
