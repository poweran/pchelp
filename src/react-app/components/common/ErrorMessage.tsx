import { CSSProperties } from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorMessage({ message, onRetry, className = '' }: ErrorMessageProps) {
  return (
    <div className={`error-message ${className}`} style={containerStyle}>
      <div style={contentStyle}>
        <span style={iconStyle}>⚠️</span>
        <div style={textContainerStyle}>
          <p style={messageStyle}>{message}</p>
          {onRetry && (
            <button onClick={onRetry} style={retryButtonStyle}>
              Попробовать снова
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Стили компонента
const containerStyle: CSSProperties = {
  padding: '1rem',
  marginBottom: '1rem',
};

const contentStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.75rem',
  padding: '1rem',
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '0.5rem',
  color: '#dc2626',
};

const iconStyle: CSSProperties = {
  fontSize: '1.25rem',
  flexShrink: 0,
};

const textContainerStyle: CSSProperties = {
  flex: 1,
};

const messageStyle: CSSProperties = {
  margin: 0,
  fontSize: '0.875rem',
  lineHeight: '1.5',
  color: '#dc2626',
};

const retryButtonStyle: CSSProperties = {
  marginTop: '0.5rem',
  padding: '0.375rem 0.75rem',
  fontSize: '0.75rem',
  fontWeight: 'bold',
  color: '#dc2626',
  backgroundColor: 'transparent',
  border: '1px solid #dc2626',
  borderRadius: '0.25rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};