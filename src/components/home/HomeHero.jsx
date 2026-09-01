import { Link } from 'react-router-dom';
import {
  FiActivity,
  FiArrowRight,
  FiCheck,
  FiCpu,
  FiEye,
  FiFileText,
  FiHeart,
  FiLayers,
  FiTarget,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi';

const HomeHero = ({
  activeHeroStep,
  setActiveHeroStep,
  setIsHeroPaused,
  HERO_SIMULATION_STEPS,
}) => (
      <section className="solid-hero" aria-label="Apresentação do MedSync">
        <div className="solid-hero-glow solid-hero-glow-one" aria-hidden="true" />
        <div className="solid-hero-glow solid-hero-glow-two" aria-hidden="true" />

        <div className="solid-hero-copy">
          <h1>
            O seu material não erra.
            <span className="hero-highlight-wrapper">
              <span className="hero-highlight-green">O seu raciocínio, às vezes sim.</span>
            </span>
          </h1>
          <p className="hero-lead-text">
            Você pode ter as melhores apostilas e resumos na estante, mas na hora de decidir na
            frente do paciente, o que está em jogo é o seu raciocínio clínico. O MedSync é onde você
            coloca suas decisões à prova antes da prática real.
          </p>
          <div className="solid-hero-actions">
            <Link to="/cadastro" className="solid-primary-button">
              Começar gratuitamente
              <FiArrowRight aria-hidden="true" />
            </Link>
            <a href="#synapse-engine" className="solid-ghost-button">
              Conhecer a Synapse IA
            </a>
          </div>
          <div className="solid-hero-proof" aria-label="Garantias da plataforma">
            <span><FiCpu aria-hidden="true" /> A capacidade das 5 maiores IAs do mercado em uma só</span>
            <span><FiLayers aria-hidden="true" /> 80 casos clínicos estruturados</span>
            <span><FiEye aria-hidden="true" /> 150 desafios visuais rápidos</span>
          </div>
        </div>

        {/* LADO DIREITO: DEMONSTRAÇÃO REAL EM 5 ETAPAS AUTÊNTICAS DA PLATAFORMA */}
        <div
          className="solid-hero-stage"
          aria-label="Demonstração interativa de um caso clínico no MedSync"
          onMouseEnter={() => setIsHeroPaused(true)}
          onMouseLeave={() => setIsHeroPaused(false)}
          onFocusCapture={() => setIsHeroPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setIsHeroPaused(false);
          }}
        >
          <div className="hero-real-case-window">
            {/* Top Bar com os 5 passos interativos */}
            <div className="real-case-tabs-bar" role="tablist" aria-label="Navegação entre as etapas da simulação">
              {HERO_SIMULATION_STEPS.map((step) => (
                <button
                  type="button"
                  role="tab"
                  key={step.id}
                  className={`real-case-step-btn${activeHeroStep === step.id ? ' is-active' : ''}`}
                  aria-selected={activeHeroStep === step.id}
                  onClick={() => setActiveHeroStep(step.id)}
                >
                  <span className="step-btn-title">{step.label}</span>
                  <div className="step-progress-indicator" />
                </button>
              ))}
            </div>

            {/* Cabeçalho do Caso */}
            <div className="real-case-subhead">
              <span className="case-specialty-badge">CIRURGIA</span>
              <span className="case-title-line">Caso #062 – Dor no hipocôndrio direito pós-prandial</span>
              <span className="case-step-counter">{String(activeHeroStep + 1).padStart(2, '0')}/05</span>
            </div>

            {/* CONTEÚDOS DAS 5 TELAS REAIS */}
            <div className="real-case-stage-screen" aria-live="polite">
              {/* TELA 1: APRESENTAÇÃO DO PACIENTE */}
              {activeHeroStep === 0 && (
                <div className="case-screen-view screen-paciente">
                  <div className="screen-section-header">
                    <small>01 · APRESENTAÇÃO DO PACIENTE</small>
                    <h3>Antes de decidir, observe.</h3>
                    <p>Leia o prontuário com calma e identifique os achados que mudam a prioridade clínica.</p>
                  </div>

                  <div className="patient-cards-dual">
                    <div className="patient-dual-card">
                      <div className="card-mini-title"><FiFileText /> Queixa e contexto</div>
                      <p>VRS, 44 anos, feminina, relata dor contínua no hipocôndrio direito há 18h após refeição gordurosa, com náuseas e vômitos. Nega icterícia.</p>
                    </div>
                    <div className="patient-dual-card">
                      <div className="card-mini-title"><FiUsers /> Achados ao exame físico</div>
                      <p>REG, desidratada +/4+. PA 118/74, FC 102 bpm, SpO2 98%, Tax 38.1 ºC. Dor e defesa no hipocôndrio direito com <strong>sinal de Murphy positivo</strong>.</p>
                    </div>
                  </div>

                  <div className="vitals-grid-mini">
                    <div className="vital-mini-card is-normal">
                      <div className="vital-mini-top">
                        <small>Pressão arterial</small>
                        <span className="vital-badge is-normal"><i /> Normal</span>
                      </div>
                      <div className="vital-mini-val">
                        <strong>118/74</strong> <span>mmHg</span>
                      </div>
                    </div>

                    <div className="vital-mini-card is-alert">
                      <div className="vital-mini-top">
                        <small>Freq. cardíaca</small>
                        <span className="vital-badge is-alert"><i /> Alterado</span>
                      </div>
                      <div className="vital-mini-val is-alert-text">
                        <strong>102</strong> <span>bpm</span>
                      </div>
                    </div>

                    <div className="vital-mini-card is-normal">
                      <div className="vital-mini-top">
                        <small>Saturação O2</small>
                        <span className="vital-badge is-normal"><i /> Normal</span>
                      </div>
                      <div className="vital-mini-val">
                        <strong>98</strong> <span>%</span>
                      </div>
                    </div>

                    <div className="vital-mini-card is-alert">
                      <div className="vital-mini-top">
                        <small>Temperatura</small>
                        <span className="vital-badge is-alert"><i /> Alterado</span>
                      </div>
                      <div className="vital-mini-val is-alert-text">
                        <strong>38.1</strong> <span>ºC</span>
                      </div>
                    </div>
                  </div>

                  <div className="screen-footer-actions">
                    <span className="selected-count-pill"><FiCheck /> Prontuário analisado</span>
                    <button type="button" className="screen-btn-primary" onClick={() => setActiveHeroStep(1)}>
                      Iniciar investigação <FiArrowRight />
                    </button>
                  </div>
                </div>
              )}

              {/* TELA 2: INVESTIGAÇÃO DE EXAMES */}
              {activeHeroStep === 1 && (
                <div className="case-screen-view screen-exames">
                  <div className="screen-section-header">
                    <small>02 · INVESTIGAÇÃO</small>
                    <h3>Quais avaliações e exames mudariam sua decisão?</h3>
                    <p>Escolha com intenção. Exames essenciais, omitidos e de baixo valor são auditados no feedback.</p>
                  </div>

                  <div className="exam-selection-grid">
                    <div className="exam-option-card is-selected">
                      <span className="exam-check-icon"><FiCheck /></span>
                      <div>
                        <strong>Ultrassonografia de abdome total</strong>
                        <small>Cálculo impactado no infundíbulo, parede 5mm</small>
                      </div>
                    </div>
                    <div className="exam-option-card is-selected">
                      <span className="exam-check-icon"><FiCheck /></span>
                      <div>
                        <strong>Hemograma completo</strong>
                        <small>Leucócitos: 15.400/mm³ com 8% bastões</small>
                      </div>
                    </div>
                    <div className="exam-option-card is-selected">
                      <span className="exam-check-icon"><FiCheck /></span>
                      <div>
                        <strong>Bilirrubinas e PCR</strong>
                        <small>PCR 48 mg/L · BT 1.0 (Normal)</small>
                      </div>
                    </div>
                    <div className="exam-option-card">
                      <span className="exam-check-icon is-empty" />
                      <div>
                        <strong>Tomografia de abdome</strong>
                        <small>Não indicada neste momento inicial</small>
                      </div>
                    </div>
                  </div>

                  <div className="screen-footer-actions">
                    <span className="selected-count-pill"><FiCheck /> 3 avaliações solicitadas</span>
                    <button type="button" className="screen-btn-primary" onClick={() => setActiveHeroStep(2)}>
                      Avançar para hipótese <FiArrowRight />
                    </button>
                  </div>
                </div>
              )}

              {/* TELA 3: HIPÓTESE DIAGNÓSTICA */}
              {activeHeroStep === 2 && (
                <div className="case-screen-view screen-hipotese">
                  <div className="screen-section-header">
                    <small>03 · SÍNTESE DIAGNÓSTICA</small>
                    <h3>Qual é a sua hipótese diagnóstica?</h3>
                    <p>Registre a hipótese principal, diferenciais relevantes e os achados que sustentam sua decisão.</p>
                  </div>

                  <div className="guidance-badges-row" aria-label="Tópicos de orientação para a hipótese">
                    <span className="guidance-badge">1 Hipótese principal</span>
                    <span className="guidance-badge">2 Diferenciais relevantes</span>
                    <span className="guidance-badge">3 Achados que sustentam</span>
                  </div>

                  <div className="textarea-field-wrapper">
                    <small className="field-label-text">Seu raciocínio diagnóstico</small>
                    <div className="real-textarea-mock">
                      <p>Minha principal hipótese é <strong>Colecistite Aguda Litiásica</strong>, sustentada pela dor em hipocôndrio direito pós-prandial, febre, sinal de Murphy positivo e cálculo com espessamento da vesícula no ultrassom.</p>
                    </div>
                  </div>

                  <div className="screen-footer-actions">
                    <span className="selected-count-pill"><FiFileText /> Raciocínio registrado</span>
                    <button type="button" className="screen-btn-primary" onClick={() => setActiveHeroStep(3)}>
                      Avançar para conduta <FiArrowRight />
                    </button>
                  </div>
                </div>
              )}

              {/* TELA 4: PLANO DE CONDUTA */}
              {activeHeroStep === 3 && (
                <div className="case-screen-view screen-conduta">
                  <div className="screen-section-header">
                    <small>04 · PLANO DE CUIDADO</small>
                    <h3>O que você faria por este paciente agora?</h3>
                    <p>Defina prioridades, medidas imediatas, tratamento, monitorização e critérios de reavaliação.</p>
                  </div>

                  <div className="guidance-badges-row" aria-label="Tópicos de orientação para a conduta">
                    <span className="guidance-badge">1 Estabilização e prioridades</span>
                    <span className="guidance-badge">2 Tratamento proposto</span>
                    <span className="guidance-badge">3 Monitorização e reavaliação</span>
                  </div>

                  <div className="textarea-field-wrapper">
                    <small className="field-label-text">Sua conduta inicial</small>
                    <div className="real-textarea-mock">
                      <p>Jejum absoluto e hidratação venosa vigorosa. Analgesia IV, antibioticoterapia precoce (Ceftriaxona + Metronidazol) e parecer cirúrgico imediato para Colecistectomia Videolaparoscópica precoce.</p>
                    </div>
                  </div>

                  <div className="synapse-audit-banner">
                    <FiActivity aria-hidden="true" />
                    <div className="audit-banner-copy">
                      <strong>A Synapse analisará sua decisão</strong>
                      <small>O feedback comparará hipótese e conduta com a rubrica clínica revisada e simulará a resposta esperada do paciente.</small>
                    </div>
                    <button type="button" className="screen-btn-primary is-green" onClick={() => setActiveHeroStep(4)}>
                      Avaliar <FiArrowRight />
                    </button>
                  </div>
                </div>
              )}

              {/* TELA 5: DEBRIEFING & RESULTADO DA SYNAPSE (IDÊNTICO À PLATAFORMA) */}
              {activeHeroStep === 4 && (
                <div className="case-screen-view screen-debriefing-real">
                  <div className="debriefing-subtabs-bar">
                    <span className="subtab-item is-active"><FiActivity /> Resultado</span>
                    <span className="subtab-item"><FiFileText /> Decisões</span>
                    <span className="subtab-item"><FiHeart /> Impacto clínico</span>
                    <span className="subtab-item"><FiTrendingUp /> Como evoluir</span>
                  </div>

                  <div className="debriefing-real-grid">
                    {/* Coluna Esquerda: Score e Radar Triangular */}
                    <div className="debriefing-left-box">
                      <div className="debriefing-score-hero">
                        <small className="nota-geral-tag">NOTA GERAL</small>
                        <div className="big-score-number">
                          <strong>9,4</strong> <span>/10</span>
                        </div>
                        <h4>Conduta consistente e segura</h4>
                        <p>O resultado demonstra precisão no raciocínio e segurança na decisão terapêutica.</p>
                      </div>

                      <div className="debriefing-radar-wrapper">
                        <div className="radar-svg-container">
                          <svg viewBox="0 0 160 140" className="clinical-radar-svg" aria-hidden="true">
                            <polygon points="80,15 145,120 15,120" fill="none" stroke="rgba(162, 209, 231, 0.15)" strokeWidth="1" />
                            <polygon points="80,45 125,115 35,115" fill="none" stroke="rgba(162, 209, 231, 0.12)" strokeWidth="1" />
                            <polygon points="80,75 105,110 55,110" fill="none" stroke="rgba(162, 209, 231, 0.08)" strokeWidth="1" />

                            <line x1="80" y1="80" x2="80" y2="15" stroke="rgba(162, 209, 231, 0.18)" strokeWidth="1" strokeDasharray="2,2" />
                            <line x1="80" y1="80" x2="145" y2="120" stroke="rgba(162, 209, 231, 0.18)" strokeWidth="1" strokeDasharray="2,2" />
                            <line x1="80" y1="80" x2="15" y2="120" stroke="rgba(162, 209, 231, 0.18)" strokeWidth="1" strokeDasharray="2,2" />

                            <polygon points="80,18 140,118 20,118" fill="rgba(167, 243, 75, 0.22)" stroke="#a7f34b" strokeWidth="2" />
                            <circle cx="80" cy="18" r="3.5" fill="#a7f34b" />
                            <circle cx="140" cy="118" r="3.5" fill="#a7f34b" />
                            <circle cx="20" cy="118" r="3.5" fill="#a7f34b" />

                            <text x="80" y="9" textAnchor="middle" fill="#dcecf2" fontSize="7.5" fontFamily="Poppins" fontWeight="600">Exames</text>
                            <text x="145" y="132" textAnchor="middle" fill="#dcecf2" fontSize="7.5" fontFamily="Poppins" fontWeight="600">Hipótese</text>
                            <text x="15" y="132" textAnchor="middle" fill="#dcecf2" fontSize="7.5" fontFamily="Poppins" fontWeight="600">Conduta</text>
                          </svg>
                        </div>

                        <div className="radar-bars-column">
                          <div className="radar-mini-bar-item">
                            <div className="radar-bar-top">
                              <small>Exames</small> <strong>100%</strong>
                            </div>
                            <div className="radar-bar-track"><div className="radar-bar-fill is-green" style={{ width: '100%' }} /></div>
                          </div>
                          <div className="radar-mini-bar-item">
                            <div className="radar-bar-top">
                              <small>Hipótese</small> <strong>95%</strong>
                            </div>
                            <div className="radar-bar-track"><div className="radar-bar-fill is-green" style={{ width: '95%' }} /></div>
                          </div>
                          <div className="radar-mini-bar-item">
                            <div className="radar-bar-top">
                              <small>Conduta</small> <strong>92%</strong>
                            </div>
                            <div className="radar-bar-track"><div className="radar-bar-fill is-green" style={{ width: '92%' }} /></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Coluna Direita: Cards de Feedback da Rubrica */}
                    <div className="debriefing-right-feedbacks">
                      <div className="feedback-eval-card is-exames">
                        <div className="eval-card-header">
                          <span className="eval-icon-label"><FiActivity /> Exames</span>
                          <strong className="eval-score-pct">100%</strong>
                        </div>
                        <p>Você selecionou perfeitamente os exames essenciais: <strong>Ultrassonografia</strong>, <strong>Hemograma</strong> e <strong>PCR</strong>, sem solicitações desnecessárias.</p>
                      </div>

                      <div className="feedback-eval-card is-hipotese">
                        <div className="eval-card-header">
                          <span className="eval-icon-label"><FiTarget /> Hipótese</span>
                          <strong className="eval-score-pct">95%</strong>
                        </div>
                        <p>A hipótese de <strong>Colecistite Aguda</strong> está plenamente fundamentada no sinal de Murphy positivo, febre e espessamento de parede vesicular ao USG.</p>
                      </div>

                      <div className="feedback-eval-card is-conduta">
                        <div className="eval-card-header">
                          <span className="eval-icon-label"><FiHeart /> Conduta</span>
                          <strong className="eval-score-pct">92%</strong>
                        </div>
                        <p>Conduta ágil com analgesia adequada, início precoce de antibioticoterapia venosa e encaminhamento cirúrgico videolaparoscópico.</p>
                      </div>
                    </div>
                  </div>

                  <div className="debriefing-footer-action">
                    <Link to="/cadastro" className="screen-btn-primary is-full-cta">
                      Entender minhas decisões <FiArrowRight />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
);

export default HomeHero;
