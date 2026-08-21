import { useEffect, useRef } from 'react';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const NETWORK_SYMBOLS = ['+', '%', '*', '=', '•', '/', '\\', '—', '|', '·', '≠'];

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

const pointAtDistance = (branch, distance) => {
  if (distance <= 0 || distance >= branch.length) return null;

  for (let index = 1; index < branch.points.length; index += 1) {
    const current = branch.points[index];
    if (current.distance < distance) continue;

    const previous = branch.points[index - 1];
    const segmentLength = current.distance - previous.distance || 1;
    const progress = (distance - previous.distance) / segmentLength;

    return {
      x: previous.x + (current.x - previous.x) * progress,
      y: previous.y + (current.y - previous.y) * progress,
      angle: Math.atan2(current.y - previous.y, current.x - previous.x),
      symbol: current.symbol,
    };
  }

  return null;
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
    let centralSprite = null;
    let networkLayer = null;
    let branches = [];
    let pulses = [];

    const drawNetworkSymbol = (
      target,
      symbol,
      x,
      y,
      size,
      opacity,
      rotation = 0,
      color = '#0c5f91',
      glow = false,
    ) => {
      target.save();
      target.translate(x, y);
      target.rotate(rotation);
      target.globalAlpha = opacity;
      if (glow) {
        target.shadowColor = color;
        target.shadowBlur = size * 1.9;
      }
      target.fillStyle = color;
      target.font = `700 ${size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      target.textAlign = 'center';
      target.textBaseline = 'middle';
      target.fillText(symbol, 0, 0);
      target.restore();
    };

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

        centralSprite = document.createElement('canvas');
        centralSprite.width = 300;
        centralSprite.height = 376;
        centralSprite.getContext('2d')?.drawImage(
          sourceCanvas,
          0,
          0,
          centralSprite.width,
          centralSprite.height,
        );
        buildNetwork();
        restartAnimation();
      });

      image.src = '/logo-medsync.png';
    };

    const addBranch = (random, start, angle, length, depth) => {
      const curve = (random() - 0.5) * length * 0.56;
      const end = {
        x: start.x + Math.cos(angle) * length,
        y: start.y + Math.sin(angle) * length,
      };
      const control = {
        x: (start.x + end.x) / 2 - Math.sin(angle) * curve,
        y: (start.y + end.y) / 2 + Math.cos(angle) * curve,
      };
      const sampleCount = Math.max(8, Math.ceil(length / (width < 760 ? 19 : 16)));
      const points = [];
      let travelled = 0;

      for (let index = 0; index <= sampleCount; index += 1) {
        const progress = index / sampleCount;
        const inverse = 1 - progress;
        const point = {
          x: inverse * inverse * start.x + 2 * inverse * progress * control.x + progress * progress * end.x,
          y: inverse * inverse * start.y + 2 * inverse * progress * control.y + progress * progress * end.y,
        };

        if (points.length) {
          const previous = points[points.length - 1];
          travelled += Math.hypot(point.x - previous.x, point.y - previous.y);
        }
        points.push({
          ...point,
          distance: travelled,
          symbol: NETWORK_SYMBOLS[Math.floor(random() * NETWORK_SYMBOLS.length)],
        });
      }

      const branch = {
        points,
        length: travelled,
        depth,
        opacity: 0.3 - depth * 0.032 + random() * 0.09,
      };
      branches.push(branch);

      if (depth >= 3) return;

      const childLength = length * (0.52 + random() * 0.09);
      const childCount = depth === 0 ? 2 : random() > 0.48 ? 2 : 1;
      for (let child = 0; child < childCount; child += 1) {
        const side = childCount === 1 ? (random() > 0.5 ? 1 : -1) : child === 0 ? -1 : 1;
        const spread = (0.23 + random() * 0.3) * side;
        addBranch(random, end, angle + spread, childLength, depth + 1);
      }
    };

    const paintStaticNetwork = () => {
      if (!networkLayer) return;
      const layerContext = networkLayer.getContext('2d');
      if (!layerContext) return;

      layerContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      layerContext.clearRect(0, 0, width, height);

      branches.forEach((branch) => {
        branch.points.forEach((point, index) => {
          if (point.x < -24 || point.x > width + 24 || point.y < -24 || point.y > height + 24) return;
          const next = branch.points[Math.min(index + 1, branch.points.length - 1)];
          const angle = Math.atan2(next.y - point.y, next.x - point.x);
          const edgeFade = clamp(
            Math.min(point.x, width - point.x, point.y, height - point.y) / 72,
            0.22,
            1,
          );
          const size = (width < 760 ? 6.7 : 8.1) + (3 - branch.depth) * 0.42;
          drawNetworkSymbol(
            layerContext,
            point.symbol,
            point.x,
            point.y,
            size,
            branch.opacity * edgeFade,
            angle * 0.08,
            '#0b5e91',
          );
        });
      });
    };

    const buildNetwork = () => {
      const random = createRandom(Math.round(width * 11 + height * 17));
      const diagonal = Math.hypot(width, height);
      const center = { x: width * 0.5, y: height * 0.47 };
      const rootCount = width < 760 ? 12 : 18;
      const rootLength = diagonal * (width < 760 ? 0.265 : 0.235);
      branches = [];

      for (let root = 0; root < rootCount; root += 1) {
        const angle = root / rootCount * Math.PI * 2 + (random() - 0.5) * 0.19;
        addBranch(random, center, angle, rootLength * (0.86 + random() * 0.25), 0);
      }

      const eligibleBranches = branches.filter((branch) => branch.length > 72);
      const pulseCount = width < 760 ? 9 : 17;
      pulses = Array.from({ length: pulseCount }, (_, index) => {
        const branch = eligibleBranches[Math.floor(random() * eligibleBranches.length)];
        return {
          branch,
          offset: random() * (branch.length + 180),
          speed: 24 + random() * 24,
          trail: width < 760 ? 5 : 7,
          lime: index % 4 === 0,
        };
      });

      networkLayer = document.createElement('canvas');
      networkLayer.width = canvas.width;
      networkLayer.height = canvas.height;
      paintStaticNetwork();
    };

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.35);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      buildNetwork();
    };

    const render = (time = 0) => {
      const seconds = time / 1000;
      const reducedMotion = reducedMotionQuery.matches;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);

      if (networkLayer) {
        context.drawImage(networkLayer, 0, 0, width, height);
      }

      pulses.forEach((pulse) => {
        const movement = reducedMotion ? pulse.offset : seconds * pulse.speed + pulse.offset;
        const headDistance = movement % (pulse.branch.length + 170) - 70;

        for (let trailIndex = 0; trailIndex < pulse.trail; trailIndex += 1) {
          const distance = headDistance - trailIndex * 9;
          const point = pointAtDistance(pulse.branch, distance);
          if (!point) continue;

          const strength = 1 - trailIndex / pulse.trail;
          const size = (width < 760 ? 5.6 : 6.7) + strength * 2.4;
          const pulseColor = pulse.lime ? '#a7f34b' : '#32dff1';
          drawNetworkSymbol(
            context,
            point.symbol,
            point.x,
            point.y,
            size,
            0.18 + strength * 0.72,
            point.angle * 0.06,
            pulseColor,
            true,
          );
        }
      });

      if (centralSprite) {
        const markWidth = clamp(
          Math.min(width * 0.17, height * 0.29),
          width < 760 ? 84 : 142,
          width < 760 ? 122 : 218,
        );
        const markHeight = markWidth * 1.253;
        context.save();
        context.globalAlpha = 0.97;
        context.shadowColor = 'rgba(3, 38, 62, .34)';
        context.shadowBlur = markWidth * 0.12;
        context.shadowOffsetY = markWidth * 0.055;
        context.drawImage(
          centralSprite,
          width * 0.5 - markWidth / 2,
          height * 0.47 - markHeight / 2,
          markWidth,
          markHeight,
        );
        context.restore();
      }
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
      render(5200);
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
