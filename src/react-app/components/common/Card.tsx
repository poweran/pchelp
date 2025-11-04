import { CSSProperties, ReactNode, memo, useCallback } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
  role?: string;
}

const Card = memo<CardProps>(function Card({
  children,
  className = '',
  onClick,
  style: customStyle = {},
  role,
}) {
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);
  const isClickable = !!onClick;

  return (
    <div
      className={`card ${className}`}
      onClick={handleClick}
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
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.filter = 'none';
          e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)';
        }
      }}
      role={role || (isClickable ? 'button' : 'article')}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;

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
  transform: 'scale(1.05)',
  filter: 'brightness(1.2) contrast(1.1) saturate(1.3)',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
};
