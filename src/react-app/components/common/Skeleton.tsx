import { CSSProperties } from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
}

export default function Skeleton({
  width = '100%',
  height = '1rem',
  borderRadius = '4px',
  className = '',
  variant = 'rectangular',
}: SkeletonProps) {
  const getVariantStyles = (): CSSProperties => {
    switch (variant) {
      case 'text':
        return {
          width,
          height: '1rem',
          borderRadius: '4px',
        };
      case 'circular':
        return {
          width: height,
          height: height,
          borderRadius: '50%',
        };
      case 'rectangular':
      default:
        return {
          width,
          height,
          borderRadius,
        };
    }
  };

  return (
    <div
      className={`skeleton ${className}`}
      style={{
        ...skeletonStyle,
        ...getVariantStyles(),
      }}
    />
  );
}

// Групповой компонент для скелетонов
interface SkeletonGroupProps {
  count?: number;
  children: React.ReactNode;
  gap?: string | number;
}

export function SkeletonGroup({ count = 1, children, gap = '0.5rem' }: SkeletonGroupProps) {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div key={index} style={{ marginBottom: index < count - 1 ? gap : 0 }}>
      {children}
    </div>
  ));

  return <div style={skeletonGroupStyle}>{skeletons}</div>;
}

// Стили
const skeletonStyle: CSSProperties = {
  backgroundColor: '#f1f5f9',
  animation: 'pulse 1.5s ease-in-out infinite',
  display: 'inline-block',
};

const skeletonGroupStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

// Добавить в CSS анимацию pulse
// @keyframes pulse {
//   0% { opacity: 1; }
//   50% { opacity: 0.5; }
//   100% { opacity: 1; }
// }