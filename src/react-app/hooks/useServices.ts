import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Service } from '../types';
import { fetchServiceById, fetchServices } from '../utils/api';
import {
  getCachedService,
  getCachedServices,
  saveServicesToCache,
  subscribeToServiceCache,
  upsertServiceInCache,
} from '../utils/serviceCache';

interface UseServicesState {
  services: Service[];
  loading: boolean;
  error: string | null;
}

interface UseServiceState {
  service: Service | null;
  loading: boolean;
  error: string | null;
}

let servicesRequest: Promise<Service[] | null> | null = null;

/**
 * Custom hook для работы со списком услуг
 */
export function useServices() {
  const [state, setState] = useState<UseServicesState>(() => {
    const cached = getCachedServices();
    return {
      services: cached ?? [],
      loading: !cached,
      error: null,
    };
  });

  useEffect(() => {
    const unsubscribe = subscribeToServiceCache(services => {
      setState(prev => ({
        ...prev,
        services,
        loading: false,
      }));
    });
    return unsubscribe;
  }, []);

  const loadServices = useCallback(async (force = false) => {
    const cached = getCachedServices();

    if (!force && cached && cached.length) {
      setState(prev => ({ ...prev, services: cached, loading: false, error: null }));
      return cached;
    }

    if (!force && servicesRequest) {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const services = await servicesRequest;
        if (services) {
          setState({ services, loading: false, error: null });
        }
        return services;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load services';
        setState(prev => ({ ...prev, loading: false, error: message }));
        return null;
      }
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    const request = (async () => {
      try {
        const response = await fetchServices();
        if (response.error) {
          throw new Error(response.error);
        }
        const services = Array.isArray(response.data) ? response.data : [];
        saveServicesToCache(services);
        setState({ services, loading: false, error: null });
        return services;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load services';
        setState({ services: [], loading: false, error: message });
        return null;
      }
    })();

    servicesRequest = request;
    const result = await request;
    if (servicesRequest === request) {
      servicesRequest = null;
    }
    return result;
  }, []);

  return useMemo(() => ({
    ...state,
    loadServices,
  }), [state, loadServices]);
}

/**
 * Custom hook для работы с конкретной услугой
 */
export function useService(id: string | null) {
  const [state, setState] = useState<UseServiceState>(() => {
    const cached = id ? getCachedService(id) ?? null : null;
    return {
      service: cached,
      loading: Boolean(id && !cached),
      error: null,
    };
  });

  useEffect(() => {
    if (!id) {
      setState({ service: null, loading: false, error: null });
      return;
    }
    const cached = getCachedService(id);
    if (cached) {
      setState({ service: cached, loading: false, error: null });
    } else {
      setState({ service: null, loading: true, error: null });
    }
  }, [id]);

  useEffect(() => {
    const unsubscribe = subscribeToServiceCache(services => {
      if (!id) {
        return;
      }
      const next = services.find(service => service.id === id) ?? null;
      setState(prev => ({
        ...prev,
        service: next,
        loading: false,
      }));
    });
    return unsubscribe;
  }, [id]);

  const loadService = useCallback(async (serviceId: string, force = false) => {
    if (!force) {
      const cached = getCachedService(serviceId);
      if (cached) {
        setState({ service: cached, loading: false, error: null });
        return cached;
      }
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetchServiceById(serviceId);
      if (response.error) {
        setState({ service: null, loading: false, error: response.error });
        return null;
      }
      const service = response.data ?? null;
      if (service) {
        upsertServiceInCache(service);
      }
      setState({ service, loading: false, error: null });
      return service;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load service';
      setState({ service: null, loading: false, error: message });
      return null;
    }
  }, []);

  useEffect(() => {
    if (id) {
      loadService(id);
    }
  }, [id, loadService]);

  return useMemo(() => ({
    ...state,
    loadService,
  }), [state, loadService]);
}
