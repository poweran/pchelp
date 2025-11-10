import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface NavigatorBrandInfo {
  brand: string;
  version: string;
}

interface NavigatorUADataLike {
  brands: NavigatorBrandInfo[];
  platform?: string;
}

type ConnectionChangeListener = () => void;

interface NetworkInformationLike {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  addEventListener?: (type: 'change', listener: ConnectionChangeListener) => void;
  removeEventListener?: (type: 'change', listener: ConnectionChangeListener) => void;
}

type BatteryEventName = 'chargingchange' | 'levelchange' | 'chargingtimechange' | 'dischargingtimechange';

interface BatteryManagerLike {
  charging?: boolean;
  level?: number;
  chargingTime?: number;
  dischargingTime?: number;
  addEventListener?: (type: BatteryEventName, listener: EventListener) => void;
  removeEventListener?: (type: BatteryEventName, listener: EventListener) => void;
}

interface PerformanceMemoryLike {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
}

interface SystemInfo {
  platform: string | null;
  userAgent: string | null;
  language: string | null;
  languages: readonly string[] | null;
  timezone: string | null;
}

interface HardwareInfo {
  hardwareConcurrency: number | null;
  deviceMemoryGB: number | null;
  gpuVendor: string | null;
  gpuRenderer: string | null;
}

interface ScreenInfo {
  width: number | null;
  height: number | null;
  availWidth: number | null;
  availHeight: number | null;
  pixelRatio: number | null;
  colorDepth: number | null;
}

interface MemoryInfo {
  supported: boolean;
  jsHeapSizeLimit: number | null;
  totalJSHeapSize: number | null;
  usedJSHeapSize: number | null;
  timestamp: number | null;
}

interface StorageInfo {
  supported: boolean;
  quota: number | null;
  usage: number | null;
  persisted: boolean | null;
  timestamp: number | null;
}

interface StorageEstimateLike {
  quota?: number;
  usage?: number;
  usageDetails?: Record<string, number>;
}

function extractStorageUsage(estimate: StorageEstimateLike | null | undefined): number | null {
  if (!estimate) {
    return null;
  }

  if (typeof estimate.usage === 'number') {
    return estimate.usage;
  }

  if (estimate.usageDetails && typeof estimate.usageDetails === 'object') {
    let total = 0;
    let hasValue = false;
    for (const value of Object.values(estimate.usageDetails)) {
      if (typeof value === 'number' && Number.isFinite(value)) {
        total += value;
        hasValue = true;
      }
    }
    return hasValue ? total : null;
  }

  return null;
}

interface ConnectionInfo {
  supported: boolean;
  effectiveType: string | null;
  downlink: number | null;
  rtt: number | null;
  saveData: boolean | null;
  timestamp: number | null;
}

interface BatteryInfo {
  supported: boolean;
  charging: boolean | null;
  level: number | null;
  chargingTime: number | null;
  dischargingTime: number | null;
  timestamp: number | null;
}

type RefreshHandlers = {
  system: () => void;
  memory: () => void;
  storage: () => Promise<void>;
  network: () => void;
  battery: () => Promise<void>;
};

type NavigatorWithExtras = Navigator & {
  userAgentData?: NavigatorUADataLike;
  deviceMemory?: number;
  storage?: StorageManager & {
    persisted?: () => Promise<boolean>;
  };
  connection?: NetworkInformationLike;
  getBattery?: () => Promise<BatteryManagerLike>;
};

interface PerformanceWithMemory extends Performance {
  memory?: PerformanceMemoryLike;
}

function getNavigatorWithExtras(): NavigatorWithExtras | null {
  return typeof navigator !== 'undefined' ? (navigator as NavigatorWithExtras) : null;
}

function getPerformanceWithMemory(): PerformanceWithMemory | null {
  return typeof performance !== 'undefined' ? (performance as PerformanceWithMemory) : null;
}

const initialNavigator = getNavigatorWithExtras();
const initialPerformance = getPerformanceWithMemory();

