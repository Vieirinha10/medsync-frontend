import { useEffect, useRef } from 'react';

const CLUSTERS = [
  { start: -0.08, y: 0.2, scale: 1.04, speed: 0.010, direction: 1, phase: 0.2 },
  { start: 0.42, y: 0.74, scale: 0.86, speed: 0.008, direction: -1, phase: 1.7 },
  { start: 0.82, y: 0.43, scale: 0.7, speed: 0.012, direction: 1, phase: 3.1 },
  { start: 0.16, y: 0.52, scale: 0.56, speed: 0.007, direction: -1, phase: 4.4 },
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

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
    let animationFrame = 0;
    let lastFrame = 0;
    let isDocumentVisible = !document.hidden;
    let isDisposed = false;
    let brandMarkSprite = null;

    const prepareBrandMark = () => {
      const image = new Image();

      image.addEventListener('load', () => {
        if (isDisposed) return;

        const crop = { x: 900, y: 55, width: 455, height: 570 };
        const sourceCanvas = document.createElement('canvas');
        const sourceContext = sourceCanvas.getContext('2d', { willReadFrequently: true });
        if (!sourceContext) return;

        sourceCanvas.width = crop.width;
        sourceCanvas.height = crop.height;
        sourceContext.drawImage(
          image,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height,
        );

        const imageData = sourceContext.getImageData(0, 0, crop.width, crop.height);
        const { data } = imageData;

        for (let pixel = 0; pixel < data.length; pixel += 4) {
          const red = data[pixel];
          const green = data[pixel + 1];
          const blue = data[pixel + 2];
          const variation = Math.max(red, green, blue) - Math.min(red, green, blue);

          if (red > 145 && green > 145 && blue > 145 && variation < 72) {
            data[pixel + 3] = 0;
          }
        }

        sourceContext.putImageData(imageData, 0, 0);

        const sprite = document.createElement('canvas');
        sprite.width = 52;
        sprite.height = 66;
        sprite.getContext('2d')?.drawImage(sourceCanvas, 0, 0, sprite.width, sprite.height);
        brandMarkSprite = sprite;
        restartAnimation();
      });

      image.src = '/logo-medsync.png';
    };

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const drawGlyph = (x, y, size, rotation, color, opacity) => {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.globalAlpha = opacity;

      if (brandMarkSprite) {
        const glyphHeight = size * 1.27;
        context.drawImage(brandMarkSprite, -size / 2, -glyphHeight / 2, size, glyphHeight);
      } else {
        context.fillStyle = color;
        context.font = `800 ${size}px Sora, Manrope, sans-serif`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('S', 0, 0);
      }

      context.restore();
    };

    const drawCluster = (cluster, index, seconds, isMobile, reducedMotion) => {
      const travel = reducedMotion
        ? cluster.start
        : (cluster.start + seconds * cluster.speed + 2) % 1;
      const normalizedTravel = cluster.direction > 0 ? travel : 1 - travel;
      const centerX = (-0.18 + normalizedTravel * 1.36) * width;
      const centerY = cluster.y * height + Math.sin(seconds * 0.25 + cluster.phase) * height * 0.035;
      const shapeHeight = Math.min(height * 0.58, 490) * cluster.scale;
      const curveWidth = Math.min(width * 0.12, 170) * cluster.scale;
      const rowCount = isMobile ? 18 : 24;
      const layerCount = isMobile ? 2 : 3;
      const layerSpacing = (isMobile ? 9 : 11) * cluster.scale;

      for (let row = 0; row < rowCount; row += 1) {
        const progress = row / (rowCount - 1);
        const curvePhase = progress * Math.PI * 2;
        const baseY = centerY + (progress - 0.5) * shapeHeight;
        const baseX = centerX + Math.sin(curvePhase) * curveWidth;
        const tangentX = Math.cos(curvePhase) * curveWidth * Math.PI * 2;
        const tangentY = shapeHeight;
        const tangentLength = Math.hypot(tangentX, tangentY) || 1;
        const normalX = -tangentY / tangentLength;
        const normalY = tangentX / tangentLength;
        const taper = Math.sin(progress * Math.PI) * 0.72 + 0.28;

        for (let layer = -layerCount; layer <= layerCount; layer += 1) {
          const seed = index * 97 + row * 17 + layer * 31;
          const jitterX = Math.sin(seed * 1.91) * 3.4;
          const jitterY = Math.cos(seed * 1.37) * 3.1;
          const distance = layer * layerSpacing * taper;
          const x = baseX + normalX * distance + jitterX;
          const y = baseY + normalY * distance + jitterY;

          if (x < -35 || x > width + 35 || y < -35 || y > height + 35) continue;

          const edgeDistance = Math.abs(x - width / 2) / Math.max(width / 2, 1);
          const edgeEmphasis = isMobile ? 0.78 : 0.54 + clamp(edgeDistance, 0, 1) * 0.46;
          const layerFade = 1 - Math.abs(layer) / (layerCount + 1);
          const pulse = reducedMotion ? 0.82 : 0.76 + Math.sin(seconds * 0.7 + seed) * 0.16;
          const endpointFade = clamp(Math.sin(progress * Math.PI) * 1.65, 0.22, 1);
          const isGreenHighlight = Math.abs(seed) % 37 === 0;
          const color = isGreenHighlight
            ? 'rgb(116, 207, 58)'
            : row % 4 === 0
              ? 'rgb(34, 181, 227)'
              : 'rgb(7, 108, 190)';
          const opacity = (isGreenHighlight ? 0.22 : 0.115)
            * layerFade
            * endpointFade
            * pulse
            * edgeEmphasis;
          const size = (isMobile ? 7 : 8.5)
            + layerFade * (isMobile ? 2.2 : 3.6)
            + Math.sin(seed) * 0.8;
          const rotation = Math.sin(seconds * 0.18 + seed) * 0.045;

          drawGlyph(x, y, size, rotation, color, opacity);
        }
      }
    };

    const render = (time = 0) => {
      const reducedMotion = reducedMotionQuery.matches;
      const isMobile = width < 760;
      const seconds = time / 1000;

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);

      CLUSTERS.slice(0, isMobile ? 3 : CLUSTERS.length).forEach((cluster, index) => {
        drawCluster(cluster, index, seconds, isMobile, reducedMotion);
      });
    };

    const animate = (time) => {
      if (!isDocumentVisible) return;

      if (time - lastFrame >= 40) {
        render(time);
        lastFrame = time;
      }

      animationFrame = window.requestAnimationFrame(animate);
    };

    const restartAnimation = () => {
      window.cancelAnimationFrame(animationFrame);
      render(6000);
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
    prepareBrandMark();
    restartAnimation();

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    reducedMotionQuery.addEventListener?.('change', restartAnimation);

    return () => {
      isDisposed = true;
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reducedMotionQuery.removeEventListener?.('change', restartAnimation);
    };
  }, []);

  return <canvas ref={canvasRef} className="home-s-particle-field" aria-hidden="true" />;
};

export default HomeParticleField;
