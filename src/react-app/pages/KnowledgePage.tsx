import React, { useState, useMemo, CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { useKnowledge } from '../hooks/useKnowledge';
import { FAQItem } from '../components/knowledge/FAQItem';
import { ArticleCard } from '../components/knowledge/ArticleCard';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import type { KnowledgeItem, KnowledgeType } from '../types';
import './KnowledgePage.css';

type TabType = 'faq' | 'articles';

const KnowledgePage: React.FC = () => {
   const { t } = useTranslation();
   const { filteredItems, loading, error, searchByTitle, filterByType } = useKnowledge();
   // console.log('[KnowledgePage] Hook state:', { filteredItems: filteredItems.length, loading, error });
   const [activeTab, setActiveTab] = useState<TabType>('faq');
   const [searchQuery, setSearchQuery] = useState('');

  // Разделение элементов по типам
  const faqs = useMemo(() => {
    return filteredItems.filter((item: KnowledgeItem) => item.type === 'faq');
  }, [filteredItems]);

  const articles = useMemo(() => {
    return filteredItems.filter((item: KnowledgeItem) => item.type === 'article');
  }, [filteredItems]);

  // Обработка изменения поискового запроса
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    searchByTitle(value);
  };

  // Обработка изменения активной вкладки
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    const type: KnowledgeType = tab === 'faq' ? 'faq' : 'article';
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
                      <FAQItem key={item.id} item={item} />
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
                      <ArticleCard key={item.id} article={item} />
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