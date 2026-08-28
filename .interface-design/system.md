# Sistema visual do MedSync

> Fonte de verdade para ajustes de interface.  
> Estado registrado em 28 de agosto de 2026.  
> O tema escuro é a identidade visual única e oficial do produto.

## 1. Princípio central

O MedSync deve parecer um ambiente clínico digital confiável, concentrado e tecnicamente refinado. A interface combina a profundidade azul-petróleo de uma sala de simulação com sinais luminosos inspirados em monitores, exames e tomada de decisão.

A experiência não deve parecer um template genérico de SaaS nem uma interface “feita por IA”. A tecnologia serve ao raciocínio clínico; não é o tema visual da plataforma.

### Intenção

- **Pessoa:** estudante de medicina treinando casos, questões, desafios visuais e revisões.
- **Tarefa:** compreender informações clínicas, tomar decisões e identificar o próximo passo com segurança.
- **Sensação:** foco, clareza, confiança, precisão e progresso.
- **Foco de cada tela:** uma ação clínica ou acadêmica principal deve vencer por contraste, peso e espaço.
- **Tom:** profissional e contemporâneo, sem ficar frio, corporativo ou excessivamente futurista.

## 2. Território visual

### Domínio

Raciocínio clínico, simulação, monitorização, evidência, segurança do paciente, evolução, prática deliberada e decisão.

### Mundo de cores

Azul-petróleo de ambiente controlado, azul diagnóstico, ciano de monitor, branco azulado de leitura, verde-lima de decisão positiva e violeta usado com moderação para progressão ou profundidade.

### Assinatura do MedSync

A assinatura visual combina cinco elementos:

1. fundo azul-petróleo profundo;
2. campo animado de ondas pontilhadas;
3. azul e ciano para informação clínica;
4. verde-lima para ações decisivas;
5. a identidade MedSync/Synapse com o “S” cromático.

Esses elementos devem aparecer com contenção. O conteúdo clínico continua sendo o protagonista.

## 3. Tema

### Regra obrigatória

- Existe apenas o tema escuro.
- Não criar seletor de tema.
- Não reintroduzir tema claro, preferência automática do sistema ou armazenamento de escolha de tema.
- O documento deve iniciar com `data-theme="dark"` e `color-scheme: dark` antes da montagem da aplicação.
- Qualquer nova página deve ser projetada diretamente para a paleta escura.

## 4. Paleta oficial

### Superfícies

| Papel | Valor | Uso |
|---|---:|---|
| Canvas profundo | `#031923` | fundo global e Chromatic Waves |
| Azul-petróleo principal | `#04273d` | heróis e superfícies clínicas fortes |
| Superfície base | `#082b3c` | cards e painéis |
| Superfície elevada | `#092f40` | menus, áreas destacadas e variações tonais |
| Superfície suave | `#0b3447` | controles, trilhas e agrupamentos |
| Entrada/inset | `#041f2c` | inputs, selects e textareas |

### Texto

| Nível | Valor | Uso |
|---|---:|---|
| Primário | `#e8f4f8` | títulos, valores e decisões |
| Padrão | `#dcebf1` | corpo principal |
| Secundário | `#91adba` | explicações e apoio |
| Metadado | `#8aa6b5` | legendas, datas e informações terciárias |
| Máximo contraste | `#eef9fc` | destaques pontuais, nunca em excesso |

### Marca e ação

| Papel | Valor | Uso |
|---|---:|---|
| Azul MedSync | `#087fe0` | ação clínica, links e estado ativo |
| Ciano | `#22c7ec` | sinais, conexão, monitorização e foco |
| Verde-lima | `#a7f34b` | CTA principal, sucesso e próxima decisão |
| Verde-lima suave | `#d7ff83` | gradação de CTA |
| Violeta | `#7659ed` | progressão e profundidade secundária |

### Bordas e sombras

- Borda padrão: `rgba(103, 203, 240, 0.15)`.
- Borda suave: entre 10% e 14% de opacidade.
- Borda de ênfase/foco: entre 24% e 34% de opacidade.
- Sombra baixa: `0 13px 34px rgba(0, 8, 14, 0.22)`.
- Sombra elevada: `0 24px 65px rgba(0, 8, 14, 0.35)`.
- Em tema escuro, priorizar mudança tonal e bordas discretas; sombras profundas ficam reservadas a elementos realmente elevados.

### Distribuição

Usar aproximadamente 60% de canvas profundo, 30% de superfícies azul-petróleo e até 10% de cor de marca/ação. Cor é informação, não decoração.

## 5. Profundidade e superfícies

