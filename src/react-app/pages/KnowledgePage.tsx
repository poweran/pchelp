import React, { useState, useMemo, CSSProperties, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { navigate } from '../utils/router';
import { useKnowledge } from '../hooks/useKnowledge';
import { FAQItem } from '../components/knowledge/FAQItem';
import { ArticleCard } from '../components/knowledge/ArticleCard';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import type { KnowledgeItem, KnowledgeType } from '../types';
import './KnowledgePage.css';

type TabType = 'faq' | 'articles' | 'guides';

interface KnowledgePageProps {
  initialId?: string;
}

const KnowledgePage: React.FC<KnowledgePageProps> = ({ initialId }) => {
  const { t } = useTranslation();
  const { filteredItems, loading, error, searchByTitle, filterByType } = useKnowledge();
  // console.log('[KnowledgePage] Hook state:', { filteredItems: filteredItems.length, loading, error });
  const [activeTab, setActiveTab] = useState<TabType>('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [targetId, setTargetId] = useState<string | null>(initialId || null);

  // Обновляем targetId если меняется initialId (навигация)
  useEffect(() => {
    setTargetId(initialId || null);
  }, [initialId]);

  // Обработка диплинков
  useEffect(() => {
    if (loading || filteredItems.length === 0 || !targetId) return;

    const item = filteredItems.find(i => i.id.toString() === targetId);

    if (item) {
      // Переключаем вкладку
      if (item.type === 'faq') {
        setActiveTab('faq');
        // Важно: если мы уже фильтруем, это может сбросить список. 
        // Если мы хотим показать именно этот элемент, можно не фильтровать, 
        // но тогда вкладка должна соответствовать.
        filterByType('faq');
      } else if (item.type === 'guide') {
        setActiveTab('guides');
        filterByType('guide');
      } else {
        setActiveTab('articles');
        filterByType('article');
      }

      // Скролл к элементу после рендера
      setTimeout(() => {
        const elementId = item.type === 'faq' ? `faq-${item.id}` : `article-${item.id}`;
        const element = document.getElementById(elementId);
        if (element) {
          // Вычисляем позицию с учетом отступа заголовка и контролов
          // 57px header + 81px controls + 22px padding
          const headerOffset = 160;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 500); // Увеличил задержку чтобы убедиться что контент отрисовался
    }
  }, [loading, filteredItems, filterByType, targetId]);

  // Разделение элементов по типам
  const faqs = useMemo(() => {
    return filteredItems.filter((item: KnowledgeItem) => item.type === 'faq');
  }, [filteredItems]);

  const articles = useMemo(() => {
    return filteredItems.filter((item: KnowledgeItem) => item.type === 'article');
  }, [filteredItems]);

  const guides = useMemo(() => {
    return filteredItems.filter((item: KnowledgeItem) => item.type === 'guide');
  }, [filteredItems]);

  // Обработка изменения поискового запроса
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    searchByTitle(value);
  };

  // Обработка изменения активной вкладки
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    let type: KnowledgeType;
    if (tab === 'faq') type = 'faq';
    else if (tab === 'guides') type = 'guide';
    else type = 'article';
    filterByType(type);
  };

  // Группировка FAQ по категориям
  const groupedFaqs = useMemo(() => {
    const groups: Record<string, KnowledgeItem[]> = {};
    faqs.forEach((faq: KnowledgeItem) => {
      if (!groups[faq.category]) {
        groups[faq.category] = [];
      }
      groups[faq.category].push(faq);
    });
    return groups;
  }, [faqs]);

  // Группировка статей по категориям
  const groupedArticles = useMemo(() => {
    const groups: Record<string, KnowledgeItem[]> = {};
    articles.forEach((article: KnowledgeItem) => {
      if (!groups[article.category]) {
        groups[article.category] = [];
      }
      groups[article.category].push(article);
    });
    return groups;
  }, [articles]);

  // Группировка руководств по категориям
  const groupedGuides = useMemo(() => {
    const groups: Record<string, KnowledgeItem[]> = {};
    guides.forEach((guide: KnowledgeItem) => {
      if (!groups[guide.category]) {
        groups[guide.category] = [];
      }
      groups[guide.category].push(guide);
    });
    return groups;
  }, [guides]);

  // Обработка переключения элемента (открытие/закрытие)
  const handleToggleItem = (itemId: string | number) => {
    const id = itemId.toString();
    // Если кликнули по уже открытому элементу - закрываем (переходим в корень раздела)
    if (targetId === id) {
      navigate('/knowledge', { skipScroll: true });
    } else {
      // Иначе открываем новый элемент
      navigate(`/knowledge/${id}`, { skipScroll: true });
    }
  };

  // console.log('[KnowledgePage] Loading state:', loading, 'Error:', error);

  if (loading) {
    return (
      <div className="knowledge-page">
        <Loading />
      </div>
    );
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
      <div className="knowledge-page">
        <div style={errorStyle}>
          <span style={errorIconStyle}>⚠️</span>
          <div>
            <h3 style={errorTitleStyle}>{t('knowledgePage.errorTitle')}</h3>
            <p style={errorMessageStyle}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="knowledge-page">
      <header className="knowledge-header hero">
        <h1>{t('knowledgePage.title')}</h1>
        <p className="subtitle">{t('knowledgePage.subtitle')}</p>
      </header>

      <div className="knowledge-controls">
        <div className="tabs">
          <Button
            onClick={() => handleTabChange('faq')}
            variant={activeTab === 'faq' ? 'primary' : 'secondary'}
          >
            {t('knowledgePage.tabFaq')}
          </Button>
          <Button
            onClick={() => handleTabChange('articles')}
            variant={activeTab === 'articles' ? 'primary' : 'secondary'}
          >
            {t('knowledgePage.tabArticles')}
          </Button>
          <Button
            onClick={() => handleTabChange('guides')}
            variant={activeTab === 'guides' ? 'primary' : 'secondary'}
          >
            {t('knowledgePage.tabGuides', 'Руководства')}
          </Button>
        </div>

        <div className="search-box">
          <Input
            type="text"
            placeholder={`🔍 ${t('knowledgePage.searchPlaceholder')}`}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="knowledge-content">
        {activeTab === 'faq' && (
          <div className="faq-section">
            {Object.keys(groupedFaqs).length === 0 ? (
              <div className="empty-state">
                {t('knowledgePage.emptyState', { query: searchQuery })}
              </div>
            ) : (
              Object.entries(groupedFaqs).map(([category, items]) => (
                <div key={category} className="category-group">
                  <h2 className="category-title">{category}</h2>
                  <div className="faq-list">
                    {items.map((item: KnowledgeItem) => (
                      <FAQItem
                        key={item.id}
                        item={item}
                        isOpen={targetId === item.id.toString()}
                        onToggle={() => handleToggleItem(item.id)}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="articles-section">
            {Object.keys(groupedArticles).length === 0 ? (
              <div className="empty-state">
                {t('knowledgePage.emptyState', { query: searchQuery })}
              </div>
            ) : (
              Object.entries(groupedArticles).map(([category, items]) => (
                <div key={category} className="category-group">
                  <h2 className="category-title">{category}</h2>
                  <div className="articles-grid">
                    {items.map((item: KnowledgeItem) => (
                      <ArticleCard
                        key={item.id}
                        article={item}
                        isExpanded={targetId === item.id.toString()}
                        onToggle={() => handleToggleItem(item.id)}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'guides' && (
          <div className="guides-section">
            {Object.keys(groupedGuides).length === 0 ? (
              <div className="empty-state">
                {t('knowledgePage.emptyState', { query: searchQuery })}
              </div>
            ) : (
              Object.entries(groupedGuides).map(([category, items]) => (
                <div key={category} className="category-group">
                  <h2 className="category-title">{category}</h2>
                  <div className="articles-grid">
                    {items.map((item: KnowledgeItem) => (
                      <ArticleCard
                        key={item.id}
                        article={item}
                        isExpanded={targetId === item.id.toString()}
                        onToggle={() => handleToggleItem(item.id)}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgePage;