import { useState, useEffect, ReactElement } from 'react';
import { getCurrentPath, addRouteChangeListener, initRouter } from '../../utils/router';

/**
 * Тип для конфигурации маршрутов
 */
export interface RouteConfig {
  [path: string]: () => ReactElement;
}

/**
 * Props для Router компонента
 */
interface RouterProps {
  routes: RouteConfig;
  notFoundComponent?: () => ReactElement;
}

/**
 * Компонент Router для клиентской маршрутизации
 * Отслеживает текущий путь и рендерит соответствующий компонент
 */
export function Router({ routes, notFoundComponent }: RouterProps): ReactElement {
  const [currentPath, setCurrentPath] = useState<string>(getCurrentPath());

  useEffect(() => {
    // Инициализируем роутер (обработчик popstate)
    const cleanupRouter = initRouter();

    // Подписываемся на изменения маршрута
    const unsubscribe = addRouteChangeListener((path: string) => {
      console.log('[Router] Route changed to:', path);
      setCurrentPath(path);
    });

    // Очистка при размонтировании
    return () => {
      cleanupRouter();
      unsubscribe();
    };
  }, []);

  // Находим компонент для текущего пути
  const routeComponent = routes[currentPath];

  // Если маршрут найден, рендерим соответствующий компонент
  if (routeComponent) {
    return routeComponent();
  }

  // Если маршрут не найден, рендерим 404 компонент или сообщение по умолчанию
  if (notFoundComponent) {
    return notFoundComponent();
  }

  // Дефолтная страница 404
  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '4rem', margin: '0' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginTop: '1rem' }}>Страница не найдена</h2>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        Запрашиваемая страница "{currentPath}" не существует.
      </p>
    </div>
  );
}