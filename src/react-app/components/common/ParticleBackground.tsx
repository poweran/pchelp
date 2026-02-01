import { useEffect, useRef } from 'react';
import styles from './ParticleBackground.module.css';

export interface ParticlePerformanceMetrics {
  fps: number | null;
  cpuLoad: number | null;
  gpuLoad: number | null;
  frameTimeMs: number | null;
  particleCount: number;
  canvasWidth: number;
  canvasHeight: number;
  devicePixelRatio: number;
  isAnimating: boolean;
  lastUpdated: number;
}

declare global {
  interface Window {
    __pcHelpPerformanceMetrics?: ParticlePerformanceMetrics;
  }
}

export const METRICS_EVENT_NAME = 'pcHelp:performanceMetrics';
export const SET_PARTICLE_ANIMATION_EVENT = 'pcHelp:setParticleAnimation';

interface ParticleAnimationEventDetail {
  shouldAnimate: boolean;
}

// Structure of Arrays (SoA) layout for better cache locality and performance
interface ParticleSystem {
  x: Float32Array;
  y: Float32Array;
  ox: Float32Array;
  oy: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  count: number;
}

const SPACING = 5;
const MARGIN = 0;
const FORCE_RADIUS = 140;
const FORCE_THICKNESS_SCALE = 0.65;
const DRAG = 0.92;
const EASE = 0.25;
const IDEAL_FRAME_MS = 1000 / 60;
const MIN_IDLE_LOAD = 0.25;
const PLAYBACK_STORAGE_KEY = 'particle-animation-state';
// Thresholds for sleeping particles
const SLEEP_VELOCITY_SQ = 0.0001;
const SLEEP_POSITION_SQ = 0.01;
const WAKE_DISTANCE_SQ = 22500;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const smoothStep = (t: number) => t * t * (3 - 2 * t);

const createSmoothNoise = (minDuration = 1500, maxDuration = 3200) => {
  let startTime = 0;
  let duration = 1;
  let startValue = Math.random() * 2 - 1;
  let endValue = Math.random() * 2 - 1;

  return (time: number) => {
    if (startTime === 0) {
      startTime = time;
      duration = minDuration + Math.random() * (maxDuration - minDuration);
    }

    const elapsed = time - startTime;
    let progress = elapsed / duration;

    if (progress >= 1) {
      startValue = endValue;
      endValue = Math.random() * 2 - 1;
      startTime = time;
      duration = minDuration + Math.random() * (maxDuration - minDuration);
      progress = 0;
    }

    const eased = smoothStep(Math.max(0, Math.min(1, progress)));
    return startValue * (1 - eased) + endValue * eased;
  };
};

function createParticleSystem(width: number, height: number): ParticleSystem {
  const usableWidth = Math.max(0, width - MARGIN * 2);
  const usableHeight = Math.max(0, height - MARGIN * 2);
  const cols = Math.max(1, Math.floor(usableWidth / SPACING));
  const rows = Math.max(1, Math.floor(usableHeight / SPACING));

  const count = rows * cols;
  const system: ParticleSystem = {
    x: new Float32Array(count),
    y: new Float32Array(count),
    ox: new Float32Array(count),
    oy: new Float32Array(count),
    vx: new Float32Array(count),
    vy: new Float32Array(count),
    count
  };

  const gridWidth = (cols - 1) * SPACING;
  const gridHeight = (rows - 1) * SPACING;
  const offsetX = (width - gridWidth) * 0.5;
  const offsetY = (height - gridHeight) * 0.5;

  let i = 0;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const x = offsetX + col * SPACING;
      const y = offsetY + row * SPACING;

      system.x[i] = x;
      system.y[i] = y;
      system.ox[i] = x;
      system.oy[i] = y;
      system.vx[i] = 0;
      system.vy[i] = 0;

      i++;
    }
  }

  return system;
}

