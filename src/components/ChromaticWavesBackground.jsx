import { useEffect, useMemo, useRef, useState } from 'react';

const MAX_COLORS = 10;

const perlinVertexShader = `#version 300 es
in vec2 uv;
in vec2 position;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const perlinFragmentShader = `#version 300 es
precision mediump float;
uniform float uFrequency;
uniform float uTime;
uniform float uSpeed;
uniform float uValue;
uniform vec2 uResolution;
in vec2 vUv;
out vec4 fragColor;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m *= m;
  return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  uv = (uv - 0.5) * vec2(aspect, 1.0) + 0.5;
  float hue = abs(snoise(vec3(uv * uFrequency, uTime * uSpeed)));
  fragColor = vec4(hsv2rgb(vec3(hue, 1.0, uValue)), 1.0);
}`;

const dotVertexShader = `#version 300 es
in vec2 uv;
in vec2 position;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const dotFragmentShader = `#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform sampler2D uTexture;
uniform int uPaletteCount;
uniform vec3 uPalette[10];
uniform float uPaletteAlpha[10];
uniform float uCellSize;
uniform float uGamma;
uniform float uPaletteBias;
out vec4 fragColor;

void main() {
  vec2 pix = gl_FragCoord.xy;
  float cell = max(uCellSize, 1.0);
  vec2 cellIdx = floor(pix / cell);
  vec2 cellCenter = (cellIdx + 0.5) * cell;
  vec3 col = texture(uTexture, cellCenter / uResolution.xy).rgb;
  float gray = 0.3 * col.r + 0.59 * col.g + 0.11 * col.b;
  gray = pow(clamp(gray, 0.0001, 1.0), uGamma);

  vec2 cellUV = fract(pix / cell) - 0.5;
  float dist = length(cellUV);
  float radius = clamp(gray + uPaletteBias, 0.0, 1.0) * 0.5;
  float aa = fwidth(dist) + 0.0001;
  float mark = 1.0 - smoothstep(radius - aa, radius + aa, dist);

  float palettePosition = clamp(gray + uPaletteBias, 0.0, 1.0);
  int count = max(uPaletteCount, 1);
  vec3 dotColor;
  float dotOpacity;
  if (count <= 1) {
    dotColor = uPalette[0];
    dotOpacity = uPaletteAlpha[0];
  } else {
    float scaled = palettePosition * float(count - 1);
    int segment = clamp(int(floor(scaled)), 0, count - 2);
    float blend = clamp(scaled - float(segment), 0.0, 1.0);
    dotColor = mix(uPalette[segment], uPalette[segment + 1], blend);
    dotOpacity = mix(uPaletteAlpha[segment], uPaletteAlpha[segment + 1], blend);
  }
  fragColor = vec4(dotColor, mark * dotOpacity);
}`;

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const mapLinear = (value, inMin, inMax, outMin, outMax) => {
  if (inMax === inMin) return outMin;
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
};

const parseColor = (input) => {
  const value = String(input || '').trim();
  const rgba = value.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i);
  if (rgba) {
    return [
      clamp(Number(rgba[1]), 0, 255) / 255,
      clamp(Number(rgba[2]), 0, 255) / 255,
      clamp(Number(rgba[3]), 0, 255) / 255,
      rgba[4] === undefined ? 1 : clamp(Number(rgba[4]), 0, 1),
    ];
  }

  const hex = value.replace(/^#/, '');
  if (/^[\da-f]{3,8}$/i.test(hex)) {
    const normalized = hex.length <= 4
      ? [...hex].map((character) => `${character}${character}`).join('')
      : hex;
    const hasAlpha = normalized.length === 8;
    return [
      parseInt(normalized.slice(0, 2), 16) / 255,
      parseInt(normalized.slice(2, 4), 16) / 255,
      parseInt(normalized.slice(4, 6), 16) / 255,
      hasAlpha ? parseInt(normalized.slice(6, 8), 16) / 255 : 1,
    ];
  }

  return [0, 0, 0, 1];
};

const createPalette = (colors) => {
  const rgb = new Float32Array(MAX_COLORS * 3);
  const alpha = new Float32Array(MAX_COLORS);
  for (let index = 0; index < MAX_COLORS; index += 1) {
    const [red, green, blue, opacity] = colors[index]
      ? parseColor(colors[index])
      : [0, 0, 0, 0];
    rgb.set([red, green, blue], index * 3);
    alpha[index] = opacity;
  }
  return { rgb, alpha, count: clamp(colors.length, 1, MAX_COLORS) };
};

