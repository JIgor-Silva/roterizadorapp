---
description: Esteira de entrega — branch, commit curto, review do Kimi, push e PR para o usuário conferir
argument-hint: "[nome-da-branch]"
---
Esteira obrigatória de toda demanda (o passo 0 vem antes de alterar qualquer arquivo). Siga na ordem:

0. **Sincronizar com a main** (antes de alterar qualquer coisa):
   - Rodar `git status --porcelain`; se houver arquivos, executar `git stash -u`.
   - `git checkout main && git pull`.
   - Se fez stash, executar `git stash apply` (resolver conflitos antes de seguir).
   - Sem arquivos pendentes, só executar `git checkout main && git pull`.
   Os comandos locais rodam pelo Kimi (`kimi_run_command` em `/workspace/projetos/roterizadorapp`), mas `git pull`/`git push` rodam no host porque o container do Kimi não tem acesso SSH ao GitHub.
1. **Branch**: uma branch por demanda, a partir da `main` (ou da branch da qual a demanda depende —
   nesse caso o PR aponta para essa base). Nome: `<tipo>-<descricao-com-hifens>` (`$ARGUMENTS` se informado).
2. **Verificação**: specs/rubocop/tsc dos arquivos tocados passando (`/check`).
3. **Commit**: `/commit` (máximo 6 linhas).
4. **Review do Kimi** (sempre): envie o diff da branch para o Kimi revisar com a ferramenta de review
   (`kimi_review` para diff pequeno; `kimi_job_start` com `mode: "review"` e
   `command: "cd /workspace/projetos/roterizadorapp && git diff <base>..<branch>"` para diff grande).
   Passe em `context` os fatos do projeto que o diff não mostra (ex.: escopo JWT `api_v1_user`,
   `Api::V1::ApplicationController` já autentica, stub global do RouteCalculationService).
   Avalie cada achado: corrija os reais num commit novo e liste os descartados com o motivo.
5. **Push**: `git push -u origin <branch>` (nunca `--force`).
6. **PR**: abra para a base correta com título = assunto do commit e corpo com: Resumo, Como testar,
   Review do Kimi (achados aceitos/descartados). O usuário revisa e faz o merge — nunca faça merge sozinho.
7. **Memória do Kimi**: se a demanda revelou um fato útil e reaproveitável (convenção, armadilha, comando),
   proponha salvá-lo com `kimi_remember` (fato curto + `pattern` regex).
