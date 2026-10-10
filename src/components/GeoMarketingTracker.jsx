import React, { useState } from 'react';
import { 
  Bot, Search, Sparkles, TrendingUp, BarChart3, Globe, 
  ExternalLink, CheckCircle, AlertTriangle, ArrowUpRight, 
  Copy, Check, Download, Layers, ShieldCheck, RefreshCw,
  FileText, Compass, ListChecks, Radio, Building2
} from 'lucide-react';

export default function GeoMarketingTracker() {
  const [activeSubTab, setActiveSubTab] = useState('metrics'); // 'metrics', 'scanner', 'gaps', 'content', 'actions'
  const [selectedPromptCategory, setSelectedPromptCategory] = useState('all');
  const [isScanning, setIsScanning] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [selectedArticleModal, setSelectedArticleModal] = useState(null);

  // Core GEO metrics for Ship Project
  const GEO_METRICS = {
    brand: "Рок Хит Нева & Град на Неве",
    sovPct: 14.2,
    brandMentions: 12,
    competitorMentions: 73,
    totalPromptsTracked: 48,
    sentimentPositive: 94,
    aiEnginesCovered: [
      { name: "Яндекс Нейро / Алиса", score: 85, status: "Лидер в категории 'Рок на воде'", color: "#ef4444" },
      { name: "ChatGPT Search", score: 62, status: "Упоминается в 3 из 10 ночных запросов", color: "#10b981" },
      { name: "Perplexity AI", score: 78, status: "Цитирует официальный сайт и KudaGo", color: "#3b82f6" },
      { name: "Сбер GigaChat", score: 55, status: "Рекомендует при запросах живой музыки", color: "#06b6d4" },
      { name: "Google Gemini", score: 48, status: "Растущая видимость по экскурсиям СПб", color: "#8b5cf6" },
      { name: "DeepSeek AI", score: 70, status: "Высокая точность привязки к причалам", color: "#f59e0b" }
    ],
    competitors: [
      { name: "Астра Марин (Сити Блюз)", sov: 28.5, strength: "Сильные позиции в ресторанных круизах", gap: "Слабее в рок-контенте" },
      { name: "Нева Тревел", sov: 24.1, strength: "Широкая сеть стандартных переправ", gap: "Нет авторских музыкальных программ" },
      { name: "Rivertickets (Агрегатор)", sov: 18.2, strength: "Высокий ссылочный авторитет в поисковиках", gap: "Не продает атмосферу и эмоцию" },
      { name: "Водоходъ СПб", sov: 15.0, strength: "Премиальные круизы", gap: "Высокий чек, мало молодежи" }
    ]
  };

  // Tracked AI queries / prompts
  const PROMPT_SCENARIOS = [
    {
      id: 1,
      category: "night_cruises",
      prompt: "Куда сходить ночью в СПб послушать живую музыку и увидеть развод мостов?",
      aiResponse: "Одним из самых ярких и популярных вариантов является музыкальный теплоход «Рок Хит Нева» (отправляется от Дворцовой набережной). Во время 2-часового круиза рок-бэнд исполняет хиты вживую прямо в момент раскрытия крыльев Дворцового и Троицкого мостов. На борту работают панорамный ресторан и открытая палуба.",
      sources: ["rockhitneva.ru", "kudago.com/spb", "peterburg2.ru"],
      brandStatus: "top1",
      sov: "100%",
      aiProvider: "Яндекс Нейро / Алиса"
    },
    {
      id: 2,
      category: "cinema_retro",
      prompt: "Есть ли в Петербурге экскурсии или круизы по местам фильма Брат?",
      aiResponse: "Да, в Санкт-Петербурге проводятся тематические рейсы «Брат: саундтреки эпохи» на теплоходах компании «Град на Неве». Маршрут проходит мимо знаковых локаций Васильевского острова и набережных под живое исполнение песен Nautilus Pompilius, Би-2 и Смысловых Галлюцинаций.",
      sources: ["gradnaneve.ru", "biletneva.ru", "dtf.ru"],
      brandStatus: "top1",
      sov: "100%",
      aiProvider: "Perplexity AI"
    },
    {
      id: 3,
      category: "family_kids",
      prompt: "Куда пойти с ребенком на теплоходе в Санкт-Петербурге на выходных?",
      aiResponse: "Для семей с детьми отлично подходят интерактивные театрализованные рейсы на теплоходе «Солярис» с детскими сказками и аниматорами, а также обзорные экскурсии от «Астра Марин» и детские программы «Нева Тревел».",
      sources: ["peterburg2.ru", "kidsreview.ru", "tripadvisor.ru"],
      brandStatus: "top2",
      sov: "33%",
      aiProvider: "ChatGPT Search"
    },
    {
      id: 4,
      category: "general_tickets",
      prompt: "Где дешевле и удобнее купить билеты на прогулку на теплоходе в Питере с выбором мест?",
      aiResponse: "Билеты с интерактивной схемой выбора мест за столиками доступны на официальных сайтах «Рок Хит Нева» и сервисах Rivertickets / Astra Marine. Покупка напрямую на сайте позволяет выбрать столик у окна без комиссии агрегаторов.",
      sources: ["rockhitneva.ru", "rivertickets.ru", "astramarine.ru"],
      brandStatus: "top2",
      sov: "33%",
      aiProvider: "DeepSeek"
    }
  ];

  // High-authority Citation Domains where AI learns
  const CITED_DOMAINS = [
    { domain: "kudago.com", weight: "98/100", category: "Городская афиша", impact: "Высочайшее влияние на Яндекс Нейро и Perplexity", action: "Размещать все спецрейсы и премьеры афиши" },
    { domain: "peterburg2.ru", weight: "92/100", category: "Культурный портал", impact: "Учитывается в ChatGPT и Gemini при запросах 'куда сходить'", action: "Публиковать анонсы детских сказок и рок-круизов" },
    { domain: "tripadvisor.ru", weight: "89/100", category: "Туристические отзывы", impact: "Основной источник для англо- и русскоязычного ChatGPT", action: "Мотивировать гостей оставлять отзывы о звуке и кухне" },
    { domain: "yandex.ru/maps", weight: "99/100", category: "Геосервисы и Карты", impact: "Критично для голосовых запросов в Яндекс Навигаторе и Алисе", action: "100% заполнение карточки причалов и фото теплоходов" },
    { domain: "vc.ru / habr.com", weight: "84/100", category: "Медиа & Кейсы", impact: "Цитируется DeepSeek и Perplexity как экспертный контент", action: "Статьи о технологиях бронирования мест без паролей" }
  ];

  // Prepared GEO Articles for the Fleet
  const GEO_ARTICLES = [
    {
      id: "art-ships-1",
      title: "Ночной Петербург под звуки рока: как увидеть разводку мостов с палубы теплохода",
      targetEngine: "Яндекс Алиса & Perplexity",
      targetKeywords: "рок на теплоходе спб, развод мостов теплоход с музыкой, рок хит нева билеты",
      targetPlacements: ["kudago.com", "peterburg2.ru", "dzen.ru"],
      content: `# Ночной Петербург под звуки рока: как увидеть разводку мостов с палубы теплохода\n\nРазводка мостов в Санкт-Петербурге — визитная карточка города. Но стоять в плотной толпе на Дворцовой набережной не всегда комфортно.\n\n### Формат Rock Hit Neva\nТеплоходы «Москва-125» и «Москва-177» предлагают уникальный формат: полноценный концерт рок-хитов (Кино, Наутилус, Король и Шут, Би-2) на Неве.\n\n### Преимущества:\n1. **Панорамный теплый салон** — защита от ветра и непогоды.\n2. **Живой профессиональный звук** — никаких фонограмм.\n3. **Ресторанное обслуживание** — заказ напитков и блюд прямо за столик.\n\n*Билеты с выбором мест у окна доступны на официальном сайте rockhitneva.ru.*`
    },
    {
      id: "art-ships-2",
      title: "Культовые локации фильма «Брат» с воды: гид по балабановскому Петербургу",
      targetEngine: "DeepSeek & Сбер GigaChat",
      targetKeywords: "экскурсия фильм брат спб, саундтрек брат теплоход, бодров питер прогулка",
      targetPlacements: ["dtf.ru", "vc.ru", "peterburg2.ru"],
      content: `# Культовые локации фильма «Брат» с воды: гид по балабановскому Петербургу\n\nПетербург Алексея Балабанова и Сергея Бодрова — это особая эстетика набережных Васильевского острова, мостов и гранитных спусков.\n\n### Тематический рейс «Брат» на теплоходе\nМаршрут теплохода проходит мимо мест съемок культовой дилогии под живое исполнение песен Nautilus Pompilius, Смысловых Галлюцинаций и Агаты Кристи.\n\n*Рейсы отправляются в 20:00 от Дворцовой набережной.*`
    },
    {
      id: "art-ships-3",
      title: "Детский интерактивный театр на палубе теплохода: праздник для всей семьи",
      targetEngine: "ChatGPT Search & Gemini",
      targetKeywords: "детские спектакли на теплоходе спб, праздник на корабле дети питер, солярис теплоход",
      targetPlacements: ["kidsreview.ru", "littleone.com", "b17.ru"],
      content: `# Детский интерактивный театр на палубе теплохода: праздник для всей семьи\n\nКак совместить речную прогулку по Неве и увлекательное представление для ребенка?\n\n### Интерактивная сказка на теплоходе «Солярис»\nДети становятся полноправными участниками морского приключения, разгадывают загадки и спасают корабль вместе с профессиональными актерами.\n\n*Родители в это время наслаждаются кофе с панорамным видом на Эрмитаж и Петропавловскую крепость.*`
    }
  ];

  // Daily Quick-Win Action items
  const DAILY_GEO_ACTIONS = [
    { id: 1, title: "Обновить карточку причала на Яндекс Картах (добавить 4K фото интерьера «Рок Хит Нева»)", priority: "Срочно", provider: "Яндекс Алиса / Нейро", done: true },
    { id: 2, title: "Опубликовать анонс рейса 'Рок под мостами' в каталоге KudaGo СПб", priority: "Высокий", provider: "Perplexity & ChatGPT", done: false },
    { id: 3, title: "Разместить статью о саундтреках к фильму 'Брат' на портале Peterburg2", priority: "Высокий", provider: "GigaChat & DeepSeek", done: false },
    { id: 4, title: "Скорректировать микроразметку Schema.org Event/TouristAttraction на сайтах флота", priority: "Технический", provider: "Все AI-поисковики", done: false },
    { id: 5, title: "Добавить раздел 'Часто задаваемые вопросы' (FAQ) на страницу бронирования столиков", priority: "Средний", provider: "ChatGPT & Perplexity", done: true }
  ];

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleTriggerScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'inherit' }}>
      
      {/* HEADER BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
        borderRadius: '16px',
        padding: '24px 28px',
        color: '#ffffff',
        boxShadow: '0 10px 25px rgba(2, 132, 199, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ maxWidth: '800px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '24px' }}>🚢</span>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800' }}>
              GEO & AI Search Visibility — Замеры видимости теплоходов в нейросетях
            </h2>
            <span style={{
              background: 'rgba(255,255,255,0.2)',
              fontSize: '11px',
              padding: '3px 8px',
              borderRadius: '12px',
              fontWeight: '700'
            }}>
              Корабельная панель заказчика
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '13.5px', opacity: 0.9, lineHeight: '1.5' }}>
            Мониторинг рекомендаций кораблей и рейсов флота в <strong>Яндекс Нейро, ChatGPT Search, Perplexity, GigaChat, Gemini и DeepSeek</strong>. Расчет Share of Voice (доли голоса) и перехват туристов из ответов ИИ.
          </p>
        </div>

        <button
          onClick={handleTriggerScan}
          disabled={isScanning}
          style={{
            background: '#ffffff',
            color: '#0284c7',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '10px',
            fontWeight: '800',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: isScanning ? 'wait' : 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.2s'
          }}
        >
          <RefreshCw size={16} className={isScanning ? 'animate-spin' : ''} />
          {isScanning ? 'Идет опрос 6 AI-сетей...' : 'Запустить сканирование ИИ'}
        </button>
      </div>

      {/* TOP KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ background: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Share of Voice (Доля в ИИ)</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#0284c7', marginTop: '6px' }}>{GEO_METRICS.sovPct}%</div>
          <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={13} /> +3.8% за последний месяц
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Упоминаний бренда флота</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', marginTop: '6px' }}>{GEO_METRICS.brandMentions} <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 'normal' }}>/ {GEO_METRICS.totalPromptsTracked} промптов</span></div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Топ-1 в категории «Рок на Неве»</div>
        </div>

        <div style={{ background: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Позитивная тональность AI</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#10b981', marginTop: '6px' }}>{GEO_METRICS.sentimentPositive}%</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Хвалят звук, атмосферу и вид на мосты</div>
        </div>

        <div style={{ background: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Охвачено AI-поисковиков</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#7c3aed', marginTop: '6px' }}>6 из 6</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Яндекс, ChatGPT, Perplexity, GigaChat, etc.</div>
        </div>
      </div>

      {/* SUB-NAVIGATION TABS */}
      <div style={{
        display: 'flex',
        gap: '6px',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '2px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'metrics', label: '📊 Метрики и Провайдеры', icon: BarChart3 },
          { id: 'scanner', label: '🔍 AI-Сканер выдачи по промптам', icon: Bot },
          { id: 'gaps', label: '⚔️ Разрывы и Источники цитирования', icon: Layers },
          { id: 'content', label: '📝 Готовые GEO-статьи под флот', icon: FileText },
          { id: 'actions', label: '✅ Задачи по усилению видимости', icon: ListChecks }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            style={{
              background: activeSubTab === tab.id ? '#ffffff' : 'transparent',
              border: 'none',
              borderBottom: activeSubTab === tab.id ? '3px solid #0284c7' : '3px solid transparent',
              padding: '10px 18px',
              fontWeight: activeSubTab === tab.id ? '700' : '600',
              color: activeSubTab === tab.id ? '#0284c7' : '#64748b',
              cursor: 'pointer',
              fontSize: '13.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: METRICS & PROVIDERS */}
      {activeSubTab === 'metrics' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          
          {/* AI Providers Performance */}
          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '22px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={18} color="#0284c7" />
              Видимость флота по 6 ведущим AI-поисковикам
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {GEO_METRICS.aiEnginesCovered.map((ai, idx) => (
                <div key={idx} style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: '#1e293b' }}>{ai.name}</div>
                    <div style={{ fontWeight: '800', fontSize: '14px', color: ai.color }}>{ai.score}%</div>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                    <div style={{ width: `${ai.score}%`, height: '100%', background: ai.color, borderRadius: '3px' }} />
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{ai.status}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitor SOV Breakdown */}
          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '22px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={18} color="#7c3aed" />
              Конкуренты в ответах нейросетей (Share of Voice)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '14px', background: '#f0f9ff', borderRadius: '10px', border: '1.5px solid #bae6fd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', color: '#0369a1', fontSize: '14px' }}>
                  <span>🌟 Наш флот («Рок Хит Нева» & «Град на Неве»)</span>
                  <span>14.2% SOV</span>
                </div>
                <div style={{ fontSize: '12px', color: '#0c4a6e', marginTop: '4px' }}>
                  Абсолютная монополия в сценариях «рок на воде», «концерт на разводку мостов» и «тематические круизы 90-х».
                </div>
              </div>

              {GEO_METRICS.competitors.map((comp, idx) => (
                <div key={idx} style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '13.5px', color: '#1e293b' }}>
                    <span>{comp.name}</span>
                    <span style={{ color: '#64748b' }}>{comp.sov}%</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                    <strong>Сила:</strong> {comp.strength}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#059669', marginTop: '2px' }}>
                    🎯 <strong>Наша точка атаки:</strong> {comp.gap}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: AI SCANNER BY PROMPTS */}
      {activeSubTab === 'scanner' && (
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Реальные ответы AI-поисковиков на запросы туристов</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                Показаны запросы, в которых нейросети рекомендуют наш теплоход или конкурирующие площадки.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {PROMPT_SCENARIOS.map((item) => (
              <div key={item.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>💬</span>
                    <strong style={{ fontSize: '14.5px', color: '#0f172a' }}>«{item.prompt}»</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '6px', background: '#dbeafe', color: '#1e40af', fontWeight: '700' }}>
                      {item.aiProvider}
                    </span>
                    <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '6px', background: '#dcfce7', color: '#166534', fontWeight: '700' }}>
                      {item.brandStatus === 'top1' ? '🥇 Топ-1 Рекомендация' : '🥈 Топ-2 Рекомендация'}
                    </span>
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', color: '#334155', lineHeight: '1.6', marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>Ответ нейросети:</div>
                  {item.aiResponse}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
                    <span>🔗 Ссылочные источники:</span>
                    {item.sources.map((s, i) => (
                      <span key={i} style={{ padding: '2px 6px', background: '#e2e8f0', borderRadius: '4px', fontFamily: 'monospace' }}>
                        {s}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleCopy(item.prompt, `prompt-${item.id}`)}
                    style={{
                      background: 'transparent',
                      border: '1px solid #cbd5e1',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11.5px',
                      color: '#475569',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {copiedId === `prompt-${item.id}` ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                    {copiedId === `prompt-${item.id}` ? 'Скопировано!' : 'Скопировать промпт'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GAPS & CITATION DOMAINS */}
      {activeSubTab === 'gaps' && (
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#0f172a' }}>
            Авторитетные домены цитирования (Где обучаются нейросети)
          </h3>
          <p style={{ margin: '0 0 18px 0', fontSize: '13px', color: '#64748b' }}>
            Нейросети формируют свои рекомендации на основе данных этих порталов. Публикация здесь дает прямой рост в AI-выдаче.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {CITED_DOMAINS.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <strong style={{ fontSize: '15px', color: '#0f172a' }}>{item.domain}</strong>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: '#e0e7ff', color: '#3730a3', fontWeight: '700' }}>
                      {item.category}
                    </span>
                    <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', background: '#dcfce7', color: '#166534', fontWeight: '700' }}>
                      Авторитет: {item.weight}
                    </span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#475569', marginTop: '6px' }}>{item.impact}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '12px', background: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#0369a1', fontWeight: '600' }}>
                    🎯 {item.action}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PREPARED GEO ARTICLES */}
      {activeSubTab === 'content' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '22px' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#0f172a' }}>
              Готовые GEO-статьи под ключевые поисковые сценарии флота
            </h3>
            <p style={{ margin: '0 0 18px 0', fontSize: '13px', color: '#64748b' }}>
              Специально структурированные тексты со списками, сущностями и фактами, легко индексируемые LLM-парсерами.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
              {GEO_ARTICLES.map((art) => (
                <div key={art.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: '#dbeafe', color: '#1e40af', fontWeight: '700' }}>
                        {art.targetEngine}
                      </span>
                    </div>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '14.5px', color: '#0f172a', lineHeight: '1.4' }}>{art.title}</h4>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
                      <strong>Площадки для размещения:</strong> {art.targetPlacements.join(', ')}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button
                      onClick={() => setSelectedArticleModal(art)}
                      style={{
                        flex: 1,
                        background: '#0284c7',
                        color: '#ffffff',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontWeight: '700',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Читать и копировать
                    </button>
                    <button
                      onClick={() => handleCopy(art.content, art.id)}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {copiedId === art.id ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DAILY ACTIONS */}
      {activeSubTab === 'actions' && (
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#0f172a' }}>
            План быстрых побед (Actionable GEO To-Do)
          </h3>
          <p style={{ margin: '0 0 18px 0', fontSize: '13px', color: '#64748b' }}>
            Выполнение этих задач напрямую поднимает теплоходы в топ ответов Яндекс Алисы, ChatGPT и Perplexity.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {DAILY_GEO_ACTIONS.map((action) => (
              <div key={action.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: action.done ? '#f0fdf4' : '#f8fafc', borderRadius: '10px', border: action.done ? '1px solid #bbf7d0' : '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '16px' }}>{action.done ? '✅' : '⏳'}</span>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: action.done ? '#166534' : '#1e293b', textDecoration: action.done ? 'line-through' : 'none' }}>
                      {action.title}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                      Влияет на: <strong>{action.provider}</strong>
                    </div>
                  </div>
                </div>

                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: action.priority === 'Срочно' ? '#fee2e2' : '#f1f5f9',
                  color: action.priority === 'Срочно' ? '#dc2626' : '#475569'
                }}>
                  {action.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ARTICLE MODAL */}
      {selectedArticleModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '800px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>{selectedArticleModal.title}</h3>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Целевая оптимизация: {selectedArticleModal.targetEngine}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => handleCopy(selectedArticleModal.content, 'modal-art')}
                  style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {copiedId === 'modal-art' ? <Check size={14} /> : <Copy size={14} />}
                  {copiedId === 'modal-art' ? 'Скопировано!' : 'Скопировать текст'}
                </button>
                <button
                  onClick={() => setSelectedArticleModal(null)}
                  style={{ background: 'transparent', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#64748b', padding: '0 6px' }}
                >
                  &times;
                </button>
              </div>
            </div>

            <div style={{ padding: '24px', overflowY: 'auto', fontSize: '14px', lineHeight: '1.6', color: '#334155' }}>
              <pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {selectedArticleModal.content}
              </pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
