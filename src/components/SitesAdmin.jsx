import React, { useState, useEffect } from 'react';
import { 
  Globe, ExternalLink, Settings, Check, Layers, Code, Palette, 
  FileText, Plus, Edit3, Trash2, X, AlertCircle, RefreshCw, 
  Calendar, Music, Anchor, Users, Play, Clock, Sparkles, Filter
} from 'lucide-react';

const INITIAL_DATA = {
  domains: [
    {
      id: 2,
      name: 'rockhitneva.ru',
      title: 'Рок Хит Нева — Рок-круизы по Неве',
      primary_color: '#e55f2e',
      logo_url: 'https://rockhitneva.ru/wp-content/uploads/2024/03/logo1.png',
      bg_image_url: '',
      global_scripts: '<!-- Yandex.Metrika counter -->\n<script type="text/javascript">\n(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");\nym(97638164, "init", {clickmap:true,trackLinks:true,accurateTrackBounce:true,ecommerce:"dataLayer"});\n</script>\n<noscript><div><img src="https://mc.yandex.ru/watch/97638164" style="position:absolute; left:-9999px;" alt="" /></div></noscript>',
      script_1_name: 'ООО Морские Корабли',
      script_1_code: '<script>var TLConf = { accessHash: "0b2b641d60f7f9443e566d47c89d208f", version: 1 };</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>',
      script_2_name: 'Резервный кассовый шлюз',
      script_2_code: '',
      gateways: [
        {
          id: 1,
          name: 'ООО Морские Корабли',
          code: '<script>var TLConf = { accessHash: "0b2b641d60f7f9443e566d47c89d208f", version: 1 };</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>'
        },
        {
          id: 2,
          name: 'Резервный кассовый шлюз',
          code: ''
        }
      ],
      footer_text: 'ООО "МОРСКИЕ КОРАБЛИ"\nИНН: 7814848882 | КПП: 781401001 | ОГРН: 1257800013459\nст. м. Спортивная, г. Санкт-Петербург, Набережная Макарова, дом 20',
      cloud_url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/rockhitneva.ru/index.html',
      pages: [
        {
          id: 1,
          title: 'Главная афиша',
          slug: '/',
          script_choice: 1,
          iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/JHgCdar1f2RgfwwTnasWr9ScZXK_hHlR/"></div>',
          url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/rockhitneva.ru/index.html'
        },
        {
          id: 2,
          title: 'Брат (Саундтреки к фильму)',
          slug: 'brother',
          script_choice: 1,
          iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/brother/"></div>',
          url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/rockhitneva.ru/brother/index.html'
        },
        {
          id: 3,
          title: 'Громыка',
          slug: 'gromyka',
          script_choice: 1,
          iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/gromyka/"></div>',
          url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/rockhitneva.ru/gromyka/index.html'
        },
        {
          id: 4,
          title: 'JOE COCKER Tribute',
          slug: 'joe-cocker',
          script_choice: 1,
          iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/joe-cocker/"></div>',
          url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/rockhitneva.ru/joe-cocker/index.html'
        },
        {
          id: 5,
          title: 'STING & The Police',
          slug: 'sting',
          script_choice: 1,
          iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/sting/"></div>',
          url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/rockhitneva.ru/sting/index.html'
        },
        {
          id: 6,
          title: 'Виктор Цой & Кино',
          slug: 'viktortsoy',
          script_choice: 1,
          iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/viktortsoy/"></div>',
          url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/rockhitneva.ru/viktortsoy/index.html'
        },
        {
          id: 7,
          title: 'Рок под разводными мостами',
          slug: 'rock-bridges',
          script_choice: 1,
          iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/rock-bridges/"></div>',
          url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/rockhitneva.ru/rock-bridges/index.html'
        },
        {
          id: 8,
          title: 'Led Zeppelin Tribute',
          slug: 'led-zeppelin-tribute',
          script_choice: 1,
          iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/led-zeppelin/"></div>',
          url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/rockhitneva.ru/led-zeppelin-tribute/index.html'
        },
        {
          id: 9,
          title: 'RHCP Tribute Show',
          slug: 'red-hot-chili-peppers',
          script_choice: 1,
          iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/rhcp/"></div>',
          url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/rockhitneva.ru/red-hot-chili-peppers/index.html'
        },
        {
          id: 10,
          title: 'Smoke on the Water',
          slug: 'smoke-on-the-water',
          script_choice: 1,
          iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/smoke-on-the-water/"></div>',
          url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/rockhitneva.ru/smoke-on-the-water/index.html'
        }
      ]
    },
    {
      id: 1,
      name: 'aquasound.club',
      title: 'AquaSound Club — Музыка на воде',
      primary_color: '#446084',
      logo_url: 'https://aquasound.club/wp-content/uploads/2024/04/Лого-1024x210.png',
      bg_image_url: '',
      global_scripts: '<!-- Yandex.Metrika counter -->\n<script type="text/javascript">\n(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");\nym(48530885, "init", {clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});\n</script>\n<noscript><div><img src="https://mc.yandex.ru/watch/48530885" style="position:absolute; left:-9999px;" alt="" /></div></noscript>',
      script_1_name: 'ИП Юницына (Ticketland)',
      script_1_code: '<script>var TLConf = { accessHash: "DH6tIrnYRIsz8Gc3kudLy8b6qM2Iwdm1", version: 1 };</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>',
      script_2_name: 'Кассовый шлюз 2 (Резерв)',
      script_2_code: '',
      gateways: [
        {
          id: 1,
          name: 'ИП Юницына (Ticketland)',
          code: '<script>var TLConf = { accessHash: "DH6tIrnYRIsz8Gc3kudLy8b6qM2Iwdm1", version: 1 };</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>'
        },
        {
          id: 2,
          name: 'Кассовый шлюз 2 (Резерв)',
          code: ''
        }
      ],
      footer_text: 'ИП Юницына Валерия Николаевна\nИНН: 470411807452 | ОГРН: 322470400014155\nСанкт-Петербург, Причал Набережная Макарова, 34',
      cloud_url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/aquasound.club/index.html',
      pages: [
        {
          id: 11,
          title: 'Главная страница',
          slug: '/',
          script_choice: 1,
          iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/drugoe/akvatoriya-zvuka-angliyskaya-nab-28"></div>',
          url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/aquasound.club/index.html'
        },
        {
          id: 12,
          title: 'Большой круг по Неве',
          slug: 'bigring',
          script_choice: 1,
          iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/bigring/"></div>',
          url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/aquasound.club/bigring/index.html'
        },
        {
          id: 13,
          title: 'Разводные мосты',
          slug: 'bridges',
          script_choice: 1,
          iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/bridges/"></div>',
          url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/aquasound.club/bridges/index.html'
        },
        {
          id: 14,
          title: 'Joe Cocker на воде',
          slug: 'joe-cocker-tribute',
          script_choice: 1,
          iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/joe-cocker-tribute/"></div>',
          url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/aquasound.club/joe-cocker-tribute/index.html'
        }
      ]
    }
  ],
  venues: [
    {
      id: 1,
      domain_id: 2,
      name: 'Теплоход «Рок Хит Нева»',
      pier_address: 'Санкт-Петербург, ст. м. Спортивная, причал Набережная Макарова, 34',
      capacity: 120,
      description: 'Двухпалубный комфортабельный рок-теплоход с закрытым теплым салоном и открытой верхней палубой'
    },
    {
      id: 2,
      domain_id: 1,
      name: 'Теплоход «Акватория Звука»',
      pier_address: 'Санкт-Петербург, ст. м. Спортивная, причал Набережная Макарова, 34',
      capacity: 100,
      description: 'Музыкальный теплоход-клуб с баром, живым звуком и панорамным обзором разводных мостов'
    }
  ],
  events: [
    {
      id: 1,
      domain_id: 2,
      title: 'Брат (Саундтреки к фильму)',
      slug: 'brother',
      short_desc: 'Культовые рок-хиты 90-х и саундтреки из легендарных фильмов Алексея Балабанова.',
      duration_minutes: 120,
      age_restriction: '18+',
      min_price: 1800,
      is_featured: true,
      iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/brother/"></div>'
    },
    {
      id: 2,
      domain_id: 2,
      title: 'Виктор Цой & Кино',
      slug: 'viktortsoy',
      short_desc: 'Живое исполнение бессмертных песен группы КИНО на волнах ночной Невы.',
      duration_minutes: 120,
      age_restriction: '16+',
      min_price: 1700,
      is_featured: true,
      iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/viktortsoy/"></div>'
    },
    {
      id: 3,
      domain_id: 2,
      title: 'Рок под разводными мостами',
      slug: 'rock-bridges',
      short_desc: 'Ночной круиз под разводку Дворцового и Троицкого мостов в сопровождении драйвового рок-бэнда.',
      duration_minutes: 150,
      age_restriction: '18+',
      min_price: 2200,
      is_featured: true,
      iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/rock-bridges/"></div>'
    },
    {
      id: 4,
      domain_id: 2,
      title: 'JOE COCKER Tribute',
      slug: 'joe-cocker',
      short_desc: 'Блюз-рок программа и лучшие баллады Джо Кокера с живой духовой секцией.',
      duration_minutes: 120,
      age_restriction: '18+',
      min_price: 1600,
      is_featured: false,
      iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/joe-cocker/"></div>'
    },
    {
      id: 5,
      domain_id: 2,
      title: 'Led Zeppelin Tribute',
      slug: 'led-zeppelin-tribute',
      short_desc: 'Мощный хард-рок трибьют легендам мировой рок-сцены.',
      duration_minutes: 120,
      age_restriction: '18+',
      min_price: 1800,
      is_featured: false,
      iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/led-zeppelin/"></div>'
    },
    {
      id: 6,
      domain_id: 1,
      title: 'Большой круг по Неве',
      slug: 'bigring',
      short_desc: 'Панорамный вечерний круиз с живым джазом и видами на парадный Петербург.',
      duration_minutes: 90,
      age_restriction: '12+',
      min_price: 1400,
      is_featured: true,
      iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/bigring/"></div>'
    },
    {
      id: 7,
      domain_id: 1,
      title: 'Разводные мосты',
      slug: 'bridges',
      short_desc: 'Романтический ночной рейс под музыку саксофона с выходом в Финский залив.',
      duration_minutes: 150,
      age_restriction: '18+',
      min_price: 2000,
      is_featured: true,
      iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/bridges/"></div>'
    }
  ],
  sessions: [
    {
      id: 101,
      domain_id: 2,
      event_id: 3,
      event_title: 'Рок под разводными мостами',
      event_slug: 'rock-bridges',
      venue_id: 1,
      venue_name: 'Теплоход «Рок Хит Нева»',
      pier_address: 'Причал Наб. Макарова, 34',
      start_time: '2026-05-01 23:55',
      min_price: 2200,
      status: 'active'
    },
    {
      id: 102,
      domain_id: 2,
      event_id: 1,
      event_title: 'Брат (Саундтреки к фильму)',
      event_slug: 'brother',
      venue_id: 1,
      venue_name: 'Теплоход «Рок Хит Нева»',
      pier_address: 'Причал Наб. Макарова, 34',
      start_time: '2026-05-02 19:30',
      min_price: 1800,
      status: 'active'
    },
    {
      id: 103,
      domain_id: 2,
      event_id: 2,
      event_title: 'Виктор Цой & Кино',
      event_slug: 'viktortsoy',
      venue_id: 1,
      venue_name: 'Теплоход «Рок Хит Нева»',
      pier_address: 'Причал Наб. Макарова, 34',
      start_time: '2026-05-02 22:00',
      min_price: 1700,
      status: 'active'
    },
    {
      id: 104,
      domain_id: 1,
      event_id: 6,
      event_title: 'Большой круг по Неве',
      event_slug: 'bigring',
      venue_id: 2,
      venue_name: 'Теплоход «Акватория Звука»',
      pier_address: 'Причал Наб. Макарова, 34',
      start_time: '2026-05-01 18:00',
      min_price: 1400,
      status: 'active'
    },
    {
      id: 105,
      domain_id: 1,
      event_id: 7,
      event_title: 'Разводные мосты',
      event_slug: 'bridges',
      venue_id: 2,
      venue_name: 'Теплоход «Акватория Звука»',
      pier_address: 'Причал Наб. Макарова, 34',
      start_time: '2026-05-01 23:55',
      min_price: 2000,
      status: 'active'
    }
  ]
};

