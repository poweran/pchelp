import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './StatisticsPage.css';
import { useParticleMetrics } from '../hooks/useParticleMetrics';
import { useSystemMetrics } from '../hooks/useSystemMetrics';
import { SET_PARTICLE_ANIMATION_EVENT } from '../components/common/ParticleBackground';

const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;

function formatBytes(
  value: number | null,
  formatter: Intl.NumberFormat,
  fallback: string
): string {
  if (value === null || !Number.isFinite(value) || value < 0) {
    return fallback;
  }

  if (value === 0) {
    return `0 ${BYTE_UNITS[0]}`;
  }

  const unitIndex = Math.min(Math.floor(Math.log(value) / Math.log(1024)), BYTE_UNITS.length - 1);
  const scaled = value / 1024 ** unitIndex;
  return `${formatter.format(scaled)} ${BYTE_UNITS[unitIndex]}`;
}

function formatSeconds(
  seconds: number | null,
  integerFormatter: Intl.NumberFormat,
  fallback: string
): string {
  if (seconds === null || !Number.isFinite(seconds) || seconds < 0) {
    return fallback;
  }

  if (seconds < 60) {
    return `${integerFormatter.format(Math.round(seconds))} s`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${integerFormatter.format(minutes)} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${integerFormatter.format(hours)} h ${integerFormatter.format(remainingMinutes)} min`;
}

function formatPercentage(
  value: number | null,
  integerFormatter: Intl.NumberFormat,
  fallback: string
): string {
  if (value === null || !Number.isFinite(value)) {
    return fallback;
  }

  return `${integerFormatter.format(Math.round(value * 100))}%`;
}

export default function StatisticsPage() {
  const { t, i18n } = useTranslation();
  const particleMetrics = useParticleMetrics();
  const { metrics: systemMetrics, refresh } = useSystemMetrics();
  const [refreshing, setRefreshing] = useState<Record<string, boolean>>({});

  const integerFormatter = useMemo(
    () => new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 0 }),
    [i18n.language]
  );

  const decimalFormatter = useMemo(
    () =>
      new Intl.NumberFormat(i18n.language, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
    [i18n.language]
  );

  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(i18n.language, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    [i18n.language]
  );

  const handleRefresh = useCallback(
    async (key: string, action?: () => void | Promise<void>) => {
      if (!action) {
        return;
      }

      setRefreshing(prev => ({ ...prev, [key]: true }));
      try {
        await Promise.resolve(action());
      } finally {
        setRefreshing(prev => ({ ...prev, [key]: false }));
      }
    },
    []
  );

  const handleAnimationToggle = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.dispatchEvent(
      new CustomEvent(SET_PARTICLE_ANIMATION_EVENT, {
        detail: { shouldAnimate: !particleMetrics.isAnimating },
      })
    );
  }, [particleMetrics.isAnimating]);

  const fpsValue =
    particleMetrics.fps !== null ? decimalFormatter.format(particleMetrics.fps) : '—';
  const frameTimeValue =
    particleMetrics.frameTimeMs !== null
      ? `${decimalFormatter.format(particleMetrics.frameTimeMs)} ms`
      : '—';
  const cpuValue =
    particleMetrics.cpuLoad !== null
      ? `${integerFormatter.format(Math.round(particleMetrics.cpuLoad))}%`
      : '—';
  const gpuValue =
    particleMetrics.gpuLoad !== null
      ? `${integerFormatter.format(Math.round(particleMetrics.gpuLoad))}%`
      : '—';
  const performanceTimestamp =
    particleMetrics.lastUpdated > 0 ? new Date(particleMetrics.lastUpdated) : null;

  const listFormatter = useMemo(() => {
    try {
      return new Intl.ListFormat(i18n.language, {
        style: 'long',
        type: 'conjunction',
      });
    } catch {
      return null;
    }
  }, [i18n.language]);

  const languagesValue =
    systemMetrics.system.languages && systemMetrics.system.languages.length > 0
      ? listFormatter
        ? listFormatter.format(Array.from(systemMetrics.system.languages))
        : systemMetrics.system.languages.join(', ')
      : '—';

  const memoryAvailable =
    systemMetrics.memory.jsHeapSizeLimit !== null && systemMetrics.memory.usedJSHeapSize !== null
      ? Math.max(
          systemMetrics.memory.jsHeapSizeLimit - systemMetrics.memory.usedJSHeapSize,
          0
        )
      : null;

  const storageFree =
    systemMetrics.storage.quota !== null && systemMetrics.storage.usage !== null
      ? Math.max(systemMetrics.storage.quota - systemMetrics.storage.usage, 0)
      : null;

  const networkTimestamp =
    systemMetrics.connection.timestamp !== null
      ? new Date(systemMetrics.connection.timestamp)
      : null;

  const memoryTimestamp =
    systemMetrics.memory.timestamp !== null ? new Date(systemMetrics.memory.timestamp) : null;

  const storageTimestamp =
    systemMetrics.storage.timestamp !== null ? new Date(systemMetrics.storage.timestamp) : null;

  const batteryTimestamp =
    systemMetrics.battery.timestamp !== null ? new Date(systemMetrics.battery.timestamp) : null;

  const performanceCards = [
    {
      key: 'state',
      label: t('statisticsPage.performance.metrics.state'),
      value: t(
        particleMetrics.isAnimating
          ? 'statisticsPage.performance.state.running'
          : 'statisticsPage.performance.state.paused'
      ),
      caption: t('statisticsPage.performance.captions.state'),
    },
    {
      key: 'fps',
      label: t('statisticsPage.performance.metrics.fps'),
      value: fpsValue,
      caption: t('statisticsPage.performance.captions.fps'),
    },
    {
      key: 'frameTime',
      label: t('statisticsPage.performance.metrics.frameTime'),
      value: frameTimeValue,
      caption: t('statisticsPage.performance.captions.frameTime'),
    },
    {
      key: 'cpu',
      label: t('statisticsPage.performance.metrics.cpu'),
      value: cpuValue,
      caption: t('statisticsPage.performance.captions.cpu'),
    },
    {
      key: 'gpu',
      label: t('statisticsPage.performance.metrics.gpu'),
      value: gpuValue,
      caption: t('statisticsPage.performance.captions.gpu'),
    },
  ];

  const systemCards = [
    {
      key: 'platform',
      label: t('statisticsPage.system.metrics.platform'),
      value: systemMetrics.system.platform ?? '—',
      caption: t('statisticsPage.system.captions.platform'),
    },
    {
      key: 'browser',
      label: t('statisticsPage.system.metrics.browser'),
      value: systemMetrics.system.userAgent ?? '—',
      caption: t('statisticsPage.system.captions.browser'),
    },
    {
      key: 'language',
      label: t('statisticsPage.system.metrics.language'),
      value: systemMetrics.system.language ?? '—',
      caption: t('statisticsPage.system.captions.language'),
    },
    {
      key: 'languages',
      label: t('statisticsPage.system.metrics.languages'),
      value: languagesValue,
      caption: t('statisticsPage.system.captions.languages'),
    },
    {
      key: 'timezone',
      label: t('statisticsPage.system.metrics.timezone'),
      value: systemMetrics.system.timezone ?? '—',
      caption: t('statisticsPage.system.captions.timezone'),
    },
  ];

  const hardwareCards = [
    {
      key: 'cpu',
      label: t('statisticsPage.hardware.metrics.cpu'),
      value:
        systemMetrics.hardware.hardwareConcurrency !== null
          ? t('statisticsPage.hardware.values.cpu', {
              count: integerFormatter.format(systemMetrics.hardware.hardwareConcurrency),
            })
          : '—',
      caption: t('statisticsPage.hardware.captions.cpu'),
    },
    {
      key: 'memory',
      label: t('statisticsPage.hardware.metrics.memory'),
      value:
        systemMetrics.hardware.deviceMemoryGB !== null
          ? `${decimalFormatter.format(systemMetrics.hardware.deviceMemoryGB)} GB`
          : '—',
      caption: t('statisticsPage.hardware.captions.memory'),
    },
    {
      key: 'gpuVendor',
      label: t('statisticsPage.hardware.metrics.gpuVendor'),
      value: systemMetrics.hardware.gpuVendor ?? '—',
      caption: t('statisticsPage.hardware.captions.gpuVendor'),
    },
    {
      key: 'gpuRenderer',
      label: t('statisticsPage.hardware.metrics.gpuRenderer'),
      value: systemMetrics.hardware.gpuRenderer ?? '—',
      caption: t('statisticsPage.hardware.captions.gpuRenderer'),
    },
  ];

  const screenCards = [
    {
      key: 'resolution',
      label: t('statisticsPage.screen.metrics.resolution'),
      value:
        systemMetrics.screen.width !== null && systemMetrics.screen.height !== null
          ? `${integerFormatter.format(systemMetrics.screen.width)} × ${integerFormatter.format(
              systemMetrics.screen.height
            )}`
          : '—',
      caption: t('statisticsPage.screen.captions.resolution'),
    },
    {
      key: 'workspace',
      label: t('statisticsPage.screen.metrics.workspace'),
      value:
        systemMetrics.screen.availWidth !== null && systemMetrics.screen.availHeight !== null
          ? `${integerFormatter.format(
              systemMetrics.screen.availWidth
            )} × ${integerFormatter.format(systemMetrics.screen.availHeight)}`
          : '—',
      caption: t('statisticsPage.screen.captions.workspace'),
    },
    {
      key: 'pixelRatio',
      label: t('statisticsPage.screen.metrics.pixelRatio'),
      value:
        systemMetrics.screen.pixelRatio !== null
          ? decimalFormatter.format(systemMetrics.screen.pixelRatio)
          : '—',
      caption: t('statisticsPage.screen.captions.pixelRatio'),
    },
    {
      key: 'colorDepth',
      label: t('statisticsPage.screen.metrics.colorDepth'),
      value:
        systemMetrics.screen.colorDepth !== null
          ? t('statisticsPage.screen.values.colorDepth', {
              depth: integerFormatter.format(systemMetrics.screen.colorDepth),
            })
          : '—',
      caption: t('statisticsPage.screen.captions.colorDepth'),
    },
  ];

  const memoryCards = [
    {
      key: 'usedHeap',
      label: t('statisticsPage.memory.metrics.used'),
      value: formatBytes(systemMetrics.memory.usedJSHeapSize, decimalFormatter, '—'),
      caption: t('statisticsPage.memory.captions.used'),
    },
    {
      key: 'freeHeap',
      label: t('statisticsPage.memory.metrics.free'),
      value: formatBytes(memoryAvailable, decimalFormatter, '—'),
      caption: t('statisticsPage.memory.captions.free'),
    },
    {
      key: 'limitHeap',
      label: t('statisticsPage.memory.metrics.limit'),
      value: formatBytes(systemMetrics.memory.jsHeapSizeLimit, decimalFormatter, '—'),
      caption: t('statisticsPage.memory.captions.limit'),
    },
  ];

  const storageCards = [
    {
      key: 'usage',
      label: t('statisticsPage.storage.metrics.usage'),
      value: formatBytes(systemMetrics.storage.usage, decimalFormatter, '—'),
      caption: t('statisticsPage.storage.captions.usage'),
    },
    {
      key: 'free',
      label: t('statisticsPage.storage.metrics.free'),
      value: formatBytes(storageFree, decimalFormatter, '—'),
      caption: t('statisticsPage.storage.captions.free'),
    },
    {
      key: 'quota',
      label: t('statisticsPage.storage.metrics.quota'),
      value: formatBytes(systemMetrics.storage.quota, decimalFormatter, '—'),
      caption: t('statisticsPage.storage.captions.quota'),
    },
    {
      key: 'persisted',
      label: t('statisticsPage.storage.metrics.persisted'),
      value:
        systemMetrics.storage.persisted === null
          ? '—'
          : t(
              systemMetrics.storage.persisted
                ? 'statisticsPage.shared.boolean.yes'
                : 'statisticsPage.shared.boolean.no'
            ),
      caption: t('statisticsPage.storage.captions.persisted'),
    },
  ];

  const networkCards = [
    {
      key: 'effectiveType',
      label: t('statisticsPage.network.metrics.type'),
      value: systemMetrics.connection.effectiveType ?? '—',
      caption: t('statisticsPage.network.captions.type'),
    },
    {
      key: 'downlink',
      label: t('statisticsPage.network.metrics.downlink'),
      value:
        systemMetrics.connection.downlink !== null
          ? `${decimalFormatter.format(systemMetrics.connection.downlink)} Mbps`
          : '—',
      caption: t('statisticsPage.network.captions.downlink'),
    },
    {
      key: 'rtt',
      label: t('statisticsPage.network.metrics.rtt'),
      value:
        systemMetrics.connection.rtt !== null
          ? `${integerFormatter.format(systemMetrics.connection.rtt)} ms`
          : '—',
      caption: t('statisticsPage.network.captions.rtt'),
    },
    {
      key: 'saveData',
      label: t('statisticsPage.network.metrics.saveData'),
      value:
        systemMetrics.connection.saveData === null
          ? '—'
          : t(
              systemMetrics.connection.saveData
                ? 'statisticsPage.shared.boolean.enabled'
                : 'statisticsPage.shared.boolean.disabled'
            ),
      caption: t('statisticsPage.network.captions.saveData'),
    },
  ];

  const batteryCards = [
    {
      key: 'level',
      label: t('statisticsPage.battery.metrics.level'),
      value: formatPercentage(systemMetrics.battery.level, integerFormatter, '—'),
      caption: t('statisticsPage.battery.captions.level'),
    },
    {
      key: 'charging',
      label: t('statisticsPage.battery.metrics.charging'),
      value:
        systemMetrics.battery.charging === null
          ? '—'
          : t(
              systemMetrics.battery.charging
                ? 'statisticsPage.shared.boolean.yes'
                : 'statisticsPage.shared.boolean.no'
            ),
      caption: t('statisticsPage.battery.captions.charging'),
    },
    {
      key: 'chargingTime',
      label: t('statisticsPage.battery.metrics.chargingTime'),
      value: formatSeconds(systemMetrics.battery.chargingTime, integerFormatter, '—'),
      caption: t('statisticsPage.battery.captions.chargingTime'),
    },
    {
      key: 'dischargingTime',
      label: t('statisticsPage.battery.metrics.dischargingTime'),
      value: formatSeconds(systemMetrics.battery.dischargingTime, integerFormatter, '—'),
      caption: t('statisticsPage.battery.captions.dischargingTime'),
    },
  ];

  const sections = [
    {
      key: 'system',
      title: t('statisticsPage.system.title'),
      subtitle: t('statisticsPage.system.subtitle'),
      cards: systemCards,
    },
    {
      key: 'hardware',
      title: t('statisticsPage.hardware.title'),
      subtitle: t('statisticsPage.hardware.subtitle'),
      cards: hardwareCards,
    },
    {
      key: 'screen',
      title: t('statisticsPage.screen.title'),
      subtitle: t('statisticsPage.screen.subtitle'),
      cards: screenCards,
    },
    {
      key: 'memory',
      title: t('statisticsPage.memory.title'),
      subtitle:
        memoryTimestamp !== null
          ? t('statisticsPage.memory.updated', { time: timeFormatter.format(memoryTimestamp) })
          : t('statisticsPage.shared.waiting'),
      cards: memoryCards,
      refreshAction: refresh.memory,
    },
    {
      key: 'storage',
      title: t('statisticsPage.storage.title'),
      subtitle:
        storageTimestamp !== null
          ? t('statisticsPage.storage.updated', { time: timeFormatter.format(storageTimestamp) })
          : t(
              systemMetrics.storage.supported
                ? 'statisticsPage.shared.waiting'
                : 'statisticsPage.storage.unsupported'
            ),
      cards: storageCards,
      refreshAction: refresh.storage,
    },
    {
      key: 'network',
      title: t('statisticsPage.network.title'),
      subtitle:
        networkTimestamp !== null
          ? t('statisticsPage.network.updated', { time: timeFormatter.format(networkTimestamp) })
          : t(
              systemMetrics.connection.supported
                ? 'statisticsPage.shared.waiting'
                : 'statisticsPage.network.unsupported'
            ),
      cards: networkCards,
      refreshAction: refresh.network,
    },
    {
      key: 'battery',
      title: t('statisticsPage.battery.title'),
      subtitle:
        systemMetrics.battery.supported && batteryTimestamp !== null
          ? t('statisticsPage.battery.updated', { time: timeFormatter.format(batteryTimestamp) })
          : t(
              systemMetrics.battery.supported
                ? 'statisticsPage.shared.waiting'
                : 'statisticsPage.battery.unsupported'
            ),
      cards: batteryCards,
      refreshAction: refresh.battery,
    },
  ];

  return (
    <div className="statistics-page">
      <section className="statistics-header hero">
        <h1>{t('statisticsPage.title')}</h1>
        <p>{t('statisticsPage.description')}</p>
        <p className="statistics-hint">{t('statisticsPage.updatedAutomatically')}</p>
      </section>

      <section className="statistics-section">
        <div className="statistics-section-header">
          <h2>{t('statisticsPage.performance.title')}</h2>
          <button
            type="button"
            className={`statistics-action-button${
              particleMetrics.isAnimating ? '' : ' statistics-action-button--paused'
            }`}
            onClick={handleAnimationToggle}
            aria-pressed={!particleMetrics.isAnimating}
          >
            {particleMetrics.isAnimating
              ? t('statisticsPage.performance.toggle.pause')
              : t('statisticsPage.performance.toggle.play')}
          </button>
        </div>
        <p className="statistics-subtitle">
          {performanceTimestamp
            ? t('statisticsPage.performance.lastUpdated', {
                time: timeFormatter.format(performanceTimestamp),
              })
            : t('statisticsPage.performance.waiting')}
        </p>
        <div className="metrics-grid">
          {performanceCards.map(card => (
            <article key={card.key} className="metric-card">
              <span className="metric-label">{card.label}</span>
              <span className="metric-value">{card.value}</span>
              <span className="metric-caption">{card.caption}</span>
            </article>
          ))}
        </div>
      </section>

      {sections.map(section => {
        const isRefreshing = Boolean(refreshing[section.key]);
        return (
          <section key={section.key} className="statistics-section">
            <div className="statistics-section-header">
              <h2>{section.title}</h2>
              {section.refreshAction && (
                <button
                  type="button"
                  className="statistics-action-button"
                  onClick={() => handleRefresh(section.key, section.refreshAction)}
                  disabled={isRefreshing}
                >
                  {isRefreshing
                    ? t('statisticsPage.shared.refreshing')
                    : t('statisticsPage.shared.refresh')}
                </button>
              )}
            </div>
            <p className="statistics-subtitle">{section.subtitle}</p>
            <div className="metrics-grid compact">
              {section.cards.map(card => (
                <article key={card.key} className="metric-card">
                  <span className="metric-label">{card.label}</span>
                  <span className="metric-value">{card.value}</span>
                  <span className="metric-caption">{card.caption}</span>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
