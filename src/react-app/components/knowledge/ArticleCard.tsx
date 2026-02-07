// Компонент для отображения карточки статьи

import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { CodeBlock } from '../common/CodeBlock';
import type { KnowledgeItem } from '../../types';
import './ArticleCard.css';

interface ArticleCardProps {
  article: KnowledgeItem;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ArticleCard({ article, isExpanded, onToggle }: ArticleCardProps) {
  const { t } = useTranslation();

  // Получаем превью контента (первые 150 символов)
  const previewLength = 150;
  const preview = article.content.length > previewLength
    ? `${article.content.substring(0, previewLength)}...`
    : article.content;

  return (
    <div id={`article-${article.id}`} className="article-card">
      <div className="article-card__header">
        <h3 className="article-card__title">{article.title}</h3>
        {article.category && (
          <span className="article-card__category">{article.category}</span>
        )}
      </div>

      <div className="article-card__body">
        <div className="article-card__content">
          {isExpanded ? (
            <ReactMarkdown
              components={{
                code({ inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  return (
                    <CodeBlock
                      inline={inline}
                      language={match ? match[1] : undefined}
                      value={String(children).replace(/\n$/, '')}
                      className={className}
                      {...props}
                    />
                  );
                },
              }}
            >
              {article.content}
            </ReactMarkdown>
          ) : (
            <ReactMarkdown>{preview}</ReactMarkdown>
          )}
        </div>
      </div>

      <div className="article-card__footer">
        {article.content.length > previewLength && (
          <button
            className="article-card__button"
            onClick={onToggle}
          >
            {isExpanded ? t('knowledgePage.articleCard.collapse') : t('knowledgePage.articleCard.readMore')}
          </button>
        )}
      </div>
    </div>
  );
}