import { useEffect, useRef } from 'react';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

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
    let baseSprite = null;
    let cyanSprite = null;
    let limeSprite = null;
    let networkLayer = null;
    let branches = [];
    let pulses = [];

    const tintSprite = (source, colors) => {
      const sprite = document.createElement('canvas');
      const spriteContext = sprite.getContext('2d');
      sprite.width = source.width;
      sprite.height = source.height;
      if (!spriteContext) return sprite;

      spriteContext.drawImage(source, 0, 0);
      spriteContext.globalCompositeOperation = 'source-in';
      const gradient = spriteContext.createLinearGradient(0, 0, sprite.width, 0);
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(1, colors[1]);
      spriteContext.fillStyle = gradient;
      spriteContext.fillRect(0, 0, sprite.width, sprite.height);
      return sprite;
    };

    const drawGlyph = (target, sprite, x, y, size, opacity, rotation = 0, glow = 0) => {
      target.save();
      target.translate(x, y);
      target.rotate(rotation);
      target.globalAlpha = opacity;

      if (glow) {
        target.shadowColor = glow > 1 ? 'rgba(167, 243, 75, .8)' : 'rgba(34, 199, 236, .82)';
        target.shadowBlur = size * (1.4 + glow * 0.7);
      }

      if (sprite) {
        target.drawImage(sprite, -size / 2, -size * 0.63, size, size * 1.27);
      } else {
        target.fillStyle = glow > 1 ? '#a7f34b' : glow ? '#22c7ec' : '#126da6';
        target.font = `800 ${size}px Sora, Manrope, sans-serif`;
        target.textAlign = 'center';
        target.textBaseline = 'middle';
        target.fillText('S', 0, 0);
      }

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

        const mark = document.createElement('canvas');
        mark.width = 40;
        mark.height = 52;
        mark.getContext('2d')?.drawImage(sourceCanvas, 0, 0, mark.width, mark.height);
        baseSprite = tintSprite(mark, ['#0a4d7a', '#1687c4']);
        cyanSprite = tintSprite(mark, ['#087fe0', '#45e3f1']);
        limeSprite = tintSprite(mark, ['#22c7a4', '#a7f34b']);
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
        points.push({ ...point, distance: travelled });
      }

      const branch = {
        points,
        length: travelled,
        depth,
        opacity: 0.22 - depth * 0.026 + random() * 0.08,
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
          const size = (width < 760 ? 5.1 : 5.8) + (3 - branch.depth) * 0.35;
          drawGlyph(
            layerContext,
            baseSprite,
            point.x,
            point.y,
            size,
            branch.opacity * edgeFade,
            angle * 0.08,
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

      pulses.forEach((pulse, pulseIndex) => {
        const movement = reducedMotion ? pulse.offset : seconds * pulse.speed + pulse.offset;
        const headDistance = movement % (pulse.branch.length + 170) - 70;

        for (let trailIndex = 0; trailIndex < pulse.trail; trailIndex += 1) {
          const distance = headDistance - trailIndex * 9;
          const point = pointAtDistance(pulse.branch, distance);
          if (!point) continue;

          const strength = 1 - trailIndex / pulse.trail;
          const size = (width < 760 ? 5.6 : 6.7) + strength * 2.4;
          const sprite = pulse.lime ? limeSprite : cyanSprite;
          drawGlyph(
            context,
            sprite,
            point.x,
            point.y,
            size,
            0.18 + strength * 0.72,
            point.angle * 0.06,
            pulse.lime ? 1.45 : 0.82 + (pulseIndex % 3) * 0.05,
          );
        }
      });
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
