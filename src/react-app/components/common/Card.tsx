import { CSSProperties, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

export default function Card({ 
  children, 
  className = '', 
  onClick,
  style: customStyle = {},
}: CardProps) {
  const isClickable = !!onClick;

  return (
    <div
      className={`card ${className}`}
      onClick={onClick}
      style={{
        ...cardStyle,
        ...(isClickable ? clickableCardStyle : {}),
        ...customStyle,
      }}
      onMouseEnter={(e) => {
        if (isClickable) {
          Object.assign(e.currentTarget.style, hoverCardStyle);
        }
      }}
      onMouseLeave={(e) => {
        if (isClickable) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)';
        }
      }}
    >
      {children}
    </div>
  );
}

const cardStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '0.5rem',
  padding: '1.5rem',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e2e8f0',
  transition: 'all 0.2s ease-in-out',
};

const clickableCardStyle: CSSProperties = {
  cursor: 'pointer',
};

const hoverCardStyle: CSSProperties = {
  transform: 'translateY(-2px)',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
};