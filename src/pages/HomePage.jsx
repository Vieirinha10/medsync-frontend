import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiActivity,
  FiArrowRight,
  FiBookOpen,
  FiCheck,
  FiCheckCircle,
  FiCompass,
  FiFileText,
  FiHeart,
  FiLayers,
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

const SYNAPSE_CAPABILITIES = [
  {
    label: 'Exames',
    title: 'Entende o valor de cada exame',
    description: 'A Synapse diferencia escolhas adequadas, exames essenciais ausentes e solicitações que pouco acrescentariam ao caso.',
    output: 'O estudante entende por que cada exame ajuda — ou não ajuda — o raciocínio.',
    icon: FiFileText,
  },
  {
    label: 'Hipótese',
    title: 'Analisa a construção da hipótese',
    description: 'O diagnóstico final não é avaliado isoladamente: a Synapse observa a coerência entre os dados do caso e a hipótese escolhida.',
    output: 'O feedback mostra onde o raciocínio foi consistente e quais relações precisam ser revistas.',
    icon: FiTarget,
  },
  {
    label: 'Conduta',
    title: 'Revisa prioridades e segurança',
    description: 'A conduta é comparada com os objetivos do caso, considerando estabilização, tratamento, monitorização e próximos passos.',
    output: 'O estudante recebe uma orientação clara sobre o que priorizar na prática.',
    icon: FiHeart,
  },
  {
    label: 'Paciente',
    title: 'Traduz decisões em consequências',
    description: 'A análise conecta as escolhas do estudante à reação imediata e ao possível desfecho clínico do paciente simulado.',
    output: 'A decisão deixa de ser abstrata e passa a ter significado clínico.',
    icon: FiActivity,
  },
  {
    label: 'Próximo passo',
    title: 'Transforma feedback em direção',
    description: 'Ao final, a Synapse organiza os pontos mais importantes em um plano rápido, objetivo e fácil de levar para o próximo caso.',
    output: 'Cada resultado termina com uma ação concreta de melhoria.',
    icon: FiTrendingUp,
  },
];

