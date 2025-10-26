import { memo } from 'react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
}

const Loading = memo<LoadingProps>(function Loading({
  size = 'medium',
  color = '#2563eb',
  text = 'Загрузка...'
}) {
  return (
    <div className="loading-container">
      <div
        className={`loading-spinner ${size}`}
        style={{
          borderColor: `${color}20`,
          borderTopColor: color,
        }}
      ></div>
      {text && <span className="loading-text">{text}</span>}
    </div>
  );
});

Loading.displayName = 'Loading';

export default Loading;

// CSS анимация спиннера (добавлена в index.css)