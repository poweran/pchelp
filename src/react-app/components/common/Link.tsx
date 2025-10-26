import { ReactNode, MouseEvent, useState, useEffect } from 'react';
import { navigate, getCurrentPath, addRouteChangeListener } from '../../utils/router';

/**
 * Props для Link компонента
 */
interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  style?: React.CSSProperties;
}

/**
 * Компонент Link для навигации без перезагрузки страницы
 * Использует History API через функцию navigate
 */
export function Link({
  to,
  children,
  className = '',
  activeClassName = '',
  style = {}
}: LinkProps) {
  const [currentPath, setCurrentPath] = useState<string>(getCurrentPath());

  useEffect(() => {
    // Подписываемся на изменения маршрута
    const unsubscribe = addRouteChangeListener((path: string) => {
      setCurrentPath(path);
    });

    // Очистка при размонтировании
    return unsubscribe;
  }, []);

  const isActive = currentPath === to;

  // console.log(`[Link] Путь "${to}" - текущий путь: "${currentPath}", isActive: ${isActive}`);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Предотвращаем стандартное поведение ссылки (перезагрузку страницы)
    e.preventDefault();

    // Используем нашу функцию navigate для программной навигации
    navigate(to);
  };

  // Формируем финальный класс с учётом активного состояния
  const finalClassName = `${className} ${isActive ? activeClassName : ''}`.trim();

  return (
    <a 
      href={to} 
      onClick={handleClick}
      className={finalClassName}
      style={style}
    >
      {children}
    </a>
  );
}