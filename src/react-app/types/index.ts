// Типы для портала компьютерной помощи

// Типы для услуг
export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: ServiceCategory;
}

export type ServiceCategory = 'repair' | 'setup' | 'recovery' | 'consultation';

// Типы для заявок
export interface Ticket {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  serviceType: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
}

export type TicketPriority = 'low' | 'medium' | 'high';
export type TicketStatus = 'new' | 'in-progress' | 'completed' | 'cancelled';

// Типы для базы знаний
export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  type: KnowledgeType;
}

export type KnowledgeType = 'faq' | 'article';

// Типы для прайс-листа
export interface PriceItem {
  id: string;
  service: string;
  price: number;
  category: string;
  unit: string;
}

// Типы для API ответов
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Типы для форм
export interface TicketFormData {
  clientName: string;
  phone: string;
  email: string;
  serviceType: string;
  description: string;
  priority: TicketPriority;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}