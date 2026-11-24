---
description: Roda a verificação completa (RSpec, RuboCop nos arquivos alterados, Brakeman, tsc) e resume o resultado
argument-hint: "[back|front|all]"
allowed-tools: Bash(bash .claude/scripts/check.sh:*)
---
Rode `bash .claude/scripts/check.sh $ARGUMENTS` (padrão `all`) a partir da raiz do repo.

Depois resuma em uma tabela: etapa | status | nº de falhas. Para cada falha, mostre o arquivo:linha e a causa provável.
Se o RSpec abortar por migrações pendentes, diga isso e sugira `/db-status`.
Não corrija nada automaticamente — pergunte ao usuário o que atacar primeiro.
