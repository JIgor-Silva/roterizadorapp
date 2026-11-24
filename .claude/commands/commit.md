---
description: Cria um commit curto (máx. 6 linhas, Conventional Commits pt-BR) na branch da tarefa, após verificação
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*), Bash(git log:*), Bash(git switch:*), Bash(git checkout -b:*)
---
1. Nunca commite na `main`. Se estiver nela, crie a branch da tarefa: `<tipo>-<descricao-curta-com-hifens>`
   (ex.: `feat-geocodificacao-service`, `fix-autorizacao-lojas`, `chore-estrutura-claude`).
2. `git status` e `git diff HEAD`: só entram arquivos da tarefa (nada de master.key, .env, logs, tmp).
3. Se a verificação ainda não rodou nesta tarefa, rode `/check` (ou a parte relevante) antes.
4. `git add <arquivos específicos>` (nunca `git add -A` sem conferir).
5. Mensagem com **no máximo 6 linhas no total**:
   ```
   tipo(escopo): resumo no imperativo em pt-BR (≤ 72 chars)

   - o que mudou (1 linha)
   - por quê / impacto (1 linha)
   ```
   Tipos: feat, fix, refactor, test, docs, chore. Escopo: backend, front ou omitido.
6. Não faça push aqui — o push e o PR ficam no `/entregar`.
