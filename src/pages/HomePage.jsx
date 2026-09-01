import { useEffect, useRef, useState } from 'react';
import { api } from '../services/api';
import ChromaticWavesBackground from '../components/ChromaticWavesBackground';
import MedSyncIntro from '../components/MedSyncIntro';
import HomeHero from '../components/home/HomeHero';
import HomeLowerSections from '../components/home/HomeLowerSections';
import HomeSpecialtiesMarquee from '../components/home/HomeSpecialtiesMarquee';
import HomeSynapseBoard from '../components/home/HomeSynapseBoard';
import {
  ACADEMIC_INSTITUTIONS,
  FEEDBACK_STEPS,
  HERO_SIMULATION_STEPS,
  MEDICAL_BOARD_EXAMINERS,
  MEDICAL_SPECIALTIES,
  REAL_TESTIMONIALS,
  TRUST_PILLARS,
} from '../components/home/homeContent';


const HomePage = () => {
  const [studentCount, setStudentCount] = useState(null);
  const [activeHeroStep, setActiveHeroStep] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const [activeSynapsePillar, setActiveSynapsePillar] = useState(0);
  const scrollyStepRefs = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const observers = [];
    scrollyStepRefs.current.forEach((el, index) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSynapsePillar(index);
            }
          });
        },
        {
          root: null,
          rootMargin: '-25% 0px -35% 0px',
          threshold: 0.15,
        }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);
  const [activeFeedbackStep, setActiveFeedbackStep] = useState(0);
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

  // Timer automático para alternar os 5 cards da simulação a cada 5 segundos
  useEffect(() => {
    if (isHeroPaused) return undefined;

    const timer = setInterval(() => {
      setActiveHeroStep((prev) => (prev + 1) % HERO_SIMULATION_STEPS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isHeroPaused]);

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

  const activeFeedback = FEEDBACK_STEPS[activeFeedbackStep];

  return (
    <div className="home-container home-solid" ref={homeRef}>
      <MedSyncIntro />
      <ChromaticWavesBackground />

      {/* BLOCO 1: HERO (IMPACTO & PROVOCAÇÃO COM SIMULADOR REALISTA EM 5 FASES) */}
      <HomeHero
        activeHeroStep={activeHeroStep}
        setActiveHeroStep={setActiveHeroStep}
        setIsHeroPaused={setIsHeroPaused}
        HERO_SIMULATION_STEPS={HERO_SIMULATION_STEPS}
      />

      {/* BLOCO 2: DIVISOR CONECTOR — ESTEIRA DE ESPECIALIDADES */}
      <HomeSpecialtiesMarquee specialties={MEDICAL_SPECIALTIES} />

      {/* BLOCO 3: SYNAPSE IA · A BANCA MÉDICA (ARENA ORBITAL DOS 5 MODELOS DE IA) */}
      <HomeSynapseBoard
        activeSynapsePillar={activeSynapsePillar}
        setActiveSynapsePillar={setActiveSynapsePillar}
        scrollyStepRefs={scrollyStepRefs}
        MEDICAL_BOARD_EXAMINERS={MEDICAL_BOARD_EXAMINERS}
      />

      <HomeLowerSections
        formattedStudentCount={formattedStudentCount}
        activeFeedbackStep={activeFeedbackStep}
        setActiveFeedbackStep={setActiveFeedbackStep}
        activeFeedback={activeFeedback}
        FEEDBACK_STEPS={FEEDBACK_STEPS}
        REAL_TESTIMONIALS={REAL_TESTIMONIALS}
        ACADEMIC_INSTITUTIONS={ACADEMIC_INSTITUTIONS}
        TRUST_PILLARS={TRUST_PILLARS}
      />
    </div>
  );
};

export default HomePage;
