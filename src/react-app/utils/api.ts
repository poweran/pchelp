// Утилиты для работы с API

import type { ApiResponse, Service, Ticket, TicketFormData, KnowledgeItem, PriceItem } from '../types';

// Базовый URL для API
const API_BASE_URL = '/api';

// Базовая функция для выполнения API запросов
export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;

      // Пытаемся получить дополнительную информацию об ошибке из тела ответа
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        // Игнорируем ошибки парсинга тела ответа
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    // console.log('[apiRequest] Received data:', data);
    // Если данные содержат поле 'data', возвращаем его напрямую
    if (data && typeof data === 'object' && 'data' in data) {
      return data;
    }
    // Иначе оборачиваем в стандартный формат
    return { data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('API Request Error:', message);

    // Дополнительное логирование для отладки
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error details:', error);
    }

    return { error: message };
  }
}

// GET запрос
export async function get<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'GET' });
}

// POST запрос
export async function post<T>(
  endpoint: string,
  data: unknown
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// PUT запрос
export async function put<T>(
  endpoint: string,
  data: unknown
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// DELETE запрос
export async function del<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
}

// API функции для работы с услугами
export async function fetchServices() {
  return get<Service[]>('/services');
}

export async function fetchServiceById(id: string) {
  return get<Service>(`/services/${id}`);
}

// API функции для работы с заявками
export async function createTicket(ticketData: TicketFormData) {
  return post<Ticket>('/tickets', ticketData);
}

export async function fetchTickets() {
  return get<Ticket[]>('/tickets');
}

export async function fetchTicketById(id: string) {
  return get<Ticket>(`/tickets/${id}`);
}

// API функции для работы с базой знаний
export async function fetchKnowledge() {
  return get<KnowledgeItem[]>('/knowledge');
}

export async function fetchKnowledgeById(id: string) {
  return get<KnowledgeItem>(`/knowledge/${id}`);
}

// API функции для работы с прайс-листом
export async function fetchPricing() {
  return get<PriceItem[]>('/pricing');
}