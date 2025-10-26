// Компонент для отображения FAQ элемента с accordion-стилем

import { useState } from 'react';
import type { KnowledgeItem } from '../../types';
import './FAQItem.css';

interface FAQItemProps {
  item: KnowledgeItem;
}

export function FAQItem({ item }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}>
      <button
        className="faq-item__header"
        onClick={toggleOpen}
        aria-expanded={isOpen}
      >
        <h3 className="faq-item__title">{item.title}</h3>
        <span className="faq-item__icon" aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      
      <div className={`faq-item__content ${isOpen ? 'faq-item__content--open' : ''}`}>
        <div className="faq-item__content-inner">
          <p>{item.content}</p>
        </div>
      </div>
    </div>
  );
}