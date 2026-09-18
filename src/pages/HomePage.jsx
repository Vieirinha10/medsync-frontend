import { useEffect, useRef, useState } from 'react';
import HomePreviewHero from '../components/home/HomePreviewHero';
import HomePreviewSections from '../components/home/HomePreviewSections';
import { api } from '../services/api';
import '../styles/home-redesign.css';
import '../styles/home-mobile.css';


const HomePage = () => {
  const homeRef = useRef(null);
  const [studentCount, setStudentCount] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(() => document.visibilityState !== 'hidden');

  useEffect(() => {
    const root = document.documentElement;
    const previousTheme = root.dataset.theme;
    const previousColorScheme = root.style.colorScheme;
    root.dataset.theme = 'light';
    root.style.colorScheme = 'light';
    document.body.classList.add('medsync-home-preview-active');

    return () => {
      root.dataset.theme = previousTheme || 'dark';
      root.style.colorScheme = previousColorScheme || 'dark';
      document.body.classList.remove('medsync-home-preview-active');
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    api.getPublicStats()
      .then(({ estudantes_medsync: count }) => {
        if (isMounted && Number.isInteger(count) && count >= 0) setStudentCount(count);
      })
      .catch(() => undefined);
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const handleVisibility = () => setIsPageVisible(document.visibilityState !== 'hidden');
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (isPaused || !isPageVisible || reducedMotion) return undefined;
    const timer = window.setInterval(() => setActiveStep((current) => (current + 1) % 4), 5600);
    return () => window.clearInterval(timer);
  }, [isPageVisible, isPaused]);


  useEffect(() => {
    const root = homeRef.current;
    if (!root) return undefined;
    const sections = [...root.querySelectorAll('[data-home-reveal]')];
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      sections.forEach((section) => section.classList.add('is-visible'));
      return undefined;
    }
    root.classList.add('has-scroll-reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = homeRef.current;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const precisePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)')?.matches;
    if (!root || reducedMotion || !precisePointer) return undefined;

    const updateSpotlight = (event) => {
      const card = event.target.closest('[data-motion-card]');
      if (!card || !root.contains(card)) return;
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
      card.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
    };

    root.addEventListener('pointermove', updateSpotlight, { passive: true });
    return () => root.removeEventListener('pointermove', updateSpotlight);
  }, []);

  const formattedStudentCount = studentCount === null ? '—' : studentCount.toLocaleString('pt-BR');

  return (
    <div className="home-redesign" ref={homeRef}>
      <div className="home-redesign-page">
        <HomePreviewHero
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
        />
        <HomePreviewSections formattedStudentCount={formattedStudentCount} />
      </div>
    </div>
  );
};

export default HomePage;
