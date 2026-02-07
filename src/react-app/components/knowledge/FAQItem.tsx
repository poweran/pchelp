// Компонент для отображения FAQ элемента с accordion-стилем

import ReactMarkdown from 'react-markdown';
import { CodeBlock } from '../common/CodeBlock';
import type { KnowledgeItem } from '../../types';
import './FAQItem.css';

interface FAQItemProps {
  item: KnowledgeItem;
  isOpen: boolean;
  onToggle: () => void;
}

export function FAQItem({ item, isOpen, onToggle }: FAQItemProps) {
  return (
    <div id={`faq-${item.id}`} className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}>
      <button
        className="faq-item__header"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <h3 className="faq-item__title">{item.title}</h3>
        <span className="faq-item__icon" aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      <div className={`faq-item__content ${isOpen ? 'faq-item__content--open' : ''}`}>
        <div className="faq-item__content-inner">
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
            {item.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}