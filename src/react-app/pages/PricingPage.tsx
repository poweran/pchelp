import React from 'react';
import { PriceTable } from '../components/pricing/PriceTable';
import Button from '../components/common/Button';
import { useTranslation } from 'react-i18next';
import './PricingPage.css';

const PricingPage: React.FC = () => {
  const { t } = useTranslation();

  const handleConsultation = () => {
    window.location.href = '#/tickets';
  };

  return (
    <div className="pricing-page">
      <header className="pricing-header">
        <h1>{t('pricingPage.title')}</h1>
        <p className="subtitle">
          {t('pricingPage.subtitle')}
        </p>
      </header>

      <div className="pricing-content">
        <PriceTable />
      </div>

      <div className="pricing-disclaimer">
        <div className="disclaimer-icon">ℹ️</div>
        <div className="disclaimer-content">
          <h3>{t('pricingPage.disclaimerTitle')}</h3>
          <p>
            {t('pricingPage.disclaimerText')}
          </p>
        </div>
      </div>

      <div className="pricing-cta">
        <h2>{t('pricingPage.consultationTitle')}</h2>
        <p>
          {t('pricingPage.consultationText')}
        </p>
        <Button onClick={handleConsultation} className="cta-button">
          {t('pricingPage.consultationButton')}
        </Button>
      </div>
    </div>
  );
};

export default PricingPage;