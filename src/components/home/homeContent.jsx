import {
  FiActivity,
  FiBookOpen,
  FiCheckCircle,
  FiFileText,
  FiLayers,
  FiShield,
  FiTarget,
  FiZap,
} from 'react-icons/fi';
import {
  ClaudeLogo,
  DeepSeekLogo,
  GeminiLogo,
  GrokLogo,
  OpenAILogo,
} from './HomeModelLogos';

export const MEDICAL_SPECIALTIES = [
  'CARDIOLOGIA',
  'CIRURGIA GERAL',
  'CIRURGIA VASCULAR',
  'CLÍNICA MÉDICA',
  'DERMATOLOGIA',
  'ENDOCRINOLOGIA',
  'GASTROENTEROLOGIA',
  'GENÉTICA CLÍNICA',
  'GINECOLOGIA',
  'OBSTETRÍCIA',
  'HEMATOLOGIA',
  'HISTOPATOLOGIA',
  'INFECTOLOGIA',
  'MEDICINA DE FAMÍLIA E COMUNIDADE',
  'MEDICINA INTENSIVA',
  'ANESTESIOLOGIA',
  'MEDICINA NUCLEAR',
  'MICROBIOLOGIA',
  'NEFROLOGIA',
  'NEONATOLOGIA',
  'NEURO-OFTALMOLOGIA',
  'NEUROCIRURGIA',
  'NEUROLOGIA',
  'NUTROLOGIA',
  'OFTALMOLOGIA',
  'ONCOLOGIA',
  'ORTOPEDIA',
  'OTORRINOLARINGOLOGIA',
  'PARASITOLOGIA',
  'PEDIATRIA',
  'PNEUMOLOGIA',
  'PSIQUIATRIA E SAÚDE MENTAL',
  'QUEIMADURAS',
  'RADIOLOGIA',
  'RADIOLOGIA ABDOMINAL',
  'REUMATOLOGIA E IMUNOLOGIA',
  'TOXICOLOGIA',
  'TRAUMATOLOGIA',
  'ULTRASSONOGRAFIA',
  'URGÊNCIA E EMERGÊNCIA',
  'UROLOGIA',
];

