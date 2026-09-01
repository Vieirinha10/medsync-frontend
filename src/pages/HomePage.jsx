import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiActivity,
  FiArrowRight,
  FiAward,
  FiBookOpen,
  FiCheck,
  FiCheckCircle,
  FiCompass,
  FiCpu,
  FiEye,
  FiFileText,
  FiHeart,
  FiLayers,
  FiRefreshCw,
  FiShield,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from 'react-icons/fi';
import { FREE_PLAN, PREMIUM_BILLING_OPTIONS } from '../config/pricing';
import { api } from '../services/api';
import ChromaticWavesBackground from '../components/ChromaticWavesBackground';
import StatMorph from '../components/StatMorph';
import MedSyncIntro from '../components/MedSyncIntro';

const MEDICAL_SPECIALTIES = [
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

// Logos Vetoriais dos 5 Modelos de IA e Núcleo Synapse
function DeepSeekLogo({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M12 3C7.03 3 3 7.03 3 12C3 15.5 5.01 18.53 8 20L8.5 17.5C6.84 16.32 5.5 14.31 5.5 12C5.5 8.41 8.41 5.5 12 5.5C15.59 5.5 18.5 8.41 18.5 12C18.5 13.88 17.7 15.58 16.42 16.78L18.06 18.66C19.87 17.06 21 14.67 21 12C21 7.03 16.97 3 12 3Z" fill="currentColor" />
      <circle cx="12" cy="12" r="3.2" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

function ClaudeLogo({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" fill="currentColor" />
      <circle cx="12" cy="10" r="2.2" fill="#fff" opacity="0.4" />
    </svg>
  );
}

function OpenAILogo({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M12 2.5C9.5 2.5 7.4 3.9 6.4 5.9L8.2 6.9C8.9 5.5 10.3 4.5 12 4.5C14.5 4.5 16.5 6.5 16.5 9V10H14C12.3 10 11 11.3 11 13V15.5L9.2 14.5C8.5 14.1 8 13.3 8 12.5C8 10.8 9.1 9.3 10.7 8.8L9.8 6.9C7.5 7.7 6 9.9 6 12.5C6 13.8 6.7 15 7.8 15.6L11 17.5V19.5C11 20.9 12.1 22 13.5 22C14.9 22 16 20.9 16 19.5V14.5C17.5 14.2 18.5 12.9 18.5 11.4V9C18.5 5.4 15.6 2.5 12 2.5Z" fill="currentColor" />
    </svg>
  );
}

function GeminiLogo({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z" fill="currentColor" />
    </svg>
  );
}

function GrokLogo({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M4 4L18 20H20L6 4H4Z" fill="currentColor" />
      <path d="M20 4L13.5 11.5L11.5 9.5L17 4H20Z" fill="currentColor" opacity="0.85" />
      <path d="M4 20L10.5 12.5L12.5 14.5L7 20H4Z" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

const MEDICAL_BOARD_EXAMINERS = [
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

const FEEDBACK_STEPS = [
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

const REAL_TESTIMONIALS = [
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

const TRUST_PILLARS = [
  { icon: FiLayers, title: 'Rubrica específica', text: 'Cada caso possui objetivos e critérios próprios de avaliação médica.' },
  { icon: FiBookOpen, title: 'Referências visíveis', text: 'As fontes clínicas oficiais podem ser consultadas no resultado de cada simulação.' },
  { icon: FiShield, title: 'Segurança em destaque', text: 'Condutas de risco e prioridades do cuidado recebem auditoria explícita.' },
  { icon: FiCheckCircle, title: 'Aprendizado transparente', text: 'O estudante compreende com clareza como a nota e o debriefing foram formados.' },
];

const ACADEMIC_INSTITUTIONS = [
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

const HERO_SIMULATION_STEPS = [
  { id: 0, label: '01 · Paciente', sub: 'Apresentação' },
  { id: 1, label: '02 · Exames', sub: 'Investigação' },
  { id: 2, label: '03 · Hipótese', sub: 'Diagnóstico' },
  { id: 3, label: '04 · Conduta', sub: 'Prescrição' },
  { id: 4, label: '05 · Debriefing', sub: 'Synapse IA' },
];

const AcademicInstitutionCard = ({ institution }) => (
  <article className="academic-institution-card">
    <span className={`academic-institution-logo${institution.logo ? '' : ' is-wordmark'}`}>
      {institution.logo ? (
        <img src={institution.logo} alt="" loading="lazy" decoding="async" />
      ) : (
        institution.acronym
      )}
    </span>
    <span className="academic-institution-copy">
      <strong>{institution.acronym}</strong>
      <small>{institution.name}</small>
    </span>
    <span className="academic-institution-meta">{institution.state}</span>
  </article>
);

const HomePage = () => {
  const [studentCount, setStudentCount] = useState(null);
  const [activeHeroStep, setActiveHeroStep] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const [activeSynapsePillar, setActiveSynapsePillar] = useState(0);
  const scrollyStepRefs = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const observers = [];
    scrollyStepRefs.current.forEach((el, index) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSynapsePillar(index);
            }
          });
        },
        {
          root: null,
          rootMargin: '-25% 0px -35% 0px',
          threshold: 0.15,
        }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);
  const [activeFeedbackStep, setActiveFeedbackStep] = useState(0);
  const homeRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    api.getPublicStats()
      .then(({ estudantes_medsync: count }) => {
        if (isMounted && Number.isInteger(count) && count >= 0) {
          setStudentCount(count);
        }
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  // Timer automático para alternar os 5 cards da simulação a cada 5 segundos
  useEffect(() => {
    if (isHeroPaused) return undefined;

    const timer = setInterval(() => {
      setActiveHeroStep((prev) => (prev + 1) % HERO_SIMULATION_STEPS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isHeroPaused]);

  useEffect(() => {
    const root = homeRef.current;
    if (!root) return undefined;

    const sections = [...root.querySelectorAll('[data-home-reveal]')];
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      sections.forEach((section) => section.classList.add('is-visible'));
      return undefined;
    }

    root.classList.add('has-scroll-reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const formattedStudentCount = studentCount === null
    ? '—'
    : studentCount.toLocaleString('pt-BR');

  const activeExaminer = MEDICAL_BOARD_EXAMINERS[activeSynapsePillar] || MEDICAL_BOARD_EXAMINERS[0];
  const activeFeedback = FEEDBACK_STEPS[activeFeedbackStep];

  return (
    <div className="home-container home-solid" ref={homeRef}>
      <MedSyncIntro />
      <ChromaticWavesBackground />

      {/* BLOCO 1: HERO (IMPACTO & PROVOCAÇÃO COM SIMULADOR REALISTA EM 5 FASES) */}
      <section className="solid-hero" aria-label="Apresentação do MedSync">
        <div className="solid-hero-glow solid-hero-glow-one" aria-hidden="true" />
        <div className="solid-hero-glow solid-hero-glow-two" aria-hidden="true" />

        <div className="solid-hero-copy">
          <h1>
            O seu material não erra.
            <span className="hero-highlight-wrapper">
              <span className="hero-highlight-green">O seu raciocínio, às vezes sim.</span>
            </span>
          </h1>
          <p className="hero-lead-text">
            Você pode ter as melhores apostilas e resumos na estante, mas na hora de decidir na
            frente do paciente, o que está em jogo é o seu raciocínio clínico. O MedSync é onde você
            coloca suas decisões à prova antes da prática real.
          </p>
          <div className="solid-hero-actions">
            <Link to="/cadastro" className="solid-primary-button">
              Começar gratuitamente
              <FiArrowRight aria-hidden="true" />
            </Link>
            <a href="#synapse-engine" className="solid-ghost-button">
              Conhecer a Synapse IA
            </a>
          </div>
          <div className="solid-hero-proof" aria-label="Garantias da plataforma">
            <span><FiCpu aria-hidden="true" /> A capacidade das 5 maiores IAs do mercado em uma só</span>
            <span><FiLayers aria-hidden="true" /> 80 casos clínicos estruturados</span>
            <span><FiEye aria-hidden="true" /> 150 desafios visuais rápidos</span>
          </div>
        </div>

        {/* LADO DIREITO: DEMONSTRAÇÃO REAL EM 5 ETAPAS AUTÊNTICAS DA PLATAFORMA */}
        <div
          className="solid-hero-stage"
          aria-label="Demonstração interativa de um caso clínico no MedSync"
          onMouseEnter={() => setIsHeroPaused(true)}
          onMouseLeave={() => setIsHeroPaused(false)}
        >
          <div className="hero-real-case-window">
            {/* Top Bar com os 5 passos interativos */}
            <div className="real-case-tabs-bar" role="tablist" aria-label="Navegação entre as etapas da simulação">
              {HERO_SIMULATION_STEPS.map((step) => (
                <button
                  type="button"
                  role="tab"
                  key={step.id}
                  className={`real-case-step-btn${activeHeroStep === step.id ? ' is-active' : ''}`}
                  aria-selected={activeHeroStep === step.id}
                  onClick={() => setActiveHeroStep(step.id)}
                >
                  <span className="step-btn-title">{step.label}</span>
                  <div className="step-progress-indicator" />
                </button>
              ))}
            </div>

            {/* Cabeçalho do Caso */}
            <div className="real-case-subhead">
              <span className="case-specialty-badge">CIRURGIA</span>
              <span className="case-title-line">Caso #062 – Dor no hipocôndrio direito pós-prandial</span>
              <span className="case-step-counter">{String(activeHeroStep + 1).padStart(2, '0')}/05</span>
            </div>

            {/* CONTEÚDOS DAS 5 TELAS REAIS */}
            <div className="real-case-stage-screen" aria-live="polite">
              {/* TELA 1: APRESENTAÇÃO DO PACIENTE */}
              {activeHeroStep === 0 && (
                <div className="case-screen-view screen-paciente">
                  <div className="screen-section-header">
                    <small>01 · APRESENTAÇÃO DO PACIENTE</small>
                    <h3>Antes de decidir, observe.</h3>
                    <p>Leia o prontuário com calma e identifique os achados que mudam a prioridade clínica.</p>
                  </div>

                  <div className="patient-cards-dual">
                    <div className="patient-dual-card">
                      <div className="card-mini-title"><FiFileText /> Queixa e contexto</div>
                      <p>VRS, 44 anos, feminina, relata dor contínua no hipocôndrio direito há 18h após refeição gordurosa, com náuseas e vômitos. Nega icterícia.</p>
                    </div>
                    <div className="patient-dual-card">
                      <div className="card-mini-title"><FiUsers /> Achados ao exame físico</div>
                      <p>REG, desidratada +/4+. PA 118/74, FC 102 bpm, SpO2 98%, Tax 38.1 ºC. Dor e defesa no hipocôndrio direito com <strong>sinal de Murphy positivo</strong>.</p>
                    </div>
                  </div>

                  <div className="vitals-grid-mini">
                    <div className="vital-mini-card is-normal">
                      <div className="vital-mini-top">
                        <small>Pressão arterial</small>
                        <span className="vital-badge is-normal"><i /> Normal</span>
                      </div>
                      <div className="vital-mini-val">
                        <strong>118/74</strong> <span>mmHg</span>
                      </div>
                    </div>

                    <div className="vital-mini-card is-alert">
                      <div className="vital-mini-top">
                        <small>Freq. cardíaca</small>
                        <span className="vital-badge is-alert"><i /> Alterado</span>
                      </div>
                      <div className="vital-mini-val is-alert-text">
                        <strong>102</strong> <span>bpm</span>
                      </div>
                    </div>

                    <div className="vital-mini-card is-normal">
                      <div className="vital-mini-top">
                        <small>Saturação O2</small>
                        <span className="vital-badge is-normal"><i /> Normal</span>
                      </div>
                      <div className="vital-mini-val">
                        <strong>98</strong> <span>%</span>
                      </div>
                    </div>

                    <div className="vital-mini-card is-alert">
                      <div className="vital-mini-top">
                        <small>Temperatura</small>
                        <span className="vital-badge is-alert"><i /> Alterado</span>
                      </div>
                      <div className="vital-mini-val is-alert-text">
                        <strong>38.1</strong> <span>ºC</span>
                      </div>
                    </div>
                  </div>

                  <div className="screen-footer-actions">
                    <span className="selected-count-pill"><FiCheck /> Prontuário analisado</span>
                    <button type="button" className="screen-btn-primary" onClick={() => setActiveHeroStep(1)}>
                      Iniciar investigação <FiArrowRight />
                    </button>
                  </div>
                </div>
              )}

              {/* TELA 2: INVESTIGAÇÃO DE EXAMES */}
              {activeHeroStep === 1 && (
                <div className="case-screen-view screen-exames">
                  <div className="screen-section-header">
                    <small>02 · INVESTIGAÇÃO</small>
                    <h3>Quais avaliações e exames mudariam sua decisão?</h3>
                    <p>Escolha com intenção. Exames essenciais, omitidos e de baixo valor são auditados no feedback.</p>
                  </div>

                  <div className="exam-selection-grid">
                    <div className="exam-option-card is-selected">
                      <span className="exam-check-icon"><FiCheck /></span>
                      <div>
                        <strong>Ultrassonografia de abdome total</strong>
                        <small>Cálculo impactado no infundíbulo, parede 5mm</small>
                      </div>
                    </div>
                    <div className="exam-option-card is-selected">
                      <span className="exam-check-icon"><FiCheck /></span>
                      <div>
                        <strong>Hemograma completo</strong>
                        <small>Leucócitos: 15.400/mm³ com 8% bastões</small>
                      </div>
                    </div>
                    <div className="exam-option-card is-selected">
                      <span className="exam-check-icon"><FiCheck /></span>
                      <div>
                        <strong>Bilirrubinas e PCR</strong>
                        <small>PCR 48 mg/L · BT 1.0 (Normal)</small>
                      </div>
                    </div>
                    <div className="exam-option-card">
                      <span className="exam-check-icon is-empty" />
                      <div>
                        <strong>Tomografia de abdome</strong>
                        <small>Não indicada neste momento inicial</small>
                      </div>
                    </div>
                  </div>

                  <div className="screen-footer-actions">
                    <span className="selected-count-pill"><FiCheck /> 3 avaliações solicitadas</span>
                    <button type="button" className="screen-btn-primary" onClick={() => setActiveHeroStep(2)}>
                      Avançar para hipótese <FiArrowRight />
                    </button>
                  </div>
                </div>
              )}

              {/* TELA 3: HIPÓTESE DIAGNÓSTICA */}
              {activeHeroStep === 2 && (
                <div className="case-screen-view screen-hipotese">
                  <div className="screen-section-header">
                    <small>03 · SÍNTESE DIAGNÓSTICA</small>
                    <h3>Qual é a sua hipótese diagnóstica?</h3>
                    <p>Registre a hipótese principal, diferenciais relevantes e os achados que sustentam sua decisão.</p>
                  </div>

                  <div className="guidance-badges-row" aria-label="Tópicos de orientação para a hipótese">
                    <span className="guidance-badge">1 Hipótese principal</span>
                    <span className="guidance-badge">2 Diferenciais relevantes</span>
                    <span className="guidance-badge">3 Achados que sustentam</span>
                  </div>

                  <div className="textarea-field-wrapper">
                    <small className="field-label-text">Seu raciocínio diagnóstico</small>
                    <div className="real-textarea-mock">
                      <p>Minha principal hipótese é <strong>Colecistite Aguda Litiásica</strong>, sustentada pela dor em hipocôndrio direito pós-prandial, febre, sinal de Murphy positivo e cálculo com espessamento da vesícula no ultrassom.</p>
                    </div>
                  </div>

                  <div className="screen-footer-actions">
                    <span className="selected-count-pill"><FiFileText /> Raciocínio registrado</span>
                    <button type="button" className="screen-btn-primary" onClick={() => setActiveHeroStep(3)}>
                      Avançar para conduta <FiArrowRight />
                    </button>
                  </div>
                </div>
              )}

              {/* TELA 4: PLANO DE CONDUTA */}
              {activeHeroStep === 3 && (
                <div className="case-screen-view screen-conduta">
                  <div className="screen-section-header">
                    <small>04 · PLANO DE CUIDADO</small>
                    <h3>O que você faria por este paciente agora?</h3>
                    <p>Defina prioridades, medidas imediatas, tratamento, monitorização e critérios de reavaliação.</p>
                  </div>

                  <div className="guidance-badges-row" aria-label="Tópicos de orientação para a conduta">
                    <span className="guidance-badge">1 Estabilização e prioridades</span>
                    <span className="guidance-badge">2 Tratamento proposto</span>
                    <span className="guidance-badge">3 Monitorização e reavaliação</span>
                  </div>

                  <div className="textarea-field-wrapper">
                    <small className="field-label-text">Sua conduta inicial</small>
                    <div className="real-textarea-mock">
                      <p>Jejum absoluto e hidratação venosa vigorosa. Analgesia IV, antibioticoterapia precoce (Ceftriaxona + Metronidazol) e parecer cirúrgico imediato para Colecistectomia Videolaparoscópica precoce.</p>
                    </div>
                  </div>

                  <div className="synapse-audit-banner">
                    <FiActivity aria-hidden="true" />
                    <div className="audit-banner-copy">
                      <strong>A Synapse analisará sua decisão</strong>
                      <small>O feedback comparará hipótese e conduta com a rubrica clínica revisada e simulará a resposta esperada do paciente.</small>
                    </div>
                    <button type="button" className="screen-btn-primary is-green" onClick={() => setActiveHeroStep(4)}>
                      Avaliar <FiArrowRight />
                    </button>
                  </div>
                </div>
              )}

              {/* TELA 5: DEBRIEFING & RESULTADO DA SYNAPSE (IDÊNTICO À PLATAFORMA) */}
              {activeHeroStep === 4 && (
                <div className="case-screen-view screen-debriefing-real">
                  <div className="debriefing-subtabs-bar">
                    <span className="subtab-item is-active"><FiActivity /> Resultado</span>
                    <span className="subtab-item"><FiFileText /> Decisões</span>
                    <span className="subtab-item"><FiHeart /> Impacto clínico</span>
                    <span className="subtab-item"><FiTrendingUp /> Como evoluir</span>
                  </div>

                  <div className="debriefing-real-grid">
                    {/* Coluna Esquerda: Score e Radar Triangular */}
                    <div className="debriefing-left-box">
                      <div className="debriefing-score-hero">
                        <small className="nota-geral-tag">NOTA GERAL</small>
                        <div className="big-score-number">
                          <strong>9,4</strong> <span>/10</span>
                        </div>
                        <h4>Conduta consistente e segura</h4>
                        <p>O resultado demonstra precisão no raciocínio e segurança na decisão terapêutica.</p>
                      </div>

                      <div className="debriefing-radar-wrapper">
                        <div className="radar-svg-container">
                          <svg viewBox="0 0 160 140" className="clinical-radar-svg" aria-hidden="true">
                            <polygon points="80,15 145,120 15,120" fill="none" stroke="rgba(162, 209, 231, 0.15)" strokeWidth="1" />
                            <polygon points="80,45 125,115 35,115" fill="none" stroke="rgba(162, 209, 231, 0.12)" strokeWidth="1" />
                            <polygon points="80,75 105,110 55,110" fill="none" stroke="rgba(162, 209, 231, 0.08)" strokeWidth="1" />
                            
                            <line x1="80" y1="80" x2="80" y2="15" stroke="rgba(162, 209, 231, 0.18)" strokeWidth="1" strokeDasharray="2,2" />
                            <line x1="80" y1="80" x2="145" y2="120" stroke="rgba(162, 209, 231, 0.18)" strokeWidth="1" strokeDasharray="2,2" />
                            <line x1="80" y1="80" x2="15" y2="120" stroke="rgba(162, 209, 231, 0.18)" strokeWidth="1" strokeDasharray="2,2" />

                            <polygon points="80,18 140,118 20,118" fill="rgba(167, 243, 75, 0.22)" stroke="#a7f34b" strokeWidth="2" />
                            <circle cx="80" cy="18" r="3.5" fill="#a7f34b" />
                            <circle cx="140" cy="118" r="3.5" fill="#a7f34b" />
                            <circle cx="20" cy="118" r="3.5" fill="#a7f34b" />

                            <text x="80" y="9" textAnchor="middle" fill="#dcecf2" fontSize="7.5" fontFamily="Poppins" fontWeight="600">Exames</text>
                            <text x="145" y="132" textAnchor="middle" fill="#dcecf2" fontSize="7.5" fontFamily="Poppins" fontWeight="600">Hipótese</text>
                            <text x="15" y="132" textAnchor="middle" fill="#dcecf2" fontSize="7.5" fontFamily="Poppins" fontWeight="600">Conduta</text>
                          </svg>
                        </div>

                        <div className="radar-bars-column">
                          <div className="radar-mini-bar-item">
                            <div className="radar-bar-top">
                              <small>Exames</small> <strong>100%</strong>
                            </div>
                            <div className="radar-bar-track"><div className="radar-bar-fill is-green" style={{ width: '100%' }} /></div>
                          </div>
                          <div className="radar-mini-bar-item">
                            <div className="radar-bar-top">
                              <small>Hipótese</small> <strong>95%</strong>
                            </div>
                            <div className="radar-bar-track"><div className="radar-bar-fill is-green" style={{ width: '95%' }} /></div>
                          </div>
                          <div className="radar-mini-bar-item">
                            <div className="radar-bar-top">
                              <small>Conduta</small> <strong>92%</strong>
                            </div>
                            <div className="radar-bar-track"><div className="radar-bar-fill is-green" style={{ width: '92%' }} /></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Coluna Direita: Cards de Feedback da Rubrica */}
                    <div className="debriefing-right-feedbacks">
                      <div className="feedback-eval-card is-exames">
                        <div className="eval-card-header">
                          <span className="eval-icon-label"><FiActivity /> Exames</span>
                          <strong className="eval-score-pct">100%</strong>
                        </div>
                        <p>Você selecionou perfeitamente os exames essenciais: <strong>Ultrassonografia</strong>, <strong>Hemograma</strong> e <strong>PCR</strong>, sem solicitações desnecessárias.</p>
                      </div>

                      <div className="feedback-eval-card is-hipotese">
                        <div className="eval-card-header">
                          <span className="eval-icon-label"><FiTarget /> Hipótese</span>
                          <strong className="eval-score-pct">95%</strong>
                        </div>
                        <p>A hipótese de <strong>Colecistite Aguda</strong> está plenamente fundamentada no sinal de Murphy positivo, febre e espessamento de parede vesicular ao USG.</p>
                      </div>

                      <div className="feedback-eval-card is-conduta">
                        <div className="eval-card-header">
                          <span className="eval-icon-label"><FiHeart /> Conduta</span>
                          <strong className="eval-score-pct">92%</strong>
                        </div>
                        <p>Conduta ágil com analgesia adequada, início precoce de antibioticoterapia venosa e encaminhamento cirúrgico videolaparoscópico.</p>
                      </div>
                    </div>
                  </div>

                  <div className="debriefing-footer-action">
                    <Link to="/cadastro" className="screen-btn-primary is-full-cta">
                      Entender minhas decisões <FiArrowRight />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* BLOCO 2: DIVISOR CONECTOR — ESTEIRA DE ESPECIALIDADES */}
      <section className="specialty-marquee-section" aria-label="Especialidades médicas disponíveis">
        <div className="specialty-marquee-track">
          {[...MEDICAL_SPECIALTIES, ...MEDICAL_SPECIALTIES].map((spec, index) => (
            <span className="specialty-marquee-item" key={`spec-${spec}-${index}`}>
              <strong>{spec}</strong>
              <span className="specialty-divider">/</span>
            </span>
          ))}
        </div>
      </section>

      {/* BLOCO 3: SYNAPSE IA · A BANCA MÉDICA (ARENA ORBITAL DOS 5 MODELOS DE IA) */}
      <section id="synapse-engine" className="home-synapse-section home-reveal" data-home-reveal aria-labelledby="synapse-home-title">
        <header className="solid-section-heading home-synapse-heading">
          <span className="section-eyebrow-tag">
            <FiCpu aria-hidden="true" />
            ARQUITETURA MULTI-LLM · O CONCEITO DA BANCA MÉDICA
          </span>
          <h2 id="synapse-home-title">
            Synapse IA, a inteligência educativa do MedSync.<br />
            <span className="fluid-words-green">Consenso clínico alimentado por 5 redes neurais.</span>
          </h2>
          <p>
            Toda banca de verdade tem mais de um examinador, porque ninguém quer aprovar alguém com base numa opinião só. A Synapse aplica essa mesma lógica: 5 especialistas analisam sua conduta ao mesmo tempo, cada um de um ângulo diferente, até chegar num consenso. Não é uma IA te dando nota — é uma banca inteira concordando com seu raciocínio.
          </p>
        </header>

        {/* Barra Superior com os 5 Símbolos Oficiais das IAs */}
        <div className="banca-ai-logos-track" aria-label="Seleção rápida dos modelos de IA">
          {MEDICAL_BOARD_EXAMINERS.map((ex, idx) => {
            const LogoComponent = ex.logo;
            const isCurrent = activeSynapsePillar === idx;
            return (
              <button
                type="button"
                key={`logo-bar-${ex.id}`}
                className={`ai-logo-btn${isCurrent ? ' is-active' : ''}`}
                onClick={() => setActiveSynapsePillar(idx)}
                style={{ '--brand-color': ex.color }}
              >
                <div className="ai-logo-icon-wrap">
                  <LogoComponent className="ai-brand-svg" />
                </div>
                <div className="ai-logo-meta">
                  <strong>{ex.model}</strong>
                  <small>{ex.role}</small>
                </div>
              </button>
            );
          })}
          <button
            type="button"
            className={`ai-logo-btn is-consensus-btn${activeSynapsePillar === 5 ? ' is-active' : ''}`}
            onClick={() => setActiveSynapsePillar(5)}
          >
            <div className="ai-logo-icon-wrap is-synapse-glow">
              <FiZap className="ai-brand-svg" />
            </div>
            <div className="ai-logo-meta">
              <strong>Synapse Core</strong>
              <small>Consenso Total</small>
            </div>
          </button>
        </div>

        <div className="synapse-scrolly-container">
          {/* Coluna Esquerda: A Sequência dos 5 Examinadores */}
          <div className="scrolly-story-stream" role="tablist" aria-label="Examinadores da Banca Médica Synapse">
            <div className="scrolly-neural-rail" aria-hidden="true">
              <div 
                className="scrolly-neural-fill" 
                style={{ height: `${((Math.min(activeSynapsePillar, 4) + 1) / 5) * 100}%` }}
              />
            </div>

            {MEDICAL_BOARD_EXAMINERS.map((examiner, index) => {
              const LogoComponent = examiner.logo;
              const isActive = activeSynapsePillar === index;

              return (
                <div
                  key={examiner.id}
                  ref={(el) => (scrollyStepRefs.current[index] = el)}
                  role="tab"
                  tabIndex={0}
                  aria-selected={isActive}
                  className={`scrolly-story-step${isActive ? ' is-active' : ''}`}
                  onClick={() => setActiveSynapsePillar(index)}
                  style={{ '--brand-color': examiner.color }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveSynapsePillar(index);
                    }
                  }}
                >
                  <div className="story-step-indicator">
                    <span className="step-node-dot" style={{ color: examiner.color, borderColor: examiner.color }}>
                      <LogoComponent />
                    </span>
                    <span className="step-number-tag">EXAMINADOR {examiner.code}</span>
                    <span className="examiner-model-chip" style={{ color: examiner.color, borderColor: examiner.color, background: `${examiner.color}18` }}>
                      {examiner.model}
                    </span>
                  </div>

                  <div className="story-step-body">
                    <h3 className="story-step-title">{examiner.role}</h3>
                    <p className="story-step-subtitle">{examiner.tagline}</p>
                    <p className="story-step-desc">{examiner.description}</p>
                    
                    <div className="examiner-verdict-preview" style={{ borderLeftColor: examiner.color }}>
                      <small className="verdict-label" style={{ color: examiner.color }}><FiCheckCircle /> Parecer em tempo real:</small>
                      <p>"{examiner.verdictSample}"</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 6ª Etapa Narrativa: O Consenso Unânime da Synapse */}
            <div
              ref={(el) => (scrollyStepRefs.current[5] = el)}
              role="tab"
              tabIndex={0}
              aria-selected={activeSynapsePillar === 5}
              className={`scrolly-story-step is-consensus-step${activeSynapsePillar === 5 ? ' is-active' : ''}`}
              onClick={() => setActiveSynapsePillar(5)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveSynapsePillar(5);
                }
              }}
            >
              <div className="story-step-indicator">
                <span className="step-node-dot is-core-dot">
                  <FiZap />
                </span>
                <span className="step-number-tag">CONSENSO INTEGRAL</span>
                <span className="examiner-model-chip is-green">5 IA's Alinhadas</span>
              </div>

              <div className="story-step-body">
                <h3 className="story-step-title">O Veredito Final da Banca</h3>
                <p className="story-step-subtitle">As 5 mentes artificiais convergindo na sua conduta</p>
                <p className="story-step-desc">
                  Nenhum modelo decide sozinho. Apenas quando DeepSeek, Claude, ChatGPT, Gemini e Grok validam conjuntamente o seu plano, o debriefing é emitido com nota e plano de melhoria.
                </p>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Arena de Convergência Orbital Sticky */}
          <div className="scrolly-sticky-wrapper">
            <article className="scrolly-sticky-terminal orbital-consensus-terminal" aria-live="polite">
              <div className="terminal-header">
                <div className="terminal-live-badge">
                  <span className="live-pulse-dot" />
                  <strong>CONVERGÊNCIA NEURAL MULTI-LLM</strong>
                </div>
                <div className="terminal-progress-badge">
                  {activeSynapsePillar < 5 ? (
                    <><span>{activeExaminer.code}</span> / 05</>
                  ) : (
                    <span className="consensus-ready-badge">CONSENSO UNÂNIME</span>
                  )}
                </div>
              </div>

              {/* Arena Visual SVG: Órbita com Feixes de Luz Laser em Direção ao Núcleo */}
              <div className="neural-orbit-arena">
                <svg viewBox="0 0 340 340" className="neural-orbit-svg" aria-hidden="true">
                  <defs>
                    {/* Gradientes dos Feixes de Luz para cada IA */}
                    <linearGradient id="beam-deepseek" x1="170" y1="44" x2="170" y2="170" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#22c7ec" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#a7f34b" stopOpacity="0.3" />
                    </linearGradient>
                    <linearGradient id="beam-claude" x1="284" y1="126" x2="170" y2="170" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#a7f34b" stopOpacity="0.3" />
                    </linearGradient>
                    <linearGradient id="beam-openai" x1="240" y1="262" x2="170" y2="170" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#10a37f" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#a7f34b" stopOpacity="0.3" />
                    </linearGradient>
                    <linearGradient id="beam-gemini" x1="100" y1="262" x2="170" y2="170" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#a7f34b" stopOpacity="0.3" />
                    </linearGradient>
                    <linearGradient id="beam-grok" x1="56" y1="126" x2="170" y2="170" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#f1f5f9" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#a7f34b" stopOpacity="0.3" />
                    </linearGradient>

                    {/* Brilho Radial do Núcleo Synapse */}
                    <radialGradient id="core-glow-grad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#a7f34b" stopOpacity="0.4" />
                      <stop offset="70%" stopColor="#22c7ec" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#04273d" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Círculos da Órbita */}
                  <circle cx="170" cy="170" r="126" fill="none" stroke="rgba(162, 209, 231, 0.12)" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="170" cy="170" r="80" fill="none" stroke="rgba(162, 209, 231, 0.08)" strokeWidth="1" />
                  <circle cx="170" cy="170" r="60" fill="url(#core-glow-grad)" />

                  {/* Feixes de Energia (Laser Beams) conectando as IAs ao Núcleo */}
                  {MEDICAL_BOARD_EXAMINERS.map((ex, idx) => {
                    const isFiring = activeSynapsePillar === idx || activeSynapsePillar === 5;
                    const beamId = `beam-${ex.id}`;

                    return (
                      <g key={`beam-group-${ex.id}`} className={`energy-beam-group${isFiring ? ' is-firing' : ''}`}>
                        {/* Linha de Feixe de Luz */}
                        <line
                          x1={ex.orbitPos.x}
                          y1={ex.orbitPos.y}
                          x2="170"
                          y2="170"
                          stroke={`url(#${beamId})`}
                          strokeWidth={isFiring ? (activeSynapsePillar === 5 ? "3" : "2.5") : "1"}
                          strokeDasharray={isFiring ? "4 2" : "2 6"}
                          className={`energy-beam-line${isFiring ? ' beam-pulse-anim' : ''}`}
                        />
                        {/* Ponto de Partícula de Energia */}
                        {isFiring && (
                          <circle
                            cx={(ex.orbitPos.x + 170) / 2}
                            cy={(ex.orbitPos.y + 170) / 2}
                            r="2.5"
                            fill={ex.color}
                            className="particle-glow-dot"
                          />
                        )}
                      </g>
                    );
                  })}

                  {/* Núcleo Central Synapse IA */}
                  <g className="synapse-central-core">
                    <circle cx="170" cy="170" r="32" fill="#031a2a" stroke={activeSynapsePillar === 5 ? "#a7f34b" : "rgba(34, 199, 236, 0.6)"} strokeWidth="2" className="core-circle" />
                    <circle cx="170" cy="170" r="26" fill="rgba(8, 127, 224, 0.15)" />
                    <text x="170" y="166" textAnchor="middle" fill="#fff" fontSize="8" fontFamily="Poppins" fontWeight="800" letterSpacing="0.06em">SYNAPSE</text>
                    <text x="170" y="177" textAnchor="middle" fill="#a7f34b" fontSize="6.5" fontFamily="Poppins" fontWeight="700">5-CORE</text>
                  </g>

                  {/* Os 5 Nós Satélites da Órbita */}
                  {MEDICAL_BOARD_EXAMINERS.map((ex, idx) => {
                    const isFocus = activeSynapsePillar === idx || activeSynapsePillar === 5;
                    const LogoComponent = ex.logo;

                    return (
                      <g
                        key={`orbit-node-${ex.id}`}
                        className={`orbit-node-group${isFocus ? ' is-focused' : ''}`}
                        transform={`translate(${ex.orbitPos.x}, ${ex.orbitPos.y})`}
                        onClick={() => setActiveSynapsePillar(idx)}
                        style={{ cursor: 'pointer' }}
                      >
                        {/* Glow de fundo */}
                        {isFocus && (
                          <circle cx="0" cy="0" r="20" fill={ex.color} opacity="0.25" className="node-glow-ring" />
                        )}
                        <circle
                          cx="0"
                          cy="0"
                          r="15"
                          fill="#031a2a"
                          stroke={isFocus ? ex.color : "rgba(162, 209, 231, 0.25)"}
                          strokeWidth={isFocus ? "2" : "1"}
                        />
                        {/* Ícone da IA */}
                        <g transform="translate(-8, -8)" style={{ color: isFocus ? ex.color : "#9cb8c9" }}>
                          <foreignObject width="16" height="16">
                            <LogoComponent style={{ width: '16px', height: '16px' }} />
                          </foreignObject>
                        </g>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Informações Dinâmicas do Parecer / Consenso */}
              <div className="terminal-body" key={`examiner-view-${activeSynapsePillar}`}>
                {activeSynapsePillar < 5 ? (
                  <>
                    <div className="examiner-spotlight-header">
                      <div className="examiner-role-badge" style={{ color: activeExaminer.color }}>
                        <FiAward aria-hidden="true" />
                        <span>{activeExaminer.role} · {activeExaminer.model}</span>
                      </div>
                      <span className="examiner-org-tag">{activeExaminer.org}</span>
                    </div>

                    <h3 className="terminal-pillar-title">{activeExaminer.tagline}</h3>

                    <div className="terminal-audit-box is-banca-verdict" style={{ borderColor: `${activeExaminer.color}60` }}>
                      <div className="audit-box-top" style={{ color: activeExaminer.color }}>
                        <FiCheckCircle aria-hidden="true" />
                        <strong>PARECER CLÍNICO DESTE EXAMINADOR</strong>
                      </div>
                      <p><strong>"{activeExaminer.verdictSample}"</strong></p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="examiner-spotlight-header">
                      <div className="examiner-role-badge" style={{ color: '#a7f34b' }}>
                        <FiCheckCircle aria-hidden="true" />
                        <span>CONSENSO UNÂNIME CONSOLIDADO</span>
                      </div>
                      <span className="examiner-org-tag">5 Modelos Sincronizados</span>
                    </div>

                    <h3 className="terminal-pillar-title">5 IAs avaliando simultaneamente o seu raciocínio</h3>

                    <div className="terminal-audit-box is-banca-verdict" style={{ borderColor: 'rgba(167, 243, 75, 0.5)' }}>
                      <div className="audit-box-top" style={{ color: '#a7f34b' }}>
                        <FiZap aria-hidden="true" />
                        <strong>RESULTADO DO CONSENSO</strong>
                      </div>
                      <p><strong>O que sobra no debriefing não é a opinião de uma IA genérica — é o que 5 examinadores especializados concordaram ser a melhor prática médica para este paciente.</strong></p>
                    </div>
                  </>
                )}

                <div className="banca-consensus-banner">
                  <div className="consensus-banner-left">
                    <FiShield aria-hidden="true" />
                    <div>
                      <strong>Deliberação e Consenso Final</strong>
                      <small>Sua nota e feedback são gerados quando os 5 examinadores concordam com o plano de cuidado.</small>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* BLOCO 4: ESTRUTURA DO FEEDBACK (CONSOLE DE ETAPAS) */}
      <section className="home-feedback-system home-reveal" data-home-reveal aria-labelledby="feedback-system-title">
        <div className="feedback-system-intro">
          <span className="section-eyebrow-tag">
            <FiLayers aria-hidden="true" />
            CRITÉRIOS CLÍNICOS ESTRUTURADOS
          </span>
          <h2 id="feedback-system-title">Existe uma estrutura por trás de cada análise.</h2>
          <p>
            Explore as etapas para compreender como a resolução do estudante se transforma em um
            debriefing clínico organizado, compreensível e útil para o próximo caso.
          </p>
        </div>

        <div className="feedback-system-console">
          <div className="feedback-step-tabs" role="tablist" aria-label="Etapas da análise da Synapse">
            {FEEDBACK_STEPS.map((step, index) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeFeedbackStep === index}
                aria-controls="feedback-step-panel"
                className={activeFeedbackStep === index ? 'is-active' : ''}
                key={step.label}
                onClick={() => setActiveFeedbackStep(index)}
                onMouseEnter={() => setActiveFeedbackStep(index)}
                onFocus={() => setActiveFeedbackStep(index)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{step.label}</strong>
                <i aria-hidden="true" />
              </button>
            ))}
          </div>

          <article className="feedback-step-panel" id="feedback-step-panel" role="tabpanel" aria-live="polite">
            <div className="feedback-panel-status"><i /> SYNAPSE · ANÁLISE ESTRUTURADA</div>
            <small>{activeFeedback.eyebrow}</small>
            <h3>{activeFeedback.title}</h3>
            <p>{activeFeedback.description}</p>
            <div className="feedback-signal">
              <span><FiActivity aria-hidden="true" /></span>
              <div><small>SINAL PROCESSADO</small><strong>{activeFeedback.signal}</strong></div>
              <FiCheckCircle aria-hidden="true" />
            </div>
          </article>
        </div>
      </section>

      {/* BLOCO 5: PROVA OBJETIVA & COMUNIDADE ACADÊMICA */}
      <section className="solid-proof-morph" aria-label="Números do MedSync">
        <StatMorph
          items={[
            { value: '80', label: 'casos clínicos' },
            { value: '150', label: 'desafios visuais' },
            { value: formattedStudentCount, label: 'estudantes MedSync' },
            { value: '19', label: 'áreas médicas contempladas' },
          ]}
        />
      </section>

      {/* BLOCO 6: DEPOIMENTOS REAIS DE ESTUDANTES */}
      <section className="home-testimonials-section home-reveal" data-home-reveal aria-labelledby="testimonials-title">
        <header className="solid-section-heading">
          <span className="section-eyebrow-tag">
            <FiUsers aria-hidden="true" />
            EXPERIÊNCIA REAL DE ESTUDANTES
          </span>
          <h2 id="testimonials-title">Quem pratica no MedSync sente a diferença no plantão.</h2>
          <p>Relatos de estudantes e internos que utilizam a plataforma como laboratório de decisão médica.</p>
        </header>

        <div className="testimonials-grid">
          {REAL_TESTIMONIALS.map((testimonial) => (
            <article className="testimonial-card" key={testimonial.name}>
              <div className="testimonial-header">
                <span className="testimonial-avatar">{testimonial.initials}</span>
                <div>
                  <strong>{testimonial.name}</strong>
                  <small>{testimonial.role} · {testimonial.institution}</small>
                </div>
              </div>
              <p className="testimonial-quote">“{testimonial.quote}”</p>
              <div className="testimonial-footer">
                <span className="testimonial-tag">{testimonial.tag}</span>
                <span className="testimonial-verified"><FiCheck /> Aluno verificado</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* BLOCO 7: REDE ACADÊMICA */}
      <section className="home-academic-network home-reveal" data-home-reveal aria-labelledby="academic-network-title">
        <div className="academic-network-heading">
          <span className="section-eyebrow-tag">
            <FiBookOpen aria-hidden="true" />
            ORIGEM DOS ESTUDANTES
          </span>
          <h2 id="academic-network-title">Uma comunidade médica em formação.</h2>
          <p>
            Estudantes de diversas instituições encontram no MedSync um espaço comum para
            praticar raciocínio clínico e transformar estudo em decisão.
          </p>
        </div>

        <p className="academic-network-accessible-list">
          Instituições representadas: {ACADEMIC_INSTITUTIONS.map(({ acronym }) => acronym).join(', ')}.
        </p>

        <div className="academic-network-stage" aria-hidden="true">
          <div className="academic-marquee-row">
            <div className="academic-marquee-track">
              {[...ACADEMIC_INSTITUTIONS, ...ACADEMIC_INSTITUTIONS].map((institution, index) => (
                <AcademicInstitutionCard institution={institution} key={`forward-${institution.acronym}-${index}`} />
              ))}
            </div>
          </div>
        </div>

        <p className="academic-network-disclaimer">
          <FiShield aria-hidden="true" />
          <span>A exibição indica a origem acadêmica de usuários cadastrados e não representa vínculo ou parceria institucional.</span>
        </p>
      </section>

      {/* BLOCO 8: O ECOSSISTEMA COMPLETO (DESAFIOS VISUAIS & QUESTÕES) */}
      <section className="solid-features home-reveal" data-home-reveal aria-labelledby="ecosystem-title">
        <header className="solid-section-heading">
          <span className="section-eyebrow-tag">
            <FiEye aria-hidden="true" />
            ALÉM DAS SIMULAÇÕES · ECOSSISTEMA COMPLETO
          </span>
          <h2 id="ecosystem-title">Ferramentas construídas para a prática médica contínua.</h2>
          <p>Pratique casos, treine diagnósticos por imagem e consolide o aprendizado em um só lugar.</p>
        </header>

        <div className="solid-feature-grid">
          <article className="solid-feature-card is-wide is-blue">
            <span className="solid-feature-icon"><FiActivity /></span>
            <small>SIMULAÇÃO CLÍNICA VIVA</small>
            <h3>Casos reais que exigem decisão, não apenas memória.</h3>
            <p>Analise a queixa, solicite exames, elabore hipóteses e prescreva condutas sem receber spoilers diagnósticos.</p>
            <Link to="/casos">Conhecer os 80 casos <FiArrowRight /></Link>
            <span className="solid-card-number">01</span>
          </article>

          <article className="solid-feature-card is-light">
            <span className="solid-feature-icon"><FiEye /></span>
            <small>150 DESAFIOS VISUAIS</small>
            <h3>Interprete imagens em menos de 1 minuto.</h3>
            <p>Treine o olho clínico em ECGs, radiografias, tomografias e lesões dermatológicas com explicação imediata.</p>
            <Link to="/desafios">Abrir desafios visuais <FiArrowRight /></Link>
            <span className="solid-card-number">02</span>
          </article>

          <article className="solid-feature-card is-light">
            <span className="solid-feature-icon"><FiFileText /></span>
            <small>QUESTÕES COMENTADAS</small>
            <h3>Pratique provas com ritmo e método.</h3>
            <p>Resolva questões de provas médicas com explicações cirúrgicas e acompanhamento por especialidade.</p>
            <Link to="/questoes">Resolver questões <FiArrowRight /></Link>
            <span className="solid-card-number">03</span>
          </article>

          <article className="solid-feature-card is-light">
            <span className="solid-feature-icon"><FiRefreshCw /></span>
            <small>REVISÕES ESPAÇADAS</small>
            <h3>Reencontre o conteúdo antes de esquecer.</h3>
            <p>Algoritmo de repetição inteligente que agenda a retomada de cada caso no intervalo ideal de fixação.</p>
            <Link to="/revisoes">Abrir revisões <FiArrowRight /></Link>
            <span className="solid-card-number">04</span>
          </article>

          <article className="solid-feature-card is-light">
            <span className="solid-feature-icon"><FiBookOpen /></span>
            <small>CADERNO DE ERROS</small>
            <h3>Transforme lacunas em domínio clínico.</h3>
            <p>Cada omissão ou conduta incorreta identificada na simulação vira material de estudo focado.</p>
            <Link to="/caderno-erros">Ver meu caderno <FiArrowRight /></Link>
            <span className="solid-card-number">05</span>
          </article>

          <article className="solid-feature-card is-wide is-navy">
            <span className="solid-feature-icon"><FiLayers /></span>
            <small>JORNADA MÉDICA CONECTADA</small>
            <h3>Trilhas de formação clínica do básico ao avançado.</h3>
            <p>Continue de onde parou, acompanhe sua evolução em radar e transforme cada dificuldade em ação clara de melhoria.</p>
            <Link to="/trilhas">Explorar trilhas <FiArrowRight /></Link>
            <span className="solid-card-number">06</span>
          </article>
        </div>

        <div className="home-manifesto-box">
          <div className="manifesto-badge">
            <FiShield aria-hidden="true" />
            POSICIONAMENTO AUTORAL
          </div>
          <h3>O MedSync não é mais um gerador de resumos genéricos de IA.</h3>
          <p>
            Medicina não se aprende com prompts genéricos ou respostas prontas de chatbot. Aprende-se
            investigando cenários reais, sustentando hipóteses diagnósticas e assumindo a responsabilidade
            de cada conduta sob rigor clínico.
          </p>
        </div>
      </section>

      {/* BLOCO 9: CONTROLE DE ERROS & RETENÇÃO */}
      <section className="home-retention-section home-reveal" data-home-reveal aria-labelledby="retention-title">
        <header className="solid-section-heading">
          <span className="section-eyebrow-tag">
            <FiTrendingUp aria-hidden="true" />
            CONTROLE DE ERROS & RETENÇÃO
          </span>
          <h2 id="retention-title">O raciocínio construído que não se perde no tempo.</h2>
          <p>De nada adianta resolver casos se o aprendizado se dissipar semanas depois. O MedSync fecha o ciclo.</p>
        </header>

        <div className="retention-flow-grid">
          <article className="retention-card">
            <div className="retention-card-header">
              <span className="retention-icon"><FiBookOpen /></span>
              <div>
                <small>ETAPA 01 · IDENTIFICAÇÃO</small>
                <h3>Caderno de Erros Automático</h3>
              </div>
            </div>
            <p>
              Toda vez que a Synapse identifica uma omissão de exame crítico ou uma falha de conduta, o caso
              é catalogado automaticamente com a explicação do motivo e a recomendação de estudo.
            </p>
            <div className="retention-pill">
              <FiCheckCircle />
              <span>Sem retrabalho: o caderno se constrói sozinho</span>
            </div>
          </article>

          <article className="retention-card">
            <div className="retention-card-header">
              <span className="retention-icon"><FiRefreshCw /></span>
              <div>
                <small>ETAPA 02 · CONSOLIDAÇÃO</small>
                <h3>Algoritmo de Revisões Espaçadas</h3>
              </div>
            </div>
            <p>
              O sistema calcula a curva de retenção de cada conceito clínico e insere na sua agenda o momento
              exato de retestar aquele raciocínio antes do esquecimento agir.
            </p>
            <div className="retention-pill">
              <FiCheckCircle />
              <span>Intervalos inteligentes de 1, 7, 30 e 60 dias</span>
            </div>
          </article>
        </div>
      </section>

      {/* BLOCO 10: CREDIBILIDADE & RIGOR CLÍNICO */}
      <section className="home-credibility home-reveal" data-home-reveal aria-labelledby="credibility-title">
        <header className="solid-section-heading">
          <span className="section-eyebrow-tag">
            <FiShield aria-hidden="true" />
            RIGOR CLÍNICO & ÉTICA
          </span>
          <h2 id="credibility-title">Robustez que o estudante consegue enxergar.</h2>
          <p>Sem promessas vagas: a confiança vem de critérios, referências e explicações presentes em cada resultado.</p>
        </header>

        <div className="credibility-layout">
          <article className="credibility-ledger">
            <header>
              <div>
                <span><FiShield /></span>
                <div>
                  <small>ESTRUTURA DE AVALIAÇÃO</small>
                  <h3>O que sustenta o feedback da Synapse</h3>
                </div>
              </div>
              <span className="credibility-status"><i /> ATIVO</span>
            </header>
            <ol>
              <li>
                <span>01</span>
                <div>
                  <strong>O diagnóstico fica protegido</strong>
                  <p>A resposta de referência aparece somente depois que o estudante conclui sua resolução.</p>
                </div>
                <FiCheck />
              </li>
              <li>
                <span>02</span>
                <div>
                  <strong>As decisões são avaliadas em conjunto</strong>
                  <p>Avaliações, exames, hipótese, conduta e segurança fazem parte da mesma análise.</p>
                </div>
                <FiCheck />
              </li>
              <li>
                <span>03</span>
                <div>
                  <strong>A nota pode ser compreendida</strong>
                  <p>O resultado explica a composição do desempenho em uma escala simples de 0 a 10.</p>
                </div>
                <FiCheck />
              </li>
              <li>
                <span>04</span>
                <div>
                  <strong>O aprendizado continua</strong>
                  <p>O feedback termina com referências e um plano rápido de melhoria para o próximo caso.</p>
                </div>
                <FiCheck />
              </li>
            </ol>
          </article>

          <div className="credibility-pillar-grid">
            {TRUST_PILLARS.map((pillar) => {
              const PillarIcon = pillar.icon;
              return (
                <article key={pillar.title}>
                  <span><PillarIcon aria-hidden="true" /></span>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* BLOCO 11: TABELA DE PLANOS (GRATUITO + 3 PREMIUMS) */}
      <section className="solid-value-section home-reveal" data-home-reveal aria-labelledby="pricing-title">
        <header className="solid-section-heading">
          <span className="section-eyebrow-tag">
            <FiCompass aria-hidden="true" />
            ACESSO TRANSPARENTE
          </span>
          <h2 id="pricing-title">Comece gratuito. Avance quando fizer sentido.</h2>
          <p>Experimente o método sem compromisso e escolha o plano que acompanha o seu ritmo de internato e estudos.</p>
        </header>

        <div className="solid-plan-grid">
          <article className="solid-plan-card is-free">
            <span>PARA CONHECER</span>
            <h3>{FREE_PLAN.name}</h3>
            <div className="solid-price">{FREE_PLAN.price}</div>
            <p>Uma porta de entrada para experimentar a prática clínica interativa.</p>
            <ul>
              <li><FiCheck /> 5 casos clínicos por mês</li>
              <li><FiCheck /> 10 questões de provas por dia</li>
              <li><FiCheck /> Desafios visuais introdutórios</li>
              <li><FiCheck /> Histórico pessoal de desempenho</li>
            </ul>
            <Link to="/cadastro">Criar conta grátis <FiArrowRight /></Link>
          </article>

          {PREMIUM_BILLING_OPTIONS.map((plan) => (
            <article
              className={`solid-plan-card is-premium-option is-${plan.id}${plan.featured ? ' is-featured' : ''}${plan.bestValue ? ' is-best-value' : ''}`}
              key={plan.id}
            >
              <span>{plan.badge}</span>
              <h3>{plan.name}</h3>
              <div className="solid-price">{plan.price} <small>{plan.billingLabel}</small></div>
              <p>{plan.description}</p>
              <ul>
                {plan.highlights.map((highlight) => (
                  <li key={highlight}><FiCheck /> {highlight}</li>
                ))}
                <li><FiCheck /> 80 Casos Clínicos desbloqueados</li>
                <li><FiCheck /> 150 Desafios Visuais ilimitados</li>
                <li><FiCheck /> Synapse 5-Core com Junta Médica</li>
              </ul>
              <Link to="/assinatura">Ver esta opção <FiArrowRight /></Link>
            </article>
          ))}
        </div>
      </section>

      {/* BLOCO 12: CTA FINAL DE FECHAMENTO */}
      <section className="solid-trust home-reveal" data-home-reveal>
        <div>
          <FiShield aria-hidden="true" />
          <span>CONSTRUÍDO PARA A FORMAÇÃO MÉDICA</span>
        </div>
        <h2>Estude com método.<br /><span className="fluid-words-green">Decida com confiança.</span></h2>
        <p>Treine hoje o raciocínio clínico que você vai precisar levar para o internato e para os plantões de amanhã.</p>
        <Link to="/cadastro" className="solid-primary-button">
          Começar gratuitamente <FiArrowRight />
        </Link>
        <small><FiUsers /> Para estudantes que querem ir além do estudo passivo.</small>
      </section>
    </div>
  );
};

export default HomePage;
