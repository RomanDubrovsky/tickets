import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Sparkles, Search, MessageSquare, Send, Bot, 
  ExternalLink, ChevronRight, HelpCircle, CheckCircle2, 
  Ship, Calendar, Users, ShieldCheck, Ticket, RefreshCw,
  Anchor, Compass, PhoneCall, Info, Mic
} from 'lucide-react';
import VoiceTzRecorder from './VoiceTzRecorder';

// База знаний для заказчика (написана простыми словами)
export const CLIENT_KNOWLEDGE_BASE = [
  {
    id: 'fleet_and_schemes',
    category: 'Флот и Схемы площадок',
    title: 'Какие корабли и концертные залы подключены и как устроены схемы?',
    summary: 'В систему внесены чертежи и интерактивные схемы теплоходов (Москва 125, Москва 177, Москва 201, Солярис), а также масштабной концертной площадки МТС Live Холл (Партер и Балкон).',
    content: `В нашей библиотеке оцифрованы ключевые теплоходы и концертные площадки:
1. **Москва 125**: 
   - 1-й вариант: классический инженерный чертеж.
   - 2-й вариант: стилизованная схема рок-круизов «Rock Hit Neva».
   - Вместимость: 130 мест (24 столика T1–T24 + сцена + танцпол).
2. **Москва 177**: 
   - Вариант А (Флагман): Главная палуба с кают-компанией и баром, Верхняя палуба со сценой, партером и танцполом (140 мест).
   - Вариант Б (Танцевальная): клубная компоновка с расширенным танцполом, барной зоной и боковыми VIP-диванами (150 мест).
3. **Москва 201**: 
   - 26 столиков и мягких диванов, панорамные столики на двоих у окон, бар и открытая корма (130 мест).
4. **Солярис**: 
   - Премиум-лайнер: капитанский VIP-партер у сцены, боковые столики, комфортный бар (110 мест).
5. **МТС Live Холл (Концертный комплекс)**:
   - Основной зал: Сцена, VIP-партер, танцпол фан-зоны, амфитеатр и 8 комфортабельных VIP-лож (до 2500 мест).
   - Балкон и бельэтаж: центральный и боковые сектора ярусов балкона с панорамным обзором сцены (до 1800 мест).

Все схемы интерактивные: каждый стул за столиком или сектор кликабелен, имеет свой номер и категорию билета.`,
    linkTarget: 'builder',
    linkLabel: 'Открыть Конструктор площадок',
    keywords: ['корабль', 'корабли', 'теплоход', 'мтс холл', 'мтс live', 'москва 125', 'москва 177', 'москва 201', 'солярис', 'схема', 'рассадка', 'вместимость', 'столы', 'палуба', 'чертеж', 'танцевальная', 'партер', 'балкон']
  },
  {
    id: 'hot_swap_emergency',
    category: 'Форс-мажор и Замена судна',
    title: 'Что делать, если теплоход сломался перед рейсом? Можно ли заменить судно в последний момент?',
    summary: 'Да, судно и схему можно заменить в любой момент, даже за 10–15 минут до отплытия. Номера билетов и QR-коды гостей не меняются!',
    content: `В судоходстве бывают форс-мажоры: теплоход сломался или диспетчер порта дал другой борт.

**Как это решено в системе:**
1. **Конкретный рейс**: изменение схемы касается **только одного рейса**, вся остальная серия на сезон не сбивается.
2. **Срок замены**: заменить судно можно **в любой момент**, даже за 10–15 минут до посадки.
3. **Сохранение билетов гостей**: 
   - Номера купленных билетов и места пассажиров (например, «Стол 4, место 1») **остаются в силе**.
   - QR-коды и ссылки на билеты **не аннулируются**.
   - Гость приходит на причал со своим обычным билетом в телефоне, контролер у трапа сканирует QR-код — система подтверждает проход без ошибок.
   - Пассажиры даже не замечают разницы в системе. Если на новом судне столы стоят чуть шире или иначе, администратор на причале направляет гостей по посадочной ведомости.

**Как заменить борт в 1 клик:**
В разделе «Рейсы и расписание» нажмите синюю кнопку **[🔄 Заменить судно / изменить]** напротив нужного сеанса и выберите подменный корабль.`,
    linkTarget: 'sessions',
    linkLabel: 'Перейти к Расписанию рейсов',
    keywords: ['поломка', 'сломался', 'замена', 'заменить корабль', 'заменить теплоход', 'схема рейса', 'билеты не сгорят', 'форс-мажор', 'последний момент', 'изменить схему', 'авария']
  },
  {
    id: 'live_occupancy_speed',
    category: 'Загрузка флота и Скорость данных',
    title: 'Как менеджеры видят загрузку кораблей? Насколько данные актуальны?',
    summary: 'Менеджеры видят загрузку в реальном времени с задержкой менее 1 секунды. Риск двойных продаж (овербукинга) полностью исключен.',
    content: `**Как менеджеры видят картину:**
- В разделе **«Загрузка флота» (ShipOccupancyMonitor)** открывается живая интерактивная карта судна.
- Каждый столик и стул на схеме раскрашен в цвет канала, через который его купили (зеленый — сайт, синий — Кассир.ру, желтый — отели, бирюзовый — касса дебаркадера, фиолетовый — промоутер с набережной).
- Нажав на любой столик, менеджер сразу видит имя гостя, телефон, сумму и способ оплаты.

**Насколько это актуально:**
- Задержка обновления составляет **менее 1 секунды**!
- Все продажи идут в единую общую базу данных.
- **Защита от овербукинга (Замок на 15 минут)**: как только покупатель на сайте или кассир нажал на стул, место моментально блокируется для всех остальных на 15 минут. Два человека не могут купить один и тот же билет.`,
    linkTarget: 'occupancy',
    linkLabel: 'Открыть Монитор загрузки флота',
    keywords: ['загрузка', 'заполненность', 'актуальность', 'секунда', 'онлайн', 'овербукинг', 'двойные продажи', 'статистика', 'сколько мест осталось']
  },
  {
    id: 'street_promoters_terminal',
    category: 'Промоутеры на набережных',
    title: 'Как делиться загрузкой с промоутерами на улице? Что они видят?',
    summary: 'У промоутеров есть легкое мобильное приложение (PWA) в смартфоне со светофором рейсов, живым остатком мест и оплатой по QR СБП.',
    content: `Промоутерам на набережных не нужна сложная компьютерная админка. Для них создано мобильное веб-приложение **«Промоутеры PWA»**:

1. **Работает прямо в браузере смартфона**: открывается по ссылке, можно вынести иконку на рабочий стол телефона как обычное приложение.
2. **«Светофор рейсов»**: промоутер видит список ближайших отправлений с яркими индикаторами:
   - 🟢 Свободно 45 мест;
   - 🟡 Осталось 12 мест (горящий рейс!);
   - 🔴 Мест нет (рейс закрыт).
3. **Никаких звонков диспетчеру**: промоутер всегда точно знает, на какой теплоход вести прохожих с Невского проспекта или с набережной.
4. **Быстрая продажа на ходу**:
   - Выбирает количество туристов (например, 2 билета);
   - Показывает туристу экран своего телефона с динамическим QR-кодом СБП;
   - Турист сканирует своим банковским приложением и оплачивает за 3 секунды;
   - На экране промоутера появляется посадочный QR-код, а промоутеру начисляется его комиссия.`,
    linkTarget: 'promo',
    linkLabel: 'Открыть Терминал промоутера (PWA)',
    keywords: ['промоутер', 'промоутеры', 'зазывалы', 'улица', 'набережная', 'светофор', 'остаток мест', 'сбп', 'телефон', 'pwa', 'смартфон']
  },
  {
    id: 'seat_lifecycle_process',
    category: 'Механика продаж и Схема',
    title: 'Что и в какой момент меняется на схеме палубы, когда кто-то продает билет?',
    summary: 'Схема обновляется в 3 шага: 1) Клик = Бронь на 15 мин (Hold); 2) Оплата = Место продано (Sold) и окрашено в цвет продавца; 3) Сканер у трапа готов пустить гостя.',
    content: `Процесс продажи билета в системе строго регламентирован:

1. **Шаг 1: Клиент выбрал место (статус «HOLD»)**:
   - Стул на схеме сразу становится недоступным для других продавцов на 15 минут.
   - Если за 15 минут клиент не оплатил покупку, место автоматически освобождается.
2. **Шаг 2: Клиент оплатил (статус «SOLD»)**:
   - Стул на интерактивной схеме окрашивается в цвет продавца (например, фиолетовый для уличного промоутера или бирюзовый для кассы причала).
   - Счетчик свободных мест на теплоходе мгновенно уменьшается на 1.
   - Система генерирует официальный электронный билет с защищенным QR-кодом.
3. **Шаг 3: Посадка на корабль**:
   - Матрос/контролер у трапа со своим мобильным сканером считывает QR-код гостя.
   - Сканер загорается зеленым цветом и ставит отметку «Посажен на борт». Повторный проход по этому же билету невозможен.`,
    linkTarget: 'scanner',
    linkLabel: 'Открыть Сканер билетов',
    keywords: ['что меняется', 'статус', 'схема', 'hold', 'холд', 'бронь', 'продажа', 'стул', 'место', 'qr', 'сканер', 'посадка']
  },
  {
    id: 'schedule_and_repertoire',
    category: 'Репертуар и Расписание',
    title: 'Как создавать программы и составлять расписание на весь сезон?',
    summary: 'Программа создается один раз в репертуаре, а затем в 1 клик генерируются рейсы на все лето с автоматической проверкой накладок.',
    content: `**Как устроена работа с программами:**
1. **Каталог программ (Репертуар)**: вы создаете события («Вечерний Рок-Круиз», «Джаз под мостами», «Виктор Цой»), задаете длительность (например, 120 мин) и описание.
2. **Массовая генерация расписания на сезон**:
   - Указываете период: например, с 1 мая по 30 сентября;
   - Отмечаете дни недели (например: Пятница, Суббота, Воскресенье);
   - Вводите время отправления через запятую: \`19:00, 21:30\`;
   - Нажимаете «Сгенерировать регулярные рейсы» — система сама создает все рейсы на сезон вперед!
3. **Автоматическая защита от ошибок**:
   - Система не даст назначить один и тот же корабль на два рейса одновременно;
   - Предупредит, если между рейсами меньше 20 минут (нужно время на высадку и уборку);
   - Проверит, чтобы одни и те же музыканты не были назначены на разные теплоходы одновременно.`,
    linkTarget: 'programs',
    linkLabel: 'Перейти в Менеджер программ',
    keywords: ['расписание', 'сезон', 'регулярные рейсы', 'генерация', 'программа', 'репертуар', 'конфликты', 'время', 'музыканты']
  },
  {
    id: 'hotel_concierge_b2b',
    category: 'Партнеры и Отели 5★',
    title: 'Как работают продажи через отели («Астория», «Европа», «Radisson»)?',
    summary: 'Консьержи отелей оформляют билеты для гостей в 1 клик с номера комнаты, а система сама делит комиссию между отелем и консьержем.',
    content: `Для пятизвездочных отелей Санкт-Петербурга сделан специальный **«Кабинет отеля» (AgentPanel)**:

1. **Режим консьержа на ресепшн**:
   - Консьерж выбирает вечернюю прогулку на схеме теплохода;
   - Вводит фамилию гостя и номер комнаты;
   - Печатает фирменный ваучер для гостя.
2. **Полиграфические QR-коды для стоек**:
   - Отель получает красивый QR-код для размещения на стойке ресепшн или в номерах;
   - Гость сканирует код своим смартфоном, сам покупает билет со скидкой, а комиссия автоматически начисляется отелю.
3. **Автоматическое сплитование комиссии**:
   - Система сама рассчитывает процент отеля (например, 15%) и персональный бонус консьержа;
   - Бухгалтерия в конце месяца выгружает готовый акт сверки в 1 клик.`,
    linkTarget: 'agent',
    linkLabel: 'Открыть Кабинет отелей и партнеров',
    keywords: ['отель', 'отели', 'астория', 'европа', 'radisson', 'консьерж', 'партнеры', 'комиссия', 'ваучер', 'номер комнаты', 'b2b']
  }
];