const BATTERY_EVENTS: Array<'chargingchange' | 'levelchange' | 'chargingtimechange' | 'dischargingtimechange'> = [
  'chargingchange',
  'levelchange',
  'chargingtimechange',
  'dischargingtimechange',
];

export interface SystemMetrics {
  system: SystemInfo;
  hardware: HardwareInfo;
  screen: ScreenInfo;
  memory: MemoryInfo;
  storage: StorageInfo;
  connection: ConnectionInfo;
  battery: BatteryInfo;
}

const DEFAULT_METRICS: SystemMetrics = {
  system: {
    platform: null,
    userAgent: null,
    language: null,
    languages: null,
    timezone: null,
  },
  hardware: {
    hardwareConcurrency: null,
    deviceMemoryGB: null,
    gpuVendor: null,
    gpuRenderer: null,
  },
  screen: {
    width: null,
    height: null,
    availWidth: null,
    availHeight: null,
    pixelRatio: null,
    colorDepth: null,
  },
  memory: {
    supported: Boolean(initialPerformance?.memory),
    jsHeapSizeLimit: null,
    totalJSHeapSize: null,
    usedJSHeapSize: null,
    timestamp: null,
  },
  storage: {
    supported: Boolean(initialNavigator?.storage),
    quota: null,
    usage: null,
    persisted: null,
    timestamp: null,
  },
  connection: {
    supported: Boolean(initialNavigator?.connection),
    effectiveType: null,
    downlink: null,
    rtt: null,
    saveData: null,
    timestamp: null,
  },
  battery: {
    supported: typeof initialNavigator?.getBattery === 'function',
    charging: null,
    level: null,
    chargingTime: null,
    dischargingTime: null,
    timestamp: null,
  },
};

function collectGpuInfo(): Pick<HardwareInfo, 'gpuVendor' | 'gpuRenderer'> {
  if (typeof document === 'undefined') {
    return { gpuVendor: null, gpuRenderer: null };
  }

  try {
    const canvas = document.createElement('canvas');
    const gl =
      (canvas.getContext('webgl') as WebGLRenderingContext | null) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

    if (!gl) {
      return { gpuVendor: null, gpuRenderer: null };
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info') as {
      UNMASKED_VENDOR_WEBGL: number;
      UNMASKED_RENDERER_WEBGL: number;
    } | null;
    if (!debugInfo) {
      return { gpuVendor: null, gpuRenderer: null };
    }

    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

    return {
      gpuVendor: typeof vendor === 'string' ? vendor : null,
      gpuRenderer: typeof renderer === 'string' ? renderer : null,
    };
  } catch {
    return { gpuVendor: null, gpuRenderer: null };
  }
}

function collectSystemSnapshot(): Omit<SystemMetrics, 'memory' | 'storage' | 'connection' | 'battery'> {
  const nav = getNavigatorWithExtras();
  if (typeof window === 'undefined' || !nav) {
    return {
      system: DEFAULT_METRICS.system,
      hardware: DEFAULT_METRICS.hardware,
      screen: DEFAULT_METRICS.screen,
    };
  }

  const timezone = (() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone ?? null;
    } catch {
      return null;
    }
  })();

  const languages = Array.isArray(nav.languages) ? nav.languages : null;

  const { gpuVendor, gpuRenderer } = collectGpuInfo();

  const brands = nav.userAgentData?.brands as NavigatorBrandInfo[] | undefined;
  const userAgent =
    brands && brands.length > 0
      ? brands.map(entry => `${entry.brand} ${entry.version}`).join(', ')
      : nav.userAgent ?? null;

  return {
    system: {
      platform: nav.userAgentData?.platform ?? nav.platform ?? null,
      userAgent,
      language: nav.language ?? null,
      languages,
      timezone,
    },
    hardware: {
      hardwareConcurrency: typeof nav.hardwareConcurrency === 'number' ? nav.hardwareConcurrency : null,
      deviceMemoryGB: typeof nav.deviceMemory === 'number' ? nav.deviceMemory : null,
      gpuVendor,
      gpuRenderer,
    },
    screen: {
      width: window.screen?.width ?? null,
      height: window.screen?.height ?? null,
      availWidth: window.screen?.availWidth ?? null,
      availHeight: window.screen?.availHeight ?? null,
      pixelRatio: window.devicePixelRatio ?? null,
      colorDepth: window.screen?.colorDepth ?? null,
    },
  };
}

