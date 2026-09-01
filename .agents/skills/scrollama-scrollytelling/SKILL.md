---
name: scrollama-scrollytelling
description: >-
  Expert guide and reference for building high-performance, accessible scrollytelling experiences in React
  and modern web apps using Scrollama, IntersectionObserver, and CSS position: sticky patterns.
  Use when designing interactive narrative sections, sticky graphics, step-driven transitions,
  progress animations, or data storytelling in web pages.
---

# Scrollama & Scrollytelling Guide

A complete guide and engineering pattern for implementing **cinematic, high-performance scrollytelling** in web applications (especially React + Vite/Next.js) based on the principles of **Russell Samora's Scrollama (`russellgoldenberg/scrollama`)**.

---

## 1. Core Architecture of Scrollytelling

Scrollytelling decouples scroll position from UI rendering by using **`IntersectionObserver`** instead of heavy window `scroll` listeners. This guarantees buttery 60 FPS transitions without layout thrashing.

### The Two Classic Layout Archetypes:

1. **Side-by-Side (Split Sticky)**:
   - **Left Column**: Narrative stream with scrolling cards/steps (`.scrolly-story-stream`).
   - **Right Column**: Sticky visual console (`.scrolly-sticky-graphic`) that remains fixed (`position: sticky`) while steps scroll past.
2. **Overlay (Full-Bleed Sticky Canvas)**:
   - **Background**: Full-screen sticky visualization or 3D/Canvas canvas.
   - **Foreground**: Semitransparent step cards scrolling over the graphic.

---

## 2. Standard DOM / React Component Structure

```jsx
import { useEffect, useRef, useState } from 'react';

export function ScrollytellingSection({ stepsData }) {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const observers = [];
    stepRefs.current.forEach((el, index) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveStep(index);
            }
          });
        },
        {
          root: null,
          // Triggers exactly when the step card passes through the vertical center (middle 40%) of the screen:
          rootMargin: '-30% 0px -40% 0px',
          threshold: 0.2,
        }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <section className="scrolly-section">
      <div className="scrolly-container">
        {/* Story Stream (Scrollable Left Column) */}
        <div className="scrolly-story-stream" role="tablist" aria-label="Etapas da narrativa">
          <div className="scrolly-progress-rail" aria-hidden="true">
            <div 
              className="scrolly-progress-fill" 
              style={{ height: `${((activeStep + 1) / stepsData.length) * 100}%` }} 
            />
          </div>

          {stepsData.map((step, index) => {
            const isActive = activeStep === index;
            return (
              <article
                key={step.id}
                ref={(el) => (stepRefs.current[index] = el)}
                role="tab"
                tabIndex={0}
                aria-selected={isActive}
                className={`scrolly-step-card${isActive ? ' is-active' : ''}`}
                onClick={() => setActiveStep(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveStep(index);
                  }
                }}
              >
                <div className="step-indicator">
                  <span className="step-node-dot" />
                  <span className="step-number-tag">ETAPA {index + 1}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            );
          })}
        </div>

        {/* Sticky Visual Console (Fixed Right Column) */}
        <div className="scrolly-sticky-wrapper">
          <div className="scrolly-sticky-console" aria-live="polite">
            <div className="console-display" key={`display-step-${activeStep}`}>
              {/* Dynamic step visual output */}
              <h2>{stepsData[activeStep].title}</h2>
              <div className="visual-telemetry-box">
                {stepsData[activeStep].visualContent}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## 3. Essential CSS Sticky Rules & Pitfalls

### ⚠️ Golden Rule for `position: sticky`:
> **No ancestor element of `.scrolly-sticky-wrapper` may have `overflow: hidden`, `overflow: clip`, or `overflow: auto`**. If an ancestor clips overflow, sticky positioning will silently fail.

```css
/* Container Layout */
.scrolly-container {
  display: grid;
  grid-template-columns: minmax(360px, 1fr) minmax(440px, 1.2fr);
  gap: clamp(32px, 5vw, 64px);
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
  align-items: start; /* CRITICAL: Must be align-items: start for sticky children */
  position: relative;
}

/* Story Stream */
.scrolly-story-stream {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: clamp(40px, 8vh, 80px); /* Generous spacing so users feel the scroll rhythm */
  padding: 20px 0 60px 32px;
}

/* Progress Rail */
.scrolly-progress-rail {
  position: absolute;
  top: 30px;
  bottom: 80px;
  left: 10px;
  width: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 999px;
}

.scrolly-progress-fill {
  width: 100%;
  background: linear-gradient(180deg, #22c7ec, #a7f34b);
  border-radius: 999px;
  transition: height 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 0 12px rgba(167, 243, 75, 0.6);
}

/* Step Cards */
.scrolly-step-card {
  position: relative;
  background: rgba(4, 39, 61, 0.5);
  border: 1px solid rgba(162, 209, 231, 0.12);
  padding: clamp(24px, 3vw, 36px);
  border-radius: 18px;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(12px);
}

.scrolly-step-card.is-active {
  background: rgba(4, 39, 61, 0.95);
  border-color: #a7f34b;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35), 0 0 25px rgba(167, 243, 75, 0.15);
  transform: translateX(8px);
}

/* Sticky Console Wrapper */
.scrolly-sticky-wrapper {
  position: sticky;
  top: 110px; /* Safe top offset below fixed navbar */
  z-index: 10;
}

.scrolly-sticky-console {
  background: linear-gradient(150deg, rgba(4, 39, 61, 0.95), rgba(3, 26, 42, 0.98));
  border: 1px solid rgba(162, 209, 231, 0.2);
  border-radius: 24px;
  padding: clamp(28px, 3.5vw, 42px);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(24px);
}

/* Fluid Mobile Adaptation */
@media (max-width: 900px) {
  .scrolly-container {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .scrolly-sticky-wrapper {
    position: relative;
    top: 0;
  }

  .scrolly-story-stream {
    padding-left: 20px;
    gap: 32px;
  }
}
```

---

## 4. Visual Polish & Micro-Interactions

1. **Active Node Elevation**: When a step becomes active, elevate its icon node with a neon bloom effect (`box-shadow: 0 0 16px rgba(167, 243, 75, 0.7)`).
2. **Keyframed Console Ingress**: Wrap the dynamic content of the sticky console with `key={activeStep}` and apply `@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`.
3. **Multi-State Visual Matrix**: Highlight active contributing sub-systems (e.g. neural models, metrics, radar vertices) in sync with the current step.

---

## 5. Accessibility & Performance Checklist

- [x] **`role="tablist"` & `role="tab"`**: Ensure screen readers announce step transitions cleanly.
- [x] **Keyboard Accessible**: Include `tabIndex={0}` and `onKeyDown` (Enter/Space) to allow keyboard navigation.
- [x] **Click to Navigate**: Clicking a step card or seat badge immediately jumps/updates state.
- [x] **Zero Scroll Thrash**: Never bind state updates directly to raw `window.onscroll` without throttling or `IntersectionObserver`.
- [x] **`prefers-reduced-motion`**: Disable continuous animations for users with vestibular sensitivities.
