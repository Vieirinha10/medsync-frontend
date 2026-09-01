# Graph Report - medsync-frontend-ai-skills  (2026-09-01)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 468 nodes · 737 edges · 28 communities (23 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `11cee9dc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.jsx
- PlanosPage.jsx
- AdminFinancialCenter.jsx
- AdminAcademicPage.jsx
- HomePage.jsx
- devDependencies
- package.json
- SimulacaoCaso.jsx
- RevisoesPage.jsx
- ResultadoSimulacaoPage.jsx
- DesafiosPage.jsx
- DashboardPage.jsx
- QuestoesPage.jsx
- ChromaticWavesBackground.jsx
- InstitutionalPage.jsx
- MedSync — Diretriz Oficial para Criação de Desafios Visuais
- setup_agent_skills.py
- TrilhasPage.jsx
- HomeParticleField.jsx
- vercel.json
- Repertório de IA do MedSync — frontend
- Debriefing clínico da página de resultado
- Não publicado
- Painel administrativo de consumo da Synapse
- Instruções para agentes e colaboradores

## God Nodes (most connected - your core abstractions)
1. `api` - 38 edges
2. `MedSync — Diretriz Oficial para Criação de Desafios Visuais` - 19 edges
3. `ResultadoSimulacaoPage()` - 11 edges
4. `RevisoesPage()` - 11 edges
5. `ApiError` - 11 edges
6. `getAuthToken()` - 11 edges
7. `Repertório de IA do MedSync — frontend` - 9 edges
8. `Debriefing clínico da página de resultado` - 9 edges
9. `ChromaticWavesBackground()` - 8 edges
10. `CheckoutPage()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `AdminAcademicPage()` --calls--> `request()`  [EXTRACTED]
  src/pages/AdminAcademicPage.jsx → src/services/api.js
- `PlanosPage()` --calls--> `getAuthToken()`  [EXTRACTED]
  src/pages/PlanosPage.jsx → src/services/api.js
- `App()` --calls--> `clearAuthToken()`  [EXTRACTED]
  src/App.jsx → src/services/api.js
- `App()` --calls--> `getAuthToken()`  [EXTRACTED]
  src/App.jsx → src/services/api.js
- `AnnouncementBanner()` --calls--> `getAuthToken()`  [EXTRACTED]
  src/components/AnnouncementBanner.jsx → src/services/api.js

## Import Cycles
- None detected.

## Communities (28 total, 2 thin omitted)

### Community 0 - "App.jsx"
Cohesion: 0.06
Nodes (40): App(), CadastroPage, CadernoErrosPage, CasosListPage, LoginPage, PagamentoRetornoPage, RecuperarSenhaPage, RedefinirSenhaPage (+32 more)

### Community 1 - "PlanosPage.jsx"
Cohesion: 0.11
Nodes (24): CheckoutPage, PlanosPage, PREMIUM_ACCESS_HIGHLIGHTS, FREE_PLAN, MONTHLY_ONE_TIME_PLAN, MONTHLY_RECURRING_PLAN, PREMIUM_ANNUAL_SAVINGS, PREMIUM_BILLING_OPTIONS (+16 more)

### Community 2 - "AdminFinancialCenter.jsx"
Cohesion: 0.10
Nodes (22): AdminFinancialCenter(), downloadCsv(), escapeCsv(), FINANCIAL_TABS, FinancialRow(), FinancialSummary(), formatCurrency(), formatDate() (+14 more)

### Community 3 - "AdminAcademicPage.jsx"
Cohesion: 0.08
Nodes (12): AdminAcademicPage, AdminQuestionsManager(), emptyQuestions, STATUS_LABELS, TOPICS, AdminAcademicPage(), emptyAdminData, emptyAnnouncement (+4 more)

### Community 4 - "HomePage.jsx"
Cohesion: 0.11
Nodes (15): HomeCommunitySections(), ACADEMIC_INSTITUTIONS, HERO_SIMULATION_STEPS, MEDICAL_SPECIALTIES, SYNAPSE_PROCESS_STEPS, TRUST_PILLARS, HomeEcosystemSections(), HomeHero() (+7 more)

### Community 5 - "devDependencies"
Cohesion: 0.08
Nodes (25): eslint, eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-react-refresh, jsdom, devDependencies, eslint, eslint-plugin-react (+17 more)

### Community 6 - "package.json"
Cohesion: 0.10
Nodes (19): dependencies, react, react-dom, react-icons, react-router-dom, name, private, scripts (+11 more)

### Community 7 - "SimulacaoCaso.jsx"
Cohesion: 0.12
Nodes (8): SimulacaoCaso, ANALYSIS_STAGES, ClinicalEvaluationLoader(), createIdempotencyKey(), SimulacaoCaso(), clinicalCase, vitalIcons, workflowSteps

### Community 8 - "RevisoesPage.jsx"
Cohesion: 0.20
Nodes (17): RevisoesPage, formatDate(), getDayOffset(), getForecastLabel(), getLearningStage(), getReviewPublicTitle(), intervalLabel(), isDue() (+9 more)

### Community 9 - "ResultadoSimulacaoPage.jsx"
Cohesion: 0.18
Nodes (16): AnimatedScore(), buildExamFeedback(), ClinicalDecisionProfile(), formatScore(), friendlyEventTitle(), getPatientStatus(), getScoreProfile(), joinClinicalItems() (+8 more)

### Community 10 - "DesafiosPage.jsx"
Cohesion: 0.16
Nodes (14): DesafiosPage, enrichVisualChallenge(), EXAM_MODALITY_INFO, FALLBACK_INFO, getExamModalityInfo(), visualChallenges, DesafiosPage(), DIFFICULTY_ORDER (+6 more)

### Community 11 - "DashboardPage.jsx"
Cohesion: 0.17
Nodes (9): DashboardPage, calculateStreak(), DashboardPage(), formatDate(), getInitials(), premiumPlanLabels, cases, progress (+1 more)

### Community 12 - "QuestoesPage.jsx"
Cohesion: 0.18
Nodes (9): QuestoesPage, formatPercentage(), formatSeconds(), INITIAL_FILTERS, QuestoesPage(), REPORT_REASONS, correction, metadata (+1 more)

### Community 13 - "ChromaticWavesBackground.jsx"
Cohesion: 0.30
Nodes (11): ChromaticWavesBackground(), clamp(), createCanvas2DFallback(), createPalette(), createProgram(), HOME_WAVE_PRESETS, mapLinear(), parseColor() (+3 more)

### Community 14 - "InstitutionalPage.jsx"
Cohesion: 0.21
Nodes (8): InstitutionalPage, LegalPage, enhancedLegalPages, LEGAL_VERSION, InstitutionalPage(), LegalPage(), legalPages, pages

### Community 15 - "MedSync — Diretriz Oficial para Criação de Desafios Visuais"
Cohesion: 0.06
Nodes (32): 10. Regras para a explicação, 11. Achados-chave, 12. Regras para imagens e licenças, 13. Limites de inferência clínica, 14. Diversidade dentro do lote, 15. Proteção do gabarito, 16. Checklist de aprovação do lote, 17. Instrução pronta para outras IAs (+24 more)

### Community 16 - "setup_agent_skills.py"
Cohesion: 0.42
Nodes (9): download_local_files(), git_blob_sha1(), graphify_tool_matches(), install_local_tools(), load_lock(), main(), verify_file(), verify_local_files() (+1 more)

### Community 17 - "TrilhasPage.jsx"
Cohesion: 0.29
Nodes (7): TrilhasPage, activityUrl(), findNextActivity(), PATH_ICONS, PathCard(), path, TrilhasPage()

### Community 18 - "HomeParticleField.jsx"
Cohesion: 0.67
Nodes (3): createRandom(), HomeParticleField(), SYMBOLS

### Community 25 - "Repertório de IA do MedSync — frontend"
Cohesion: 0.14
Nodes (13): Antigravity, Configuração local, Copywriting, Fontes fixadas, Frontend Design, Graphify, Humanizer, O que está instalado (+5 more)

### Community 26 - "Debriefing clínico da página de resultado"
Cohesion: 0.20
Nodes (9): Acessibilidade e responsividade, Arquivos, Continuidade recomendada, Debriefing clínico da página de resultado, Estado da implementação, Mapeamento dos dados atuais, Objetivo, Regras de segurança e semântica (+1 more)

### Community 31 - "Não publicado"
Cohesion: 0.22
Nodes (8): 0.1.0 — 29/08/2026, Adicionado, Alterado, Alterado, Corrigido, Corrigido, Histórico de alterações, Não publicado

### Community 36 - "Painel administrativo de consumo da Synapse"
Cohesion: 0.29
Nodes (6): Arquivos envolvidos, Conteúdo apresentado, Estados e interação, Objetivo e escopo, Painel administrativo de consumo da Synapse, Publicação e verificação

## Knowledge Gaps
- **152 isolated node(s):** `10. Regras para a explicação`, `11. Achados-chave`, `12. Regras para imagens e licenças`, `13. Limites de inferência clínica`, `14. Diversidade dentro do lote` (+147 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 203 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api` connect `App.jsx` to `PlanosPage.jsx`, `AdminFinancialCenter.jsx`, `AdminAcademicPage.jsx`, `HomePage.jsx`, `SimulacaoCaso.jsx`, `RevisoesPage.jsx`, `ResultadoSimulacaoPage.jsx`, `DesafiosPage.jsx`, `DashboardPage.jsx`, `QuestoesPage.jsx`, `TrilhasPage.jsx`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Why does `ApiError` connect `App.jsx` to `AdminAcademicPage.jsx`, `SimulacaoCaso.jsx`, `RevisoesPage.jsx`, `ResultadoSimulacaoPage.jsx`, `DashboardPage.jsx`, `TrilhasPage.jsx`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `ChromaticWavesBackground()` connect `ChromaticWavesBackground.jsx` to `HomePage.jsx`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `RevisoesPage()` (e.g. with `isDue()` and `sortByNextReview()`) actually correct?**
  _`RevisoesPage()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `10. Regras para a explicação`, `11. Achados-chave`, `12. Regras para imagens e licenças` to the rest of the system?**
  _152 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06265984654731457 - nodes in this community are weakly interconnected._
- **Should `PlanosPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1053763440860215 - nodes in this community are weakly interconnected._