import { Hono } from "hono";
import { cors } from "hono/cors";

// Импортируем типы
type ServiceCategory = 'repair' | 'setup' | 'recovery' | 'consultation';
type TicketPriority = 'low' | 'medium' | 'high';
type TicketStatus = 'new' | 'in-progress' | 'completed' | 'cancelled';
type KnowledgeType = 'faq' | 'article';

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: ServiceCategory;
}

interface PriceItem {
  id: string;
  service: string;
  price: number;
  category: string;
  unit: string;
}

interface Ticket {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  serviceType: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
}

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  type: KnowledgeType;
}


const app = new Hono<{ Bindings: Env }>();

// Добавляем CORS middleware
app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Моковые данные для услуг
const services: Service[] = [
  {
    id: 'srv-1',
    title: 'Ремонт ноутбуков',
    description: 'Профессиональный ремонт ноутбуков любой сложности. Диагностика, замена комплектующих, чистка от пыли.',
    price: 2500,
    category: 'repair'
  },
  {
    id: 'srv-2',
    title: 'Ремонт компьютеров',
    description: 'Ремонт настольных компьютеров. Замена комплектующих, модернизация, чистка системы охлаждения.',
    price: 2000,
    category: 'repair'
  },
  {
    id: 'srv-3',
    title: 'Настройка Windows',
    description: 'Установка и настройка операционной системы Windows. Установка драйверов, оптимизация системы.',
    price: 1500,
    category: 'setup'
  },
  {
    id: 'srv-4',
    title: 'Настройка сети',
    description: 'Настройка домашней или офисной сети. Настройка роутера, Wi-Fi, локальной сети.',
    price: 1800,
    category: 'setup'
  },
  {
    id: 'srv-5',
    title: 'Восстановление данных',
    description: 'Восстановление утерянных данных с жестких дисков, флешек, карт памяти.',
    price: 3500,
    category: 'recovery'
  },
  {
    id: 'srv-6',
    title: 'Удаление вирусов',
    description: 'Комплексная очистка системы от вирусов и вредоносного ПО. Установка антивируса.',
    price: 1200,
    category: 'recovery'
  },
  {
    id: 'srv-7',
    title: 'Консультация по выбору ПК',
    description: 'Помощь в подборе комплектующих для сборки компьютера под ваши задачи и бюджет.',
    price: 800,
    category: 'consultation'
  },
  {
    id: 'srv-8',
    title: 'IT-консультация',
    description: 'Консультация по любым вопросам, связанным с компьютерной техникой и программным обеспечением.',
    price: 1000,
    category: 'consultation'
  }
];

// Моковые данные для прайс-листа
const pricing: PriceItem[] = [
  {
    id: 'price-1',
    service: 'Диагностика компьютера',
    price: 500,
    category: 'Диагностика',
    unit: 'шт'
  },
  {
    id: 'price-2',
    service: 'Чистка ноутбука от пыли',
    price: 1200,
    category: 'Профилактика',
    unit: 'шт'
  },
  {
    id: 'price-3',
    service: 'Замена термопасты',
    price: 800,
    category: 'Профилактика',
    unit: 'шт'
  },
  {
    id: 'price-4',
    service: 'Установка Windows',
    price: 1000,
    category: 'Установка ПО',
    unit: 'шт'
  },
  {
    id: 'price-5',
    service: 'Установка драйверов',
    price: 500,
    category: 'Установка ПО',
    unit: 'комплект'
  },
  {
    id: 'price-6',
    service: 'Установка офисного пакета',
    price: 600,
    category: 'Установка ПО',
    unit: 'шт'
  },
  {
    id: 'price-7',
    service: 'Настройка роутера',
    price: 1000,
    category: 'Настройка сети',
    unit: 'шт'
  },
  {
    id: 'price-8',
    service: 'Прокладка сетевого кабеля',
    price: 150,
    category: 'Настройка сети',
    unit: 'м'
  },
  {
    id: 'price-9',
    service: 'Замена жесткого диска',
    price: 800,
    category: 'Замена комплектующих',
    unit: 'шт'
  },
  {
    id: 'price-10',
    service: 'Замена оперативной памяти',
    price: 500,
    category: 'Замена комплектующих',
    unit: 'планка'
  },
  {
    id: 'price-11',
    service: 'Замена матрицы ноутбука',
    price: 2500,
    category: 'Замена комплектующих',
    unit: 'шт'
  },
  {
    id: 'price-12',
    service: 'Восстановление данных (простое)',
    price: 2000,
    category: 'Восстановление данных',
    unit: 'устройство'
  }
];

