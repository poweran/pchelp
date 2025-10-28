import { useState, FormEvent, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import './HomePage.css';

interface QuickFormData {
  name: string;
  phone: string;
  description: string;
}

const HomePage = memo(function HomePage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<QuickFormData>({
    name: '',
    phone: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleQuickSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Имитация отправки
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({ name: '', phone: '', description: '' });

      setTimeout(() => setShowSuccess(false), 5000);
    }, 1000);
  }, []);

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
            <Button onClick={() => window.location.href = '/services'} aria-label={t('homePage.servicesButton')}>
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

            <Card role="listitem" onClick={() => window.location.href = '/services'}>
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

            <Card role="listitem" onClick={() => window.location.href = '/pricing'}>
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

            <Card role="listitem" onClick={() => window.location.href = '/knowledge'}>
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

            {showSuccess && (
              <div className="success-message">
                {t('homePage.successMessage')}
              </div>
            )}

            <form onSubmit={handleQuickSubmit} className="form">
              <Input
                label={t('homePage.yourName')}
                type="text"
                value={formData.name}
                onChange={(value) => setFormData({ ...formData, name: value })}
                placeholder="Иван Иванов"
                required
                disabled={isSubmitting}
              />

              <Input
                label={t('homePage.phone')}
                type="tel"
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value })}
                placeholder="+7 (999) 123-45-67"
                required
                disabled={isSubmitting}
              />

              <Textarea
                label={t('homePage.describeProblem')}
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
                placeholder="Кратко опишите вашу проблему..."
                required
                disabled={isSubmitting}
                rows={4}
              />

              <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
                {isSubmitting ? t('homePage.sending') : t('homePage.sendRequest')}
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
 
                <div className="contact-item" role="listitem" onClick={() => window.location.href = '/contacts'}>
                  <span className="contact-icon" aria-hidden="true">📍</span>
                  <div>
                    <h3 className="contact-title">{t('homePage.address')}</h3>
                    <p className="contact-text">{t('homePage.fullAddress')}</p>
                  </div>
                </div>
 
                <div className="contact-item" role="listitem" onClick={() => window.location.href = '/contacts'}>
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