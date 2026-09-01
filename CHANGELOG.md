# Histórico de alterações

## Não publicado

### Adicionado
- Repertório compartilhado de IA em `.agents/`, compatível com Codex e
  Google Antigravity, com Graphify 0.9.53, Copywriting 2.0.2 e Humanizer
  2.11.2 preservados em suas versões auditadas.
- Configuração local verificável da skill proprietária Frontend Design 1.1.0,
  baixada do commit fixado da Anthropic sem redistribuição no repositório.
- Regras de acionamento, contexto de produto, lock de versões e script de
  instalação com validação por Git blob SHA-1.
- Grafo arquitetural local do frontend, gerado sem LLM a partir do código, com
  regra e workflow oficiais do Graphify para o Antigravity.
- Nova subseção `Financeiro → Synapse` com custo médio por caso e usuário,
  chamadas por assinante, tokens em cache, latência média/p95, distribuição por
  modelo e operação, tendência diária e configuração operacional ativa.
- Seleção de período de 7, 30 ou 90 dias no painel de consumo, sem criar
  franquia ou bloqueio de perguntas para os estudantes.
- Nova página de resultado organizada como debriefing clínico em quatro abas: Resultado, Decisões, Impacto clínico e Como evoluir.
- “Perfil da decisão clínica” triangular, com Exames, Hipótese e Conduta normalizados individualmente em percentuais para evitar distorção entre pesos de 40/30/30.
- Linha causal de impacto clínico simulado, reunindo reação imediata, consequências temporais, reavaliação de sinais vitais e desfecho em uma única sequência.
- Alerta persistente para conduta insegura, com atalho direto para a aba de impacto clínico.
- Área de Psiquiatria e Saúde Mental integrada ao catálogo, com 15 novos casos e total atualizado para 80 casos clínicos; a meta final passa de 100 para 115 casos.
- Segundo lote da expansão do catálogo, elevando o total de 60 para 65 casos clínicos.
- Primeiro lote da expansão do catálogo clínico, elevando o total publicado de 55 para 60 casos.

### Alterado
- O feedback principal agora apresenta uma síntese personalizada e explícita de
  Exames, Hipótese e Conduta, com destaque visual para qualquer eixo abaixo de
  50% e sem esconder uma conduta zerada atrás da nota geral.
- O título do resultado passou a considerar falhas críticas por dimensão; um
  diagnóstico correto com conduta zerada é identificado como “Bom diagnóstico,
  mas conduta inadequada”.
- Removidas do projeto as orientações vinculadas à skill externa `interface-design`; futuras decisões visuais passam a considerar somente o código, o histórico e as solicitações específicas do MedSync.
- Consolidado o feedback anteriormente distribuído em vários cards repetitivos: avaliação por etapa na aba Decisões e prioridades de melhoria, temas, fontes e perguntas à Synapse na aba Como evoluir.
- A navegação do resultado passou a usar abas acessíveis por teclado, barra fixa durante a leitura e rótulos compactos em telas pequenas.
- A comparação diagnóstica usa “referência clínica do caso” em vez de “padrão-ouro”, preservando alternativas clinicamente aceitáveis previstas pela rubrica.
- A área de perguntas à Synapse foi mantida funcional e transferida para o fechamento do debriefing, sem mudanças no contrato da API ou geração de chamadas adicionais.
- A etapa clínica de exames agora usa a expressão “avaliações e exames”, contemplando escalas psicológicas e psiquiátricas sem alterar o contrato técnico da API.
- Padronizados e unificados os fundos, gradientes, bordas e animações de órbita dos cards iniciais (heróis) de todas as abas principais (Casos Clínicos, Desafios Visuais, Questões, Central de Revisões, Trilhas e Caderno de Erros), preservando integralmente os painéis e widgets funcionais internos.
- Padronizados os cards de apresentação e filtros do Banco de Questões (`.questions-setup-card`, `.questions-performance-card`, `.questions-catalog-card`) com o padrão visual escuro translúcido das demais abas.
- Aprimorado o card do Plano Rápido de Melhoria (`.study-recommendations.is-standalone`) no resultado dos casos clínicos, com superfície escura gradiente, acento verde-lima e chips de alta legibilidade.
- Aprimorados os cards de hipótese diagnóstica e prioridades de conduta (`.clinical-core-card`) na tela de resultado do caso clínico com superfícies escuras, bordas suaves e caixas de referência clínica em alto contraste.
- Adicionadas animações dinâmicas na tela de resultado do caso clínico: contagem numérica progressiva e suave da nota total (`useAnimatedScore`), desabrochar progressivo do polígono de radar com vértices pulsantes em verde-lima e barras de preenchimento animadas por dimensão (Exames, Hipótese, Conduta).
- Padronizadas as cores de seleção e hover dos cards de exames da simulação clínica (`.journey-exam-grid label`) com o padrão verde-lima da plataforma (`#a7f34b`), alinhando o feedback visual com o Banco de Questões e os Desafios Visuais.
- Redesenhada a área de justificativa clínica de exames na simulação clínica (`ExamRationaleSection` em `SimulacaoCaso.jsx` e `simulation-v2.css`): substituído o empilhamento de múltiplas caixas de texto por um container compacto com botão alternante de recolher/expandir e seletor por abas/chips (`.exam-tab-chip`) com indicadores de preenchimento, mantendo a tela limpa e focada em apenas 1 exame por vez.
- Aprimorada visualmente a nova página de Debriefing Clínico (`ResultadoSimulacaoPage.jsx` e `result-debrief.css`) com o Hero Card oficial em gradiente marinho profundo, ilha de abas com ícones e destaque luminoso, painel de maestria clínica com radar neon de alta precisão, cards diagnósticos estruturados, linha do tempo de impacto do paciente e assistente Synapse com acabamento premium dark.
- Aprimorado o card "Como usar este treino" (`.visual-guidance`) e ilha de filtros (`.visual-filter-island`) na página de Desafios Visuais.