// Моковые данные для базы знаний
const knowledgeBase: KnowledgeItem[] = [
  // FAQ
  {
    id: 'kb-faq-1',
    title: 'Как часто нужно чистить компьютер от пыли?',
    content: 'Рекомендуется проводить чистку компьютера от пыли каждые 6-12 месяцев, в зависимости от условий эксплуатации. Если компьютер находится в пыльном помещении или на полу, чистку следует проводить чаще. Признаки необходимости чистки: повышенный шум вентиляторов, перегрев компонентов, самопроизвольное выключение.',
    category: 'Обслуживание',
    type: 'faq'
  },
  {
    id: 'kb-faq-2',
    title: 'Что делать, если компьютер не включается?',
    content: 'Первым делом проверьте подключение к электросети и убедитесь, что розетка работает. Проверьте, горит ли индикатор питания на системном блоке. Если нет - проблема может быть в блоке питания. Если индикатор горит, но компьютер не запускается - возможны проблемы с материнской платой, процессором или оперативной памятью. В этом случае рекомендуется обратиться к специалисту.',
    category: 'Диагностика',
    type: 'faq'
  },
  {
    id: 'kb-faq-3',
    title: 'Как защитить компьютер от вирусов?',
    content: 'Для защиты от вирусов следуйте этим правилам: 1) Установите надежный антивирус и регулярно обновляйте его базы. 2) Держите операционную систему и программы в актуальном состоянии. 3) Не открывайте подозрительные письма и вложения. 4) Скачивайте программы только с официальных сайтов. 5) Используйте сложные пароли. 6) Регулярно делайте резервные копии важных данных.',
    category: 'Безопасность',
    type: 'faq'
  },
  {
    id: 'kb-faq-4',
    title: 'Сколько оперативной памяти нужно для нормальной работы?',
    content: 'Минимальные требования зависят от задач: для базовой работы (интернет, офисные программы) достаточно 8 ГБ; для мультимедиа и легких игр - 16 ГБ; для профессиональной работы с видео, 3D-графикой или современных игр на высоких настройках - 32 ГБ и более. Также важен тип памяти (DDR4/DDR5) и её частота.',
    category: 'Железо',
    type: 'faq'
  },
  {
    id: 'kb-faq-5',
    title: 'Как ускорить работу старого компьютера?',
    content: 'Способы ускорения старого компьютера: 1) Замените HDD на SSD - это даст максимальный прирост производительности. 2) Добавьте оперативной памяти до 8-16 ГБ. 3) Почистите систему от мусора и ненужных программ. 4) Отключите автозагрузку лишних приложений. 5) Обновите драйвера. 6) Переустановите операционную систему. 7) Почистите компьютер от пыли.',
    category: 'Оптимизация',
    type: 'faq'
  },
  // Статьи
  {
    id: 'kb-article-1',
    title: 'Выбор комплектующих для игрового ПК в 2025 году',
    content: 'Подробное руководство по выбору комплектующих для игрового компьютера. Процессор: рекомендуем Intel Core i5/i7 последних поколений или AMD Ryzen 5/7. Видеокарта: минимум RTX 4060 или RX 7600 для Full HD, RTX 4070 или выше для 2K/4K. Оперативная память: 16 ГБ DDR5 - минимум, 32 ГБ - оптимально. SSD: обязателен NVMe объемом от 500 ГБ для системы и игр. Блок питания: мощность от 650 Вт с сертификатом 80+ Gold. Охлаждение: башенный кулер от 120 мм или водяное охлаждение. Корпус: хорошая вентиляция и возможность прокладки кабелей за материнской платой.',
    category: 'Сборка ПК',
    type: 'article'
  },
  {
    id: 'kb-article-2',
    title: 'Правильная настройка Windows после установки',
    content: 'Пошаговая инструкция по настройке Windows после установки: 1) Обновите систему до последней версии через Windows Update. 2) Установите все необходимые драйвера (чипсет, видеокарта, звук, сеть). 3) Настройте параметры конфиденциальности - отключите телеметрию и ненужные функции. 4) Установите необходимое ПО: браузер, архиватор, офисный пакет, медиаплеер. 5) Настройте антивирус. 6) Создайте точку восстановления системы. 7) Оптимизируйте автозагрузку. 8) Настройте план электропитания. 9) Отключите ненужные службы и эффекты. 10) Настройте параметры обновлений.',
    category: 'Настройка ОС',
    type: 'article'
  },
  {
    id: 'kb-article-3',
    title: 'Признаки выхода из строя жесткого диска',
    content: 'Жесткий диск - один из самых уязвимых компонентов компьютера. Основные признаки проблем: 1) Странные звуки (щелчки, скрежет, постукивание). 2) Медленная работа системы, долгая загрузка файлов. 3) Частые зависания и BSOD (синий экран смерти). 4) Ошибки при чтении/записи файлов. 5) Исчезновение файлов и папок. 6) SMART ошибки в диагностических утилитах. 7) Невозможность загрузки операционной системы. При обнаружении этих признаков немедленно сделайте резервную копию данных и обратитесь к специалисту. Средний срок жизни HDD - 3-5 лет, SSD - 5-7 лет при нормальной эксплуатации.',
    category: 'Диагностика',
    type: 'article'
  }
];

