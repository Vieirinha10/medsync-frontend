import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiActivity,
  FiArrowRight,
  FiBookOpen,
  FiCheck,
  FiCheckCircle,
  FiFileText,
  FiHeart,
  FiLayers,
  FiShield,
  FiTarget,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi';
import { FREE_PLAN, PREMIUM_BILLING_OPTIONS } from '../config/pricing';
import { api } from '../services/api';
import ChromaticWavesBackground from '../components/ChromaticWavesBackground';
import MedSyncIntro from '../components/MedSyncIntro';
import '../styles/home-refined.css';

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

  const formattedStudentCount = studentCount === null
    ? '—'
    : studentCount.toLocaleString('pt-BR');
  const activeCapability = SYNAPSE_CAPABILITIES[activeSynapseCapability];
  const ActiveCapabilityIcon = activeCapability.icon;
  const activeFeedback = FEEDBACK_STEPS[activeFeedbackStep];

  return (
    <div className="home-container home-refined">
      <MedSyncIntro />
      <ChromaticWavesBackground />

      <section className="refined-hero">
        <div className="refined-hero-copy">
          <span className="refined-eyebrow">
            <FiActivity aria-hidden="true" />
            Simulação clínica para estudantes de medicina
          </span>
          <h1>
            Raciocínio clínico
            <span> que vira conduta.</span>
          </h1>
          <p>
            Analise casos, solicite exames, construa hipóteses e tome decisões
            em uma experiência criada para aproximar estudo e prática médica.
          </p>

          <div className="refined-hero-actions">
            <Link to="/cadastro" className="refined-primary-button">
              Começar gratuitamente
              <FiArrowRight aria-hidden="true" />
            </Link>
            <Link to="/casos" className="refined-text-link">
              Explorar casos
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className="refined-hero-notes" aria-label="Informações sobre o acesso">
            <span><FiCheckCircle aria-hidden="true" /> Gratuito para começar</span>
            <span><FiShield aria-hidden="true" /> Progresso individual</span>
          </div>
        </div>

        <article className="refined-clinical-card" aria-label="Exemplo do fluxo de um caso clínico">
          <header>
            <span><i /> Caso em andamento</span>
            <small>Cardiologia · Intermediário</small>
          </header>

          <div className="refined-patient-summary">
            <div className="refined-patient-icon"><FiActivity aria-hidden="true" /></div>
            <div>
              <small>Paciente · 32 anos</small>
              <h2>Dor torácica de início súbito</h2>
            </div>
            <span className="refined-patient-status">Estável</span>
          </div>

          <ol className="refined-clinical-line">
            <li className="is-complete">
              <span><FiCheck aria-hidden="true" /></span>
              <div><strong>História clínica</strong><small>Dados analisados</small></div>
            </li>
            <li className="is-active">
              <span><FiFileText aria-hidden="true" /></span>
              <div><strong>Solicitação de exames</strong><small>Decisão atual</small></div>
            </li>
            <li>
              <span><FiTarget aria-hidden="true" /></span>
              <div><strong>Hipótese diagnóstica</strong><small>Próxima etapa</small></div>
            </li>
            <li>
              <span><FiHeart aria-hidden="true" /></span>
              <div><strong>Conduta</strong><small>Próxima etapa</small></div>
            </li>
          </ol>

          <footer>
            <span><FiActivity aria-hidden="true" /> A Synapse acompanha cada decisão</span>
            <strong>Etapa 2 de 4</strong>
          </footer>
        </article>
      </section>

      <section className="refined-evidence" aria-label="Números do MedSync">
        <div><strong>55</strong><span>casos clínicos estruturados</span></div>
        <div><strong>100</strong><span>desafios visuais</span></div>
        <div><strong>8 mil+</strong><span>questões para praticar</span></div>
        <div><strong>{formattedStudentCount}</strong><span>estudantes cadastrados</span></div>
      </section>

      <section className="refined-synapse-section">
        <header className="refined-section-heading">
          <span>Feedback clínico estruturado</span>
          <h2>Da decisão ao próximo passo, em uma única análise.</h2>
          <p>
            A Synapse relaciona as escolhas do estudante à rubrica do caso,
            à segurança do paciente e ao que deve ser revisto depois.
          </p>
        </header>

        <div className="refined-synapse-workbench">
          <nav className="refined-capability-tabs" aria-label="Aspectos avaliados pela Synapse">
            {SYNAPSE_CAPABILITIES.map((capability, index) => (
              <button
                type="button"
                className={index === activeSynapseCapability ? 'is-active' : ''}
                aria-pressed={index === activeSynapseCapability}
                onClick={() => setActiveSynapseCapability(index)}
                key={capability.label}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{capability.label}</strong>
              </button>
            ))}
          </nav>

          <article className="refined-synapse-output">
            <header>
              <span><i /> Synapse</span>
              <small>Análise estruturada</small>
            </header>
            <div className="refined-output-icon">
              <ActiveCapabilityIcon aria-hidden="true" />
            </div>
            <small>Aspecto avaliado</small>
            <h3>{activeCapability.title}</h3>
            <p>{activeCapability.description}</p>
            <div className="refined-output-note">
              <FiCheckCircle aria-hidden="true" />
              <span><small>O que você recebe</small><strong>{activeCapability.output}</strong></span>
            </div>
          </article>

          <aside className="refined-feedback-flow">
            <header>
              <span>Como o feedback é construído</span>
              <strong>Um processo clínico transparente</strong>
            </header>
            <div className="refined-feedback-steps">
              {FEEDBACK_STEPS.map((step, index) => (
                <button
                  type="button"
                  className={index === activeFeedbackStep ? 'is-active' : ''}
                  onClick={() => setActiveFeedbackStep(index)}
                  aria-pressed={index === activeFeedbackStep}
                  key={step.label}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {step.label}
                </button>
              ))}
            </div>
            <div className="refined-feedback-detail">
              <small>{activeFeedback.eyebrow}</small>
              <h3>{activeFeedback.title}</h3>
              <p>{activeFeedback.description}</p>
              <span><FiTrendingUp aria-hidden="true" /> {activeFeedback.signal}</span>
            </div>
          </aside>
        </div>

        <div className="refined-result-strip">
          <div>
            <span>Exemplo de resultado</span>
            <strong>8,6 <small>de 10</small></strong>
          </div>
          <p>
            Hipótese bem sustentada, conduta segura e um plano de melhoria
            direcionado para o próximo caso.
          </p>
          <Link to="/casos">Experimentar em um caso <FiArrowRight aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="refined-academic-section">
        <header className="refined-section-heading is-compact">
          <span>Comunidade acadêmica</span>
          <h2>Estudantes de diferentes instituições praticam no MedSync.</h2>
          <p>
            Uma comunidade médica em formação, conectada pelo mesmo objetivo:
            transformar conhecimento em decisão clínica.
          </p>
        </header>

        <p className="refined-institution-accessibility">
          Instituições representadas: {ACADEMIC_INSTITUTIONS.map(({ acronym }) => acronym).join(', ')}.
        </p>

        <div className="refined-academic-window" aria-hidden="true">
          <div className="refined-academic-track">
            {[...ACADEMIC_INSTITUTIONS, ...ACADEMIC_INSTITUTIONS].map((institution, index) => (
              <AcademicInstitutionCard institution={institution} key={'academic-' + index} />
            ))}
          </div>
        </div>

        <small className="refined-academic-note">
          A exibição indica a origem acadêmica de usuários cadastrados e não representa
          vínculo ou parceria institucional.
        </small>
      </section>

      <section className="refined-paths-section">
        <header className="refined-section-heading">
          <span>Uma jornada conectada</span>
          <h2>Pratique, entenda e consolide.</h2>
          <p>
            Os recursos trabalham juntos para que cada dificuldade encontrada
            durante o estudo indique uma próxima ação clara.
          </p>
        </header>

        <div className="refined-paths">
          <article>
            <span className="refined-path-icon"><FiActivity aria-hidden="true" /></span>
            <small>Praticar</small>
            <h3>Casos clínicos e desafios visuais</h3>
            <p>Decida por etapas, interprete imagens e aproxime o estudo das situações clínicas.</p>
            <div>
              <Link to="/casos">Casos clínicos <FiArrowRight aria-hidden="true" /></Link>
              <Link to="/desafios">Desafios visuais <FiArrowRight aria-hidden="true" /></Link>
            </div>
          </article>

          <article>
            <span className="refined-path-icon"><FiTarget aria-hidden="true" /></span>
            <small>Entender</small>
            <h3>Questões e feedback da Synapse</h3>
            <p>Identifique onde o raciocínio perdeu força e compreenda por que cada alternativa importa.</p>
            <div>
              <Link to="/questoes">Resolver questões <FiArrowRight aria-hidden="true" /></Link>
              <Link to="/casos">Treinar com a Synapse <FiArrowRight aria-hidden="true" /></Link>
            </div>
          </article>

          <article>
            <span className="refined-path-icon"><FiBookOpen aria-hidden="true" /></span>
            <small>Consolidar</small>
            <h3>Revisões, trilhas e caderno de erros</h3>
            <p>Retome lacunas no momento certo e continue exatamente de onde parou.</p>
            <div>
              <Link to="/revisoes">Abrir revisões <FiArrowRight aria-hidden="true" /></Link>
              <Link to="/caderno-erros">Ver caderno de erros <FiArrowRight aria-hidden="true" /></Link>
            </div>
          </article>
        </div>
      </section>

      <section className="refined-method-section">
        <div className="refined-method-copy">
          <span>Método e segurança</span>
          <h2>Você consegue entender como cada resultado foi formado.</h2>
          <p>
            Os casos protegem o diagnóstico durante a resolução e tornam
            critérios, referências e prioridades clínicas visíveis no feedback.
          </p>
          <Link to="/casos" className="refined-text-link">
            Iniciar primeiro caso
            <FiArrowRight aria-hidden="true" />
          </Link>
        </div>

        <div className="refined-trust-list">
          {TRUST_PILLARS.map(({ icon: Icon, title, text }, index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <Icon aria-hidden="true" />
              <div><h3>{title}</h3><p>{text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="refined-pricing-section">
        <header className="refined-section-heading is-compact">
          <span>Planos</span>
          <h2>Comece gratuitamente. Avance quando fizer sentido.</h2>
          <p>Experimente o método antes de escolher o acesso que acompanha seu ritmo.</p>
        </header>

        <div className="refined-pricing-layout">
          <article className="refined-free-plan">
            <span>Para conhecer</span>
            <h3>{FREE_PLAN.name}</h3>
            <strong>{FREE_PLAN.price}</strong>
            <p>Uma porta de entrada para experimentar a prática clínica interativa.</p>
            <ul>
              <li><FiCheck aria-hidden="true" /> 5 casos clínicos por mês</li>
              <li><FiCheck aria-hidden="true" /> 10 questões de provas por dia</li>
              <li><FiCheck aria-hidden="true" /> Painel e histórico pessoal</li>
            </ul>
            <Link to="/cadastro">Criar conta grátis <FiArrowRight aria-hidden="true" /></Link>
          </article>

          <div className="refined-premium-group">
            <header>
              <div><span>MedSync Premium</span><h3>Acesso completo à plataforma</h3></div>
              <FiLayers aria-hidden="true" />
            </header>

            <div className="refined-premium-options">
              {PREMIUM_BILLING_OPTIONS.map((plan) => (
                <article
                  className={[
                    'refined-premium-option',
                    plan.featured ? 'is-featured' : '',
                    plan.bestValue ? 'is-best-value' : '',
                  ].filter(Boolean).join(' ')}
                  key={plan.id}
                >
                  <div className="refined-plan-heading">
                    <span>{plan.badge}</span>
                    <h4>{plan.name}</h4>
                    <strong>{plan.price} <small>{plan.billingLabel}</small></strong>
                  </div>
                  <p>{plan.description}</p>
                  <ul>
                    {plan.highlights.map((highlight) => (
                      <li key={highlight}><FiCheck aria-hidden="true" /> {highlight}</li>
                    ))}
                  </ul>
                  <Link to="/assinatura">Escolher esta opção <FiArrowRight aria-hidden="true" /></Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="refined-final-cta">
        <span>Mais preparo. Mais clareza. Melhores decisões.</span>
        <h2>Treine hoje o raciocínio que você levará para a prática.</h2>
        <p>Comece gratuitamente e resolva seu primeiro caso clínico.</p>
        <Link to="/cadastro" className="refined-primary-button">
          Começar agora
          <FiArrowRight aria-hidden="true" />
        </Link>
        <small><FiUsers aria-hidden="true" /> Feito para estudantes de medicina.</small>
      </section>
    </div>
  );
};

export default HomePage;
