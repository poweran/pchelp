import { memo, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
}

type SpinnerStyle = CSSProperties & {
  '--color-primary'?: string;
};

const Loading = memo<LoadingProps>(function Loading({
  size = 'medium',
  color = '#2563eb',
  text
}) {
  const { t } = useTranslation();
  const defaultText = text || t('common.loading');
  const spinnerStyle: SpinnerStyle = {
    '--color-primary': color,
  };

  return (
    <div className="loading-container">
      <div
        className={`loading-spinner ${size}`}
        style={spinnerStyle}
      >
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      <span className="loading-text">{defaultText}</span>
    </div>
  );
});

Loading.displayName = 'Loading';

export default Loading;

// CSS анимация спиннера (добавлена в index.css)
