import React from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className={styles['modal-overlay']}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div className={styles['modal-content']}>
        {title && (
          <div className={styles['modal-header']}>
            <h2 id="modal-title" className={styles['modal-title']}>
              {title}
            </h2>
            <button
              type="button"
              className={styles['modal-close-button']}
              onClick={onClose}
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>
        )}
        <div className={styles['modal-body']}>
          {children}
        </div>
        {footer && (
          <div className={styles['modal-footer']}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;