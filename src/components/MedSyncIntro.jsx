import { useEffect, useState } from 'react';
import '../styles/home-intro.css';

const INTRO_SESSION_KEY = 'medsync-home-intro-viewed';

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
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!shouldShow) return undefined;

    document.documentElement.classList.add('medsync-intro-lock');

    try {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, 'true');
    } catch {
      // A apresentação continua funcionando se o armazenamento estiver indisponível.
    }

    const leaveTimer = window.setTimeout(() => setLeaving(true), 2800);
    const removeTimer = window.setTimeout(() => setVisible(false), 3700);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(removeTimer);
      document.documentElement.classList.remove('medsync-intro-lock');
    };
  }, [shouldShow]);

  useEffect(() => {
    if (!visible) document.documentElement.classList.remove('medsync-intro-lock');
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`medsync-intro${leaving ? ' is-leaving' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Apresentação do MedSync"
    >
      <div className="medsync-intro-grid" aria-hidden="true" />
      <div className="medsync-intro-logo">
        <img src="/logo-medsync.png" alt="MedSync" />
        <span>Raciocínio clínico em movimento</span>
      </div>
      <div className="medsync-intro-messages" aria-hidden="true">
        <span>Preparando sua experiência</span>
        <span>Sincronizando conhecimento e prática</span>
      </div>
      <div className="medsync-intro-progress" aria-hidden="true">
        <span />
      </div>
    </div>
  );
};

export default MedSyncIntro;
