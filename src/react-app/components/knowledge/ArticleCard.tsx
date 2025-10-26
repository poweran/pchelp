// Компонент для отображения карточки статьи

import { useState } from 'react';
import type { KnowledgeItem } from '../../types';
import './ArticleCard.css';

interface ArticleCardProps {
  article: KnowledgeItem;
}

export function ArticleCard({ article }: ArticleCardProps) {
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
        <p className="article-card__content">
          {isExpanded ? article.content : preview}
        </p>
      </div>
      
      <div className="article-card__footer">
        {article.content.length > previewLength && (
          <button
            className="article-card__button"
            onClick={toggleExpanded}
          >
            {isExpanded ? 'Свернуть' : 'Читать полностью'}
          </button>
        )}
      </div>
    </div>
  );
}