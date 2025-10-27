import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { ServiceList } from '../components/services/ServiceList';
import './ServicesPage.css';

export default function ServicesPage() {
  const { t } = useTranslation();

  return (
    <>
        {/* Заголовок страницы */}
        <section style={headerSectionStyle} className="services-header">
          <div style={containerStyle}>
            <h1 style={pageTitleStyle}>{t('servicesPage.title')}</h1>
            <p style={pageSubtitleStyle}>
              {t('servicesPage.subtitle')}
            </p>
          </div>
        </section>


        {/* Список услуг */}
        <section style={servicesSectionStyle} className="services-section">
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
              <button
                onClick={() => window.location.href = '/tickets'}
                style={ctaButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                }}
              >
                {t('servicesPage.leaveRequest')}
              </button>
              <button
                onClick={() => window.location.href = '/contacts'}
                style={ctaButtonSecondaryStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#475569';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#64748b';
                }}
              >
                {t('servicesPage.contact')}
              </button>
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
  padding: '0 1rem',
};

const headerSectionStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  padding: '3rem 0',
  borderBottom: '1px solid #e2e8f0',
};

const pageTitleStyle: CSSProperties = {
  fontSize: '2.5rem',
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


const servicesSectionStyle: CSSProperties = {
  padding: '3rem 0',
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
  display: 'flex',
  gap: '1rem',
  justifyContent: 'center',
  flexWrap: 'wrap',
};

const ctaButtonStyle: CSSProperties = {
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  fontWeight: 500,
  backgroundColor: '#2563eb',
  color: '#ffffff',
  border: 'none',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

const ctaButtonSecondaryStyle: CSSProperties = {
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  fontWeight: 500,
  backgroundColor: '#64748b',
  color: '#ffffff',
  border: 'none',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
};