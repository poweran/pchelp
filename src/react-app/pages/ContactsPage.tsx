import React, { useState, useEffect } from 'react';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Button from '../components/common/Button';
import type { TicketFormData } from '../types';
import { useTranslation } from 'react-i18next';
import { useTickets } from '../hooks/useTickets';
import './ContactsPage.css';

interface UserIdentifier {
  clientName: string;
  email: string;
  phone: string;
}

const ContactsPage: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<TicketFormData>({
    clientName: '',
    phone: '',
    email: '',
    serviceType: 'consultation',
    description: '',
    priority: 'medium',
  });
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string | undefined}>({});
  const { loading, error, success, submitTicket, resetError } = useTickets();

  // Загрузка сохраненных данных пользователя при первом рендере
  useEffect(() => {
    const userIdentifierString = localStorage.getItem('userIdentifier');
    if (userIdentifierString) {
      try {
        const userIdentifier: UserIdentifier = JSON.parse(userIdentifierString);
        setFormData(prev => ({
          ...prev,
          clientName: userIdentifier.clientName || '',
          email: userIdentifier.email || '',
          phone: userIdentifier.phone || '',
        }));
      } catch (error) {
        console.error('Error parsing userIdentifier from localStorage:', error);
      }
    }
  }, []);

  const validateForm = () => {
    const errors: {[key: string]: string | undefined} = {};

    if (!formData.clientName.trim()) {
      errors.clientName = t('ticketForm.errorNameRequired');
    }

    if (!formData.phone.trim()) {
      errors.phone = t('ticketForm.errorPhoneRequired');
    }

    if (!formData.email.trim()) {
      errors.email = t('ticketForm.errorEmailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t('ticketForm.errorEmailInvalid');
    }

    if (!formData.description.trim()) {
      errors.description = t('ticketForm.errorDescriptionRequired');
    } else if (formData.description.trim().length < 10) {
      errors.description = t('ticketForm.errorDescriptionLength');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (value: string, field: keyof TicketFormData) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetError();

    if (!validateForm()) {
      return;
    }

    const result = await submitTicket(formData);

    if (result.success) {
      // Сохранение данных пользователя в localStorage после успешной отправки
      const userIdentifier = JSON.stringify({
        clientName: formData.clientName,
        email: formData.email,
        phone: formData.phone
      });
      localStorage.setItem('userIdentifier', userIdentifier);

      setFormData({
        clientName: '',
        phone: '',
        email: '',
        serviceType: 'consultation',
        description: '',
        priority: 'medium',
      });
      setValidationErrors({});
    }
  };

  return (
    <div className="contacts-page">
        <header className="contacts-header hero">
        <h1>{t('contactsPage.title')}</h1>
        <p className="subtitle">{t('contactsPage.subtitle')}</p>
      </header>

      <div className="contacts-content">
        <div className="contacts-info">
          <div className="contact-card">
            <div className="contact-card-icon">📍</div>
            <div className="contact-card-content">
              <h3>{t('contactsPage.officeAddress')}</h3>
              <p>{t('contactsPage.officeAddressText')}</p>
              <p className="contact-note">{t('contactsPage.officeNote')}</p>
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-card-icon">📱</div>
            <div className="contact-card-content">
              <h3>{t('contactsPage.phoneNumber')}</h3>
              <p>
                <a href="tel:+37495019753">+374 (95) 01-97-53</a> — {t('contactsPage.phoneMain')}
              </p>
              <p>
                <a href="tel:+37433333241">+374 (33) 33-32-41</a> — {t('contactsPage.phoneAdditional')}
              </p>
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-card-icon">✉️</div>
            <div className="contact-card-content">
              <h3>{t('contactsPage.email')}</h3>
              <p>
                <a href="mailto:info@pchelp.linkpc.net">info@pchelp.linkpc.net</a> — {t('contactsPage.emailGeneral')}
              </p>
              <p>
                <a href="mailto:support@pchelp.linkpc.net">support@pchelp.linkpc.net</a> — {t('contactsPage.emailSupport')}
              </p>
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-card-icon">🕐</div>
            <div className="contact-card-content">
              <h3>{t('contactsPage.workingHours')}</h3>
              <p>{t('contactsPage.mondayFriday')}: 9:00 — 20:00</p>
              <p>{t('contactsPage.saturday')}: 10:00 — 18:00</p>
              <p>{t('contactsPage.sunday')}: {t('contactsPage.dayOff')}</p>
              <p className="contact-note">{t('contactsPage.fieldServiceNote')}</p>
            </div>
          </div>
        </div>

        <div className="contacts-form-section">
          <h2>{t('contactsPage.feedbackForm')}</h2>
          <p className="form-description">
            {t('contactsPage.formDescription')}
          </p>

          {success && (
            <div className="success-message">
              {t('contactsPage.successMessage')}
            </div>
          )}

          {error && (
            <div className="error-message">
              Ошибка при отправке сообщения: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="clientName">{t('contactsPage.nameLabel')} *</label>
              <Input
                type="text"
                placeholder={t('contactsPage.namePlaceholder')}
                value={formData.clientName}
                onChange={(value) => handleChange(value, 'clientName')}
                error={validationErrors.clientName}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">{t('contactsPage.phoneLabel')} *</label>
              <Input
                type="tel"
                placeholder="+374 (99) 12-34-56"
                value={formData.phone}
                onChange={(value) => handleChange(value, 'phone')}
                error={validationErrors.phone}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">{t('contactsPage.emailLabel')}</label>
              <Input
                type="email"
                placeholder={t('contactsPage.emailPlaceholder')}
                value={formData.email}
                onChange={(value) => handleChange(value, 'email')}
                error={validationErrors.email}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">{t('contactsPage.messageLabel')}</label>
              <Textarea
                placeholder={t('contactsPage.messagePlaceholder')}
                value={formData.description}
                onChange={(value) => handleChange(value, 'description')}
                error={validationErrors.description}
                rows={6}
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              variant="success"
            >
              {loading ? t('contactsPage.submitting') : t('contactsPage.submitButton')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;