---
description: Revisa as mudanças atuais (git diff) contra as regras do projeto antes de commitar
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*)
---
Rode `git status` e `git diff HEAD` (inclua arquivos não rastreados relevantes).
Revise contra `.claude/rules/` e reporte, do mais grave ao menos grave:
1. Segurança: endpoint sem `authorize`/autenticação, params permitindo `role`/`store_id` para não-admin, segredos no diff.
2. Correção: métodos inexistentes chamados, coordenadas invertidas, enum renumerado, migração antiga editada.
3. Contrato: serializer mudou sem atualizar `front-app/src/app/types/index.ts` / spec rswag.
4. Testes faltando para o comportamento novo.
5. Estilo (pt-BR nas mensagens, padrão de pastas do front, `console.log` com dados).
Formato: `arquivo:linha — problema — sugestão`. Se estiver tudo ok, diga e sugira a mensagem de commit (Conventional Commits pt-BR).
