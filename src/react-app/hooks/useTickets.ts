import { useCallback, useState } from 'react';
import type { Ticket, TicketFormData } from '../types';
import {
  createTicket,
  fetchTicketById,
  fetchUserTickets,
} from '../utils/api';
import { computeClientKey } from '../utils/clientKey';

const USER_IDENTIFIER_KEY = 'userIdentifier';

interface StoredUserIdentifier {
  clientName: string;
  email: string;
  phone: string;
  clientKey?: string;
}

const readStoredIdentifier = (): StoredUserIdentifier | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(USER_IDENTIFIER_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as StoredUserIdentifier;
  } catch (error) {
    console.error('Failed to parse stored user identifier:', error);
    return null;
  }
};

const persistIdentifier = (identifier: StoredUserIdentifier) => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(USER_IDENTIFIER_KEY, JSON.stringify(identifier));
};

const buildIdentifierFromForm = (data: TicketFormData): StoredUserIdentifier => ({
  clientName: data.clientName.trim(),
  email: data.email.trim(),
  phone: data.phone.trim(),
});

const ensureIdentifierHasKey = async (identifier: StoredUserIdentifier): Promise<StoredUserIdentifier> => {
  if (identifier.clientKey) {
    return identifier;
  }
  const clientKey = await computeClientKey(identifier);
  return { ...identifier, clientKey };
};

interface UseTicketsState {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface UseTicketState {
  ticket: Ticket | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook для работы с заявками
 */
export function useTickets() {
  const [state, setState] = useState<UseTicketsState>({
    tickets: [],
    loading: false,
    error: null,
    success: false,
  });
  const [clientKey, setClientKey] = useState<string | null>(() => readStoredIdentifier()?.clientKey ?? null);

  const resolveStoredClientKey = useCallback(async (): Promise<string | null> => {
    const stored = readStoredIdentifier();
    if (!stored) {
      return null;
    }
    const withKey = await ensureIdentifierHasKey(stored);
    if (withKey.clientKey) {
      persistIdentifier(withKey);
      setClientKey(withKey.clientKey);
      return withKey.clientKey;
    }
    return null;
  }, []);

  const persistIdentityFromForm = useCallback(async (ticketData: TicketFormData, providedKey?: string | null) => {
    const baseIdentity = buildIdentifierFromForm(ticketData);
    let nextKey = providedKey ?? null;
    if (!nextKey) {
      nextKey = await computeClientKey(baseIdentity);
    }
    if (nextKey) {
      const identifierWithKey: StoredUserIdentifier = { ...baseIdentity, clientKey: nextKey };
      persistIdentifier(identifierWithKey);
      setClientKey(nextKey);
    }
    return nextKey;
  }, []);

  /**
   * Создание новой заявки
   */
  const submitTicket = useCallback(async (ticketData: TicketFormData) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: false }));

    try {
      const response = await createTicket(ticketData);

      if (response.error) {
        setState(prev => ({ ...prev, loading: false, error: response.error!, success: false }));
        return { success: false, error: response.error };
      }

      const persistedKey = await persistIdentityFromForm(ticketData, response.data?.clientKey ?? null);

      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
        success: true,
      }));

      const responseData = response.data ? { ...response.data, clientKey: response.data.clientKey ?? persistedKey ?? null } : undefined;

      return { success: true, data: responseData };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create ticket';
      setState(prev => ({ ...prev, loading: false, error: message, success: false }));
      return { success: false, error: message };
    }
  }, [persistIdentityFromForm]);

  /**
   * Загрузка списка заявок
   */
  const loadTickets = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const key = clientKey ?? await resolveStoredClientKey();

      if (!key) {
        setState(prev => ({
          ...prev,
          tickets: [],
          loading: false,
          error: null,
        }));
        return;
      }

      const response = await fetchUserTickets(key);

      if (response.error) {
        setState(prev => ({ ...prev, tickets: [], loading: false, error: response.error! }));
      } else {
        setState(prev => ({
          ...prev,
          tickets: Array.isArray(response.data) ? response.data : [],
          loading: false,
          error: null,
        }));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load tickets';
      setState(prev => ({ ...prev, tickets: [], loading: false, error: message }));
    }
  }, [clientKey, resolveStoredClientKey]);

  /**
   * Сброс состояния success
   */
  const resetSuccess = () => {
    setState(prev => ({ ...prev, success: false }));
  };

  /**
   * Сброс ошибки
   */
  const resetError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    ...state,
    clientKey,
    submitTicket,
    loadTickets,
    resetSuccess,
    resetError,
  };
}

/**
 * Custom hook для работы с конкретной заявкой
 */
export function useTicket(_id: string | null) {
  const [state, setState] = useState<UseTicketState>({
    ticket: null,
    loading: false,
    error: null,
  });

  const loadTicket = async (ticketId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const stored = readStoredIdentifier();
      let key = stored?.clientKey ?? null;
      if (stored && !key) {
        const withKey = await ensureIdentifierHasKey(stored);
        key = withKey.clientKey ?? null;
        persistIdentifier(withKey);
      }

      const response = await fetchTicketById(ticketId, key ?? undefined);

      if (response.error) {
        setState({ ticket: null, loading: false, error: response.error });
      } else {
        setState({ ticket: response.data || null, loading: false, error: null });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load ticket';
      setState({ ticket: null, loading: false, error: message });
    }
  };

  return {
    ...state,
    loadTicket,
  };
}
