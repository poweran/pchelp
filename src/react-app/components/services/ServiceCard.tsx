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
        <span className="service-card__price">
          {service.price.toLocaleString('ru-RU')} {t('servicesPage.currency')}
        </span>
      </div>
    </div>
  );
}