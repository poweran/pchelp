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
const MARGIN = 0;
const FORCE_RADIUS = 160;
const DRAG = 0.92;
const EASE = 0.25;
const THICKNESS = FORCE_RADIUS * FORCE_RADIUS;

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
    let lastMouseMove = 0;

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
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      lastMouseMove = performance.now();
    };

    const updateParticles = () => {
      const now = performance.now();
      const shouldAutoMove = now - lastMouseMove > 3500;

      if (shouldAutoMove) {
        const t = now * 0.0004;
        mouseX = width * 0.5 + Math.cos(t * 2.1) * width * 0.35;
        mouseY = height * 0.5 + Math.sin(t * 1.8) * height * 0.25;
      }

      for (const particle of particles) {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distanceSquared = dx * dx + dy * dy || 0.0001;

        if (distanceSquared < THICKNESS) {
          const force = -THICKNESS / distanceSquared;
          const angle = Math.atan2(dy, dx);
          particle.vx += force * Math.cos(angle);
          particle.vy += force * Math.sin(angle);
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
      for (const particle of particles) {
        context.fillRect(particle.x, particle.y, 1.6, 1.6);
      }
    };

    const step = () => {
      updateParticles();
      renderParticles();
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
      container.removeChild(canvas);
    };
  }, []);

  return <div className={styles.background} ref={containerRef} aria-hidden="true" />;
};

export default ParticleBackground;
