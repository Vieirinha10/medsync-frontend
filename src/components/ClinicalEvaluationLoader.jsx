import { useEffect, useState } from 'react';
import { FiActivity, FiCheck } from 'react-icons/fi';

const ANALYSIS_STAGES = [
  'Organizando o prontuário',
  'Revisando o valor dos exames',
  'Comparando a hipótese com a rubrica',
  'Simulando a resposta à conduta',
  'Preparando a devolutiva Synapse',
];

const ClinicalEvaluationLoader = ({ caseTitle }) => {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStage((currentStage) => (
        Math.min(currentStage + 1, ANALYSIS_STAGES.length - 1)
      ));
    }, 1350);

    return () => window.clearInterval(interval);
  }, []);

  const progress = Math.min(18 + (activeStage * 19), 94);

  return (
    <section
      className="clinical-evaluation-loader page-container"
      role="status"
      aria-live="polite"
      aria-label="Avaliação clínica em andamento"
    >
      <div className="evaluation-ambient" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="evaluation-loader-card">
        <div className="evaluation-loader-visual" aria-hidden="true">
          <span className="evaluation-orbit evaluation-orbit-outer" />
          <span className="evaluation-orbit evaluation-orbit-inner" />
          <span className="evaluation-pulse" />
          <span className="evaluation-icon">
            <FiActivity />
          </span>
        </div>

        <span className="evaluation-loader-kicker">SYNAPSE · ANÁLISE CLÍNICA</span>
        <h1>A Synapse está avaliando seu raciocínio</h1>
        <p className="evaluation-loader-description">
          Sua hipótese, seus exames e sua conduta estão sendo comparados com a rubrica revisada
          {caseTitle ? ` de “${caseTitle}”` : ' deste caso'}.
        </p>

        <div className="evaluation-progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>

        <p className="evaluation-current-stage" key={activeStage}>
          {ANALYSIS_STAGES[activeStage]}
          <span className="evaluation-ellipsis" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </p>

        <ol className="evaluation-stage-list">
          {ANALYSIS_STAGES.map((stage, index) => {
            const isComplete = index < activeStage;
            const isActive = index === activeStage;

            return (
              <li
                key={stage}
                className={`${isComplete ? 'is-complete' : ''} ${isActive ? 'is-active' : ''}`}
              >
                <span className="evaluation-stage-marker" aria-hidden="true">
                  {isComplete ? <FiCheck /> : index + 1}
                </span>
                <span>{stage}</span>
              </li>
            );
          })}
        </ol>

        <small>Isso pode levar alguns segundos. Não feche esta página.</small>
      </div>
    </section>
  );
};

export default ClinicalEvaluationLoader;
