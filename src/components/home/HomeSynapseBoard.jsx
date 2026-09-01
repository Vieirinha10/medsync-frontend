import { FiAward, FiCheckCircle, FiCpu, FiShield, FiZap } from 'react-icons/fi';

const HomeSynapseBoard = ({
  activeSynapsePillar,
  setActiveSynapsePillar,
  scrollyStepRefs,
  MEDICAL_BOARD_EXAMINERS,
}) => {
  const activeExaminer = MEDICAL_BOARD_EXAMINERS[activeSynapsePillar]
    || MEDICAL_BOARD_EXAMINERS[0];

  return (
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
  );
};

export default HomeSynapseBoard;
