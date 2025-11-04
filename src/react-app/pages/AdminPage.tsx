import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Loading from '../components/common/Loading';
import {
  fetchTickets,
  updateTicket,
  deleteTicket,
  fetchAdminServices,
  createAdminService,
  updateAdminService,
  deleteAdminService,
  fetchAdminKnowledge,
  createAdminKnowledge,
  updateAdminKnowledge,
  deleteAdminKnowledge,
} from '../utils/api';
import type {
  Ticket,
  TicketStatus,
  TicketPriority,
  AdminService,
  AdminServicePayload,
  AdminKnowledgeItem,
  AdminKnowledgePayload,
  LocalizedText,
  ServiceCategory,
  KnowledgeType,
  LanguageCode,
} from '../types';
import { SERVICE_CATEGORIES } from '../types';
import './AdminPage.css';

type AdminTab = 'tickets' | 'services' | 'knowledge';

const LANGUAGES: LanguageCode[] = ['ru', 'en', 'hy'];
const TICKET_STATUSES: TicketStatus[] = ['new', 'in-progress', 'completed', 'cancelled'];
const TICKET_PRIORITIES: TicketPriority[] = ['low', 'medium', 'high'];
const KNOWLEDGE_TYPES: KnowledgeType[] = ['faq', 'article'];

const createEmptyLocalized = (): LocalizedText => ({
  ru: '',
  en: '',
  hy: '',
});

const parseNumeric = (value: string): number | null => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatDateTime = (value: string): string => {
  try {
    return new Date(value).toLocaleString();
  } catch (error) {
    return value;
  }
};

interface ServiceFormState {
   title: LocalizedText;
   description: LocalizedText;
   category: ServiceCategory;
   isRangePrice: boolean;
   price: string;
   minPrice: string;
   maxPrice: string;
   unit: LocalizedText;
   videoUrl: string;
 }

interface KnowledgeFormState {
  title: LocalizedText;
  content: LocalizedText;
  category: LocalizedText;
  type: KnowledgeType;
}

const createEmptyServiceForm = (): ServiceFormState => ({
   title: createEmptyLocalized(),
   description: createEmptyLocalized(),
   category: 'repair',
   isRangePrice: false,
   price: '',
   minPrice: '',
   maxPrice: '',
   unit: createEmptyLocalized(),
   videoUrl: '',
 });

const createEmptyKnowledgeForm = (): KnowledgeFormState => ({
  title: createEmptyLocalized(),
  content: createEmptyLocalized(),
  category: createEmptyLocalized(),
  type: 'faq',
});

