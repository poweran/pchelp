import { useEffect, useRef } from 'react';
import styles from './ParticleBackground.module.css';

interface Particle {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
}

const SPACING = 8;
const PARTICLE_SIZE = 1.6;
const ANGLE_CACHE_SCALE = 320;
const MARGIN = 0;
const FORCE_RADIUS = 160;
const DRAG = 0.92;
const EASE = 0.25;
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

function createParticles(width: number, height: number) {
  const particles: Particle[] = [];
  const usableWidth = Math.max(0, width - MARGIN * 2);
  const usableHeight = Math.max(0, height - MARGIN * 2);
  const cols = Math.max(1, Math.floor(usableWidth / SPACING));
  const rows = Math.max(1, Math.floor(usableHeight / SPACING));
  const gridWidth = (cols - 1) * SPACING;
  const gridHeight = (rows - 1) * SPACING;
  const offsetX = (width - gridWidth) * 0.5;
  const offsetY = (height - gridHeight) * 0.5;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const x = offsetX + col * SPACING;
      const y = offsetY + row * SPACING;

      particles.push({
        x,
        y,
        ox: x,
        oy: y,
        vx: 0,
        vy: 0,
      });
    }
  }

  return particles;
}

const ParticleBackground = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const reduceMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (reduceMotionQuery?.matches) {
      return;
    }

    const hostname = window.location.hostname;
    const isLocalhost =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1';

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    container.appendChild(canvas);

    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    let devicePixelRatio = window.devicePixelRatio || 1;

    let particles: Particle[] = [];
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
    let fpsOverlay: HTMLDivElement | null = null;
    let fpsFrameCount = 0;
    let fpsLastUpdate = 0;

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
    const contourFactorCache = new Map<number, number>();

    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      devicePixelRatio = window.devicePixelRatio || 1;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = Math.floor(width * devicePixelRatio);
      canvas.height = Math.floor(height * devicePixelRatio);

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(devicePixelRatio, devicePixelRatio);
      particles = createParticles(width, height);
      mouseX = width / 2;
      mouseY = height / 2;
      targetMouseX = mouseX;
      targetMouseY = mouseY;
      autoX = mouseX;
      autoY = mouseY;
      autoTargetX = mouseX;
      autoTargetY = mouseY;
      autoVX = 0;
      autoVY = 0;
      nextAutoTargetTime = performance.now() + 1400;
    };

    const handleMouseMove = (event: MouseEvent) => {
      const now = performance.now();
      targetMouseX = event.clientX;
      targetMouseY = event.clientY;
      lastMouseMove = now;
      autoTargetX = targetMouseX;
      autoTargetY = targetMouseY;
      autoX += (targetMouseX - autoX) * 0.2;
      autoY += (targetMouseY - autoY) * 0.2;
      autoVX *= 0.4;
      autoVY *= 0.4;
      nextAutoTargetTime = now + 3200;
    };

    const updateParticles = () => {
      const now = performance.now();
      const safeMargin = Math.min(width, height) * 0.08;
      const maxX = Math.max(safeMargin, width - safeMargin);
      const maxY = Math.max(safeMargin, height - safeMargin);
      const shouldAutoMove = now - lastMouseMove > 3500;
      contourFactorCache.clear();

      if (shouldAutoMove) {
        const distanceToTarget = Math.hypot(autoTargetX - autoX, autoTargetY - autoY);
        const swayValue = swayNoise(now);

        if (now >= nextAutoTargetTime || distanceToTarget < 14) {
          const normalizedRadius = (radiusNoise(now) + 1) * 0.5;
          const sway = swayValue * 0.45;
          const heading = headingNoise(now) * Math.PI + now * 0.00022 + sway;
          const ellipseX = width * (0.2 + normalizedRadius * 0.24);
          const ellipseY = height * (0.16 + (1 - normalizedRadius) * 0.26);
          const candidateX = width * 0.5 + Math.cos(heading) * ellipseX;
          const candidateY = height * 0.5 + Math.sin(heading) * ellipseY;

          autoTargetX = clamp(candidateX, safeMargin, maxX);
          autoTargetY = clamp(candidateY, safeMargin, maxY);
          nextAutoTargetTime = now + 1500 + Math.random() * 2600;
        }

        const swayMix = (swayValue + 1) * 0.5;
        const accelStrength = 0.0016 + swayMix * 0.0005;

        autoVX += (autoTargetX - autoX) * accelStrength;
        autoVY += (autoTargetY - autoY) * accelStrength;

        autoVX *= 0.92;
        autoVY *= 0.92;

        autoVX = clamp(autoVX, -2.4, 2.4);
        autoVY = clamp(autoVY, -2.4, 2.4);

        autoX += autoVX;
        autoY += autoVY;

        const idleMicroX = microNoiseX(now) * 10;
        const idleMicroY = microNoiseY(now) * 10;

        targetMouseX = clamp(autoX + idleMicroX, safeMargin, maxX);
        targetMouseY = clamp(autoY + idleMicroY, safeMargin, maxY);
      } else {
        autoTargetX = targetMouseX;
        autoTargetY = targetMouseY;

        autoVX += (autoTargetX - autoX) * 0.028;
        autoVY += (autoTargetY - autoY) * 0.028;

        autoVX *= 0.6;
        autoVY *= 0.6;

        autoVX = clamp(autoVX, -3, 3);
        autoVY = clamp(autoVY, -3, 3);

        autoX += autoVX;
        autoY += autoVY;
      }

      const movementSpeed = Math.hypot(autoVX, autoVY);
      const pointerOffset = Math.hypot(targetMouseX - mouseX, targetMouseY - mouseY);
      const rawMovementBlend = clamp(movementSpeed * 0.42 + pointerOffset * 0.015, 0, 1.35);
      const movementInfluence = smoothStep(rawMovementBlend);

      const shapePulse = 1 + shapePulseNoise(now) * 0.25 + movementInfluence * 0.45;
      const forceRadius = FORCE_RADIUS * shapePulse;
      const thickness = forceRadius * forceRadius;

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

      for (const particle of particles) {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const rotatedX = dx * cosTwist + dy * sinTwist;
        const rotatedY = -dx * sinTwist + dy * cosTwist;
        const scaledX = rotatedX / stretchBase;
        const scaledY = rotatedY / stretchPerp;
        const distanceSquared = scaledX * scaledX + scaledY * scaledY || 0.0001;

        const angleFromHeading = Math.atan2(scaledY, scaledX);
        const angleKey = Math.round((angleFromHeading + Math.PI) * ANGLE_CACHE_SCALE);
        let contourFactor = contourFactorCache.get(angleKey);
        if (contourFactor === undefined) {
          const contourWave = Math.sin(angleFromHeading * lobeCount + shapePhase) * lobeAmplitude;
          const contourSecondary =
            Math.sin(angleFromHeading * secondaryLobeCount - shapePhase * phaseOffset) * secondaryAmplitude;
          contourFactor = clamp(1 + contourWave + contourSecondary, 0.42, 2.1);
          contourFactorCache.set(angleKey, contourFactor);
        }
        const effectiveThickness = thickness * contourFactor * contourFactor;

        if (distanceSquared < effectiveThickness) {
          const force = -effectiveThickness / distanceSquared;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const forceScale = force / distance;
          particle.vx += forceScale * dx;
          particle.vy += forceScale * dy;
        }

        particle.vx *= DRAG;
        particle.vy *= DRAG;

        particle.x += particle.vx + (particle.ox - particle.x) * EASE;
        particle.y += particle.vy + (particle.oy - particle.y) * EASE;
      }
    };

    const renderParticles = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = 'rgba(37, 99, 235, 0.45)';
      context.beginPath();
      for (const particle of particles) {
        context.rect(particle.x, particle.y, PARTICLE_SIZE, PARTICLE_SIZE);
      }
      context.fill();
    };

    if (isLocalhost) {
      fpsOverlay = document.createElement('div');
      fpsOverlay.className = styles.fpsOverlay;
      fpsOverlay.textContent = 'FPS: --';
      container.appendChild(fpsOverlay);
    }

    const step = () => {
      const now = performance.now();
      updateParticles();
      renderParticles();

      if (isLocalhost && fpsOverlay) {
        fpsFrameCount += 1;
        if (fpsLastUpdate === 0) {
          fpsLastUpdate = now;
        } else if (now - fpsLastUpdate >= 500) {
          const elapsed = now - fpsLastUpdate;
          const fps = (fpsFrameCount * 1000) / elapsed;
          fpsOverlay.textContent = `FPS: ${Math.round(fps)}`;
          fpsFrameCount = 0;
          fpsLastUpdate = now;
        }
      }

      animationFrameId = window.requestAnimationFrame(step);
    };

    const handleResize = () => {
      setCanvasSize();
    };

    setCanvasSize();
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (fpsOverlay) {
        container.removeChild(fpsOverlay);
      }
      container.removeChild(canvas);
    };
  }, []);

  return <div className={styles.background} ref={containerRef} aria-hidden="true" />;
};

export default ParticleBackground;
