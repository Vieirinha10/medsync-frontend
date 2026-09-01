import {
  FiActivity,
  FiCheckCircle,
  FiCpu,
  FiLayers,
  FiShield,
  FiTarget,
  FiTrendingUp,
  FiZap,
} from 'react-icons/fi';

const HomeSynapseProcess = ({
  activeStep,
  setActiveStep,
  stepRefs,
  steps,
}) => {
  const currentStep = steps[activeStep] || steps[0];
  const CurrentIcon = currentStep.icon;
  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <section
      id="synapse-engine"
      className="home-synapse-section home-reveal"
      data-home-reveal
      aria-labelledby="synapse-home-title"
    >
      <header className="solid-section-heading home-synapse-heading">
        <span className="section-eyebrow-tag">
          <FiCpu aria-hidden="true" />
          ARQUITETURA MULTI-LLM · O CONCEITO DA BANCA MÉDICA
        </span>
        <h2 id="synapse-home-title">
          Synapse IA, a inteligência educativa do MedSync.<br />
          <span className="fluid-words-green">
            Consenso clínico alimentado por 5 redes neurais.
          </span>
        </h2>
        <p>
          A tecnologia trabalha nos bastidores para transformar uma resolução clínica completa em
          uma devolutiva clara. Acompanhe como a Synapse organiza as decisões, aplica a Rubrica
          Clínica 2.0 e entrega um próximo passo útil para o estudante.
        </p>
      </header>

      <nav className="synapse-process-nav" aria-label="Etapas da análise educacional da Synapse">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = activeStep === index;
          const isComplete = index < activeStep;

          return (
            <button
              type="button"
              key={step.id}
              className={`synapse-process-nav-item${isActive ? ' is-active' : ''}${isComplete ? ' is-complete' : ''}`}
              aria-current={isActive ? 'step' : undefined}
              onClick={() => setActiveStep(index)}
            >
              <span className="synapse-process-nav-icon">
                {isComplete ? <FiCheckCircle aria-hidden="true" /> : <StepIcon aria-hidden="true" />}
              </span>
              <span>
                <small>{step.code}</small>
                <strong>{step.label}</strong>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="synapse-process-layout">
        <div
          className="synapse-process-story"
          role="tablist"
          aria-label="Como a Synapse transforma decisões em feedback"
        >
          <div className="synapse-process-rail" aria-hidden="true">
            <span style={{ height: `${progress}%` }} />
          </div>

          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = activeStep === index;

            return (
              <article
                key={step.id}
                ref={(element) => (stepRefs.current[index] = element)}
                role="tab"
                tabIndex={0}
                aria-selected={isActive}
                className={`synapse-process-step${isActive ? ' is-active' : ''}`}
                style={{ '--step-color': step.color }}
                onClick={() => setActiveStep(index)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActiveStep(index);
                  }
                }}
              >
                <span className="synapse-process-node" aria-hidden="true">
                  <StepIcon />
                </span>
                <div className="synapse-process-step-meta">
                  <span>ETAPA {step.code}</span>
                  <small>{step.label}</small>
                </div>
                <h3>{step.title}</h3>
                <strong>{step.subtitle}</strong>
                <p>{step.description}</p>
                <div className="synapse-process-signal">
                  <FiActivity aria-hidden="true" />
                  <span>{step.signal}</span>
                </div>
              </article>
            );
          })}
        </div>

        <div className="synapse-process-sticky">
          <article className="synapse-process-terminal" aria-live="polite">
            <header className="synapse-terminal-header">
              <span className="synapse-terminal-status">
                <i aria-hidden="true" />
                ANÁLISE EDUCACIONAL EM TEMPO REAL
              </span>
              <span className="synapse-terminal-progress">
                <strong>{currentStep.code}</strong> / {String(steps.length).padStart(2, '0')}
              </span>
            </header>

            <div className="synapse-data-morph" aria-label={`Processamento atual: ${currentStep.label}`}>
              <div className="synapse-data-morph-track" aria-hidden="true">
                <span style={{ width: `${progress}%` }} />
              </div>
              <div className="synapse-data-morph-nodes">
                {steps.map((step, index) => {
                  const NodeIcon = step.icon;
                  const isActive = activeStep === index;
                  const isComplete = index < activeStep;

                  return (
                    <span
                      key={step.id}
                      className={`synapse-morph-node${isActive ? ' is-active' : ''}${isComplete ? ' is-complete' : ''}`}
                    >
                      {isComplete ? <FiCheckCircle /> : <NodeIcon />}
                    </span>
                  );
                })}
              </div>
              <div className="synapse-morph-source">
                <FiLayers aria-hidden="true" />
                <span>RESPOSTA LIVRE</span>
                <FiZap aria-hidden="true" />
                <span>FEEDBACK ESTRUTURADO</span>
              </div>
            </div>

            <div className="synapse-terminal-body" key={currentStep.id}>
              <div className="synapse-terminal-step-label" style={{ color: currentStep.color }}>
                <CurrentIcon aria-hidden="true" />
                <span>{currentStep.label}</span>
                <small>{currentStep.signal}</small>
              </div>
              <h3>{currentStep.title}</h3>
              <p>{currentStep.subtitle}</p>

              <div className="synapse-terminal-reading" style={{ '--step-color': currentStep.color }}>
                <span>LEITURA DA SYNAPSE</span>
                <strong>{currentStep.sample}</strong>
              </div>

              <div className="synapse-terminal-dimensions" aria-label="Dimensões da avaliação clínica">
                <div>
                  <FiLayers aria-hidden="true" />
                  <span>Exames</span>
                  <strong>8,7</strong>
                </div>
                <div>
                  <FiTarget aria-hidden="true" />
                  <span>Hipótese</span>
                  <strong>9,2</strong>
                </div>
                <div>
                  <FiShield aria-hidden="true" />
                  <span>Conduta</span>
                  <strong>7,4</strong>
                </div>
              </div>

              <div className={`synapse-terminal-outcome${activeStep === steps.length - 1 ? ' is-ready' : ''}`}>
                {activeStep === steps.length - 1 ? (
                  <>
                    <FiCheckCircle aria-hidden="true" />
                    <div>
                      <strong>Feedback personalizado pronto</strong>
                      <small>Acertos, omissões, segurança e plano de melhoria organizados.</small>
                    </div>
                  </>
                ) : (
                  <>
                    <FiTrendingUp aria-hidden="true" />
                    <div>
                      <strong>Construindo a devolutiva</strong>
                      <small>Cada etapa acrescenta contexto à orientação final.</small>
                    </div>
                  </>
                )}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default HomeSynapseProcess;