export const MEDICAL_BOARD_EXAMINERS = [
  {
    id: 'deepseek',
    code: '01',
    model: 'DeepSeek-R1',
    org: 'DeepSeek AI',
    color: '#22c7ec',
    role: 'O Racionalista',
    tagline: 'Raciocínio causa-efeito, não aceita achismo',
    description:
      'Audita a cadeia lógica de inferência. Confronta cada queixa e sinal vital com a hipótese formulada, garantindo que não houve saltos diagnósticos ou deduções sem sustentação real.',
    verdictSample:
      'A hipótese de colecistite está bem fundamentada na dor pós-prandial e febre, mas a solicitação de tomografia inicial foi improcedente diante da indicação de ultrassom.',
    focusArea: 'Lógica e Dedutibilidade Clínica',
    logo: DeepSeekLogo,
    icon: FiActivity,
    orbitPos: { x: 170, y: 44, angle: -90 },
  },
  {
    id: 'claude',
    code: '02',
    model: 'Claude 3.5 Sonnet',
    org: 'Anthropic',
    color: '#f59e0b',
    role: 'O Professor',
    tagline: 'Didática, empatia, fisiopatologia — explica o porquê',
    description:
      'Aprofunda o mecanismo biológico de base. Traduz as decisões em aprendizado clínico sólido, explicando a relação fisiopatológica de cada acerto e mostrando com clareza a evolução esperada da doença.',
    verdictSample:
      'A dor em hipocôndrio decorre do aumento de pressão intravesicular por obstrução do ducto cístico. A antibioticoterapia venosa precoce bloqueia a translocação bacteriana.',
    focusArea: 'Fisiopatologia e Raciocínio Formativo',
    logo: ClaudeLogo,
    icon: FiFileText,
    orbitPos: { x: 284, y: 126, angle: -18 },
  },
  {
    id: 'openai',
    code: '03',
    model: 'ChatGPT (GPT-4o)',
    org: 'OpenAI',
    color: '#10a37f',
    role: 'O Avaliador Técnico',
    tagline: 'Rubricas e critérios de pontuação, como numa prova real',
    description:
      'Aplica a régua rigorosa das provas práticas (OSCE) e concursos de residência médica. Verifica checklists essenciais, pesos por conduta crítica e penalidades objetivas por omissão de cuidados.',
    verdictSample:
      'Checklist Oficial: Estabilização volêmica (100%), Solicitação de exames essenciais (100%), Parecer cirúrgico precoce (100%). Nota na rubrica: 9,4/10.',
    focusArea: 'Rubricas e Padrões de Prova Prática',
    logo: OpenAILogo,
    icon: FiTarget,
    orbitPos: { x: 240, y: 262, angle: 54 },
  },
  {
    id: 'gemini',
    code: '04',
    model: 'Gemini 2.0 Flash',
    org: 'Google',
    color: '#38bdf8',
    role: 'O Analista',
    tagline: 'Velocidade, cruzamento de dados e exames',
    description:
      'Processa em alta velocidade correlações laboratoriais, curvas de sinais vitais e achados de imagem, identificando discrepâncias sutis e garantindo sincronia perfeita entre exames e quadro clínico.',
    verdictSample:
      'Cruzamento temporal: PCR 48 mg/L associada a leucocitose com desvio à esquerda valida processo inflamatório agudo em sincronia com espessamento parietal ao USG.',
    focusArea: 'Integração Multimodal e Laboratorial',
    logo: GeminiLogo,
    icon: FiZap,
    orbitPos: { x: 100, y: 262, angle: 126 },
  },
  {
    id: 'grok',
    code: '05',
    model: 'Grok 2',
    org: 'xAI',
    color: '#f1f5f9',
    role: 'O Auditor',
    tagline: 'Segurança, diagnósticos raros, o que passaria despercebido',
    description:
      'Vigia riscos fatais ocultos e armadilhas que passariam despercebidas na rotina acelerada do pronto-socorro. Alerta para contraindicações graves, interações medicamentosas e diagnósticos atípicos.',
    verdictSample:
      'Auditoria de Segurança: A analgesia rápida não mascarou a peritonite localizada porque a indicação cirúrgica foi firmada em tempo hábil. Risco de perfuração neutralizado.',
    focusArea: 'Segurança do Paciente e Red Flags',
    logo: GrokLogo,
    icon: FiShield,
    orbitPos: { x: 56, y: 126, angle: 198 },
  },
];

export const FEEDBACK_STEPS = [
  {
    label: 'Caso clínico',
    eyebrow: '01 · CONTEXTO',
    title: 'A análise começa pelo caso completo',
    description: 'História, sinais vitais, avaliações e exames disponíveis e objetivos de aprendizagem formam o contexto da análise.',
    signal: 'Contexto clínico e objetivos do caso',
  },
  {
    label: 'Suas decisões',
    eyebrow: '02 · RACIOCÍNIO',
    title: 'Cada escolha entra na avaliação',
    description: 'Avaliações, exames, justificativas, hipótese e conduta são analisados como partes do mesmo raciocínio clínico.',
    signal: 'Decisões registradas por etapa',
  },
  {
    label: 'Rubrica clínica',
    eyebrow: '03 · CRITÉRIOS',
    title: 'A comparação segue uma estrutura clínica',
    description: 'A Synapse usa a rubrica específica do caso para reconhecer acertos, omissões e prioridades esperadas.',
    signal: 'Critérios definidos para o caso',
  },
  {
    label: 'Segurança',
    eyebrow: '04 · IMPACTO',
    title: 'O paciente continua no centro',
    description: 'A avaliação considera riscos, reação imediata e desfecho clínico das decisões tomadas durante a simulação.',
    signal: 'Consequências e segurança do paciente',
  },
  {
    label: 'Seu feedback',
    eyebrow: '05 · EVOLUÇÃO',
    title: 'O resultado vira um próximo passo',
    description: 'A resposta final organiza a nota, a explicação clínica e um plano de melhoria adequado ao desempenho.',
    signal: 'Feedback individual e plano de melhoria',
  },
];

