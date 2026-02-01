import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { ServiceList } from '../components/services/ServiceList';
import Button from '../components/common/Button';
import { navigate } from '../utils/router';
import './ServicesPage.css';

export default function ServicesPage() {
  const { t } = useTranslation();

  return (
    <>
      {/* Заголовок страницы */}
      <section style={headerSectionStyle} className="services-header hero">
        <div style={containerStyle}>
          <h1 style={pageTitleStyle}>{t('servicesPage.title')}</h1>
          <p style={pageSubtitleStyle}>
            {t('servicesPage.subtitle')}
          </p>
        </div>
      </section>


      {/* Список услуг */}
      <section className="services-section">
        <div style={containerStyle}>
          <ServiceList />
        </div>
      </section>

      {/* Призыв к действию */}
      <section style={ctaSectionStyle} className="services-cta">
        <div style={ctaContainerStyle}>
          <h2 style={ctaTitleStyle}>{t('servicesPage.noService')}</h2>
          <p style={ctaTextStyle}>
            {t('servicesPage.contactUs')}
          </p>
          <div style={ctaButtonsStyle}>
            <Button
              onClick={() => navigate('/tickets')}
              variant="primary"

            >
              {t('servicesPage.leaveRequest')}
            </Button>
            <Button
              onClick={() => navigate('/contacts')}
              variant="secondary"

            >
              {t('servicesPage.contact')}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

// Стили
const containerStyle: CSSProperties = {
  maxWidth: '1280px',
  margin: '0 auto',
};

const headerSectionStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  padding: '2rem',
  borderBottom: '1px solid #e2e8f0',
};

const pageTitleStyle: CSSProperties = {
  fontWeight: 'bold',
  color: '#1e293b',
  marginBottom: '1rem',
  textAlign: 'center',
};

const pageSubtitleStyle: CSSProperties = {
  fontSize: '1.125rem',
  color: '#64748b',
  textAlign: 'center',
  maxWidth: '600px',
  margin: '0 auto',
  lineHeight: '1.6',
};

const ctaSectionStyle: CSSProperties = {
  backgroundColor: '#f1f5f9',
  padding: '4rem 1rem',
  marginTop: '2rem',
};

const ctaContainerStyle: CSSProperties = {
  maxWidth: '800px',
  margin: '0 auto',
  textAlign: 'center',
};

const ctaTitleStyle: CSSProperties = {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#1e293b',
  marginBottom: '1rem',
};

const ctaTextStyle: CSSProperties = {
  fontSize: '1.125rem',
  color: '#64748b',
  marginBottom: '2rem',
  lineHeight: '1.6',
};

const ctaButtonsStyle: CSSProperties = {
  justifyContent: 'center',
  flexWrap: 'wrap',
};