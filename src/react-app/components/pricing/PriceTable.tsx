// Компонент для отображения прайс-листа с фильтрацией по категориям

import { useState, useEffect } from 'react';
import { fetchPricing } from '../../utils/api';
import type { PriceItem } from '../../types';
import './PriceTable.css';

export function PriceTable() {
  const [priceItems, setPriceItems] = useState<PriceItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  // Загрузка прайс-листа при монтировании
  useEffect(() => {
    loadPricing();
  }, []);

  // Применение фильтра при изменении данных или категории
  useEffect(() => {
    applyFilter();
  }, [priceItems, selectedCategory]);

  // Функция для загрузки прайс-листа
  const loadPricing = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchPricing();

      if (response.error) {
        setError(response.error);
        setPriceItems([]);
      } else if (response.data) {
        setPriceItems(response.data);
        
        // Извлекаем уникальные категории
        const uniqueCategories = Array.from(
          new Set(response.data.map(item => item.category))
        ).sort();
        setCategories(uniqueCategories);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка загрузки прайс-листа';
      setError(message);
      setPriceItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Функция для применения фильтра по категории
  const applyFilter = () => {
    if (selectedCategory === 'all') {
      setFilteredItems(priceItems);
    } else {
      setFilteredItems(
        priceItems.filter(item => item.category === selectedCategory)
      );
    }
  };

  // Группировка элементов по категориям
  const groupedItems = filteredItems.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, PriceItem[]>);

  if (loading) {
    return <div className="price-table__loading">Загрузка прайс-листа...</div>;
  }

  if (error) {
    return <div className="price-table__error">Ошибка: {error}</div>;
  }

  return (
    <div className="price-table">
      {/* Фильтр по категориям */}
      <div className="price-table__filters">
        <button
          className={`price-table__filter-btn ${selectedCategory === 'all' ? 'price-table__filter-btn--active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          Все категории
        </button>
        {categories.map(category => (
          <button
            key={category}
            className={`price-table__filter-btn ${selectedCategory === category ? 'price-table__filter-btn--active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Таблица на десктопе, карточки на мобильных */}
      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category} className="price-table__category">
          <h3 className="price-table__category-title">{category}</h3>
          
          {/* Десктопная версия - таблица */}
          <table className="price-table__table">
            <thead>
              <tr>
                <th>Услуга</th>
                <th>Цена</th>
                <th>Единица измерения</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{item.service}</td>
                  <td className="price-table__price">{item.price} ₽</td>
                  <td>{item.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Мобильная версия - карточки */}
          <div className="price-table__cards">
            {items.map(item => (
              <div key={item.id} className="price-table__card">
                <div className="price-table__card-service">{item.service}</div>
                <div className="price-table__card-details">
                  <span className="price-table__card-price">{item.price} ₽</span>
                  <span className="price-table__card-unit">{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filteredItems.length === 0 && (
        <div className="price-table__empty">
          Нет услуг в выбранной категории
        </div>
      )}
    </div>
  );
}