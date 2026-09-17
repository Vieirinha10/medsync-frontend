import { useEffect, useRef, useState } from 'react';
import MedSyncIntro from '../components/MedSyncIntro';
import HomePreviewHero from '../components/home/HomePreviewHero';
import HomePreviewSections, { HomePreviewSidebar } from '../components/home/HomePreviewSections';
import { api } from '../services/api';
import '../styles/home-redesign.css';
import '../styles/home-mobile.css';

const SECTION_IDS = ['inicio', 'synapse', 'comunidade', 'funcionalidades', 'planos'];

const HomePage = () => {
  const homeRef = useRef(null);
  const [studentCount, setStudentCount] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(() => document.visibilityState !== 'hidden');
  const [activeSection, setActiveSection] = useState('inicio');

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
    if (!root || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        setActiveSection(entry.target.id);
      });
    }, { rootMargin: '-35% 0px -52% 0px', threshold: 0 });

    SECTION_IDS.forEach((id) => {
      const section = root.querySelector(`#${id}`);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

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

  const formattedStudentCount = studentCount === null ? '—' : studentCount.toLocaleString('pt-BR');

  return (
    <div className="home-redesign" ref={homeRef}>
      <MedSyncIntro />
      <HomePreviewSidebar activeSection={activeSection} />
      <main className="home-redesign-page">
        <HomePreviewHero
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
        />
        <HomePreviewSections formattedStudentCount={formattedStudentCount} />
      </main>
    </div>
  );
};

export default HomePage;
