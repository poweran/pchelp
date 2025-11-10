import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ServiceFormatSetting } from '../types';
import { fetchServiceFormats } from '../utils/api';
import {
  getCachedServiceFormats,
  saveServiceFormatsToCache,
  subscribeToServiceFormatsCache,
} from '../utils/serviceCache';

interface UseServiceFormatsState {
  formats: ServiceFormatSetting[];
  loading: boolean;
  error: string | null;
}

let serviceFormatsRequest: Promise<ServiceFormatSetting[] | null> | null = null;

export function useServiceFormats() {
  const [state, setState] = useState<UseServiceFormatsState>(() => {
    const cached = getCachedServiceFormats();
    return {
      formats: cached ?? [],
      loading: !cached,
      error: null,
    };
  });

  useEffect(() => {
    const unsubscribe = subscribeToServiceFormatsCache(formats => {
      setState(prev => ({
        ...prev,
        formats,
        loading: false,
      }));
    });
    return unsubscribe;
  }, []);

  const loadFormats = useCallback(async (force = false) => {
    const cached = getCachedServiceFormats();

    if (!force && cached && cached.length) {
      setState(prev => ({ ...prev, formats: cached, loading: false, error: null }));
      return cached;
    }

    if (!force && serviceFormatsRequest) {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const pending = await serviceFormatsRequest;
        if (pending) {
          setState({ formats: pending, loading: false, error: null });
        }
        return pending;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load service formats';
        setState(prev => ({ ...prev, loading: false, error: message }));
        return null;
      }
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    const request = (async () => {
      try {
        const response = await fetchServiceFormats();
        if (response.error) {
          throw new Error(response.error);
        }
        const formats = Array.isArray(response.data) ? response.data : [];
        saveServiceFormatsToCache(formats);
        setState({ formats, loading: false, error: null });
        return formats;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load service formats';
        setState({ formats: [], loading: false, error: message });
        return null;
      }
    })();

    serviceFormatsRequest = request;
    const result = await request;
    if (serviceFormatsRequest === request) {
      serviceFormatsRequest = null;
    }
    return result;
  }, []);

  return useMemo(() => ({
    ...state,
    loadFormats,
  }), [state, loadFormats]);
}
