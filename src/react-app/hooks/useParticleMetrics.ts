import { useEffect, useState } from 'react';
import type { ParticlePerformanceMetrics } from '../components/common/ParticleBackground';
import { METRICS_EVENT_NAME } from '../components/common/ParticleBackground';

const DEFAULT_METRICS: ParticlePerformanceMetrics = {
  fps: null,
  cpuLoad: null,
  gpuLoad: null,
  frameTimeMs: null,
  particleCount: 0,
  canvasWidth: 0,
  canvasHeight: 0,
  devicePixelRatio: 1,
  isAnimating: false,
  lastUpdated: 0,
};

export function useParticleMetrics(): ParticlePerformanceMetrics {
  const [metrics, setMetrics] = useState<ParticlePerformanceMetrics>(() => {
    if (typeof window !== 'undefined' && window.__pcHelpPerformanceMetrics) {
      return window.__pcHelpPerformanceMetrics;
    }
    return DEFAULT_METRICS;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const applyLatestMetrics = () => {
      const latest = window.__pcHelpPerformanceMetrics;
      if (latest) {
        setMetrics(latest);
      }
    };

    applyLatestMetrics();

    const handleMetricsUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<ParticlePerformanceMetrics>;
      if (customEvent.detail) {
        setMetrics(customEvent.detail);
      }
    };

    window.addEventListener(METRICS_EVENT_NAME, handleMetricsUpdate);

    return () => {
      window.removeEventListener(METRICS_EVENT_NAME, handleMetricsUpdate);
    };
  }, []);

  return metrics;
}
