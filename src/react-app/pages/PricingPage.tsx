import React from 'react';
import { PriceTable } from '../components/pricing/PriceTable';
import Button from '../components/common/Button';
import './PricingPage.css';

const PricingPage: React.FC = () => {
  const handleConsultation = () => {
    window.location.href = '#/tickets';
  };

  return (
    <div className="pricing-page">
      <header className="pricing-header">
        <h1>💰 Наши цены</h1>
        <p className="subtitle">
          Прозрачное ценообразование на все виды услуг
        </p>
      </header>

      <div className="pricing-content">
        <PriceTable />
      </div>

      <div className="pricing-disclaimer">
        <div className="disclaimer-icon">ℹ️</div>
        <div className="disclaimer-content">
          <h3>Обратите внимание</h3>
          <p>
            Указанные цены являются базовыми и могут изменяться в зависимости от 
            сложности работ, используемых материалов и срочности выполнения заказа. 
            Точную стоимость можно узнать после диагностики или консультации со специалистом.
          </p>
        </div>
      </div>

      <div className="pricing-cta">
        <h2>Нужна консультация?</h2>
        <p>
          Наши специалисты помогут подобрать оптимальное решение и 
          рассчитают точную стоимость работ
        </p>
        <Button onClick={handleConsultation} className="cta-button">
          📝 Заказать консультацию
        </Button>
      </div>
    </div>
  );
};

export default PricingPage;