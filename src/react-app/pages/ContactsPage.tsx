import React, { useState } from 'react';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Button from '../components/common/Button';
import type { ContactFormData } from '../types';
import { useTranslation } from 'react-i18next';
import './ContactsPage.css';

const ContactsPage: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (value: string, field: keyof ContactFormData) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Имитация отправки формы
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    }, 1000);
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
                <a href="tel:+37495019753">+374 (95) 01-97-53 — {t('contactsPage.phoneMain')}</a>
              </p>
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-card-icon">✉️</div>
            <div className="contact-card-content">
              <h3>{t('contactsPage.email')}</h3>
              <p>
                <a href="mailto:info@pchelp.linkpc.net">info@pchelp.linkpc.net — {t('contactsPage.emailGeneral')}</a>
              </p>
              <p>
                <a href="mailto:support@pchelp.linkpc.net">support@pchelp.linkpc.net — {t('contactsPage.emailSupport')}</a>
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

          {submitSuccess && (
            <div className="success-message">
              {t('contactsPage.successMessage')}
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">{t('contactsPage.nameLabel')}</label>
              <Input
                type="text"
                placeholder={t('contactsPage.namePlaceholder')}
                value={formData.name}
                onChange={(value) => handleChange(value, 'name')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">{t('contactsPage.emailLabel')}</label>
              <Input
                type="email"
                placeholder={t('contactsPage.emailPlaceholder')}
                value={formData.email}
                onChange={(value) => handleChange(value, 'email')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">{t('contactsPage.messageLabel')}</label>
              <Textarea
                placeholder={t('contactsPage.messagePlaceholder')}
                value={formData.message}
                onChange={(value) => handleChange(value, 'message')}
                rows={6}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? t('contactsPage.submitting') : t('contactsPage.submitButton')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;