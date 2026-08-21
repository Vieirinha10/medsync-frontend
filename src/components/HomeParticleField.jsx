import { useEffect, useRef } from 'react';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const rotatePoint = (point, rotation) => {
  const cosX = Math.cos(rotation.x);
  const sinX = Math.sin(rotation.x);
  const cosY = Math.cos(rotation.y);
  const sinY = Math.sin(rotation.y);
  const cosZ = Math.cos(rotation.z);
  const sinZ = Math.sin(rotation.z);

  const yAfterX = point.y * cosX - point.z * sinX;
  const zAfterX = point.y * sinX + point.z * cosX;
  const xAfterY = point.x * cosY + zAfterX * sinY;
  const zAfterY = -point.x * sinY + zAfterX * cosY;

  return {
    x: xAfterY * cosZ - yAfterX * sinZ,
    y: xAfterY * sinZ + yAfterX * cosZ,
    z: zAfterY,
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

    const drawRibbon = (seconds, isMobile, reducedMotion) => {
      const longSegments = isMobile ? 72 : 124;
      const wideSegments = isMobile ? 10 : 17;
      const radius = Math.min(width * (isMobile ? 0.43 : 0.4), height * 0.51);
      const halfWidth = radius * (isMobile ? 0.29 : 0.34);
      const centerX = width * 0.5;
      const centerY = height * (isMobile ? 0.5 : 0.48);
      const cameraDistance = radius * 4.25;
      const motionTime = reducedMotion ? 8.5 : seconds;
      const phase = motionTime * 0.18;
      const rotation = {
        x: -0.58 + Math.sin(motionTime * 0.1) * 0.13,
        y: 0.26 + Math.sin(motionTime * 0.075) * 0.18,
        z: -0.2 + motionTime * 0.045,
      };
      const points = [];

      for (let longIndex = 0; longIndex < longSegments; longIndex += 1) {
        const progress = longIndex / longSegments;
        const angle = progress * Math.PI * 2 + phase;
        const wave = 1 + Math.sin(angle * 3 - motionTime * 0.14) * 0.105;
        const twist = angle * 0.5 + motionTime * 0.115;

        for (let wideIndex = 0; wideIndex < wideSegments; wideIndex += 1) {
          const across = wideIndex / (wideSegments - 1) * 2 - 1;
          const surfaceOffset = across * halfWidth;
          const ringRadius = radius * wave + surfaceOffset * Math.cos(twist);
          const point = rotatePoint({
            x: ringRadius * Math.cos(angle),
            y: ringRadius * Math.sin(angle) * 0.83,
            z: surfaceOffset * Math.sin(twist)
              + radius * 0.22 * Math.sin(angle * 2 + motionTime * 0.13),
          }, rotation);
          const perspective = cameraDistance / Math.max(cameraDistance - point.z, cameraDistance * 0.42);
          const x = centerX + point.x * perspective;
          const y = centerY + point.y * perspective;

          if (x < -30 || x > width + 30 || y < -30 || y > height + 30) continue;

          const normalizedDepth = clamp((point.z / radius + 0.92) / 1.84, 0, 1);
          const surfaceCenter = 1 - Math.abs(across);
          const shimmer = reducedMotion
            ? 0.92
            : 0.88 + Math.sin(motionTime * 0.62 + longIndex * 0.19 + wideIndex) * 0.12;
          const opacity = (0.14 + normalizedDepth * 0.5)
            * (0.78 + surfaceCenter * 0.22)
            * shimmer;
          const size = (isMobile ? 5.8 : 6.6)
            + normalizedDepth * (isMobile ? 3.8 : 5.2);
          const glyphRotation = Math.sin(angle * 2 + across + motionTime * 0.09) * 0.09;

          points.push({
            x,
            y,
            z: point.z,
            size,
            rotation: glyphRotation,
            color: normalizedDepth > 0.72 ? 'rgb(24, 183, 225)' : 'rgb(7, 112, 194)',
            opacity,
          });
        }
      }

      points.sort((first, second) => first.z - second.z);
      points.forEach((point) => {
        drawGlyph(
          point.x,
          point.y,
          point.size,
          point.rotation,
          point.color,
          point.opacity,
        );
      });
    };

    const render = (time = 0) => {
      const reducedMotion = reducedMotionQuery.matches;
      const isMobile = width < 760;
      const seconds = time / 1000;

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);

      drawRibbon(seconds, isMobile, reducedMotion);
    };

    const animate = (time) => {
      if (!isDocumentVisible) return;

      const frameInterval = width < 760 ? 42 : 33;
      if (time - lastFrame >= frameInterval) {
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
