import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiActivity,
  FiArrowRight,
  FiBarChart2,
  FiBookOpen,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiCompass,
  FiCpu,
  FiFileText,
  FiHeart,
  FiImage,
  FiLayers,
  FiMinus,
  FiPlus,
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

const INTRO_SESSION_KEY = 'medsync-home-intro-viewed';

const SYNAPSE_CAPABILITIES = [
  {
    label: 'Exames',
    title: 'Entende o valor de cada exame',
    description: 'A Synapse diferencia escolhas adequadas, exames essenciais ausentes e solicitações que pouco acrescentariam ao caso.',
    output: 'Você entende por que cada exame ajuda — ou não ajuda — o raciocínio.',
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
    output: 'Você recebe uma orientação clara sobre o que priorizar na prática.',
    icon: FiHeart,
  },
  {
    label: 'Paciente',
    title: 'Traduz decisões em consequências',
    description: 'A análise conecta suas escolhas à reação imediata e ao possível desfecho clínico do paciente simulado.',
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

const PLATFORM_FEATURES = [
  {
    number: '01',
    eyebrow: 'SIMULAÇÃO CLÍNICA',
    title: 'Casos que exigem decisão, não apenas memória.',
    description: 'Analise o cenário, solicite exames, construa uma hipótese e defina a conduta por etapas.',
    to: '/casos',
    action: 'Conhecer os casos',
    icon: FiActivity,
    className: 'is-large is-blue',
  },
  {
    number: '02',
    eyebrow: 'DESAFIOS VISUAIS',
    title: 'Interprete imagens com agilidade.',
    description: 'Treine reconhecimento visual com explicações objetivas após cada resposta.',
    to: '/desafios',
    action: 'Ver desafios',
    icon: FiImage,
    className: 'is-cyan',
  },
  {
    number: '03',
    eyebrow: 'QUESTÕES DE PROVAS',
    title: 'Pratique conteúdo com ritmo.',
    description: 'Resolva questões e acompanhe seu desempenho por área médica.',
    to: '/questoes',
    action: 'Resolver questões',
    icon: FiFileText,
    className: 'is-paper',
  },
  {
    number: '04',
    eyebrow: 'REVISÕES ESPAÇADAS',
    title: 'Reencontre o conteúdo no momento certo.',
    description: 'Mantenha pontos importantes ativos ao longo do curso.',
    to: '/revisoes',
    action: 'Abrir revisões',
    icon: FiClock,
    className: 'is-paper',
  },
  {
    number: '05',
    eyebrow: 'CADERNO DE ERROS',
    title: 'Transforme dificuldade em estudo.',
    description: 'Reúna pontos frágeis e retome o que precisa ser consolidado.',
    to: '/caderno-erros',
    action: 'Ver meu caderno',
    icon: FiBookOpen,
    className: 'is-violet',
  },
  {
    number: '06',
    eyebrow: 'TRILHAS E PROGRESSO',
    title: 'Uma jornada de aprendizagem conectada.',
    description: 'Continue de onde parou e transforme cada dificuldade em uma próxima ação clara.',
    to: '/trilhas',
    action: 'Explorar trilhas',
    icon: FiLayers,
    className: 'is-large is-navy',
  },
];

const TRUST_PILLARS = [
  { icon: FiLayers, title: 'Rubrica específica', text: 'Cada caso possui objetivos e critérios próprios de avaliação.' },
  { icon: FiBookOpen, title: 'Referências visíveis', text: 'As fontes clínicas podem ser consultadas no resultado da simulação.' },
  { icon: FiShield, title: 'Segurança em destaque', text: 'Condutas de risco e prioridades do cuidado recebem atenção explícita.' },
  { icon: FiCheckCircle, title: 'Aprendizado transparente', text: 'Você consegue entender como a nota e o feedback foram formados.' },
];

const ACADEMIC_INSTITUTIONS = [
  { acronym: 'UFMA', name: 'Universidade Federal do Maranhão', state: 'MA', logo: '/images/institutions/ufma.png' },
  { acronym: 'CEUMA', name: 'Universidade CEUMA', state: 'MA', logo: '/images/institutions/ceuma.png' },
  { acronym: 'UFPI', name: 'Universidade Federal do Piauí', state: 'PI', logo: '/images/institutions/ufpi.png' },
  { acronym: 'UNINOVAFAPI', name: 'Centro Universitário Afya Teresina', state: 'PI', logo: '/images/institutions/afya-teresina.png' },
  { acronym: 'UEMA', name: 'Universidade Estadual do Maranhão', state: 'MA', logo: '/images/institutions/uema.png' },
  { acronym: 'UNIFACID', name: 'Centro Universitário UniFacid Wyden', state: 'PI' },
  { acronym: 'UESPI', name: 'Universidade Estadual do Piauí', state: 'PI', logo: '/images/institutions/uespi.png' },
  { acronym: 'UNIFSA', name: 'Centro Universitário Santo Agostinho', state: 'PI', logo: '/images/institutions/unifsa.png' },
];

const TESTIMONIALS = [
  {
    quote: 'O formato dos casos me ajudou a organizar melhor o pensamento antes de escolher uma conduta.',
    name: 'Marina Alves',
    course: 'Estudante de medicina · 6º período',
    initials: 'MA',
  },
  {
    quote: 'O feedback mostra exatamente onde o raciocínio perdeu força e o que devo revisar depois.',
    name: 'Lucas Ferreira',
    course: 'Estudante de medicina · 8º período',
    initials: 'LF',
  },
  {
    quote: 'Os desafios visuais tornaram a revisão mais rápida e muito mais próxima da prática.',
    name: 'Ana Ribeiro',
    course: 'Estudante de medicina · 5º período',
    initials: 'AR',
  },
];

const FAQ_ITEMS = [
  {
    question: 'O que posso acessar gratuitamente?',
    answer: 'O plano gratuito permite experimentar casos clínicos, resolver questões diariamente e acompanhar o histórico de desempenho antes de escolher o Premium.',
  },
  {
    question: 'Como a Synapse participa dos casos clínicos?',
    answer: 'Após a resolução, a Synapse organiza o feedback com base no caso, na rubrica clínica e nas decisões registradas, destacando acertos, omissões, segurança e próximos passos.',
  },
  {
    question: 'O MedSync substitui aulas, professores ou supervisão médica?',
    answer: 'Não. O MedSync é uma plataforma educacional complementar e não substitui orientação docente, avaliação médica, diagnóstico ou conduta profissional.',
  },
  {
    question: 'Posso cancelar o plano recorrente?',
    answer: 'Sim. A opção mensal recorrente pode ser cancelada, e o acesso permanece válido conforme o período já pago.',
  },
  {
    question: 'Os casos revelam o diagnóstico antes da resposta?',
    answer: 'Não. Títulos e etapas são organizados para proteger o diagnóstico até a conclusão, preservando o exercício real de raciocínio.',
  },
  {
    question: 'Meu progresso fica salvo?',
    answer: 'Sim. Sua conta reúne histórico, desempenho e recursos de continuidade para que você retome o estudo de onde parou.',
  },
];

const AcademicInstitutionCard = ({ institution }) => (
  <article className="opsra-institution-card">
    <span className={`opsra-institution-logo${institution.logo ? '' : ' is-wordmark'}`}>
      {institution.logo ? <img src={institution.logo} alt="" loading="lazy" decoding="async" /> : institution.acronym}
    </span>
    <span>
      <strong>{institution.acronym}</strong>
      <small>{institution.name}</small>
    </span>
    <em>{institution.state}</em>
  </article>
);

const MedSyncIntro = () => {
  const [shouldShow] = useState(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReducedMotion) return false;
    try {
      return window.sessionStorage.getItem(INTRO_SESSION_KEY) !== 'true';
    } catch {
      return true;
    }
  });
  const [visible, setVisible] = useState(shouldShow);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!shouldShow) return undefined;

    document.documentElement.classList.add('opsra-intro-lock');
    try {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, 'true');
    } catch {
      // A apresentação continua funcionando mesmo se o armazenamento estiver indisponível.
    }

    const leaveTimer = window.setTimeout(() => setLeaving(true), 2800);
    const removeTimer = window.setTimeout(() => setVisible(false), 3700);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(removeTimer);
      document.documentElement.classList.remove('opsra-intro-lock');
    };
  }, [shouldShow]);

  useEffect(() => {
    if (!visible) document.documentElement.classList.remove('opsra-intro-lock');
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={`opsra-intro${leaving ? ' is-leaving' : ''}`} role="status" aria-label="Apresentação do MedSync">
      <div className="opsra-intro-grid" aria-hidden="true" />
      <div className="opsra-intro-logo">
        <img src="/logo-medsync.png" alt="MedSync" />
        <span>Raciocínio clínico em movimento</span>
      </div>
      <div className="opsra-intro-messages" aria-hidden="true">
        <span>Preparando sua experiência</span>
        <span>Sincronizando conhecimento e prática</span>
      </div>
      <div className="opsra-intro-progress" aria-hidden="true"><span /></div>
    </div>
  );
};

