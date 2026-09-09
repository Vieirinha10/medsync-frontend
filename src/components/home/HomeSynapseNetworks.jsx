import { useEffect, useRef, useState } from 'react';
import '../../styles/home-synapse-networks.css';

// Configuração das 5 Redes Neurais com as imagens oficiais, identidades das empresas e explicações detalhadas
const AI_NETWORKS = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    desc: 'Raciocínio clínico e explicações claras.',
    explanation: 'Transforma raciocínios complexos em explicações claras, estruturadas e fáceis de aplicar.',
    tag: 'OPENAI',
    iconSrc: '/images/ai-icons/chatgpt.png',
    cardClass: 'card-chatgpt',
    tagClass: 'tag-openai',
  },
  {
    id: 'grok',
    name: 'Grok',
    desc: 'Análises críticas e perspectivas únicas.',
    explanation: 'Desafia hipóteses, explora caminhos alternativos e reduz conclusões precipitadas.',
    tag: 'xAI',
    iconSrc: '/images/ai-icons/grok.png',
    cardClass: 'card-grok',
    tagClass: 'tag-xai',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    desc: 'Síntese de informações e visão multimodal.',
    explanation: 'Conecta dados, sinais, exames e contexto para formar uma visão mais completa do paciente.',
    tag: 'GOOGLE',
    iconSrc: '/images/ai-icons/gemini.png',
    cardClass: 'card-gemini',
    tagClass: 'tag-google',
  },
  {
    id: 'claude',
    name: 'Claude',
    desc: 'Respostas seguras e bem estruturadas.',
    explanation: 'Aprofunda o caso, identifica nuances e ajuda a construir uma avaliação clínica mais criteriosa.',
    tag: 'ANTHROPIC',
    iconSrc: '/images/ai-icons/claude.png',
    cardClass: 'card-claude',
    tagClass: 'tag-anthropic',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    desc: 'Alta performance e raciocínio avançado.',
    explanation: 'Organiza possibilidades, compara condutas e busca o caminho mais objetivo para a decisão.',
    tag: 'DEEPSEEK',
    iconSrc: '/images/ai-icons/deepseek.png',
    cardClass: 'card-deepseek',
    tagClass: 'tag-deepseek',
  },
];

const HomeSynapseNetworks = () => {
  const sectionRef = useRef(null);
  const [flippedCard, setFlippedCard] = useState(null);
  // No ambiente de teste / SSR, inicializamos como 1 para manter o conteúdo visível aos testes
  const [scrollProgress, setScrollProgress] = useState(() => {
    return typeof window !== 'undefined' && window.innerHeight ? 0 : 1;
  });

  useEffect(() => {
    let ticking = false;

    const calculateScroll = () => {
      const el = sectionRef.current;
      if (!el || typeof window === 'undefined') return;

      const rect = el.getBoundingClientRect();
      const totalScrollable = el.offsetHeight - window.innerHeight;

      // Se a tela for menor que a altura necessária (ex.: telas móveis onde a seção não fixa), revela tudo
      if (totalScrollable <= 20) {
        setScrollProgress(1);
        return;
      }

      // Quando o topo da seção encosta no topo do viewport (rect.top <= 0), começa a contagem de 0 a 1
      const current = -rect.top;
      const progress = Math.min(Math.max(current / totalScrollable, 0), 1);
      setScrollProgress(progress);
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
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
    };
  }, []);

  // 1. Aparição do Cabeçalho: surge suavemente entre 0% e 15% do scroll
  const headerOpacity = Math.min(Math.max(scrollProgress / 0.14, 0), 1);
  const headerY = (1 - headerOpacity) * 28;

  // 2. Trajetória do Feixe Laser Verde: corta a página de 10% a 92% do scroll
  const beamRatio = Math.min(Math.max((scrollProgress - 0.10) / 0.82, 0), 1);
  const laserWidthCalc = `calc(${beamRatio * 100}% + ${beamRatio * 24}vw)`;
  const sparkOpacity = beamRatio > 0.02 && beamRatio < 0.99 ? 1 : (beamRatio >= 0.99 ? 0.7 : 0);

  // 3. Aparição escalonada dos 5 Cards conforme o laser os alcança
  const getCardStyle = (index) => {
    // 5 cards distribuídos ao longo do percurso do laser
    // Card 0: 0.06 -> 0.20
    // Card 1: 0.25 -> 0.39
    // Card 2: 0.44 -> 0.58
    // Card 3: 0.63 -> 0.77
    // Card 4: 0.82 -> 0.96 (último card conclui a seção)
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
              Mais perspectivas. Respostas mais completas. Um raciocínio ainda mais confiável.
            </span>
            <h2 id="synapse-networks-title" className="synapse-networks-title">
              Imagine uma <span className="synapse-highlight-green">Inteligência Educativa</span> na palma da sua mão, com um consenso clínico alimentado pelas 5 redes neurais líderes do mundo
            </h2>
          </header>

          <div className="synapse-beam-track-wrapper">
            {/* Feixe laser verde controlado milimetricamente pelo scroll */}
            <div
              className="synapse-laser-beam"
              aria-hidden="true"
              style={{
                '--laser-width': laserWidthCalc,
              }}
            >
              {/* Símbolo "S" da Synapse na ponta condutora do feixe */}
              <div
                className="synapse-laser-symbol"
                style={{
                  '--symbol-opacity': sparkOpacity,
                }}
                aria-label="Símbolo Synapse"
              >
                <img
                  src="/images/synapse-s-symbol-green.png"
                  alt="Synapse"
                  className="synapse-symbol-img"
                />
                <div className="synapse-symbol-glow-aura" />
              </div>
            </div>

            {/* Grid com os 5 cards das IAs com efeito 3D flip ao passar o mouse ou tocar */}
            <div className="synapse-cards-grid" role="list">
              {AI_NETWORKS.map((network, index) => {
                const { id, name, desc, explanation, tag, iconSrc, cardClass, tagClass } = network;
                const isFlipped = flippedCard === id;

                return (
                  <article
                    key={id}
                    className={`synapse-network-card ${cardClass} ${isFlipped ? 'is-flipped' : ''}`}
                    role="listitem"
                    style={getCardStyle(index)}
                    onClick={() => setFlippedCard(isFlipped ? null : id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setFlippedCard(isFlipped ? null : id);
                      }
                    }}
                    tabIndex={0}
                    aria-label={`${name}: ${desc}. Clique ou passe o cursor para ver a explicação.`}
                  >
                    <div className="synapse-card-flip-inner">
                      {/* Face Frontal do Card */}
                      <div className="synapse-card-face synapse-card-front">
                        <div className="synapse-card-ambient-glow" aria-hidden="true" />
                        <div className="synapse-card-icon-wrapper" aria-hidden="true">
                          <img
                            src={iconSrc}
                            alt={`Ícone original de ${name}`}
                            className="synapse-card-ai-img"
                            loading="eager"
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

                      {/* Face Traseira do Card com a Explicação Clínica */}
                      <div className="synapse-card-face synapse-card-back">
                        <div className="synapse-card-ambient-glow" aria-hidden="true" />
                        <div className="synapse-card-back-header">
                          <div className="synapse-card-back-icon-mini" aria-hidden="true">
                            <img
                              src={iconSrc}
                              alt=""
                              className="synapse-card-ai-img-mini"
                              loading="eager"
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
                          <span className="synapse-card-back-role-pill">Rede Ativa</span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSynapseNetworks;