A estratégia oficial é **mudança tonal com bordas discretas**, complementada por sombras apenas quando há elevação real.

- **Nível 0 — canvas:** `#031923`.
- **Nível 1 — seção:** transparente ou azul-petróleo muito próximo do canvas.
- **Nível 2 — card:** gradiente tonal entre `rgba(9, 48, 66, 0.97)` e `rgba(5, 35, 49, 0.97)`.
- **Nível 3 — popover/menu:** `rgba(6, 35, 49, 0.98)`, borda de baixo contraste e sombra elevada.
- **Inset — campo de entrada:** `#041f2c`, visualmente mais profundo que o card.

Não misturar bordas duras, sombras dramáticas e saltos bruscos de cor na mesma composição.

## 6. Tipografia

### Famílias

- **Poppins:** corpo, formulários e interface geral.
- **Sora:** títulos fortes, números importantes e momentos de marca.
- **Bitter:** ênfase editorial rara, especialmente frases de impacto ou morfismos tipográficos.
- **Manrope:** pode permanecer em mensagens específicas de abertura já existentes; não deve substituir Poppins como fonte funcional.

### Hierarquia

- Interface funcional: razão aproximada de 1.25.
- Metadado: 11–12 px, peso 700–900 quando em caixa alta, espaçamento entre letras controlado.
- Corpo: 14–16 px, peso 400–600, altura de linha entre 1.55 e 1.72.
- Título de card: 18–24 px, peso 700–850.
- Título de página: 28–44 px conforme densidade.
- Display da página inicial: `clamp(3.25rem, 6.2vw, 6.4rem)`, Sora 800, tracking negativo.
- Números dinâmicos devem usar algarismos tabulares.

Usar peso, contraste e espaço antes de aumentar indiscriminadamente o tamanho da fonte.

## 7. Espaçamento e proporções

- Unidade base: **8 px**.
- Microajustes ópticos: 4 px.
- Espaços internos de controles: 8–16 px.
- Cards funcionais: 20–32 px.
- Seções narrativas: 72–145 px, responsivas.
- Largura máxima principal: 1200–1320 px conforme a página.
- Cabeçalho: 78 px de altura, conteúdo de até 1320 px.
- Alvos interativos: mínimo de 40 px; preferencialmente 44 px.

### Raios

- Pequeno/controle: 12–14 px.
- Médio/card: 20–22 px.
- Grande/painel: 27–30 px.
- Herói: 32 px.
- Pílula: somente para tags, indicadores e chips.

Elementos aninhados devem respeitar raio concêntrico: o raio externo é o raio interno somado ao padding visual.

## 8. Componentes recorrentes

### Cabeçalho

- Altura: 78 px.
- Fundo: `rgba(3, 25, 35, 0.9)`.
- Borda inferior: ciano/azul em baixa opacidade.
- Desfoque discreto e sombra curta.
- Navegação secundária em `#a9c4d0`; item ativo em `#eefaff`.
- Não incluir controle de aparência.
- O botão “Planos” usa o verde-lima como ação comercial prioritária.

### Botão primário

- Altura típica: 52–54 px.
- Raio: 12–14 px.
- Fundo: gradiente contido entre `#a7f34b` e `#d7ff83`.
- Texto: azul-petróleo profundo.
- Peso: 800–850.
- Hover: leve elevação; active: `scale(0.97)`.
- Verde-lima deve indicar uma decisão clara, não preencher ações secundárias.

### Botão secundário

- Fundo translúcido azul-petróleo.
- Borda ciano discreta.
- Texto claro.
- Sem competir com o CTA principal.

### Cards e painéis

- Fundo tonal escuro.
- Borda de 1 px com baixa opacidade.
- Raio entre 22 e 30 px conforme a escala.
- Títulos claros, corpo em `#91adba`.
- Uma única informação ou ação deve liderar cada card.
- Evitar grades de cards idênticos quando a informação pede hierarquia diferente.

### Formulários

- Inputs mais escuros que o painel.
- Borda padrão quase invisível; foco azul/ciano mais nítido.
- Texto `#e5f2f7`; placeholder dessaturado.
- Labels curtos e claros.
- Estados de erro, sucesso, carregamento e desabilitado são obrigatórios.

### Página inicial

- Herói com margem de 16 px, raio de 32 px e composição aproximada 46/54 entre narrativa e simulação.
- Título é o foco; janela clínica é a prova visual.
- CTA verde-lima lidera, botão exploratório é secundário.
- A esteira contínua de instituições é um elemento permanente de confiança.
- Não usar numeração decorativa como “01 —”, “02 —”, “03 —”.
- Não usar pré-títulos decorativos de seção.

