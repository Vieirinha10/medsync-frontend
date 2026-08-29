# Debriefing clínico da página de resultado

## Estado da implementação

- Implementado no frontend em 29 de agosto de 2026.
- Não publicado nesta etapa.
- Não altera endpoints, payloads ou rubricas da API.
- A Synapse continua fazendo exatamente as mesmas chamadas existentes; apenas sua área foi reposicionada.

## Objetivo

Reduzir repetição e rolagem excessiva sem remover conteúdo clínico. Cada informação passa a ter um endereço único seguindo a causalidade do treino:

1. **Resultado:** nota total, perfil normalizado e uma síntese curta.
2. **Decisões:** avaliações e exames, hipótese e conduta comparados com a referência clínica.
3. **Impacto clínico:** reação, consequências, reavaliação e desfecho simulado em linha do tempo.
4. **Como evoluir:** até três prioridades, temas, objetivos, fontes e perguntas à Synapse.

## Arquivos

| Arquivo | Responsabilidade |
|---|---|
| `src/pages/ResultadoSimulacaoPage.jsx` | Estado das abas, transformação dos dados e composição dos quatro painéis. |
| `src/styles/result-debrief.css` | Layout dark-only, responsividade, estados semânticos e Perfil da decisão clínica. |
| `src/pages/ResultadoSimulacaoPage.test.jsx` | Fluxo entre abas, teclado, alerta de risco, detalhes clínicos e Synapse. |
| `src/App.jsx` | Importa o CSS do debriefing depois de `theme.css`. |
| `.interface-design/system.md` | Registra o padrão visual permanente da página. |
| `CHANGELOG.md` | Histórico público da mudança ainda não publicada. |

## Mapeamento dos dados atuais

| Interface | Campos da API |
|---|---|
| Nota geral | `pontuacao_total` |
| Perfil triangular | `pontuacao.exames / 40`, `pontuacao.hipotese / 30`, `pontuacao.conduta / 30` |
| Síntese | `feedback.sintese_raciocinio`, com fallback para `feedback.resumo` |
| Decisões | `exames`, `feedback_hipotese`, `diagnostico_referencia`, `feedback_conduta`, `feedback_seguranca`, `nivel_conduta` |
| Impacto | `consequencias`, `reacao_paciente`, `desfecho_clinico` |
| Evolução | `plano_pessoal_melhoria`, `pontos_melhoria`, `omissoes`, `recomendacoes_estudo`, `objetivos_aprendizagem`, `fontes_clinicas` |

O perfil usa percentuais, não os pontos brutos, porque as dimensões têm pesos diferentes. Prioridades são deduplicadas e limitadas a três, respeitando a ordem: plano pessoal → pontos de melhoria → omissões.

## Regras de segurança e semântica

- O alerta aparece quando `nivel_conduta === "insegura"` ou `estado_paciente === "deterioracao"`.
- O alerta fica fora dos painéis e permanece visível em qualquer aba.
- O botão do alerta leva para Impacto clínico, mas a abertura inicial continua previsivelmente em Resultado.
- Consequências são identificadas como simulação educacional e exibem `aviso_tempo`.
- Usar “referência clínica” e não “padrão-ouro”.
- A página não cria consequências nem recalcula nota; apenas apresenta dados já produzidos pela rubrica e pela API.

## Acessibilidade e responsividade

- `role="tablist"`, `role="tab"` e `role="tabpanel"` com vínculos ARIA.
- Navegação por `ArrowLeft`, `ArrowRight`, `Home` e `End`.
- Foco visível e controles com altura mínima de 42–46 px.
- Em telas de até 680 px, rótulos compactos, painel em uma coluna e comparações empilhadas.
- `prefers-reduced-motion` desativa a entrada animada dos painéis.

## Verificação realizada

- Testes específicos do resultado: aprovados.
- ESLint: aprovado sem avisos.
- Build Vite de produção: aprovado.
- O navegador remoto não conseguiu acessar `localhost` (`ERR_BLOCKED_BY_CLIENT`); portanto, a inspeção visual automatizada desktop/mobile precisa ser repetida quando houver uma URL de preview acessível.

## Continuidade recomendada

Antes de qualquer refatoração da Synapse, validar visualmente estes estados:

1. caso com conduta adequada e sem consequências negativas;
2. caso parcial com exames ausentes;
3. caso inseguro com deterioração e alerta vermelho;
4. caso psiquiátrico contendo avaliações ou escalas em vez de exames laboratoriais;
5. desktop largo, tablet e celular de 360 px.

Não mover novamente a Synapse para fora da aba Como evoluir e não duplicar conteúdos das abas em cards abaixo da navegação. A futura otimização de tokens deverá simplificar o contrato textual da Synapse sem alterar esta arquitetura de apresentação.
