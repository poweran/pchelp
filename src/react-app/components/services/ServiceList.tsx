import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ServiceCategory } from '../../types';
import { useServices } from '../../hooks/useServices';
import { ServiceCard } from './ServiceCard';
import './ServiceList.css';

interface ServiceListProps {
  filterCategory?: ServiceCategory | null;
}

export function ServiceList({ filterCategory = null }: ServiceListProps) {
  const { t } = useTranslation();
  const { services, loading, error, loadServices } = useServices();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(filterCategory);

  const categoryLabels: Record<ServiceCategory, string> = {
    repair: t('servicesPage.repair'),
    setup: t('servicesPage.setup'),
    recovery: t('servicesPage.recovery'),
    consultation: t('servicesPage.consultation'),
  };

  // console.log('[ServiceList] Services loaded:', services.length, 'items');

  useEffect(() => {
    loadServices();
  }, []);

  const filteredServices = selectedCategory
    ? services.filter(service => service.category === selectedCategory)
    : services;

  const categories: ServiceCategory[] = ['repair', 'setup', 'recovery', 'consultation'];

  if (loading) {
    return (
      <div className="service-list__loading">
        <div className="spinner"></div>
        <p>{t('servicesPage.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="service-list__error">
        <p>{t('servicesPage.error')}: {error}</p>
        <button onClick={loadServices} className="retry-button">
          {t('servicesPage.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="service-list">
      <div className="service-list__filters">
        <button
          className={`filter-button ${selectedCategory === null ? 'filter-button--active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          {t('servicesPage.allServices')}
        </button>
        {categories.map(category => (
          <button
            key={category}
            className={`filter-button ${selectedCategory === category ? 'filter-button--active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>

      {filteredServices.length === 0 ? (
        <div className="service-list__empty">
          <p>{t('servicesPage.noServices')}</p>
        </div>
      ) : (
        <div className="service-list__grid">
          {filteredServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}