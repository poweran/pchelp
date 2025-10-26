import type { Service } from '../../types';
import './ServiceCard.css';

interface ServiceCardProps {
  service: Service;
}

const categoryLabels: Record<string, string> = {
  repair: 'Ремонт',
  setup: 'Настройка',
  recovery: 'Восстановление',
  consultation: 'Консультация',
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="service-card">
      <div className="service-card__header">
        <span className={`service-card__category service-card__category--${service.category}`}>
          {categoryLabels[service.category] || service.category}
        </span>
      </div>
      <h3 className="service-card__title">{service.title}</h3>
      <p className="service-card__description">{service.description}</p>
      <div className="service-card__footer">
        <span className="service-card__price">
          {service.price.toLocaleString('ru-RU')} ₽
        </span>
      </div>
    </div>
  );
}