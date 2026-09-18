import { useEffect, useState } from 'react';
import '../styles/home-intro.css';

const INTRO_SESSION_KEY = 'medsync-home-intro-viewed';
const INTRO_DURATION = 1900;
const INTRO_EXIT_DURATION = 620;

const MedSyncIntro = () => {
  const [shouldShow] = useState(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReducedMotion) return false;

    try {
      return window.sessionStorage.getItem(INTRO_SESSION_KEY) !== 'true';
    } catch {
      return true;
    }
  });
  const [visible, setVisible] = useState(shouldShow);
  const [phase, setPhase] = useState('visible');

  useEffect(() => {
    if (!shouldShow) return undefined;

    document.documentElement.classList.add('medsync-intro-lock');

    try {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, 'true');
    } catch {
      // A apresentação continua funcionando se o armazenamento estiver indisponível.
    }

    return () => {
      document.documentElement.classList.remove('medsync-intro-lock');
    };
  }, [shouldShow]);

  useEffect(() => {
    if (!shouldShow || !visible) return undefined;

    const delay = phase === 'visible' ? INTRO_DURATION : INTRO_EXIT_DURATION;
    const timer = window.setTimeout(() => {
      if (phase === 'visible') setPhase('leaving');
      else setVisible(false);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [phase, shouldShow, visible]);

  useEffect(() => {
    if (!visible) document.documentElement.classList.remove('medsync-intro-lock');
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`medsync-intro${phase === 'leaving' ? ' is-leaving' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="MedSync. Preparando sua experiência."
    >
      <div className="medsync-intro-atmosphere" aria-hidden="true" />
      <button
        className="medsync-intro-skip"
        type="button"
        onClick={() => setPhase('leaving')}
      >
        Pular introdução
      </button>

      <div className="medsync-intro-stage">
        <div className="medsync-intro-logo">
          <img src="/logo-medsync.png" alt="MedSync" />
        </div>

        <p className="medsync-intro-message">
          Mais preparo. Mais clareza. <strong>Melhores decisões.</strong>
        </p>
      </div>

      <div className="medsync-intro-progress" aria-hidden="true">
        <span />
      </div>
    </div>
  );
};

export default MedSyncIntro;
