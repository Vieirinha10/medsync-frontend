# Movimento

Movimento deve apresentar, conectar, explicar estado ou confirmar interação.
Se não cumprir uma dessas funções, remova-o.

## Escala temporal

- Microinteração: `160–240 ms`.
- Mudança de estado ou painel: `320–520 ms`.
- Entrada de seção: `600–800 ms`.
- Stagger entre irmãos: `40–80 ms`, com atraso total curto.
- Movimento ambiente: raro, lento e restrito a uma região de assinatura.

Prefira curvas suaves como `cubic-bezier(.16, 1, .3, 1)` para entradas e
`cubic-bezier(.2, .8, .2, 1)` para estados. Não misture muitas curvas na mesma
tela.

## Padrões aprovados

- Hero: sequência única de título, apoio e demonstração.
- Etapas clínicas: transição curta com continuidade espacial.
- Seções editoriais: revelação discreta uma única vez.
- Anotação manuscrita: traço desenhado depois do texto principal.
- Botões: resposta de cor e deslocamento mínimo de ícone.
- Carrossel: gesto nativo; não mover automaticamente sem solicitação.

## Padrões que exigem referência ou aprovação

- spotlight seguindo o cursor;
- border beam contínuo;
- parallax;
- partículas;
- texto embaralhado;
- tilt 3D;
- cards flutuando continuamente;
- scroll pinning ou narrativa presa à rolagem.

Não replique um efeito só porque existe código em Magic UI, Aceternity,
Codrops ou outra biblioteca. Adapte a lógica ao sistema atual e revise peso,
dependências, toque e acessibilidade. Não introduza Tailwind apenas para copiar
um componente.

## Mobile e acessibilidade

- Respeite `prefers-reduced-motion` e mantenha todo conteúdo disponível.
- Desative blurs grandes, spotlight, parallax e animações ambientes no mobile.
- Nenhum elemento pode bloquear leitura ou toque durante a animação.
- Não anime altura de texto com valor fixo.
- Pause efeitos quando a página estiver oculta.
