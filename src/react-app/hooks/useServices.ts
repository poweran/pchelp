import { useState, useEffect } from 'react';
import type { Service } from '../types';
import { get } from '../utils/api';

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

/**
 * Custom hook для работы со списком услуг
 */
export function useServices() {
  const [state, setState] = useState<UseServicesState>({
    services: [],
    loading: false,
    error: null,
  });

  const loadServices = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await get<Service[]>('/services');
      
      // console.log('[useServices] Response received:', response);
      if (response.error) {
        setState({ services: [], loading: false, error: response.error });
      } else {
        setState({ services: Array.isArray(response.data) ? response.data : [], loading: false, error: null });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load services';
      setState({ services: [], loading: false, error: message });
    }
  };

  return {
    ...state,
    loadServices,
  };
}

/**
 * Custom hook для работы с конкретной услугой
 */
export function useService(id: string | null) {
  const [state, setState] = useState<UseServiceState>({
    service: null,
    loading: false,
    error: null,
  });

  const loadService = async (serviceId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await get<Service>(`/services/${serviceId}`);
      
      if (response.error) {
        setState({ service: null, loading: false, error: response.error });
      } else {
        setState({ service: response.data || null, loading: false, error: null });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load service';
      setState({ service: null, loading: false, error: message });
    }
  };

  useEffect(() => {
    if (id) {
      loadService(id);
    }
  }, [id]);

  return {
    ...state,
    loadService,
  };
}