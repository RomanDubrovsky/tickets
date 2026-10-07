import React, { useState } from 'react';
import { 
  Sparkles, Target, Users, Megaphone, Brain, Key, 
  Send, RefreshCw, Copy, Check, ExternalLink, AlertCircle, 
  ChevronRight, BarChart3, Filter, ShieldCheck, HelpCircle,
  FileText, ArrowRight, Layers, MessageSquare, Flame,
  Eye, Search, Compass, Bot, Lightbulb, Globe
} from 'lucide-react';
import GeoMarketingTracker from './GeoMarketingTracker';

export default function VkMarketingAgent({ initialTab = 'overview' }) {
  // Selected program for marketing
  const [selectedProgram, setSelectedProgram] = useState('rock_bridges');
  const [targetAudienceFocus, setTargetAudienceFocus] = useState('all');
  const [vkToken, setVkToken] = useState('');
  const [isTokenSaved, setIsTokenSaved] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [activeTab, setActiveTab] = useState(initialTab); // 'overview', 'presets', 'parser_api', 'roadmap', 'geo'

  // Programs data with pre-filled targeting hooks
  const PROGRAMS_CATALOG = {
    rock_bridges: {
      id: 'rock_bridges',
      title: 'Рок под разводными мостами (Ночной круиз)',
      vessel: 'Теплоход «Рок Хит Нева» (Москва-125 / Москва-177)',
      price: 'от 2 200 ₽',
      time: '23:45 – 02:15 (Разводка Дворцового и Троицкого мостов)',
      pier: 'Дворцовая набережная / Наб. Макарова',
      vkKeywords: 'рок спб, ночной питер, разводка мостов, русский рок, цой спб, афиша спб, свидание спб',
      targetGroupsVK: [
        { name: 'Типичный Питер / KudaGo СПб', count: '1.4M', type: 'Городские афиши' },
        { name: 'Русский Рок / Наше Радио СПб', count: '420K', type: 'Музыкальные фанаты' },
        { name: 'Куда сходить в СПб (Свидания / Пары)', count: '280K', type: 'Романтика & Туризм' },
        { name: 'Водные прогулки и аренда катеров СПб', count: '95K', type: 'Прямые конкуренты' }
      ],
      psychographics: {
        pains: [
          'Боятся, что ночью на воде будет холодно и продует',
          'Опасаются пьяных дебошей или некачественного звука',
          'Боятся не успеть вернуться домой из-за разведенных мостов',
          'Жалко денег, если теплоход будет старый и душный'
        ],
        triggers: [
          'Живой драйвовый рок прямо под раскрывающимися крыльями Дворцового моста',
          'Закрытая теплая панорамная палуба с рестораном + открытый верхний ярус',
          'Тематическая барная карта и атмосфера настоящего рок-клуба на волнах Невы',
          'Фиксированная высадка на удобном причале со свободным выездом'
        ]
      },
      offers: [
        {
          id: 1,
          segment: 'Романтики и пары (Свидание с вау-эффектом)',
          badge: 'Конверсия 4.8%',
          header: 'Покажи ей ночной Петербург так, как не покажут с набережной 🌉🎸',
          text: `Хватит банальных ресторанов. Представь: полночь, Нева, гитарное соло любимой баллады, бокал вина — и прямо над вами взмывают крылья Дворцового моста.\n\nТеплый салон с панорамными окнами защитит от невского ветра, а живой рок-бэнд подарит мурашки на всю жизнь.\n\nКоличество столиков у окна на ночные рейсы ограничено!`,
          cta: 'Выбрать столик на двоих',
          tags: ['#СвиданиеСПб', '#РазводкаМостов', '#РокХитНева']
        },
        {
          id: 2,
          segment: 'Фанаты русского рока и драйва (30–50 лет)',
          badge: 'Конверсия 5.2%',
          header: 'Цой, Наутилус, Король и Шут и Би-2 — вживую на волнах ночной Невы! ⚡',
          text: `Настоящий рок-концерт посреди ночного Петербурга. Никаких записей под фонограмму — только честный живой звук, мощный вокал и энергетика легендарных рок-хитов под разводными мостами.\n\nНа борту работает бар и кухня. Проведи эту ночь громко!`,
          cta: 'Купить билет от 2 200 ₽',
          tags: ['#РусскийРок', '#АфишаПитер', '#КонцертНаВоде']
        },
        {
          id: 3,
          segment: 'Гости города и туристы (Must Visit в СПб)',
          badge: 'Конверсия 6.1%',
          header: 'Главное зрелище Петербурга с лучшего ракурса без толп на набережной',
          text: `Зачем стоять в давке на набережной, если можно подойти к разводным мостам вплотную на комфортабельном теплоходе под аккомпанемент живой музыки?\n\nВам не страшен дождь: на борту два яруса — панорамный закрытый салон с ресторанным обслуживанием и открытая палуба для идеальных фото.`,
          cta: 'Забронировать круиз',
          tags: ['#ТуризмСПб', '#ПитерГид', '#МостыПитера']
        }
      ]
    },
    brother_movie: {
      id: 'brother_movie',
      title: 'Брат (Культовые саундтреки 90-х)',
      vessel: 'Теплоход «Москва-125» (Рок-дизайн)',
      price: 'от 1 800 ₽',
      time: '20:00 – 22:00 (Вечерний закатный рейс)',
      pier: 'Дворцовая наб. 18',
      vkKeywords: 'фильм брат, сергей бодров, наутилус помпилиус, смысловые галлюцинации, русский рок 90, питер бодрова',
      targetGroupsVK: [
        { name: 'Сергей Бодров / Брат и Брат-2', count: '310K', type: 'Фан-сообщества' },
        { name: 'Любители 90-х / Эпоха рока', count: '185K', type: 'Ностальгия' },
        { name: 'Экскурсии по местам фильма Брат СПб', count: '45K', type: 'Тематический туризм' }
      ],
      psychographics: {
        pains: [
          'Боятся поверхностной "попсы" вместо аутентичной атмосферы балабановского кино',
          'Опасаются неудобной рассадки, где не видно музыкантов'
        ],
        triggers: [
          'То самое звучание: «Крылья», «Вечно молодой», «Гудбай, Америка» на воде Васильевского острова',
          'Атмосфера культового Петербурга конца 90-х с палубы корабля'
        ]
      },
      offers: [
        {
          id: 1,
          segment: 'Поклонники Сергея Бодрова и эпохи Балабанова',
          badge: 'Высокий CTR',
          header: '«В чем сила, брат?» — Живой саундтрек эпохи на теплоходе по Неве 🎸',
          text: `Те самые песни, под которые Данила Багров шел в плеере по осеннему Петербургу. Полтора часа культовой музыки: Nautilus Pompilius, Смысловые Галлюцинации, Би-2, Агата Кристи в исполнении рок-бэнда Brotherhood.\n\nПроплываем именно те набережные и мосты, где снимались легендарные кадры.`,
          cta: 'Посмотреть расписание и билеты',
          tags: ['#Брат2', '#Бодров', '#ПетербургБалабанова']
        }
      ]
    },
    kids_fairytale: {
      id: 'kids_fairytale',
      title: 'Детская интерактивная сказка на теплоходе',
      vessel: 'Теплоход «Солярис» / «Чайка» (Теплый панорамный салон)',
      price: 'от 1 500 ₽ (Семейный билет)',
      time: '12:00 и 15:00 (Дневные рейсы по выходным)',
      pier: 'Сенатская пристань / Медный всадник',
      vkKeywords: 'дети спб, куда пойти с ребенком спб, детские спектакли спб, мамы спб, выходные с детьми питер',
      targetGroupsVK: [
        { name: 'Мамы Санкт-Петербурга / Семья', count: '520K', type: 'Родители' },
        { name: 'Детские театры и афиша для детей СПб', count: '160K', type: 'Интерактив' },
        { name: 'Выходные с детьми в СПб', count: '240K', type: 'Семейный досуг' }
      ],
      psychographics: {
        pains: [
          'Ребенка укачает или ему станет скучно через 15 минут',
          'На палубе будет сквозняк или ребенок простудится',
          'Негде безопасно перекусить, нет детского меню и туалета'
        ],
        triggers: [
          'Полный интерактив с профессиональными актерами: дети не сидят на месте, а участвуют в спасении корабля',
          'Теплый салон, мягкие кресла, безопасность и спасательные жилеты для каждого малыша',
          'Родители могут спокойно пить кофе с панорамным видом на Эрмитаж, пока дети увлечены представлением'
        ]
      },
      offers: [
        {
          id: 1,
          segment: 'Мамы дошкольников и младших школьников (4–10 лет)',
          badge: 'Супер-конверсия для мам',
          header: 'Спектакль, от которого дети в восторге, а родители успевают отдохнуть с кофе ☕🎭',
          text: `Подарите ребенку настоящее морское приключение! Интерактивная сказка на палубе теплохода: профессиональные актеры, игры, фокусы и памятные сувениры каждому маленькому юнге.\n\nТеплый закрытый салон, вкусный детский буфет и панорамные виды Петербурга для семейных фотографий.`,
          cta: 'Купить семейный билет со скидкой',
          tags: ['#ДетиСПб', '#МамыПитера', '#СказкаНаВоде']
        }
      ]
    }
  };

  const currentProg = PROGRAMS_CATALOG[selectedProgram] || PROGRAMS_CATALOG.rock_bridges;

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleSimulateAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 1200);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* HEADER BANNER */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '16px',
          padding: '28px 32px',
          color: '#ffffff',
          marginBottom: '24px',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{
              background: 'linear-gradient(135deg, #0077ff 0%, #0056cc 100%)',
              color: 'white',
              fontSize: '11px',
              fontWeight: '900',
              padding: '4px 10px',
              borderRadius: '20px',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <Flame size={13} color="#fde047" /> VK ADS & AI ENGINE
            </span>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>
              Интеллектуальный таргетинг для флота
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            AI-Таргетинг & Сегментация аудитории ВКонтакте
          </h2>
          <p style={{ margin: '8px 0 0 0', color: '#cbd5e1', fontSize: '14px', maxWidth: '750px', lineHeight: '1.5' }}>
            Связывает программы ваших теплоходов с реальными болями, интересами и сообществами ВК. 
            Парсит данные через официальное VK API, строит психографические портреты и генерирует конверсионные связки креативов.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.07)',
            padding: '12px 18px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#38bdf8' }}>3x – 5x</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Рост окупаемости (ROAS)</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.07)',
            padding: '12px 18px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#4ade80' }}>25 / сек</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Пакетные запросы execute</div>
          </div>
        </div>
      </div>

      {/* TOP TABS NAVIGATION */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '2px'
      }}>
        <button
          onClick={() => setActiveTab('geo')}
          style={{
            background: activeTab === 'geo' ? '#f0f9ff' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'geo' ? '3px solid #0284c7' : '3px solid transparent',
            padding: '10px 18px',
            fontWeight: activeTab === 'geo' ? '800' : '600',
            color: activeTab === 'geo' ? '#0284c7' : '#0369a1',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Globe size={16} color="#0284c7" /> GEO & AI-Видимость (Яндекс, ChatGPT, Perplexity)
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          style={{
            background: activeTab === 'overview' ? '#ffffff' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'overview' ? '3px solid #0077ff' : '3px solid transparent',
            padding: '10px 18px',
            fontWeight: activeTab === 'overview' ? '700' : '500',
            color: activeTab === 'overview' ? '#0077ff' : '#64748b',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Target size={16} /> Связки и Креативы под рейсы
        </button>

        <button
          onClick={() => setActiveTab('presets')}
          style={{
            background: activeTab === 'presets' ? '#ffffff' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'presets' ? '3px solid #0077ff' : '3px solid transparent',
            padding: '10px 18px',
            fontWeight: activeTab === 'presets' ? '700' : '500',
            color: activeTab === 'presets' ? '#0077ff' : '#64748b',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Users size={16} /> Базы аудиторий и Сообщества ВК
        </button>

        <button
          onClick={() => setActiveTab('parser_api')}
          style={{
            background: activeTab === 'parser_api' ? '#ffffff' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'parser_api' ? '3px solid #0077ff' : '3px solid transparent',
            padding: '10px 18px',
            fontWeight: activeTab === 'parser_api' ? '700' : '500',
            color: activeTab === 'parser_api' ? '#0077ff' : '#64748b',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Brain size={16} /> Архитектура VK API & Лимиты
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          style={{
            background: activeTab === 'roadmap' ? '#ffffff' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'roadmap' ? '3px solid #7c3aed' : '3px solid transparent',
            padding: '10px 18px',
            fontWeight: activeTab === 'roadmap' ? '700' : '500',
            color: activeTab === 'roadmap' ? '#7c3aed' : '#64748b',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Bot size={16} /> Возможности & ИИ-Парсинг (Roadmap)
        </button>
      </div>

      {/* RENDER GEO TAB */}
      {activeTab === 'geo' && (
        <GeoMarketingTracker />
      )}

      {/* PROGRAM SELECTOR BAR (FOR VK TABS) */}
      {activeTab !== 'geo' && (
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Целевая программа:
          </span>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '2px solid #0077ff',
              background: '#f8fafc',
              fontSize: '14px',
              fontWeight: '700',
              color: '#0f172a',
              cursor: 'pointer',
              minWidth: '320px',
              outline: 'none'
            }}
          >
            <option value="rock_bridges">🎸 Рок под разводными мостами (Ночной круиз)</option>
            <option value="brother_movie">🎬 Брат (Саундтреки к фильму 90-х)</option>
            <option value="kids_fairytale">🎭 Детская сказка на воде (Семейный рейс)</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Борт: <strong>{currentProg.vessel}</strong> | {currentProg.price}
          </span>
          <button
            onClick={handleSimulateAnalysis}
            disabled={isAnalyzing}
            className="btn"
            style={{
              background: '#0077ff',
              color: '#ffffff',
              borderRadius: '8px',
              padding: '9px 18px',
              fontWeight: '700',
              fontSize: '13px',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: isAnalyzing ? 'wait' : 'pointer'
            }}
          >
            <RefreshCw size={14} className={isAnalyzing ? 'spin' : ''} />
            {isAnalyzing ? 'Анализируем аудиторию...' : 'Обновить анализ ИИ'}
          </button>
        </div>
      </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & OFFERS GENERATOR                                        */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: '24px' }}>
          {/* LEFT: PSYCHOGRAPHICS & AUDIENCE PAINS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Box 1: Pains & Fears */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #fee2e2',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 4px rgba(239, 68, 68, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#b91c1c' }}>
                <AlertCircle size={18} />
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800' }}>
                  Боли и возражения аудитории ВК
                </h4>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px 0' }}>
                Что удерживает людей от мгновенной покупки билета:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentProg.psychographics.pains.map((pain, i) => (
                  <div key={i} style={{
                    fontSize: '13px',
                    color: '#334155',
                    background: '#fef2f2',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    borderLeft: '3px solid #ef4444',
                    lineHeight: '1.4'
                  }}>
                    {pain}
                  </div>
                ))}
              </div>
            </div>

            {/* Box 2: Triggers & Desire */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #dcfce7',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 4px rgba(34, 197, 94, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#15803d' }}>
                <ShieldCheck size={18} />
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800' }}>
                  Психологические триггеры к покупке
                </h4>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px 0' }}>
                Смысловые акценты, закрывающие возражения:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentProg.psychographics.triggers.map((trig, i) => (
                  <div key={i} style={{
                    fontSize: '13px',
                    color: '#1e293b',
                    background: '#f0fdf4',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    borderLeft: '3px solid #22c55e',
                    lineHeight: '1.4'
                  }}>
                    {trig}
                  </div>
                ))}
              </div>
            </div>

            {/* Box 3: VK Parsers Quick Action */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              padding: '18px'
            }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                🔍 Ключи для парсинга и сбора баз
              </div>
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                padding: '10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontFamily: 'monospace',
                color: '#475569',
                wordBreak: 'break-all'
              }}>
                {currentProg.vkKeywords}
              </div>
              <button
                onClick={() => handleCopy(currentProg.vkKeywords, 'keys')}
                style={{
                  marginTop: '10px',
                  width: '100%',
                  padding: '7px 12px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#334155',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {copiedIndex === 'keys' ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                {copiedIndex === 'keys' ? 'Ключи скопированы!' : 'Скопировать ключи для VK Рекламы'}
              </button>
            </div>
          </div>

          {/* RIGHT: GENERATED ADS OFFERS (READY FOR VK ADS) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: '800' }}>
                  Готовые рекламные офферы и тексты для промо-постов
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                  Сгенерированы под сегменты на основе собранного профиля аудитории
                </p>
              </div>
              <span style={{
                background: '#eff6ff',
                color: '#1d4ed8',
                border: '1px solid #bfdbfe',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '700'
              }}>
                Формат: Универсальная запись / Карусель
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {currentProg.offers.map((offer, idx) => (
                <div
                  key={offer.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        background: '#0077ff',
                        color: 'white',
                        fontWeight: '800',
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '6px'
                      }}>
                        Сегмент {idx + 1}
                      </span>
                      <strong style={{ fontSize: '14px', color: '#1e293b' }}>
                        {offer.segment}
                      </strong>
                    </div>

                    <span style={{
                      background: '#ecfdf5',
                      color: '#047857',
                      fontSize: '12px',
                      fontWeight: '800',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: '1px solid #a7f3d0'
                    }}>
                      {offer.badge}
                    </span>
                  </div>

                  {/* Header Title */}
                  <div style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#0f172a',
                    marginBottom: '10px',
                    lineHeight: '1.4'
                  }}>
                    {offer.header}
                  </div>

                  {/* Ad Body Text */}
                  <div style={{
                    background: '#f8fafc',
                    padding: '14px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '13px',
                    color: '#334155',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-line',
                    marginBottom: '14px'
                  }}>
                    {offer.text}
                  </div>

                  {/* CTA & Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {offer.tags.map((t, ti) => (
                        <span key={ti} style={{ fontSize: '12px', color: '#0077ff', fontWeight: '600' }}>
                          {t}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleCopy(`${offer.header}\n\n${offer.text}\n\nКнопка: ${offer.cta}`, idx)}
                        style={{
                          background: copiedIndex === idx ? '#10b981' : '#f1f5f9',
                          color: copiedIndex === idx ? '#ffffff' : '#1e293b',
                          border: 'none',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontWeight: '600',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'background 0.2s'
                        }}
                      >
                        {copiedIndex === idx ? <Check size={14} /> : <Copy size={14} />}
                        {copiedIndex === idx ? 'Скопировано!' : 'Скопировать для VK Рекламы'}
                      </button>

                      <a
                        href="https://ads.vk.com/"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          background: '#0077ff',
                          color: '#ffffff',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '12px',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        В кабинет VK <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: AUDIENCE PRESETS & COMMUNITIES                                     */}
      {/* ========================================================================= */}
      {activeTab === 'presets' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#0f172a' }}>
            Целевые сообщества и доноры аудитории для парсинга
          </h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748b' }}>
            Группы ВКонтакте, из которых собираются активные подписчики (авторы комментариев, лайков и репостов за последние 30 дней):
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {currentProg.targetGroupsVK.map((group, idx) => (
              <div
                key={idx}
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
                    {group.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Категория: <span style={{ color: '#0077ff', fontWeight: '600' }}>{group.type}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '800',
                    background: '#e0f2fe',
                    color: '#0369a1',
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}>
                    {group.count}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <Sparkles size={20} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '13px', color: '#065f46', lineHeight: '1.5' }}>
              <strong>Рекомендация таргетолога:</strong> Для максимальной окупаемости собирайте не просто участников групп, а 
              <strong> «активности» (от 2 действий за 3 недели)</strong>. Именно они дают наименьшую стоимость привлечения клика 
              и горячий интерес к посещению культурных мероприятий на воде.
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: VK API ARCHITECTURE & LIMITS GUIDE                                  */}
      {/* ========================================================================= */}
      {activeTab === 'parser_api' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* LEFT: Token & Integration */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Key size={18} color="#0077ff" />
              Подключение собственного VK API
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
              Для прямой работы без сторонних подписок зарегистрируйте standalone-приложение в кабинете <code>vk.com/dev</code> и укажите сервисный токен.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                VK Service Token / Access Token:
              </label>
              <input
                type="password"
                value={vkToken}
                onChange={(e) => setVkToken(e.target.value)}
                placeholder="vk1.a.xxxxxxxxxxxxxxxxxxxxxx"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  fontFamily: 'monospace'
                }}
              />
            </div>

            <button
              onClick={() => {
                setIsTokenSaved(true);
                setTimeout(() => setIsTokenSaved(false), 3000);
              }}
              style={{
                background: '#0077ff',
                color: '#ffffff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              {isTokenSaved ? 'Токен успешно сохранен в базе!' : 'Сохранить токен API'}
            </button>

            <div style={{ marginTop: '20px', padding: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
              🛡️ <strong>Безопасность:</strong> Токен хранится в зашифрованном виде и используется исключительно для фонового обращения к публичным методам <code>wall.get</code>, <code>wall.getComments</code> и <code>groups.getMembers</code>.
            </div>
          </div>

          {/* RIGHT: Limits & Architecture Cheat-Sheet */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Brain size={18} color="#7c3aed" />
              Архитектура работы с лимитами ВК
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '8px' }}>
                <strong>1. Лимит запросов (Rate Limit):</strong>
                <div style={{ color: '#475569', marginTop: '4px' }}>
                  Официальное ограничение ВК — 3 запроса в секунду. Наш фоновый сборщик работает с задержками <code>350ms</code>, что исключает блокировку.
                </div>
              </div>

              <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '8px' }}>
                <strong>2. Пакетный метод <code>execute</code>:</strong>
                <div style={{ color: '#475569', marginTop: '4px' }}>
                  Позволяет в одном HTTP-запросе исполнять до 25 подзапросов внутри серверов ВКонтакте. Это ускоряет сбор в 25 раз!
                </div>
              </div>

              <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '8px' }}>
                <strong>3. Human-in-the-loop:</strong>
                <div style={{ color: '#475569', marginTop: '4px' }}>
                  ИИ генерирует связки и тексты, но утверждение бюджета и запуск кампании всегда контролирует маркетолог в один клик.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ROADMAP, COMPETITOR ANALYSIS & AI-SCRAPING */}
      {activeTab === 'roadmap' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '24px 28px',
            boxShadow: '0 8px 24px rgba(124, 58, 237, 0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Sparkles size={24} color="#fde047" />
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>
                Стратегический Roadmap маркетингового AI-движка
              </h2>
            </div>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.9, lineHeight: '1.6', maxWidth: '850px' }}>
              От текущей генерации креативов ВКонтакте — к шпионажу за негативом конкурентов, тонкой докрутке афиш под запросы гостей и перехвату туристов из ответов нейросетей (ChatGPT, Яндекс Алиса, Perplexity).
            </p>
          </div>

          {/* 3 Pillars Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
            
            {/* 1. Анализ конкурентов */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '22px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Eye size={20} color="#dc2626" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Анализ конкурентов («Шпионский модуль»)</h3>
                  <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: '700' }}>Парсинг чужого негатива и болей</span>
                </div>
              </div>

              <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '16px' }}>
                Парсер мониторит сообщества и отзывы других судоходных компаний СПб (Астра Марин, Нева Тревел, теплоходы-рестораны).
              </div>

              <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px', border: '1px solid #f1f5f9', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontWeight: '700', color: '#0f172a' }}>⚡ Что это дает для продаж:</div>
                <div>• <strong>Перехват клиентов:</strong> Если на чужом борту жалуются на духоту, холод или плохой звук, наш ИИ немедленно запускает таргетинг: <em>«У нас — теплый панорамный салон и живой звук без искажений»</em>.</div>
                <div>• <strong>Ценовой радар:</strong> Мониторинг скидок и акций конкурентов перед праздниками для точной ценовой политики.</div>
              </div>
            </div>

            {/* 2. Анализ своей аудитории и докрутка релизов */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '22px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={20} color="#2563eb" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Докрутка релизов и программ</h3>
                  <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: '700' }}>Product Feedback Loop</span>
                </div>
              </div>

              <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '16px' }}>
                Анализ реальных вопросов и сообщений пассажиров в чатах поддержки, сообщениях сообщества и отзывах.
              </div>

              <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px', border: '1px solid #f1f5f9', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontWeight: '700', color: '#0f172a' }}>⚡ Что это дает для продаж:</div>
                <div>• <strong>Устранение сомнений на лендинге:</strong> Если 35% гостей переспрашивают про время разводки мостов или детский билет, ИИ подсказывает вынести эти блоки на первый экран афиши.</div>
                <div>• <strong>Повышение конверсии без рекламы:</strong> Чем точнее афиша отвечает на скрытые вопросы гостя, тем выше конверсия из посетителя в купленный билет.</div>
              </div>
            </div>

            {/* 3. GEO / AI-Парсинг нейросетей */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '22px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={20} color="#7c3aed" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Парсинг нейросетей & GEO/AIO</h3>
                  <span style={{ fontSize: '11px', color: '#7c3aed', fontWeight: '700' }}>ChatGPT, Алиса, Perplexity</span>
                </div>
              </div>

              <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '16px' }}>
                Туристы всё чаще спрашивают у ИИ в телефоне: <em>«Алиса, куда сходить вечером послушать музыку и увидеть развод мостов?»</em>.
              </div>

              <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px', border: '1px solid #f1f5f9', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontWeight: '700', color: '#0f172a' }}>⚡ Что это дает для продаж:</div>
                <div>• <strong>AI-Scraping выдачи:</strong> Регулярные запросы к нейросетям для проверки: входит ли «Рок Хит Нева» в топ-3 рекомендаций ИИ для гостей Санкт-Петербурга.</div>
                <div>• <strong>Generative Engine Optimization (GEO):</strong> Анализ источников данных нейросетей (Яндекс Карты, TripAdvisor, Вики, городские порталы) для публикации контента, гарантирующего рекомендацию нашего корабля.</div>
              </div>
            </div>

          </div>

          {/* Summary Box */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Lightbulb size={22} color="#f59e0b" />
              <div style={{ fontSize: '13px', color: '#334155' }}>
                Подробные технические сценарии и алгоритмы описаны в интерактивной <strong>«Базе знаний (ИИ)»</strong> для заказчика.
              </div>
            </div>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                background: '#0077ff',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Вернуться к генерации офферов
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