export const REAL_TESTIMONIALS = [
  {
    initials: 'LM',
    name: 'Lucas Martins',
    role: 'Internato Médico · 11º Período',
    institution: 'UFMA',
    quote:
      'O que mais me impressionou foi a Synapse apontar exames que eu pedi por vício e esquecer a conduta de estabilização imediata. Ter esse feedback antes de entrar no plantão de emergência muda completamente a segurança.',
    tag: 'Simulação Clínica & Debriefing',
  },
  {
    initials: 'BA',
    name: 'Beatriz Albuquerque',
    role: 'Estudante de Medicina · 8º Período',
    institution: 'UFPI',
    quote:
      'Os 150 desafios visuais viraram minha rotina diária no trajeto do hospital. Interpretar ECGs e tomografias com gabarito comentado em menos de 1 minuto me fez fixar padrões que nenhuma apostila conseguia me passar.',
    tag: 'Desafios Visuais Rápidos',
  },
  {
    initials: 'RV',
    name: 'Rodrigo Vasconcelos',
    role: 'Estudante de Medicina · 6º Período',
    institution: 'CEUMA',
    quote:
      'O caderno de erros automático é genial. Em vez de acumular anotações soltas, eu sei exatamente em quais especialidades meu raciocínio falhou e o sistema agenda a revisão no dia certo antes da prova.',
    tag: 'Caderno de Erros & Retenção',
  },
];

export const TRUST_PILLARS = [
  { icon: FiLayers, title: 'Rubrica específica', text: 'Cada caso possui objetivos e critérios próprios de avaliação médica.' },
  { icon: FiBookOpen, title: 'Referências visíveis', text: 'As fontes clínicas oficiais podem ser consultadas no resultado de cada simulação.' },
  { icon: FiShield, title: 'Segurança em destaque', text: 'Condutas de risco e prioridades do cuidado recebem auditoria explícita.' },
  { icon: FiCheckCircle, title: 'Aprendizado transparente', text: 'O estudante compreende com clareza como a nota e o debriefing foram formados.' },
];

export const ACADEMIC_INSTITUTIONS = [
  {
    acronym: 'UFMA',
    name: 'Universidade Federal do Maranhão',
    state: 'MA',
    logo: '/images/institutions/ufma.png',
  },
  {
    acronym: 'CEUMA',
    name: 'Universidade CEUMA',
    state: 'MA',
    logo: '/images/institutions/ceuma.png',
  },
  {
    acronym: 'UFPI',
    name: 'Universidade Federal do Piauí',
    state: 'PI',
    logo: '/images/institutions/ufpi.png',
  },
  {
    acronym: 'UNINOVAFAPI',
    name: 'Centro Universitário Afya Teresina',
    state: 'PI',
    logo: '/images/institutions/afya-teresina.png',
  },
  {
    acronym: 'UEMA',
    name: 'Universidade Estadual do Maranhão',
    state: 'MA',
    logo: '/images/institutions/uema.png',
  },
  {
    acronym: 'UNIFACID',
    name: 'Centro Universitário UniFacid Wyden',
    state: 'PI',
  },
  {
    acronym: 'UESPI',
    name: 'Universidade Estadual do Piauí',
    state: 'PI',
    logo: '/images/institutions/uespi.png',
  },
  {
    acronym: 'UNIFSA',
    name: 'Centro Universitário Santo Agostinho',
    state: 'PI',
    logo: '/images/institutions/unifsa.png',
  },
];

export const HERO_SIMULATION_STEPS = [
  { id: 0, label: '01 · Paciente', sub: 'Apresentação' },
  { id: 1, label: '02 · Exames', sub: 'Investigação' },
  { id: 2, label: '03 · Hipótese', sub: 'Diagnóstico' },
  { id: 3, label: '04 · Conduta', sub: 'Prescrição' },
  { id: 4, label: '05 · Debriefing', sub: 'Synapse IA' },
];
