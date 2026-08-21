import { useEffect, useRef } from 'react';

const SYMBOLS = ['+', '\u2695\uFE0E', '◇', '•', '≈', '✦'];
const SYMBOL_FONT = '"Segoe UI Symbol", "Noto Sans Symbols 2", "Apple Symbols", Arial, sans-serif';
const BASE_COLOR = '10, 30, 77';
const PULSE_COLOR = '63, 169, 245';
const PULSE_TRAVEL_MS = 1700;
const PULSE_HOLD_MS = 180;
const PULSE_FADE_MS = 850;
const PULSE_INTERVAL_MS = 3100;

const createRandom = (initialSeed) => {
  let seed = initialSeed >>> 0;

  return () => {
    seed += 0x6D2B79F5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

const HomeParticleField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !context) return undefined;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let cells = [];
    let maxDistance = 1;
    let baseLayer = null;
    let animationFrame = 0;
    let lastFrame = 0;
    let isDocumentVisible = !document.hidden;

    const paintSymbol = (target, cell, color, opacity) => {
      target.globalAlpha = opacity;
      target.fillStyle = color;
      target.fillText(cell.symbol, cell.x, cell.y);
    };

    const paintBaseLayer = () => {
      if (!baseLayer) return;
      const layerContext = baseLayer.getContext('2d');
      if (!layerContext) return;

      layerContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      layerContext.clearRect(0, 0, width, height);
      layerContext.font = `600 ${width < 760 ? 9.3 : 11.2}px ${SYMBOL_FONT}`;
      layerContext.textAlign = 'center';
      layerContext.textBaseline = 'middle';

      cells.forEach((cell) => {
        paintSymbol(layerContext, cell, `rgb(${BASE_COLOR})`, width < 760 ? 0.12 : 0.17);
      });
      layerContext.globalAlpha = 1;
    };

    const buildGrid = () => {
      const isMobile = width < 760;
      const targetColumns = isMobile ? 25 : 44;
      const spacing = width / targetColumns;
      const rows = Math.ceil(height / spacing) + 1;
      const random = createRandom(Math.round(width * 13 + height * 19));
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      cells = [];
      maxDistance = 1;

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < targetColumns; column += 1) {
          const x = (column + 0.5) * spacing;
          const y = (row + 0.5) * spacing;
          const distance = Math.hypot(x - centerX, y - centerY);
          maxDistance = Math.max(maxDistance, distance);
          cells.push({
            x,
            y,
            distance,
            symbol: SYMBOLS[Math.floor(random() * SYMBOLS.length)],
          });
        }
      }

      baseLayer = document.createElement('canvas');
      baseLayer.width = canvas.width;
      baseLayer.height = canvas.height;
      paintBaseLayer();
    };

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.35);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      buildGrid();
    };

    const getPulseStrength = (cycleTime, delay) => {
      const elapsed = cycleTime - delay;
      if (elapsed < 0 || elapsed > PULSE_HOLD_MS + PULSE_FADE_MS) return 0;
      if (elapsed <= PULSE_HOLD_MS) return 1;
      return 1 - (elapsed - PULSE_HOLD_MS) / PULSE_FADE_MS;
    };

    const render = (time = 0) => {
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);
      if (baseLayer) context.drawImage(baseLayer, 0, 0, width, height);
      if (reducedMotionQuery.matches) return;

      const cycleTime = time % PULSE_INTERVAL_MS;
      context.font = `600 ${width < 760 ? 9.3 : 11.2}px ${SYMBOL_FONT}`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.shadowColor = `rgba(${PULSE_COLOR}, .42)`;
      context.shadowBlur = width < 760 ? 4 : 5;

      cells.forEach((cell) => {
        const delay = cell.distance / maxDistance * PULSE_TRAVEL_MS;
        const strength = getPulseStrength(cycleTime, delay);
        if (strength <= 0) return;
        paintSymbol(
          context,
          cell,
          `rgb(${PULSE_COLOR})`,
          0.1 + strength * 0.58,
        );
      });
      context.shadowBlur = 0;
      context.globalAlpha = 1;
    };

    const animate = (time) => {
      if (!isDocumentVisible) return;

      const frameInterval = width < 760 ? 50 : 42;
      if (time - lastFrame >= frameInterval) {
        render(time);
        lastFrame = time;
      }
      animationFrame = window.requestAnimationFrame(animate);
    };

    const restartAnimation = () => {
      window.cancelAnimationFrame(animationFrame);
      render(0);
      if (!reducedMotionQuery.matches && isDocumentVisible) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    const handleResize = () => {
      resizeCanvas();
      restartAnimation();
    };

    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
      if (isDocumentVisible) restartAnimation();
      else window.cancelAnimationFrame(animationFrame);
    };

    resizeCanvas();
    restartAnimation();

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    reducedMotionQuery.addEventListener?.('change', restartAnimation);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reducedMotionQuery.removeEventListener?.('change', restartAnimation);
    };
  }, []);

  return <canvas ref={canvasRef} className="home-s-particle-field" aria-hidden="true" />;
};

export default HomeParticleField;
