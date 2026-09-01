import { FiActivity, FiCheckCircle, FiLayers } from 'react-icons/fi';

const HomeFeedbackSection = ({
  activeFeedbackStep,
  setActiveFeedbackStep,
  activeFeedback,
  FEEDBACK_STEPS,
}) => (
  <>
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
  </>
);

export default HomeFeedbackSection;