// In-memory хранилище для заявок
let tickets: Ticket[] = [];
let ticketIdCounter = 1;

// Функция генерации ID для заявок
function generateTicketId(): string {
  return `ticket-${ticketIdCounter++}`;
}

// Функция валидации email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Функция валидации телефона (простая проверка)
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

// Функция валидации данных заявки
function validateTicketData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.clientName || data.clientName.trim().length < 2) {
    errors.push('Имя клиента должно содержать минимум 2 символа');
  }

  if (!data.phone || !isValidPhone(data.phone)) {
    errors.push('Некорректный формат телефона');
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Некорректный формат email');
  }

  if (!data.serviceType || data.serviceType.trim().length === 0) {
    errors.push('Необходимо указать тип услуги');
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.push('Описание должно содержать минимум 10 символов');
  }

  if (!data.priority || !['low', 'medium', 'high'].includes(data.priority)) {
    errors.push('Некорректный приоритет заявки');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// API endpoints

// GET /api/services - список всех услуг
app.get('/api/services', (c) => {
  // console.log('[Worker] Returning services:', services.length, 'items');
  return c.json({
    data: services,
    message: 'Услуги загружены успешно'
  });
});

// GET /api/services/:id - детали конкретной услуги
app.get('/api/services/:id', (c) => {
  const id = c.req.param('id');
  const service = services.find(s => s.id === id);
  
  if (!service) {
    return c.json({
      error: 'Услуга не найдена'
    }, 404);
  }
  
  return c.json({
    data: service,
    message: 'Услуга загружена успешно'
  });
});

// GET /api/pricing - весь прайс-лист с возможностью фильтрации по категории
app.get('/api/pricing', (c) => {
  const category = c.req.query('category');
  
  let filteredPricing = pricing;
  
  if (category) {
    filteredPricing = pricing.filter(p => p.category === category);
  }
  
  return c.json({
    data: filteredPricing,
    message: category 
      ? `Прайс-лист для категории "${category}" загружен успешно`
      : 'Прайс-лист загружен успешно'
  });
});

// POST /api/tickets - создание новой заявки
app.post('/api/tickets', async (c) => {
  try {
    const body = await c.req.json();
    
    // Валидация данных
    const validation = validateTicketData(body);
    if (!validation.valid) {
      return c.json({
        error: 'Ошибка валидации',
        details: validation.errors
      }, 400);
    }

    // Создание новой заявки
    const newTicket: Ticket = {
      id: generateTicketId(),
      clientName: body.clientName.trim(),
      phone: body.phone.trim(),
      email: body.email.trim(),
      serviceType: body.serviceType.trim(),
      description: body.description.trim(),
      priority: body.priority,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    tickets.push(newTicket);

    return c.json({
      data: newTicket,
      message: 'Заявка успешно создана'
    }, 201);
  } catch (error) {
    return c.json({
      error: 'Ошибка при создании заявки',
      details: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }, 500);
  }
});

// GET /api/tickets - список всех заявок
app.get('/api/tickets', (c) => {
  // Сортировка по дате создания (новые сначала)
  const sortedTickets = [...tickets].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return c.json({
    data: sortedTickets,
    message: 'Список заявок загружен успешно',
    total: sortedTickets.length
  });
});

// GET /api/tickets/:id - детали конкретной заявки
app.get('/api/tickets/:id', (c) => {
  const id = c.req.param('id');
  const ticket = tickets.find(t => t.id === id);
  
  if (!ticket) {
    return c.json({
      error: 'Заявка не найдена'
    }, 404);
  }
  
  return c.json({
    data: ticket,
    message: 'Заявка загружена успешно'
  });
});

// PUT /api/tickets/:id - обновление статуса заявки
app.put('/api/tickets/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const ticketIndex = tickets.findIndex(t => t.id === id);
    
    if (ticketIndex === -1) {
      return c.json({
        error: 'Заявка не найдена'
      }, 404);
    }

    // Валидация статуса
    if (body.status && !['new', 'in-progress', 'completed', 'cancelled'].includes(body.status)) {
      return c.json({
        error: 'Некорректный статус заявки',
        details: ['Статус должен быть одним из: new, in-progress, completed, cancelled']
      }, 400);
    }

    // Обновление заявки
    if (body.status) {
      tickets[ticketIndex].status = body.status;
    }
    if (body.priority && ['low', 'medium', 'high'].includes(body.priority)) {
      tickets[ticketIndex].priority = body.priority;
    }

    return c.json({
      data: tickets[ticketIndex],
      message: 'Заявка успешно обновлена'
    });
  } catch (error) {
    return c.json({
      error: 'Ошибка при обновлении заявки',
      details: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }, 500);
  }
});

