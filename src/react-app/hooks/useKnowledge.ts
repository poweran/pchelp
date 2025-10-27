// Хук для работы с базой знаний

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchKnowledge, fetchKnowledgeById } from '../utils/api';
import type { KnowledgeItem, KnowledgeType } from '../types';

interface UseKnowledgeResult {
  items: KnowledgeItem[];
  filteredItems: KnowledgeItem[];
  loading: boolean;
  error: string | null;
  searchByTitle: (query: string) => void;
  filterByType: (type: KnowledgeType | 'all') => void;
  getItemById: (id: string) => Promise<KnowledgeItem | null>;
}

export function useKnowledge(): UseKnowledgeResult {
  const { i18n } = useTranslation();
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<KnowledgeType | 'all'>('all');

  // Загрузка базы знаний при монтировании и изменении языка
  useEffect(() => {
    loadKnowledge();
  }, [i18n.language]);

  // Применение фильтров при изменении данных или фильтров
  useEffect(() => {
    applyFilters();
  }, [items, searchQuery, typeFilter]);

  // Функция для загрузки базы знаний
  const loadKnowledge = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchKnowledge(i18n.language);

      // console.log('[useKnowledge] Error loading data:', response.error);
      if (response.error) {
        // console.log('[useKnowledge] Error loading data:', response.error);
        setError(response.error);
        setItems([]);
        return;
      }

        // console.log('[useKnowledge] Setting items:', response.data);
      if (response.data) {
        // console.log('[useKnowledge] Data loaded:', response.data?.length, 'items');
        setItems(Array.isArray(response.data) ? response.data : []);
      } else {
        // console.log('[useKnowledge] No data in response');
        setError('Не удалось загрузить данные');
        setItems([]);
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Функция для применения фильтров
  const applyFilters = () => {
    if (!Array.isArray(items)) {
      // console.log('[useKnowledge] Items is not an array:', items);
      setFilteredItems([]);
      return;
    }
    let result = [...items];

    // Фильтрация по типу
    if (typeFilter !== 'all') {
      result = result.filter((item) => item.type === typeFilter);
    }

    // Поиск по заголовку
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) =>
        item.title.toLowerCase().includes(query)
      );
    }

    setFilteredItems(result);
  };

  // Функция для поиска по заголовкам
  const searchByTitle = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Функция для фильтрации по типу
  const filterByType = useCallback((type: KnowledgeType | 'all') => {
    setTypeFilter(type);
  }, []);

  // Функция для получения элемента по ID
  const getItemById = useCallback(async (id: string): Promise<KnowledgeItem | null> => {
    try {
      const response = await fetchKnowledgeById(id);
      return response.data || null;
    } catch (err) {
      console.error('Error fetching knowledge item:', err);
      return null;
    }
  }, []);

  return {
    items,
    filteredItems,
    loading,
    error,
    searchByTitle,
    filterByType,
    getItemById,
  };
}