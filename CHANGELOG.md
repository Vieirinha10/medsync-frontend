# Histórico de alterações

## Não publicado

### Adicionado
- Nova página de resultado organizada como debriefing clínico em quatro abas: Resultado, Decisões, Impacto clínico e Como evoluir.
- “Perfil da decisão clínica” triangular, com Exames, Hipótese e Conduta normalizados individualmente em percentuais para evitar distorção entre pesos de 40/30/30.
- Linha causal de impacto clínico simulado, reunindo reação imediata, consequências temporais, reavaliação de sinais vitais e desfecho em uma única sequência.
- Alerta persistente para conduta insegura, com atalho direto para a aba de impacto clínico.
- Área de Psiquiatria e Saúde Mental integrada ao catálogo, com 15 novos casos e total atualizado para 80 casos clínicos; a meta final passa de 100 para 115 casos.
- Segundo lote da expansão do catálogo, elevando o total de 60 para 65 casos clínicos.
- Primeiro lote da expansão do catálogo clínico, elevando o total publicado de 55 para 60 casos.

### Alterado
- Consolidado o feedback anteriormente distribuído em vários cards repetitivos: avaliação por etapa na aba Decisões e prioridades de melhoria, temas, fontes e perguntas à Synapse na aba Como evoluir.
- A navegação do resultado passou a usar abas acessíveis por teclado, barra fixa durante a leitura e rótulos compactos em telas pequenas.
- A comparação diagnóstica usa “referência clínica do caso” em vez de “padrão-ouro”, preservando alternativas clinicamente aceitáveis previstas pela rubrica.
- A área de perguntas à Synapse foi mantida funcional e transferida para o fechamento do debriefing, sem mudanças no contrato da API ou geração de chamadas adicionais.
- A etapa clínica de exames agora usa a expressão “avaliações e exames”, contemplando escalas psicológicas e psiquiátricas sem alterar o contrato técnico da API.
- Padronizados e unificados os fundos, gradientes, bordas e animações de órbita dos cards iniciais (heróis) de todas as abas principais (Casos Clínicos, Desafios Visuais, Questões, Central de Revisões, Trilhas e Caderno de Erros), preservando integralmente os painéis e widgets funcionais internos.
- Padronizados os cards de apresentação e filtros do Banco de Questões (`.questions-setup-card`, `.questions-performance-card`, `.questions-catalog-card`) com o padrão visual escuro translúcido das demais abas.
- Aprimorado o card do Plano Rápido de Melhoria (`.study-recommendations.is-standalone`) no resultado dos casos clínicos, com superfície escura gradiente, acento verde-lima e chips de alta legibilidade.
- Aprimorados os cards de hipótese diagnóstica e prioridades de conduta (`.clinical-core-card`) na tela de resultado do caso clínico com superfícies escuras, bordas suaves e caixas de referência clínica em alto contraste.
- Aprimorado o card "Como usar este treino" (`.visual-guidance`) e ilha de filtros (`.visual-filter-island`) na página de Desafios Visuais.

### Corrigido
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
