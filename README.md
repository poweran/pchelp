# PC Help - Профессиональная компьютерная помощь

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/vite-react-template)

Полнофункциональное React-приложение для оказания компьютерной помощи, развернутое на Cloudflare Workers. Приложение включает каталог услуг, систему заявок, базу знаний и административный интерфейс.

![React + TypeScript + Vite + Cloudflare Workers](https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/fc7b4b62-442b-4769-641b-ad4422d74300/public)

## 🚀 Технологии

- [**React 19**](https://react.dev/) - Современная UI-библиотека с новыми возможностями
- [**Vite**](https://vite.dev/) - Быстрый инструмент сборки и сервер разработки
- [**Hono**](https://hono.dev/) - Легковесный backend-фреймворк
- [**Cloudflare Workers**](https://developers.cloudflare.com/workers/) - Платформа edge computing
- [**TypeScript**](https://www.typescriptlang.org/) - Типизированный JavaScript

## ✨ Ключевые возможности

### Для клиентов:
- 📋 Каталог услуг с подробным описанием и ценами
- 🎫 Создание заявок на ремонт/обслуживание
- 📚 База знаний с FAQ и статьями
- 📞 Контактная информация и режим работы

### Для администраторов:
- 👥 Управление заявками (создание, просмотр, обновление статуса)
- 📊 Статистика и аналитика
- ⚙️ Настройки системы

### Технические особенности:
- 🔥 Hot Module Replacement для быстрой разработки
- 📱 Адаптивный дизайн (mobile-first)
- ♿ Полная доступность (accessibility)
- ⚡ Оптимизированная производительность
- 🔒 TypeScript для типобезопасности
- 🛠️ ESLint для качества кода
- 🔄 Полнофункциональный API с Hono
- 📊 Встроенная наблюдаемость

<!-- dash-content-end -->

## 🚀 Быстрый старт

### Установка зависимостей

```bash
npm install
```

### Запуск в режиме разработки

```bash
npm run dev
```

Приложение будет доступно по адресу: [http://localhost:5173](http://localhost:5173)

### Сборка для продакшена

```bash
npm run build
```

### Локальный просмотр сборки

```bash
npm run preview
```

### Деплой на Cloudflare Workers

```bash
npm run deploy
```

### Мониторинг воркеров

```bash
npx wrangler tail
```

## 📋 API Endpoints

### Услуги
- `GET /api/services` - Список всех услуг
- `GET /api/services/:id` - Детали конкретной услуги

### Заявки
- `POST /api/tickets` - Создание новой заявки
- `GET /api/tickets` - Список всех заявок
- `GET /api/tickets/:id` - Детали заявки
- `PUT /api/tickets/:id` - Обновление статуса заявки

### Прайс-лист
- `GET /api/pricing` - Весь прайс-лист с фильтрацией

### База знаний
- `GET /api/knowledge` - Список записей базы знаний
- `GET /api/knowledge/:id` - Конкретная запись

## Development

Install dependencies:

```bash
npm install
```

Start the development server with:

```bash
npm run dev
```

Your application will be available at [http://localhost:5173](http://localhost:5173).

## Production

Build your project for production:

```bash
npm run build
```

Preview your build locally:

```bash
npm run preview
```

Deploy your project to Cloudflare Workers:

```bash
npm run build && npm run deploy
```

Monitor your workers:

```bash
npx wrangler tail
```

## 🏗️ Архитектура проекта

```
src/
├── react-app/                 # React frontend
│   ├── components/
│   │   ├── common/           # Переиспользуемые компоненты
│   │   │   ├── Button.tsx    # Кнопка с оптимизациями
│   │   │   ├── Input.tsx     # Поле ввода с валидацией
│   │   │   ├── Card.tsx      # Карточка с доступностью
│   │   │   ├── Loading.tsx   # Компонент загрузки
│   │   │   └── ErrorBoundary.tsx # Обработка ошибок
│   │   ├── services/         # Компоненты услуг
│   │   └── tickets/          # Компоненты заявок
│   ├── pages/                # Страницы приложения
│   ├── hooks/                # Custom hooks
│   ├── utils/                # Утилиты
│   └── types/                # TypeScript типы
└── worker/                   # Cloudflare Worker backend
    └── index.ts              # API endpoints
```

## 🎯 Оптимизации производительности

- **React.memo** - Предотвращает ненужные перерендеры
- **useCallback** - Мемоизация функций в пропсах
- **useMemo** - Кеширование тяжелых вычислений
- **Lazy loading** - Отложенная загрузка страниц
- **Code splitting** - Разделение кода на чанки
- **Error Boundaries** - Изоляция ошибок компонентов

## ♿ Доступность (Accessibility)

- ARIA labels для интерактивных элементов
- Semantic HTML структура
- Keyboard navigation поддержка
- Focus management
- Screen reader оптимизация

## 🔧 Используемые инструменты

- **ESLint** - Линтер для качества кода
- **TypeScript** - Типизация для надежности
- **CSS Modules** - Модульный CSS
- **CSS Variables** - Темизация с переменными

## 📚 Документация

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Vite](https://vitejs.dev/guide/)
- [React 19](https://reactjs.org/)
- [Hono](https://hono.dev/)
- [TypeScript](https://www.typescriptlang.org/)

---

*Приложение готово к продакшену и деплою на Cloudflare Workers*