const createProgram = (gl, vertexSource, fragmentSource) => {
  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader) || 'Falha ao compilar shader';
      gl.deleteShader(shader);
      throw new Error(message);
    }
    return shader;
  };

  const vertex = compile(gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.bindAttribLocation(program, 0, 'position');
  gl.bindAttribLocation(program, 1, 'uv');
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) || 'Falha ao vincular shader';
    gl.deleteProgram(program);
    throw new Error(message);
  }
  return program;
};

const createCanvas2DFallback = (container, settingsRef) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return undefined;

  canvas.setAttribute('aria-hidden', 'true');
  canvas.dataset.renderer = 'canvas-2d';
  container.appendChild(canvas);

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  let active = true;
  let rafId = 0;
  let themeFrameId = 0;
  let lastFrame = 0;
  let width = 1;
  let height = 1;
  let pixelRatio = 1;

  const resize = () => {
    const rect = container.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(1, Math.round(width * pixelRatio));
    canvas.height = Math.max(1, Math.round(height * pixelRatio));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const render = (time = 0) => {
    const settings = settingsRef.current;
    const palette = settings.palette;
    const paletteCount = Math.max(1, palette.count);
    const spacing = width < 760 ? 13 : 11;
    const phase = time * 0.00018 * settings.speed;
    const paths = Array.from({ length: paletteCount }, () => []);

    context.clearRect(0, 0, width, height);

    for (let y = -spacing; y <= height + spacing; y += spacing) {
      const normalizedY = y / height;
      for (let x = -spacing; x <= width + spacing; x += spacing) {
        const normalizedX = x / width;
        const ridgeA = 0.3
          + 0.12 * Math.sin(normalizedX * 7.2 + phase)
          + 0.045 * Math.sin(normalizedX * 15.4 - phase * 0.6);
        const ridgeB = 0.69
          + 0.11 * Math.sin(normalizedX * 6.4 - phase * 0.86 + 1.6)
          + 0.05 * Math.cos(normalizedX * 14 + phase * 0.45);
        const distanceA = (normalizedY - ridgeA) / 0.115;
        const distanceB = (normalizedY - ridgeB) / 0.13;
        const bandA = Math.exp(-(distanceA * distanceA));
        const bandB = Math.exp(-(distanceB * distanceB));
        const interference = 0.62
          + 0.38 * (0.5 + 0.5 * Math.sin((normalizedX + normalizedY * 0.75) * 10.5 - phase * 0.55));
        const intensity = clamp(Math.max(bandA, bandB * 0.86) * interference, 0, 1);

        if (intensity < 0.09) continue;

        const radius = 0.55 + intensity * 1.85;
        const paletteIndex = Math.min(paletteCount - 1, Math.floor(intensity * paletteCount));
        const driftX = Math.sin(y * 0.055 + phase) * 1.25;
        const driftY = Math.cos(x * 0.035 - phase * 0.72) * 0.8;
        paths[paletteIndex].push([x + driftX, y + driftY, radius]);
      }
    }

    paths.forEach((dots, index) => {
      if (!dots.length) return;
      const offset = index * 3;
      const red = Math.round(palette.rgb[offset] * 255);
      const green = Math.round(palette.rgb[offset + 1] * 255);
      const blue = Math.round(palette.rgb[offset + 2] * 255);
      context.beginPath();
      dots.forEach(([x, y, radius]) => {
        context.moveTo(x + radius, y);
        context.arc(x, y, radius, 0, Math.PI * 2);
      });
      context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${palette.alpha[index]})`;
      context.fill();
    });
  };

  const animate = (time) => {
    if (!active || document.hidden) {
      rafId = 0;
      return;
    }
    const frameInterval = width < 760 ? 1000 / 20 : 1000 / 24;
    if (time - lastFrame >= frameInterval) {
      render(time);
      lastFrame = time;
    }
    rafId = requestAnimationFrame(animate);
  };

  const restart = () => {
    if (rafId) cancelAnimationFrame(rafId);
    render(performance.now());
    rafId = reducedMotion?.matches || document.hidden ? 0 : requestAnimationFrame(animate);
  };

  const handleVisibilityChange = () => {
    if (document.hidden && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    } else if (!document.hidden) {
      restart();
    }
  };

  resize();
  restart();

  const resizeObserver = new ResizeObserver(() => {
    resize();
    render(performance.now());
  });
  const themeObserver = new MutationObserver(() => {
    if (themeFrameId) cancelAnimationFrame(themeFrameId);
    themeFrameId = requestAnimationFrame(() => render(performance.now()));
  });

  resizeObserver.observe(container);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  document.addEventListener('visibilitychange', handleVisibilityChange);
  reducedMotion?.addEventListener?.('change', restart);

  return () => {
    active = false;
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    reducedMotion?.removeEventListener?.('change', restart);
    if (rafId) cancelAnimationFrame(rafId);
    if (themeFrameId) cancelAnimationFrame(themeFrameId);
    resizeObserver.disconnect();
    themeObserver.disconnect();
    if (canvas.parentElement === container) container.removeChild(canvas);
  };
};

const THEME_PALETTES = {
  light: [
    'rgba(4, 39, 61, .48)',
    'rgba(8, 127, 224, .82)',
    'rgba(34, 199, 236, .88)',
    'rgba(118, 89, 237, .72)',
  ],
  dark: [
    'rgba(8, 127, 224, .56)',
    'rgba(34, 199, 236, .9)',
    'rgba(102, 222, 255, .92)',
    'rgba(135, 105, 255, .76)',
  ],
};

const readTheme = () => (
  typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark'
    ? 'dark'
    : 'light'
);

const ChromaticWavesBackground = ({
  frequency = 6,
  speed = 2,
  bgColor = null,
  colors = null,
  cellSize = 5,
  gamma = 2.6,
  paletteBias = 0.4,
}) => {
  const containerRef = useRef(null);
  const [isFallback, setIsFallback] = useState(false);
  const [theme, setTheme] = useState(readTheme);
  const activeColors = colors?.length ? colors : THEME_PALETTES[theme];
  const paletteKey = activeColors.slice(0, MAX_COLORS).join('|');
  const palette = useMemo(() => createPalette(paletteKey.split('|')), [paletteKey]);
  const settingsRef = useRef({ frequency, speed, cellSize, gamma, paletteBias, palette });

  settingsRef.current = { frequency, speed, cellSize, gamma, paletteBias, palette };

  useEffect(() => {
    const root = document.documentElement;
    const syncTheme = () => setTheme(readTheme());
    const observer = new MutationObserver(syncTheme);

    syncTheme();
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    if (typeof window.WebGL2RenderingContext === 'undefined') {
      setIsFallback(true);
      return createCanvas2DFallback(container, settingsRef);
    }

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    let active = true;
    let rafId = 0;
    let lastFrame = 0;

    try {
      const canvas = document.createElement('canvas');
      canvas.setAttribute('aria-hidden', 'true');
      container.appendChild(canvas);
      const gl = canvas.getContext('webgl2', {
        alpha: true,
        antialias: false,
        premultipliedAlpha: false,
        powerPreference: 'low-power',
      });
      if (!gl) throw new Error('WebGL 2 indisponível');

      const perlinProgram = createProgram(gl, perlinVertexShader, perlinFragmentShader);
      const dotProgram = createProgram(gl, dotVertexShader, dotFragmentShader);
      const vertexArray = gl.createVertexArray();
      const buffer = gl.createBuffer();
      gl.bindVertexArray(vertexArray);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1,
        -1, 1, 0, 1, 1, -1, 1, 0, 1, 1, 1, 1,
      ]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
      gl.enableVertexAttribArray(1);
      gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);

      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const framebuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      const perlinUniforms = {
        time: gl.getUniformLocation(perlinProgram, 'uTime'),
        frequency: gl.getUniformLocation(perlinProgram, 'uFrequency'),
        speed: gl.getUniformLocation(perlinProgram, 'uSpeed'),
        value: gl.getUniformLocation(perlinProgram, 'uValue'),
        resolution: gl.getUniformLocation(perlinProgram, 'uResolution'),
      };
      const dotUniforms = {
        resolution: gl.getUniformLocation(dotProgram, 'uResolution'),
        texture: gl.getUniformLocation(dotProgram, 'uTexture'),
        count: gl.getUniformLocation(dotProgram, 'uPaletteCount'),
        palette: gl.getUniformLocation(dotProgram, 'uPalette[0]'),
        alpha: gl.getUniformLocation(dotProgram, 'uPaletteAlpha[0]'),
        cellSize: gl.getUniformLocation(dotProgram, 'uCellSize'),
        gamma: gl.getUniformLocation(dotProgram, 'uGamma'),
        bias: gl.getUniformLocation(dotProgram, 'uPaletteBias'),
      };

      const resize = () => {
        const width = Math.max(container.clientWidth, 1);
        const height = Math.max(container.clientHeight, 1);
        const dpr = Math.min(window.devicePixelRatio || 1, width < 760 ? 1.25 : 1.75);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      };

      const render = (time = 0) => {
        const settings = settingsRef.current;
        gl.bindVertexArray(vertexArray);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.disable(gl.BLEND);
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.useProgram(perlinProgram);
        gl.uniform1f(perlinUniforms.time, time * 0.001);
        gl.uniform1f(perlinUniforms.frequency, mapLinear(settings.frequency, 1, 10, 0.3, 6));
        gl.uniform1f(perlinUniforms.speed, settings.speed * 0.05);
        gl.uniform1f(perlinUniforms.value, 1);
        gl.uniform2f(perlinUniforms.resolution, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.useProgram(dotProgram);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(dotUniforms.texture, 0);
        gl.uniform2f(dotUniforms.resolution, canvas.width, canvas.height);
        gl.uniform1i(dotUniforms.count, settings.palette.count);
        gl.uniform3fv(dotUniforms.palette, settings.palette.rgb);
        gl.uniform1fv(dotUniforms.alpha, settings.palette.alpha);
        gl.uniform1f(dotUniforms.cellSize, mapLinear(settings.cellSize, 1, 100, 6, 60));
        gl.uniform1f(dotUniforms.gamma, mapLinear(settings.gamma, 1, 20, 0.5, 8));
        gl.uniform1f(dotUniforms.bias, settings.paletteBias * 0.05);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      };

      const animate = (time) => {
        if (!active || document.hidden) {
          rafId = 0;
          return;
        }
        const frameInterval = window.innerWidth < 760 ? 1000 / 24 : 1000 / 30;
        if (time - lastFrame >= frameInterval) {
          render(time);
          lastFrame = time;
        }
        rafId = requestAnimationFrame(animate);
      };

      const restart = () => {
        if (rafId) cancelAnimationFrame(rafId);
        render(0);
        if (!reducedMotion?.matches && !document.hidden) rafId = requestAnimationFrame(animate);
      };
      const handleVisibilityChange = () => {
        if (document.hidden && rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        } else if (!document.hidden) {
          restart();
        }
      };

      resize();
      restart();
      const resizeObserver = new ResizeObserver(() => {
        resize();
        if (reducedMotion?.matches) render(0);
      });
      resizeObserver.observe(container);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      reducedMotion?.addEventListener?.('change', restart);

      return () => {
        active = false;
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        reducedMotion?.removeEventListener?.('change', restart);
        if (rafId) cancelAnimationFrame(rafId);
        resizeObserver.disconnect();
        gl.deleteFramebuffer(framebuffer);
        gl.deleteTexture(texture);
        gl.deleteBuffer(buffer);
        gl.deleteVertexArray(vertexArray);
        gl.deleteProgram(perlinProgram);
        gl.deleteProgram(dotProgram);
        if (canvas.parentElement === container) container.removeChild(canvas);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      };
    } catch {
      setIsFallback(true);
      const canvas = container.querySelector('canvas');
      if (canvas) canvas.remove();
      return createCanvas2DFallback(container, settingsRef);
    }
  }, []);

  return (
    <div
      className={`home-chromatic-waves${isFallback ? ' is-fallback' : ''}`}
      style={{ backgroundColor: bgColor || 'var(--home-mesh-background, #f4f8fa)' }}
      data-wave-theme={theme}
      aria-hidden="true"
    >
      <div ref={containerRef} className="home-chromatic-waves-canvas" />
    </div>
  );
};

export default ChromaticWavesBackground;
