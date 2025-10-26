import { useState, FormEvent } from 'react';
import { useTickets } from '../../hooks/useTickets';
import type { TicketFormData, TicketPriority } from '../../types';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Button from '../common/Button';
import { CSSProperties } from 'react';

interface FormErrors {
  clientName?: string;
  phone?: string;
  email?: string;
  serviceType?: string;
  description?: string;
}

const initialFormData: TicketFormData = {
  clientName: '',
  phone: '',
  email: '',
  serviceType: '',
  description: '',
  priority: 'medium',
};

export default function TicketForm() {
  const [formData, setFormData] = useState<TicketFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const { loading, error, success, submitTicket, resetSuccess, resetError } = useTickets();

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
      newErrors.clientName = 'Имя обязательно для заполнения';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязателен для заполнения';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Некорректный формат телефона';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Некорректный формат email';
    }

    if (!formData.serviceType) {
      newErrors.serviceType = 'Выберите тип услуги';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описание проблемы обязательно';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Описание должно содержать минимум 10 символов';
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

    const result = await submitTicket(formData);
    
    if (result.success) {
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
      <h2 style={titleStyle}>Создать заявку</h2>
      
      {/* Сообщения об успехе/ошибке */}
      {success && (
        <div style={successMessageStyle}>
          ✓ Заявка успешно создана! Мы свяжемся с вами в ближайшее время.
        </div>
      )}
      
      {error && (
        <div style={errorMessageStyle}>
          ✗ Ошибка при создании заявки: {error}
        </div>
      )}

      {/* Имя клиента */}
      <Input
        label="Ваше имя"
        type="text"
        value={formData.clientName}
        onChange={(value) => handleChange('clientName', value)}
        error={errors.clientName}
        placeholder="Иван Иванов"
        required
        disabled={loading}
      />

      {/* Телефон */}
      <Input
        label="Телефон"
        type="tel"
        value={formData.phone}
        onChange={(value) => handleChange('phone', value)}
        error={errors.phone}
        placeholder="+7 (999) 123-45-67"
        required
        disabled={loading}
      />

      {/* Email */}
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(value) => handleChange('email', value)}
        error={errors.email}
        placeholder="example@email.com"
        required
        disabled={loading}
      />

      {/* Тип услуги */}
      <div style={fieldWrapperStyle}>
        <label style={labelStyle}>
          Тип услуги<span style={requiredStyle}>*</span>
        </label>
        <select
          value={formData.serviceType}
          onChange={(e) => handleChange('serviceType', e.target.value)}
          style={{
            ...selectStyle,
            ...(errors.serviceType ? errorBorderStyle : {}),
          }}
          disabled={loading}
        >
          <option value="">Выберите услугу</option>
          <option value="repair">Ремонт компьютера</option>
          <option value="setup">Настройка ПО</option>
          <option value="recovery">Восстановление данных</option>
          <option value="consultation">Консультация</option>
          <option value="installation">Установка оборудования</option>
          <option value="virus-removal">Удаление вирусов</option>
        </select>
        {errors.serviceType && (
          <span style={errorTextStyle}>{errors.serviceType}</span>
        )}
      </div>

      {/* Приоритет */}
      <div style={fieldWrapperStyle}>
        <label style={labelStyle}>Приоритет</label>
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
            <span>Низкий</span>
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
            <span>Средний</span>
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
            <span>Высокий</span>
          </label>
        </div>
      </div>

      {/* Описание проблемы */}
      <Textarea
        label="Описание проблемы"
        value={formData.description}
        onChange={(value) => handleChange('description', value)}
        error={errors.description}
        placeholder="Опишите подробно вашу проблему..."
        required
        disabled={loading}
        rows={5}
      />

      {/* Кнопка отправки */}
      <Button
        type="submit"
        variant="primary"
        disabled={loading}
      >
        {loading ? 'Отправка...' : 'Отправить заявку'}
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

const requiredStyle: CSSProperties = {
  color: '#ef4444',
  marginLeft: '0.25rem',
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