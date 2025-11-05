import { useState, FormEvent, useCallback, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import { useTickets } from '../hooks/useTickets';
import { navigate } from '../utils/router';
import type { TicketFormData } from '../types';
import './HomePage.css';

interface QuickFormData {
  name: string;
  phone: string;
  email: string;
  description: string;
}

interface UserIdentifier {
  clientName: string;
  email: string;
  phone: string;
}

const HomePage = memo(function HomePage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<QuickFormData>({
    name: '',
    phone: '',
    email: '',
    description: '',
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
          name: userIdentifier.clientName || '',
          email: userIdentifier.email || '',
          phone: userIdentifier.phone || '',
        }));
      } catch (error) {
        console.error('Error parsing userIdentifier from localStorage:', error);
      }
    }
  }, []);

  // Сохранение данных в localStorage при изменении формы
  useEffect(() => {
    if (formData.name || formData.email || formData.phone) {
      const userIdentifier = JSON.stringify({
        clientName: formData.name,
        email: formData.email,
        phone: formData.phone
      });
      localStorage.setItem('userIdentifier', userIdentifier);
    }
  }, [formData.name, formData.email, formData.phone]);

  const validateForm = useCallback((): boolean => {
    const errors: {[key: string]: string | undefined} = {};

    if (!formData.name.trim()) {
      errors.name = 'Имя обязательно для заполнения';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Телефон обязателен для заполнения';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email обязателен для заполнения';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Некорректный формат email';
    }

    if (!formData.description.trim()) {
      errors.description = 'Описание проблемы обязательно';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Описание должно содержать минимум 10 символов';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleQuickSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    resetError();

    if (!validateForm()) {
      return;
    }

    // Преобразование данных в формат TicketFormData
    const ticketData: TicketFormData = {
      clientName: formData.name,
      phone: formData.phone,
      email: formData.email,
      serviceType: 'consultation', // По умолчанию консультация для быстрой формы
      description: formData.description,
      priority: 'medium', // По умолчанию средний приоритет
    };

    const result = await submitTicket(ticketData);

    if (result.success) {
      // Сохранение данных пользователя в localStorage после успешной отправки
      const userIdentifier = JSON.stringify({
        clientName: formData.name,
        email: formData.email,
        phone: formData.phone
      });
      localStorage.setItem('userIdentifier', userIdentifier);

      setFormData({ name: '', phone: '', email: '', description: '' });
      setValidationErrors({});
    }
  }, [formData, submitTicket, resetError, validateForm]);

  return (
    <div className="home-page">
        {/* Hero секция */}
        <header className="hero">
          <h1>
            {t('homePage.heroTitle')}
          </h1>
          <p className="subtitle">
            {t('homePage.heroSubtitle')}
          </p>
          <div className="hero-actions">
            <Button onClick={() => navigate('/services')} aria-label={t('homePage.servicesButton')}>
              {t('homePage.servicesButton')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => document.getElementById('quick-form')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label={t('homePage.requestButton')}
            >
              {t('homePage.requestButton')}
            </Button>
          </div>
        </header>

        {/* Преимущества */}
        <section className="features" aria-labelledby="advantages-title">
          <div className="features-header">
            <h2 id="advantages-title" className="features-title">{t('homePage.whyUs')}</h2>
            <p className="features-subtitle">
              {t('homePage.featuresSubtitle')}
            </p>
          </div>
          <div className="features-grid" role="list">
            <Card role="listitem" onClick={() => {
              const element = document.getElementById('quick-form');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}>
              <div className="feature-card" title="Нажмите, чтобы перейти к форме">
                <div className="feature-icon">
                  <span aria-hidden="true">⚡</span>
                </div>
                <h3 className="feature-title">{t('homePage.quickResponse')}</h3>
                <p className="feature-description">
                  {t('homePage.quickResponseDesc')}
                </p>
              </div>
            </Card>

            <Card role="listitem" onClick={() => navigate('/services')}>
              <div className="feature-card" title="Нажмите, чтобы узнать о наших услугах">
                <div className="feature-icon">
                  <span aria-hidden="true">🎓</span>
                </div>
                <h3 className="feature-title">{t('homePage.professionalism')}</h3>
                <p className="feature-description">
                  {t('homePage.professionalismDesc')}
                </p>
              </div>
            </Card>

            <Card role="listitem" onClick={() => navigate('/pricing')}>
              <div className="feature-card" title="Нажмите, чтобы узнать о ценах">
                <div className="feature-icon">
                  <span aria-hidden="true">💰</span>
                </div>
                <h3 className="feature-title">{t('homePage.fairPrices')}</h3>
                <p className="feature-description">
                  {t('homePage.fairPricesDesc')}
                </p>
              </div>
            </Card>

            <Card role="listitem" onClick={() => navigate('/knowledge')}>
              <div className="feature-card" title="Нажмите, чтобы узнать больше о гарантиях">
                <div className="feature-icon">
                  <span aria-hidden="true">✅</span>
                </div>
                <h3 className="feature-title">{t('homePage.qualityGuarantee')}</h3>
                <p className="feature-description">
                  {t('homePage.qualityGuaranteeDesc')}
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Быстрая форма заявки */}
        <section id="quick-form" className="cta" aria-labelledby="contact-form-title">
          <div className="cta-container">
            <h2 id="contact-form-title" className="cta-title">{t('homePage.leaveRequest')}</h2>
            <p className="cta-subtitle">
              {t('homePage.formSubtitle')}
            </p>

            {success && (
              <div className="success-message">
                {t('homePage.successMessage')}
              </div>
            )}

            {error && (
              <div className="error-message">
                ✗ Ошибка при отправке заявки: {error}
              </div>
            )}

            <form onSubmit={handleQuickSubmit} className="form">
              <Input
                label={t('homePage.yourName')}
                type="text"
                value={formData.name}
                onChange={(value) => {
                  setFormData({ ...formData, name: value });
                  if (validationErrors.name) {
                    setValidationErrors(prev => ({ ...prev, name: undefined }));
                  }
                }}
                error={validationErrors.name}
                placeholder={t('homePage.namePlaceholder')}
                required
                disabled={loading}
              />

              <Input
                label={t('homePage.phone')}
                type="tel"
                value={formData.phone}
                onChange={(value) => {
                  setFormData({ ...formData, phone: value });
                  if (validationErrors.phone) {
                    setValidationErrors(prev => ({ ...prev, phone: undefined }));
                  }
                }}
                error={validationErrors.phone}
                placeholder="+374 (99) 12-34-56"
                required
                disabled={loading}
              />

              <Input
                label={t('homePage.email')}
                type="email"
                value={formData.email}
                onChange={(value) => {
                  setFormData({ ...formData, email: value });
                  if (validationErrors.email) {
                    setValidationErrors(prev => ({ ...prev, email: undefined }));
                  }
                }}
                error={validationErrors.email}
                placeholder="example@email.com"
                required
                disabled={loading}
              />

              <Textarea
                label={t('homePage.describeProblem')}
                value={formData.description}
                onChange={(value) => {
                  setFormData({ ...formData, description: value });
                  if (validationErrors.description) {
                    setValidationErrors(prev => ({ ...prev, description: undefined }));
                  }
                }}
                error={validationErrors.description}
                placeholder={t('homePage.describeProblemPlaceholder')}
                required
                disabled={loading}
                rows={4}
              />

              <Button type="submit" disabled={loading} loading={loading}>
                {loading ? t('homePage.sending') : t('homePage.sendRequest')}
              </Button>
            </form>

            <p className="note">
              {t('homePage.callUs')} <a href="tel:+37495019753" className="link">+374 (95) 01-97-53</a>
            </p>
          </div>
        </section>

        {/* Контактная информация */}
        <section className="contact" aria-labelledby="contact-info-title">
          <h2 id="contact-info-title" className="visually-hidden">
            {t('contacts.title')}
          </h2>
          <div className="contact-container">
            <div className="contact-grid" role="list">
                <div className="contact-item" role="listitem" onClick={() => window.location.href = 'tel:+37495019753'}>
                  <span className="contact-icon" aria-hidden="true">📞</span>
                  <div>
                    <h3 className="contact-title">{t('homePage.phoneTitle')}</h3>
                    <p className="contact-text">+374 (95) 01-97-53</p>
                  </div>
                </div>

                <div className="contact-item" role="listitem" onClick={() => window.location.href = 'mailto:info@pchelp.linkpc.net'}>
                  <span className="contact-icon" aria-hidden="true">📧</span>
                  <div>
                    <h3 className="contact-title">{t('homePage.email')}</h3>
                    <p className="contact-text">info@pchelp.linkpc.net</p>
                  </div>
                </div>
 
                <div className="contact-item" role="listitem" onClick={() => navigate('/contacts')}>
                  <span className="contact-icon" aria-hidden="true">📍</span>
                  <div>
                    <h3 className="contact-title">{t('homePage.address')}</h3>
                    <p className="contact-text">{t('homePage.fullAddress')}</p>
                  </div>
                </div>

                <div className="contact-item" role="listitem" onClick={() => navigate('/contacts')}>
                  <span className="contact-icon" aria-hidden="true">🕐</span>
                  <div>
                    <h3 className="contact-title">{t('homePage.workingHours')}</h3>
                    <p className="contact-text" dangerouslySetInnerHTML={{ __html: t('homePage.hours') }} />
                  </div>
                </div>
              </div>
          </div>
        </section>
    </div>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;

// Удалены инлайновые стили - теперь используются CSS классы из HomePage.module.css