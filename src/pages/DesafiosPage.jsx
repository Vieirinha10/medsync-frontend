import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiFilter,
  FiImage,
  FiRefreshCw,
  FiRotateCcw,
  FiStar,
  FiX,
  FiZap,
} from 'react-icons/fi';
import { visualChallenges } from '../data/visualChallenges';
import { api } from '../services/api';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];
const FAVORITES_STORAGE_KEY = 'medsync:visual-challenge-favorites';
const ALL_DIFFICULTIES = 'Todas';
const ALL_CATEGORIES = 'Todas';
const LEGACY_CHALLENGE_IDS = {
  'pneumotorax-hipertensivo': 'desafio-visual-001',
  'fibrilacao-atrial': 'desafio-visual-002',
  'hematoma-epidural': 'desafio-visual-003',
  'psoriase-em-placas': 'desafio-visual-004',
  'retinopatia-diabetica': 'desafio-visual-005',
  'anemia-falciforme': 'desafio-visual-006',
  'pneumonia-lobar': 'desafio-visual-007',
  'apendicite-aguda': 'desafio-visual-008',
  'calculo-ureteral': 'desafio-visual-009',
  'melanoma-cutaneo': 'desafio-visual-010',
};

const getTrailContext = () => {
  const params = new URLSearchParams(window.location.search);
  const pathId = params.get('trilha');
  const activityId = params.get('atividade');
  return pathId && activityId ? { pathId, activityId } : null;
};

const getInitialChallengeIndex = () => {
  const requestedId = new URLSearchParams(window.location.search).get('desafio');
  const challengeId = LEGACY_CHALLENGE_IDS[requestedId] || requestedId;
  const index = visualChallenges.findIndex((challenge) => challenge.id === challengeId);
  return index >= 0 ? index : 0;
};

const loadFavorites = () => {
  try {
    const savedFavorites = JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY));
    return Array.isArray(savedFavorites)
      ? [...new Set(savedFavorites.map((id) => LEGACY_CHALLENGE_IDS[id] || id))]
      : [];
  } catch {
    return [];
  }
};

