import { useEffect, useRef, useState } from 'react';
import { api } from '../services/api';
import ChromaticWavesBackground from '../components/ChromaticWavesBackground';
import MedSyncIntro from '../components/MedSyncIntro';
import HomeHero from '../components/home/HomeHero';
import HomeLowerSections from '../components/home/HomeLowerSections';
import HomeSpecialtiesMarquee from '../components/home/HomeSpecialtiesMarquee';
import HomeSynapseNetworks from '../components/home/HomeSynapseNetworks';
import {
  ACADEMIC_INSTITUTIONS,
  HERO_SIMULATION_STEPS,
  MEDICAL_SPECIALTIES,
  TRUST_PILLARS,
} from '../components/home/homeContent';
import '../styles/home-solid.css';
import '../styles/home-mobile.css';


const HomePage = () => {
  const [studentCount, setStudentCount] = useState(null);
  const [activeHeroStep, setActiveHeroStep] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const [isHeroInteracting, setIsHeroInteracting] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(() => document.visibilityState !== 'hidden');
  const homeRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    api.getPublicStats()
      .then(({ estudantes_medsync: count }) => {
        if (isMounted && Number.isInteger(count) && count >= 0) {
          setStudentCount(count);
        }
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => setIsPageVisible(document.visibilityState !== 'hidden');
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (isHeroPaused || isHeroInteracting || !isPageVisible || prefersReducedMotion) return undefined;

    const timer = setInterval(() => {
      setActiveHeroStep((prev) => (prev + 1) % HERO_SIMULATION_STEPS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeHeroStep, isHeroInteracting, isHeroPaused, isPageVisible]);

  useEffect(() => {
    const root = homeRef.current;
    if (!root) return undefined;

    const sections = [...root.querySelectorAll('[data-home-reveal]')];
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
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
    }, { threshold: 0.12 });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const formattedStudentCount = studentCount === null
    ? '—'
    : studentCount.toLocaleString('pt-BR');

  return (
    <div className="home-container home-solid" ref={homeRef}>
      <MedSyncIntro />
      <ChromaticWavesBackground />

      {/* BLOCO 1: HERO (IMPACTO & PROVOCAÇÃO COM SIMULADOR REALISTA EM 5 FASES) */}
      <HomeHero
        activeHeroStep={activeHeroStep}
        setActiveHeroStep={setActiveHeroStep}
        isHeroPaused={isHeroPaused}
        setIsHeroPaused={setIsHeroPaused}
        setIsHeroInteracting={setIsHeroInteracting}
        HERO_SIMULATION_STEPS={HERO_SIMULATION_STEPS}
      />

      {/* BLOCO 2: DIVISOR CONECTOR — ESTEIRA DE ESPECIALIDADES */}
      <HomeSpecialtiesMarquee specialties={MEDICAL_SPECIALTIES} />

      {/* BLOCO 3: SYNAPSE IA · REDES NEURAIS & BANCA MÉDICA */}
      <HomeSynapseNetworks />

      <HomeLowerSections
        formattedStudentCount={formattedStudentCount}
        medicalSpecialtyCount={MEDICAL_SPECIALTIES.length}
        ACADEMIC_INSTITUTIONS={ACADEMIC_INSTITUTIONS}
        TRUST_PILLARS={TRUST_PILLARS}
      />
    </div>
  );
};

export default HomePage;
