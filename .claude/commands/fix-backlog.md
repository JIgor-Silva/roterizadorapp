---
description: Escolhe (ou recebe) um item de "Problemas conhecidos" do CLAUDE.md e corrige com teste
argument-hint: "[número do item]"
---
Use a skill `corrigir-backlog`.
- Com argumento (`$ARGUMENTS`): corrija esse item.
- Sem argumento: liste os 5 itens de maior prioridade com esforço estimado (P/M/G) e pergunte qual atacar.
Ao final: mostre o diff resumido, o resultado dos testes e remova o item do CLAUDE.md.
