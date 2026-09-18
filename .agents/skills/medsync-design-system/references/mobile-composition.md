# Composição mobile

Esta referência complementa, sem substituir,
`docs/ai/MOBILE_FRONTEND_GUIDELINES.md`.

## Princípio

Desenhe a hierarquia em 390 px antes de adaptar o desktop. Mobile não é uma
grade desktop empilhada: preserve primeiro a tarefa, depois contexto e, por
último, decoração.

## Decisões por tipo

- Catálogo: filtros essenciais visíveis e opções avançadas em revelação
  progressiva.
- Estudo: etapa ativa primeiro; progresso compacto acima; feedback abaixo.
- Painel: próxima ação antes das métricas secundárias.
- Administrativo: tabelas podem virar linhas resumidas expansíveis, sem perder
  rótulos.
- Transacional: formulário em uma coluna, resumo comercial próximo da ação.

## Regras da identidade

- Títulos principais: aproximadamente `32–42` px.
- Títulos de seção: aproximadamente `28–36` px.
- Margem lateral: `14–18` px.
- Cards horizontais mostram pista do próximo item quando houver carrossel.
- Anotações manuscritas ficam menores e fora do eixo principal de leitura.
- Ondas e pontos não podem competir com conteúdo ou gerar faixas vazias.
- Ilustrações decorativas podem ser reduzidas ou removidas antes de comprimir
  texto e controles.

## Validação mínima

Valide `360`, `390`, `430` e `760` px, além de `390 × 844` e `430 × 932`.
Confira rolagem horizontal, quebras, deformação de imagens, foco, toque,
carrosséis e conteúdo com texto ampliado.