function collectConnectionInfo(): ConnectionInfo {
  const nav = getNavigatorWithExtras();
  if (!nav || !nav.connection) {
    return DEFAULT_METRICS.connection;
  }

  const connection = nav.connection;

  return {
    supported: true,
    effectiveType: connection.effectiveType ?? null,
    downlink: typeof connection.downlink === 'number' ? connection.downlink : null,
    rtt: typeof connection.rtt === 'number' ? connection.rtt : null,
    saveData: typeof connection.saveData === 'boolean' ? connection.saveData : null,
    timestamp: Date.now(),
  };
}

function collectMemoryInfo(): MemoryInfo {
  const perf = getPerformanceWithMemory();
  const memory = perf?.memory;
  if (!memory) {
    return DEFAULT_METRICS.memory;
  }

  const { jsHeapSizeLimit, totalJSHeapSize, usedJSHeapSize } = memory;
  return {
    supported: true,
    jsHeapSizeLimit: typeof jsHeapSizeLimit === 'number' ? jsHeapSizeLimit : null,
    totalJSHeapSize: typeof totalJSHeapSize === 'number' ? totalJSHeapSize : null,
    usedJSHeapSize: typeof usedJSHeapSize === 'number' ? usedJSHeapSize : null,
    timestamp: Date.now(),
  };
}

