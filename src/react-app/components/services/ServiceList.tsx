import { useEffect, useState } from 'react';
import type { ServiceCategory } from '../../types';
import { useServices } from '../../hooks/useServices';
import { ServiceCard } from './ServiceCard';
import './ServiceList.css';

interface ServiceListProps {
  filterCategory?: ServiceCategory | null;
}

const categoryLabels: Record<ServiceCategory, string> = {
  repair: 'Ремонт',
  setup: 'Настройка',
  recovery: 'Восстановление',
  consultation: 'Консультация',
};

export function ServiceList({ filterCategory = null }: ServiceListProps) {
  const { services, loading, error, loadServices } = useServices();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(filterCategory);

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
        <p>Загрузка услуг...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="service-list__error">
        <p>Ошибка загрузки услуг: {error}</p>
        <button onClick={loadServices} className="retry-button">
          Попробовать снова
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
          Все услуги
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
          <p>Услуги не найдены</p>
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