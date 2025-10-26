# План разработки портала компьютерной помощи

## Описание проекта
Портал компьютерной помощи - веб-приложение для предоставления услуг технической поддержки и ремонта компьютерной техники.

## Технологический стек
- **Frontend**: React 19, TypeScript, CSS
- **Backend**: Hono (API framework)
- **Deployment**: Cloudflare Workers
- **Build Tool**: Vite

## Функциональные возможности

### 1. Главная страница
- Описание услуг компании
- Основные направления помощи
- Контактная информация
- Форма быстрой заявки

### 2. Каталог услуг
- Ремонт компьютеров и ноутбуков
- Настройка ПО и ОС
- Восстановление данных
- Удаление вирусов
- Апгрейд оборудования
- Консультации
- Каждая услуга с описанием и примерной стоимостью

### 3. Система заявок
- Форма создания заявки с полями:
  - Имя клиента
  - Контактный телефон
  - Email
  - Тип проблемы (выбор из списка)
  - Описание проблемы
  - Приоритет (обычный/срочный)
- Отображение статуса заявки
- Список всех заявок (админ панель)

### 4. База знаний
- Частые вопросы и ответы (FAQ)
- Статьи с инструкциями
- Советы по профилактике
- Поиск по базе знаний

### 5. Прайс-лист
- Таблица с услугами и ценами
- Фильтрация по категориям
- Калькулятор стоимости

### 6. Контакты
- Адрес офиса
- Телефоны
- Email
- График работы
- Карта проезда (embed)

## Архитектура приложения

### Frontend структура
```
src/react-app/
├── components/
│   ├── common/          # Общие компоненты
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   ├── services/        # Компоненты услуг
│   │   ├── ServiceCard.tsx
│   │   └── ServiceList.tsx
│   ├── tickets/         # Компоненты заявок
│   │   ├── TicketForm.tsx
│   │   ├── TicketCard.tsx
│   │   └── TicketList.tsx
│   ├── knowledge/       # База знаний
│   │   ├── FAQItem.tsx
│   │   └── ArticleCard.tsx
│   └── pricing/         # Прайс-лист
│       └── PriceTable.tsx
├── pages/               # Страницы
│   ├── HomePage.tsx
│   ├── ServicesPage.tsx
│   ├── TicketsPage.tsx
│   ├── KnowledgePage.tsx
│   ├── PricingPage.tsx
│   └── ContactsPage.tsx
├── hooks/               # Custom hooks
│   ├── useTickets.ts
│   └── useServices.ts
├── types/               # TypeScript типы
│   └── index.ts
└── utils/               # Утилиты
    └── api.ts
```

### Backend API endpoints
```
GET  /api/services          # Список услуг
GET  /api/services/:id      # Детали услуги

POST /api/tickets           # Создать заявку
GET  /api/tickets           # Список заявок
GET  /api/tickets/:id       # Детали заявки
PUT  /api/tickets/:id       # Обновить статус

GET  /api/knowledge         # База знаний
GET  /api/knowledge/:id     # Статья

GET  /api/pricing           # Прайс-лист
```

## План имплементации (пошаговый)

### Этап 1: Базовая настройка
1. Изучить текущую структуру App.tsx и worker/index.ts
2. Создать типы TypeScript для данных
3. Настроить базовую структуру папок

### Этап 2: Backend API
4. Реализовать endpoints для услуг в Hono worker
5. Реализовать endpoints для заявок
6. Реализовать endpoints для базы знаний
7. Реализовать endpoints для прайс-листа

### Этап 3: Общие компоненты
8. Создать Header компонент
9. Создать Footer компонент
10. Создать переиспользуемые компоненты (Button, Input, Card)

### Этап 4: Основные страницы
11. Реализовать HomePage с главной информацией
12. Реализовать ServicesPage со списком услуг
13. Реализовать TicketsPage с формой и списком заявок
14. Реализовать KnowledgePage с FAQ и статьями
15. Реализовать PricingPage с прайс-листом
16. Реализовать ContactsPage с контактами

### Этап 5: Маршрутизация
17. Настроить клиентскую маршрутизацию между страницами
18. Добавить навигационное меню

### Этап 6: Стейт-менеджмент
19. Реализовать custom hooks для работы с API
20. Настроить управление состоянием форм

### Этап 7: Стилизация
21. Создать общую CSS структуру и переменные
22. Стилизовать все компоненты
23. Адаптировать под мобильные устройства

### Этап 8: Тестирование и оптимизация
24. Протестировать все функции
25. Оптимизировать производительность
26. Проверить работу на Cloudflare Workers

## Минималистичный подход

### Принципы
- Использовать нативные возможности React (useState, useEffect) без внешних библиотек стейт-менеджмента
- CSS без фреймворков (чистый CSS с CSS-переменными)
- Минимальный набор зависимостей
- Простой и понятный код
- Компонентный подход с переиспользованием
- Типизация TypeScript для всех данных

### Структура данных

```typescript
interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
}

interface Ticket {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  serviceType: string;
  description: string;
  priority: 'normal' | 'urgent';
  status: 'new' | 'in-progress' | 'completed';
  createdAt: string;
}

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  type: 'faq' | 'article';
}

interface PriceItem {
  id: string;
  service: string;
  price: string;
  category: string;
  unit: string;
}
```

## Дизайн-система

### Цветовая палитра
- Primary: #2563eb (синий)
- Secondary: #64748b (серый)
- Success: #22c55e (зеленый)
- Warning: #f59e0b (оранжевый)
- Danger: #ef4444 (красный)
- Background: #ffffff
- Text: #1e293b

### Типографика
- Заголовки: system-ui шрифт
- Основной текст: 16px
- Малый текст: 14px

### Компоненты
- Карточки с тенью
- Кнопки с hover эффектами
- Формы с валидацией
- Responsive дизайн (mobile-first)

## Особенности Cloudflare Workers
- Stateless архитектура
- Хранение данных в KV или D1 (для production)
- Для MVP - in-memory хранилище
- Быстрый старт и масштабирование

## Метрики успеха
- Время загрузки < 2 секунд
- Адаптивность на всех устройствах
- Простота использования форм
- Минимальный размер бандла