const DesafiosPage = () => {
  const [challenges, setChallenges] = useState(visualChallenges);
  const [currentIndex, setCurrentIndex] = useState(getInitialChallengeIndex);
  const [answers, setAnswers] = useState({});
  const [favorites, setFavorites] = useState(loadFavorites);
  const [difficultyFilter, setDifficultyFilter] = useState(ALL_DIFFICULTIES);
  const [categoryFilter, setCategoryFilter] = useState(ALL_CATEGORIES);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [notebookMessage, setNotebookMessage] = useState('');
  const [answeringId, setAnsweringId] = useState(null);
  const touchStartX = useRef(null);
  const trailContext = useMemo(getTrailContext, []);

  const categories = useMemo(
    () => [...new Set(challenges.map((challenge) => challenge.category))].sort(),
    [challenges],
  );
  const difficulties = useMemo(
    () => [...new Set(challenges.map((challenge) => challenge.difficulty))],
    [challenges],
  );
  const favoriteChallenges = useMemo(
    () => challenges.filter((challenge) => favorites.includes(challenge.id)),
    [challenges, favorites],
  );
  const filteredChallenges = useMemo(
    () => challenges.filter((challenge) => (
      (difficultyFilter === ALL_DIFFICULTIES || challenge.difficulty === difficultyFilter)
      && (categoryFilter === ALL_CATEGORIES || challenge.category === categoryFilter)
      && (!favoritesOnly || favorites.includes(challenge.id))
    )),
    [categoryFilter, challenges, difficultyFilter, favorites, favoritesOnly],
  );

  const currentChallenge = filteredChallenges[currentIndex] ?? null;
  const currentAnswer = currentChallenge ? answers[currentChallenge.id] : undefined;
  const selectedOptionId = currentAnswer?.selectedOptionId;
  const isAnswered = Boolean(currentAnswer);
  const answeredCount = Object.keys(answers).length;
  const visibleAnsweredCount = filteredChallenges.filter((challenge) => answers[challenge.id]).length;
  const correctCount = challenges.filter(
    (challenge) => answers[challenge.id]?.correta,
  ).length;
  const visibleCorrectCount = filteredChallenges.filter(
    (challenge) => answers[challenge.id]?.correta,
  ).length;
  const progress = filteredChallenges.length
    ? (visibleAnsweredCount / filteredChallenges.length) * 100
    : 0;
  const hasActiveFilters = difficultyFilter !== ALL_DIFFICULTIES
    || categoryFilter !== ALL_CATEGORIES
    || favoritesOnly;

  const goToPrevious = () => {
    setCurrentIndex((index) => Math.max(0, index - 1));
  };

  const goToNext = () => {
    setCurrentIndex((index) => Math.min(filteredChallenges.length - 1, index + 1));
  };

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (!api.getDynamicChallenges) return;
    void api.getDynamicChallenges().then((items) => {
      const dynamic = items.map((item) => ({
        id: item.id,
        category: item.especialidade,
        difficulty: item.dificuldade,
        modality: item.modalidade,
        imageSrc: item.imagem_url,
        imageAlt: item.imagem_alt,
        question: item.pergunta,
        options: item.alternativas.map((option, index) => ({
          id: option.id || `option-${index + 1}`,
          label: option.texto || option.label || String(option),
        })),
      }));
      setChallenges([...dynamic, ...visualChallenges.filter(
        (builtIn) => !dynamic.some((item) => item.id === builtIn.id),
      )]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setCurrentIndex((index) => Math.min(index, Math.max(filteredChallenges.length - 1, 0)));
  }, [filteredChallenges.length]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target instanceof HTMLElement && event.target.closest('button, a, input, textarea, select')) {
        return;
      }
      if (event.key === 'ArrowLeft') {
        setCurrentIndex((index) => Math.max(0, index - 1));
      }
      if (event.key === 'ArrowRight') {
        setCurrentIndex((index) => Math.min(filteredChallenges.length - 1, index + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredChallenges.length]);

  useEffect(() => {
    [currentIndex - 1, currentIndex + 1]
      .filter((index) => index >= 0 && index < filteredChallenges.length)
      .forEach((index) => {
        const image = new window.Image();
        image.src = filteredChallenges[index].imageSrc;
      });
  }, [currentIndex, filteredChallenges]);

  const handleAnswer = async (optionId) => {
    if (isAnswered || !currentChallenge) return;
    const selectedOption = currentChallenge.options.find((option) => option.id === optionId);
    setNotebookMessage('');
    setAnsweringId(currentChallenge.id);

    let correction;
    try {
      correction = await api.answerVisualChallenge(currentChallenge.id, optionId);
    } catch {
      setNotebookMessage('Não foi possível corrigir agora. Tente novamente em instantes.');
      setAnsweringId(null);
      return;
    }

    const answer = { selectedOptionId: optionId, ...correction };
    setAnswers((current) => ({ ...current, [currentChallenge.id]: answer }));
    setAnsweringId(null);
    const correctOption = currentChallenge.options.find(
      (option) => option.id === correction.alternativa_correta_id,
    );

    void api.recordVisualChallengeAttempt({
      desafio_id: currentChallenge.id,
      titulo: correction.diagnostico_correto,
      especialidade: currentChallenge.category,
      dificuldade: currentChallenge.difficulty,
      pergunta: currentChallenge.question,
      resposta_usuario: selectedOption?.label || optionId,
      resposta_correta: correctOption?.label || correction.diagnostico_correto,
      explicacao: correction.explicacao,
      imagem: currentChallenge.imageSrc,
    }).then((entry) => {
      if (!correction.correta && entry) {
        setNotebookMessage('Erro salvo automaticamente no seu Caderno de Erros.');
      }
      if (correction.correta && entry?.status === 'dominado') {
        setNotebookMessage('Ótimo! Este conteúdo foi marcado como dominado no seu caderno.');
      }
    }).catch(() => {
      // A correção do desafio continua disponível mesmo se a sincronização falhar.
    });

    if (trailContext) {
      const score = correction.correta ? 100 : 0;
      void api.completeLearningPathActivity(
        trailContext.pathId,
        trailContext.activityId,
        score,
      ).then(() => {
        setNotebookMessage((message) => (
          message
            ? `${message} Progresso da trilha atualizado.`
            : 'Atividade concluída e progresso da trilha atualizado.'
        ));
      }).catch(() => {
        // O desafio permanece funcional se o progresso da trilha não sincronizar.
      });
    }
  };

  const toggleFavorite = (challengeId) => {
    setFavorites((current) => (
      current.includes(challengeId)
        ? current.filter((favoriteId) => favoriteId !== challengeId)
        : [...current, challengeId]
    ));
  };

  const openFavorite = (challengeId) => {
    const favoriteIndex = favoriteChallenges.findIndex((challenge) => challenge.id === challengeId);
    setDifficultyFilter(ALL_DIFFICULTIES);
    setCategoryFilter(ALL_CATEGORIES);
    setFavoritesOnly(true);
    setAnswers((current) => {
      const next = { ...current };
      delete next[challengeId];
      return next;
    });
    setNotebookMessage('');
    setCurrentIndex(Math.max(favoriteIndex, 0));
  };

  const clearFilters = () => {
    setDifficultyFilter(ALL_DIFFICULTIES);
    setCategoryFilter(ALL_CATEGORIES);
    setFavoritesOnly(false);
    setCurrentIndex(0);
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (distance > 55) goToPrevious();
    if (distance < -55) goToNext();
  };

  const restartChallenges = () => {
    setAnswers({});
    setCurrentIndex(0);
  };

  return (
    <div className="page-container visual-challenges-page">
      <header className="visual-challenges-header">
        <div>
          <span className="visual-challenges-kicker"><FiZap /> TREINO VISUAL RÁPIDO</span>
          <h1>Qual é o diagnóstico?</h1>
          <p>
            Analise imagens clínicas, filtre por especialidade e salve desafios para revisar depois.
          </p>
        </div>

        <div className="visual-header-stats">
          <div className="visual-favorite-stat" aria-label={`${favorites.length} desafios favoritados`}>
            <FiStar aria-hidden="true" />
            <span><small>FAVORITOS</small><strong>{favorites.length}</strong></span>
          </div>
          <div className="visual-score" aria-label={`${correctCount} acertos em ${answeredCount} respostas`}>
            <span>SEU PLACAR</span>
            <strong>{correctCount}<small>/{answeredCount || 0}</small></strong>
          </div>
        </div>
      </header>

      <div className="visual-challenges-workspace">
        <section className="visual-filter-island" aria-label="Filtros dos desafios">
          <div className="visual-filter-heading">
            <span><FiFilter aria-hidden="true" /></span>
            <div><strong>Encontre seu próximo desafio</strong><small>{filteredChallenges.length} de {challenges.length} disponíveis</small></div>
          </div>

          <div className="visual-filter-controls">
            <div className="visual-filter-group">
              <span>DIFICULDADE</span>
              <div className="visual-difficulty-options">
                {[ALL_DIFFICULTIES, ...difficulties].map((difficulty) => (
                  <button
                    type="button"
                    key={difficulty}
                    className={difficultyFilter === difficulty ? 'is-active' : ''}
                    onClick={() => { setDifficultyFilter(difficulty); setCurrentIndex(0); }}
                    aria-pressed={difficultyFilter === difficulty}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>

            <label className="visual-filter-group visual-category-filter">
              <span>ESPECIALIDADE</span>
              <select
                aria-label="CONTEÚDO OU ESPECIALIDADE"
                value={categoryFilter}
                onChange={(event) => { setCategoryFilter(event.target.value); setCurrentIndex(0); }}
              >
                <option value={ALL_CATEGORIES}>Todas as áreas</option>
                {categories.map((category) => <option value={category} key={category}>{category}</option>)}
              </select>
            </label>

            <button
              type="button"
              className={`visual-favorites-filter ${favoritesOnly ? 'is-active' : ''}`}
              onClick={() => { setFavoritesOnly((current) => !current); setCurrentIndex(0); }}
              aria-label={`Somente favoritos (${favorites.length} salvos)`}
              aria-pressed={favoritesOnly}
            >
              <FiStar aria-hidden="true" />
              <span><strong>Favoritos</strong><small>{favorites.length} salvos</small></span>
            </button>

            {hasActiveFilters && (
              <button type="button" className="visual-clear-filters" onClick={clearFilters}>
                <FiRefreshCw aria-hidden="true" /> Limpar
              </button>
            )}
          </div>

          <div className={`visual-saved-challenges ${favoriteChallenges.length ? 'has-items' : ''}`}>
            <div className="visual-saved-heading">
              <span><FiStar aria-hidden="true" /> FAVORITADOS</span>
              <strong>{favorites.length}</strong>
            </div>
            {favoriteChallenges.length ? (
              <div className="visual-saved-list">
                {favoriteChallenges.map((challenge, index) => (
                  <button type="button" key={challenge.id} onClick={() => openFavorite(challenge.id)}>
                    <img src={challenge.imageSrc} alt="" />
                    <span>
                      <strong>Desafio visual #{String(index + 1).padStart(2, '0')}</strong>
                      <small>{challenge.modality} · {challenge.category} · {challenge.difficulty}</small>
                    </span>
                    <FiArrowRight aria-hidden="true" />
                  </button>
                ))}
              </div>
            ) : (
              <p>Use a estrela dos cards para montar sua lista de revisão.</p>
            )}
          </div>
        </section>

        <section className="visual-challenges-content" aria-label="Desafios disponíveis">
          <section className="visual-progress-card" aria-label="Progresso dos desafios filtrados">
            <div className="visual-progress-copy">
              <span>{visibleAnsweredCount} de {filteredChallenges.length} respondidos nesta seleção</span>
              <strong>{Math.round(progress)}%</strong>
            </div>
            <div className="visual-progress-track" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>
          </section>

          {currentChallenge ? (
            <>
              <article className="visual-challenge-card" key={currentChallenge.id}>
                <span className="visual-card-orbit" aria-hidden="true" />
                <div
                  className="visual-challenge-media"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <img
                    src={currentChallenge.imageSrc}
                    alt={currentChallenge.imageAlt}
                    className="visual-challenge-image"
                    decoding="async"
                  />

                  <button
                    type="button"
                    className={`visual-favorite-button ${favorites.includes(currentChallenge.id) ? 'is-active' : ''}`}
                    onClick={() => toggleFavorite(currentChallenge.id)}
                    aria-label={favorites.includes(currentChallenge.id)
                      ? `Remover desafio ${currentIndex + 1} dos favoritos`
                      : `Salvar desafio ${currentIndex + 1} para estudar depois`}
                    aria-pressed={favorites.includes(currentChallenge.id)}
                  >
                    <FiStar aria-hidden="true" />
                    <span>{favorites.includes(currentChallenge.id) ? 'Favoritado' : 'Estudar depois'}</span>
                  </button>

                  <button
                    type="button"
                    className="visual-card-arrow is-previous"
                    onClick={goToPrevious}
                    disabled={currentIndex === 0}
                    aria-label="Desafio anterior"
                  >
                    <FiArrowLeft />
                  </button>
                  <button
                    type="button"
                    className="visual-card-arrow is-next"
                    onClick={goToNext}
                    disabled={currentIndex === filteredChallenges.length - 1}
                    aria-label="Próximo desafio"
                  >
                    <FiArrowRight />
                  </button>

                  <div className="visual-image-badges">
                    <span><FiImage /> {currentChallenge.modality}</span>
                    <span>{currentChallenge.difficulty}</span>
                  </div>
                </div>

                <div className="visual-challenge-body">
                  <span className="visual-challenge-eyebrow">
                    DESAFIO {String(currentIndex + 1).padStart(2, '0')}
                  </span>
                  <div className="visual-challenge-meta">
                    <span>{currentChallenge.category}</span>
                    <strong>Desafio {currentIndex + 1} de {filteredChallenges.length}</strong>
                  </div>

                  <h2>{currentChallenge.question}</h2>
                  <p className="visual-challenge-instruction">
                    Selecione apenas uma alternativa. A resposta não poderá ser alterada.
                  </p>

                  <p className="visual-notebook-message" aria-live="polite">{notebookMessage}</p>

                  <div className="visual-options" role="group" aria-label="Alternativas diagnósticas">
                    {currentChallenge.options.map((option, index) => {
                      const isSelected = option.id === selectedOptionId;
                      const isCorrect = option.id === currentAnswer?.alternativa_correta_id;
                      const optionState = isAnswered
                        ? isCorrect
                          ? 'is-correct'
                          : isSelected
                            ? 'is-incorrect'
                            : 'is-muted'
                        : '';

                      return (
                        <button
                          type="button"
                          key={option.id}
                          className={`visual-option ${optionState}`}
                          onClick={() => handleAnswer(option.id)}
                          disabled={isAnswered || answeringId === currentChallenge.id}
                          aria-pressed={isSelected}
                        >
                          <span className="visual-option-letter">{OPTION_LABELS[index]}</span>
                          <span>{option.label}</span>
                          {isAnswered && isCorrect && <FiCheck aria-hidden="true" />}
                          {isAnswered && isSelected && !isCorrect && <FiX aria-hidden="true" />}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <section
                      className={`visual-answer ${currentAnswer.correta ? 'is-correct' : 'is-incorrect'}`}
                      role="status"
                      aria-live="polite"
                    >
                      <div className="visual-answer-heading">
                        {currentAnswer.correta
                          ? <FiCheckCircle />
                          : <FiX />}
                        <div>
                          <span>
                            {currentAnswer.correta
                              ? 'Diagnóstico correto'
                              : 'Ainda não. Observe os achados-chave'}
                          </span>
                          <h3>{currentAnswer.diagnostico_correto}</h3>
                        </div>
                      </div>

                      <p>{currentAnswer.explicacao}</p>
                      <div className="visual-findings">
                        <strong>O que observar na imagem:</strong>
                        <ul>
                          {currentAnswer.achados_chave.map((finding) => (
                            <li key={finding}>{finding}</li>
                          ))}
                        </ul>
                      </div>

                      {currentAnswer.fonte_url && (
                        <a
                          href={currentAnswer.fonte_url}
                          target="_blank"
                          rel="noreferrer"
                          className="visual-image-source"
                        >
                          Imagem: {currentAnswer.fonte_credito} · {currentAnswer.fonte_licenca}
                        </a>
                      )}

                      {currentIndex < filteredChallenges.length - 1 && (
                        <button type="button" className="visual-continue-button" onClick={goToNext}>
                          Próximo diagnóstico <FiArrowRight />
                        </button>
                      )}
                    </section>
                  )}
                </div>
              </article>

              <nav className="visual-challenge-pagination" aria-label="Escolher desafio">
                {filteredChallenges.map((challenge, index) => {
                  const answer = answers[challenge.id];
                  const answerState = answer
                    ? answer.correta ? 'is-correct' : 'is-incorrect'
                    : '';
                  return (
                    <button
                      type="button"
                      key={challenge.id}
                      onClick={() => setCurrentIndex(index)}
                      className={`${index === currentIndex ? 'is-active' : ''} ${answerState}`}
                      aria-label={`Ir para o desafio ${index + 1}`}
                      aria-current={index === currentIndex ? 'step' : undefined}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </nav>

              {visibleAnsweredCount === filteredChallenges.length && filteredChallenges.length > 0 && (
                <section className="visual-session-summary">
                  <div>
                    <span>SESSÃO CONCLUÍDA</span>
                    <h2>Você acertou {visibleCorrectCount} de {filteredChallenges.length} diagnósticos</h2>
                    <p>Revise as explicações ou reinicie para tentar melhorar o resultado.</p>
                  </div>
                  <button type="button" onClick={restartChallenges}>
                    <FiRotateCcw /> Refazer desafios
                  </button>
                </section>
              )}
            </>
          ) : (
            <section className="visual-empty-state">
              <span><FiFilter aria-hidden="true" /></span>
              <h2>Nenhum desafio encontrado</h2>
              <p>Ajuste os filtros ou favorite alguns desafios para montar sua lista de revisão.</p>
              <button type="button" onClick={clearFilters}>Ver todos os desafios</button>
            </section>
          )}
        </section>
      </div>

      <p className="visual-educational-notice">
        Conteúdo exclusivamente educacional. As imagens não substituem avaliação clínica,
        laudo especializado ou protocolos locais.
      </p>
    </div>
  );
};

export default DesafiosPage;