// Умный поиск с эмуляцией интеллектуального ассистента (AI-консультант)
function answerWithAI(userQuery) {
  const query = userQuery.toLowerCase().trim();
  if (!query) return null;

  // Ищем совпадения по ключевым словам и релевантности
  const scored = CLIENT_KNOWLEDGE_BASE.map(item => {
    let score = 0;
    const words = query.split(/\s+/);
    
    // Проверка совпадения точных ключевых слов
    item.keywords.forEach(kw => {
      if (query.includes(kw)) score += 5;
    });

    // Проверка заголовка и контента
    words.forEach(w => {
      if (w.length > 2) {
        if (item.title.toLowerCase().includes(w)) score += 3;
        if (item.summary.toLowerCase().includes(w)) score += 2;
        if (item.content.toLowerCase().includes(w)) score += 1;
      }
    });

    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const bestMatches = scored.filter(s => s.score > 0);

  if (bestMatches.length === 0) {
    return {
      type: 'general',
      text: `Я проанализировал документацию платформы, но по фразе «${userQuery}» не нашел прямого ответа. \n\nВы можете спросить меня простыми словами, например:\n• «Что делать, если теплоход сломался?»\n• «Как промоутеры на улице узнают, сколько мест осталось?»\n• «Какие корабли внесены в базу?»\n• «Насколько быстро обновляется загрузка?»`,
      relevantItems: CLIENT_KNOWLEDGE_BASE.slice(0, 3)
    };
  }

  const primary = bestMatches[0].item;
  const others = bestMatches.slice(1, 3).map(b => b.item);

  return {
    type: 'match',
    primary,
    others,
    aiSummary: `По вашему запросу «${userQuery}» вот краткий ответ простыми словами:\n\n${primary.summary}`,
    detailedContent: primary.content
  };
}

export default function ClientDocsPortal({ onNavigateToSection }) {
  const [activeTab, setActiveTab] = useState('docs'); // 'docs' | 'voice_tz'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все разделы');
  const [expandedId, setExpandedId] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [isAskingAi, setIsAskingAi] = useState(false);

  // Категории
  const categories = useMemo(() => {
    const set = new Set(CLIENT_KNOWLEDGE_BASE.map(item => item.category));
    return ['Все разделы', ...Array.from(set)];
  }, []);

  // Фильтрация статей
  const filteredArticles = useMemo(() => {
    return CLIENT_KNOWLEDGE_BASE.filter(item => {
      const matchCat = selectedCategory === 'Все разделы' || item.category === selectedCategory;
      const matchSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keywords.some(k => k.includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Задать вопрос ИИ
  const handleAskAI = (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    setIsAskingAi(true);
    setTimeout(() => {
      const answer = answerWithAI(searchQuery);
      setAiResponse(answer);
      setIsAskingAi(false);
    }, 400); // Быстрый и плавный отклик
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    setAiResponse(null);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px', color: '#0f172a' }}>
      
      {/* 1. HERO HEADER: ДЛЯ ЗАКАЗЧИКА */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #38bdf8 100%)',
          borderRadius: '20px',
          padding: '36px 32px',
          color: '#ffffff',
          marginBottom: '20px',
          boxShadow: '0 12px 30px -10px rgba(37, 99, 235, 0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', padding: '6px 14px', borderRadius: '30px', fontSize: '13px', fontWeight: 'bold', marginBottom: '14px' }}>
            <Compass size={16} /> Интерактивная справка и база знаний для Заказчика
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 10px 0', lineHeight: '1.2' }}>
            Как устроена и работает билетная платформа флота
          </h1>
          <p style={{ fontSize: '16px', color: '#e0f2fe', margin: 0, maxWidth: '750px', lineHeight: '1.5' }}>
            Здесь простыми словами описаны все процессы флота, а также встроен голосовой ассистент для надиктовывания новых идей и ТЗ в 1 клик.
          </p>
        </div>
      </div>

      {/* ПЕРЕКЛЮЧАТЕЛЬ РЕЖИМОВ: БАЗА ЗНАНИЙ / НАДИКТОВАТЬ ТЗ */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('docs')}
          style={{
            flex: '1 1 200px',
            padding: '14px 20px',
            borderRadius: '12px',
            background: activeTab === 'docs' ? '#ffffff' : '#f1f5f9',
            border: activeTab === 'docs' ? '2px solid #2563eb' : '1px solid #cbd5e1',
            color: activeTab === 'docs' ? '#2563eb' : '#64748b',
            fontWeight: 'bold',
            fontSize: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            cursor: 'pointer',
            boxShadow: activeTab === 'docs' ? '0 4px 12px rgba(37,99,235,0.15)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <BookOpen size={20} />
          <span>База знаний и ИИ-поиск</span>
        </button>

        <button
          onClick={() => setActiveTab('voice_tz')}
          style={{
            flex: '1 1 200px',
            padding: '14px 20px',
            borderRadius: '12px',
            background: activeTab === 'voice_tz' ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : '#ffffff',
            border: activeTab === 'voice_tz' ? '2px solid #4f46e5' : '1px solid #cbd5e1',
            color: activeTab === 'voice_tz' ? '#ffffff' : '#334155',
            fontWeight: 'bold',
            fontSize: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            cursor: 'pointer',
            boxShadow: activeTab === 'voice_tz' ? '0 6px 16px rgba(79,70,229,0.3)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Mic size={20} color={activeTab === 'voice_tz' ? '#ffffff' : '#e11d48'} />
          <span>🎙️ Надиктовать ТЗ голосом</span>
          <span style={{ fontSize: '11px', background: activeTab === 'voice_tz' ? 'rgba(255,255,255,0.25)' : '#fee2e2', color: activeTab === 'voice_tz' ? '#fff' : '#b91c1c', padding: '2px 8px', borderRadius: '12px' }}>
            NEW
          </span>
        </button>
      </div>

      {/* РЕЖИМ 1: НАДИКТОВАТЬ ТЗ */}
      {activeTab === 'voice_tz' && (
        <VoiceTzRecorder onSaved={(res) => {
          console.log('TZ saved:', res);
        }} />
      )}

      {/* РЕЖИМ 2: БАЗА ЗНАНИЙ И ИИ-ПОИСК */}
      {activeTab === 'docs' && (
        <>

      {/* 2. УМНЫЙ ПОИСК С УЧАСТИЕМ ИИ */}
      <div 
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '20px 24px',
          marginBottom: '28px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Sparkles size={20} color="#7c3aed" />
          <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 'bold', color: '#1e1b4b' }}>
            Умный ИИ-помощник (Задайте вопрос своими словами)
          </h3>
        </div>
        <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#64748b' }}>
          Спросите что угодно на простом языке, например: <em>«Что делать, если теплоход сломался?»</em> или <em>«Как промоутеры видят остаток мест?»</em>
        </p>

        <form onSubmit={handleAskAI} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            <input 
              type="text"
              placeholder="Введите ваш вопрос своими словами..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isAskingAi || !searchQuery.trim()}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: searchQuery.trim() ? 'pointer' : 'not-allowed',
              opacity: searchQuery.trim() ? 1 : 0.6,
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}
          >
            {isAskingAi ? <RefreshCw size={18} className="animate-spin" /> : <Bot size={18} />}
            <span>Спросить ИИ</span>
          </button>

          {(searchQuery || aiResponse) && (
            <button
              type="button"
              onClick={handleResetSearch}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                background: '#f1f5f9',
                color: '#64748b',
                border: '1px solid #cbd5e1',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Сброс
            </button>
          )}
        </form>

        {/* Быстрые подсказки-вопросы */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
          <span style={{ fontSize: '12px', color: '#64748b', alignSelf: 'center' }}>Популярные вопросы:</span>
          {[
            'Что если корабль сломался?',
            'Как промоутеры на улице продают билеты?',
            'Какие корабли в базе?',
            'Что меняется на схеме при покупке?'
          ].map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSearchQuery(prompt);
                const answer = answerWithAI(prompt);
                setAiResponse(answer);
              }}
              style={{
                fontSize: '12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '4px 10px',
                borderRadius: '20px',
                color: '#2563eb',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* 3. БЛОК ОТВЕТА ОТ ИИ (ЕСЛИ ЗАДАН ВОПРОС) */}
      {aiResponse && (
        <div 
          style={{
            background: '#faf5ff',
            border: '2px solid #c084fc',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 8px 20px -6px rgba(168, 85, 247, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#7c3aed', padding: '8px', borderRadius: '10px', color: '#fff' }}>
                <Bot size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#581c87', fontWeight: 'bold' }}>
                  Ответ ИИ-консультанта платформы
                </h3>
                <div style={{ fontSize: '12px', color: '#7e22ce' }}>
                  Сформирован на основе официальной документации системы
                </div>
              </div>
            </div>
            <button
              onClick={() => setAiResponse(null)}
              style={{ background: 'none', border: 'none', color: '#9333ea', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
            >
              Скрыть ответ ✕
            </button>
          </div>

          {aiResponse.type === 'match' ? (
            <div>
              {/* Краткий ответ */}
              <div 
                style={{
                  background: '#ffffff',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: '1px solid #e9d5ff',
                  fontSize: '15px',
                  lineHeight: '1.6',
                  color: '#3b0764',
                  marginBottom: '16px',
                  fontWeight: '500'
                }}
              >
                <strong>💡 Кратко простыми словами:</strong>
                <p style={{ margin: '8px 0 0 0' }}>{aiResponse.primary.summary}</p>
              </div>

              {/* Развернутый официальный пункт документации */}
              <div 
                style={{
                  background: '#ffffff',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #e9d5ff',
                  fontSize: '14px',
                  lineHeight: '1.7',
                  color: '#1e293b'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                  <span style={{ fontWeight: 'bold', color: '#2563eb', fontSize: '16px' }}>
                    📖 {aiResponse.primary.title}
                  </span>
                  {aiResponse.primary.linkTarget && (
                    <button
                      onClick={() => onNavigateToSection && onNavigateToSection(aiResponse.primary.linkTarget)}
                      style={{
                        padding: '6px 12px',
                        background: '#eff6ff',
                        color: '#2563eb',
                        border: '1px solid #bfdbfe',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <ExternalLink size={14} /> {aiResponse.primary.linkLabel}
                    </button>
                  )}
                </div>

                <div style={{ whiteSpace: 'pre-line' }}>
                  {aiResponse.detailedContent}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', color: '#475569', fontSize: '14px', whiteSpace: 'pre-line' }}>
              {aiResponse.text}
            </div>
          )}
        </div>
      )}

      {/* 4. РУБРИКАТОР ПО КАТЕГОРИЯМ */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' }}>
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: selectedCategory === cat ? '1px solid #2563eb' : '1px solid #cbd5e1',
              background: selectedCategory === cat ? '#2563eb' : '#ffffff',
              color: selectedCategory === cat ? '#ffffff' : '#475569',
              fontSize: '13px',
              fontWeight: selectedCategory === cat ? 'bold' : '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 5. КАТАЛОГ СТАТЕЙ И РАЗДЕЛОВ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredArticles.map(article => {
          const isExpanded = expandedId === article.id;
          return (
            <div
              key={article.id}
              style={{
                background: '#ffffff',
                border: isExpanded ? '2px solid #2563eb' : '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                transition: 'all 0.2s'
              }}
            >
              <div 
                onClick={() => setExpandedId(isExpanded ? null : article.id)}
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}
              >
                <div>
                  <div style={{ display: 'inline-block', fontSize: '11px', fontWeight: 'bold', color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '6px', marginBottom: '6px' }}>
                    {article.category}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 'bold', color: '#0f172a' }}>
                    {article.title}
                  </h3>
                  <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
                    {article.summary}
                  </p>
                </div>

                <div 
                  style={{
                    background: isExpanded ? '#eff6ff' : '#f8fafc',
                    color: isExpanded ? '#2563eb' : '#64748b',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontWeight: 'bold'
                  }}
                >
                  {isExpanded ? '▲' : '▼'}
                </div>
              </div>

              {/* Развернутое содержимое статьи */}
              {isExpanded && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155', whiteSpace: 'pre-line' }}>
                    {article.content}
                  </div>

                  {article.linkTarget && (
                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => onNavigateToSection && onNavigateToSection(article.linkTarget)}
                        style={{
                          padding: '8px 16px',
                          background: '#2563eb',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <ExternalLink size={14} /> {article.linkLabel}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredArticles.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <HelpCircle size={40} color="#94a3b8" style={{ marginBottom: '10px' }} />
            <h4 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Ничего не найдено</h4>
            <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#64748b' }}>Попробуйте изменить формулировку вопроса или сбросить фильтры</p>
          </div>
        )}
      </div>
      </>
      )}

    </div>
  );
}
