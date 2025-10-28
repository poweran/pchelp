/**
 * Простой роутер на основе History API
 */

// Тип для колбэков при изменении маршрута
type RouteChangeListener = (path: string) => void;

// Массив слушателей изменений маршрута
const listeners: Set<RouteChangeListener> = new Set();

/**
 * Получает текущий путь из URL
 */
export function getCurrentPath(): string {
  return window.location.pathname;
}

/**
 * Программная навигация к новому пути
 * @param path - Путь для навигации
 * @param replace - Заменить текущую запись в истории вместо добавления новой
 */
export function navigate(path: string, replace: boolean = false): void {
  // Проверяем, не находимся ли мы уже на этом пути
  if (path === getCurrentPath()) {
    return;
  }

  // Используем History API для изменения URL без перезагрузки страницы
  if (replace) {
    window.history.replaceState({}, '', path);
  } else {
    window.history.pushState({}, '', path);
  }

  // Уведомляем всех слушателей об изменении маршрута
  notifyListeners(path);
}

/**
 * Добавляет слушателя изменений маршрута
 * @param listener - Функция-колбэк для вызова при изменении маршрута
 * @returns Функция для отписки от событий
 */
export function addRouteChangeListener(listener: RouteChangeListener): () => void {
  listeners.add(listener);
  
  // Возвращаем функцию для отписки
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Уведомляет всех слушателей об изменении маршрута
 */
function notifyListeners(path: string): void {
  listeners.forEach(listener => listener(path));
  // Сбрасываем скролл на начало страницы при изменении маршрута
  window.scrollTo(0, 0);
}

/**
 * Инициализация роутера - настройка обработчиков браузерных событий
 */
export function initRouter(): () => void {
  // Обработчик для кнопок "Назад" и "Вперёд" браузера
  const handlePopState = () => {
    notifyListeners(getCurrentPath());
  };

  window.addEventListener('popstate', handlePopState);

  // Возвращаем функцию очистки
  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
}