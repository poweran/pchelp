import { useState, FormEvent, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTickets } from '../../hooks/useTickets';
import { useTicketPricing } from '../../hooks/useTicketPricing';
import { useServices } from '../../hooks/useServices';
import type { TicketFormData, TicketPriority, Service, LanguageCode, LocalizedText } from '../../types';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Button from '../common/Button';
import { CSSProperties } from 'react';

interface FormErrors {
  clientName?: string;
  phone?: string;
  email?: string;
  serviceType?: string;
  serviceFormat?: string;
  description?: string;
}

interface UserIdentifier {
  clientName: string;
  email: string;
  phone: string;
}

const initialFormData: TicketFormData = {
  clientName: '',
  phone: '',
  email: '',
  serviceType: '',
  serviceFormat: 'remote',
  description: '',
  priority: 'medium',
};

interface TicketFormProps {
  onTicketCreated: (ticket: TicketFormData) => void;
}

export default function TicketForm({ onTicketCreated }: TicketFormProps) {
    const { t, i18n } = useTranslation();
    const [formData, setFormData] = useState<TicketFormData>(initialFormData);
    const [errors, setErrors] = useState<FormErrors>({});
    const [prefilledFromQuery, setPrefilledFromQuery] = useState(false);
    const {
      loading,
      error,
      success,
      submitTicket,
      resetSuccess,
      resetError,
      fetchTickets,
    } = useTickets();
    const {
      services,
      loading: servicesLoading,
      error: servicesError,
      loadServices,
    } = useServices();
    const {
      basePrice,
      formatSurcharge,
      finalPrice,
      formatOptions,
      loading: pricingLoading,
    } = useTicketPricing(formData.serviceType, formData.serviceFormat);

    useEffect(() => {
      loadServices();
    }, [loadServices]);

    const resolveLanguage = (language: string): LanguageCode => {
      const normalized = (language || 'ru').split('-')[0] as LanguageCode;
      return ['ru', 'en', 'hy'].includes(normalized) ? normalized : 'ru';
    };

    const currentLanguage = useMemo<LanguageCode>(() => resolveLanguage(i18n.language), [i18n.language]);

    const numberLocale = useMemo(() => {
      switch (currentLanguage) {
        case 'en':
          return 'en-US';
        case 'hy':
          return 'hy-AM';
        default:
          return 'ru-RU';
      }
    }, [currentLanguage]);

    const getLocalizedText = (text: LocalizedText): string => {
      return text[currentLanguage] ?? text.ru;
    };

    const formatNumber = (value: number): string => {
      return value.toLocaleString(numberLocale);
    };

    const formatServicePrice = (service: Service): string => {
      const currency = t('servicesPage.currency');
      if (typeof service.price === 'number' && service.price > 0) {
        return `${formatNumber(service.price)} ${currency}`;
      }

      const hasMin = typeof service.minPrice === 'number' && service.minPrice > 0;
      const hasMax = typeof service.maxPrice === 'number' && service.maxPrice > 0;

      if (hasMin && hasMax) {
        return `${formatNumber(service.minPrice!)}–${formatNumber(service.maxPrice!)} ${currency}`;
      }

      if (hasMin) {
        return `≥ ${formatNumber(service.minPrice!)} ${currency}`;
      }

      if (hasMax) {
        return `≤ ${formatNumber(service.maxPrice!)} ${currency}`;
      }

      return t('ticketForm.priceNotAvailable');
    };

    const serviceOptions = useMemo(
      () => services.map(service => ({
        id: service.id,
        label: `${getLocalizedText(service.title)} — ${formatServicePrice(service)}`,
      })),
      [services, currentLanguage, numberLocale, t]
    );

    // Загрузка сохраненных данных пользователя при первом рендере
    useEffect(() => {
      const userIdentifierString = localStorage.getItem('userIdentifier');
      if (userIdentifierString) {
        try {
          const userIdentifier: UserIdentifier = JSON.parse(userIdentifierString);
          setFormData(prev => ({
            ...prev,
            clientName: userIdentifier.clientName || '',
            phone: userIdentifier.phone || '',
            email: userIdentifier.email || '',
          }));
        } catch (error) {
          console.error('Error parsing userIdentifier from localStorage:', error);
        }
      }

    }, []);

    useEffect(() => {
      if (prefilledFromQuery) {
        return;
      }

      if (formData.serviceType) {
        setPrefilledFromQuery(true);
        return;
      }

      if (servicesLoading) {
        return;
      }

      if (!services.length) {
        setPrefilledFromQuery(true);
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const category = urlParams.get('category');
      if (!category) {
        setPrefilledFromQuery(true);
        return;
      }

      const matchedService = services.find(service =>
        service.id === category || service.category === category
      );

      if (matchedService) {
        setFormData(prev => ({
          ...prev,
          serviceType: matchedService.id,
        }));
      }
      setPrefilledFromQuery(true);
    }, [services, servicesLoading, prefilledFromQuery, formData.serviceType]);

    // Загрузка сохраненных данных после успешной отправки формы
    useEffect(() => {
      if (success) {
        const userIdentifierString = localStorage.getItem('userIdentifier');
        if (userIdentifierString) {
          try {
            const userIdentifier: UserIdentifier = JSON.parse(userIdentifierString);
            setFormData(prev => ({
              ...prev,
              clientName: userIdentifier.clientName || '',
              phone: userIdentifier.phone || '',
              email: userIdentifier.email || '',
            }));
          } catch (error) {
            console.error('Error parsing userIdentifier from localStorage:', error);
          }
        }
      }
    }, [success]);

    // Периодическое обновление списка тикетов каждые 5 секунд
    useEffect(() => {
      const intervalId = setInterval(() => {
        fetchTickets();
      }, 5000);

      return () => clearInterval(intervalId);
    }, [fetchTickets]);

    useEffect(() => {
      fetchTickets(); // первоначальная загрузка тикетов
    }, [fetchTickets]);

  // Валидация email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Валидация телефона (простая проверка на цифры и минимальную длину)
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  // Валидация формы
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = t('ticketForm.errorNameRequired');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('ticketForm.errorPhoneRequired');
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = t('ticketForm.errorPhoneInvalid');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('ticketForm.errorEmailRequired');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('ticketForm.errorEmailInvalid');
    }

    if (!formData.serviceType) {
      newErrors.serviceType = t('ticketForm.errorServiceRequired');
    }

    if (!formData.description.trim()) {
      newErrors.description = t('ticketForm.errorDescriptionRequired');
    } else if (formData.description.trim().length < 10) {
      newErrors.description = t('ticketForm.errorDescriptionLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработка отправки формы
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    resetError();

    if (!validateForm()) {
        return;
    }

    const payload: TicketFormData = {
      ...formData,
      basePrice: basePrice ?? null,
      formatSurcharge: formatSurcharge ?? null,
      finalPrice: finalPrice ?? null,
    };

    const result = await submitTicket(payload);

    if (result.success) {
      // Notify parent component about the new ticket
      onTicketCreated(payload);

      // Сохранение данных пользователя в localStorage для фильтрации тикетов и автозаполнения формы
      const userIdentifier = JSON.stringify({
        clientName: formData.clientName,
        email: formData.email,
        phone: formData.phone
      });
      localStorage.setItem('userIdentifier', userIdentifier);

      // Очистка формы после успешной отправки
      setFormData(initialFormData);
      setErrors({});

      // Автоматически скрыть сообщение об успехе через 5 секунд
      setTimeout(() => {
        resetSuccess();
      }, 5000);
    }
  };

  // Обработка изменения полей
  const handleChange = (field: keyof TicketFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очистка ошибки при изменении поля
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePriorityChange = (priority: TicketPriority) => {
    setFormData(prev => ({ ...prev, priority }));
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={titleStyle}>{t('ticketForm.title')}</h2>

      {/* Сообщения об успехе/ошибке */}
      {success && (
        <div style={successMessageStyle}>
          ✓ {t('ticketForm.successMessage')}
        </div>
      )}

      {error && (
        <div style={errorMessageStyle}>
          ✗ {t('ticketForm.errorMessage', { error })}
        </div>
      )}

      {/* Имя клиента */}
      <Input
        label={t('ticketForm.labelName')}
        type="text"
        value={formData.clientName}
        onChange={(value) => handleChange('clientName', value)}
        error={errors.clientName}
        placeholder={t('ticketForm.placeholderName')}
        required
        disabled={loading}
      />

      {/* Телефон */}
      <Input
        label={t('ticketForm.labelPhone')}
        type="tel"
        value={formData.phone}
        onChange={(value) => handleChange('phone', value)}
        error={errors.phone}
        placeholder={t('ticketForm.placeholderPhone')}
        required
        disabled={loading}
      />

      {/* Email */}
      <Input
        label={t('ticketForm.labelEmail')}
        type="email"
        value={formData.email}
        onChange={(value) => handleChange('email', value)}
        error={errors.email}
        placeholder={t('ticketForm.placeholderEmail')}
        required
        disabled={loading}
      />

      {/* Тип услуги */}
      <div style={fieldWrapperStyle}>
        <label style={labelStyle}>
          {t('ticketForm.labelServiceType')}
        </label>
        <select
          value={formData.serviceType}
          onChange={(e) => handleChange('serviceType', e.target.value)}
          style={{
            ...selectStyle,
            ...(errors.serviceType ? errorBorderStyle : {}),
          }}
          disabled={loading || servicesLoading}
        >
          <option value="">
            {servicesLoading ? t('ticketForm.servicesLoading') : t('ticketForm.selectDefault')}
          </option>
          {serviceOptions.map(option => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.serviceType && (
          <span style={errorTextStyle}>{errors.serviceType}</span>
        )}
        {servicesError && (
          <span style={errorTextStyle}>
            {t('ticketForm.servicesError', { error: servicesError })}
          </span>
        )}
        {!servicesLoading && !servicesError && serviceOptions.length === 0 && (
          <span style={errorTextStyle}>{t('ticketForm.servicesEmpty')}</span>
        )}
      </div>

      {/* Формат оказания услуги */}
      <div style={fieldWrapperStyle}>
        <label style={labelStyle}>
          {t('ticketForm.labelServiceFormat')}
        </label>
        <select
          value={formData.serviceFormat}
          onChange={(e) => handleChange('serviceFormat', e.target.value)}
          style={selectStyle}
          disabled={loading || pricingLoading}
        >
          {formatOptions.map(option => (
            <option key={option.format} value={option.format}>
              {t(`ticketForm.format.${option.format}`)} (+{option.surcharge.toLocaleString('ru-RU')} {t('servicesPage.currency')})
            </option>
          ))}
        </select>
      </div>

      {/* Стоимость */}
      <div style={priceSummaryStyle}>
        <div style={priceSummaryHeaderStyle}>
          <span>{t('ticketForm.priceTitle')}</span>
          {pricingLoading && <span>{t('ticketForm.priceLoading')}</span>}
        </div>
        <div style={priceSummaryRowStyle}>
          <span>{t('ticketForm.priceBase')}</span>
          <strong style={priceSummaryValueStyle}>
            {basePrice !== null
              ? `${basePrice.toLocaleString('ru-RU')} ${t('servicesPage.currency')}`
              : t('ticketForm.priceNotAvailable')}
          </strong>
        </div>
        <div style={priceSummaryRowStyle}>
          <span>{t('ticketForm.priceSurcharge')}</span>
          <strong style={priceSummaryValueStyle}>
            {`${(formatSurcharge ?? 0).toLocaleString('ru-RU')} ${t('servicesPage.currency')}`}
          </strong>
        </div>
        <div style={priceSummaryTotalStyle}>
          <span>{t('ticketForm.priceTotal')}</span>
          <strong>
            {finalPrice !== null
              ? `${finalPrice.toLocaleString('ru-RU')} ${t('servicesPage.currency')}`
              : t('ticketForm.priceNotAvailable')}
          </strong>
        </div>
      </div>

      {/* Приоритет */}
      <div style={fieldWrapperStyle}>
        <label style={labelStyle}>{t('ticketForm.labelPriority')}</label>
        <div style={radioGroupStyle}>
          <label style={radioLabelStyle}>
            <input
              type="radio"
              name="priority"
              value="low"
              checked={formData.priority === 'low'}
              onChange={() => handlePriorityChange('low')}
              disabled={loading}
              style={radioStyle}
            />
            <span>{t('ticketForm.radioLow')}</span>
          </label>
          <label style={radioLabelStyle}>
            <input
              type="radio"
              name="priority"
              value="medium"
              checked={formData.priority === 'medium'}
              onChange={() => handlePriorityChange('medium')}
              disabled={loading}
              style={radioStyle}
            />
            <span>{t('ticketForm.radioMedium')}</span>
          </label>
          <label style={radioLabelStyle}>
            <input
              type="radio"
              name="priority"
              value="high"
              checked={formData.priority === 'high'}
              onChange={() => handlePriorityChange('high')}
              disabled={loading}
              style={radioStyle}
            />
            <span>{t('ticketForm.radioHigh')}</span>
          </label>
        </div>
      </div>

      {/* Описание проблемы */}
      <Textarea
        label={t('ticketForm.labelDescription')}
        value={formData.description}
        onChange={(value) => handleChange('description', value)}
        error={errors.description}
        placeholder={t('ticketForm.placeholderDescription')}
        required
        disabled={loading}
        rows={5}
        autoFocus
      />

      {/* Кнопка отправки */}
      <Button
        type="submit"
        variant="primary"
        disabled={loading}
        loading={loading}
      >
        {loading ? t('ticketForm.submitLoading') : t('ticketForm.submitButton')}
      </Button>
    </form>
  );
}

// Стили
const formStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  maxWidth: '600px',
  width: '100%',
};

const titleStyle: CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 600,
  color: '#1e293b',
  marginBottom: '0.5rem',
};

const fieldWrapperStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.375rem',
};

