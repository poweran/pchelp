import { ReactNode, memo, useCallback } from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'warning' | 'danger';
  size?: 'small' | 'medium';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  iconOnly?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  title?: string;
}

const Button = memo<ButtonProps>(function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  iconOnly = false,
  type = 'button',
  className = '',
  title,
}) {
  const handleClick = useCallback(() => {
    if (onClick && !disabled && !loading) {
      onClick();
    }
  }, [onClick, disabled, loading]);
  const buttonClasses = [
    styles.button,
    styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`],
    fullWidth && styles.buttonFull,
    iconOnly && styles.buttonIcon,
    loading && styles.buttonLoading,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={buttonClasses}
      aria-label={loading ? 'Загрузка...' : undefined}
      title={title}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;