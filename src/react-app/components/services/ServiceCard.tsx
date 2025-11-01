import { useTranslation } from 'react-i18next';
import type { Service } from '../../types';
import './ServiceCard.css';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { t, i18n } = useTranslation();

  const categoryLabels: Record<string, string> = {
    repair: t('servicesPage.repair'),
    setup: t('servicesPage.setup'),
    recovery: t('servicesPage.recovery'),
    consultation: t('servicesPage.consultation'),
  };

  const currentLang = i18n.language as keyof Service['title'];
  const priceLabel = (() => {
    const currency = t('servicesPage.currency');
    if (typeof service.minPrice === 'number' && typeof service.maxPrice === 'number') {
      return `${service.minPrice.toLocaleString('ru-RU')}–${service.maxPrice.toLocaleString('ru-RU')} ${currency}`;
    }
    if (typeof service.price === 'number') {
      return `${service.price.toLocaleString('ru-RU')} ${currency}`;
    }
    if (typeof service.minPrice === 'number') {
      return `${t('servicesPage.from')} ${service.minPrice.toLocaleString('ru-RU')} ${currency}`;
    }
    return t('servicesPage.priceOnRequest');
  })();
  return (
    <div className="service-card">
      <div className="service-card__header">
        <span className={`service-card__category service-card__category--${service.category}`}>
          {categoryLabels[service.category] || service.category}
        </span>
      </div>
      <h3 className="service-card__title">{service.title[currentLang]}</h3>
      <p className="service-card__description">{service.description[currentLang]}</p>
      <div className="service-card__footer">
        <span className="service-card__price">{priceLabel}</span>
      </div>
    </div>
  );
}
