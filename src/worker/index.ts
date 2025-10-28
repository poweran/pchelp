import { Hono } from "hono";
import { cors } from "hono/cors";

type Env = {
  RESEND_API_KEY: string;
  EMAIL_FROM: string;
  EMAIL_TO: string;
};

// Импортируем типы
type ServiceCategory = 'repair' | 'setup' | 'recovery' | 'consultation';
type TicketPriority = 'low' | 'medium' | 'high';
type TicketStatus = 'new' | 'in-progress' | 'completed' | 'cancelled';
type KnowledgeType = 'faq' | 'article';

interface Service {
  id: string;
  title: {
    ru: string;
    en: string;
    hy: string;
  };
  description: {
    ru: string;
    en: string;
    hy: string;
  };
  price: number;
  category: ServiceCategory;
}

interface PriceItem {
  id: string;
  service: {
    ru: string;
    en: string;
    hy: string;
  };
  price: number | string;
  category: {
    ru: string;
    en: string;
    hy: string;
  };
  unit: {
    ru: string;
    en: string;
    hy: string;
  };
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
  title: {
    ru: string;
    en: string;
    hy: string;
  };
  content: {
    ru: string;
    en: string;
    hy: string;
  };
  category: {
    ru: string;
    en: string;
    hy: string;
  };
  type: KnowledgeType;
}


const app = new Hono<{ Bindings: Env }>();

// Функция отправки email через Resend
async function sendEmail(env: Env, subject: string, htmlContent: string) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to: [env.EMAIL_TO],
        subject: subject,
        html: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend API error:', response.status, errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

