---
description: RuboCop no backend (arquivos indicados ou alterados) com autocorreção segura
argument-hint: "[arquivos...]"
allowed-tools: Bash(bundle exec rubocop:*), Bash(git diff:*), Bash(git ls-files:*), Bash(cd backend*)
---
Em `backend/`:
1. Alvo = `$ARGUMENTS`; se vazio, os `.rb` alterados (`git diff --name-only HEAD` + não rastreados).
2. `bundle exec rubocop -a --force-exclusion <alvo>` (só correções seguras; nunca `-A`).
3. `bundle exec rubocop --force-exclusion <alvo>` e liste o que sobrou, corrigindo manualmente o que for trivial.
Não rode rubocop no projeto inteiro com autocorreção (gera diff enorme fora do escopo).
