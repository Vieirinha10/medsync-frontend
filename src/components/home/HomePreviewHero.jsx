import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, m as Motion, useReducedMotion } from 'motion/react';
import {
  FiActivity,
  FiArrowRight,
  FiCheck,
  FiClipboard,
  FiPause,
  FiPlay,
  FiSearch,
  FiUser,
} from 'react-icons/fi';
import ChromaticWavesBackground from '../ChromaticWavesBackground';
import useMediaQuery from '../../hooks/useMediaQuery';

const CASE_STEPS = [
  { id: 0, label: 'Dados iniciais' },
  { id: 1, label: 'Exames' },
  { id: 2, label: 'Hipótese diagnóstica' },
  { id: 3, label: 'Conduta' },
];

const EXAMS = [
  ['Eletrocardiograma', true],
  ['Eletrocardiograma seriado', false],
  ['Troponina', true],
  ['CK-MB', false],
  ['Hemograma', false],
  ['Função renal', false],
  ['Radiografia de tórax', false],
  ['TC de tórax', false],
];

const StepContent = ({ activeStep, onAdvance }) => {
  const [selectedExams, setSelectedExams] = useState(['Eletrocardiograma', 'Troponina']);
  if (activeStep === 0) {
    return (
      <div className="preview-case-content preview-patient-step">
        <span className="preview-panel-kicker">Dados iniciais</span>
        <h3>Antes de decidir, observe o que muda a prioridade.</h3>
        <div className="preview-case-note">
          <FiUser aria-hidden="true" />
          <p>
            Homem, 58 anos, com dor torácica em aperto há 40 minutos, sudorese e náusea.
            Antecedentes de hipertensão e dislipidemia.
          </p>
        </div>
        <button type="button" className="preview-case-next" onClick={onAdvance}>
          Solicitar exames <FiArrowRight aria-hidden="true" />
        </button>
      </div>
    );
  }

  if (activeStep === 1) {
    return (
      <div className="preview-case-content preview-exams-step">
        <span className="preview-panel-kicker">Exames complementares</span>
        <h3>Quais exames você solicita neste momento?</h3>
        <div className="preview-exam-search"><FiSearch aria-hidden="true" /> Demonstração interativa</div>
        <div className="preview-exam-grid">
          {EXAMS.map(([exam]) => (

            <button type="button" aria-pressed={selectedExams.includes(exam)} onClick={() => setSelectedExams(current => current.includes(exam) ? current.filter(item => item !== exam) : [...current, exam])} className={`preview-exam-option${selectedExams.includes(exam) ? ' is-selected' : ''}`} key={exam}>
              <span>{selectedExams.includes(exam) && <FiCheck aria-hidden="true" />}</span>
              {exam}
            </button>
          ))}
        </div>
        <div className="preview-case-guidance">
          Selecione apenas o que pode orientar sua decisão agora.
        </div>
        <button type="button" className="preview-case-next" onClick={onAdvance}>
          Avançar <FiArrowRight aria-hidden="true" />
        </button>
      </div>
    );
  }

  if (activeStep === 2) {
    return (
      <div className="preview-case-content preview-hypothesis-step">
        <span className="preview-panel-kicker">Hipótese diagnóstica</span>
        <h3>Organize os achados antes de nomear o diagnóstico.</h3>
        <div className="preview-reasoning-field">
          <small>Sua hipótese principal</small>
          <p>Síndrome coronariana aguda, com necessidade de estratificação imediata.</p>
        </div>
        <div className="preview-reasoning-tags">
          <span>Dor típica</span><span>Fatores de risco</span><span>Tempo de início</span>
        </div>
        <button type="button" className="preview-case-next" onClick={onAdvance}>
          Definir conduta <FiArrowRight aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div className="preview-case-content preview-conduct-step">
      <span className="preview-panel-kicker">Conduta</span>
      <h3>Priorize segurança, tratamento e reavaliação.</h3>
      <div className="preview-conduct-list">
        <span><FiCheck aria-hidden="true" /> Monitorização e acesso venoso</span>
        <span><FiCheck aria-hidden="true" /> ECG e marcadores seriados</span>
        <span><FiCheck aria-hidden="true" /> Terapia inicial conforme risco</span>
      </div>
      <div className="preview-synapse-note">
        <FiActivity aria-hidden="true" />
        <p><strong>A Synapse analisa sua decisão completa.</strong> Exames, hipótese e conduta entram no mesmo feedback.</p>
      </div>
      <button type="button" className="preview-case-next" onClick={onAdvance}>
        Ver feedback <FiArrowRight aria-hidden="true" />
      </button>
    </div>
  );
};

const HomePreviewHero = ({ activeStep, setActiveStep, isPaused, setIsPaused }) => {
  const tabListRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 760px)');
  const reduceMotion = useReducedMotion();

  const selectStep = (index) => setActiveStep(Math.max(0, Math.min(CASE_STEPS.length - 1, index)));

  const handleKeyDown = (event, index) => {
    const destinations = {
      ArrowLeft: index === 0 ? CASE_STEPS.length - 1 : index - 1,
      ArrowRight: index === CASE_STEPS.length - 1 ? 0 : index + 1,
      Home: 0,
      End: CASE_STEPS.length - 1,
    };
    if (destinations[event.key] === undefined) return;
    event.preventDefault();
    selectStep(destinations[event.key]);
    tabListRef.current?.querySelectorAll('[role="tab"]')[destinations[event.key]]?.focus();
  };

  return (
    <section id="inicio" className="preview-hero" aria-labelledby="preview-hero-title">
      <ChromaticWavesBackground
        bgColor="#041b2d"
        colors={[
          'rgba(4, 39, 61, .28)',
          'rgba(18, 105, 236, .56)',
          'rgba(34, 190, 242, .52)',
          'rgba(112, 94, 238, .38)',
        ]}
        speed={0.24}
      />
      <div className="preview-hero-dots" aria-hidden="true" />
      <div className="preview-aurora" aria-hidden="true" /><div className="preview-aurora is-second" aria-hidden="true" />

      <header className="preview-topbar">
        <Link to="/" className="preview-brand" aria-label="MedSync, página inicial">
          <img src="/logo-medsync.png" alt="MedSync" />
        </Link>
        <div className="preview-topbar-actions">
          <Link to="/login" className="preview-login">Entrar</Link>
          <Link to="/cadastro" className="preview-signup">
            Criar conta grátis <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </header>

      <div className="preview-hero-copy">
        <span className="preview-eyebrow is-dark">Estudo que se transforma em decisão</span>
        <h1 id="preview-hero-title" aria-label="Treine decisões. Não apenas respostas.">Treine <em>decisões.</em><br />Não apenas respostas.</h1>
        <p>Casos clínicos interativos para desenvolver raciocínio, conduta e segurança antes da prática real.</p>
      </div>

      <div className="preview-case-layout">
        <div className="preview-case-shell">
          <div className="preview-case-window" onPointerDown={() => setIsPaused(true)} onFocus={() => setIsPaused(true)}>
            <aside className="preview-case-sidebar">
              <div className="preview-case-title"><FiClipboard aria-hidden="true" /> Caso clínico <span>{activeStep + 1}/4</span></div>
              <div
                ref={tabListRef}
                className="preview-case-steps"
                role="tablist"
                aria-label="Etapas do caso clínico"
                style={{ '--case-progress': `${(activeStep / (CASE_STEPS.length - 1)) * 100}%` }}
              >
                {CASE_STEPS.map((step, index) => (
                  <button
                    type="button"
                    role="tab"
                    key={step.label}
                    id={`preview-case-tab-${index}`}
                    aria-selected={activeStep === index}
                    aria-controls="preview-case-panel"
                    aria-label={step.label}
                    tabIndex={activeStep === index ? 0 : -1}
                    className={activeStep === index ? 'is-active' : ''}
                    onClick={() => selectStep(index)}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                  >
                    <span>{index < activeStep ? <FiCheck aria-hidden="true" /> : index + 1}</span>
                    {step.label}
                  </button>
                ))}
              </div>
              <div className="preview-patient-card">
                <FiUser aria-hidden="true" />
                <div><small>Paciente</small><strong>Homem, 58 anos</strong><small>Dor torácica há 40 minutos</small></div>
              </div>
            </aside>

            <div
              id="preview-case-panel"
              className="preview-case-main"
              role="tabpanel"
              aria-labelledby={`preview-case-tab-${activeStep}`}
              tabIndex={0}
            >
              <AnimatePresence mode="wait" initial={false}>
                <Motion.div
                  key={activeStep}
                  className="preview-case-motion-panel"
                  initial={isMobile && !reduceMotion ? { opacity: 0, x: 18 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  exit={isMobile && !reduceMotion ? { opacity: 0, x: -10 } : { opacity: 1 }}
                  transition={{ duration: reduceMotion ? 0 : 0.36, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <StepContent
                    activeStep={activeStep}
                    onAdvance={() => selectStep((activeStep + 1) % CASE_STEPS.length)}
                  />
                </Motion.div>
              </AnimatePresence>
            </div>

            <aside className="preview-vitals-panel" aria-label="Sinais vitais e exame físico">
              <div className="preview-vitals-heading"><strong>Sinais vitais</strong><span>Estável</span></div>
              <div className="preview-vitals-grid">
                <div><small>PA</small><strong>150/90</strong><span>mmHg</span></div>
                <div><small>FC</small><strong>98</strong><span>bpm</span></div>
                <div><small>FR</small><strong>20</strong><span>irpm</span></div>
                <div><small>Temp.</small><strong>36,8</strong><span>°C</span></div>
                <div><small>SpO₂</small><strong>96</strong><span>%</span></div>
                <div><small>Dor</small><strong>7/10</strong><span>EVA</span></div>
              </div>
              <div className="preview-physical-exam">
                <strong>Exame físico</strong>
                <p>Consciente, orientado e sudorético. Ausculta cardíaca sem sopros. MV+ bilateral.</p>
              </div>
            </aside>
          </div>
          <button
            type="button"
            className="preview-playback"
            aria-label={isPaused ? 'Retomar demonstração automática' : 'Pausar demonstração automática'}
            aria-pressed={isPaused}
            onClick={() => setIsPaused((current) => !current)}
          >
            {isPaused ? <FiPlay aria-hidden="true" /> : <FiPause aria-hidden="true" />}
          </button>
        </div>

        <aside className="preview-case-promise" data-motion-card>
          <FiActivity aria-hidden="true" />
          <h2>Mais que casos.<br />Uma experiência real de raciocínio clínico.</h2>
          <ul>
            <li><FiCheck /> Exames com propósito</li>
            <li><FiCheck /> Evolução dinâmica</li>
            <li><FiCheck /> Feedback da Synapse</li>
            <li><FiCheck /> Aprendizado contínuo</li>
          </ul>
        </aside>
      </div>

      <a className="preview-scroll-cue" href="#synapse" aria-label="Ir para a próxima seção">
        Role para explorar <FiArrowRight aria-hidden="true" />
      </a>

      <div className="preview-hero-bridge" aria-hidden="true" />
    </section>
  );
};

export default HomePreviewHero;
