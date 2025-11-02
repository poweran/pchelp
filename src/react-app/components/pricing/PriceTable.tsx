// Компонент для отображения прайс-листа с фильтрацией по категориям

import { useState, useEffect, useMemo, CSSProperties } from 'react';
import type { Service, ServiceCategory } from '../../types';
import { SERVICE_CATEGORIES } from '../../types';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';
import Loading from '../common/Loading';
import { useServices } from '../../hooks/useServices';
import './PriceTable.css';

export function PriceTable() {
  const { t, i18n } = useTranslation();
  const { services, loading, error, loadServices } = useServices();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const categories = useMemo(() => {
    return SERVICE_CATEGORIES.filter(category =>
      services.some(service => service.category === category)
    );
  }, [services]);

  const categoryLabels: Record<ServiceCategory, string> = useMemo(() => ({
    repair: t('servicesPage.repair'),
    setup: t('servicesPage.setup'),
    recovery: t('servicesPage.recovery'),
    consultation: t('servicesPage.consultation'),
  }), [t]);

  const filteredServices = useMemo(() => {
    if (selectedCategory === 'all') {
      return services;
    }
    return services.filter(service => service.category === selectedCategory);
  }, [services, selectedCategory]);

  const groupedServices = useMemo(() => {
    return filteredServices.reduce((groups, service) => {
      const category = service.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(service);
      return groups;
    }, {} as Record<ServiceCategory, Service[]>);
  }, [filteredServices]);

  const currentLang = i18n.language as keyof Service['title'];

  const formatPrice = (service: typeof services[number]) => {
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
    return t('priceTable.priceOnRequest');
  };

  if (loading) {
    return <Loading text={t('priceTable.loading')} />;
  }

  // Стили
  const errorStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#fee2e2',
    border: '1px solid #ef4444',
    borderRadius: '0.5rem',
  };

  const errorIconStyle: CSSProperties = {
    fontSize: '2rem',
  };

  const errorTitleStyle: CSSProperties = {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: '#991b1b',
    margin: '0 0 0.5rem 0',
  };

  const errorMessageStyle: CSSProperties = {
    fontSize: '0.875rem',
    color: '#7f1d1d',
    margin: '0 0 1rem 0',
  };

  if (error) {
    return (
      <div style={errorStyle}>
        <span style={errorIconStyle}>⚠️</span>
        <div>
          <h3 style={errorTitleStyle}>{t('priceTable.errorTitle')}</h3>
          <p style={errorMessageStyle}>{error}</p>
          <Button onClick={loadServices} variant="danger">
            {t('priceTable.retryButton')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="price-table">
      {/* Фильтр по категориям */}
      <div className="price-table__filters">
        <Button
          className={`${selectedCategory === 'all' ? 'price-table__filter-btn--active' : ''}`}
          onClick={() => setSelectedCategory('all')}
          variant={selectedCategory === 'all' ? 'primary' : 'secondary'}
        >
          {t('priceTable.allCategories')}
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            className={`${selectedCategory === category ? 'price-table__filter-btn--active' : ''}`}
            onClick={() => setSelectedCategory(category)}
            variant={selectedCategory === category ? 'primary' : 'secondary'}
          >
            {categoryLabels[category]}
          </Button>
        ))}
      </div>

      {/* Таблица на десктопе, карточки на мобильных */}
      {Object.entries(groupedServices).map(([category, items]) => (
        <div key={category} className="price-table__category">
          <h3 className="price-table__category-title">{categoryLabels[category as ServiceCategory]}</h3>
          
          {/* Десктопная версия - таблица */}
          <table className="price-table__table">
            <thead>
              <tr>
                <th>{t('priceTable.service')}</th>
                <th>{t('priceTable.price')}</th>
                <th>{t('priceTable.unit')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{item.title[currentLang]}</td>
                  <td className="price-table__price">
                    {formatPrice(item)}
                  </td>
                  <td>{item.unit?.[currentLang] ?? t('priceTable.defaultUnit')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Мобильная версия - карточки */}
          <div className="price-table__cards">
            {items.map(item => (
              <div key={item.id} className="price-table__card">
                <div className="price-table__card-service">{item.title[currentLang]}</div>
                <div className="price-table__card-details">
                  <span className="price-table__card-price">
                    {formatPrice(item)}
                  </span>
                  <span className="price-table__card-unit">{item.unit?.[currentLang] ?? t('priceTable.defaultUnit')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filteredServices.length === 0 && (
        <div className="price-table__empty">
          {t('priceTable.empty')}
        </div>
      )}
    </div>
  );
}
