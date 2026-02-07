import type { LocalizedText } from '../types';

export interface ChangelogEntry {
  date: string;
  title: LocalizedText;
  highlights: LocalizedText[];
}

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    date: '2026-02-08',
    title: {
      en: "Knowledge 'guide' type & CodeBlock",
      ru: "Тип знаний 'guide' и CodeBlock",
      hy: "Գիտելիքների 'guide' տեսակ և CodeBlock",
    },
    highlights: [
      {
        en: "Added support for 'guide' knowledge type, CodeBlock component for code formatting, and direct links to articles/FAQ on the knowledge page.",
        ru: 'Добавлена поддержка типа знаний "guide", компонент CodeBlock для форматирования кода и прямые ссылки на статьи/FAQ на странице знаний.',
        hy: 'Ավելացվել է "guide" գիտելիքների տեսակի աջակցություն, CodeBlock կոմպոնենտ՝ կոդի ֆորմատավորման համար, և ուղիղ հղումներ հոդվածների/FAQ-ի վրա գիտելիքների էջում։',
      },
    ],
  },
  {
    date: '2026-02-01',
    title: {
      en: 'Brand Refresh & Classic UI',
      ru: 'Ребрендинг и классический UI',
      hy: 'Բրենդի թարմացում և Classic UI',
    },
    highlights: [
      {
        en: 'Rebranded the application to "PCHelp Armenia" across all pages and API.',
        ru: 'Полное переименование приложения в «PCHelp Armenia» во всех разделах и API.',
        hy: 'Հավելվածի վերանվանում «PCHelp Armenia» բոլոր բաժիններում և API-ում։',
      },
      {
        en: 'Adopted a "Classic" UI style by removing rounded corners from buttons, cards, and modals.',
        ru: 'Переход к «классическому» стилю: убраны скругления углов у кнопок, карточек и модальных окон.',
        hy: 'Անցում «դասական» ոճի. կոճակների, քարտերի և մոդալ պատուհանների կլորացված անկյունները հեռացվել են։',
      },
      {
        en: 'Integrated SVG logo into the header and introduced a new textured background for the footer.',
        ru: 'В шапку интегрирован SVG-логотип, а для футера добавлен новый текстурированный фон.',
        hy: 'Գլխամասում ավելացվել է SVG լոգոն, իսկ ֆութերի համար ավելացվել է նոր տեքստուրային ֆոն։',
      },
      {
        en: 'Improved Contacts page layout and updated homepage hero content for better clarity.',
        ru: 'Оптимизирован макет страницы контактов и обновлены приветственные тексты на главной.',
        hy: 'Օպտիմիզացվել է կոնտակտների էջի դասավորությունը և թարմացվել են գլխավոր էջի տեքստերը։',
      },
      {
        en: 'Removed decorative emojis and icons across all pages to streamline the visual identity.',
        ru: 'Убраны декоративные эмодзи и иконки на всех страницах для придания интерфейсу более строгого вида.',
        hy: 'Բոլոր էջերից հեռացվել են դեկորատիվ էմոջիները և պատկերակները՝ ինտերֆեյսին ավելի զուսպ տեսք հաղորդելու համար։',
      },
    ],
  },
  {
    date: '2025-11-10',
    title: {
      en: 'Ticket tooling overhaul',
      ru: 'Новый процесс работы с заявками',
      hy: 'Դիմումների հոսքի թարմացում',
    },
    highlights: [
      {
        en: 'Ticket workflow now supports format-aware pricing hooks, localized copy, and visit surcharge logic.',
        ru: 'Поток заявок теперь поддерживает форматы, хуки ценообразования и доплату за выезд.',
        hy: 'Դիմումների գործընթացը հիմա հաշվի է առնում ձևաչափերը, գնագոյացման հուկերը և այցի հավելավճարը։',
      },
      {
        en: 'Admin, home, and ticket pages gained visit sections plus clearer forms.',
        ru: 'Админка, главная и билетные страницы получили блоки про выезд и обновленные формы.',
        hy: 'Ադմին, գլխավոր և տոմսերի էջերը համալրվել են այցի բլոկներով և հարմարեցված ձևերով։',
      },
      {
        en: 'Router, worker, and API helpers aligned with the updated business logic.',
        ru: 'Router, worker и API синхронизированы с обновлённой бизнес-логикой.',
        hy: 'Router-ը, worker-ը և API helper-ները համաժամեցվել են նոր տրամաբանությանը։',
      },
      {
        en: 'Removed autofocus from inputs to stop sudden scroll jumps.',
        ru: 'Автофокус убран из полей, чтобы страница не «прыгала».',
        hy: 'Autofocus-ը հեռացվել է դաշտերից, որպեսզի էջը այլևս չցատկի։',
      },
      {
        en: 'Admin panel gained a Changelog tab with localized entries and date helpers for ru/en/hy.',
        ru: 'В админке появилась вкладка Changelog с локализованными записями и хелперами дат для ru/en/hy.',
        hy: 'Ադմին վահանակում ավելացվել է Changelog ներդիրը՝ տեղայնացված գրառումներով և ամսաթվի հելփերով ru/en/hy լեզուների համար։',
      },
      {
        en: 'Ticket and service tables were restyled into spaced, card-like rows with shadows and clearer section copy.',
        ru: 'Таблицы тикетов и услуг переработаны в карточные строки с отступами, тенями и более понятными описаниями.',
        hy: 'Տոմսերի և ծառայությունների աղյուսակները վերածվել են բաց տարածություններով, ստվերներով և ավելի պարզ բաժնի տեքստերով քարտային շարքերի։',
      },
      {
        en: 'Services and service-format hooks now cache API data in localStorage with cross-tab sync to avoid duplicate requests.',
        ru: 'Хуки услуг и форматов теперь кешируют ответы API в localStorage и синхронизируются между вкладками, чтобы не дёргать backend повторно.',
        hy: 'Ծառայությունների և ծառայության ձևաչափերի հուկերը հիմա պահում են API-ի պատասխանը localStorage-ում և համաժամեցնում են ներդիրների միջև՝ կրկնվող հարցումներ չանելու համար։',
      },
    ],
  },
  {
    date: '2025-11-08',
    title: {
      en: 'Performance page relaunch',
      ru: 'Релонч страницы производительности',
      hy: 'Performance էջի վերագործարկում',
    },
    highlights: [
      {
        en: 'Statistics migrated into the new PerformancePage with focused sections.',
        ru: 'Статистика переехала в новую PerformancePage с тематическими блоками.',
        hy: 'Վիճակագրությունը տեղափոխվել է նոր PerformancePage-ի թեմատիկ բաժիններ։',
      },
      {
        en: 'System metrics hook streamlined alongside refreshed styling.',
        ru: 'Хук системных метрик упрощён и получил обновлённые стили.',
        hy: 'Համակարգային մետրիկաների հուկը հեշտացվել է և ստացել նոր ձևավորում։',
      },
      {
        en: 'Locales updated with copy for the new metrics content.',
        ru: 'Локали дополнены текстами для новых секций.',
        hy: 'Լոկալները թարմացվել են նոր բաժինների տեքստերով։',
      },
    ],
  },
  {
    date: '2025-11-07',
    title: {
      en: 'Telemetry foundation',
      ru: 'Фундамент телеметрии',
      hy: 'Տելեմետրիայի հիմք',
    },
    highlights: [
      {
        en: 'Introduced system and particle metrics hooks powering the dashboard.',
        ru: 'Добавлены хуки системных и частицевых метрик для новой панели.',
        hy: 'Ավելացվել են համակարգային և մասնիկների մետրիկաների հուկերը նոր վահանակի համար։',
      },
      {
        en: 'Particle background refactored with better controls and navigation.',
        ru: 'Фоновая система частиц переработана с улучшенными контролами и навигацией.',
        hy: 'Մասնիկների ֆոնային շերտը վերափոխվել է ավելի լավ կառավարման և նավիգացիայի համար։',
      },
      {
        en: 'Locales gained metric labels across all languages.',
        ru: 'Локали пополнились подписями метрик для всех языков.',
        hy: 'Լոկալները ստացել են մետրիկաների նոր նշումներ բոլոր լեզուներով։',
      },
      {
        en: 'Statistics page expanded with a storytelling layout.',
        ru: 'Страница Statistics получила расширенный сторителлинг-макет.',
        hy: 'Statistics էջը ընդլայնվել է պատմողական դասավորությամբ։',
      },
    ],
  },
  {
    date: '2025-11-06',
    title: {
      en: 'UI polish & translations',
      ru: 'Правки UI и переводов',
      hy: 'UI-ի և թարգմանությունների լրամշակում',
    },
    highlights: [
      {
        en: 'Buttons, pricing, services, and tickets received consistent styling.',
        ru: 'Кнопки, прайс, сервисы и заявки получили выровненный стиль.',
        hy: 'Կոճակները, գնացուցակը, ծառայությունները և դիմումները ստացան միասնական ոճ։',
      },
      {
        en: 'Quick fixes landed in index markup and Services navigation.',
        ru: 'Исправлены мелочи в index.html и навигации Services.',
        hy: 'Կատարվել են շտկումներ index.html-ում և Services էջի նավիգացիայում։',
      },
      {
        en: 'Translation strings expanded for the admin experience.',
        ru: 'Переводы расширены для админского интерфейса.',
        hy: 'Թարմացվել են ադմին ինտերֆեյսի թարգմանությունները։',
      },
      {
        en: 'Iterated on particle/audio experiments, including removing heavy assets.',
        ru: 'Продолжились эксперименты с частицами и аудио, тяжёлые ассеты удалены.',
        hy: 'Շարունակվել են մասնիկների և աուդիոյի փորձարկումները, ծանր ֆայլերը հեռացվել են։',
      },
    ],
  },
  {
    date: '2025-11-05',
    title: {
      en: 'Content & ambience drop',
      ru: 'Контент и атмосферные эффекты',
      hy: 'Պարունակություն և մթնոլորտային էֆեկտներ',
    },
    highlights: [
      {
        en: 'Markdown support shipped together with refreshed admin knowledge styling.',
        ru: 'Добавлена поддержка Markdown и обновлены стили знаний в админке.',
        hy: 'Ավելացվել է Markdown-ի աջակցությունը և թարմացվել են գիտելիքների ձևերը ադմինկայում։',
      },
      {
        en: 'Modal windows, background audio, and richer particle layers appeared.',
        ru: 'Появились модальные окна, фоновое аудио и новый слой частиц.',
        hy: 'Ավելացվել են մոդալ պատուհաններ, ֆոնային աուդիո և մասնիկների նոր շերտ։',
      },
      {
        en: 'Footer glass and rain shaders wired through Curtains.js typings.',
        ru: 'Футер получил стеклянный эффект и «дождь» через Curtains.js.',
        hy: 'Ֆութերը ստացել է ապակյա էֆեկտ և «անձրև» Curtains.js-ի միջոցով։',
      },
      {
        en: 'Dependencies bumped after the latest npm install.',
        ru: 'Зависимости обновлены после последнего npm install.',
        hy: 'Վերջին npm install-ից հետո կախվածությունները թարմացվել են։',
      },
    ],
  },
  {
    date: '2025-11-04',
    title: {
      en: 'Tickets page tweak',
      ru: 'Мини-правка TicketsPage',
      hy: 'Փոքր շտկում TicketsPage-ում',
    },
    highlights: [
      {
        en: 'Tickets page layout adjusted for cleaner spacing.',
        ru: 'Макет страницы заявок чуть выровнен по отступам.',
        hy: 'Տոմսերի էջի դասավորությունը հարմարեցվել է մաքուր ընդմիջումների համար։',
      },
    ],
  },
  {
    date: '2025-11-03',
    title: {
      en: 'Edge deployment & pricing polish',
      ru: 'Edge-размещение и прайс',
      hy: 'Edge տեղակայման ու գնագոյացման թյունինգ',
    },
    highlights: [
      {
        en: 'Wrangler smart placement is enabled so the Worker runs closer to clients with lower latency.',
        ru: 'В wrangler.json включён smart placement, и Worker исполняется ближе к пользователям при меньших задержках.',
        hy: 'wrangler.json-ում միացվել է smart placement-ը, որպեսզի Worker-ը աշխատի օգտատերերին մոտ՝ նվազեցված ուշացումներով։',
      },
      {
        en: 'Service management forms gained explicit unit plus min/max fields for range pricing.',
        ru: 'Формы управления услугами получили явные поля единицы измерения и диапазона цен (min/max).',
        hy: 'Ծառայությունների ձևերն այժմ ունեն միավորի և նվազագույն/առավելագույն գների դաշտեր՝ միջակայքը նկարագրելու համար։',
      },
      {
        en: 'Error and empty states across PriceTable, ServiceList, and KnowledgePage were restyled for clarity.',
        ru: 'Состояния ошибок и пустых данных в PriceTable, ServiceList и KnowledgePage переработаны для лучшей читаемости.',
        hy: 'PriceTable-, ServiceList- և KnowledgePage-ներում սխալի և դատարկ վիճակների դիզայնը թարմացվել է՝ ընթեռնելիությունը բարձրացնելու համար։',
      },
    ],
  },
  {
    date: '2025-11-01',
    title: {
      en: 'Admin portal launch',
      ru: 'Старт админ-панели',
      hy: 'Ադմին վահանակի գործարկում',
    },
    highlights: [
      {
        en: 'Password-protected admin authentication landed with stored tokens for API calls.',
        ru: 'Добавлена авторизация админки по паролю с сохранением токена для API.',
        hy: 'Ադմին վահանակում ներդրվել է գաղտնաբառով մուտք և API token-ի պահպանում։',
      },
      {
        en: 'Ticket list now auto-refreshes on a timer and shows clearer loading feedback.',
        ru: 'Список заявок получил автообновление по таймеру и улучшенные индикаторы загрузки.',
        hy: 'Հայտերի ցուցակը այժմ ավտոմատ թարմացվում է և ցուցադրում է ավելի հասկանալի բեռնում։',
      },
      {
        en: 'Full CRUD for services, pricing, and knowledge items shipped with validation and error surfacing.',
        ru: 'Запущен полный CRUD для услуг, прайса и записей знаний с валидацией и обработкой ошибок.',
        hy: 'Ծառայությունների, գնացուցակի և գիտելիքների համար ավելացվել է ամբողջական CRUD՝ վալիդացիայով և սխալի հաղորդագրություններով։',
      },
      {
        en: 'Localization strings for tabs/search were simplified ahead of launch.',
        ru: 'Перед релизом упрощены локализованные подписи вкладок и поиска.',
        hy: 'Մինչ գործարկումը պարզեցվել են թաբերի և որոնման թարգմանությունները։',
      },
    ],
  },
  {
    date: '2025-10-31',
    title: {
      en: 'Ticket engine upgrade',
      ru: 'Апгрейд тикет-системы',
      hy: 'Հայտերի շարժիչի արդիականացում',
    },
    highlights: [
      {
        en: 'Integrated Cloudflare D1 for ticket persistence with improved loading states.',
        ru: 'Для хранения заявок подключена Cloudflare D1 и улучшены состояния загрузки.',
        hy: 'Հայտերի պահպանման համար միացվել է Cloudflare D1-ը, իսկ բեռնումները դարձան ավելի հստակ։',
      },
      {
        en: 'Users can filter tickets per requester and see friendlier short IDs.',
        ru: 'Появилась фильтрация тикетов по пользователю и более короткие удобочитаемые ID.',
        hy: 'Հնարավոր դարձավ ֆիլտրել հայտերը ըստ օգտատիրոջ և ցուցադրել կարճ, ընթեռնելի ID-ներ։',
      },
      {
        en: 'Deletion flow now asks for confirmation to avoid accidental removal.',
        ru: 'Удаление заявок сопровождается подтверждением, чтобы исключить случайности.',
        hy: 'Հայտը ջնջելիս հիմա պահանջվում է հաստատում՝ պատահական ջնջումները բացառելու համար։',
      },
      {
        en: 'Periodic refresh keeps the ticket table in sync without manual reloads.',
        ru: 'Периодическое обновление поддерживает таблицу заявок в актуальном состоянии без ручного F5.',
        hy: 'Պարբերական թարմացումները պահպանում են հայտերի աղյուսակը արդիական՝ առանց ձեռքով թարմացնելու։',
      },
    ],
  },
  {
    date: '2025-10-30',
    title: {
      en: 'Button & loading consistency',
      ru: 'Единый стиль кнопок и загрузок',
      hy: 'Կոճակների և բեռնումների միասնականացում',
    },
    highlights: [
      {
        en: 'Shared Button component adopted across screens to unify interaction patterns.',
        ru: 'Общий компонент Button внедрён во всех экранах для единого UX.',
        hy: 'Ընդհանուր Button կոմպոնենտը կիրառվեց բոլոր էջերում՝ UX-ը միասնականացնելու համար։',
      },
      {
        en: 'Loading states were normalized so skeletons and spinners behave the same way.',
        ru: 'Состояния загрузки приведены к единому виду: skeleton и спиннеры ведут себя одинаково.',
        hy: 'Բեռնման վիճակները համասեռացվեցին, որպեսզի skeleton-ներն ու spinner-ները աշխատեն նույն սկզբունքով։',
      },
    ],
  },
  {
    date: '2025-10-28',
    title: {
      en: 'Localization & comms refresh',
      ru: 'Обновление локализаций и коммуникаций',
      hy: 'Թարգմանությունների և հաղորդակցության թարմացում',
    },
    highlights: [
      {
        en: 'Language switcher order and fallbacks were refined for Armenian-first audiences.',
        ru: 'Переключатель языков настроен с упором на армянский и корректные fallbacks.',
        hy: 'Լեզվի փոխարկիչը կարգավորվեց՝ առաջնահերթ դարձնելով հայերենն ու ճիշտ fallback-երը։',
      },
      {
        en: 'Ticket form now sends notification emails and validates inputs more strictly.',
        ru: 'Форма заявки отправляет уведомления на почту и жёстче валидирует поля.',
        hy: 'Հայտի ձևը հիմա ուղարկում է ծանուցումներ էլ.փոստով և խստորեն ստուգում դաշտերը։',
      },
      {
        en: 'Contact info, typography, and placeholders were refreshed across knowledge components.',
        ru: 'Контакты, типографика и плейсхолдеры раздела знаний получили свежий стиль.',
        hy: 'Կոնտակտային տվյալները, տառատեսակները և placeholder-ները թարմացվել են գիտելիքների հատվածում։',
      },
      {
        en: 'Mobile menu cleanup removed redundant CSS and improved tappable areas.',
        ru: 'Мобильное меню очищено от лишнего CSS и получило более удобные зоны нажатия.',
        hy: 'Բջջային մենյուն մաքրվեց ավելորդ CSS-ից և ստացավ ավելի հարմար թափանցելի գոտիներ։',
      },
    ],
  },
  {
    date: '2025-10-27',
    title: {
      en: 'Multilingual data model',
      ru: 'Мультиязычная модель данных',
      hy: 'Բազմալեզու տվյալների մոդել',
    },
    highlights: [
      {
        en: 'Services and knowledge items were refactored to rely on LocalizedText structures.',
        ru: 'Структуры услуг и записей знаний переведены на LocalizedText.',
        hy: 'Ծառայությունների և գիտելիքների տվյալները տեղափոխվեցին LocalizedText կառուցվածքի վրա։',
      },
      {
        en: 'API clients now accept language parameters when fetching pricing and knowledge data.',
        ru: 'API-клиенты при запросе прайса и базы знаний принимают параметр языка.',
        hy: 'API հաճախորդները գնացուցակի և գիտելիքների տվյալներ ստանալիս այժմ փոխանցում են լեզվի պարամետր։',
      },
      {
        en: 'Default UI language switched to Armenian with missing translation keys added.',
        ru: 'Язык интерфейса по умолчанию переключён на армянский, добавлены недостающие ключи.',
        hy: 'Ինտերֆեյսի լռելյայն լեզուն դարձավ հայերենը, և բացակայող բանալիները լրացվեցին։',
      },
    ],
  },
  {
    date: '2025-10-26',
    title: {
      en: 'Tickets foundation & docs',
      ru: 'База для тикетов и документация',
      hy: 'Հայտերի հիմք ու փաստաթղթեր',
    },
    highlights: [
      {
        en: 'TicketsPage shipped with creation + listing experience wired to hooks.',
        ru: 'Появилась страница TicketsPage с созданием и списком заявок через хуки.',
        hy: 'Ստեղծվեց TicketsPage էջը՝ հայտերի ստեղծման ու ցուցադրման ամբողջական հոսքով։',
      },
      {
        en: 'Hooks were optimized with useCallback/useMemo to cut unnecessary renders.',
        ru: 'Хуки оптимизированы через useCallback/useMemo и меньше вызывают перерисовок.',
        hy: 'Hooks-երը օպտիմիզացվեցին useCallback/useMemo-ի շնորհիվ՝ կրճատելով ավելորդ rerender-ները։',
      },
      {
        en: 'README rewritten with project overview, features, and setup instructions.',
        ru: 'README переписан с описанием проекта, фич и инструкций по запуску.',
        hy: 'README-ն վերաշարադրվել է՝ ներառելով նախագծի նկարագիրը, ֆունկցիաները և տեղակայման քայլերը։',
      },
    ],
  },
  {
    date: '2025-10-25',
    title: {
      en: 'Project bootstrap',
      ru: 'Старт проекта',
      hy: 'Նախագծի մեկնարկ',
    },
    highlights: [
      {
        en: 'Base repository was imported and aligned with current tooling.',
        ru: 'Импортирован базовый репозиторий и приведён к текущему стеку инструментов.',
        hy: 'Ներքին ռեպոզիտորիան ներմուծվեց և համադրվեց օգտագործվող գործիքակազմի հետ։',
      },
      {
        en: 'Initial UI scaffolding and environment settings were checked in for future work.',
        ru: 'Добавлены стартовые UI-заготовки и настройки окружения под дальнейшую разработку.',
        hy: 'Ավելացվեցին նախնական UI շաբլոններ ու միջավայրի կարգավորումներ՝ հետագա աշխատանքի համար։',
      },
    ],
  },
];
