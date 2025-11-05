// Компонент для отображения карточки статьи

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import type { KnowledgeItem } from '../../types';
import './ArticleCard.css';

interface ArticleCardProps {
  article: KnowledgeItem;
}

export function ArticleCard({ article }: ArticleCardProps) {
   const { t } = useTranslation();
   const [isExpanded, setIsExpanded] = useState(false);

  // Получаем превью контента (первые 150 символов)
  const previewLength = 150;
  const preview = article.content.length > previewLength
    ? `${article.content.substring(0, previewLength)}...`
    : article.content;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="article-card">
      <div className="article-card__header">
        <h3 className="article-card__title">{article.title}</h3>
        {article.category && (
          <span className="article-card__category">{article.category}</span>
        )}
      </div>
      
      <div className="article-card__body">
        <div className="article-card__content">
          {isExpanded ? (
            <ReactMarkdown>{article.content}</ReactMarkdown>
          ) : (
            <ReactMarkdown>{preview}</ReactMarkdown>
          )}
        </div>
      </div>
      
      <div className="article-card__footer">
        {article.content.length > previewLength && (
          <button
            className="article-card__button"
            onClick={toggleExpanded}
          >
            {isExpanded ? t('knowledgePage.articleCard.collapse') : t('knowledgePage.articleCard.readMore')}
          </button>
        )}
      </div>
    </div>
  );
}