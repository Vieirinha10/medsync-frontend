# Sistema de componentes

## Regra de reutilização

Antes de criar um componente, procure uma implementação equivalente e confirme
se ela pode receber variantes sem misturar responsabilidades. Extraia um
componente compartilhado quando ele já aparece em duas áreas ou quando uma nova
página deve reproduzir exatamente um padrão aprovado.

Não crie uma abstração apenas porque dois elementos têm o mesmo raio. O
componente precisa compartilhar papel, comportamento e estados.

## Famílias prioritárias

### Estrutura

- `AppShell`: navegação, fundo e largura útil.
- `PageHeader`: contexto, título, descrição e ação principal opcional.
- `SectionHeading`: título interno, apoio e alinhamento consistente.
- `ContentSection`: ritmo vertical e largura por arquétipo.

### Superfícies

- `SurfaceCard`: painel neutro de conteúdo.
- `FeatureCard`: apresentação de capacidade, somente em áreas editoriais.
- `MetricCard`: valor, rótulo, período e contexto.
- `FeedbackPanel`: orientação clínica ou educacional estruturada.

### Ações e navegação

- `PrimaryButton`, `SecondaryButton` e `QuietButton`.
- `Tabs`, `SegmentedControl` e `FilterBar` com comportamento acessível.
- `MobileCarousel` apenas quando cinco ou mais itens altos não funcionarem em
  coluna; deve usar gesto nativo e `scroll-snap`.

### Estados

- `LoadingState`: preserva o esqueleto da tarefa principal.
- `EmptyState`: explica o estado e oferece a próxima ação real.
- `ErrorState`: descreve o problema e a recuperação possível.
- `StatusBadge`: combina texto e cor; cor isolada não comunica estado.

## Contrato visual

Todo componente interativo deve ter:

- área de toque mínima de `44 × 44` px;
- foco visível;
- estado de teclado e toque equivalente ao hover;
- largura flexível e `min-width: 0` em grids e flex containers;
- carregamento sem deslocamento de layout evitável;
- contraste compatível com seu tamanho e peso tipográfico.

## Variação sem fragmentação

Permita variação por papel (`neutral`, `accent`, `attention`, `immersive`) e
densidade (`comfortable`, `compact`). Evite variantes nomeadas por página, pois
elas reproduzem CSS isolado e impedem evolução consistente.

Cards de categorias podem usar azul, ciano, violeta e coral em tons pastéis.
Não atribua cores aleatórias: uma categoria mantém a mesma cor em toda a
plataforma.
