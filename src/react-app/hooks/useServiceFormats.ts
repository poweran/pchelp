import { useCallback, useMemo, useState } from 'react';
import type { ServiceFormatSetting } from '../types';
import { fetchServiceFormats } from '../utils/api';

interface UseServiceFormatsState {
  formats: ServiceFormatSetting[];
  loading: boolean;
  error: string | null;
}

export function useServiceFormats() {
  const [state, setState] = useState<UseServiceFormatsState>({
    formats: [],
    loading: false,
    error: null,
  });

  const loadFormats = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetchServiceFormats();
      if (response.error) {
        setState({ formats: [], loading: false, error: response.error });
      } else {
        setState({ formats: Array.isArray(response.data) ? response.data : [], loading: false, error: null });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load service formats';
      setState({ formats: [], loading: false, error: message });
    }
  }, []);

  return useMemo(() => ({
    ...state,
    loadFormats,
  }), [state, loadFormats]);
}
