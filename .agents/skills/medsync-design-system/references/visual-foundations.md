# Fundamentos visuais

## Paleta principal

Use os papéis semânticos, não apenas os valores isolados.

| Papel | Token de referência | Valor | Uso |
| --- | --- | --- | --- |
| Tinta principal | `--medsync-ink` | `#071A32` | títulos, números e texto de alta ênfase |
| Texto | `--medsync-text` | `#355576` | corpo e descrições |
| Texto secundário | `--medsync-muted` | `#6D87A2` | metadados e apoio |
| Azul-marinho | `--medsync-navy` | `#031B2D` | áreas de imersão, rodapé e contraste |
| Azul-marinho suave | `--medsync-navy-soft` | `#082B42` | superfícies escuras e estados profundos |
| Azul principal | `--medsync-blue` | `#087DF1` | ação, foco e seleção |
| Azul profundo | `--medsync-blue-deep` | `#1758DF` | gradientes e ênfase controlada |
| Ciano | `--medsync-cyan` | `#24BCE9` | conexão, progresso e apoio ao azul |
| Violeta | `--medsync-violet` | `#6F63F6` | revisão e variação funcional |
| Coral | `--medsync-coral` | `#FF6C48` | atenção e categorias específicas |
| Fundo | `--medsync-off` | `#F7FBFF` | superfície geral clara |
| Painel | `--medsync-panel` | `#FFFFFF` | cards, formulários e áreas de leitura |
| Linha | `--medsync-line` | `#D8E8F4` | bordas e divisões |

O gradiente de marca parte de azul para ciano. Violeta e coral são acentos
funcionais, não substitutos do azul. Não use verde como cor de sucesso: prefira
azul, ciano, ícone e texto explícito.

## Tipografia

- `Sora`: títulos, números importantes e chamadas curtas.
- `Manrope`: corpo, controles, navegação e textos de interface.
- `Caveat`: anotações editoriais breves, nunca dados ou instruções essenciais.
- `Lora`: citação pontual, quando a composição realmente exigir voz editorial.

Títulos usam peso forte, entrelinha compacta e espaçamento negativo moderado.
Texto funcional prioriza legibilidade e não deve herdar a compressão dos
títulos. Não use mais de três famílias na mesma tela.

## Espaçamento e largura

- Escala preferencial: `8, 12, 16, 24, 32, 48, 64` px.
- Conteúdo editorial: máximo aproximado de `1180–1320` px.
- Texto corrido: limite a `60–75` caracteres por linha.
- Agrupe por proximidade; não resolva hierarquia apenas com bordas.
- No mobile, use `14–18` px de margem lateral.

## Superfícies

- Fundo predominante: off-white frio, com ondas e pontos em baixa opacidade
  apenas onde ajudam a composição.
- Cards: branco ou pastel funcional muito claro, borda fina azulada e sombra
  de baixa opacidade.
- Áreas escuras: azul-marinho, reservadas para imersão, contraste e assinatura.
- Raios usuais: `10–14` px para controles; `14–18` px para cards compactos;
  `18–24` px para superfícies principais. Pílulas ficam restritas a tags,
  estados e seletores realmente compactos.
- Sombras devem separar planos, não produzir halo luminoso permanente.

## Assinatura visual

A identidade é reconhecida pela combinação de:

- off-white frio e azul-marinho profundo;
- gradiente azul–ciano em pontos de decisão;
- cards pastéis com ilustrações funcionais simples;
- ondas suaves e padrões pontilhados periféricos;
- anotações manuscritas ocasionais fora do fluxo principal;
- alta clareza clínica e sensação de organização.

Use no máximo uma assinatura decorativa dominante por região da página.
