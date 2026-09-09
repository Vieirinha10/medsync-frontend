import { useEffect, useRef, useState } from 'react';
import '../../styles/home-synapse-networks.css';

const AI_NETWORKS = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    desc: 'Estruturação do raciocínio e explicações claras.',
    explanation: 'Organiza o raciocínio clínico e transforma pontos complexos em uma explicação direta.',
    tag: 'OPENAI',
    iconSrc: '/images/ai-icons/chatgpt.png',
    cardClass: 'card-chatgpt',
    tagClass: 'tag-openai',
  },
  {
    id: 'grok',
    name: 'Grok',
    desc: 'Auditoria crítica e hipóteses alternativas.',
    explanation: 'Questiona hipóteses, procura contraindicações e amplia a análise dos diagnósticos diferenciais.',
    tag: 'xAI',
    iconSrc: '/images/ai-icons/grok.png',
    cardClass: 'card-grok',
    tagClass: 'tag-xai',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    desc: 'Integração de dados e contexto multimodal.',
    explanation: 'Conecta sinais, exames, contexto e informações multimodais em uma visão integrada do caso.',
    tag: 'GOOGLE',
    iconSrc: '/images/ai-icons/gemini.png',
    cardClass: 'card-gemini',
    tagClass: 'tag-google',
  },
  {
    id: 'claude',
    name: 'Claude',
    desc: 'Análise cuidadosa e síntese pedagógica.',
    explanation: 'Aprofunda as nuances do caso e transforma a análise em uma síntese pedagógica e cuidadosa.',
    tag: 'ANTHROPIC',
    iconSrc: '/images/ai-icons/claude.png',
    cardClass: 'card-claude',
    tagClass: 'tag-anthropic',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    desc: 'Comparação lógica de hipóteses e condutas.',
    explanation: 'Compara hipóteses, relações de causa e efeito e possíveis condutas com raciocínio estruturado.',
    tag: 'DEEPSEEK',
    iconSrc: '/images/ai-icons/deepseek.png',
    cardClass: 'card-deepseek',
    tagClass: 'tag-deepseek',
  },
];