// Функция генерации HTML письма для новой заявки
function generateTicketEmailHtml(ticket: Ticket): string {
  const priorityLabels = {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий'
  };

  const serviceTypeLabels = {
    'repair': 'Ремонт',
    'setup': 'Настройка',
    'recovery': 'Восстановление',
    'consultation': 'Консультация',
    'installation': 'Установка',
    'virus-removal': 'Удаление вирусов'
  };

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e293b;">Новая заявка на обслуживание</h2>
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Информация о клиенте</h3>
        <p><strong>Имя:</strong> ${ticket.clientName}</p>
        <p><strong>Телефон:</strong> ${ticket.phone}</p>
        <p><strong>Email:</strong> ${ticket.email}</p>
      </div>
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Детали заявки</h3>
        <p><strong>Тип услуги:</strong> ${serviceTypeLabels[ticket.serviceType as keyof typeof serviceTypeLabels] || ticket.serviceType}</p>
        <p><strong>Приоритет:</strong> ${priorityLabels[ticket.priority]}</p>
        <p><strong>Дата создания:</strong> ${new Date(ticket.createdAt).toLocaleString('ru-RU')}</p>
      </div>
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Описание проблемы</h3>
        <p style="white-space: pre-wrap;">${ticket.description}</p>
      </div>
      <div style="background-color: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #22c55e;">
        <p style="margin: 0; color: #166534;"><strong>ID заявки:</strong> ${ticket.id}</p>
      </div>
    </div>
  `;
}

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
    title: {
      ru: 'Ремонт ноутбуков',
      en: 'Laptop repair',
      hy: 'Նոութբուքների վերանորոգում'
    },
    description: {
      ru: 'Профессиональный ремонт ноутбуков любой сложности. Диагностика, замена комплектующих, чистка от пыли.',
      en: 'Professional laptop repair of any complexity. Diagnostics, component replacement, dust cleaning.',
      hy: 'Պրոֆեսիոնալ նոութբուքների վերանորոգում ցանկացած բարդության. Ախտորոշում, բաղադրիչների փոխարինում, փոշու մաքրում:'
    },
    price: 1500,
    category: 'repair'
  },
  {
    id: 'srv-2',
    title: {
      ru: 'Ремонт компьютеров',
      en: 'Computer repair',
      hy: 'Համակարգիչների վերանորոգում'
    },
    description: {
      ru: 'Ремонт настольных компьютеров. Замена комплектующих, модернизация, чистка системы охлаждения.',
      en: 'Desktop computer repair. Component replacement, upgrading, cooling system cleaning.',
      hy: 'Աշխատասեղանի համակարգիչների վերանորոգում. Բաղադրիչների փոխարինում, արդիականացում, սառեցման համակարգի մաքրում:'
    },
    price: 18000,
    category: 'repair'
  },
  {
    id: 'srv-3',
    title: {
      ru: 'Настройка Windows',
      en: 'Windows setup',
      hy: 'Windows-ի կարգավորում'
    },
    description: {
      ru: 'Установка и настройка операционной системы Windows. Установка драйверов, оптимизация системы.',
      en: 'Installation and configuration of Windows operating system. Driver installation, system optimization.',
      hy: 'Windows օպերացիոն համակարգի տեղադրում և կարգավորում. Դրայվերների տեղադրում, համակարգի օպտիմալացում:'
    },
    price: 12000,
    category: 'setup'
  },
  {
    id: 'srv-4',
    title: {
      ru: 'Настройка сети',
      en: 'Network setup',
      hy: 'Ցանցի կարգավորում'
    },
    description: {
      ru: 'Настройка домашней или офисной сети. Настройка роутера, Wi-Fi, локальной сети.',
      en: 'Home or office network setup. Router configuration, Wi-Fi, local network.',
      hy: 'Տան կամ գրասենյակային ցանցի կարգավորում. Ռոутերի կարգավորում, Wi-Fi, տեղական ցանց:'
    },
    price: 15000,
    category: 'setup'
  },
  {
    id: 'srv-5',
    title: {
      ru: 'Восстановление данных',
      en: 'Data recovery',
      hy: 'Տվյալների վերականգնում'
    },
    description: {
      ru: 'Восстановление утерянных данных с жестких дисков, флешек, карт памяти.',
      en: 'Recovery of lost data from hard drives, flash drives, memory cards.',
      hy: 'Կորած տվյալների վերականգնում կոշտ սկավառակներից, ֆլեշ-դրայվերներից, հիշողության քարտերից:'
    },
    price: 27000,
    category: 'recovery'
  },
  {
    id: 'srv-6',
    title: {
      ru: 'Удаление вирусов',
      en: 'Virus removal',
      hy: 'Վիրուսների հեռացում'
    },
    description: {
      ru: 'Комплексная очистка системы от вирусов и вредоносного ПО. Установка антивируса.',
      en: 'Comprehensive system cleaning from viruses and malware. Antivirus installation.',
      hy: 'Համակարգի համալիր մաքրում վիրուսներից և վնասակար ծրագրերից. Հականիշային ծրագրի տեղադրում:'
    },
    price: 10800,
    category: 'recovery'
  },
  {
    id: 'srv-7',
    title: {
      ru: 'Консультация по выбору ПК',
      en: 'PC selection consultation',
      hy: 'Համակարգչի ընտրության խորհրդատվություն'
    },
    description: {
      ru: 'Помощь в подборе комплектующих для сборки компьютера под ваши задачи и бюджет.',
      en: 'Help in selecting components for assembling a computer for your tasks and budget.',
      hy: 'Օգնություն համակարգիչ հավաքելու համար բաղադրիչների ընտրության մեջ ձեր առաջադրանքների և բյուջեի համար:'
    },
    price: 480,
    category: 'consultation'
  },
  {
    id: 'srv-8',
    title: {
      ru: 'IT-консультация',
      en: 'IT consultation',
      hy: 'IT խորհրդատվություն'
    },
    description: {
      ru: 'Консультация по любым вопросам, связанным с компьютерной техникой и программным обеспечением.',
      en: 'Consultation on any issues related to computer hardware and software.',
      hy: 'Խորհրդատվություն համակարգչային տեխնիկայի և ծրագրային ապահովման հետ կապված ցանկացած հարցերով:'
    },
    price: 15000,
    category: 'consultation'
  },
  {
    id: 'srv-9',
    title: {
      ru: 'Установка и настройка программ',
      en: 'Software installation and setup',
      hy: 'Ծրագրերի տեղադրում և կարգավորում'
    },
    description: {
      ru: 'Установка и полная настройка необходимого программного обеспечения, включая Office, антивирусы, драйверы.',
      en: 'Installation and complete setup of required software, including Office, antivirus, drivers.',
      hy: 'Անհրաժեշտ ծրագրային ապահովման տեղադրում և ամբողջական կարգավորում, ներառյալ Office, հականիշային ծրագրեր, դրայվերներ:'
    },
    price: 12000,
    category: 'setup'
  },
  {
    id: 'srv-10',
    title: {
      ru: 'Настройка интернет-соединения',
      en: 'Internet connection setup',
      hy: 'Ինտերնետ կապի կարգավորում'
    },
    description: {
      ru: 'Настройка роутера, VPN, беспроводных сетей, устранение проблем с интернет-соединением.',
      en: 'Router setup, VPN, wireless networks, troubleshooting internet connection issues.',
      hy: 'Ռոутերի կարգավորում, VPN, անլար ցանցեր, ինտերնետ կապի խնդիրների վերացում:'
    },
    price: 12000,
    category: 'setup'
  },
  {
    id: 'srv-11',
    title: {
      ru: 'Ремонт материнских плат',
      en: 'Motherboard repair',
      hy: 'Մայրական տախտակների վերանորոգում'
    },
    description: {
      ru: 'Диагностика и ремонт материнских плат, замена разъемов, восстановление печатных проводников.',
      en: 'Motherboard diagnostics and repair, connector replacement, printed circuit restoration.',
      hy: 'Մայրական տախտակների ախտորոշում և վերանորոգում, միակցիչների փոխարինում, տպագիր միացումների վերականգնում:'
    },
    price: 24000,
    category: 'repair'
  },
  {
    id: 'srv-12',
    title: {
      ru: 'Восстановление после вирусной атаки',
      en: 'Recovery after virus attack',
      hy: 'Վիրուսային հարձակումից հետո վերականգնում'
    },
    description: {
      ru: 'Полное восстановление системы после вирусной атаки, удаление руткитов, восстановление данных.',
      en: 'Complete system recovery after virus attack, rootkit removal, data recovery.',
      hy: 'Վիրուսային հարձակումից հետո համակարգի ամբողջական վերականգնում, rootkit-ների հեռացում, տվյալների վերականգնում:'
    },
    price: 15000,
    category: 'recovery'
  },
  {
    id: 'srv-13',
    title: {
      ru: 'Установка операционных систем',
      en: 'Operating system installation',
      hy: 'Օպերացիոն համակարգերի տեղադրում'
    },
    description: {
      ru: 'Установка и настройка Windows, Linux, macOS. Перенос данных, оптимизация системы.',
      en: 'Installation and setup of Windows, Linux, macOS. Data migration, system optimization.',
      hy: 'Windows, Linux, macOS տեղադրում և կարգավորում. Տվյալների փոխանցում, համակարգի օպտիմալացում:'
    },
    price: 10800,
    category: 'setup'
  },
  {
    id: 'srv-14',
    title: {
      ru: 'Консультация по выбору компьютера',
      en: 'Computer selection consultation',
      hy: 'Համակարգչի ընտրության խորհրդատվություն'
    },
    description: {
      ru: 'Помощь в выборе комплектующих для нового компьютера с учетом бюджета и требований.',
      en: 'Help in selecting components for a new computer considering budget and requirements.',
      hy: 'Օգնություն նոր համակարգչի համար բաղադրիչների ընտրության մեջ բյուջեի և պահանջների հաշվարկով:'
    },
    price: 6000,
    category: 'consultation'
  },
  {
    id: 'srv-15',
    title: {
      ru: 'Выезд на дом',
      en: 'Home visit service',
      hy: 'Տուն այցելություն'
    },
    description: {
      ru: 'Выезд мастера на дом или в офис для диагностики и ремонта компьютерной техники.',
      en: 'Master visit to home or office for computer equipment diagnostics and repair.',
      hy: 'Մասնագետի այցելություն տուն կամ գրասենյակ համակարգչային տեխնիկայի ախտորոշման և վերանորոգման համար:'
    },
    price: 6000,
    category: 'repair'
  }
];

// Моковые данные для прайс-листа
const pricing: PriceItem[] = [
  {
    id: 'price-1',
    service: {
      ru: 'Диагностика компьютера',
      en: 'Computer diagnostics',
      hy: 'Համակարգչի ախտորոշում'
    },
    price: 8000,
    category: {
      ru: 'Диагностика',
      en: 'Diagnostics',
      hy: 'Ախտորոշում'
    },
    unit: {
      ru: 'шт',
      en: 'pcs',
      hy: 'հատ'
    }
  },
  {
    id: 'price-2',
    service: {
      ru: 'Чистка ноутбука от пыли',
      en: 'Laptop dust cleaning',
      hy: 'Նոութբուքի փոշու մաքրում'
    },
    price: 12000,
    category: {
      ru: 'Профилактика',
      en: 'Maintenance',
      hy: 'Մեյնթենենս'
    },
    unit: {
      ru: 'шт',
      en: 'pcs',
      hy: 'հատ'
    }
  },
  {
    id: 'price-3',
    service: {
      ru: 'Замена термопасты',
      en: 'Thermal paste replacement',
      hy: 'Թերմալ փաստի ռեպլեյս'
    },
    price: 8000,
    category: {
      ru: 'Профилактика',
      en: 'Maintenance',
      hy: 'Մեյնթենենս'
    },
    unit: {
      ru: 'шт',
      en: 'pcs',
      hy: 'հատ'
    }
  },
  {
    id: 'price-4',
    service: {
      ru: 'Установка Windows',
      en: 'Windows installation',
      hy: 'Windows տեղադրում'
    },
    price: 10000,
    category: {
      ru: 'Установка ПО',
      en: 'Software Installation',
      hy: 'Ծրագրեր'
    },
    unit: {
      ru: 'шт',
      en: 'pcs',
      hy: 'հատ'
    }
  },
  {
    id: 'price-5',
    service: {
      ru: 'Установка драйверов',
      en: 'Driver installation',
      hy: 'Դրայվերների տեղադրում'
    },
    price: 5000,
    category: {
      ru: 'Установка ПО',
      en: 'Software Installation',
      hy: 'Ծրագրեր'
    },
    unit: {
      ru: 'комплект',
      en: 'set',
      hy: 'հավաքածու'
    }
  },
  {
    id: 'price-6',
    service: {
      ru: 'Установка офисного пакета',
      en: 'Office suite installation',
      hy: 'Գրասենյակային փաթեթի տեղադրում'
    },
    price: 8000,
    category: {
      ru: 'Установка ПО',
      en: 'Software Installation',
      hy: 'Ծրագրեր'
    },
    unit: {
      ru: 'шт',
      en: 'pcs',
      hy: 'հատ'
    }
  },
  {
    id: 'price-7',
    service: {
      ru: 'Настройка роутера',
      en: 'Router setup',
      hy: 'Ռաութերի սեթափ'
    },
    price: 8000,
    category: {
      ru: 'Настройка сети',
      en: 'Network Setup',
      hy: 'Ցանցի կարգավորում'
    },
    unit: {
      ru: 'шт',
      en: 'pcs',
      hy: 'հատ'
    }
  },
  {
    id: 'price-8',
    service: {
      ru: 'Прокладка сетевого кабеля',
      en: 'Network cable laying',
      hy: 'Ցանցային մալուխի տեղադրում'
    },
    price: 1500,
    category: {
      ru: 'Настройка сети',
      en: 'Network Setup',
      hy: 'Ցանցի կարգավորում'
    },
    unit: {
      ru: 'м',
      en: 'm',
      hy: 'մ'
    }
  },
  {
    id: 'price-9',
    service: {
      ru: 'Замена жесткого диска',
      en: 'Hard drive replacement',
      hy: 'Կոշտ սկավառակի փոխարինում'
    },
    price: '10000-50000',
    category: {
      ru: 'Замена комплектующих',
      en: 'Component Replacement',
      hy: 'Բաղադրիչների փոխարինում'
    },
    unit: {
      ru: 'шт',
      en: 'pcs',
      hy: 'հատ'
    }
  },
  {
    id: 'price-10',
    service: {
      ru: 'Замена оперативной памяти',
      en: 'RAM replacement',
      hy: 'Օպերատիվ հիշողության փոխարինում'
    },
    price: '5000-20000',
    category: {
      ru: 'Замена комплектующих',
      en: 'Component Replacement',
      hy: 'Բաղադրիչների փոխարինում'
    },
    unit: {
      ru: 'планка',
      en: 'module',
      hy: 'մոդուլ'
    }
  },
  {
    id: 'price-11',
    service: {
      ru: 'Замена матрицы ноутбука',
      en: 'Laptop screen replacement',
      hy: 'Նոութբուքի էկրանի փոխարինում'
    },
    price: '25000-100000',
    category: {
      ru: 'Замена комплектующих',
      en: 'Component Replacement',
      hy: 'Բաղադրիչների փոխարինում'
    },
    unit: {
      ru: 'шт',
      en: 'pcs',
      hy: 'հատ'
    }
  },
  {
    id: 'price-12',
    service: {
      ru: 'Восстановление данных (простое)',
      en: 'Data recovery (simple)',
      hy: 'Տվյալների վերականգնում (պարզ)'
    },
    price: 30000,
    category: {
      ru: 'Восстановление данных',
      en: 'Data Recovery',
      hy: 'Տվյալների վերականգնում'
    },
    unit: {
      ru: 'устройство',
      en: 'device',
      hy: 'սարք'
    }
  }
];

// Моковые данные для базы знаний
const knowledgeBase: KnowledgeItem[] = [
  // FAQ
  {
    id: 'kb-faq-1',
    title: {
      ru: 'Как часто нужно чистить компьютер от пыли?',
      en: 'How often should I clean my computer from dust?',
      hy: 'Հաճախ որքան պետք է մաքրել համակարգիչը փոշուց?'
    },
    content: {
      ru: 'Рекомендуется проводить чистку компьютера от пыли каждые 6-12 месяцев, в зависимости от условий эксплуатации. Если компьютер находится в пыльном помещении или на полу, чистку следует проводить чаще. Признаки необходимости чистки: повышенный шум вентиляторов, перегрев компонентов, самопроизвольное выключение.',
      en: 'It is recommended to clean the computer from dust every 6-12 months, depending on operating conditions. If the computer is in a dusty room or on the floor, cleaning should be done more often. Signs that cleaning is needed: increased fan noise, component overheating, spontaneous shutdown.',
      hy: 'Խորհուրդ է տրվում համակարգիչը փոշուց մաքրել ամեն 6-12 ամիսը մեկ՝ կախված շահագործման պայմաններից: Եթե համակարգիչը գտնվում է փոշոտ սենյակում կամ հատակին, մաքրումը պետք է անել ավելի հաճախ: Մաքրման անհրաժեշտության նշաններ. օդափոշիչների աճած աղմուկ, բաղադրիչների գերտաքացում, ինքնաբերաբար անջատում:'
    },
    category: {
      ru: 'Обслуживание',
      en: 'Maintenance',
      hy: 'Սպասարկում'
    },
    type: 'faq'
  },
  {
    id: 'kb-faq-2',
    title: {
      ru: 'Что делать, если компьютер не включается?',
      en: 'What to do if the computer does not turn on?',
      hy: 'Ի՞նչ անել, եթե համակարգիչը չի միանում:'
    },
    content: {
      ru: 'Первым делом проверьте подключение к электросети и убедитесь, что розетка работает. Проверьте, горит ли индикатор питания на системном блоке. Если нет - проблема может быть в блоке питания. Если индикатор горит, но компьютер не запускается - возможны проблемы с материнской платой, процессором или оперативной памятью. В этом случае рекомендуется обратиться к специалисту.',
      en: 'First, check the power connection and make sure the outlet works. Check if the power indicator on the system unit is lit. If not - the problem may be in the power supply. If the indicator lights up, but the computer does not start - there may be problems with the motherboard, processor or RAM. In this case, it is recommended to contact a specialist.',
      hy: 'Առաջին հերթին ստուգեք էլեկտրական ցանցի միացումը և համոզվեք, որ վարդակը աշխատում է: Ստուգեք՝ լուսավորված է արդյոք սնուցման ինդիկատորը համակարգի բլոկի վրա: Եթե ոչ՝ խնդիրը կարող է լինել սնուցման բլոկում: Եթե ինդիկատորը լուսավորվում է, բայց համակարգիչը չի մեկնարկում՝ հնարավոր են խնդիրներ մայրական տախտակով, պրոցեսորով կամ օպերատիվ հիշողությամբ: Այս դեպքում խորհուրդ է տրվում դիմել մասնագետի:'
    },
    category: {
      ru: 'Диагностика',
      en: 'Diagnostics',
      hy: 'Ախտորոշում'
    },
    type: 'faq'
  },
  {
    id: 'kb-faq-3',
    title: {
      ru: 'Как защитить компьютер от вирусов?',
      en: 'How to protect your computer from viruses?',
      hy: 'Ինչպե՞ս պաշտպանել համակարգիչը վիրուսներից:'
    },
    content: {
      ru: 'Для защиты от вирусов следуйте этим правилам: 1) Установите надежный антивирус и регулярно обновляйте его базы. 2) Держите операционную систему и программы в актуальном состоянии. 3) Не открывайте подозрительные письма и вложения. 4) Скачивайте программы только с официальных сайтов. 5) Используйте сложные пароли. 6) Регулярно делайте резервные копии важных данных.',
      en: 'To protect against viruses, follow these rules: 1) Install reliable antivirus software and regularly update its databases. 2) Keep the operating system and programs up to date. 3) Do not open suspicious emails and attachments. 4) Download programs only from official websites. 5) Use strong passwords. 6) Regularly back up important data.',
      hy: 'Վիրուսներից պաշտպանվելու համար հետևեք այս կանոններին. 1) Տեղադրեք հուսալի հականիշային ծրագիր և կանոնավոր թարմացրեք դրա բազաները: 2) Պահեք օպերացիոն համակարգը և ծրագրերը արդիական վիճակում: 3) Մի բացեք կասկածելի նամակներ և հավելվածներ: 4) Ծրագրերը ներբեռնեք միայն պաշտոնական կայլերից: 5) Օգտագործեք բարդ գաղտնաբառեր: 6) Կանոնավոր կրկնօրինակեք կարևոր տվյալները:'
    },
    category: {
      ru: 'Безопасность',
      en: 'Security',
      hy: 'Անվտանգություն'
    },
    type: 'faq'
  },
  {
    id: 'kb-faq-4',
    title: {
      ru: 'Сколько оперативной памяти нужно для нормальной работы?',
      en: 'How much RAM is needed for normal operation?',
      hy: 'Որքան օպերատիվ հիշողություն է անհրաժեշտ նորմալ աշխատանքի համար:'
    },
    content: {
      ru: 'Минимальные требования зависят от задач: для базовой работы (интернет, офисные программы) достаточно 8 ГБ; для мультимедиа и легких игр - 16 ГБ; для профессиональной работы с видео, 3D-графикой или современных игр на высоких настройках - 32 ГБ и более. Также важен тип памяти (DDR4/DDR5) и её частота.',
      en: 'Minimum requirements depend on tasks: 8 GB is enough for basic work (internet, office programs); 16 GB for multimedia and light games; 32 GB or more for professional video work, 3D graphics or modern games on high settings. The type of memory (DDR4/DDR5) and its frequency are also important.',
      hy: 'Նվազագույն պահանջները կախված են առաջադրանքներից. հիմնական աշխատանքի համար (ինտերնետ, գրասենյակային ծրագրեր) բավական է 8 ԳԲ; մուլտիմեդիայի և թեթև խաղերի համար՝ 16 ԳԲ; վիդեոների հետ մասնագիտական աշխատանքի, 3D գրաֆիկայի կամ ժամանակակից խաղերի բարձր կարգավորումներով համար՝ 32 ԳԲ և ավելին: Կարևոր է նաև հիշողության տեսակը (DDR4/DDR5) և դրա հաճախականությունը:'
    },
    category: {
      ru: 'Железо',
      en: 'Hardware',
      hy: 'Սարքավորումներ'
    },
    type: 'faq'
  },
  {
    id: 'kb-faq-5',
    title: {
      ru: 'Как ускорить работу старого компьютера?',
      en: 'How to speed up an old computer?',
      hy: 'Ինչպե՞ս արագացնել հին համակարգչի աշխատանքը:'
    },
    content: {
      ru: 'Способы ускорения старого компьютера: 1) Замените HDD на SSD - это даст максимальный прирост производительности. 2) Добавьте оперативной памяти до 8-16 ГБ. 3) Почистите систему от мусора и ненужных программ. 4) Отключите автозагрузку лишних приложений. 5) Обновите драйвера. 6) Переустановите операционную систему. 7) Почистите компьютер от пыли.',
      en: 'Ways to speed up an old computer: 1) Replace HDD with SSD - this will give maximum performance boost. 2) Add RAM up to 8-16 GB. 3) Clean the system from garbage and unnecessary programs. 4) Disable autorun of unnecessary applications. 5) Update drivers. 6) Reinstall the operating system. 7) Clean the computer from dust.',
      hy: 'Հին համակարգչի աշխատանքը արագացնելու եղանակներ. 1) Փոխարինեք HDD-ն SSD-ով՝ դա կտա առավելագույն արտադրողականության աճ: 2) Ավելացրեք օպերատիվ հիշողություն մինչև 8-16 ԳԲ: 3) Մաքրեք համակարգը աղբից և անհրաժեշտ ծրագրերից: 4) Անջատեք անհրաժեշտ ծրագրերի ինքնաթարմացումը: 5) Թարմացրեք դրայվերները: 6) Վերատեղադրեք օպերացիոն համակարգը: 7) Մաքրեք համակարգիչը փոշուց:'
    },
    category: {
      ru: 'Оптимизация',
      en: 'Optimization',
      hy: 'Օպտիմալացում'
    },
    type: 'faq'
  },
  // Статьи
  {
    id: 'kb-article-1',
    title: {
      ru: 'Выбор комплектующих для игрового ПК в 2025 году',
      en: 'Choosing components for a gaming PC in 2025',
      hy: 'Խաղային համակարգչի բաղադրիչներ ընտրությունը 2025 թվականին'
    },
    content: {
      ru: 'Подробное руководство по выбору комплектующих для игрового компьютера. Процессор: рекомендуем Intel Core i5/i7 последних поколений или AMD Ryzen 5/7. Видеокарта: минимум RTX 4060 или RX 7600 для Full HD, RTX 4070 или выше для 2K/4K. Оперативная память: 16 ГБ DDR5 - минимум, 32 ГБ - оптимально. SSD: обязателен NVMe объемом от 500 ГБ для системы и игр. Блок питания: мощность от 650 Вт с сертификатом 80+ Gold. Охлаждение: башенный кулер от 120 мм или водяное охлаждение. Корпус: хорошая вентиляция и возможность прокладки кабелей за материнской платой.',
      en: 'Detailed guide on choosing components for a gaming computer. Processor: we recommend Intel Core i5/i7 latest generations or AMD Ryzen 5/7. Graphics card: minimum RTX 4060 or RX 7600 for Full HD, RTX 4070 or higher for 2K/4K. RAM: 16 GB DDR5 - minimum, 32 GB - optimal. SSD: NVMe with at least 500 GB capacity for system and games is mandatory. Power supply: power from 650 W with 80+ Gold certificate. Cooling: tower cooler from 120 mm or liquid cooling. Case: good ventilation and the ability to route cables behind the motherboard.',
      hy: 'Խաղային համակարգչի համար բաղադրիչներ ընտրելու մանրամասն ուղեցույց: Պրոցեսոր՝ խորհուրդ ենք տալիս Intel Core i5/i7 վերջին սերունդների կամ AMD Ryzen 5/7: Տեսաքարտ՝ նվազագույնը RTX 4060 կամ RX 7600 Full HD համար, RTX 4070 կամ ավելի բարձր 2K/4K համար: Օպերատիվ հիշողություն՝ 16 ԳԲ DDR5 - նվազագույնը, 32 ԳԲ - օպտիմալ: SSD՝ պարտադիր է NVMe մինչև 500 ԳԲ ծավալով համակարգի և խաղերի համար: Սնուցման բլոկ՝ հզորություն 650 Վտ-ից 80+ Gold վկայագրությամբ: Սառեցում՝ 120 մմ բարձրության կուլեր կամ հեղուկ սառեցում: Կորպուս՝ լավ օդափոշիպ և մայրական տախտակի հետևում մալուխներ անցկացնելու հնարավորություն:'
    },
    category: {
      ru: 'Сборка ПК',
      en: 'PC Assembly',
      hy: 'Համակարգչի հավաքում'
    },
    type: 'article'
  },
  {
    id: 'kb-article-2',
    title: {
      ru: 'Правильная настройка Windows после установки',
      en: 'Proper Windows setup after installation',
      hy: 'Ճիշտ կարգավորում Windows-ը տեղադրելուց հետո'
    },
    content: {
      ru: 'Пошаговая инструкция по настройке Windows после установки: 1) Обновите систему до последней версии через Windows Update. 2) Установите все необходимые драйвера (чипсет, видеокарта, звук, сеть). 3) Настройте параметры конфиденциальности - отключите телеметрию и ненужные функции. 4) Установите необходимое ПО: браузер, архиватор, офисный пакет, медиаплеер. 5) Настройте антивирус. 6) Создайте точку восстановления системы. 7) Оптимизируйте автозагрузку. 8) Настройте план электропитания. 9) Отключите ненужные службы и эффекты. 10) Настройте параметры обновлений.',
      en: 'Step-by-step instructions for setting up Windows after installation: 1) Update the system to the latest version via Windows Update. 2) Install all necessary drivers (chipset, graphics card, sound, network). 3) Configure privacy settings - disable telemetry and unnecessary functions. 4) Install necessary software: browser, archiver, office suite, media player. 5) Configure antivirus. 6) Create a system restore point. 7) Optimize autorun. 8) Configure power plan. 9) Disable unnecessary services and effects. 10) Configure update settings.',
      hy: 'Քայլ առ քայլ հրահանգներ Windows-ի կարգավորման համար տեղադրելուց հետո. 1) Թարմացրեք համակարգը մինչև վերջին տարբերակը Windows Update-ի միջոցով: 2) Տեղադրեք բոլոր անհրաժեշտ դրայվերները (չիպսեթ, տեսաքարտ, ձայն, ցանց): 3) Կարգավորեք գաղտնիության կարգավորումները՝ անջատեք տելեմետրիան և անհրաժեշտ գործառույթները: 4) Տեղադրեք անհրաժեշտ ծրագրային ապահովումը՝ զննարկիչ, արխիվատոր, գրասենյակային փաթեթ, մեդիա նվագարկիչ: 5) Կարգավորեք հականիշային ծրագիրը: 6) Ստեղծեք համակարգի վերականգնման կետ: 7) Օպտիմալացրեք ինքնաթարմացումը: 8) Կարգավորեք էլեկտրաէներգիայի պլանը: 9) Անջատեք անհրաժեշտ ծառայություններն ու էֆեկտները: 10) Կարգավորեք թարմացումների կարգավորումները:'
    },
    category: {
      ru: 'Настройка ОС',
      en: 'OS Setup',
      hy: 'ՕՀ կարգավորում'
    },
    type: 'article'
  },
  {
    id: 'kb-article-3',
    title: {
      ru: 'Признаки выхода из строя жесткого диска',
      en: 'Signs of hard drive failure',
      hy: 'Կոշտ սկավառակի անսարքության նշաններ'
    },
    content: {
      ru: 'Жесткий диск - один из самых уязвимых компонентов компьютера. Основные признаки проблем: 1) Странные звуки (щелчки, скрежет, постукивание). 2) Медленная работа системы, долгая загрузка файлов. 3) Частые зависания и BSOD (синий экран смерти). 4) Ошибки при чтении/записи файлов. 5) Исчезновение файлов и папок. 6) SMART ошибки в диагностических утилитах. 7) Невозможность загрузки операционной системы. При обнаружении этих признаков немедленно сделайте резервную копию данных и обратитесь к специалисту. Средний срок жизни HDD - 3-5 лет, SSD - 5-7 лет при нормальной эксплуатации.',
      en: 'Hard drive is one of the most vulnerable components of a computer. Main signs of problems: 1) Strange sounds (clicking, grinding, knocking). 2) Slow system performance, long file loading. 3) Frequent freezes and BSOD (blue screen of death). 4) Errors when reading/writing files. 5) Disappearance of files and folders. 6) SMART errors in diagnostic utilities. 7) Inability to boot the operating system. When you detect these signs, immediately back up your data and contact a specialist. Average HDD lifespan - 3-5 years, SSD - 5-7 years with normal operation.',
      hy: 'Կոշտ սկավառակը համակարգչի ամենախոցելի բաղադրիչներից մեկն է: Խնդիրների հիմնական նշաններ. 1) Անոմալ ձայներ (կտտացնումներ, քերելով ձայներ, թակելով ձայներ): 2) Համակարգի դանդաղ աշխատանք, ֆայլերի երկար բեռնում: 3) Հաճախակի կախումներ և BSOD (կապույտ մահվան էկրան): 4) Ֆայլերի կարդալու/գրելու սխալներ: 5) Ֆայլերի և թղթապանակների անհետացում: 6) SMART սխալներ ախտորոշիչ օգնականներում: 7) Օպերացիոն համակարգի բեռնման անկարողություն: Այս նշանները հայտնաբերելիս անմիջապես կրկնօրինակեք ձեր տվյալները և դիմեք մասնագետի: Միջին ծառայության ժամկետ HDD - 3-5 տարի, SSD - 5-7 տարի նորմալ շահագործման դեպքում:'
    },
    category: {
      ru: 'Диагностика',
      en: 'Diagnostics',
      hy: 'Ախտորոշում'
    },
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
  const lang = c.req.query('lang') || 'ru';

  let filteredPricing = pricing.map(item => {
    const priceValue = typeof item.price === 'string' && item.price.includes('-')
      ? (() => {
          const [min, max] = item.price.split('-').map(s => parseInt(s.trim()));
          return {
            price: max,
            minPrice: min,
            maxPrice: max
          };
        })()
      : { price: typeof item.price === 'number' ? item.price : parseInt(item.price) };

    return {
      ...item,
      ...priceValue,
      service: item.service[lang as keyof typeof item.service] || item.service.ru,
      category: item.category[lang as keyof typeof item.category] || item.category.ru,
      unit: item.unit[lang as keyof typeof item.unit] || item.unit.ru
    };
  });

  if (category) {
    filteredPricing = filteredPricing.filter(p => p.category === category);
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

    // Отправка email уведомления
    const env = c.env as Env;
    if (env.RESEND_API_KEY && env.RESEND_API_KEY !== 'your-resend-api-key-here') {
      const emailSubject = `Новая заявка #${newTicket.id} - ${newTicket.clientName}`;
      const emailHtml = generateTicketEmailHtml(newTicket);

      const emailSent = await sendEmail(env, emailSubject, emailHtml);
      if (!emailSent) {
        console.error('Failed to send email notification for ticket:', newTicket.id);
        // Не возвращаем ошибку, чтобы не блокировать создание заявки
      }
    } else {
      console.log('Email sending skipped: Resend API key not configured');
    }

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
  const lang = c.req.query('lang') || 'ru';

  let filteredKnowledge = knowledgeBase.map(item => ({
    ...item,
    title: item.title[lang as keyof typeof item.title] || item.title.ru,
    content: item.content[lang as keyof typeof item.content] || item.content.ru,
    category: item.category[lang as keyof typeof item.category] || item.category.ru
  }));

  // Фильтрация по типу
  if (type && (type === 'faq' || type === 'article')) {
    filteredKnowledge = filteredKnowledge.filter(k => k.type === type);
  }

  // Фильтрация по категории
  if (category) {
    filteredKnowledge = filteredKnowledge.filter(k => k.category[lang as keyof typeof k.category] === category);
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
  const lang = c.req.query('lang') || 'ru';
  const item = knowledgeBase.find(k => k.id === id);

  if (!item) {
    return c.json({
      error: 'Запись не найдена'
    }, 404);
  }

  const translatedItem = {
    ...item,
    title: item.title[lang as keyof typeof item.title] || item.title.ru,
    content: item.content[lang as keyof typeof item.content] || item.content.ru,
    category: item.category[lang as keyof typeof item.category] || item.category.ru
  };

  return c.json({
    data: translatedItem,
    message: 'Запись загружена успешно'
  });
});

// Старый endpoint для совместимости
app.get("/api/", (c) => c.json({ name: "PCHelp API" }));

export default app;