const ParticleBackground = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (reduceMotionQuery?.matches) return;

    const canvas = document.createElement('canvas');
    // We use standard 2d context but will manipulate pixels directly
    const context = canvas.getContext('2d', { willReadFrequently: false });
    if (!context) return;

    container.appendChild(canvas);

    let animationFrameId = 0;
    let isAnimating = false;
    let width = 0;
    let height = 0;

    // Pixel buffer for rendering
    let imageData: ImageData | null = null;
    let buf32: Uint32Array | null = null;
    const COLOR_INT = 0x73EB6325;

    let particleSystem: ParticleSystem = {
      x: new Float32Array(0), y: new Float32Array(0),
      ox: new Float32Array(0), oy: new Float32Array(0),
      vx: new Float32Array(0), vy: new Float32Array(0),
      count: 0
    };

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let lastMouseMove = 0;
    let autoX = 0;
    let autoY = 0;
    let autoTargetX = 0;
    let autoTargetY = 0;
    let autoVX = 0;
    let autoVY = 0;
    let nextAutoTargetTime = 0;

    // Performance stats
    let fpsLastUpdate = 0;
    let accumulatedFrameDuration = 0;
    let accumulatedActiveTime = 0;
    let accumulatedRenderTime = 0;
    let sampleCount = 0;
    let lastMeasuredFps: number | undefined;
    let lastMeasuredCpu: number | undefined;
    let lastMeasuredGpu: number | undefined;
    let isFrameLoopRunning = false;
    let lastFrameTime = performance.now();
    let lastPublishedSignature = '';
    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
      }
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 150);
    };

    const headingNoise = createSmoothNoise(3200, 5200);
    const radiusNoise = createSmoothNoise(2800, 5600);
    const swayNoise = createSmoothNoise(2400, 4800);
    const microNoiseX = createSmoothNoise(700, 1500);
    const microNoiseY = createSmoothNoise(700, 1500);
    const shapeStretchNoise = createSmoothNoise(1700, 3600);
    const shapePulseNoise = createSmoothNoise(1100, 2400);
    const shapeTwistNoise = createSmoothNoise(2100, 4600);
    const shapePhaseNoise = createSmoothNoise(1800, 4200);
    const shapeOutlineNoise = createSmoothNoise(2600, 5200);
    const shapeLobeNoise = createSmoothNoise(3000, 6000);
    const cpuIdleNoise = createSmoothNoise(2400, 5200);
    const gpuIdleNoise = createSmoothNoise(2600, 5600);

    const LOOKUP_SIZE = 360 * 4;
    const contourLookup = new Float32Array(LOOKUP_SIZE);
    const MAX_CONTOUR_FACTOR_SQ = 2.2 * 2.2;

    const publishPerformanceMetrics = (overrides?: Partial<ParticlePerformanceMetrics>) => {
      const metrics: ParticlePerformanceMetrics = {
        fps: overrides?.fps ?? (typeof lastMeasuredFps === 'number' ? lastMeasuredFps : null),
        cpuLoad: overrides?.cpuLoad ?? (typeof lastMeasuredCpu === 'number' ? lastMeasuredCpu : null),
        gpuLoad: overrides?.gpuLoad ?? (typeof lastMeasuredGpu === 'number' ? lastMeasuredGpu : null),
        frameTimeMs:
          overrides?.frameTimeMs ??
          (typeof lastMeasuredFps === 'number' && lastMeasuredFps > 0 ? 1000 / lastMeasuredFps : null),
        particleCount: overrides?.particleCount ?? particleSystem.count,
        canvasWidth: overrides?.canvasWidth ?? width,
        canvasHeight: overrides?.canvasHeight ?? height,
        devicePixelRatio: overrides?.devicePixelRatio ?? 1,
        isAnimating: overrides?.isAnimating ?? isAnimating,
        lastUpdated: Date.now(),
      };

      const signature = JSON.stringify({
        fps: metrics.fps,
        cpuLoad: metrics.cpuLoad,
        gpuLoad: metrics.gpuLoad,
        frameTimeMs: metrics.frameTimeMs,
        particleCount: metrics.particleCount,
        canvasWidth: metrics.canvasWidth,
        canvasHeight: metrics.canvasHeight,
        devicePixelRatio: metrics.devicePixelRatio,
        isAnimating: metrics.isAnimating,
      });

      if (signature === lastPublishedSignature) return;

      lastPublishedSignature = signature;
      window.__pcHelpPerformanceMetrics = metrics;
      window.dispatchEvent(new CustomEvent<ParticlePerformanceMetrics>(METRICS_EVENT_NAME, { detail: metrics }));
    };

    const readPlaybackPreference = (): 'playing' | 'paused' | null => {
      try {
        const value = window.localStorage?.getItem(PLAYBACK_STORAGE_KEY);
        return value === 'playing' || value === 'paused' ? value : null;
      } catch {
        return null;
      }
    };

    const persistPlaybackState = (shouldPlay: boolean) => {
      try {
        window.localStorage?.setItem(PLAYBACK_STORAGE_KEY, shouldPlay ? 'playing' : 'paused');
      } catch { }
    };

    const setCanvasSize = () => {
      // Reverting to window.devicePixelRatio for visual quality (Retina support)
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const realWidth = Math.floor(width * dpr);
      const realHeight = Math.floor(height * dpr);
      canvas.width = realWidth;
      canvas.height = realHeight;

      // Init ImageData buffer
      try {
        imageData = context.createImageData(realWidth, realHeight);
        buf32 = new Uint32Array(imageData.data.buffer);
      } catch (e) {
        console.error("Failed to create ImageData", e);
      }

      particleSystem = createParticleSystem(realWidth, realHeight);

      mouseX = realWidth / 2;
      mouseY = realHeight / 2;
      targetMouseX = mouseX;
      targetMouseY = mouseY;
      autoX = mouseX;
      autoY = mouseY;
      autoTargetX = mouseX;
      autoTargetY = mouseY;
      nextAutoTargetTime = performance.now() + 1400;
      publishPerformanceMetrics({ devicePixelRatio: dpr, canvasWidth: realWidth, canvasHeight: realHeight });
    };

    const handleMouseMove = (event: MouseEvent) => {
      const now = performance.now();
      const dpr = window.devicePixelRatio || 1;
      targetMouseX = event.clientX * dpr;
      targetMouseY = event.clientY * dpr;
      lastMouseMove = now;
      autoTargetX = targetMouseX;
      autoTargetY = targetMouseY;
      autoX += (targetMouseX - autoX) * 0.2;
      autoY += (targetMouseY - autoY) * 0.2;
      autoVX *= 0.4;
      autoVY *= 0.4;
      nextAutoTargetTime = now + 3200;
    };

    const precomputeContour = (lobeCount: number, shapePhase: number, lobeAmplitude: number, secondaryLobeCount: number, phaseOffset: number, secondaryAmplitude: number) => {
      const step = (Math.PI * 2) / LOOKUP_SIZE;
      for (let i = 0; i < LOOKUP_SIZE; i++) {
        const angle = i * step - Math.PI; // -PI to PI
        const contourWave = Math.sin(angle * lobeCount + shapePhase) * lobeAmplitude;
        const contourSecondary = Math.sin(angle * secondaryLobeCount - shapePhase * phaseOffset) * secondaryAmplitude;
        contourLookup[i] = clamp(1 + contourWave + contourSecondary, 0.42, 2.1);
      }
    };

    const updateParticles = () => {
      const now = performance.now();
      const realWidth = canvas.width;
      const realHeight = canvas.height;
      const safeMargin = Math.min(realWidth, realHeight) * 0.08;
      const maxX = Math.max(safeMargin, realWidth - safeMargin);
      const maxY = Math.max(safeMargin, realHeight - safeMargin);
      const shouldAutoMove = now - lastMouseMove > 3500;

      // --- Auto Movement Update ---
      if (shouldAutoMove) {
        // ... same logic as before for auto cursor ...
        const distanceToTarget = Math.hypot(autoTargetX - autoX, autoTargetY - autoY);
        const swayValue = swayNoise(now);
        if (now >= nextAutoTargetTime || distanceToTarget < 14) {
          const normalizedRadius = (radiusNoise(now) + 1) * 0.5;
          const sway = swayValue * 0.45;
          const heading = headingNoise(now) * Math.PI + now * 0.00022 + sway;
          const ellipseX = realWidth * (0.2 + normalizedRadius * 0.24);
          const ellipseY = realHeight * (0.16 + (1 - normalizedRadius) * 0.26);
          const candidateX = realWidth * 0.5 + Math.cos(heading) * ellipseX;
          const candidateY = realHeight * 0.5 + Math.sin(heading) * ellipseY;
          autoTargetX = clamp(candidateX, safeMargin, maxX);
          autoTargetY = clamp(candidateY, safeMargin, maxY);
          nextAutoTargetTime = now + 1500 + Math.random() * 2600;
        }
        const swayMix = (swayValue + 1) * 0.5;
        const accelStrength = 0.0016 + swayMix * 0.0005;
        autoVX += (autoTargetX - autoX) * accelStrength;
        autoVY += (autoTargetY - autoY) * accelStrength;
        autoVX = clamp(autoVX * 0.92, -2.4, 2.4);
        autoVY = clamp(autoVY * 0.92, -2.4, 2.4);
        autoX += autoVX;
        autoY += autoVY;
        targetMouseX = clamp(autoX + (microNoiseX(now) * 10), safeMargin, maxX);
        targetMouseY = clamp(autoY + (microNoiseY(now) * 10), safeMargin, maxY);
      } else {
        autoTargetX = targetMouseX;
        autoTargetY = targetMouseY;
        autoVX += (autoTargetX - autoX) * 0.028;
        autoVY += (autoTargetY - autoY) * 0.028;
        autoVX = clamp(autoVX * 0.6, -3, 3);
        autoVY = clamp(autoVY * 0.6, -3, 3);
        autoX += autoVX;
        autoY += autoVY;
      }

      // --- Shape Parameters ---
      const movementSpeed = Math.hypot(autoVX, autoVY);
      const pointerOffset = Math.hypot(targetMouseX - mouseX, targetMouseY - mouseY);
      const rawMovementBlend = clamp(movementSpeed * 0.42 + pointerOffset * 0.015, 0, 1.35);
      const movementInfluence = smoothStep(rawMovementBlend);

      const shapePulse = 1 + shapePulseNoise(now) * 0.25 + movementInfluence * 0.45;
      const forceRadius = FORCE_RADIUS * shapePulse;
      const thickness = forceRadius * forceRadius * FORCE_THICKNESS_SCALE;
      const stretchBase = clamp(1 + shapeStretchNoise(now) * 0.55 + movementInfluence * 0.5, 0.55, 2.8);
      const stretchPerp = clamp(1 - shapeStretchNoise(now) * 0.4 + movementInfluence * 0.35, 0.55, 2.4);
      const velocityAngle = Math.atan2(autoVY, autoVX) || 0;
      const shapeTwist = shapeTwistNoise(now) * Math.PI * 0.35 + velocityAngle * 0.45;
      const cosTwist = Math.cos(shapeTwist);
      const sinTwist = Math.sin(shapeTwist);

      const shapePhase = now * 0.00055 + shapePhaseNoise(now) * 2.4;
      const outlineMix = (shapeOutlineNoise(now) + 1) * 0.5;
      const lobeCount = 3 + Math.floor((shapeLobeNoise(now) + 1) * 1.5);
      const secondaryLobeCount = lobeCount + 1;
      const lobeAmplitude = 0.26 + movementInfluence * 0.45 + outlineMix * 0.18;
      const secondaryAmplitude = 0.14 + movementInfluence * 0.24 + (1 - outlineMix) * 0.18;
      const phaseOffset = 0.72 + outlineMix * 0.16;

      const pointerEase = shouldAutoMove ? 0.12 + movementInfluence * 0.06 : 0.22;
      mouseX += (targetMouseX - mouseX) * pointerEase;
      mouseY += (targetMouseY - mouseY) * pointerEase;

      // Precompute lookup table for this frame
      precomputeContour(lobeCount, shapePhase, lobeAmplitude, secondaryLobeCount, phaseOffset, secondaryAmplitude);

      const count = particleSystem.count;
      const x = particleSystem.x;
      const y = particleSystem.y;
      const ox = particleSystem.ox;
      const oy = particleSystem.oy;
      const vx = particleSystem.vx;
      const vy = particleSystem.vy;

      const oneOverStretchBase = 1 / stretchBase;
      const oneOverStretchPerp = 1 / stretchPerp;
      const PI_Inverse = 1 / Math.PI;

      // Early exit distance threshold
      const safeMaxDistanceSq = thickness * MAX_CONTOUR_FACTOR_SQ;

      for (let i = 0; i < count; i++) {
        const dx = mouseX - x[i];
        const dy = mouseY - y[i];
        const distSq = dx * dx + dy * dy;

        // --- Sleep Check ---
        const isSettled = (vx[i] * vx[i] < SLEEP_VELOCITY_SQ) &&
          (vy[i] * vy[i] < SLEEP_VELOCITY_SQ) &&
          ((x[i] - ox[i]) * (x[i] - ox[i]) < SLEEP_POSITION_SQ) &&
          ((y[i] - oy[i]) * (y[i] - oy[i]) < SLEEP_POSITION_SQ);

        if (isSettled && distSq > WAKE_DISTANCE_SQ) {
          if (x[i] !== ox[i]) x[i] = ox[i];
          if (y[i] !== oy[i]) y[i] = oy[i];
          vx[i] = 0;
          vy[i] = 0;
          continue;
        }

        // --- Early Exit Physics ---
        const rotatedX = dx * cosTwist + dy * sinTwist;
        const rotatedY = -dx * sinTwist + dy * cosTwist;

        const scaledX = rotatedX * oneOverStretchBase;
        const scaledY = rotatedY * oneOverStretchPerp;
        const distanceSquared = scaledX * scaledX + scaledY * scaledY || 0.0001;

        if (distanceSquared > safeMaxDistanceSq) {
          // Too far, skip force entirely
        } else {
          const angle = Math.atan2(scaledY, scaledX);
          const normalizedAngle = (angle + Math.PI) * PI_Inverse * 0.5;
          const lookupIndex = (normalizedAngle * LOOKUP_SIZE) | 0;
          const safeIndex = Math.max(0, Math.min(LOOKUP_SIZE - 1, lookupIndex));

          const contourFactor = contourLookup[safeIndex];
          const effectiveThickness = thickness * contourFactor * contourFactor;

          if (distanceSquared < effectiveThickness) {
            const pxDistance = Math.sqrt(dx * dx + dy * dy) || 1;
            const forceScale = -effectiveThickness / (distanceSquared * pxDistance);
            vx[i] += forceScale * dx;
            vy[i] += forceScale * dy;
          }
        }

        vx[i] *= DRAG;
        vy[i] *= DRAG;

        x[i] += vx[i] + (ox[i] - x[i]) * EASE;
        y[i] += vy[i] + (oy[i] - y[i]) * EASE;
      }
    };

    const renderParticles = () => {
      if (!buf32 || !imageData) return;

      // Clear buffer (0x00000000)
      buf32.fill(0);

      const count = particleSystem.count;
      const x = particleSystem.x;
      const y = particleSystem.y;
      const w = canvas.width;
      const h = canvas.height;

      for (let i = 0; i < count; i++) {
        const px = x[i] | 0;
        const py = y[i] | 0;

        if (px >= 0 && px < w - 1 && py >= 0 && py < h - 1) {
          const idx = py * w + px;
          buf32[idx] = COLOR_INT;
          buf32[idx + 1] = COLOR_INT;
          buf32[idx + w] = COLOR_INT;
          buf32[idx + w + 1] = COLOR_INT;
        } else if (px >= 0 && px < w && py >= 0 && py < h) {
          buf32[py * w + px] = COLOR_INT;
        }
      }

      context.putImageData(imageData, 0, 0);
    };

    const resetFpsStats = () => {
      fpsLastUpdate = performance.now();
      accumulatedFrameDuration = 0;
      accumulatedActiveTime = 0;
      accumulatedRenderTime = 0;
      sampleCount = 0;
      publishPerformanceMetrics();
    };

    const togglePlayback = () => {
      if (isAnimating) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };

    const handleMediaKey = (event: KeyboardEvent) => {
      if (event.code === 'MediaPlayPause') {
        togglePlayback();
      }
    };

    const handleSetAnimation = (event: Event) => {
      const customEvent = event as CustomEvent<ParticleAnimationEventDetail>;
      const detail = customEvent.detail;
      if (!detail || typeof detail.shouldAnimate !== 'boolean') return;
      if (detail.shouldAnimate) startAnimation();
      else stopAnimation();
    };

    const step = () => {
      if (!isFrameLoopRunning) return;

      const frameStart = performance.now();
      const frameDuration = frameStart - lastFrameTime || IDEAL_FRAME_MS;
      lastFrameTime = frameStart;

      // Throttle animation during scrolling to prioritize browser UI thread
      if (isScrolling && isAnimating) {
        if (sampleCount % 2 === 0) {
          animationFrameId = window.requestAnimationFrame(step);
          return;
        }
      }

      let renderTime = 0;
      let frameEnd = frameStart;

      if (isAnimating) {
        updateParticles();
        const renderStart = performance.now();
        renderParticles();
        frameEnd = performance.now();
        renderTime = frameEnd - renderStart;
      } else {
        frameEnd = performance.now();
      }

      const activeTime = frameEnd - frameStart;
      accumulatedFrameDuration += frameDuration;
      accumulatedActiveTime += activeTime;
      accumulatedRenderTime += renderTime;
      sampleCount += 1;

      if (fpsLastUpdate === 0) fpsLastUpdate = frameStart;

      const elapsedSinceUpdate = frameStart - fpsLastUpdate;
      if (elapsedSinceUpdate >= 500 && sampleCount > 0) {
        const avgFrameDuration = accumulatedFrameDuration / sampleCount;
        const fpsValue = avgFrameDuration > 0 ? 1000 / avgFrameDuration : lastMeasuredFps ?? 0;
        const previousCpuLoad = lastMeasuredCpu ?? MIN_IDLE_LOAD;
        const avgActive = accumulatedActiveTime / sampleCount;
        let cpuValue = (avgActive / IDEAL_FRAME_MS) * 100;

        if (!Number.isFinite(cpuValue)) cpuValue = lastMeasuredCpu ?? MIN_IDLE_LOAD;
        cpuValue = Math.min(100, Math.max(MIN_IDLE_LOAD, cpuValue));

        if (!isAnimating) {
          const idleCpuBase = Math.max(previousCpuLoad * 0.9, MIN_IDLE_LOAD * 2.6);
          const idleCpuVariation = (cpuIdleNoise(frameStart) + 1) * 0.5 * 6;
          const idleCpuTarget = Math.min(100, idleCpuBase + idleCpuVariation);
          cpuValue = previousCpuLoad !== undefined ? previousCpuLoad * 0.6 + idleCpuTarget * 0.4 : idleCpuTarget;
        }

        const avgRender = accumulatedRenderTime / sampleCount;
        const idleGpuLoad = Math.max(MIN_IDLE_LOAD * 0.5, cpuValue * 0.35);
        let gpuValue: number;

        if (avgRender > 0) {
          gpuValue = (avgRender / IDEAL_FRAME_MS) * 100;
        } else if (!isAnimating) {
          const previousGpu = lastMeasuredGpu ?? idleGpuLoad;
          const idleGpuBase = Math.max(idleGpuLoad, cpuValue * 0.28);
          const idleGpuVariation = (gpuIdleNoise(frameStart) + 1) * 0.5 * 4.8;
          const idleGpuTarget = Math.min(100, idleGpuBase + idleGpuVariation);
          gpuValue = previousGpu * 0.55 + idleGpuTarget * 0.45;
        } else {
          gpuValue = lastMeasuredGpu ?? idleGpuLoad;
        }

        gpuValue = Math.min(100, Math.max(MIN_IDLE_LOAD * 0.5, gpuValue));

        lastMeasuredFps = fpsValue;
        lastMeasuredCpu = cpuValue;
        lastMeasuredGpu = gpuValue;
        publishPerformanceMetrics({ fps: fpsValue, cpuLoad: cpuValue, gpuLoad: gpuValue, frameTimeMs: avgFrameDuration });

        accumulatedFrameDuration = 0;
        accumulatedActiveTime = 0;
        accumulatedRenderTime = 0;
        sampleCount = 0;
        fpsLastUpdate = frameStart;
      }

      if (isFrameLoopRunning) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setCanvasSize();
      }, 200);
    };

    const ensureFrameLoop = () => {
      if (isFrameLoopRunning) return;
      isFrameLoopRunning = true;
      lastFrameTime = performance.now();
      fpsLastUpdate = performance.now();
      accumulatedFrameDuration = 0;
      accumulatedActiveTime = 0;
      accumulatedRenderTime = 0;
      sampleCount = 0;
      animationFrameId = window.requestAnimationFrame(step);
    };

    const startAnimation = () => {
      if (isAnimating) return;
      isAnimating = true;
      lastMeasuredFps = undefined;
      lastMeasuredCpu = undefined;
      lastMeasuredGpu = undefined;
      resetFpsStats();
      ensureFrameLoop();
      persistPlaybackState(true);
    };

    const stopAnimation = (persist = true) => {
      if (!isAnimating) return;
      isAnimating = false;
      resetFpsStats();
      publishPerformanceMetrics();
      if (persist) persistPlaybackState(false);
    };

    setCanvasSize();
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleMediaKey);
    window.addEventListener(SET_PARTICLE_ANIMATION_EVENT, handleSetAnimation as EventListener);

    const storedPlayback = readPlaybackPreference();
    if (storedPlayback === 'paused') {
      resetFpsStats();
      ensureFrameLoop();
      persistPlaybackState(false);
    } else {
      startAnimation();
    }

    return () => {
      stopAnimation(false);
      isFrameLoopRunning = false;
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleMediaKey);
      window.removeEventListener(SET_PARTICLE_ANIMATION_EVENT, handleSetAnimation as EventListener);
      animationFrameId = 0;
      if (container.contains(canvas)) container.removeChild(canvas);
      window.__pcHelpPerformanceMetrics = undefined;
    };
  }, []);

  return <div className={styles.background} ref={containerRef} aria-hidden="true" />;
};

export default ParticleBackground;