export function useSystemMetrics(): { metrics: SystemMetrics; refresh: RefreshHandlers } {
  const [metrics, setMetrics] = useState<SystemMetrics>(() => {
    const snapshot = collectSystemSnapshot();
    return {
      system: snapshot.system,
      hardware: snapshot.hardware,
      screen: snapshot.screen,
      memory: collectMemoryInfo(),
      storage: DEFAULT_METRICS.storage,
      connection: collectConnectionInfo(),
      battery: DEFAULT_METRICS.battery,
    };
  });

  const batteryManagerRef = useRef<BatteryManagerLike | null>(null);
  const batteryHandlerRef = useRef<EventListener | null>(null);

  const refreshSystem = useCallback(() => {
    const snapshot = collectSystemSnapshot();
    setMetrics(prev => ({
      ...prev,
      system: snapshot.system,
      hardware: snapshot.hardware,
      screen: snapshot.screen,
    }));
  }, []);

  const refreshMemory = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      memory: collectMemoryInfo(),
    }));
  }, []);

  const refreshNetwork = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      connection: collectConnectionInfo(),
    }));
  }, []);

  const refreshStorage = useCallback(async () => {
    const nav = getNavigatorWithExtras();
    const storageManager = nav?.storage;

    if (!storageManager || typeof storageManager.estimate !== 'function') {
      setMetrics(prev => ({
        ...prev,
        storage: {
          supported: Boolean(storageManager && typeof storageManager.estimate === 'function'),
          quota: null,
          usage: null,
          persisted: null,
          timestamp: Date.now(),
        },
      }));
      return;
    }

    try {
      const persistedPromise =
        typeof storageManager.persisted === 'function'
          ? storageManager.persisted()
          : Promise.resolve(null);

      const [estimate, persisted] = await Promise.all([
        storageManager.estimate(),
        persistedPromise,
      ]);

      setMetrics(prev => ({
        ...prev,
        storage: {
          supported: true,
          quota: typeof estimate.quota === 'number' ? estimate.quota : null,
          usage: extractStorageUsage(estimate),
          persisted: typeof persisted === 'boolean' ? persisted : null,
          timestamp: Date.now(),
        },
      }));
    } catch {
      setMetrics(prev => ({
        ...prev,
        storage: {
          ...prev.storage,
          timestamp: Date.now(),
        },
      }));
    }
  }, []);

  const updateBatteryFromManager = useCallback((manager: BatteryManagerLike | null) => {
    if (!manager) {
      setMetrics(prev => ({
        ...prev,
        battery: {
          supported: false,
          charging: null,
          level: null,
          chargingTime: null,
          dischargingTime: null,
          timestamp: Date.now(),
        },
      }));
      return;
    }

    setMetrics(prev => ({
      ...prev,
      battery: {
        supported: true,
        charging: typeof manager.charging === 'boolean' ? manager.charging : null,
        level: typeof manager.level === 'number' ? manager.level : null,
        chargingTime: typeof manager.chargingTime === 'number' ? manager.chargingTime : null,
        dischargingTime: typeof manager.dischargingTime === 'number' ? manager.dischargingTime : null,
        timestamp: Date.now(),
      },
    }));
  }, []);

  const refreshBattery = useCallback(async () => {
    const nav = getNavigatorWithExtras();
    if (!nav) {
      updateBatteryFromManager(null);
      return;
    }

    if (batteryManagerRef.current) {
      updateBatteryFromManager(batteryManagerRef.current);
      return;
    }

    if (typeof nav.getBattery !== 'function') {
      updateBatteryFromManager(null);
      return;
    }

    try {
      const manager = await nav.getBattery();
      batteryManagerRef.current = manager;
      updateBatteryFromManager(manager);
    } catch {
      updateBatteryFromManager(null);
    }
  }, [updateBatteryFromManager]);

  useEffect(() => {
    const nav = getNavigatorWithExtras();
    if (typeof window === 'undefined' || !nav) {
      return;
    }

    refreshSystem();

    const memoryInterval = window.setInterval(refreshMemory, 5000);
    refreshMemory();

    const connection = nav.connection ?? null;
    const handleConnectionChange = () => {
      refreshNetwork();
    };

    if (connection) {
      refreshNetwork();
      if (typeof connection.addEventListener === 'function') {
        connection.addEventListener('change', handleConnectionChange);
      }
    }

    refreshStorage();

    if (typeof nav.getBattery === 'function') {
      nav
        .getBattery()
        .then(manager => {
          batteryManagerRef.current = manager;
          updateBatteryFromManager(manager);
          if (typeof manager.addEventListener === 'function') {
            const handler: EventListener = () => updateBatteryFromManager(manager);
            batteryHandlerRef.current = handler;
            const addListener = manager.addEventListener.bind(manager) as (
              type: BatteryEventName,
              listener: EventListener
            ) => void;
            BATTERY_EVENTS.forEach(event => addListener(event, handler));
          } else {
            batteryHandlerRef.current = null;
          }
        })
        .catch(() => {
          updateBatteryFromManager(null);
        });
    } else {
      updateBatteryFromManager(null);
    }

    return () => {
      window.clearInterval(memoryInterval);
      if (connection && typeof connection.removeEventListener === 'function') {
        connection.removeEventListener('change', handleConnectionChange);
      }
      const batteryManager = batteryManagerRef.current;
      const batteryHandler = batteryHandlerRef.current;
      if (batteryManager && batteryHandler && typeof batteryManager.removeEventListener === 'function') {
        const removeListener = batteryManager.removeEventListener.bind(batteryManager) as (
          type: BatteryEventName,
          listener: EventListener
        ) => void;
        BATTERY_EVENTS.forEach(event => removeListener(event, batteryHandler));
      }
    };
  }, [refreshSystem, refreshMemory, refreshNetwork, refreshStorage, updateBatteryFromManager]);

  const refreshHandlers = useMemo<RefreshHandlers>(
    () => ({
      system: refreshSystem,
      memory: refreshMemory,
      storage: refreshStorage,
      network: refreshNetwork,
      battery: refreshBattery,
    }),
    [refreshSystem, refreshMemory, refreshStorage, refreshNetwork, refreshBattery]
  );

  return useMemo(
    () => ({
      metrics,
      refresh: refreshHandlers,
    }),
    [metrics, refreshHandlers]
  );
}