// GET /api/knowledge - список всех записей базы знаний с фильтрацией
app.get('/api/knowledge', (c) => {
  const type = c.req.query('type') as KnowledgeType | undefined;
  const category = c.req.query('category');
  
  let filteredKnowledge = knowledgeBase;
  
  // Фильтрация по типу
  if (type && (type === 'faq' || type === 'article')) {
    filteredKnowledge = filteredKnowledge.filter(k => k.type === type);
  }
  
  // Фильтрация по категории
  if (category) {
    filteredKnowledge = filteredKnowledge.filter(k => k.category === category);
  }
  
  return c.json({
    data: filteredKnowledge,
    message: type
      ? `База знаний (${type}) загружена успешно`
      : 'База знаний загружена успешно',
    total: filteredKnowledge.length
  });
});

// GET /api/knowledge/:id - конкретная запись базы знаний
app.get('/api/knowledge/:id', (c) => {
  const id = c.req.param('id');
  const item = knowledgeBase.find(k => k.id === id);
  
  if (!item) {
    return c.json({
      error: 'Запись не найдена'
    }, 404);
  }
  
  return c.json({
    data: item,
    message: 'Запись загружена успешно'
  });
});

// Старый endpoint для совместимости
app.get("/api/", (c) => c.json({ name: "PCHelp API" }));

export default app;
