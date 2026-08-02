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

const OPTION_LABELS = ['A', 'B', 'C', 'D'];
const FAVORITES_STORAGE_KEY = 'medsync:visual-challenge-favorites';
const ALL_DIFFICULTIES = 'Todas';
const ALL_CATEGORIES = 'Todas';

const loadFavorites = () => {
  try {
    const savedFavorites = JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY));
    return Array.isArray(savedFavorites) ? savedFavorites : [];
  } catch {
    return [];
  }
};

const DesafiosPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [favorites, setFavorites] = useState(loadFavorites);
  const [difficultyFilter, setDifficultyFilter] = useState(ALL_DIFFICULTIES);
  const [categoryFilter, setCategoryFilter] = useState(ALL_CATEGORIES);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const touchStartX = useRef(null);

  const categories = useMemo(
    () => [...new Set(visualChallenges.map((challenge) => challenge.category))].sort(),
    [],
  );
  const difficulties = useMemo(
    () => [...new Set(visualChallenges.map((challenge) => challenge.difficulty))],
    [],
  );
  const favoriteChallenges = useMemo(
    () => visualChallenges.filter((challenge) => favorites.includes(challenge.id)),
    [favorites],
  );
  const filteredChallenges = useMemo(
    () => visualChallenges.filter((challenge) => (
      (difficultyFilter === ALL_DIFFICULTIES || challenge.difficulty === difficultyFilter)
      && (categoryFilter === ALL_CATEGORIES || challenge.category === categoryFilter)
      && (!favoritesOnly || favorites.includes(challenge.id))
    )),
    [categoryFilter, difficultyFilter, favorites, favoritesOnly],
  );

  const currentChallenge = filteredChallenges[currentIndex] ?? null;
  const selectedOptionId = currentChallenge ? answers[currentChallenge.id] : undefined;
  const isAnswered = Boolean(selectedOptionId);
  const answeredCount = Object.keys(answers).length;
  const visibleAnsweredCount = filteredChallenges.filter((challenge) => answers[challenge.id]).length;
  const correctCount = visualChallenges.filter(
    (challenge) => answers[challenge.id] === challenge.correctOptionId,
  ).length;
  const visibleCorrectCount = filteredChallenges.filter(
    (challenge) => answers[challenge.id] === challenge.correctOptionId,
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

  const handleAnswer = (optionId) => {
    if (isAnswered || !currentChallenge) return;
    setAnswers((current) => ({
      ...current,
      [currentChallenge.id]: optionId,
    }));
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
        <aside className="visual-filter-island" aria-label="Filtros dos desafios">
          <div className="visual-filter-heading">
            <span><FiFilter aria-hidden="true" /></span>
            <div><strong>Filtrar desafios</strong><small>{filteredChallenges.length} de {visualChallenges.length} disponíveis</small></div>
          </div>

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
            <span>CONTEÚDO OU ESPECIALIDADE</span>
            <select
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
            aria-pressed={favoritesOnly}
          >
            <FiStar aria-hidden="true" />
            <span><strong>Somente favoritos</strong><small>{favorites.length} salvos para revisar</small></span>
          </button>

          {hasActiveFilters && (
            <button type="button" className="visual-clear-filters" onClick={clearFilters}>
              <FiRefreshCw aria-hidden="true" /> Limpar filtros
            </button>
          )}

          <div className="visual-saved-challenges">
            <div className="visual-saved-heading">
              <span><FiStar aria-hidden="true" /> FAVORITADOS</span>
              <strong>{favorites.length}</strong>
            </div>
            {favoriteChallenges.length ? (
              <div className="visual-saved-list">
                {favoriteChallenges.map((challenge) => (
                  <button type="button" key={challenge.id} onClick={() => openFavorite(challenge.id)}>
                    <img src={challenge.imageSrc} alt="" />
                    <span><strong>{challenge.correctDiagnosis}</strong><small>{challenge.category} · {challenge.difficulty}</small></span>
                    <FiArrowRight aria-hidden="true" />
                  </button>
                ))}
              </div>
            ) : (
              <p>Use a estrela dos cards para montar sua lista de revisão.</p>
            )}
          </div>
        </aside>

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
                      ? `Remover ${currentChallenge.correctDiagnosis} dos favoritos`
                      : `Favoritar ${currentChallenge.correctDiagnosis}`}
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
                  <div className="visual-challenge-meta">
                    <span>{currentChallenge.category}</span>
                    <strong>Desafio {currentIndex + 1} de {filteredChallenges.length}</strong>
                  </div>

                  <h2>{currentChallenge.question}</h2>
                  <p className="visual-challenge-instruction">
                    Selecione apenas uma alternativa. A resposta não poderá ser alterada.
                  </p>

                  <div className="visual-options" role="group" aria-label="Alternativas diagnósticas">
                    {currentChallenge.options.map((option, index) => {
                      const isSelected = option.id === selectedOptionId;
                      const isCorrect = option.id === currentChallenge.correctOptionId;
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
                          disabled={isAnswered}
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
                      className={`visual-answer ${selectedOptionId === currentChallenge.correctOptionId ? 'is-correct' : 'is-incorrect'}`}
                      role="status"
                      aria-live="polite"
                    >
                      <div className="visual-answer-heading">
                        {selectedOptionId === currentChallenge.correctOptionId
                          ? <FiCheckCircle />
                          : <FiX />}
                        <div>
                          <span>
                            {selectedOptionId === currentChallenge.correctOptionId
                              ? 'Diagnóstico correto'
                              : 'Ainda não. Observe os achados-chave'}
                          </span>
                          <h3>{currentChallenge.correctDiagnosis}</h3>
                        </div>
                      </div>

                      <p>{currentChallenge.explanation}</p>
                      <div className="visual-findings">
                        <strong>O que observar na imagem:</strong>
                        <ul>
                          {currentChallenge.keyFindings.map((finding) => (
                            <li key={finding}>{finding}</li>
                          ))}
                        </ul>
                      </div>

                      <a
                        href={currentChallenge.source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="visual-image-source"
                      >
                        Imagem: {currentChallenge.source.credit} · {currentChallenge.source.license}
                      </a>

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
                    ? answer === challenge.correctOptionId ? 'is-correct' : 'is-incorrect'
                    : '';
                  return (
                    <button
                      type="button"
                      key={challenge.id}
                      onClick={() => setCurrentIndex(index)}
                      className={`${index === currentIndex ? 'is-active' : ''} ${answerState}`}
                      aria-label={`Ir para o desafio ${index + 1}: ${challenge.correctDiagnosis}`}
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
