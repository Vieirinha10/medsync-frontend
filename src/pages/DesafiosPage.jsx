import { useEffect, useRef, useState } from 'react';
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiImage,
  FiRotateCcw,
  FiX,
  FiZap,
} from 'react-icons/fi';
import { visualChallenges } from '../data/visualChallenges';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const DesafiosPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const touchStartX = useRef(null);

  const currentChallenge = visualChallenges[currentIndex];
  const selectedOptionId = answers[currentChallenge.id];
  const isAnswered = Boolean(selectedOptionId);
  const answeredCount = Object.keys(answers).length;
  const correctCount = visualChallenges.filter(
    (challenge) => answers[challenge.id] === challenge.correctOptionId,
  ).length;
  const progress = (answeredCount / visualChallenges.length) * 100;

  const goToPrevious = () => {
    setCurrentIndex((index) => Math.max(0, index - 1));
  };

  const goToNext = () => {
    setCurrentIndex((index) => Math.min(visualChallenges.length - 1, index + 1));
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target instanceof HTMLElement && event.target.closest('button, a, input, textarea, select')) {
        return;
      }
      if (event.key === 'ArrowLeft') {
        setCurrentIndex((index) => Math.max(0, index - 1));
      }
      if (event.key === 'ArrowRight') {
        setCurrentIndex((index) => Math.min(visualChallenges.length - 1, index + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    [currentIndex - 1, currentIndex + 1]
      .filter((index) => index >= 0 && index < visualChallenges.length)
      .forEach((index) => {
        const image = new window.Image();
        image.src = visualChallenges[index].imageSrc;
      });
  }, [currentIndex]);

  const handleAnswer = (optionId) => {
    if (isAnswered) return;
    setAnswers((current) => ({
      ...current,
      [currentChallenge.id]: optionId,
    }));
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
            Analise a imagem, escolha uma alternativa e receba a explicação imediatamente.
          </p>
        </div>

        <div className="visual-score" aria-label={`${correctCount} acertos em ${answeredCount} respostas`}>
          <span>SEU PLACAR</span>
          <strong>{correctCount}<small>/{answeredCount || 0}</small></strong>
        </div>
      </header>

      <section className="visual-progress-card" aria-label="Progresso dos desafios">
        <div className="visual-progress-copy">
          <span>{answeredCount} de {visualChallenges.length} respondidos</span>
          <strong>{Math.round(progress)}%</strong>
        </div>
        <div className="visual-progress-track" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
      </section>

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
            disabled={currentIndex === visualChallenges.length - 1}
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
            <strong>Desafio {currentIndex + 1} de {visualChallenges.length}</strong>
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

              {currentIndex < visualChallenges.length - 1 && (
                <button type="button" className="visual-continue-button" onClick={goToNext}>
                  Próximo diagnóstico <FiArrowRight />
                </button>
              )}
            </section>
          )}
        </div>
      </article>

      <nav className="visual-challenge-pagination" aria-label="Escolher desafio">
        {visualChallenges.map((challenge, index) => {
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
              aria-label={`Ir para o desafio ${index + 1}`}
              aria-current={index === currentIndex ? 'step' : undefined}
            >
              {index + 1}
            </button>
          );
        })}
      </nav>

      {answeredCount === visualChallenges.length && (
        <section className="visual-session-summary">
          <div>
            <span>SESSÃO CONCLUÍDA</span>
            <h2>Você acertou {correctCount} de {visualChallenges.length} diagnósticos</h2>
            <p>Revise as explicações ou reinicie para tentar melhorar o resultado.</p>
          </div>
          <button type="button" onClick={restartChallenges}>
            <FiRotateCcw /> Refazer desafios
          </button>
        </section>
      )}

      <p className="visual-educational-notice">
        Conteúdo exclusivamente educacional. As imagens não substituem avaliação clínica,
        laudo especializado ou protocolos locais.
      </p>
    </div>
  );
};

export default DesafiosPage;