const HomePage = () => {
  const [studentCount, setStudentCount] = useState(null);
  const [activeSynapseCapability, setActiveSynapseCapability] = useState(0);
  const [activeFeedbackStep, setActiveFeedbackStep] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const homeRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    api.getPublicStats()
      .then(({ estudantes_medsync: count }) => {
        if (isMounted && Number.isInteger(count) && count >= 0) setStudentCount(count);
      })
      .catch(() => undefined);
    return () => { isMounted = false; };
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
    }, { threshold: 0.1 });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const formattedStudentCount = studentCount === null ? '—' : studentCount.toLocaleString('pt-BR');
  const activeCapability = SYNAPSE_CAPABILITIES[activeSynapseCapability];
  const ActiveCapabilityIcon = activeCapability.icon;
  const activeFeedback = FEEDBACK_STEPS[activeFeedbackStep];

  return (
    <div className="home-container home-opsra" ref={homeRef}>
      <MedSyncIntro />
      <ChromaticWavesBackground
        bgColor="#031a2a"
        colors={['rgba(3, 26, 42, .2)', 'rgba(8, 127, 224, .72)', 'rgba(34, 199, 236, .7)', 'rgba(167, 243, 75, .52)']}
        cellSize={4}
        speed={1.4}
      />

      <section className="opsra-hero" id="inicio">
        <div className="opsra-hero-copy">
          <span className="opsra-eyebrow"><i /> Simulação clínica para estudantes de medicina</span>
          <h1>Treine decisões.<br /><em>Construa raciocínio.</em><br />Evolua na prática.</h1>
          <p>Casos clínicos, desafios visuais e feedback estruturado para transformar conhecimento médico em decisões cada vez mais seguras.</p>
          <div className="opsra-actions">
            <Link to="/cadastro" className="opsra-button is-primary">Começar gratuitamente <FiArrowRight /></Link>
            <Link to="/casos" className="opsra-button is-secondary">Explorar a plataforma</Link>
          </div>
          <div className="opsra-hero-proof">
            <span><FiCheck /> Gratuito para começar</span>
            <span><FiCheck /> Progresso individual</span>
            <span><FiCheck /> Feedback pela Synapse</span>
          </div>
        </div>

        <div className="opsra-hero-visual" aria-label="Demonstração de uma simulação clínica">
          <div className="opsra-visual-orbit orbit-one" aria-hidden="true" />
          <div className="opsra-visual-orbit orbit-two" aria-hidden="true" />
          <span className="opsra-float-tag tag-top"><FiZap /> Decisão em tempo real</span>
          <span className="opsra-float-tag tag-bottom"><FiTrendingUp /> Evolução registrada</span>
          <article className="opsra-clinical-demo">
            <header><div><span /><span /><span /></div><small><i /> SIMULAÇÃO EM ANDAMENTO</small></header>
            <div className="opsra-demo-patient">
              <span><FiActivity /></span>
              <div><small>CASO 01 · CARDIOLOGIA</small><h2>Dor torácica em adulto jovem</h2></div>
              <em>INTERMEDIÁRIO</em>
            </div>
            <div className="opsra-demo-vitals">
              <span><small>PA</small><strong>118/76</strong></span>
              <span><small>FC</small><strong>96 bpm</strong></span>
              <span><small>ETAPA</small><strong>Exames</strong></span>
            </div>
            <div className="opsra-demo-track">
              <span className="is-complete"><i><FiCheck /></i><b>História</b><small>Analisada</small></span>
              <span className="is-active"><i><FiFileText /></i><b>Exames</b><small>Decisão atual</small></span>
              <span><i>03</i><b>Hipótese</b><small>Próxima etapa</small></span>
            </div>
            <footer><div><small>PRÓXIMA DECISÃO</small><strong>Quais exames são realmente necessários?</strong></div><span><FiArrowRight /></span></footer>
          </article>
        </div>
      </section>

      <section className="opsra-academic-strip" data-home-reveal aria-labelledby="academic-network-title">
        <div className="opsra-section-heading is-centered">
          <span>COMUNIDADE ACADÊMICA</span>
          <h2 id="academic-network-title">Uma comunidade médica em formação.</h2>
          <p>Estudantes de diferentes instituições praticam raciocínio clínico em um mesmo ambiente.</p>
        </div>
        <p className="opsra-accessible-only">Instituições representadas: {ACADEMIC_INSTITUTIONS.map(({ acronym }) => acronym).join(', ')}.</p>
        <div className="opsra-institution-window" aria-hidden="true">
          <div className="opsra-institution-track">
            {[...ACADEMIC_INSTITUTIONS, ...ACADEMIC_INSTITUTIONS].map((institution, index) => (
              <AcademicInstitutionCard institution={institution} key={`${institution.acronym}-${index}`} />
            ))}
          </div>
        </div>
        <p className="opsra-academic-note"><FiShield /> A exibição indica a origem acadêmica de usuários cadastrados e não representa vínculo ou parceria institucional.</p>
      </section>

      <section className="opsra-problem" data-home-reveal>
        <div className="opsra-section-heading"><span>ONDE O ESTUDO PERDE FORÇA</span><h2>Conhecer o conteúdo não basta quando é preciso decidir.</h2></div>
        <div className="opsra-problem-grid">
          <article><span>01</span><FiLayers /><h3>Estudo fragmentado</h3><p>Casos, questões e revisões ficam separados e não mostram uma próxima ação clara.</p></article>
          <article><span>02</span><FiCompass /><h3>Prática sem consequência</h3><p>Acertar o diagnóstico não revela se os exames e a conduta foram seguros para o paciente.</p></article>
          <article><span>03</span><FiBarChart2 /><h3>Resultado sem direção</h3><p>Uma nota isolada não explica o raciocínio nem transforma lacunas em revisão objetiva.</p></article>
        </div>
        <div className="opsra-problem-statement"><p>O MedSync conecta prática, análise e continuidade para que cada resolução tenha significado.</p><strong>DECIDA <i /> ENTENDA <i /> EVOLUA</strong></div>
      </section>

      <section className="opsra-synapse" data-home-reveal aria-labelledby="synapse-home-title">
        <div className="opsra-section-heading is-split">
          <div><span>INTELIGÊNCIA CLÍNICA</span><h2 id="synapse-home-title">Uma inteligência clínica que acompanha o seu raciocínio.</h2></div>
          <p>A Synapse não entrega apenas uma resposta. Ela conecta suas decisões à rubrica do caso, à segurança do paciente e ao próximo passo do aprendizado.</p>
        </div>
        <div className="opsra-synapse-layout">
          <div className="opsra-synapse-console">
            <div className="opsra-synapse-brand"><img src="/images/synapse-logo.svg" alt="Logo da Synapse" /><div><small>MEDSYNC INTELLIGENCE</small><strong>SYNAPSE</strong></div><span><i /> ATIVA</span></div>
            <div className="opsra-synapse-tabs" aria-label="Capacidades da Synapse">
              {SYNAPSE_CAPABILITIES.map((capability, index) => {
                const CapabilityIcon = capability.icon;
                return <button type="button" className={activeSynapseCapability === index ? 'is-active' : ''} key={capability.label} aria-pressed={activeSynapseCapability === index} onClick={() => setActiveSynapseCapability(index)}><CapabilityIcon /><span>{capability.label}</span></button>;
              })}
            </div>
            <article className="opsra-synapse-output" aria-live="polite">
              <header><span><ActiveCapabilityIcon /></span><small>CAPACIDADE {String(activeSynapseCapability + 1).padStart(2, '0')}</small></header>
              <h3>{activeCapability.title}</h3><p>{activeCapability.description}</p>
              <div><FiZap /><span><small>O QUE VOCÊ RECEBE</small><strong>{activeCapability.output}</strong></span></div>
            </article>
          </div>
          <div className="opsra-synapse-aside"><span><FiCpu /></span><small>ANÁLISE CONECTADA</small><h3>Cada decisão deixa um sinal.</h3><p>A Synapse organiza esses sinais para explicar o desempenho sem reduzir seu raciocínio a certo ou errado.</p><Link to="/cadastro">Experimentar em um caso <FiArrowRight /></Link></div>
        </div>
      </section>

      <section className="opsra-features" data-home-reveal id="recursos">
        <div className="opsra-section-heading is-split"><div><span>EXPERIÊNCIA COMPLETA</span><h2>Ferramentas diferentes. Uma mesma evolução.</h2></div><p>Recursos conectados para você praticar, compreender e retomar o conteúdo com intenção.</p></div>
        <div className="opsra-feature-grid">
          {PLATFORM_FEATURES.map((feature) => {
            const FeatureIcon = feature.icon;
            return <article className={`opsra-feature-card ${feature.className}`} key={feature.number}><div><span><FeatureIcon /></span><em>{feature.number}</em></div><small>{feature.eyebrow}</small><h3>{feature.title}</h3><p>{feature.description}</p><Link to={feature.to}>{feature.action} <FiArrowRight /></Link></article>;
          })}
        </div>
      </section>

      <section className="opsra-process" data-home-reveal id="como-funciona">
        <div className="opsra-section-heading is-centered"><span>COMO O FEEDBACK É CONSTRUÍDO</span><h2>Da resolução ao próximo passo.</h2><p>Acompanhe como suas escolhas se transformam em um feedback clínico organizado.</p></div>
        <div className="opsra-process-shell">
          <div className="opsra-process-tabs" role="tablist" aria-label="Etapas da análise da Synapse">
            {FEEDBACK_STEPS.map((step, index) => <button type="button" role="tab" aria-selected={activeFeedbackStep === index} className={activeFeedbackStep === index ? 'is-active' : ''} key={step.label} onClick={() => setActiveFeedbackStep(index)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step.label}</strong></button>)}
          </div>
          <article className="opsra-process-panel" role="tabpanel" aria-live="polite">
            <div><span>{activeFeedback.eyebrow}</span><h3>{activeFeedback.title}</h3><p>{activeFeedback.description}</p><div className="opsra-process-signal"><FiActivity /><span><small>SINAL PROCESSADO</small><strong>{activeFeedback.signal}</strong></span><FiCheckCircle /></div></div>
            <div className="opsra-result-card"><header><span><i /> FEEDBACK GERADO</span><small>CASO 01</small></header><div className="opsra-result-score"><strong>8,6</strong><span>de 10</span></div><h4>Raciocínio bem sustentado</h4><p>Decisões consistentes e clinicamente seguras.</p><ul><li><FiCheck /> Hipótese coerente</li><li><FiCheck /> Conduta priorizada</li><li><FiTrendingUp /> Plano de melhoria</li></ul></div>
          </article>
        </div>
      </section>

      <section className="opsra-stats" role="region" aria-label="Números do MedSync" data-home-reveal>
        <div className="opsra-stats-copy"><span>MEDSYNC EM MOVIMENTO</span><h2>Uma plataforma construída para acompanhar a formação médica.</h2></div>
        <StatMorph items={[{ value: '55', label: 'casos clínicos' }, { value: '100', label: 'desafios visuais' }, { value: formattedStudentCount, label: 'estudantes MedSync' }, { value: '19', label: 'áreas médicas contempladas' }]} />
      </section>

      <section className="opsra-testimonials" data-home-reveal>
        <div className="opsra-section-heading is-split"><div><span>EXPERIÊNCIAS DOS ESTUDANTES</span><h2>Feito para quem está construindo o próprio raciocínio.</h2></div><p>Conteúdo demonstrativo da estrutura. Os relatos e as fotos serão substituídos por depoimentos reais e autorizados.</p></div>
        <div className="opsra-testimonial-window"><div className="opsra-testimonial-track">
          {[...TESTIMONIALS, ...TESTIMONIALS].map((testimonial, index) => <article key={`${testimonial.initials}-${index}`}><span className="opsra-demo-label">DEPOIMENTO ILUSTRATIVO</span><div className="opsra-stars" aria-label="Cinco estrelas">★★★★★</div><blockquote>“{testimonial.quote}”</blockquote><footer><span>{testimonial.initials}</span><div><strong>{testimonial.name}</strong><small>{testimonial.course}</small></div></footer></article>)}
        </div></div>
      </section>

      <section className="opsra-ecosystem" data-home-reveal>
        <div className="opsra-section-heading is-centered"><span>APRENDIZADO CONECTADO</span><h2>O que você pratica volta como direção.</h2><p>Os recursos compartilham o mesmo objetivo: transformar desempenho em continuidade.</p></div>
        <div className="opsra-ecosystem-stage">
          <div className="opsra-ecosystem-ring ring-one" aria-hidden="true" /><div className="opsra-ecosystem-ring ring-two" aria-hidden="true" /><div className="opsra-ecosystem-core"><img src="/logo-medsync.png" alt="MedSync" /></div>
          <span className="node-cases"><FiActivity /><small>Casos</small></span><span className="node-questions"><FiFileText /><small>Questões</small></span><span className="node-visual"><FiImage /><small>Desafios</small></span><span className="node-review"><FiClock /><small>Revisões</small></span><span className="node-errors"><FiBookOpen /><small>Erros</small></span><span className="node-synapse"><FiCpu /><small>Synapse</small></span>
        </div>
      </section>

      <section className="opsra-comparison" data-home-reveal>
        <div className="opsra-section-heading is-centered"><span>CONSTRUÍDO DE OUTRA FORMA</span><h2>Menos fragmentação. Mais clareza para evoluir.</h2></div>
        <div className="opsra-comparison-grid">
          <article className="is-muted"><header><span>MÉTODO FRAGMENTADO</span><FiMinus /></header><ul><li><FiMinus /> Conteúdo separado da prática</li><li><FiMinus /> Nota sem explicação clínica</li><li><FiMinus /> Erros que não viram revisão</li><li><FiMinus /> Decisões sem impacto no paciente</li></ul></article>
          <article className="is-medsync"><header><span>EXPERIÊNCIA MEDSYNC</span><FiCheck /></header><ul><li><FiCheck /> Prática conectada ao conteúdo</li><li><FiCheck /> Feedback que explica o raciocínio</li><li><FiCheck /> Lacunas transformadas em direção</li><li><FiCheck /> Segurança do paciente em destaque</li></ul></article>
        </div>
      </section>

      <section className="opsra-credibility" data-home-reveal>
        <div className="opsra-section-heading is-split"><div><span>CONFIANÇA PELA ESTRUTURA</span><h2>Robustez que o estudante consegue enxergar.</h2></div><p>Critérios, referências e explicações tornam cada resultado compreensível.</p></div>
        <div className="opsra-trust-grid">{TRUST_PILLARS.map((pillar) => { const PillarIcon = pillar.icon; return <article key={pillar.title}><span><PillarIcon /></span><h3>{pillar.title}</h3><p>{pillar.text}</p></article>; })}</div>
      </section>

      <section className="opsra-pricing" data-home-reveal id="planos">
        <div className="opsra-section-heading is-centered"><span>PLANOS</span><h2>Comece livre. Avance quando fizer sentido.</h2><p>Experimente o método e escolha o acesso que acompanha o seu ritmo.</p></div>
        <div className="opsra-plan-grid">
          <article className="opsra-plan-card is-free"><header><span>PARA CONHECER</span><FiCompass /></header><h3>{FREE_PLAN.name}</h3><div className="opsra-price">{FREE_PLAN.price}</div><p>Uma porta de entrada para experimentar a prática clínica interativa.</p><ul><li><FiCheck /> 5 casos clínicos por mês</li><li><FiCheck /> 10 questões por dia</li><li><FiCheck /> Painel pessoal</li><li><FiCheck /> Histórico de desempenho</li></ul><Link to="/cadastro">Criar conta grátis <FiArrowRight /></Link></article>
          {PREMIUM_BILLING_OPTIONS.map((plan) => <article className={`opsra-plan-card${plan.featured ? ' is-featured' : ''}${plan.bestValue ? ' is-best-value' : ''}`} key={plan.id}><header><span>{plan.badge}</span><FiZap /></header><h3>{plan.name}</h3><div className="opsra-price">{plan.price} <small>{plan.billingLabel}</small></div><p>{plan.description}</p><ul>{plan.highlights.map((highlight) => <li key={highlight}><FiCheck /> {highlight}</li>)}</ul><Link to="/assinatura">Ver esta opção <FiArrowRight /></Link></article>)}
        </div>
      </section>

      <section className="opsra-faq" data-home-reveal>
        <div className="opsra-section-heading"><span>PERGUNTAS FREQUENTES</span><h2>Tudo o que você precisa saber para começar.</h2></div>
        <div className="opsra-faq-list">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openFaq === index;
            return <article className={isOpen ? 'is-open' : ''} key={item.question}><h3><button type="button" aria-expanded={isOpen} onClick={() => setOpenFaq(isOpen ? -1 : index)}><span>{String(index + 1).padStart(2, '0')}</span>{item.question}{isOpen ? <FiMinus /> : <FiPlus />}</button></h3><div><p>{item.answer}</p></div></article>;
          })}
        </div>
      </section>

      <section className="opsra-final-cta" data-home-reveal>
        <span><i /> PRONTO PARA COMEÇAR?</span><h2>Estude com método.<br /><em>Decida com confiança.</em></h2><p>Treine hoje o raciocínio que você vai precisar levar para a prática.</p><Link to="/cadastro" className="opsra-button is-primary">Começar gratuitamente <FiArrowRight /></Link><small><FiUsers /> Para estudantes que querem ir além do estudo passivo.</small>
      </section>
    </div>
  );
};

export default HomePage;