const FEEDBACK_STEPS = [
  {
    label: 'Caso clínico',
    eyebrow: '01 · CONTEXTO',
    title: 'A análise começa pelo caso completo',
    description: 'História, sinais vitais, exames disponíveis e objetivos de aprendizagem formam o contexto da avaliação.',
    signal: 'Contexto clínico e objetivos do caso',
  },
  {
    label: 'Suas decisões',
    eyebrow: '02 · RACIOCÍNIO',
    title: 'Cada escolha entra na avaliação',
    description: 'Exames, justificativas, hipótese e conduta são analisados como partes do mesmo raciocínio clínico.',
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

const TRUST_PILLARS = [
  { icon: FiLayers, title: 'Rubrica específica', text: 'Cada caso possui objetivos e critérios próprios de avaliação.' },
  { icon: FiBookOpen, title: 'Referências visíveis', text: 'As fontes clínicas podem ser consultadas no resultado da simulação.' },
  { icon: FiShield, title: 'Segurança em destaque', text: 'Condutas de risco e prioridades do cuidado recebem atenção explícita.' },
  { icon: FiCheckCircle, title: 'Aprendizado transparente', text: 'O estudante consegue entender como a nota e o feedback foram formados.' },
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
  const [activeSynapseCapability, setActiveSynapseCapability] = useState(0);
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
    }, { threshold: 0.13 });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const formattedStudentCount = studentCount === null
    ? '—'
    : studentCount.toLocaleString('pt-BR');
  const activeCapability = SYNAPSE_CAPABILITIES[activeSynapseCapability];
  const ActiveCapabilityIcon = activeCapability.icon;
  const activeFeedback = FEEDBACK_STEPS[activeFeedbackStep];

  return (
    <div className="home-container home-solid" ref={homeRef}>
    <ChromaticWavesBackground />
    <section className="solid-hero">
      <div className="solid-hero-glow solid-hero-glow-one" aria-hidden="true" />
      <div className="solid-hero-glow solid-hero-glow-two" aria-hidden="true" />

      <div className="solid-hero-copy">
        <span className="solid-kicker">
          <FiActivity aria-hidden="true" />
          Simulação clínica para estudantes de medicina
        </span>
        <h1>
          Raciocínio clínico
          <span className="fluid-words"> que vira </span>
          conduta.
        </h1>
        <p>
          Saia do estudo passivo. Analise casos, solicite exames, defina hipóteses
          e tome decisões em uma experiência construída para a prática médica.
        </p>
        <div className="solid-hero-actions">
          <Link to="/cadastro" className="solid-primary-button">
            Começar gratuitamente
            <FiArrowRight aria-hidden="true" />
          </Link>
          <Link to="/casos" className="solid-ghost-button">
            Explorar casos
          </Link>
        </div>
        <div className="solid-hero-proof" aria-label="Benefícios da plataforma">
          <span><FiCheckCircle /> Acesso gratuito para começar</span>
          <span><FiCheckCircle /> Progresso individual</span>
          <span><FiCheckCircle /> Feedback orientado pela Synapse</span>
        </div>
      </div>

      <div className="solid-hero-stage" aria-label="Demonstração de uma simulação clínica">
        <span className="stage-chip stage-chip-top"><FiZap /> Decisão em tempo real</span>
        <span className="stage-chip stage-chip-bottom"><FiTrendingUp /> Evolução registrada</span>

        <div className="solid-clinical-window">
          <div className="solid-window-bar">
            <span /><span /><span />
            <small>SIMULAÇÃO EM ANDAMENTO</small>
          </div>
          <div className="solid-patient-heading">
            <span className="solid-patient-icon"><FiActivity /></span>
            <div>
              <small>CASO 01 · CARDIOLOGIA</small>
              <h2>Dor torácica em adulto jovem</h2>
            </div>
            <span className="solid-case-level">INTERMEDIÁRIO</span>
          </div>
          <div className="solid-patient-data">
            <span><small>IDADE</small><strong>32 anos</strong></span>
            <span><small>QUEIXA</small><strong>Dor torácica</strong></span>
            <span><small>ETAPA</small><strong>Exames</strong></span>
          </div>
          <div className="solid-clinical-track">
            <div className="is-complete">
              <span><FiCheck /></span>
              <p><strong>História clínica</strong><small>Dados analisados</small></p>
            </div>
            <div className="is-active">
              <span><FiFileText /></span>
              <p><strong>Solicitar exames</strong><small>Decisão atual</small></p>
            </div>
            <div>
              <span>03</span>
              <p><strong>Definir hipótese</strong><small>Próxima etapa</small></p>
            </div>
          </div>
          <div className="solid-decision-row">
            <div><small>PRÓXIMA DECISÃO</small><strong>Quais exames são realmente necessários?</strong></div>
            <button type="button" aria-label="Avançar na demonstração"><FiArrowRight /></button>
          </div>
        </div>
      </div>
    </section>

    <section className="solid-proof-morph" aria-label="Números do MedSync">
      <StatMorph
        items={[
          { value: '55', label: 'casos clínicos' },
          { value: '100', label: 'desafios visuais' },
          { value: formattedStudentCount, label: 'estudantes MedSync' },
          { value: '19', label: 'áreas médicas contempladas' },
        ]}
      />
    </section>

    <section className="solid-manifesto">
      <span>APRENDIZADO ATIVO, DO INÍCIO AO FIM</span>
      <h2>
        DECIDA. <em>JUSTIFIQUE.</em> EVOLUA.
      </h2>
      <p>
        O MedSync transforma conteúdo médico em decisões que você consegue
        analisar, comparar e aprimorar.
      </p>
    </section>

    <section className="home-synapse-section home-reveal" data-home-reveal aria-labelledby="synapse-home-title">
      <header className="solid-section-heading home-synapse-heading">
        <div>
          <span className="solid-section-index">01 — CONHEÇA A SYNAPSE</span>
          <h2 id="synapse-home-title">Uma inteligência clínica que acompanha o seu raciocínio.</h2>
        </div>
        <p>
          A Synapse não entrega apenas uma resposta. Ela conecta suas decisões à rubrica do caso,
          à segurança do paciente e ao próximo passo do seu aprendizado.
        </p>
      </header>

      <div className="synapse-showcase">
        <div className="synapse-network" aria-label="Capacidades da Synapse">
          <div className="synapse-network-grid" aria-hidden="true" />
          <div className="synapse-core">
            <img src="/images/synapse-logo.svg" alt="Logo da Synapse" />
            <small>SYNAPSE</small>
            <i /><i /><i />
          </div>
          {SYNAPSE_CAPABILITIES.map((capability, index) => {
            const CapabilityIcon = capability.icon;
            return (
              <button
                type="button"
                className={`synapse-capability-node node-${index}${activeSynapseCapability === index ? ' is-active' : ''}`}
                key={capability.label}
                aria-pressed={activeSynapseCapability === index}
                onClick={() => setActiveSynapseCapability(index)}
                onMouseEnter={() => setActiveSynapseCapability(index)}
                onFocus={() => setActiveSynapseCapability(index)}
              >
                <CapabilityIcon aria-hidden="true" />
                <span>{capability.label}</span>
              </button>
            );
          })}
        </div>

        <article className="synapse-capability-panel" aria-live="polite">
          <header>
            <span><ActiveCapabilityIcon aria-hidden="true" /></span>
            <small>CAPACIDADE {String(activeSynapseCapability + 1).padStart(2, '0')}</small>
          </header>
          <h3>{activeCapability.title}</h3>
          <p>{activeCapability.description}</p>
          <div>
            <FiZap aria-hidden="true" />
            <span><small>O QUE O ESTUDANTE RECEBE</small><strong>{activeCapability.output}</strong></span>
          </div>
          <Link to="/cadastro">Experimentar em um caso <FiArrowRight aria-hidden="true" /></Link>
        </article>
      </div>
    </section>

    <section className="home-feedback-system home-reveal" data-home-reveal aria-labelledby="feedback-system-title">
      <div className="feedback-system-intro">
        <span className="solid-section-index">02 — COMO O FEEDBACK É CONSTRUÍDO</span>
        <h2 id="feedback-system-title">Existe uma estrutura por trás de cada análise.</h2>
        <p>
          Explore as etapas para entender como a resolução do estudante se transforma em um
          feedback clínico organizado, compreensível e útil.
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

    <section className="home-result-preview home-reveal" data-home-reveal aria-labelledby="result-preview-title">
      <header className="solid-section-heading">
        <div>
          <span className="solid-section-index">03 — RESULTADO QUE ENSINA</span>
          <h2 id="result-preview-title">A nota é só o começo da conversa.</h2>
        </div>
        <p>O resultado ajuda o estudante a compreender o caso, o paciente e o que fazer diferente na próxima tentativa.</p>
      </header>

      <div className="result-preview-shell">
        <span className="result-preview-label">EXEMPLO ILUSTRATIVO DE FEEDBACK</span>
        <div className="result-preview-main">
          <article className="preview-score-card">
            <small>SEU RESULTADO</small>
            <div className="preview-score-ring"><strong>8,6</strong><span>de 10</span></div>
            <h3>Muito bom</h3>
            <p>Decisões consistentes e clinicamente seguras.</p>
          </article>

          <div className="preview-clinical-cards">
            <article>
              <span><FiTarget /></span>
              <div><small>HIPÓTESE DIAGNÓSTICA</small><h3>Raciocínio bem sustentado</h3><p>Os achados principais foram conectados à hipótese mais provável.</p></div>
            </article>
            <article className="is-patient">
              <span role="img" aria-label="Paciente estabilizado">🙂</span>
              <div><small>IMPACTO NO PACIENTE</small><h3>Paciente estabilizado</h3><p>A conduta priorizou segurança, tratamento e monitorização.</p></div>
            </article>
          </div>
        </div>
        <div className="preview-improvement-plan">
          <div><FiTrendingUp /><span><small>SEU PRÓXIMO PASSO</small><strong>Plano rápido de melhoria</strong></span></div>
          <p>Revisar critérios de gravidade</p>
          <p>Justificar exames essenciais</p>
          <p>Definir critérios de reavaliação</p>
        </div>
      </div>
    </section>

    <section className="home-academic-network home-reveal" data-home-reveal aria-labelledby="academic-network-title">
      <div className="academic-network-heading">
        <div>
          <span className="solid-section-index">COMUNIDADE ACADÊMICA</span>
          <h2 id="academic-network-title">Uma comunidade médica em formação.</h2>
        </div>
        <p>
          Estudantes de diferentes instituições encontram no MedSync um espaço comum para
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

        <div className="academic-marquee-row is-reverse">
          <div className="academic-marquee-track">
            {[...ACADEMIC_INSTITUTIONS].reverse().concat([...ACADEMIC_INSTITUTIONS].reverse()).map((institution, index) => (
              <AcademicInstitutionCard institution={institution} key={`reverse-${institution.acronym}-${index}`} />
            ))}
          </div>
        </div>
      </div>

      <p className="academic-network-disclaimer">
        <FiShield aria-hidden="true" />
        <span>A exibição indica a origem acadêmica de usuários cadastrados e não representa vínculo ou parceria institucional.</span>
      </p>
    </section>

    <section className="solid-features home-reveal" data-home-reveal>
      <header className="solid-section-heading">
        <div>
          <span className="solid-section-index">04 — EXPERIÊNCIA COMPLETA</span>
          <h2>Uma plataforma que acompanha o seu raciocínio.</h2>
        </div>
        <p>Recursos conectados para você estudar com intenção, prática e continuidade.</p>
      </header>

      <div className="solid-feature-grid">
        <article className="solid-feature-card is-wide is-blue">
          <span className="solid-feature-icon"><FiActivity /></span>
          <small>SIMULAÇÃO CLÍNICA</small>
          <h3>Casos que exigem decisão, não apenas memória.</h3>
          <p>Analise o cenário, selecione exames e construa hipótese e conduta por etapas.</p>
          <Link to="/casos">Conhecer os casos <FiArrowRight /></Link>
          <span className="solid-card-number">01</span>
        </article>

        <article className="solid-feature-card is-light">
          <span className="solid-feature-icon"><FiTarget /></span>
          <small>DESAFIOS RÁPIDOS</small>
          <h3>Interprete imagens e responda com agilidade.</h3>
          <p>Questões visuais com quatro alternativas e explicação após a resposta.</p>
          <Link to="/desafios">Ver desafios <FiArrowRight /></Link>
          <span className="solid-card-number">02</span>
        </article>

        <article className="solid-feature-card is-light">
          <span className="solid-feature-icon"><FiFileText /></span>
          <small>QUESTÕES DE PROVAS</small>
          <h3>Pratique conteúdo com ritmo e objetividade.</h3>
          <p>Resolva questões, confira explicações e acompanhe seu desempenho por área.</p>
          <Link to="/questoes">Resolver questões <FiArrowRight /></Link>
          <span className="solid-card-number">03</span>
        </article>

        <article className="solid-feature-card is-light">
          <span className="solid-feature-icon"><FiTrendingUp /></span>
          <small>REVISÕES ESPAÇADAS</small>
          <h3>Reencontre o conteúdo no momento certo.</h3>
          <p>Organize revisões e mantenha os pontos importantes ativos ao longo do curso.</p>
          <Link to="/revisoes">Abrir revisões <FiArrowRight /></Link>
          <span className="solid-card-number">04</span>
        </article>

        <article className="solid-feature-card is-light">
          <span className="solid-feature-icon"><FiBookOpen /></span>
          <small>CADERNO DE ERROS</small>
          <h3>Transforme dificuldade em material de estudo.</h3>
          <p>Reúna pontos frágeis e retome o que realmente precisa ser consolidado.</p>
          <Link to="/caderno-erros">Ver meu caderno <FiArrowRight /></Link>
          <span className="solid-card-number">05</span>
        </article>

        <article className="solid-feature-card is-wide is-navy">
          <span className="solid-feature-icon"><FiLayers /></span>
          <small>JORNADA CONECTADA</small>
          <h3>Trilhas e progresso conectam toda a experiência.</h3>
          <p>Continue de onde parou, acompanhe sua evolução e transforme cada dificuldade em uma próxima ação clara.</p>
          <Link to="/trilhas">Explorar trilhas <FiArrowRight /></Link>
          <span className="solid-card-number">06</span>
        </article>
      </div>
    </section>

    <section className="home-credibility home-reveal" data-home-reveal aria-labelledby="credibility-title">
      <header className="solid-section-heading">
        <div>
          <span className="solid-section-index">05 — CONFIANÇA PELA ESTRUTURA</span>
          <h2 id="credibility-title">Robustez que o estudante consegue enxergar.</h2>
        </div>
        <p>Sem promessas vagas: a confiança vem de critérios, referências e explicações presentes em cada resultado.</p>
      </header>

      <div className="credibility-layout">
        <article className="credibility-ledger">
          <header>
            <div><span><FiShield /></span><div><small>ESTRUTURA DE AVALIAÇÃO</small><h3>O que sustenta o feedback</h3></div></div>
            <span className="credibility-status"><i /> ATIVO</span>
          </header>
          <ol>
            <li><span>01</span><div><strong>O diagnóstico fica protegido</strong><p>A resposta de referência aparece somente depois que o estudante conclui sua resolução.</p></div><FiCheck /></li>
            <li><span>02</span><div><strong>As decisões são avaliadas em conjunto</strong><p>Exames, hipótese, conduta e segurança fazem parte da mesma análise.</p></div><FiCheck /></li>
            <li><span>03</span><div><strong>A nota pode ser compreendida</strong><p>O resultado explica a composição do desempenho em uma escala simples de 0 a 10.</p></div><FiCheck /></li>
            <li><span>04</span><div><strong>O aprendizado continua</strong><p>O feedback termina com referências e um plano rápido de melhoria.</p></div><FiCheck /></li>
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

    <section className="solid-process home-reveal" data-home-reveal>
      <div className="solid-process-intro">
        <span className="solid-section-index">06 — APRENDIZADO CONTÍNUO</span>
        <h2>Um resultado que prepara o próximo caso.</h2>
        <p>A experiência conecta prática, feedback e revisão para que cada tentativa tenha continuidade.</p>
        <Link to="/cadastro" className="solid-outline-button">Iniciar primeiro caso <FiArrowRight /></Link>
      </div>

      <ol className="solid-process-list">
        <li>
          <span>01</span><FiCompass />
          <div><h3>Resolva um novo caso</h3><p>Analise o cenário e registre suas decisões sem receber spoilers do diagnóstico.</p></div>
        </li>
        <li>
          <span>02</span><FiBookOpen />
          <div><h3>Entenda o feedback</h3><p>Veja o que funcionou, o que faltou e como o paciente pode responder.</p></div>
        </li>
        <li>
          <span>03</span><FiFileText />
          <div><h3>Leve as lacunas para revisão</h3><p>Use o plano de melhoria, as revisões e o caderno de erros para organizar o estudo.</p></div>
        </li>
        <li>
          <span>04</span><FiTrendingUp />
          <div><h3>Volte mais preparado</h3><p>Aplique o que aprendeu em novos cenários e acompanhe sua evolução.</p></div>
        </li>
      </ol>
    </section>

    <section className="solid-value-section home-reveal" data-home-reveal>
      <header className="solid-section-heading">
        <div>
          <span className="solid-section-index">07 — PLANOS</span>
          <h2>Comece livre. Avance quando fizer sentido.</h2>
        </div>
        <p>Experimente o método e escolha o acesso que acompanha o seu ritmo.</p>
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
            <li><FiCheck /> Painel pessoal</li>
            <li><FiCheck /> Histórico de desempenho</li>
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
            </ul>
            <Link to="/assinatura">Ver esta opção <FiArrowRight /></Link>
          </article>
        ))}
      </div>
    </section>

    <section className="solid-trust home-reveal" data-home-reveal>
      <div>
        <FiShield aria-hidden="true" />
        <span>CONSTRUÍDO PARA A FORMAÇÃO MÉDICA</span>
      </div>
      <h2>Estude com método.<br /><span className="fluid-words">Decida com confiança.</span></h2>
      <p>Treine hoje o raciocínio que você vai precisar levar para a prática.</p>
      <Link to="/cadastro" className="solid-primary-button">
        Começar agora <FiArrowRight />
      </Link>
      <small><FiUsers /> Para estudantes que querem ir além do estudo passivo.</small>
    </section>
    </div>
  );
};

export default HomePage;