const TicketsSection: React.FC = () => {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(() => {
    const saved = localStorage.getItem('admin-tickets-auto-refresh');
    return saved ? JSON.parse(saved) : false;
  });

  const handleAutoRefreshChange = (checked: boolean) => {
    localStorage.setItem('admin-tickets-auto-refresh', JSON.stringify(checked));
    setAutoRefresh(checked);
  };

  const loadTickets = useCallback(async () => {
    const response = await fetchTickets();
    if (response.error) {
      setError(response.error);
      setTickets([]);
    } else if (Array.isArray(response.data)) {
      setTickets(response.data);
    } else {
      setTickets([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadTickets();
      }, 10000); // Обновление каждые 10 секунд
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, loadTickets]);

  const statusLabels = useMemo<Record<TicketStatus, string>>(() => ({
    new: t('ticketCard.statusNew'),
    'in-progress': t('ticketCard.statusInProgress'),
    completed: t('ticketCard.statusCompleted'),
    cancelled: t('ticketCard.statusCancelled'),
  }), [t]);

  const priorityLabels = useMemo<Record<TicketPriority, string>>(() => ({
    low: t('ticketCard.priorityLow'),
    medium: t('ticketCard.priorityMedium'),
    high: t('ticketCard.priorityHigh'),
  }), [t]);

  const handleStatusChange = async (ticketId: string, status: TicketStatus) => {
    setProcessingId(ticketId);
    setError(null);
    const response = await updateTicket(ticketId, { status });
    if (response.error || !response.data) {
      setError(response.error || t('admin.tickets.updateError'));
    } else {
      setTickets(prev => prev.map(ticket => ticket.id === ticketId ? response.data! : ticket));
      setFeedback(t('admin.tickets.updated'));
    }
    setProcessingId(null);
  };

  const handlePriorityChange = async (ticketId: string, priority: TicketPriority) => {
    setProcessingId(ticketId);
    setError(null);
    const response = await updateTicket(ticketId, { priority });
    if (response.error || !response.data) {
      setError(response.error || t('admin.tickets.updateError'));
    } else {
      setTickets(prev => prev.map(ticket => ticket.id === ticketId ? response.data! : ticket));
      setFeedback(t('admin.tickets.updated'));
    }
    setProcessingId(null);
  };

  const handleDelete = async (ticketId: string) => {
    if (!window.confirm(t('admin.tickets.confirmDelete'))) {
      return;
    }
    setDeletingId(ticketId);
    setError(null);
    const response = await deleteTicket(ticketId);
    if (response.error) {
      setError(response.error || t('admin.tickets.deleteError'));
    } else {
      setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
      setFeedback(t('admin.tickets.deleted'));
    }
    setDeletingId(null);
  };

  if (loading) {
    return <Loading text={t('admin.tickets.loading')} />;
  }

  return (
    <section className="admin-section">
      <div className="admin-section__header">
        <h2>{t('admin.tickets.title')}</h2>
        <div className="admin-section__actions">
          <label className="admin-auto-refresh">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => handleAutoRefreshChange(e.target.checked)}
            />
            <span className="admin-auto-refresh__label">{t('admin.tickets.autoRefresh')}</span>
          </label>
          <Button onClick={loadTickets} variant="secondary">
            {t('admin.actions.refresh')}
          </Button>
        </div>
      </div>

      {error && <div className="admin-feedback admin-feedback--error">{error}</div>}
      {feedback && <div className="admin-feedback admin-feedback--success">{feedback}</div>}

      {tickets.length === 0 ? (
        <div className="admin-empty">{t('admin.tickets.empty')}</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t('admin.tickets.table.client')}</th>
                <th>{t('admin.tickets.table.contact')}</th>
                <th>{t('admin.tickets.table.serviceType')}</th>
                <th>{t('admin.tickets.table.priority')}</th>
                <th>{t('admin.tickets.table.status')}</th>
                <th>{t('admin.tickets.table.created')}</th>
                <th>{t('admin.tickets.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id}>
                  <td>
                    <div className="admin-ticket__title">{ticket.clientName}</div>
                    <div className="admin-ticket__id">{ticket.id}</div>
                  </td>
                  <td>
                    <div>{ticket.phone}</div>
                    <div>{ticket.email}</div>
                  </td>
                  <td>{ticket.serviceType}</td>
                  <td>
                    <select
                      className="admin-select"
                      value={ticket.priority}
                      disabled={processingId === ticket.id}
                      onChange={(event) => handlePriorityChange(ticket.id, event.target.value as TicketPriority)}
                    >
                      {TICKET_PRIORITIES.map(priority => (
                        <option key={priority} value={priority}>
                          {priorityLabels[priority]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      className="admin-select"
                      value={ticket.status}
                      disabled={processingId === ticket.id}
                      onChange={(event) => handleStatusChange(ticket.id, event.target.value as TicketStatus)}
                    >
                      {TICKET_STATUSES.map(status => (
                        <option key={status} value={status}>
                          {statusLabels[status]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{formatDateTime(ticket.createdAt)}</td>
                  <td>
                    <Button
                      onClick={() => alert(`${t('admin.tickets.viewDescription')}:\n\n${ticket.description}`)}
                      variant="secondary"
                      size="small"
                      title={t('admin.tickets.viewDescription')}
                    >
                      ⓘ
                    </Button>
                    <Button
                      onClick={() => handleDelete(ticket.id)}
                      variant="danger"
                      size="small"
                      disabled={deletingId === ticket.id}
                      title={deletingId === ticket.id ? t('admin.actions.deleting') : t('admin.actions.delete')}
                    >
                      ✖
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

const ServicesSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as LanguageCode;
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formState, setFormState] = useState<ServiceFormState>(() => createEmptyServiceForm());
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadServices = async () => {
    setLoading(true);
    setError(null);
    const response = await fetchAdminServices();
    if (response.error) {
      setError(response.error);
      setServices([]);
    } else if (Array.isArray(response.data)) {
      setServices(response.data);
    } else {
      setServices([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const languageLabels = useMemo<Record<LanguageCode, string>>(() => ({
    ru: t('admin.locales.ru'),
    en: t('admin.locales.en'),
    hy: t('admin.locales.hy'),
  }), [t]);

  const handleSelect = (service: AdminService) => {
    setSelectedId(service.id);
    setFormState({
      title: { ...service.title },
      description: { ...service.description },
      category: service.category,
      isRangePrice: service.minPrice !== null && service.maxPrice !== null,
      price: service.price !== null && service.price !== undefined ? String(service.price) : '',
      minPrice: service.minPrice !== null && service.minPrice !== undefined ? String(service.minPrice) : '',
      maxPrice: service.maxPrice !== null && service.maxPrice !== undefined ? String(service.maxPrice) : '',
      unit: service.unit ? { ...service.unit } : createEmptyLocalized(),
      videoUrl: service.videoUrl ?? '',
    });
    setFeedback(null);
    setError(null);
  };

  const resetForm = () => {
    setSelectedId(null);
    setFormState(createEmptyServiceForm());
    setFeedback(null);
    setError(null);
  };

  const handleLocalizedChange = (field: 'title' | 'description' | 'unit', lang: LanguageCode, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const priceValue = parseNumeric(formState.price);
    const minPriceValue = parseNumeric(formState.minPrice);
    const maxPriceValue = parseNumeric(formState.maxPrice);

    if (formState.isRangePrice) {
      if (minPriceValue === null || maxPriceValue === null) {
        setError(t('admin.services.validation.minMaxRequired'));
        setSubmitting(false);
        return;
      }
      if (minPriceValue > maxPriceValue) {
        setError(t('admin.services.validation.minGreaterThanMax'));
        setSubmitting(false);
        return;
      }
    } else {
      if (priceValue === null) {
        setError(t('admin.services.validation.priceRequired'));
        setSubmitting(false);
        return;
      }
    }

    const payload: AdminServicePayload = {
      title: formState.title,
      description: formState.description,
      category: formState.category,
      price: formState.isRangePrice ? null : priceValue,
      minPrice: formState.isRangePrice ? minPriceValue : null,
      maxPrice: formState.isRangePrice ? maxPriceValue : null,
      unit: formState.unit,
      videoUrl: formState.videoUrl.trim() || undefined,
    };

    const response = selectedId
      ? await updateAdminService(selectedId, payload)
      : await createAdminService(payload);

    if (response.error || !response.data) {
      setError(response.error || t('admin.services.errorSave'));
    } else {
      if (selectedId) {
        setServices(prev => prev.map(service => service.id === selectedId ? response.data! : service));
      } else {
        setServices(prev => [...prev, response.data!]);
        setSelectedId(response.data!.id);
      }
      setFeedback(t('admin.services.saved'));
    }

    setSubmitting(false);
  };

  const handleDelete = async (serviceId: string) => {
    if (!window.confirm(t('admin.services.confirmDelete'))) {
      return;
    }
    setDeletingId(serviceId);
    setError(null);
    const response = await deleteAdminService(serviceId);
    if (response.error) {
      setError(response.error || t('admin.services.errorDelete'));
    } else {
      setServices(prev => prev.filter(service => service.id !== serviceId));
      if (selectedId === serviceId) {
        resetForm();
      }
      setFeedback(t('admin.services.deleted'));
    }
    setDeletingId(null);
  };

  if (loading) {
    return <Loading text={t('admin.services.loading')} />;
  }

  return (
    <section className="admin-section">
      <div className="admin-section__header">
        <h2>{t('admin.services.title')}</h2>
        <Button onClick={resetForm} variant="secondary">
          {t('admin.actions.createNew')}
        </Button>
      </div>

      {error && <div className="admin-feedback admin-feedback--error">{error}</div>}
      {feedback && <div className="admin-feedback admin-feedback--success">{feedback}</div>}

      <div className="admin-section__layout">
        <div className="admin-card">
          <h3 className="admin-card__title">{t('admin.services.listTitle')}</h3>
          {services.length === 0 ? (
            <div className="admin-empty">{t('admin.services.empty')}</div>
          ) : (
            <ul className="admin-list">
              {services.map(service => (
                <li
                  key={service.id}
                  className={`admin-list__item ${selectedId === service.id ? 'admin-list__item--active' : ''}`}
                >
                  <button
                    type="button"
                    className="admin-list__button"
                    onClick={() => handleSelect(service)}
                  >
                    <span className="admin-list__title">{service.title[currentLang] || service.title.ru}</span>
                    <span className="admin-list__meta">{service.category}</span>
                  </button>
                  <Button
                    onClick={() => handleDelete(service.id)}
                    variant="danger"
                    disabled={deletingId === service.id}
                  >
                    {deletingId === service.id ? t('admin.actions.deleting') : t('admin.actions.delete')}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form className="admin-card admin-form" onSubmit={handleSubmit}>
          <h3 className="admin-card__title">
            {selectedId ? t('admin.services.editTitle') : t('admin.services.newTitle')}
          </h3>

          <div className="admin-form__grid">
            {LANGUAGES.map(lang => (
              <div key={lang} className="admin-form__group">
                <h4 className="admin-form__subtitle">{languageLabels[lang]}</h4>
                <Input
                  label={t('admin.services.fields.title')}
                  value={formState.title[lang]}
                  onChange={(value) => handleLocalizedChange('title', lang, value)}
                  required={lang === 'ru'}
                />
                <Textarea
                  label={t('admin.services.fields.description')}
                  value={formState.description[lang]}
                  onChange={(value) => handleLocalizedChange('description', lang, value)}
                  rows={4}
                  required={lang === 'ru'}
                />
                <Input
                  label={t('admin.services.fields.unit')}
                  value={formState.unit[lang]}
                  onChange={(value) => handleLocalizedChange('unit', lang, value)}
                />
              </div>
            ))}
          </div>

          <div className="admin-form__row">
            <div className="admin-form__price-toggle">
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={formState.isRangePrice}
                  onChange={(e) => setFormState(prev => ({
                    ...prev,
                    isRangePrice: e.target.checked,
                    price: e.target.checked ? '' : prev.price,
                    minPrice: e.target.checked ? prev.minPrice : '',
                    maxPrice: e.target.checked ? prev.maxPrice : '',
                  }))}
                />
                <span className="admin-checkbox__label">{t('admin.services.fields.isRangePrice')}</span>
              </label>
            </div>

            {!formState.isRangePrice ? (
              <Input
                label={t('admin.services.fields.price')}
                type="number"
                value={formState.price}
                onChange={(value) => setFormState(prev => ({ ...prev, price: value }))}
              />
            ) : (
              <div className="admin-form__price-range">
                <Input
                  label={t('admin.services.fields.minPrice')}
                  type="number"
                  value={formState.minPrice}
                  onChange={(value) => setFormState(prev => ({ ...prev, minPrice: value }))}
                />
                <Input
                  label={t('admin.services.fields.maxPrice')}
                  type="number"
                  value={formState.maxPrice}
                  onChange={(value) => setFormState(prev => ({ ...prev, maxPrice: value }))}
                />
              </div>
            )}
          </div>

          <div className="admin-form__row">
            <div className="admin-select-group">
              <label className="admin-select-group__label">{t('admin.services.fields.category')}</label>
              <select
                className="admin-select"
                value={formState.category}
                onChange={(event) => setFormState(prev => ({
                  ...prev,
                  category: event.target.value as ServiceCategory
                }))}
              >
                {SERVICE_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {t(`servicesPage.${category}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="admin-form__row">
            <Input
              label={t('admin.services.fields.videoFile')}
              type="text"
              value={formState.videoUrl}
              onChange={(value) => setFormState(prev => ({ ...prev, videoUrl: value }))}
              placeholder="task_01k95v9v01f7hv9frbs4d9x8yf_task_01k95v9v01f7hv9frbs4d9x8yf_genid_7959ccc2-1108-42b7-8d89-fcd9df20021f_25_11_03_21_52_958581_videos_00000_794519525_source.mp4"
            />
          </div>

          <div className="admin-form__actions">
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? t('admin.actions.saving') : t('admin.actions.save')}
            </Button>
            <Button type="button" variant="secondary" onClick={resetForm}>
              {t('admin.actions.cancel')}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

const KnowledgeSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as LanguageCode;
  const [items, setItems] = useState<AdminKnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formState, setFormState] = useState<KnowledgeFormState>(() => createEmptyKnowledgeForm());
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadKnowledge = async () => {
    setLoading(true);
    setError(null);
    const response = await fetchAdminKnowledge();
    if (response.error) {
      setError(response.error);
      setItems([]);
    } else if (Array.isArray(response.data)) {
      setItems(response.data);
    } else {
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadKnowledge();
  }, []);

  const languageLabels = useMemo<Record<LanguageCode, string>>(() => ({
    ru: t('admin.locales.ru'),
    en: t('admin.locales.en'),
    hy: t('admin.locales.hy'),
  }), [t]);

  const handleSelect = (item: AdminKnowledgeItem) => {
    setSelectedId(item.id);
    setFormState({
      title: { ...item.title },
      content: { ...item.content },
      category: { ...item.category },
      type: item.type,
    });
    setFeedback(null);
    setError(null);
  };

  const resetForm = () => {
    setSelectedId(null);
    setFormState(createEmptyKnowledgeForm());
    setFeedback(null);
    setError(null);
  };

  const handleLocalizedChange = (
    field: 'title' | 'content' | 'category',
    lang: LanguageCode,
    value: string
  ) => {
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload: AdminKnowledgePayload = {
      title: formState.title,
      content: formState.content,
      category: formState.category,
      type: formState.type,
    };

    const response = selectedId
      ? await updateAdminKnowledge(selectedId, payload)
      : await createAdminKnowledge(payload);

    if (response.error || !response.data) {
      setError(response.error || t('admin.knowledge.errorSave'));
    } else {
      if (selectedId) {
        setItems(prev => prev.map(item => item.id === selectedId ? response.data! : item));
      } else {
        setItems(prev => [...prev, response.data!]);
        setSelectedId(response.data!.id);
      }
      setFeedback(t('admin.knowledge.saved'));
    }

    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('admin.knowledge.confirmDelete'))) {
      return;
    }
    setDeletingId(id);
    setError(null);
    const response = await deleteAdminKnowledge(id);
    if (response.error) {
      setError(response.error || t('admin.knowledge.errorDelete'));
    } else {
      setItems(prev => prev.filter(item => item.id !== id));
      if (selectedId === id) {
        resetForm();
      }
      setFeedback(t('admin.knowledge.deleted'));
    }
    setDeletingId(null);
  };

  if (loading) {
    return <Loading text={t('admin.knowledge.loading')} />;
  }

  return (
    <section className="admin-section">
      <div className="admin-section__header">
        <h2>{t('admin.knowledge.title')}</h2>
        <Button onClick={resetForm} variant="secondary">
          {t('admin.actions.createNew')}
        </Button>
      </div>

      {error && <div className="admin-feedback admin-feedback--error">{error}</div>}
      {feedback && <div className="admin-feedback admin-feedback--success">{feedback}</div>}

      <div className="admin-section__layout">
        <div className="admin-card">
          <h3 className="admin-card__title">{t('admin.knowledge.listTitle')}</h3>
          {items.length === 0 ? (
            <div className="admin-empty">{t('admin.knowledge.empty')}</div>
          ) : (
            <ul className="admin-list">
              {items.map(item => (
                <li
                  key={item.id}
                  className={`admin-list__item ${selectedId === item.id ? 'admin-list__item--active' : ''}`}
                >
                  <button
                    type="button"
                    className="admin-list__button"
                    onClick={() => handleSelect(item)}
                  >
                    <span className="admin-list__title">{item.title[currentLang] || item.title.ru}</span>
                    <span className="admin-list__meta">{t(`admin.knowledge.type.${item.type}`)}</span>
                  </button>
                  <Button
                    onClick={() => handleDelete(item.id)}
                    variant="danger"
                    disabled={deletingId === item.id}
                  >
                    {deletingId === item.id ? t('admin.actions.deleting') : t('admin.actions.delete')}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form className="admin-card admin-form" onSubmit={handleSubmit}>
          <h3 className="admin-card__title">
            {selectedId ? t('admin.knowledge.editTitle') : t('admin.knowledge.newTitle')}
          </h3>

          <div className="admin-form__grid">
            {LANGUAGES.map(lang => (
              <div key={lang} className="admin-form__group">
                <h4 className="admin-form__subtitle">{languageLabels[lang]}</h4>
                <Input
                  label={t('admin.knowledge.fields.title')}
                  value={formState.title[lang]}
                  onChange={(value) => handleLocalizedChange('title', lang, value)}
                  required={lang === 'ru'}
                />
                <Textarea
                  label={t('admin.knowledge.fields.content')}
                  value={formState.content[lang]}
                  onChange={(value) => handleLocalizedChange('content', lang, value)}
                  rows={5}
                  required={lang === 'ru'}
                />
                <Input
                  label={t('admin.knowledge.fields.category')}
                  value={formState.category[lang]}
                  onChange={(value) => handleLocalizedChange('category', lang, value)}
                  required={lang === 'ru'}
                />
              </div>
            ))}
          </div>

          <div className="admin-select-group">
            <label className="admin-select-group__label">{t('admin.knowledge.fields.type')}</label>
            <select
              className="admin-select"
              value={formState.type}
              onChange={(event) => setFormState(prev => ({
                ...prev,
                type: event.target.value as KnowledgeType
              }))}
            >
              {KNOWLEDGE_TYPES.map(type => (
                <option key={type} value={type}>
                  {t(`admin.knowledge.type.${type}`)}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form__actions">
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? t('admin.actions.saving') : t('admin.actions.save')}
            </Button>
            <Button type="button" variant="secondary" onClick={resetForm}>
              {t('admin.actions.cancel')}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

const AuthForm: React.FC<{ onAuthenticated: () => void }> = ({ onAuthenticated }) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    // Simple password check (in production, use proper authentication)
    const adminPassword = process.env.NODE_ENV === 'development' ? 'admin123' : 'secureadminpass2024';

    if (password === adminPassword) {
      // Устанавливаем авторизацию в localStorage
      localStorage.setItem('admin-auth', 'true');
      // Устанавливаем токен для API запросов
      const token = process.env.NODE_ENV === 'development' ? 'dev-admin-token-123' : 'admin-token-2024-secure';
      localStorage.setItem('admin-token', token);
      onAuthenticated();
    } else {
      setError(t('admin.auth.invalidPassword'));
    }
    setLoading(false);
  };

  return (
    <div className="admin-auth">
      <div className="admin-auth__container">
        <h1>{t('admin.auth.title')}</h1>
        <p>{t('admin.auth.subtitle')}</p>

        <form onSubmit={handleSubmit} className="admin-auth__form">
          <Input
            type="password"
            label={t('admin.auth.password')}
            value={password}
            onChange={setPassword}
            placeholder={t('admin.auth.passwordPlaceholder')}
            required
          />

          {error && <div className="admin-feedback admin-feedback--error">{error}</div>}

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? t('admin.auth.loading') : t('admin.auth.login')}
          </Button>
        </form>
      </div>
    </div>
  );
};

const AdminContent: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<AdminTab>('tickets');

  const handleLogout = () => {
    localStorage.removeItem('admin-auth');
    window.location.reload(); // Force reload to reset all state
  };

  const tabs = useMemo(() => ([
    { key: 'tickets' as const, label: t('admin.tabs.tickets'), icon: '🎫' },
    { key: 'services' as const, label: t('admin.tabs.services'), icon: '🛠️' },
    { key: 'knowledge' as const, label: t('admin.tabs.knowledge'), icon: '📚' },
  ]), [t]);

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div className="admin-page__header-content">
          <div>
            <h1>{t('admin.title')}</h1>
            <p className="admin-page__subtitle">{t('admin.subtitle')}</p>
          </div>
          <Button onClick={handleLogout} variant="secondary">
            {t('admin.auth.logout')}
          </Button>
        </div>
      </header>

      <div className="admin-page__tabs">
        {tabs.map(tab => (
          <Button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            variant={activeTab === tab.key ? 'primary' : 'secondary'}
            className="admin-tab-button"
          >
            <span className="admin-tab-button__icon" aria-hidden>{tab.icon}</span>
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="admin-page__content">
        {activeTab === 'tickets' && <TicketsSection />}
        {activeTab === 'services' && <ServicesSection />}
        {activeTab === 'knowledge' && <KnowledgeSection />}
      </div>
    </div>
  );
};

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin-auth') === 'true';
  });

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <AuthForm onAuthenticated={handleAuthenticated} />;
  }

  return <AdminContent />;
};

export default AdminPage;
