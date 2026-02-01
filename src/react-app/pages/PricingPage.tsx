import React from 'react';
import { PriceTable } from '../components/pricing/PriceTable';
import { useTranslation } from 'react-i18next';
import './PricingPage.css';

const PricingPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="pricing-page">
      <header className="pricing-header hero">
        <h1>{t('pricingPage.title')}</h1>
        <p className="subtitle">
          {t('pricingPage.subtitle')}
        </p>
      </header>

      <div className="pricing-content">
        <PriceTable />
      </div>

      <div className="pricing-disclaimer">
        <div className="disclaimer-content">
          <h3>{t('pricingPage.disclaimerTitle')}</h3>
          <p>
            {t('pricingPage.disclaimerText')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;