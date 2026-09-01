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

export const SYNAPSE_PROCESS_STEPS = [
  {
    id: 'response',
    code: '01',
    label: 'RESPOSTA CLÍNICA',
    title: 'Seu raciocínio entra por inteiro.',
    subtitle: 'A Synapse recebe decisões, não apenas um diagnóstico.',
    description:
      'Avaliações, exames solicitados, justificativas, hipótese e conduta são reunidos como partes da mesma resolução clínica.',
    signal: 'Resposta clínica registrada',
    sample: 'Hipótese, prioridades e plano de cuidado organizados para análise.',
    color: '#22c7ec',
    icon: FiFileText,
  },
  {
    id: 'context',
    code: '02',
    label: 'CONTEXTO DO CASO',
    title: 'O caso define o que realmente importa.',
    subtitle: 'História, sinais vitais e objetivos orientam a leitura.',
    description:
      'A análise considera a gravidade, o momento clínico e as informações disponíveis para distinguir escolhas pertinentes de decisões sem valor.',
    signal: 'Contexto e prioridades reconhecidos',
    sample: 'Dor, febre e sinal de Murphy tornam a investigação biliar prioritária.',
    color: '#38bdf8',
    icon: FiActivity,
  },
  {
    id: 'rubric',
    code: '03',
    label: 'RUBRICA CLÍNICA 2.0',
    title: 'A comparação segue critérios do próprio caso.',
    subtitle: 'Cada decisão é confrontada com objetivos clínicos definidos.',
    description:
      'A rubrica identifica acertos, omissões, exames de baixo valor e condutas esperadas sem reduzir o raciocínio a uma resposta única.',
    signal: 'Critérios e pesos aplicados',
    sample: 'Exames essenciais, hipótese e prioridades terapêuticas comparados.',
    color: '#6ad6f3',
    icon: FiLayers,
  },
  {
    id: 'dimensions',
    code: '04',
    label: 'TRÊS EIXOS',
    title: 'Exames, hipótese e conduta ganham leituras próprias.',
    subtitle: 'O estudante entende onde acertou e onde perdeu precisão.',
    description:
      'As três dimensões recebem notas separadas para que uma boa hipótese não esconda uma investigação incompleta ou uma conduta insegura.',
    signal: 'Avaliação dimensional concluída',
    sample: 'Exames 8,7 · Hipótese 9,2 · Conduta 7,4',
    color: '#a7f34b',
    icon: FiTarget,
  },
  {
    id: 'safety',
    code: '05',
    label: 'SEGURANÇA DO PACIENTE',
    title: 'O impacto clínico não passa despercebido.',
    subtitle: 'Omissões e condutas perigosas recebem destaque explícito.',
    description:
      'A Synapse identifica riscos, explica possíveis consequências e mostra a sequência de cuidado mais segura para o cenário apresentado.',
    signal: 'Riscos e prioridades verificados',
    sample: 'Reavaliação e critérios de deterioração devem acompanhar a conduta.',
    color: '#f6c453',
    icon: FiShield,
  },
  {
    id: 'feedback',
    code: '06',
    label: 'DEVOLUTIVA PERSONALIZADA',
    title: 'O resultado se transforma em próximo passo.',
    subtitle: 'Nota, explicação e plano de melhoria chegam organizados.',
    description:
      'O feedback final reúne o que foi bem executado, o que precisa evoluir e uma orientação prática para o próximo caso.',
    signal: 'Feedback educacional pronto',
    sample: 'Reforce a sequência estabilização, investigação dirigida e reavaliação.',
    color: '#a7f34b',
    icon: FiZap,
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
