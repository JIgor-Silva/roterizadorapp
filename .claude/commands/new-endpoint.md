---
description: Cria um endpoint novo na API v1 (rota, controller, policy, serializer, spec) seguindo o padrão do projeto
argument-hint: "<descrição do endpoint, ex: GET /stores/:id/stats só para admin>"
---
Tarefa: $ARGUMENTS

Use a skill `rails-endpoint`. Antes de escrever código, apresente em até 6 linhas:
verbo + caminho, quem pode acessar (papel), params, formato da resposta, arquivos que serão criados/alterados.
Implemente, rode o spec novo e `bundle exec rubocop` nos arquivos tocados, e mostre o resultado.
Se a resposta precisar aparecer no app, avise que o próximo passo é a skill `feature-fullstack`.