### Corrigido
- Corrigida a ordem dos Hooks na animação da nota do debriefing: `useAnimatedScore` foi encapsulado em um componente próprio, evitando a falha `Rendered more hooks than during the previous render` ao atualizar ou abrir diretamente a página de resultado.
- Adicionado teste de regressão para o carregamento de `/resultados/:progressoId` sem dados no estado de navegação, cobrindo a recuperação do resultado pela API.
- Corrigido o visual da tela de carregamento da avaliação clínica (`ClinicalEvaluationLoader`), aplicando o tema escuro padrão com superfície profunda translúcida, tipografia em alto contraste `#ffffff` e removendo as bolinhas flutuantes azuis do fundo.
- Corrigido o escopo do seletor `.decision-stage` em `src/styles/result-debrief.css` para `.decision-comparison .decision-stage`, eliminando a deformação horizontal e restabelecendo o layout correto dos cards de exames, hipótese e conduta na simulação clínica.
- Corrigido o hover das alternativas nos Desafios Visuais (`.visual-option:hover`), eliminando o fundo branco indesejado e garantindo destaque escuro com borda verde-lima e texto branco legível.
- Corrigido o card de explicação do diagnóstico (`.visual-answer`) e achados-chave (`.visual-findings`) nos Desafios Visuais, com fundos escuros temáticos (verde para acerto / vinho para erro) e títulos 100% nítidos.
- Corrigido o passo a passo das questões (`.questions-guidance > div`), eliminando o fundo branco sobre letras brancas e garantindo tipografia clara e legível.
- Corrigidas as alternativas e feedback de acerto/erro no Banco de Questões para evitar fundos claros legados.
- Corrigido contraste e visibilidade de caixas de texto (`input`, `textarea`, `select`) ao receberem foco (`:focus`), evitando fundo branco sobre texto claro.
- Harmonizados os fundos de menus suspensos (`.nav-dropdown-panel`) e barras de ferramentas (`.toolbar`) com as superfícies escuras oficiais (`var(--med-surface)` / `var(--med-inset)`).
- Corrigida a renderização de checkboxes (`.exam-checkbox`) na simulação clínica para contraste ideal tanto no estado desmarcado quanto marcado.
- Corrigido o fundo do campo de justificativa clínica (`.exam-rationale-section textarea`) e follow-up com a Synapse AI.
- Padronizados os filtros do Caderno de Erros, Banco de Questões, Central de Revisões e Desafios Visuais.

## 0.1.0 — 29/08/2026

### Alterado
- Ajustada a densidade do fundo animado em telas maiores.

### Corrigido
- Preservada integralmente a aparência do fundo em dispositivos móveis.
