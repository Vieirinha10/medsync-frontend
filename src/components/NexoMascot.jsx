const NEXO_STATES = {
  idle: { file: 'idle.gif', label: 'Nexo aguardando' },
  movingRight: { file: 'running-right.gif', label: 'Nexo se movimentando' },
  movingLeft: { file: 'running-left.gif', label: 'Nexo retornando' },
  waving: { file: 'waving.gif', label: 'Nexo dando boas-vindas' },
  celebrating: { file: 'jumping.gif', label: 'Nexo comemorando seu progresso' },
  encouraging: { file: 'failed.gif', label: 'Nexo incentivando uma nova tentativa' },
  waiting: { file: 'waiting.gif', label: 'Nexo aguardando sua decisão' },
  working: { file: 'running.gif', label: 'Nexo acompanhando a análise da Synapse' },
  reviewing: { file: 'review.gif', label: 'Nexo revisando o resultado' },
};

const NexoMascot = ({
  state = 'idle',
  message,
  size = 'medium',
  className = '',
  decorative = false,
}) => {
  const selectedState = NEXO_STATES[state] || NEXO_STATES.idle;

  return (
    <div className={`nexo-mascot nexo-mascot--${size} ${className}`.trim()}>
      <span className="nexo-mascot__halo" aria-hidden="true" />
      <img
        src={`/nexo/${selectedState.file}`}
        alt={decorative ? '' : selectedState.label}
        aria-hidden={decorative ? 'true' : undefined}
        className="nexo-mascot__image"
      />
      {message ? (
        <div className="nexo-mascot__message">
          <strong>Nexo</strong>
          <span>{message}</span>
        </div>
      ) : null}
    </div>
  );
};

export { NEXO_STATES };
export default NexoMascot;
