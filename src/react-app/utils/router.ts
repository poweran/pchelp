/**
 * Простой роутер на основе History API
 */

// Тип для колбэков при изменении маршрута
type RouteChangeListener = (path: string) => void;

type NavigateOptions = {
  replace?: boolean;
  skipScroll?: boolean;
};

// Массив слушателей изменений маршрута
const listeners: Set<RouteChangeListener> = new Set();

/**
 * Получает текущий путь из URL
 */
export function getCurrentPath(): string {
  return window.location.pathname;
}

let pendingScrollBehavior: 'top' | 'none' | null = null;

/**
 * Программная навигация к новому пути
 * @param path - Путь для навигации
 * @param replaceOrOptions - Флаг замены записи в истории или объект опций
 */
export function navigate(path: string, replaceOrOptions: boolean | NavigateOptions = false): void {
  // Проверяем, не находимся ли мы уже на этом пути
  if (path === getCurrentPath()) {
    return;
  }

  const options: NavigateOptions =
    typeof replaceOrOptions === 'boolean'
      ? { replace: replaceOrOptions }
      : replaceOrOptions;
  const { replace = false, skipScroll = false } = options;

  pendingScrollBehavior = skipScroll ? 'none' : 'top';

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
  if (pendingScrollBehavior === 'none') {
    pendingScrollBehavior = null;
    return;
  }

  window.scrollTo(0, 0);
  pendingScrollBehavior = null;
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