export default function SitesAdmin({ initialTab = 'events' }) {
  // Persistence in LocalStorage
  const [domains, setDomains] = useState(() => {
    const saved = localStorage.getItem('cms_domains_v2');
    return saved ? JSON.parse(saved) : INITIAL_DATA.domains;
  });

  const [venues, setVenues] = useState(() => {
    const saved = localStorage.getItem('cms_venues_v2');
    return saved ? JSON.parse(saved) : INITIAL_DATA.venues;
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('cms_events_v2');
    return saved ? JSON.parse(saved) : INITIAL_DATA.events;
  });

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('cms_sessions_v2');
    return saved ? JSON.parse(saved) : INITIAL_DATA.sessions;
  });

  const [selectedDomainId, setSelectedDomainId] = useState(2); // 2 = rockhitneva.ru
  const [activeTab, setActiveTab] = useState(initialTab); // 'events', 'sessions', 'venues', 'pages', 'settings'
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Modals state
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '', slug: '', short_desc: '', age_restriction: '18+',
    duration_minutes: 120, min_price: 1800, is_featured: true, iframe_code: ''
  });

  const [massGenModalOpen, setMassGenModalOpen] = useState(false);
  const [massGenForm, setMassGenForm] = useState({
    event_id: '',
    venue_id: '',
    date_from: '2026-05-01',
    date_to: '2026-09-30',
    days_of_week: [5, 6, 0], // Fri, Sat, Sun
    times: '19:00, 21:30',
    min_price: 1800
  });

  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    event_id: '', venue_id: '', start_time: '2026-05-01 19:00', min_price: 1800
  });

  const [venueModalOpen, setVenueModalOpen] = useState(false);
  const [editingVenueId, setEditingVenueId] = useState(null);
  const [venueForm, setVenueForm] = useState({
    name: '', pier_address: '', capacity: 120, description: ''
  });

  const [pageModalOpen, setPageModalOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState(null);
  const [pageForm, setPageForm] = useState({
    title: '', slug: '', script_choice: 1, iframe_code: ''
  });

  const currentDomain = domains.find(d => d.id === selectedDomainId) || domains[0];

  const currentDomainEvents = events.filter(e => e.domain_id === currentDomain.id);
  const currentDomainSessions = sessions.filter(s => s.domain_id === currentDomain.id);
  const currentDomainVenues = venues.filter(v => v.domain_id === currentDomain.id);

  // Sync state helpers
  const saveState = (newDomains, newVenues, newEvents, newSessions) => {
    if (newDomains) {
      setDomains(newDomains);
      localStorage.setItem('cms_domains_v2', JSON.stringify(newDomains));
    }
    if (newVenues) {
      setVenues(newVenues);
      localStorage.setItem('cms_venues_v2', JSON.stringify(newVenues));
    }
    if (newEvents) {
      setEvents(newEvents);
      localStorage.setItem('cms_events_v2', JSON.stringify(newEvents));
    }
    if (newSessions) {
      setSessions(newSessions);
      localStorage.setItem('cms_sessions_v2', JSON.stringify(newSessions));
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const updateCurrentDomain = (key, value) => {
    const updated = domains.map(d => d.id === currentDomain.id ? { ...d, [key]: value } : d);
    saveState(updated, null, null, null);
  };

  // Reset to defaults
  const handleResetData = () => {
    if (window.confirm('Сбросить все данные CMS к исходному состоянию?')) {
      saveState(INITIAL_DATA.domains, INITIAL_DATA.venues, INITIAL_DATA.events, INITIAL_DATA.sessions);
      showNotification('Данные успешно сброшены к начальным!');
    }
  };

  // -------------------------------------------------------------
  // EVENT HANDLERS
  // -------------------------------------------------------------
  const handleOpenCreateEvent = () => {
    setEditingEventId(null);
    setEventForm({
      title: '',
      slug: '',
      short_desc: '',
      age_restriction: '18+',
      duration_minutes: 120,
      min_price: 1800,
      is_featured: true,
      iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/..."></div>'
    });
    setEventModalOpen(true);
  };

  const handleOpenEditEvent = (ev) => {
    setEditingEventId(ev.id);
    setEventForm({
      title: ev.title,
      slug: ev.slug,
      short_desc: ev.short_desc || '',
      age_restriction: ev.age_restriction || '18+',
      duration_minutes: ev.duration_minutes || 120,
      min_price: ev.min_price || 1800,
      is_featured: !!ev.is_featured,
      iframe_code: ev.iframe_code || ''
    });
    setEventModalOpen(true);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!eventForm.title.trim() || !eventForm.slug.trim()) {
      alert('Укажите название и URL Slug программы');
      return;
    }

    const cleanSlug = eventForm.slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');

    if (editingEventId) {
      const updated = events.map(ev => ev.id === editingEventId ? {
        ...ev,
        title: eventForm.title,
        slug: cleanSlug,
        short_desc: eventForm.short_desc,
        age_restriction: eventForm.age_restriction,
        duration_minutes: Number(eventForm.duration_minutes),
        min_price: Number(eventForm.min_price),
        is_featured: eventForm.is_featured,
        iframe_code: eventForm.iframe_code
      } : ev);
      saveState(null, null, updated, null);
      showNotification('Программа обновлена!');
    } else {
      const newEv = {
        id: Date.now(),
        domain_id: currentDomain.id,
        title: eventForm.title,
        slug: cleanSlug,
        short_desc: eventForm.short_desc,
        age_restriction: eventForm.age_restriction,
        duration_minutes: Number(eventForm.duration_minutes),
        min_price: Number(eventForm.min_price),
        is_featured: eventForm.is_featured,
        iframe_code: eventForm.iframe_code
      };
      saveState(null, null, [...events, newEv], null);
      showNotification('Новое мероприятие создано!');
    }
    setEventModalOpen(false);
  };

  const handleDeleteEvent = (id, title) => {
    if (window.confirm(`Удалить программу "${title}"?`)) {
      const updated = events.filter(e => e.id !== id);
      saveState(null, null, updated, null);
      showNotification(`Программа "${title}" удалена`);
    }
  };

  // -------------------------------------------------------------
  // MASS GENERATOR FOR SCHEDULE
  // -------------------------------------------------------------
  const handleOpenMassGen = () => {
    const defaultEv = currentDomainEvents[0] ? currentDomainEvents[0].id : '';
    const defaultVn = currentDomainVenues[0] ? currentDomainVenues[0].id : '';
    setMassGenForm({
      event_id: defaultEv,
      venue_id: defaultVn,
      date_from: '2026-05-01',
      date_to: '2026-09-30',
      days_of_week: [5, 6, 0], // Fri, Sat, Sun
      times: '19:00, 21:30',
      min_price: currentDomainEvents[0] ? currentDomainEvents[0].min_price : 1800
    });
    setMassGenModalOpen(true);
  };

  const handleRunMassGenerator = (e) => {
    e.preventDefault();
    const ev = events.find(item => item.id === Number(massGenForm.event_id));
    const vn = venues.find(item => item.id === Number(massGenForm.venue_id));
    if (!ev) {
      alert('Пожалуйста, выберите мероприятие!');
      return;
    }

    const timeList = massGenForm.times.split(',').map(t => t.trim()).filter(Boolean);
    if (timeList.length === 0) {
      alert('Укажите хотя бы одно время рейса');
      return;
    }

    const startDate = new Date(massGenForm.date_from);
    const endDate = new Date(massGenForm.date_to);
    const newSessions = [];
    let count = 0;

    let curr = new Date(startDate);
    while (curr <= endDate) {
      const dayOfWeek = curr.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
      if (massGenForm.days_of_week.includes(dayOfWeek)) {
        const year = curr.getFullYear();
        const month = String(curr.getMonth() + 1).padStart(2, '0');
        const day = String(curr.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        for (const t of timeList) {
          count++;
          newSessions.push({
            id: Date.now() + count,
            domain_id: currentDomain.id,
            event_id: ev.id,
            event_title: ev.title,
            event_slug: ev.slug,
            venue_id: vn ? vn.id : 1,
            venue_name: vn ? vn.name : 'Теплоход',
            pier_address: vn ? vn.pier_address : 'Причал Наб. Макарова, 34',
            start_time: `${dateStr} ${t}`,
            min_price: Number(massGenForm.min_price),
            status: 'active'
          });
        }
      }
      curr.setDate(curr.getDate() + 1);
    }

    if (newSessions.length === 0) {
      alert('В указанный период и дни недели не попало ни одного рейса.');
      return;
    }

    const allSessions = [...sessions, ...newSessions];
    saveState(null, null, null, allSessions);
    setMassGenModalOpen(false);
    showNotification(`Успешно сгенерировано ${newSessions.length} рейсов на сезон!`);
  };

  const handleDeleteSession = (id) => {
    const updated = sessions.filter(s => s.id !== id);
    saveState(null, null, null, updated);
    showNotification('Рейс удален из расписания');
  };

  const handleClearSessions = () => {
    if (window.confirm(`Удалить ВСЕ рейсы для сайта ${currentDomain.name}?`)) {
      const updated = sessions.filter(s => s.domain_id !== currentDomain.id);
      saveState(null, null, null, updated);
      showNotification('Расписание домена очищено');
    }
  };

  // -------------------------------------------------------------
  // VENUES HANDLERS
  // -------------------------------------------------------------
  const handleOpenCreateVenue = () => {
    setEditingVenueId(null);
    setVenueForm({ name: '', pier_address: 'Санкт-Петербург, Причал Набережная Макарова, 34', capacity: 120, description: '' });
    setVenueModalOpen(true);
  };

  const handleOpenEditVenue = (vn) => {
    setEditingVenueId(vn.id);
    setVenueForm({
      name: vn.name,
      pier_address: vn.pier_address,
      capacity: vn.capacity || 120,
      description: vn.description || ''
    });
    setVenueModalOpen(true);
  };

  const handleSaveVenue = (e) => {
    e.preventDefault();
    if (!venueForm.name.trim()) {
      alert('Укажите название теплохода / площадки');
      return;
    }

    if (editingVenueId) {
      const updated = venues.map(v => v.id === editingVenueId ? {
        ...v,
        name: venueForm.name,
        pier_address: venueForm.pier_address,
        capacity: Number(venueForm.capacity),
        description: venueForm.description
      } : v);
      saveState(null, updated, null, null);
      showNotification('Площадка сохранена!');
    } else {
      const newVn = {
        id: Date.now(),
        domain_id: currentDomain.id,
        name: venueForm.name,
        pier_address: venueForm.pier_address,
        capacity: Number(venueForm.capacity),
        description: venueForm.description
      };
      saveState(null, [...venues, newVn], null, null);
      showNotification('Теплоход / площадка создана!');
    }
    setVenueModalOpen(false);
  };

  // -------------------------------------------------------------
  // GATEWAYS & SETTINGS HANDLERS
  // -------------------------------------------------------------
  const handleAddGateway = () => {
    const gateways = currentDomain.gateways || [];
    const newGw = {
      id: Date.now(),
      name: `Кассовый шлюз ${gateways.length + 1}`,
      code: '<script>var TLConf = { accessHash: "...", version: 1 };</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>'
    };
    updateCurrentDomain('gateways', [...gateways, newGw]);
    showNotification('Добавлен новый кассовый шлюз');
  };

  const handleUpdateGateway = (gwId, field, value) => {
    const gateways = (currentDomain.gateways || []).map(gw => gw.id === gwId ? { ...gw, [field]: value } : gw);
    updateCurrentDomain('gateways', gateways);
  };

  const handleDeleteGateway = (gwId) => {
    const gateways = currentDomain.gateways || [];
    if (gateways.length <= 1) {
      alert('У сайта должен оставаться хотя бы один кассовый шлюз.');
      return;
    }
    const updated = gateways.filter(gw => gw.id !== gwId);
    updateCurrentDomain('gateways', updated);
    showNotification('Кассовый шлюз удален');
  };

  // -------------------------------------------------------------
  // PAGES HANDLERS
  // -------------------------------------------------------------
  const handleOpenCreatePage = () => {
    setEditingPageId(null);
    setPageForm({
      title: '',
      slug: '',
      script_choice: 1,
      iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/..."></div>'
    });
    setPageModalOpen(true);
  };

  const handleOpenEditPage = (pg) => {
    setEditingPageId(pg.id);
    setPageForm({
      title: pg.title,
      slug: pg.slug === '/' ? '/' : (pg.slug || ''),
      script_choice: pg.script_choice || 1,
      iframe_code: pg.iframe_code || ''
    });
    setPageModalOpen(true);
  };

  const handleSavePage = (e) => {
    e.preventDefault();
    let cleanSlug = pageForm.slug.trim();
    if (!cleanSlug || cleanSlug === '/') {
      cleanSlug = '/';
    } else {
      cleanSlug = cleanSlug.replace(/^\/+|\/+$/g, '').toLowerCase();
    }

    const pageUrl = cleanSlug === '/'
      ? `https://spb-tickets-ru.storage.yandexcloud.net/sites/${currentDomain.name}/index.html`
      : `https://spb-tickets-ru.storage.yandexcloud.net/sites/${currentDomain.name}/${cleanSlug}/index.html`;

    let updatedPages = [...(currentDomain.pages || [])];

    if (editingPageId) {
      updatedPages = updatedPages.map(pg => pg.id === editingPageId ? {
        ...pg,
        title: pageForm.title,
        slug: cleanSlug,
        script_choice: Number(pageForm.script_choice),
        iframe_code: pageForm.iframe_code,
        url: pageUrl
      } : pg);
      showNotification('Страница обновлена!');
    } else {
      const newPg = {
        id: Date.now(),
        title: pageForm.title,
        slug: cleanSlug,
        script_choice: Number(pageForm.script_choice),
        iframe_code: pageForm.iframe_code,
        url: pageUrl
      };
      updatedPages.push(newPg);
      showNotification('Страница создана!');
    }

    const updatedDomains = domains.map(d => d.id === currentDomain.id ? { ...d, pages: updatedPages } : d);
    saveState(updatedDomains, null, null, null);
    setPageModalOpen(false);
  };

  const handleDeletePage = (pageId, title) => {
    if (window.confirm(`Удалить страницу "${title}"?`)) {
      const updatedPages = (currentDomain.pages || []).filter(p => p.id !== pageId);
      const updatedDomains = domains.map(d => d.id === currentDomain.id ? { ...d, pages: updatedPages } : d);
      saveState(updatedDomains, null, null, null);
      showNotification(`Страница "${title}" удалена`);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {/* Left Sidebar: Domains */}
      <div className="glass" style={{ flex: '1 1 260px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
            <Globe size={18} color="var(--color-primary)" />
            Сайты проекта
          </h4>
          <span style={{ fontSize: '11px', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '10px', color: '#2563eb', fontWeight: '600' }}>
            Yandex Cloud
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {domains.map(dom => {
            const isSelected = dom.id === currentDomain.id;
            const domEvCount = events.filter(e => e.domain_id === dom.id).length;
            const domSessCount = sessions.filter(s => s.domain_id === dom.id).length;
            return (
              <div
                key={dom.id}
                onClick={() => setSelectedDomainId(dom.id)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: isSelected ? '#eff6ff' : '#f8fafc',
                  border: isSelected ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: isSelected ? 'bold' : '500', color: isSelected ? '#1d4ed8' : '#334155' }}>
                    {dom.name}
                  </span>
                  <span style={{ fontSize: '11px', background: isSelected ? '#bfdbfe' : '#e2e8f0', padding: '2px 6px', borderRadius: '6px', color: '#1e293b', fontWeight: '600' }}>
                    {dom.pages ? dom.pages.length : 0} стр.
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  {dom.title}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', fontSize: '11px', color: '#475569' }}>
                  <span>🎭 {domEvCount} прогр.</span>
                  <span>🗓️ {domSessCount} рейсов</span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a
            href={currentDomain.cloud_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 12px',
              background: '#2563eb',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            <ExternalLink size={14} /> Открыть {currentDomain.name}
          </a>

          <button
            onClick={handleResetData}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 12px',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              color: '#64748b',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} /> Сбросить данные к исходным
          </button>
        </div>
      </div>

      {/* Main Area: Navigation Tabs & Content */}
      <div className="glass" style={{ flex: '1 1 700px', padding: '24px' }}>
        {/* Header with Title & Notification */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
              <Layers size={22} color="var(--color-primary)" />
              Управление B2B: <span style={{ color: 'var(--color-primary)' }}>{currentDomain.name}</span>
            </h3>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              Платформа управления репертуаром, расписанием, теплоходами и страницами
            </div>
          </div>
        </div>

        {notification && (
          <div style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '10px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            <Check size={18} color="#059669" /> {notification}
          </div>
        )}

        {/* Top 5 Sub-Module Tabs */}
        <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('events')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: activeTab === 'events' ? '1px solid #bfdbfe' : '1px solid transparent',
              background: activeTab === 'events' ? '#eff6ff' : '#f8fafc',
              color: activeTab === 'events' ? '#1d4ed8' : '#64748b',
              fontWeight: activeTab === 'events' ? '600' : '500',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <Music size={16} /> 🎭 Программы ({currentDomainEvents.length})
          </button>

          <button
            onClick={() => setActiveTab('sessions')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: activeTab === 'sessions' ? '1px solid #bfdbfe' : '1px solid transparent',
              background: activeTab === 'sessions' ? '#eff6ff' : '#f8fafc',
              color: activeTab === 'sessions' ? '#1d4ed8' : '#64748b',
              fontWeight: activeTab === 'sessions' ? '600' : '500',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <Calendar size={16} /> 🗓️ Расписание ({currentDomainSessions.length})
          </button>

          <button
            onClick={() => setActiveTab('venues')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: activeTab === 'venues' ? '1px solid #bfdbfe' : '1px solid transparent',
              background: activeTab === 'venues' ? '#eff6ff' : '#f8fafc',
              color: activeTab === 'venues' ? '#1d4ed8' : '#64748b',
              fontWeight: activeTab === 'venues' ? '600' : '500',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <Anchor size={16} /> 📌 Площадки & Суда ({currentDomainVenues.length})
          </button>

          <button
            onClick={() => setActiveTab('pages')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: activeTab === 'pages' ? '1px solid #bfdbfe' : '1px solid transparent',
              background: activeTab === 'pages' ? '#eff6ff' : '#f8fafc',
              color: activeTab === 'pages' ? '#1d4ed8' : '#64748b',
              fontWeight: activeTab === 'pages' ? '600' : '500',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <FileText size={16} /> 🌐 Страницы & Афиша ({currentDomain.pages ? currentDomain.pages.length : 0})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: activeTab === 'settings' ? '1px solid #bfdbfe' : '1px solid transparent',
              background: activeTab === 'settings' ? '#eff6ff' : '#f8fafc',
              color: activeTab === 'settings' ? '#1d4ed8' : '#64748b',
              fontWeight: activeTab === 'settings' ? '600' : '500',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <Settings size={16} /> ⚙️ Настройки & Кассы
          </button>
        </div>

        {/* TAB 1: EVENTS / PROGRAMS */}
        {activeTab === 'events' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h5 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: 'bold' }}>
                  Репертуар программ и концертов
                </h5>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Управление карточками репертуара, длительностью, цензом и ссылками билетера
                </div>
              </div>
              <button
                onClick={handleOpenCreateEvent}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', borderRadius: '8px' }}
              >
                <Plus size={16} /> Создать программу
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentDomainEvents.map(ev => (
                <div
                  key={ev.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 16px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ flex: '1 1 300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '15px', color: '#0f172a' }}>{ev.title}</span>
                      {ev.is_featured && (
                        <span style={{ fontSize: '10px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '1px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                          🔥 ХИТ СЕЗОНА
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      {ev.short_desc || '—'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', flexWrap: 'wrap', fontSize: '12px' }}>
                      <span style={{ color: '#2563eb', background: '#eff6ff', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>
                        /{ev.slug}/
                      </span>
                      <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '4px' }}>
                        ⏱ {ev.duration_minutes || 120} мин
                      </span>
                      <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '4px' }}>
                        🔞 {ev.age_restriction || '18+'}
                      </span>
                      <strong style={{ color: '#059669', fontSize: '13px' }}>
                        от {ev.min_price || 1500} ₽
                      </strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => handleOpenEditEvent(ev)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '6px 12px',
                        background: '#f8fafc',
                        color: '#334155',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      <Edit3 size={14} color="#2563eb" /> Редактировать
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(ev.id, ev.title)}
                      style={{
                        padding: '6px 10px',
                        background: '#fff1f2',
                        color: '#e11d48',
                        border: '1px solid #fecdd3',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {currentDomainEvents.length === 0 && (
                <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                  Программы еще не добавлены. Нажмите «Создать программу»!
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SESSIONS & MASS GENERATOR */}
        {activeTab === 'sessions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h5 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: 'bold' }}>
                  Расписание рейсов и сеансов
                </h5>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Всего активных рейсов в сезоне: {currentDomainSessions.length}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleOpenMassGen}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(37,99,235,0.3)'
                  }}
                >
                  <Sparkles size={16} /> 🚀 Массовый генератор на сезон
                </button>
                <button
                  onClick={() => {
                    setSessionForm({
                      event_id: currentDomainEvents[0] ? currentDomainEvents[0].id : '',
                      venue_id: currentDomainVenues[0] ? currentDomainVenues[0].id : '',
                      start_time: '2026-05-01 19:00',
                      min_price: 1800
                    });
                    setSessionModalOpen(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    background: '#f8fafc',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={16} /> Одиночный рейс
                </button>
                {currentDomainSessions.length > 0 && (
                  <button
                    onClick={handleClearSessions}
                    style={{
                      padding: '8px 12px',
                      background: '#fff1f2',
                      color: '#e11d48',
                      border: '1px solid #fecdd3',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Очистить
                  </button>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentDomainSessions.slice(0, 50).map(s => (
                <div
                  key={s.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#1d4ed8', fontSize: '14px' }}>
                      🗓️ {s.start_time}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '14px' }}>{s.event_title}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{s.venue_name} ({s.pier_address})</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <strong style={{ color: '#059669', fontSize: '13px' }}>{s.min_price || 1500} ₽</strong>
                    <button
                      onClick={() => handleDeleteSession(s.id)}
                      style={{
                        padding: '4px 8px',
                        background: '#fff1f2',
                        color: '#e11d48',
                        border: '1px solid #fecdd3',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}

              {currentDomainSessions.length > 50 && (
                <div style={{ textAlign: 'center', padding: '10px', color: '#64748b', fontSize: '12px' }}>
                  Показано 50 из {currentDomainSessions.length} рейсов сезона.
                </div>
              )}

              {currentDomainSessions.length === 0 && (
                <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                  Расписание пусто. Нажмите <strong>«🚀 Массовый генератор на сезон»</strong> для мгновенного заполнения расписания с мая по сентябрь!
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: VENUES */}
        {activeTab === 'venues' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h5 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: 'bold' }}>
                  Площадки, теплоходы и причалы
                </h5>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Адрес причала автоматически выводится в афише и на электронных билетах
                </div>
              </div>
              <button
                onClick={handleOpenCreateVenue}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', borderRadius: '8px' }}
              >
                <Plus size={16} /> Добавить площадку / судно
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentDomainVenues.map(vn => (
                <div
                  key={vn.id}
                  style={{
                    padding: '16px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#0f172a', fontWeight: 'bold' }}>
                        {vn.name}
                      </h4>
                      <div style={{ fontSize: '13px', color: '#2563eb', marginBottom: '4px' }}>
                        📍 {vn.pier_address}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {vn.description}
                      </div>
                      <div style={{ marginTop: '8px', fontSize: '12px', color: '#475569' }}>
                        Вместимость: <strong>{vn.capacity} пассажиров</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleOpenEditVenue(vn)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 12px',
                          background: '#f8fafc',
                          color: '#334155',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        <Edit3 size={14} color="#2563eb" /> Редактировать
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PAGES */}
        {activeTab === 'pages' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h5 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: 'bold' }}>
                  Страницы и афиша на Yandex Cloud
                </h5>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Каждая страница имеет готовый статический URL и связанный кассовый шлюз
                </div>
              </div>
              <button
                onClick={handleOpenCreatePage}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', borderRadius: '8px' }}
              >
                <Plus size={16} /> Создать новую страницу
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(currentDomain.pages || []).map(pg => {
                const currentGateways = currentDomain.gateways || [];
                const foundGw = currentGateways.find(g => g.id === pg.script_choice);
                const scriptName = foundGw ? foundGw.name : 'Кассовый шлюз';

                return (
                  <div
                    key={pg.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '14px 16px',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                      gap: '12px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ flex: '1 1 280px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: '600', fontSize: '14px', color: '#0f172a' }}>{pg.title}</span>
                        {pg.slug === '/' && (
                          <span style={{ fontSize: '10px', background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '1px 6px', borderRadius: '4px', fontWeight: '600' }}>
                            Главная
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', flexWrap: 'wrap', fontSize: '12px' }}>
                        <div>
                          Путь: <code style={{ color: '#2563eb', background: '#eff6ff', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                            /{pg.slug === '/' ? '' : pg.slug}
                          </code>
                        </div>
                        <div style={{ color: '#475569' }}>
                          Касса: <strong style={{ color: '#1e293b' }}>{scriptName}</strong>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        onClick={() => handleOpenEditPage(pg)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '6px 12px',
                          background: '#f8fafc',
                          color: '#334155',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        <Edit3 size={14} color="#2563eb" /> Редактировать
                      </button>

                      <a
                        href={pg.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 12px',
                          background: '#eff6ff',
                          color: '#2563eb',
                          border: '1px solid #bfdbfe',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        <ExternalLink size={14} /> Открыть на YC
                      </a>

                      <button
                        onClick={() => handleDeletePage(pg.id, pg.title)}
                        style={{
                          padding: '6px 10px',
                          background: '#fff1f2',
                          color: '#e11d48',
                          border: '1px solid #fecdd3',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS & GATEWAYS */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Ticketland Gateways */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <h5 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#1e40af' }}>
                  <Settings size={16} /> Кассовые шлюзы & Юридические лица Ticketland
                </h5>
                <button
                  type="button"
                  onClick={handleAddGateway}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    background: '#eff6ff',
                    color: '#2563eb',
                    border: '1px solid #bfdbfe',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={14} /> Добавить кассовый шлюз
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {(currentDomain.gateways || []).map((gw, idx) => (
                  <div key={gw.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#1e40af' }}>
                        Кассовый шлюз #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteGateway(gw.id)}
                        style={{ background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3', borderRadius: '4px', padding: '3px 8px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}
                      >
                        Удалить
                      </button>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <label className="form-label" style={{ fontSize: '12px', color: '#475569', marginBottom: '4px' }}>
                        Название юрлица (для менеджеров)
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={gw.name}
                        onChange={(e) => handleUpdateGateway(gw.id, 'name', e.target.value)}
                        style={{ width: '100%' }}
                        placeholder="ООО Морские Корабли или ИП Юницына"
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '12px', color: '#475569', marginBottom: '4px' }}>
                        JS-код вызова шлюза (TLConf accessHash)
                      </label>
                      <textarea
                        className="form-input"
                        rows={3}
                        value={gw.code}
                        onChange={(e) => handleUpdateGateway(gw.id, 'code', e.target.value)}
                        placeholder='<script>var TLConf = { accessHash: "...", version: 1 };</script>'
                        style={{ width: '100%', fontFamily: 'monospace', fontSize: '11px' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Global Analytics */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
              <h5 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#1e40af' }}>
                <Code size={16} /> Глобальные скрипты (Яндекс.Метрика / счетчики)
              </h5>
              <textarea
                className="form-input"
                rows={4}
                value={currentDomain.global_scripts || ''}
                onChange={(e) => updateCurrentDomain('global_scripts', e.target.value)}
                style={{ width: '100%', fontFamily: 'monospace', fontSize: '12px' }}
              />
            </div>

            {/* Legal text */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
              <h5 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#1e40af' }}>
                <Palette size={16} /> Юридический подвал сайта
              </h5>
              <textarea
                className="form-input"
                rows={3}
                value={currentDomain.footer_text || ''}
                onChange={(e) => updateCurrentDomain('footer_text', e.target.value)}
                style={{ width: '100%', fontSize: '12px' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Event Create/Edit */}
      {eventModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '17px', color: '#0f172a' }}>
                {editingEventId ? 'Редактирование программы' : 'Новое мероприятие / программа'}
              </h4>
              <button onClick={() => setEventModalOpen(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveEvent} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label" style={{ fontWeight: '600' }}>Название программы *</label>
                <input type="text" className="form-input" value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} required placeholder="Например: Рок под разводными мостами" style={{ width: '100%', marginTop: '4px' }} />
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: '600' }}>URL Slug (латиницей) *</label>
                <input type="text" className="form-input" value={eventForm.slug} onChange={e => setEventForm({ ...eventForm, slug: e.target.value })} required placeholder="rock-bridges" style={{ width: '100%', marginTop: '4px', fontFamily: 'monospace' }} />
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: '600' }}>Краткое описание (для карточки афиши)</label>
                <textarea className="form-input" rows={2} value={eventForm.short_desc} onChange={e => setEventForm({ ...eventForm, short_desc: e.target.value })} style={{ width: '100%', marginTop: '4px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                <div>
                  <label className="form-label">Возрастной ценз</label>
                  <input type="text" className="form-input" value={eventForm.age_restriction} onChange={e => setEventForm({ ...eventForm, age_restriction: e.target.value })} style={{ width: '100%', marginTop: '4px' }} />
                </div>
                <div>
                  <label className="form-label">Длительность (мин)</label>
                  <input type="number" className="form-input" value={eventForm.duration_minutes} onChange={e => setEventForm({ ...eventForm, duration_minutes: e.target.value })} style={{ width: '100%', marginTop: '4px' }} />
                </div>
                <div>
                  <label className="form-label">Цена от (₽)</label>
                  <input type="number" className="form-input" value={eventForm.min_price} onChange={e => setEventForm({ ...eventForm, min_price: e.target.value })} style={{ width: '100%', marginTop: '4px' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                  <input type="checkbox" checked={eventForm.is_featured} onChange={e => setEventForm({ ...eventForm, is_featured: e.target.checked })} />
                  Выделять как «Хит сезона» в афише
                </label>
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: '600' }}>Iframe / Код билетера Ticketland</label>
                <textarea className="form-input" rows={3} value={eventForm.iframe_code} onChange={e => setEventForm({ ...eventForm, iframe_code: e.target.value })} style={{ width: '100%', marginTop: '4px', fontFamily: 'monospace', fontSize: '12px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setEventModalOpen(false)} style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer' }}>Отмена</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', borderRadius: '8px' }}>Сохранить программу</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Mass Generator */}
      {massGenModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '18px 24px', background: '#2563eb', color: 'white', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '17px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} /> Массовый генератор расписания на сезон
              </h4>
              <button onClick={() => setMassGenModalOpen(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', padding: '6px', color: 'white', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleRunMassGenerator} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: '600' }}>Программа / Мероприятие *</label>
                  <select className="form-input" value={massGenForm.event_id} onChange={e => setMassGenForm({ ...massGenForm, event_id: e.target.value })} required style={{ width: '100%', marginTop: '4px' }}>
                    {currentDomainEvents.map(ev => (
                      <option key={ev.id} value={ev.id}>{ev.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: '600' }}>Площадка / Теплоход *</label>
                  <select className="form-input" value={massGenForm.venue_id} onChange={e => setMassGenForm({ ...massGenForm, venue_id: e.target.value })} required style={{ width: '100%', marginTop: '4px' }}>
                    {currentDomainVenues.map(vn => (
                      <option key={vn.id} value={vn.id}>{vn.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: '600' }}>Период с:</label>
                  <input type="date" className="form-input" value={massGenForm.date_from} onChange={e => setMassGenForm({ ...massGenForm, date_from: e.target.value })} required style={{ width: '100%', marginTop: '4px' }} />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: '600' }}>Период по:</label>
                  <input type="date" className="form-input" value={massGenForm.date_to} onChange={e => setMassGenForm({ ...massGenForm, date_to: e.target.value })} required style={{ width: '100%', marginTop: '4px' }} />
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: '600', marginBottom: '6px', display: 'block' }}>Дни недели:</label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {[
                    { id: 1, label: 'Пн' }, { id: 2, label: 'Вт' }, { id: 3, label: 'Ср' },
                    { id: 4, label: 'Чт' }, { id: 5, label: 'Пт' }, { id: 6, label: 'Сб' }, { id: 0, label: 'Вс' }
                  ].map(d => (
                    <label key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={massGenForm.days_of_week.includes(d.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setMassGenForm({ ...massGenForm, days_of_week: [...massGenForm.days_of_week, d.id] });
                          } else {
                            setMassGenForm({ ...massGenForm, days_of_week: massGenForm.days_of_week.filter(id => id !== d.id) });
                          }
                        }}
                      />
                      <span style={{ fontWeight: d.id === 5 || d.id === 6 || d.id === 0 ? 'bold' : 'normal', color: d.id === 5 || d.id === 6 || d.id === 0 ? '#2563eb' : '#475569' }}>
                        {d.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: '600' }}>Время отправления (через запятую) *</label>
                  <input type="text" className="form-input" value={massGenForm.times} onChange={e => setMassGenForm({ ...massGenForm, times: e.target.value })} placeholder="19:00, 21:30" required style={{ width: '100%', marginTop: '4px' }} />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: '600' }}>Базовая цена (₽)</label>
                  <input type="number" className="form-input" value={massGenForm.min_price} onChange={e => setMassGenForm({ ...massGenForm, min_price: e.target.value })} required style={{ width: '100%', marginTop: '4px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setMassGenModalOpen(false)} style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer' }}>Отмена</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 24px', borderRadius: '8px', fontWeight: 'bold' }}>Сгенерировать рейсы</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Single Session Create */}
      {sessionModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '520px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '17px' }}>Добавить отдельный рейс</h4>
            <form onSubmit={e => {
              e.preventDefault();
              const ev = events.find(item => item.id === Number(sessionForm.event_id));
              const vn = venues.find(item => item.id === Number(sessionForm.venue_id));
              if (!ev) return;
              const newS = {
                id: Date.now(),
                domain_id: currentDomain.id,
                event_id: ev.id,
                event_title: ev.title,
                event_slug: ev.slug,
                venue_id: vn ? vn.id : 1,
                venue_name: vn ? vn.name : 'Теплоход',
                pier_address: vn ? vn.pier_address : 'Причал Наб. Макарова, 34',
                start_time: sessionForm.start_time,
                min_price: Number(sessionForm.min_price),
                status: 'active'
              };
              saveState(null, null, null, [...sessions, newS]);
              setSessionModalOpen(false);
              showNotification('Рейс добавлен в расписание');
            }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="form-label">Программа</label>
                <select className="form-input" value={sessionForm.event_id} onChange={e => setSessionForm({ ...sessionForm, event_id: e.target.value })} style={{ width: '100%' }}>
                  {currentDomainEvents.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Площадка</label>
                <select className="form-input" value={sessionForm.venue_id} onChange={e => setSessionForm({ ...sessionForm, venue_id: e.target.value })} style={{ width: '100%' }}>
                  {currentDomainVenues.map(vn => (
                    <option key={vn.id} value={vn.id}>{vn.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Дата и время (ГГГГ-ММ-ДД ЧЧ:ММ)</label>
                <input type="text" className="form-input" value={sessionForm.start_time} onChange={e => setSessionForm({ ...sessionForm, start_time: e.target.value })} style={{ width: '100%' }} />
              </div>
              <div>
                <label className="form-label">Цена от (₽)</label>
                <input type="number" className="form-input" value={sessionForm.min_price} onChange={e => setSessionForm({ ...sessionForm, min_price: e.target.value })} style={{ width: '100%' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setSessionModalOpen(false)} style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer' }}>Отмена</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', borderRadius: '8px' }}>Добавить рейс</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Venue Create/Edit */}
      {venueModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '540px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '17px' }}>{editingVenueId ? 'Редактирование теплохода' : 'Новый теплоход / площадка'}</h4>
            <form onSubmit={handleSaveVenue} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="form-label" style={{ fontWeight: '600' }}>Название судна *</label>
                <input type="text" className="form-input" value={venueForm.name} onChange={e => setVenueForm({ ...venueForm, name: e.target.value })} required placeholder="Теплоход «Рок Хит Нева»" style={{ width: '100%' }} />
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: '600' }}>Адрес причала (выводится на билетах) *</label>
                <input type="text" className="form-input" value={venueForm.pier_address} onChange={e => setVenueForm({ ...venueForm, pier_address: e.target.value })} required style={{ width: '100%' }} />
              </div>
              <div>
                <label className="form-label">Вместимость (пассажиров)</label>
                <input type="number" className="form-input" value={venueForm.capacity} onChange={e => setVenueForm({ ...venueForm, capacity: e.target.value })} style={{ width: '100%' }} />
              </div>
              <div>
                <label className="form-label">Описание</label>
                <textarea className="form-input" rows={2} value={venueForm.description} onChange={e => setVenueForm({ ...venueForm, description: e.target.value })} style={{ width: '100%' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setVenueModalOpen(false)} style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer' }}>Отмена</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', borderRadius: '8px' }}>Сохранить площадку</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Page Create/Edit */}
      {pageModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '640px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '17px' }}>{editingPageId ? 'Редактирование страницы' : 'Создать новую страницу'}</h4>
            <form onSubmit={handleSavePage} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label" style={{ fontWeight: '600' }}>Название страницы *</label>
                <input type="text" className="form-input" value={pageForm.title} onChange={e => setPageForm({ ...pageForm, title: e.target.value })} required style={{ width: '100%' }} />
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: '600' }}>Slug (латиницей или / для главной) *</label>
                <input type="text" className="form-input" value={pageForm.slug} onChange={e => setPageForm({ ...pageForm, slug: e.target.value })} placeholder="brother или /" required style={{ width: '100%', fontFamily: 'monospace' }} />
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: '600' }}>Привязка кассового шлюза</label>
                <select className="form-input" value={pageForm.script_choice} onChange={e => setPageForm({ ...pageForm, script_choice: Number(e.target.value) })} style={{ width: '100%' }}>
                  {(currentDomain.gateways || []).map(gw => (
                    <option key={gw.id} value={gw.id}>{gw.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: '600' }}>Код виджета / Iframe</label>
                <textarea className="form-input" rows={4} value={pageForm.iframe_code} onChange={e => setPageForm({ ...pageForm, iframe_code: e.target.value })} style={{ width: '100%', fontFamily: 'monospace', fontSize: '12px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setPageModalOpen(false)} style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer' }}>Отмена</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', borderRadius: '8px' }}>Сохранить страницу</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