const labelStyle: CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 500,
  color: '#1e293b',
  marginBottom: '0.25rem',
};

const selectStyle: CSSProperties = {
  padding: '0.625rem 0.75rem',
  fontSize: '0.875rem',
  borderRadius: '0.375rem',
  border: '1px solid #e2e8f0',
  backgroundColor: '#ffffff',
  color: '#1e293b',
  cursor: 'pointer',
  outline: 'none',
  transition: 'all 0.2s',
};

const errorBorderStyle: CSSProperties = {
  borderColor: '#ef4444',
  outline: '2px solid rgba(239, 68, 68, 0.1)',
};

const errorTextStyle: CSSProperties = {
  fontSize: '0.75rem',
  color: '#ef4444',
  marginTop: '0.25rem',
};

const priceSummaryStyle: CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: '0.5rem',
  padding: '1rem',
  backgroundColor: '#f8fafc',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const priceSummaryHeaderStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.9rem',
  color: '#475569',
};

const priceSummaryRowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.9rem',
  color: '#475569',
};

const priceSummaryTotalStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '1rem',
  fontWeight: 600,
  color: '#0f172a',
};

const priceSummaryValueStyle: CSSProperties = {
  fontWeight: 600,
  color: '#0f172a',
};

const radioGroupStyle: CSSProperties = {
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap',
};

const radioLabelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.875rem',
  color: '#1e293b',
  cursor: 'pointer',
};

const radioStyle: CSSProperties = {
  cursor: 'pointer',
  width: '1rem',
  height: '1rem',
};

const successMessageStyle: CSSProperties = {
  padding: '0.75rem 1rem',
  backgroundColor: '#dcfce7',
  border: '1px solid #22c55e',
  borderRadius: '0.375rem',
  color: '#166534',
  fontSize: '0.875rem',
  fontWeight: 500,
};

const errorMessageStyle: CSSProperties = {
  padding: '0.75rem 1rem',
  backgroundColor: '#fee2e2',
  border: '1px solid #ef4444',
  borderRadius: '0.375rem',
  color: '#991b1b',
  fontSize: '0.875rem',
  fontWeight: 500,
};
