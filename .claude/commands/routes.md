---
description: Lista as rotas da API (opcionalmente filtradas) e aponta rotas sem controller/ação
argument-hint: "[filtro, ex: orders]"
allowed-tools: Bash(bin/rails routes:*), Bash(ls:*), Bash(grep:*), Bash(cd backend*)
---
Em `backend/`, rode `bin/rails routes -g "${ARGUMENTS:-api/v1}"`.
Mostre uma tabela verbo | caminho | controller#ação. Para cada controller#ação, verifique se o arquivo e o método
existem em `app/controllers/` e marque os ausentes (ex.: `api/v1/admin/users`).
