# Diretriz de interface mobile do MedSync

Esta diretriz é obrigatória para Codex, Antigravity e qualquer agente que altere
interfaces do MedSync. Uma mudança visual só está pronta quando o comportamento
mobile foi planejado, implementado e validado — não como uma redução automática
da versão desktop, mas como uma composição própria para telas estreitas.

## 1. Breakpoints mínimos de validação

Validar, no mínimo, as seguintes larguras:

| Largura | Referência | Objetivo |
| --- | --- | --- |
| 360 px | telefone estreito | ausência de corte e rolagem horizontal acidental |
| 390 px | telefone principal | composição, legibilidade e hierarquia padrão |
| 430 px | telefone largo | uso equilibrado do espaço disponível |
| 760 px | limite mobile | transição consistente para tablet/desktop |

Também conferir 390 × 844 e 430 × 932 em orientação vertical. Quando o fluxo
for usado em paisagem, validar pelo menos uma largura entre 740 e 900 px.

## 2. Regras de composição

- Desenvolver primeiro a hierarquia de 390 px e então expandir.
- Evitar copiar grades de desktop para uma única coluna quando isso resultar em
  cinco ou mais cards altos empilhados. Nesses casos, usar carrossel com gesto,
  resumo progressivo ou agrupamento apropriado.
- Usar espaçamento lateral de 14–18 px e ritmo vertical de 8, 12, 16, 24, 32,
  48 ou 64 px.
- Limitar títulos principais a aproximadamente 32–42 px no telefone; títulos de
  seção devem ficar, em geral, entre 28–36 px.
- Não usar `vw` sem limites mínimos e máximos. Preferir `clamp()` com teto móvel
  explícito.
- Evitar alturas fixas para conteúdo textual. Preferir `min-height: 0`, altura
  automática e `aspect-ratio` apenas para mídias realmente proporcionais.
- Todo item em grid ou flex que contenha texto deve aceitar `min-width: 0`.
- Textos longos devem quebrar naturalmente. Não esconder informação essencial
  com `text-overflow` sem oferecer uma forma de acessá-la.
- Manter controles de toque com pelo menos 44 × 44 px.

## 3. Conteúdo denso

- Simuladores, dashboards e fluxos clínicos devem mostrar primeiro a etapa ativa;
  navegação e metadados ficam compactos ao redor dela.
- Listas extensas de benefícios podem usar revelação progressiva, desde que os
  itens essenciais e as condições comerciais continuem visíveis.
- Carrosséis devem usar gesto nativo, `scroll-snap`, pista visual do próximo item
  e ordem lógica no DOM. Não bloquear navegação por teclado.
- Não depender de hover no telefone. Toda ação deve funcionar por toque e teclado.

## 4. Movimento e desempenho

- Respeitar `prefers-reduced-motion` em animações, rolagem e transformações.
- Reduzir ou desativar no mobile efeitos contínuos pesados, grandes áreas com
  `blur`, partículas excessivas e animações que não expliquem uma mudança de estado.
- Imagens fora da primeira dobra devem usar carregamento tardio e dimensões
  declaradas para evitar deslocamento de layout.
- Nenhum efeito visual pode impedir leitura ou interação durante sua animação.

## 5. Organização do CSS

- Cada página complexa deve ter uma fonte de verdade mobile importada depois dos
  estilos-base. Na home, essa fonte é `src/styles/home-mobile.css`.
- Não acrescentar novos remendos responsivos ao final de arquivos históricos se
  já existir uma folha mobile dedicada.
- Evitar `!important`. Quando uma regra antiga obrigar seu uso, documentar a causa
  e remover a sobreposição em uma refatoração controlada.
- Não duplicar o mesmo seletor em vários blocos do mesmo breakpoint.
- Manter regras mobile agrupadas por seção da interface.

## 6. Checklist obrigatório antes de concluir

- [ ] Sem rolagem horizontal acidental em 360, 390 e 430 px.
- [ ] Nenhum texto, logo, card, imagem ou botão cortado ou deformado.
- [ ] Títulos não dominam mais de metade da primeira tela sem necessidade.
- [ ] Conteúdo principal aparece antes de elementos decorativos.
- [ ] Todos os controles têm área de toque adequada e estado de foco visível.
- [ ] Fluxos funcionam sem hover.
- [ ] `prefers-reduced-motion` foi verificado.
- [ ] A página foi inspecionada visualmente, não apenas compilada.
- [ ] Console sem erros atribuíveis à aplicação.
- [ ] Testes, lint e build foram executados.

## 7. Relatório esperado do agente

Ao entregar uma atualização visual, informar:

1. larguras verificadas;
2. componentes alterados;
3. comportamento de toque e teclado;
4. resultado da inspeção de overflow e deformação;
5. resultado de testes, lint e build;
6. limitações de verificação, se houver.

O agente não deve declarar a interface mobile concluída se apenas o desktop tiver
sido verificado.
