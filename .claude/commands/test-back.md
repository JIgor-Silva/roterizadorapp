---
description: Roda RSpec do backend (tudo, um arquivo ou arquivo:linha) e explica falhas
argument-hint: "[spec/caminho_spec.rb[:linha]]"
allowed-tools: Bash(bundle exec rspec:*), Bash(cd backend*)
---
Em `backend/`, rode `bundle exec rspec $ARGUMENTS` (sem argumento = suíte inteira).

- Se passar: informe o total de exemplos.
- Se falhar: para cada falha, mostre o exemplo, a mensagem e o trecho do código provavelmente responsável
  (leia o arquivo). Classifique: bug no código, teste desatualizado ou ambiente (banco/migração).
- Se abortar por "pending migrations", siga a skill `ambiente-local`.
