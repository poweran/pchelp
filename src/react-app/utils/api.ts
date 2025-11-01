// Утилиты для работы с API

import type {
  ApiResponse,
  Service,
  Ticket,
  TicketFormData,
  KnowledgeItem,
  PriceItem,
  AdminService,
  AdminServicePayload,
  AdminPriceItem,
  AdminPricePayload,
  AdminKnowledgeItem,
  AdminKnowledgePayload,
} from '../types';

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

export async function updateTicket(id: string, data: Partial<Pick<Ticket, 'status' | 'priority'>>) {
  return put<Ticket>(`/tickets/${id}`, data);
}

export async function deleteTicket(id: string) {
  return del<null>(`/tickets/${id}`);
}

// API функции для работы с базой знаний
export async function fetchKnowledge(lang?: string) {
  const url = lang ? `/knowledge?lang=${lang}` : '/knowledge';
  return get<KnowledgeItem[]>(url);
}

export async function fetchKnowledgeById(id: string, lang?: string) {
  const url = lang ? `/knowledge/${id}?lang=${lang}` : `/knowledge/${id}`;
  return get<KnowledgeItem>(url);
}

// API функции для работы с прайс-листом
export async function fetchPricing(lang?: string) {
  const url = lang ? `/pricing?lang=${lang}` : '/pricing';
  return get<PriceItem[]>(url);
}

// Admin API - Services
export async function fetchAdminServices() {
  return get<AdminService[]>('/admin/services');
}

export async function createAdminService(data: AdminServicePayload & { id?: string }) {
  return post<AdminService>('/admin/services', data);
}

export async function updateAdminService(id: string, data: AdminServicePayload) {
  return put<AdminService>(`/admin/services/${id}`, data);
}

export async function deleteAdminService(id: string) {
  return del<null>(`/admin/services/${id}`);
}

// Admin API - Pricing
export async function fetchAdminPricing() {
  return get<AdminPriceItem[]>('/admin/pricing');
}

export async function createAdminPriceItem(data: AdminPricePayload & { id?: string }) {
  return post<AdminPriceItem>('/admin/pricing', data);
}

export async function updateAdminPriceItem(id: string, data: AdminPricePayload) {
  return put<AdminPriceItem>(`/admin/pricing/${id}`, data);
}

export async function deleteAdminPriceItem(id: string) {
  return del<null>(`/admin/pricing/${id}`);
}

// Admin API - Knowledge
export async function fetchAdminKnowledge() {
  return get<AdminKnowledgeItem[]>('/admin/knowledge');
}

export async function createAdminKnowledge(data: AdminKnowledgePayload & { id?: string }) {
  return post<AdminKnowledgeItem>('/admin/knowledge', data);
}

export async function updateAdminKnowledge(id: string, data: AdminKnowledgePayload) {
  return put<AdminKnowledgeItem>(`/admin/knowledge/${id}`, data);
}

export async function deleteAdminKnowledge(id: string) {
  return del<null>(`/admin/knowledge/${id}`);
}
