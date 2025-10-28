import { useState } from 'react';
import type { Ticket, TicketFormData } from '../types';
import { createTicket, fetchTickets, fetchTicketById } from '../utils/api';

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

  /**
   * Создание новой заявки
   */
  const submitTicket = async (ticketData: TicketFormData) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: false }));

    try {
      const response = await createTicket(ticketData);

      if (response.error) {
        setState(prev => ({ ...prev, loading: false, error: response.error!, success: false }));
        return { success: false, error: response.error };
      } else {
        // После успешного создания обновляем список тикетов
        const ticketsResponse = await fetchTickets();

        setState(prev => ({
          ...prev,
          loading: false,
          error: null,
          success: true,
          tickets: ticketsResponse.data ? Array.isArray(ticketsResponse.data) ? ticketsResponse.data : [] : prev.tickets
        }));
        return { success: true, data: response.data };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create ticket';
      setState(prev => ({ ...prev, loading: false, error: message, success: false }));
      return { success: false, error: message };
    }
  };

  /**
   * Загрузка списка заявок
   */
  const loadTickets = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await fetchTickets();
      
      if (response.error) {
        setState(prev => ({ ...prev, tickets: [], loading: false, error: response.error! }));
      } else {
        setState(prev => ({
          ...prev,
          tickets: Array.isArray(response.data) ? response.data : [],
          loading: false,
          error: null
        }));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load tickets';
      setState(prev => ({ ...prev, tickets: [], loading: false, error: message }));
    }
  };

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
      const response = await fetchTicketById(ticketId);
      
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