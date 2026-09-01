import {
  FiActivity,
  FiCheckCircle,
  FiCpu,
  FiFileText,
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

  const handleTabKeyDown = (event, currentIndex) => {
    const lastIndex = steps.length - 1;
    const destinationByKey = {
      ArrowLeft: currentIndex === 0 ? lastIndex : currentIndex - 1,
      ArrowRight: currentIndex === lastIndex ? 0 : currentIndex + 1,
      Home: 0,
      End: lastIndex,
    };
    const nextIndex = destinationByKey[event.key];

    if (nextIndex === undefined) return;

    event.preventDefault();
    setActiveStep(nextIndex);
    event.currentTarget.parentElement?.querySelectorAll('[role="tab"]')[nextIndex]?.focus();
  };

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

      <div
        className="synapse-process-nav"
        role="tablist"
        aria-label="Etapas da análise educacional da Synapse"
      >
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = activeStep === index;
          const isComplete = index < activeStep;

          return (
            <button
              type="button"
              role="tab"
              key={step.id}
              id={`synapse-process-tab-${step.id}`}
              className={`synapse-process-nav-item${isActive ? ' is-active' : ''}${isComplete ? ' is-complete' : ''}`}
              aria-selected={isActive}
              aria-controls="synapse-process-panel"
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveStep(index)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
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
      </div>

      <div className="synapse-process-layout">
        <div className="synapse-process-story">
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
                aria-current={isActive ? 'step' : undefined}
                className={`synapse-process-step${isActive ? ' is-active' : ''}`}
                style={{ '--step-color': step.color }}
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
          <article
            id="synapse-process-panel"
            className="synapse-process-terminal"
            role="tabpanel"
            aria-labelledby={`synapse-process-tab-${currentStep.id}`}
            tabIndex={0}
          >
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

      <div className="synapse-integrated-result" aria-labelledby="synapse-result-title">
        <header className="synapse-result-intro">
          <span className="section-eyebrow-tag">
            <FiCheckCircle aria-hidden="true" />
            RESULTADO ORGANIZADO PARA EVOLUIR
          </span>
          <h2 id="synapse-result-title">É assim que suas decisões voltam para você.</h2>
          <p>
            A devolutiva reúne desempenho, justificativa clínica e próximos passos em uma única
            leitura — sem esconder uma conduta incompleta atrás de uma boa hipótese.
          </p>
        </header>

        <div className="result-preview-shell">
          <span className="result-preview-label">SYNAPSE · PRÉVIA DO FEEDBACK PERSONALIZADO</span>

          <div className="result-preview-main">
            <article className="preview-score-card">
              <small>NOTA GERAL</small>
              <div className="preview-score-ring" aria-label="Nota geral 8,4 de 10">
                <strong>8,4</strong>
                <span>DE 10</span>
              </div>
              <h3>Bom raciocínio, com uma prioridade a corrigir.</h3>
              <p>A hipótese foi bem construída; a conduta precisa explicitar reavaliação e critérios de deterioração.</p>
            </article>

            <div className="preview-clinical-cards">
              <article>
                <span><FiCheckCircle aria-hidden="true" /></span>
                <div>
                  <small>O QUE VOCÊ FEZ BEM</small>
                  <h3>Reconheceu o padrão clínico e investigou com intenção.</h3>
                  <p>Você relacionou dor pós-prandial, febre e sinal de Murphy, priorizando ultrassonografia e hipótese de colecistite aguda.</p>
                </div>
              </article>

              <article>
                <span><FiTrendingUp aria-hidden="true" /></span>
                <div>
                  <small>ONDE PODE EVOLUIR</small>
                  <h3>Complete a sequência de cuidado após a conduta inicial.</h3>
                  <p>Inclua monitorização, reavaliação clínica e critérios objetivos para reconhecer deterioração ou necessidade de escalonamento.</p>
                </div>
              </article>
            </div>
          </div>

          <div className="synapse-result-detail-grid">
            <article className="synapse-result-exams">
              <header>
                <FiFileText aria-hidden="true" />
                <div>
                  <small>ANÁLISE DOS EXAMES</small>
                  <strong>Cada solicitação recebe uma justificativa.</strong>
                </div>
              </header>
              <div className="synapse-exam-groups">
                <span className="is-good"><small>Bons</small>Hemograma · PCR · Ultrassonografia</span>
                <span className="is-missing"><small>Faltante</small>Provas de função hepática</span>
                <span className="is-low-value"><small>Baixo valor inicial</small>Tomografia abdominal</span>
              </div>
            </article>

            <article className="synapse-result-safety">
              <header>
                <FiShield aria-hidden="true" />
                <div>
                  <small>SEGURANÇA DO PACIENTE</small>
                  <strong>Reavaliação precisa fazer parte da conduta.</strong>
                </div>
              </header>
              <p>Sem monitorização e critérios de piora, uma evolução desfavorável pode ser reconhecida tarde.</p>
            </article>
          </div>

          <div className="preview-improvement-plan">
            <div>
              <FiTarget aria-hidden="true" />
              <span>
                <small>PLANO RÁPIDO DE MELHORIA</small>
                <strong>Próximos pontos para revisar</strong>
              </span>
            </div>
            <p>1. Reavaliação seriada</p>
            <p>2. Critérios de deterioração</p>
            <p>3. Sequência terapêutica</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSynapseProcess;
