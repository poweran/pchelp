import { CSSProperties, ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const baseStyle: CSSProperties = {
    padding: '0.625rem 1.25rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    borderRadius: '0.375rem',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.6 : 1,
    ...getVariantStyles(variant),
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`button ${className}`}
      style={baseStyle}
      onMouseEnter={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, getHoverStyles(variant));
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, getVariantStyles(variant));
        }
      }}
    >
      {children}
    </button>
  );
}

function getVariantStyles(variant: 'primary' | 'secondary' | 'danger'): CSSProperties {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: '#2563eb',
        color: '#ffffff',
      };
    case 'secondary':
      return {
        backgroundColor: '#64748b',
        color: '#ffffff',
      };
    case 'danger':
      return {
        backgroundColor: '#ef4444',
        color: '#ffffff',
      };
  }
}

function getHoverStyles(variant: 'primary' | 'secondary' | 'danger'): CSSProperties {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: '#1d4ed8',
      };
    case 'secondary':
      return {
        backgroundColor: '#475569',
      };
    case 'danger':
      return {
        backgroundColor: '#dc2626',
      };
  }
}