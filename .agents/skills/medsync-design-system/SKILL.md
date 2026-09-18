---
name: medsync-design-system
description: Crie, reformule ou revise interfaces do MedSync preservando a identidade visual aprovada da homepage, a hierarquia entre páginas e a composição mobile. Use em páginas, componentes, estilos, navegação, responsividade, animação e auditorias visuais do MedSync; não use para correções técnicas sem decisão visual.
metadata:
  version: 1.0.0
---

# MedSync Design System

Trate as referências aprovadas e a homepage atual como fonte visual de verdade.
O objetivo é reconhecer a mesma plataforma em todas as áreas sem transformar
páginas funcionais em cópias da landing page.

## Autoridade visual

Em caso de conflito, siga esta ordem:

1. instrução explícita do usuário para a tarefa atual;
2. imagem ou página de referência aprovada pelo usuário;
3. identidade consolidada na homepage atual;
4. tokens e componentes compartilhados do MedSync;
5. diretrizes desta skill e de mobile;
6. exploração criativa, somente quando solicitada.

O modo padrão é **fidelidade**. Não acrescente uma “decisão memorável”, efeito
ou variação estética apenas para tornar o resultado original. Use o modo
exploratório somente quando o usuário pedir alternativas ou quando não existir
referência aprovada; mesmo assim, preserve os fundamentos da marca.

## Fluxo de trabalho

1. Classifique a página pelo seu papel: institucional, catálogo, estudo,
   painel, administrativo ou transacional.
2. Inspecione a implementação existente, as referências fornecidas e os
   componentes que já resolvem o mesmo problema.
3. Mapeie cada decisão nova para uma referência, token, componente ou
   necessidade funcional real.
4. Reutilize a linguagem visual sem copiar a densidade da homepage para áreas
   de trabalho.
5. Implemente primeiro a hierarquia de 390 px e expanda para desktop.
6. Compare visualmente o resultado com a referência e remova qualquer efeito
   que pareça genérico, repetitivo ou decorativo.

Não reescreva textos, métricas ou alegações sem solicitação. Não altere fluxos,
permissões ou regras de negócio como consequência de uma tarefa visual.

## Referências por tarefa

- Leia [visual-foundations.md](references/visual-foundations.md) para cor,
  tipografia, espaçamento, superfícies e assinatura visual.
- Leia [component-system.md](references/component-system.md) ao criar ou
  reformular componentes reutilizáveis.
- Leia [page-archetypes.md](references/page-archetypes.md) antes de reformular
  uma página completa ou definir sua densidade.
- Leia [motion-guidelines.md](references/motion-guidelines.md) para qualquer
  animação, transição ou interação em movimento.
- Leia [mobile-composition.md](references/mobile-composition.md) para qualquer
  alteração visual e também cumpra `docs/ai/MOBILE_FRONTEND_GUIDELINES.md`.
- Leia [visual-quality-checklist.md](references/visual-quality-checklist.md)
  antes de declarar uma interface pronta.

## Restrições de identidade

- Não use verde na identidade, nos gradientes ou nos destaques. Estados
  positivos usam azul ou ciano; preserve outra cor somente quando ela carregar
  significado clínico ou legal indispensável e tiver aprovação.
- Não introduza uma nova família tipográfica, cor de marca, linguagem de
  sombra, raio ou ícone sem necessidade demonstrável.
- Não use glow, glassmorphism, partículas, tilt 3D, spotlight do cursor ou
  gradiente animado como acabamento automático.
- Não repita a mesma animação de entrada em todos os elementos da página.
- Não dependa de hover para revelar informação ou ação.
- Não converta telas densas em grandes cards promocionais.
- Não use anotações manuscritas dentro de fluxos clínicos, tabelas, formulários
  ou áreas administrativas; elas pertencem a momentos editoriais e de apoio.

## Relação com frontend-design

Esta skill prevalece em todo trabalho visual do MedSync. `frontend-design` é
apenas uma fonte complementar para exploração explicitamente solicitada e não
pode substituir referências, tokens ou decisões registradas aqui.