### Tela de abertura

- Exibida uma vez por sessão, respeitando `prefers-reduced-motion`.
- Base `#031722`, grade de 44 px e brilho radial azul.
- Logo central com largura máxima de 420 px.
- Assinatura oficial: “Mais preparo. Mais clareza. Melhores decisões.”
- Duração atual: saída iniciada em 2,8 s e remoção em 3,7 s.

## 9. Fundo Chromatic Waves

O campo de ondas pontilhadas é a textura oficial da página inicial.

- Base: `#031923`.
- Posição fixa abaixo do cabeçalho: `inset: 78px 0 0`.
- Altura: `calc(100vh - 78px)`.
- Opacidade do canvas: 0.72 no desktop e 0.66 no mobile.
- Composição: `mix-blend-mode: screen`.
- Paleta: azul-petróleo, azul, ciano e violeta.
- Movimento contínuo, lento e secundário ao conteúdo.
- Deve funcionar com WebGL 2 e fallback Canvas 2D.
- Nunca sobrepor uma segunda malha estática ao campo dinâmico.
- Nunca permitir que uma superfície opaca esconda o fundo quando ele for parte da composição pretendida.

## 10. Movimento

- Interações comuns: 150–250 ms.
- Usar curvas de saída rápidas; evitar `ease-in`.
- Animar preferencialmente `transform` e `opacity`.
- Hover de card: elevação máxima aproximada de 4–6 px.
- Pressão de botão: `scale(0.97)`.
- A animação deve ser percebida, não observada.
- Respeitar `prefers-reduced-motion`; remover deslocamentos e manter apenas transições essenciais.
- Evitar `transition: all` em novos componentes.

## 11. Responsividade

- A hierarquia deve sobreviver antes de a composição virar uma coluna.
- Navegação móvel mantém o mesmo mundo tonal do canvas.
- CTAs principais ocupam largura total em telas pequenas quando isso melhora a decisão.
- Cards de duas colunas passam para uma coluna abaixo de aproximadamente 760–1080 px, conforme o conteúdo.
- Não esconder informação clínica essencial para resolver falta de espaço.
- Reduzir primeiro ornamentos, chips flutuantes e movimento.

## 12. Acessibilidade e estados

- Contraste suficiente entre texto e superfícies.
- Foco visível em todos os elementos interativos.
- Elementos nativos para botões, links, inputs e detalhes.
- Estados obrigatórios: padrão, hover, active, focus, disabled, loading, empty, error e success quando aplicáveis.
- Ícones decorativos com `aria-hidden="true"`.
- Textos não podem depender apenas de cor para comunicar estado.
- Alvos de toque com pelo menos 40 × 40 px.

## 13. O que evitar

- Tema claro ou seletor de tema.
- Fundo estático duplicado sobre o Chromatic Waves.
- Interface genérica de IA, brilhos excessivos ou “glassmorphism” em todo lugar.
- Numeração e pré-títulos decorativos de seção.
- Bordas sólidas e chamativas.
- Cards iguais em todas as áreas.
- Vários acentos competindo na mesma tela.
- Gradientes sem função semântica.
- Sombras dramáticas em superfícies comuns.
- Cantos muito arredondados em controles pequenos.
- Texto cinza com contraste insuficiente.
- Animações lentas que atrasam tarefas frequentes.
- Conteúdo fictício apresentado como prova social real.

## 14. Arquivos de referência

- `src/styles/theme.css`: tema escuro global e Chromatic Waves.
- `src/styles/platform-solid.css`: tokens, navegação e padrões gerais da plataforma.
- `src/styles/home-solid.css`: linguagem visual da página inicial.
- `src/styles/home-intro.css`: tela de abertura.
- `src/App.jsx`: estrutura de navegação.
- `src/components/ChromaticWavesBackground.jsx`: renderização do fundo.
- `src/components/MedSyncIntro.jsx`: comportamento da abertura.

## 15. Checklist para futuros ajustes

Antes de concluir qualquer mudança visual:

1. A tela continua inequivocamente MedSync?
2. Existe um único foco principal?
3. O verde-lima está reservado à ação decisiva?
4. A nova superfície pertence à escala azul-petróleo?
5. Bordas e sombras estão discretas?
6. Espaçamento segue a base de 8 px?
7. Tipografia mantém a hierarquia Poppins/Sora?
8. Todos os estados interativos foram considerados?
9. A composição funciona em desktop e mobile?
10. O movimento respeita redução de animação?
11. O fundo pontilhado está visível apenas onde foi planejado?
12. O ajuste evitou numeração, pré-títulos e aparência genérica de IA?
