// Типы для портала компьютерной помощи

export type LanguageCode = 'ru' | 'en' | 'hy';

export interface LocalizedText {
  ru: string;
  en: string;
  hy: string;
}

// Типы для услуг
export interface Service {
   id: string;
   title: LocalizedText;
   description: LocalizedText;
   category: ServiceCategory;
   price?: number | null;
   minPrice?: number | null;
   maxPrice?: number | null;
   unit?: LocalizedText;
   videoUrl?: string;
 }

export type ServiceCategory = 'repair' | 'setup' | 'recovery' | 'consultation';

export const SERVICE_CATEGORIES: ServiceCategory[] = ['repair', 'setup', 'recovery', 'consultation'];

// Типы для заявок
export interface Ticket {
  id: string;
  title: string;
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
// Типы для админ-панели
export interface AdminService extends Service {
   createdAt?: string | null;
   updatedAt?: string | null;
   videoUrl?: string;
 }

export interface AdminServicePayload {
   title: LocalizedText;
   description: LocalizedText;
   category: ServiceCategory;
   price?: number | null;
   minPrice?: number | null;
   maxPrice?: number | null;
   unit?: LocalizedText;
   videoUrl?: string;
 }

export interface AdminKnowledgeItem {
  id: string;
  title: LocalizedText;
  content: LocalizedText;
  category: LocalizedText;
  type: KnowledgeType;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AdminKnowledgePayload {
  title: LocalizedText;
  content: LocalizedText;
  category: LocalizedText;
  type: KnowledgeType;
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
