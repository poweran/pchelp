import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ServiceCategory } from '../../types';
import { useServices } from '../../hooks/useServices';
import { ServiceCard } from './ServiceCard';
import Button from '../common/Button';
import Loading from '../common/Loading';
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
    return <Loading text={t('servicesPage.loading')} />;
  }

  if (error) {
    return (
      <div className="service-list__error">
        <p>{t('servicesPage.error')}: {error}</p>
        <Button onClick={loadServices} variant="danger">
          {t('servicesPage.retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className="service-list">
      <div className="service-list__filters">
        <Button
          className={`${selectedCategory === null ? 'filter-button--active' : ''}`}
          onClick={() => setSelectedCategory(null)}
          variant={selectedCategory === null ? 'primary' : 'secondary'}
        >
          {t('servicesPage.allServices')}
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            className={`${selectedCategory === category ? 'filter-button--active' : ''}`}
            onClick={() => setSelectedCategory(category)}
            variant={selectedCategory === category ? 'primary' : 'secondary'}
          >
            {categoryLabels[category]}
          </Button>
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