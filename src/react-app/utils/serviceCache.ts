import type { Service } from '../types';

const SERVICE_CACHE_KEY = 'services-cache-v1';

interface ServiceCacheEntry {
  data: Service[];
  updatedAt: number;
}

type ServiceCacheListener = (services: Service[]) => void;

const listeners = new Set<ServiceCacheListener>();

const hasStorage = (): boolean => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const parseEntry = (raw: string | null): ServiceCacheEntry | null => {
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as ServiceCacheEntry;
    if (!parsed || !Array.isArray(parsed.data)) {
      return null;
    }
    return parsed;
  } catch (error) {
    console.warn('[serviceCache] Failed to parse cache entry', error);
    return null;
  }
};

const readEntry = (): ServiceCacheEntry | null => {
  if (!hasStorage()) {
    return null;
  }
  try {
    return parseEntry(window.localStorage.getItem(SERVICE_CACHE_KEY));
  } catch {
    return null;
  }
};

const notifyListeners = (services: Service[]) => {
  listeners.forEach(listener => {
    try {
      listener(services);
    } catch (error) {
      console.error('[serviceCache] Listener error', error);
    }
  });
};

const writeEntry = (entry: ServiceCacheEntry | null) => {
  if (!hasStorage()) {
    notifyListeners(entry?.data ?? []);
    return;
  }
  try {
    if (entry) {
      window.localStorage.setItem(SERVICE_CACHE_KEY, JSON.stringify(entry));
    } else {
      window.localStorage.removeItem(SERVICE_CACHE_KEY);
    }
  } catch (error) {
    console.warn('[serviceCache] Failed to write cache entry', error);
  } finally {
    notifyListeners(entry?.data ?? []);
  }
};

export const getCachedServices = (): Service[] | null => {
  const entry = readEntry();
  return entry?.data ?? null;
};

export const getCachedService = (id: string): Service | undefined => {
  const services = getCachedServices();
  return services?.find(service => service.id === id);
};

export const saveServicesToCache = (services: Service[]): void => {
  writeEntry({ data: services, updatedAt: Date.now() });
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
  writeEntry(null);
};

export const subscribeToServiceCache = (listener: ServiceCacheListener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

if (typeof window !== 'undefined') {
  window.addEventListener('storage', event => {
    if (event.key === SERVICE_CACHE_KEY) {
      notifyListeners(parseEntry(event.newValue)?.data ?? []);
    }
  });
}