const HomeSynapseNetworks = () => {
  const sectionRef = useRef(null);
  const [flippedCard, setFlippedCard] = useState(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => (
    typeof window !== 'undefined'
      ? Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches)
      : true
  ));
  const [scrollProgress, setScrollProgress] = useState(() => {
    return typeof window !== 'undefined' && window.innerHeight ? 0 : 1;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = (event) => setPrefersReducedMotion(event.matches);

    setPrefersReducedMotion(motionPreference.matches);
    motionPreference.addEventListener?.('change', updateMotionPreference);

    return () => motionPreference.removeEventListener?.('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setScrollProgress(1);
      return undefined;
    }

    let ticking = false;
    let frameId = null;

    const calculateScroll = () => {
      const el = sectionRef.current;
      if (!el || typeof window === 'undefined') return;

      const rect = el.getBoundingClientRect();
      const totalScrollable = el.offsetHeight - window.innerHeight;

      if (totalScrollable <= 20) {
        setScrollProgress(1);
        return;
      }

      const current = -rect.top;
      const progress = Math.min(Math.max(current / totalScrollable, 0), 1);
      setScrollProgress(progress);
    };

    const onScroll = () => {
      if (!ticking) {
        frameId = window.requestAnimationFrame(() => {
          calculateScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    calculateScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [prefersReducedMotion]);

  const headerOpacity = Math.min(Math.max(scrollProgress / 0.14, 0), 1);
  const headerY = (1 - headerOpacity) * 28;

  const beamRatio = Math.min(Math.max((scrollProgress - 0.10) / 0.82, 0), 1);
  const laserWidthCalc = `calc(${beamRatio * 100}% + ${beamRatio * 24}vw)`;
  const sparkOpacity = beamRatio > 0.02 && beamRatio < 0.99 ? 1 : (beamRatio >= 0.99 ? 0.7 : 0);

  const getCardStyle = (index) => {
    const start = 0.06 + index * 0.19;
    const end = start + 0.14;

    let cardRatio = 0;
    if (beamRatio <= start) {
      cardRatio = 0;
    } else if (beamRatio >= end) {
      cardRatio = 1;
    } else {
      cardRatio = (beamRatio - start) / (end - start);
    }

    return {
      '--card-opacity': cardRatio,
      '--card-y': `${(1 - cardRatio) * 32}px`,
      '--card-scale': 0.93 + cardRatio * 0.07,
    };
  };

  return (
    <section
      id="synapse-networks"
      ref={sectionRef}
      className="home-synapse-networks-section"
      aria-labelledby="synapse-networks-title"
    >
      <div className="synapse-sticky-stage">
        <div className="synapse-networks-glow" aria-hidden="true" />

        <div className="synapse-networks-content">
          <header
            className="synapse-networks-header"
            style={{
              '--header-opacity': headerOpacity,
              '--header-y': `${headerY}px`,
            }}
          >
            <span className="synapse-networks-eyebrow">
              CINCO IAs ATIVAS · UMA ÚNICA SYNAPSE
            </span>
            <h2 id="synapse-networks-title" className="synapse-networks-title">
              Cinco das principais inteligências artificiais do mundo,
              {' '}
              <span className="synapse-highlight-green">integradas em uma única experiência educacional.</span>
            </h2>
            <p className="synapse-networks-lead">
              ChatGPT, Grok, Gemini, Claude e DeepSeek atuam em papéis complementares. A Synapse
              organiza essas perspectivas em um feedback clínico claro e voltado para o seu aprendizado.
            </p>
          </header>

          <div className="synapse-beam-track-wrapper">
            <div
              className="synapse-laser-beam"
              aria-hidden="true"
              style={{
                '--laser-width': laserWidthCalc,
              }}
            >
              <div
                className="synapse-laser-symbol"
                style={{
                  '--symbol-opacity': sparkOpacity,
                }}
              >
                <img
                  src="/images/synapse-s-symbol-green.png"
                  alt=""
                  className="synapse-symbol-img"
                />
                <div className="synapse-symbol-glow-aura" />
              </div>
            </div>

            <div className="synapse-cards-grid" role="list">
              {AI_NETWORKS.map((network, index) => {
                const { id, name, desc, explanation, tag, iconSrc, cardClass, tagClass } = network;
                const isFlipped = flippedCard === id;

                return (
                  <article
                    key={id}
                    role="listitem"
                  >
                    <button
                      type="button"
                      className={`synapse-network-card ${cardClass} ${isFlipped ? 'is-flipped' : ''}`}
                      style={getCardStyle(index)}
                      onClick={() => setFlippedCard(isFlipped ? null : id)}
                      aria-expanded={isFlipped}
                      aria-controls={`synapse-card-details-${id}`}
                      aria-label={`${name}. ${desc} Pressione para ${isFlipped ? 'voltar' : 'conhecer seu papel no consenso'}.`}
                    >
                      <div className="synapse-card-flip-inner">
                        <div className="synapse-card-face synapse-card-front" aria-hidden={isFlipped}>
                          <div className="synapse-card-ambient-glow" aria-hidden="true" />
                          <div className="synapse-card-icon-wrapper" aria-hidden="true">
                            <img
                              src={iconSrc}
                              alt=""
                              className="synapse-card-ai-img"
                              loading="lazy"
                              width="52"
                              height="52"
                            />
                          </div>
                          <h3 className={`synapse-card-name name-${id}`}>{name}</h3>
                          <p className="synapse-card-desc">{desc}</p>
                          <span className={`synapse-card-tag ${tagClass}`}>{tag}</span>
                          <div className="synapse-card-flip-hint" aria-hidden="true">
                            <svg
                              className="synapse-flip-hint-icon"
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                              <path d="M21 3v5h-5" />
                              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                              <path d="M8 16H3v5" />
                            </svg>
                            <span>Virar card</span>
                          </div>
                        </div>

                        <div
                          id={`synapse-card-details-${id}`}
                          className="synapse-card-face synapse-card-back"
                          aria-hidden={!isFlipped}
                        >
                          <div className="synapse-card-ambient-glow" aria-hidden="true" />
                          <div className="synapse-card-back-header">
                            <div className="synapse-card-back-icon-mini" aria-hidden="true">
                              <img
                                src={iconSrc}
                                alt=""
                                className="synapse-card-ai-img-mini"
                                loading="lazy"
                                width="26"
                                height="26"
                              />
                            </div>
                            <span className="synapse-card-back-badge">Papel no Consenso</span>
                          </div>

                          <div className="synapse-card-back-body">
                            <span className={`synapse-card-back-name name-${id}`}>{name}</span>
                            <p className="synapse-card-back-explanation">{explanation}</p>
                          </div>

                          <div className="synapse-card-back-footer">
                            <span className="synapse-card-back-role-pill">IA ATIVA</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  </article>
                );
              })}
            </div>

            <div className="synapse-consensus-strip" aria-label="Como a Synapse transforma cinco perspectivas em feedback">
              <span>5 análises complementares</span>
              <span aria-hidden="true">→</span>
              <strong>1 consenso coordenado pela Synapse</strong>
              <span aria-hidden="true">→</span>
              <span>1 feedback para orientar sua evolução</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSynapseNetworks;
