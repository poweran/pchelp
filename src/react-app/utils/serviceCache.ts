import type { Service, ServiceFormatSetting } from '../types';

const SERVICE_CACHE_KEY = 'services-cache-v1';
const SERVICE_FORMATS_CACHE_KEY = 'service-formats-cache-v1';

interface ServiceCacheEntry<T> {
  data: T[];
  updatedAt: number;
}

type ServiceCacheListener = (services: Service[]) => void;
type ServiceFormatsCacheListener = (formats: ServiceFormatSetting[]) => void;

const serviceListeners = new Set<ServiceCacheListener>();
const formatListeners = new Set<ServiceFormatsCacheListener>();

const hasStorage = (): boolean => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const parseEntry = <T>(raw: string | null): ServiceCacheEntry<T> | null => {
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as ServiceCacheEntry<T>;
    if (!parsed || !Array.isArray(parsed.data)) {
      return null;
    }
    return parsed;
  } catch (error) {
    console.warn('[serviceCache] Failed to parse cache entry', error);
    return null;
  }
};

const readEntry = <T>(key: string): ServiceCacheEntry<T> | null => {
  if (!hasStorage()) {
    return null;
  }
  try {
    return parseEntry<T>(window.localStorage.getItem(key));
  } catch {
    return null;
  }
};

const notifyListeners = <T>(listenersSet: Set<(value: T[]) => void>, value: T[]) => {
  listenersSet.forEach(listener => {
    try {
      listener(value);
    } catch (error) {
      console.error('[serviceCache] Listener error', error);
    }
  });
};

const writeEntry = <T>(key: string, entry: ServiceCacheEntry<T> | null, listenersSet: Set<(value: T[]) => void>) => {
  if (!hasStorage()) {
    notifyListeners(listenersSet, entry?.data ?? []);
    return;
  }
  try {
    if (entry) {
      window.localStorage.setItem(key, JSON.stringify(entry));
    } else {
      window.localStorage.removeItem(key);
    }
  } catch (error) {
    console.warn('[serviceCache] Failed to write cache entry', error);
  } finally {
    notifyListeners(listenersSet, entry?.data ?? []);
  }
};

export const getCachedServices = (): Service[] | null => {
  const entry = readEntry<Service>(SERVICE_CACHE_KEY);
  return entry?.data ?? null;
};

export const getCachedService = (id: string): Service | undefined => {
  const services = getCachedServices();
  return services?.find(service => service.id === id);
};

export const saveServicesToCache = (services: Service[]): void => {
  writeEntry<Service>(SERVICE_CACHE_KEY, { data: services, updatedAt: Date.now() }, serviceListeners);
};

export const upsertServiceInCache = (service: Service): void => {
  const current = getCachedServices() ?? [];
  const next = current.some(item => item.id === service.id)
    ? current.map(item => (item.id === service.id ? service : item))
    : [...current, service];
  saveServicesToCache(next);
};

export const removeServiceFromCache = (id: string): void => {
  const current = getCachedServices();
  if (!current) {
    return;
  }
  const next = current.filter(service => service.id !== id);
  saveServicesToCache(next);
};

export const clearServicesCache = (): void => {
  writeEntry<Service>(SERVICE_CACHE_KEY, null, serviceListeners);
};

export const subscribeToServiceCache = (listener: ServiceCacheListener): (() => void) => {
  serviceListeners.add(listener);
  return () => {
    serviceListeners.delete(listener);
  };
};

export const getCachedServiceFormats = (): ServiceFormatSetting[] | null => {
  const entry = readEntry<ServiceFormatSetting>(SERVICE_FORMATS_CACHE_KEY);
  return entry?.data ?? null;
};

export const saveServiceFormatsToCache = (formats: ServiceFormatSetting[]): void => {
  writeEntry<ServiceFormatSetting>(
    SERVICE_FORMATS_CACHE_KEY,
    { data: formats, updatedAt: Date.now() },
    formatListeners,
  );
};

export const clearServiceFormatsCache = (): void => {
  writeEntry<ServiceFormatSetting>(SERVICE_FORMATS_CACHE_KEY, null, formatListeners);
};

export const subscribeToServiceFormatsCache = (listener: ServiceFormatsCacheListener): (() => void) => {
  formatListeners.add(listener);
  return () => {
    formatListeners.delete(listener);
  };
};

if (typeof window !== 'undefined') {
  window.addEventListener('storage', event => {
    if (event.key === SERVICE_CACHE_KEY) {
      notifyListeners<Service>(serviceListeners, parseEntry<Service>(event.newValue)?.data ?? []);
    }
    if (event.key === SERVICE_FORMATS_CACHE_KEY) {
      notifyListeners<ServiceFormatSetting>(
        formatListeners,
        parseEntry<ServiceFormatSetting>(event.newValue)?.data ?? [],
      );
    }
  });
}
