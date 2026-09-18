import React, { useState, useEffect } from 'react';
import { 
  Music, Calendar, Anchor, Plus, Edit3, Trash2, X, 
  Check, Sparkles, Filter, Clock, MapPin, Tag, Layers,
  Users, Mic, Radio, CheckSquare, Square, ChevronRight, Layout, Copy, List, Grid, Globe
} from 'lucide-react';
import DeckBuilder from './DeckBuilder';
import Afisha from './Afisha';
import SitesAdmin, { DEFAULT_DOMAINS } from './SitesAdmin';

const INITIAL_MUSICIANS = [
  {
    id: 1,
    name: 'Рок-группа «Кинохроника»',
    role: 'Трибьют-группа',
    genre: 'Русский рок / КИНО',
    description: 'Официальный трибьют-коллектив песен Виктора Цоя и группы Кино с аутентичным живым звуком.',
    phone: '+7 (921) 111-22-33'
  },
  {
    id: 2,
    name: 'Рок-бэнд «Brotherhood»',
    role: 'Кавер-бэнд',
    genre: 'Русский рок 90-х / Брат',
    description: 'Исполнители культовых саундтреков к фильмам «Брат» и «Брат 2» (Наутилус, Би-2, Агата Кристи, Смысловые Галлюцинации).',
    phone: '+7 (921) 222-33-44'
  },
  {
    id: 3,
    name: 'Cocker Band SPb',
    role: 'Блюз-рок оркестр',
    genre: 'Блюз-рок / Soul',
    description: 'Энергичный трибьют Джо Кокеру с мощным вокалом и живой духовой секцией.',
    phone: '+7 (921) 333-44-55'
  },
  {
    id: 4,
    name: 'Zeppelin Moon',
    role: 'Хард-рок трибьют',
    genre: 'Классический рок / Led Zeppelin',
    description: 'Драйвовое хард-рок шоу с виртуозными гитарными соло на Неве.',
    phone: '+7 (921) 444-55-66'
  },
  {
    id: 5,
    name: 'Михаил Лебедев (Саксофон)',
    role: 'Соло-исполнитель',
    genre: 'Джаз / Лаунж / Саксофон',
    description: 'Лауреат международных конкурсов, романтический саксофон на закате и под разводными мостами.',
    phone: '+7 (921) 555-66-77'
  },
  {
    id: 6,
    name: 'Квартет «Aqua Jazz»',
    role: 'Джаз-ансамбль',
    genre: 'Джаз / Свинг / Поп-джаз',
    description: 'Атмосферный живой аккомпанемент для панорамных вечерних круизов по Неве.',
    phone: '+7 (921) 666-77-88'
  }
];

const INITIAL_EVENTS = [
  {
    id: 1,
    title: 'Брат (Саундтреки к фильму)',
    slug: 'brother',
    short_desc: 'Культовые рок-хиты 90-х и саундтреки из легендарных фильмов Алексея Балабанова.',
    duration_minutes: 120,
    age_restriction: '18+',
    min_price: 1800,
    is_featured: true,
    event_type: 'Трибьют-концерт',
    default_musician_ids: [2],
    iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/brother/"></div>'
  },
  {
    id: 2,
    title: 'Виктор Цой & Кино',
    slug: 'viktortsoy',
    short_desc: 'Живое исполнение бессмертных песен группы КИНО на волнах ночной Невы.',
    duration_minutes: 120,
    age_restriction: '16+',
    min_price: 1700,
    is_featured: true,
    event_type: 'Трибьют-концерт',
    default_musician_ids: [1],
    iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/viktortsoy/"></div>'
  },
  {
    id: 3,
    title: 'Рок под разводными мостами',
    slug: 'rock-bridges',
    short_desc: 'Ночной круиз под разводку Дворцового и Троицкого мостов в сопровождении рок-бэнда.',
    duration_minutes: 150,
    age_restriction: '18+',
    min_price: 2200,
    is_featured: true,
    event_type: 'Музыкальный круиз',
    default_musician_ids: [1, 2],
    iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/rock-bridges/"></div>'
  },
  {
    id: 4,
    title: 'JOE COCKER Tribute',
    slug: 'joe-cocker',
    short_desc: 'Блюз-рок программа и лучшие баллады Джо Кокера с живой духовой секцией.',
    duration_minutes: 120,
    age_restriction: '18+',
    min_price: 1600,
    is_featured: false,
    event_type: 'Трибьют-концерт',
    default_musician_ids: [3],
    iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/joe-cocker/"></div>'
  },
  {
    id: 5,
    title: 'Led Zeppelin Tribute',
    slug: 'led-zeppelin-tribute',
    short_desc: 'Мощный хард-рок трибьют легендам мировой рок-сцены.',
    duration_minutes: 120,
    age_restriction: '18+',
    min_price: 1800,
    is_featured: false,
    event_type: 'Трибьют-концерт',
    default_musician_ids: [4],
    iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/led-zeppelin/"></div>'
  }
];

const INITIAL_VENUES = [
  {
    id: 1,
    name: 'Теплоход «Рок Хит Нева»',
    pier_address: 'Санкт-Петербург, ст. м. Спортивная, причал Набережная Макарова, 34',
    capacity: 120,
    description: 'Двухпалубный комфортабельный рок-теплоход с закрытым теплым салоном, сценой и открытой верхней палубой'
  },
  {
    id: 2,
    name: 'Теплоход «Акватория Звука»',
    pier_address: 'Санкт-Петербург, ст. м. Спортивная, причал Набережная Макарова, 34',
    capacity: 100,
    description: 'Музыкальный теплоход-клуб с баром, живым звуком и панорамным обзором разводных мостов'
  }
];

const INITIAL_SESSIONS = [
  {
    id: 101,
    event_id: 3,
    event_title: 'Рок под разводными мостами',
    venue_id: 1,
    venue_name: 'Теплоход «Рок Хит Нева»',
    pier_address: 'Причал Наб. Макарова, 34',
    start_time: '2026-05-01 23:55',
    min_price: 2200,
    musician_names: ['Рок-группа «Кинохроника»']
  },
  {
    id: 102,
    event_id: 1,
    event_title: 'Брат (Саундтреки к фильму)',
    venue_id: 1,
    venue_name: 'Теплоход «Рок Хит Нева»',
    pier_address: 'Причал Наб. Макарова, 34',
    start_time: '2026-05-02 19:30',
    min_price: 1800,
    musician_names: ['Рок-бэнд «Brotherhood»']
  },
  {
    id: 103,
    event_id: 2,
    event_title: 'Виктор Цой & Кино',
    venue_id: 1,
    venue_name: 'Теплоход «Рок Хит Нева»',
    pier_address: 'Причал Наб. Макарова, 34',
    start_time: '2026-05-02 22:00',
    min_price: 1700,
    musician_names: ['Рок-группа «Кинохроника»']
  },
  {
    id: 104,
    event_id: 4,
    event_title: 'JOE COCKER Tribute',
    venue_id: 1,
    venue_name: 'Теплоход «Рок Хит Нева»',
    pier_address: 'Причал Наб. Макарова, 34',
    start_time: '2026-05-03 19:30',
    min_price: 1600,
    musician_names: ['Cocker Band SPb']
  }
];

// =============================================================
// VALIDATION & CALCULATION HELPERS
// =============================================================

// 1. Dynamic Ship Capacity from Deck Scheme
export const getVenueCapacityBreakdown = (venue) => {
  if (!venue) return { total: 0, seats: 0, zones: 0, isCalculated: false };
  const deck = venue.deckData;
  if (!deck) return { total: venue.capacity || 120, seats: 0, zones: 0, isCalculated: false };
  
  let seats = 0;
  if (deck.tables && Array.isArray(deck.tables)) {
    deck.tables.forEach(t => {
      if (t.seats && Array.isArray(t.seats)) {
        seats += t.seats.length;
      }
    });
  }

  let zones = 0;
  if (deck.zones && Array.isArray(deck.zones)) {
    deck.zones.forEach(z => {
      zones += Number(z.capacity) || 0;
    });
  }

  const total = seats + zones;
  if (total > 0) {
    return { total, seats, zones, isCalculated: true };
  }
  return { total: venue.capacity || 120, seats: 0, zones: 0, isCalculated: false };
};

// 2. Arrival / End-time Calculator
export const getSessionTimeRange = (startTimeStr, durationMinutes = 120) => {
  if (!startTimeStr) return { date: '', start: '', end: '', range: '' };
  const parts = startTimeStr.split(' ');
  if (parts.length < 2) return { date: startTimeStr, start: '', end: '', range: startTimeStr };
  const [date, time] = parts;
  const [h, m] = time.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return { date, start: time, end: '', range: time };
  
  const totalStart = h * 60 + m;
  const totalEnd = totalStart + Number(durationMinutes);
  const endH = Math.floor(totalEnd / 60) % 24;
  const endM = totalEnd % 60;
  const endStr = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  
  return {
    date,
    start: time,
    end: endStr,
    range: `${time} → ${endStr}`
  };
};

// 3. Ship Schedule Overlap and Turnaround Buffer Conflict Detector
export const checkSessionConflict = (existingSessions, eventsList, candStartStr, candDurationMins, candVenueId, bufferMins = 20) => {
  if (!candStartStr) return null;
  const parts = candStartStr.split(' ');
  if (parts.length < 2) return null;
  const [candDate, candTime] = parts;
  const [cH, cM] = candTime.split(':').map(Number);
  if (isNaN(cH) || isNaN(cM)) return null;

  const cStart = cH * 60 + cM;
  const cEnd = cStart + Number(candDurationMins);

  for (const ex of existingSessions) {
    if (ex.venue_id !== candVenueId) continue;
    const exParts = ex.start_time.split(' ');
    if (exParts.length < 2) continue;
    const [exDate, exTime] = exParts;
    if (exDate !== candDate) continue;

    const exProg = eventsList.find(e => e.id === ex.event_id);
    const exDuration = ex.duration_minutes || exProg?.duration_minutes || 120;
    const [eH, eM] = exTime.split(':').map(Number);
    if (isNaN(eH) || isNaN(eM)) continue;

    const exStart = eH * 60 + eM;
    const exEnd = exStart + exDuration;

    // Overlap: interval [cStart, cEnd] intersects [exStart, exEnd]
    if (Math.max(cStart, exStart) < Math.min(cEnd, exEnd)) {
      return {
        type: 'overlap',
        conflictingSession: ex,
        candTime,
        exTime,
        date: candDate,
        exTitle: ex.event_title
      };
    }

    // Buffer check: gap < bufferMins
    if (cStart >= exEnd && (cStart - exEnd) < bufferMins) {
      return {
        type: 'buffer',
        gap: cStart - exEnd,
        bufferMins,
        conflictingSession: ex,
        candTime,
        exTime: `${exTime} → ${String(Math.floor(exEnd/60)).padStart(2, '0')}:${String(exEnd%60).padStart(2, '0')}`,
        date: candDate,
        exTitle: ex.event_title
      };
    }

    if (exStart >= cEnd && (exStart - cEnd) < bufferMins) {
      return {
        type: 'buffer',
        gap: exStart - cEnd,
        bufferMins,
        conflictingSession: ex,
        candTime,
        exTime: `${exTime}`,
        date: candDate,
        exTitle: ex.event_title
      };
    }
  }
  return null;
};

// 4. Musician Booking Conflict Detector
export const checkMusicianConflict = (existingSessions, eventsList, candStartStr, candDurationMins, candidateMusicianNames) => {
  if (!candStartStr || !candidateMusicianNames || candidateMusicianNames.length === 0) return null;
  const parts = candStartStr.split(' ');
  if (parts.length < 2) return null;
  const [candDate, candTime] = parts;
  const [cH, cM] = candTime.split(':').map(Number);
  if (isNaN(cH) || isNaN(cM)) return null;

  const cStart = cH * 60 + cM;
  const cEnd = cStart + Number(candDurationMins);

  for (const ex of existingSessions) {
    if (!ex.musician_names || ex.musician_names.length === 0) continue;
    const exParts = ex.start_time.split(' ');
    if (exParts.length < 2) continue;
    const [exDate, exTime] = exParts;
    if (exDate !== candDate) continue;

    const exProg = eventsList.find(e => e.id === ex.event_id);
    const exDuration = ex.duration_minutes || exProg?.duration_minutes || 120;
    const [eH, eM] = exTime.split(':').map(Number);
    if (isNaN(eH) || isNaN(eM)) continue;

    const exStart = eH * 60 + eM;
    const exEnd = exStart + exDuration;

    // Overlapping time
    if (Math.max(cStart, exStart) < Math.min(cEnd, exEnd)) {
      const overlappingMusicians = candidateMusicianNames.filter(m => ex.musician_names.includes(m));
      if (overlappingMusicians.length > 0) {
        return {
          musicians: overlappingMusicians,
          conflictingSession: ex,
          candTime,
          exTime,
          date: candDate,
          exTitle: ex.event_title,
          exVenue: ex.venue_name
        };
      }
    }
  }
  return null;
};

// 5. Deck Scheme Pricing & Integrity Validator
export const validateDeckPricing = (deckData) => {
  if (!deckData) return { isValid: true, issues: [] };
  const issues = [];

  const categories = deckData.categories || [];
  if (categories.length === 0) {
    issues.push('Нет ценовых категорий');
  }

  const zeroPriceCats = categories.filter(c => !c.price || Number(c.price) <= 0);
  if (zeroPriceCats.length > 0) {
    issues.push(`Категории с ценой 0 ₽: ${zeroPriceCats.map(c => `«${c.name}»`).join(', ')}`);
  }

  let unassignedSeats = 0;
  if (deckData.tables && Array.isArray(deckData.tables)) {
    deckData.tables.forEach(t => {
      (t.seats || []).forEach(s => {
        if (!s.categoryId) unassignedSeats++;
      });
    });
  }
  if (unassignedSeats > 0) {
    issues.push(`${unassignedSeats} мест без назначенной категории`);
  }

  if (deckData.zones && Array.isArray(deckData.zones)) {
    deckData.zones.forEach(z => {
      if (!z.price || Number(z.price) <= 0) {
        issues.push(`Зона «${z.label}» с ценой 0 ₽`);
      }
    });
  }

  return {
    isValid: issues.length === 0,
    issues
  };
};

// 6. Ticketland Widget Code Validator
export const getTicketlandStatus = (iframeCode) => {
  if (!iframeCode || !iframeCode.trim()) {
    return { status: 'none', label: 'Не настроен (своя касса)', color: '#64748b', bg: '#f1f5f9' };
  }
  if (iframeCode.includes('...')) {
    return { status: 'draft', label: 'Черновик (содержит ...)', color: '#d97706', bg: '#fef3c7' };
  }
  if (iframeCode.includes('tlFrameContainer') || iframeCode.includes('ticketland.ru')) {
    return { status: 'ok', label: 'Ticketland активен', color: '#16a34a', bg: '#dcfce7' };
  }
  return { status: 'custom', label: 'Сторонний билетер/iframe', color: '#2563eb', bg: '#eff6ff' };
};

export default function ProgramsManager({ defaultSection = 'events', onSelectEvent, navigateTo }) {
  const [currentSection, setCurrentSection] = useState(defaultSection); // 'events', 'sessions', 'musicians', 'venues', 'afisha'
  const [notification, setNotification] = useState('');

  // LocalStorage Persistence
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('pm_events_v4');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [venues, setVenues] = useState(() => {
    const saved = localStorage.getItem('pm_venues_v4');
    return saved ? JSON.parse(saved) : INITIAL_VENUES;
  });

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('pm_sessions_v4');
    return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
  });

  const [musicians, setMusicians] = useState(() => {
    const saved = localStorage.getItem('pm_musicians_v4');
    return saved ? JSON.parse(saved) : INITIAL_MUSICIANS;
  });

  const saveEvents = (data) => {
    setEvents(data);
    localStorage.setItem('pm_events_v4', JSON.stringify(data));
  };

  const saveVenues = (data) => {
    setVenues(data);
    localStorage.setItem('pm_venues_v4', JSON.stringify(data));
  };

  const saveSessions = (data) => {
    setSessions(data);
    localStorage.setItem('pm_sessions_v4', JSON.stringify(data));
  };

  const saveMusicians = (data) => {
    setMusicians(data);
    localStorage.setItem('pm_musicians_v4', JSON.stringify(data));
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  // Widget Generator State
  const [widgetSiteId, setWidgetSiteId] = useState(2); // default to rockhitneva.ru (id: 2)
  const [widgetProgramId, setWidgetProgramId] = useState('');
  const [widgetSessionId, setWidgetSessionId] = useState('');
  const [sitesInitialDomainId, setSitesInitialDomainId] = useState(2);

  const handleCreatePageWithWidget = () => {
    if (!widgetSiteId) {
      alert('Пожалуйста, выберите сайт (коммерческий проект), на котором будет создана страница с виджетом.');
      return;
    }

    const savedCms = localStorage.getItem('cms_domains_v2');
    const cmsDomains = savedCms ? JSON.parse(savedCms) : DEFAULT_DOMAINS;
    const targetDomain = cmsDomains.find((d) => d.id === Number(widgetSiteId)) || cmsDomains[0];

    if (!targetDomain) {
      alert('Выбранный сайт не найден в базе CMS.');
      return;
    }

    const selectedProg = events.find((e) => e.id === Number(widgetProgramId));
    const selectedSess = sessions.find((s) => s.id === Number(widgetSessionId));

    let pageTitle = 'Афиша и продажа билетов';
    let pageSlug = 'afisha';
    let iframeCode = '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/JHgCdar1f2RgfwwTnasWr9ScZXK_hHlR/"></div>';

    if (selectedSess) {
      pageTitle = `${selectedSess.event_title} (${selectedSess.start_time})`;
      pageSlug = `${selectedProg?.slug || 'event'}-${selectedSess.id}`;
      iframeCode = `<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/${pageSlug}/"></div>`;
    } else if (selectedProg) {
      pageTitle = selectedProg.title;
      pageSlug = selectedProg.slug || `prog-${selectedProg.id}`;
      iframeCode = selectedProg.iframe_code || `<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/${pageSlug}/"></div>`;
    } else {
      pageTitle = 'Главная афиша сезона';
      pageSlug = `afisha-${Date.now().toString().slice(-4)}`;
    }

    const newPage = {
      id: Date.now(),
      title: pageTitle,
      slug: pageSlug,
      script_choice: 1,
      iframe_code: iframeCode,
      url: `https://spb-tickets-ru.storage.yandexcloud.net/sites/${targetDomain.name}/${pageSlug}/index.html`
    };

    const updatedDomains = cmsDomains.map((d) => {
      if (d.id === targetDomain.id) {
        const pages = d.pages || [];
        const exists = pages.some((p) => p.slug === pageSlug);
        const newPages = exists ? pages.map((p) => (p.slug === pageSlug ? { ...p, ...newPage, id: p.id } : p)) : [...pages, newPage];
        return { ...d, pages: newPages };
      }
      return d;
    });

    localStorage.setItem('cms_domains_v2', JSON.stringify(updatedDomains));
    setSitesInitialDomainId(targetDomain.id);
    setCurrentSection('sites');
    showNotification(`Страница «${pageTitle}» с виджетом успешно создана на сайте ${targetDomain.name}!`);
  };

  // -------------------------------------------------------------
  // MODAL STATES
  // -------------------------------------------------------------

  // 1. Program Create/Edit Modal
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [selectedVenueForDeck, setSelectedVenueForDeck] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '', slug: '', short_desc: '', age_restriction: '18+',
    duration_minutes: 120, min_price: 1500, is_featured: false, event_type: 'Музыкальный круиз',
    iframe_code: ''
  });

  // 2. UNIFIED Event Session Creation Modal (Single Event OR Recurring Schedule + Musicians + Venue Creation)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [targetProgram, setTargetProgram] = useState(null);
  const [scheduleMode, setScheduleMode] = useState('recurring'); // 'single' or 'recurring'
  const [scheduleForm, setScheduleForm] = useState({
    venue_id: 1,
    min_price: 1800,
    single_date: '2026-05-01',
    single_time: '19:30',
    date_from: '2026-05-01',
    date_to: '2026-09-30',
    days_of_week: [5, 6, 0], // Fri, Sat, Sun
    times: '19:00, 21:30',
    selected_musician_ids: []
  });

  // 3. Quick Add Musician Modal
  const [musicianModalOpen, setMusicianModalOpen] = useState(false);
  const [editingMusicianId, setEditingMusicianId] = useState(null);
  const [musicianForm, setMusicianForm] = useState({
    name: '', role: 'Рок-группа', genre: 'Русский рок', description: '', phone: ''
  });

  // 4. Venue & Pier Modal (Can be triggered from sidebar OR from inside Schedule modal)
  const [venueModalOpen, setVenueModalOpen] = useState(false);
  const [editingVenueId, setEditingVenueId] = useState(null);
  const [venueForm, setVenueForm] = useState({
    name: '', pier_address: 'Санкт-Петербург, Причал Набережная Макарова, 34', capacity: 120, description: ''
  });

  // Filter in Schedule table
  const [scheduleProgramFilter, setScheduleProgramFilter] = useState('all');
  const [scheduleTypeFilter, setScheduleTypeFilter] = useState('all');
  const [scheduleViewMode, setScheduleViewMode] = useState('list'); // 'list' | 'calendar'
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 4, 1)); // Default to May 2026 for mock data

  // -------------------------------------------------------------
  // PROGRAM CRUD
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

    const tlStatus = getTicketlandStatus(eventForm.iframe_code);
    if (tlStatus.status === 'draft') {
      const confirmDraft = window.confirm(
        '⚠️ ПРЕДУПРЕЖДЕНИЕ: Код билетера Ticketland содержит шаблонное многоточие "..." (черновик интеграции).\n\n' +
        'Вы уверены, что хотите сохранить программу с черновиком кода билетера?'
      );
      if (!confirmDraft) return;
    }

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
      saveEvents(updated);
      showNotification('Программа обновлена!');
    } else {
      const newEv = {
        id: Date.now(),
        title: eventForm.title,
        slug: cleanSlug,
        short_desc: eventForm.short_desc,
        age_restriction: eventForm.age_restriction,
        duration_minutes: Number(eventForm.duration_minutes),
        min_price: Number(eventForm.min_price),
        is_featured: eventForm.is_featured,
        default_musician_ids: [],
        iframe_code: eventForm.iframe_code
      };
      saveEvents([...events, newEv]);
      showNotification('Новая программа создана! Теперь вы можете назначить рейсы.');
    }
    setEventModalOpen(false);
  };

  const handleDeleteEvent = (id, title) => {
    if (window.confirm(`Удалить программу "${title}"?`)) {
      saveEvents(events.filter(e => e.id !== id));
      showNotification(`Программа "${title}" удалена`);
    }
  };

  // -------------------------------------------------------------
  // UNIFIED SCHEDULE CREATION (Inside Program)
  // -------------------------------------------------------------
  const handleOpenScheduleModal = (prog) => {
    setTargetProgram(prog);
    setScheduleMode('recurring');
    setScheduleForm({
      venue_id: venues[0] ? venues[0].id : 1,
      min_price: prog.min_price || 1800,
      single_date: '2026-05-01',
      single_time: '19:30',
      date_from: '2026-05-01',
      date_to: '2026-09-30',
      days_of_week: [5, 6, 0], // Fri, Sat, Sun
      times: '19:00, 21:30',
      selected_musician_ids: prog.default_musician_ids || []
    });
    setScheduleModalOpen(true);
  };

  const handleSaveSchedule = (e) => {
    e.preventDefault();
    if (!targetProgram) return;

    const vn = venues.find(item => item.id === Number(scheduleForm.venue_id)) || venues[0];
    const selectedMusicians = musicians.filter(m => scheduleForm.selected_musician_ids.includes(m.id));
    const musicianNames = selectedMusicians.map(m => m.name);
    const duration = Number(targetProgram.duration_minutes) || 120;

    if (scheduleMode === 'single') {
      // Single event creation
      const start_time = `${scheduleForm.single_date} ${scheduleForm.single_time}`;

      // 1. Ship conflict validation (overlap or buffer)
      const shipConflict = checkSessionConflict(sessions, events, start_time, duration, vn.id, 20);
      if (shipConflict) {
        if (shipConflict.type === 'overlap') {
          const confirmOverlap = window.confirm(
            `⚠️ ВНИМАНИЕ: Обнаружен прямой конфликт расписания судна!\n\n` +
            `Теплоход «${vn.name}» уже занят в дату ${shipConflict.date} рейсом «${shipConflict.exTitle}» (${shipConflict.exTime}).\n` +
            `Новый рейс: ${start_time} (длительность ${duration} мин).\n\n` +
            `Вы уверены, что хотите назначить рейс на это же время?`
          );
          if (!confirmOverlap) return;
        } else if (shipConflict.type === 'buffer') {
          const confirmBuffer = window.confirm(
            `⏱️ ПРЕДУПРЕЖДЕНИЕ: Малый межоборотный интервал судна!\n\n` +
            `Между новым рейсом и рейсом «${shipConflict.exTitle}» интервал составляет всего ${shipConflict.gap} мин (рекомендуется минимум ${shipConflict.bufferMins} мин на высадку пассажиров и уборку).\n\n` +
            `Продолжить сохранение рейса?`
          );
          if (!confirmBuffer) return;
        }
      }

      // 2. Musician booking conflict validation
      const musConflict = checkMusicianConflict(sessions, events, start_time, duration, musicianNames);
      if (musConflict) {
        const confirmMus = window.confirm(
          `🎸 ВНИМАНИЕ: Конфликт занятости артистов!\n\n` +
          `Музыкант(ы) ${musConflict.musicians.map(m => `«${m}»`).join(', ')} уже выступают на другом судне «${musConflict.exVenue}» (рейс «${musConflict.exTitle}», ${musConflict.exTime}).\n\n` +
          `Вы уверены, что хотите назначить этих артистов?`
        );
        if (!confirmMus) return;
      }

      const newSess = {
        id: Date.now(),
        event_id: targetProgram.id,
        event_title: targetProgram.title,
        venue_id: vn ? vn.id : 1,
        venue_name: vn ? vn.name : 'Теплоход',
        pier_address: vn ? vn.pier_address : 'Причал Наб. Макарова, 34',
        start_time: start_time,
        duration_minutes: duration,
        min_price: Number(scheduleForm.min_price),
        musician_names: musicianNames
      };
      saveSessions([...sessions, newSess]);
      showNotification(`Рейс на ${start_time} успешно добавлен в расписание!`);
    } else {
      // Recurring schedule creation (Mass generator)
      if (new Date(scheduleForm.date_to) < new Date(scheduleForm.date_from)) {
        alert('Ошибка: Дата окончания сезона не может быть раньше даты начала.');
        return;
      }
      if (!scheduleForm.days_of_week || scheduleForm.days_of_week.length === 0) {
        alert('Ошибка: Выберите хотя бы один день недели для регулярных рейсов.');
        return;
      }

      const timeList = scheduleForm.times.split(',').map(t => t.trim()).filter(Boolean);
      if (timeList.length === 0) {
        alert('Укажите хотя бы одно время отправления (например: 19:00)');
        return;
      }

      const startDate = new Date(scheduleForm.date_from);
      const endDate = new Date(scheduleForm.date_to);
      const newSessions = [];
      let count = 0;
      let conflictCount = 0;
      let bufferCount = 0;
      let musicianConflictCount = 0;

      let curr = new Date(startDate);
      while (curr <= endDate) {
        const dayOfWeek = curr.getDay();
        if (scheduleForm.days_of_week.includes(dayOfWeek)) {
          const year = curr.getFullYear();
          const month = String(curr.getMonth() + 1).padStart(2, '0');
          const day = String(curr.getDate()).padStart(2, '0');
          const dateStr = `${year}-${month}-${day}`;

          for (const t of timeList) {
            const candStart = `${dateStr} ${t}`;
            const shipConflict = checkSessionConflict(sessions, events, candStart, duration, vn.id, 20);
            if (shipConflict) {
              if (shipConflict.type === 'overlap') conflictCount++;
              else if (shipConflict.type === 'buffer') bufferCount++;
            }

            const musConflict = checkMusicianConflict(sessions, events, candStart, duration, musicianNames);
            if (musConflict) musicianConflictCount++;

            count++;
            newSessions.push({
              id: Date.now() + count,
              event_id: targetProgram.id,
              event_title: targetProgram.title,
              venue_id: vn ? vn.id : 1,
              venue_name: vn ? vn.name : 'Теплоход',
              pier_address: vn ? vn.pier_address : 'Причал Наб. Макарова, 34',
              start_time: candStart,
              duration_minutes: duration,
              min_price: Number(scheduleForm.min_price),
              musician_names: musicianNames
            });
          }
        }
        curr.setDate(curr.getDate() + 1);
      }

      if (newSessions.length === 0) {
        alert('В выбранном диапазоне дат не совпало ни одного дня недели.');
        return;
      }

      const warnings = [];
      if (conflictCount > 0) warnings.push(`• Прямое наложение рейсов судна: ${conflictCount} пересечений`);
      if (bufferCount > 0) warnings.push(`• Малый межоборотный интервал (< 20 мин): ${bufferCount} рейсов`);
      if (musicianConflictCount > 0) warnings.push(`• Конфликт занятости музыкантов: ${musicianConflictCount} совпадений`);

      if (warnings.length > 0) {
        const confirmAll = window.confirm(
          `⚠️ ВНИМАНИЕ: Замечания при генерации ${newSessions.length} рейсов:\n\n` +
          warnings.join('\n') +
          `\n\nПродолжить сохранение регулярного расписания?`
        );
        if (!confirmAll) return;
      }

      saveSessions([...sessions, ...newSessions]);
      showNotification(`Сгенерировано ${newSessions.length} регулярных рейсов для «${targetProgram.title}»!`);
    }

    setScheduleModalOpen(false);
  };

  const handleDeleteSession = (id) => {
    saveSessions(sessions.filter(s => s.id !== id));
    showNotification('Рейс удален');
  };

  // -------------------------------------------------------------
  // MUSICIANS DIRECTORY CRUD
  // -------------------------------------------------------------
  const handleOpenAddMusician = () => {
    setEditingMusicianId(null);
    setMusicianForm({
      name: '',
      role: 'Рок-группа',
      genre: 'Русский рок',
      description: '',
      phone: ''
    });
    setMusicianModalOpen(true);
  };

  const handleOpenEditMusician = (mus) => {
    setEditingMusicianId(mus.id);
    setMusicianForm({
      name: mus.name,
      role: mus.role || 'Исполнитель',
      genre: mus.genre || '',
      description: mus.description || '',
      phone: mus.phone || ''
    });
    setMusicianModalOpen(true);
  };

  const handleSaveMusician = (e) => {
    e.preventDefault();
    if (!musicianForm.name.trim()) {
      alert('Укажите имя артиста или название группы');
      return;
    }

    if (editingMusicianId) {
      const updated = musicians.map(m => m.id === editingMusicianId ? {
        ...m,
        name: musicianForm.name,
        role: musicianForm.role,
        genre: musicianForm.genre,
        description: musicianForm.description,
        phone: musicianForm.phone
      } : m);
      saveMusicians(updated);
      showNotification(`Музыкант «${musicianForm.name}» обновлен`);
    } else {
      const newMus = {
        id: Date.now(),
        name: musicianForm.name,
        role: musicianForm.role,
        genre: musicianForm.genre,
        description: musicianForm.description,
        phone: musicianForm.phone
      };
      const updated = [...musicians, newMus];
      saveMusicians(updated);

      // Auto-select this musician if schedule modal is open
      if (scheduleModalOpen) {
        setScheduleForm(prev => ({
          ...prev,
          selected_musician_ids: [...prev.selected_musician_ids, newMus.id]
        }));
      }

      showNotification(`Музыкант «${musicianForm.name}» добавлен в справочник!`);
    }
    setMusicianModalOpen(false);
  };

  const handleDeleteMusician = (id, name) => {
    if (window.confirm(`Удалить музыканта «${name}» из справочника?`)) {
      saveMusicians(musicians.filter(m => m.id !== id));
      showNotification(`Музыкант «${name}» удален`);
    }
  };

  // -------------------------------------------------------------
  // VENUES & PIERS CRUD (Direct or Inside Schedule Modal)
  // -------------------------------------------------------------
  const handleOpenAddVenue = () => {
    setEditingVenueId(null);
    setVenueForm({
      name: '',
      pier_address: 'Санкт-Петербург, Причал Набережная Макарова, 34',
      capacity: 120,
      description: ''
    });
    setVenueModalOpen(true);
  };

  const handleSaveVenue = (e) => {
    e.preventDefault();
    if (!venueForm.name.trim() || !venueForm.pier_address.trim()) {
      alert('Укажите название судна и адрес причала');
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
      saveVenues(updated);
      showNotification(`Площадка «${venueForm.name}» обновлена`);
    } else {
      const newVn = {
        id: Date.now(),
        name: venueForm.name,
        pier_address: venueForm.pier_address,
        capacity: Number(venueForm.capacity),
        description: venueForm.description
      };
      const updated = [...venues, newVn];
      saveVenues(updated);

      // If schedule creation modal is currently open, automatically select this new venue!
      if (scheduleModalOpen) {
        setScheduleForm(prev => ({
          ...prev,
          venue_id: newVn.id
        }));
      }

      showNotification(`Судно «${venueForm.name}» добавлено в справочник и выбрано!`);
    }
    setVenueModalOpen(false);
  };

  const handleDeleteVenue = (id, name) => {
    if (venues.length <= 1) {
      alert('В справочнике должно оставаться хотя бы одно судно');
      return;
    }
    if (window.confirm(`Удалить судно «${name}» из справочника?`)) {
      saveVenues(venues.filter(v => v.id !== id));
      showNotification(`Судно «${name}» удалено`);
    }
  };

  const handleDuplicateVenue = (id, name) => {
    const venueToCopy = venues.find(v => v.id === id);
    if (!venueToCopy) return;
    const newVn = {
      ...venueToCopy,
      id: Date.now(),
      name: `${venueToCopy.name} (Копия)`
    };
    saveVenues([...venues, newVn]);
    showNotification(`Схема / судно скопировано: ${newVn.name}`);
  };

  // Filtered schedule
  const filteredSessions = sessions
    .filter(s => {
      // Filter by program
      if (scheduleProgramFilter !== 'all' && s.event_id.toString() !== scheduleProgramFilter.toString()) {
        return false;
      }
      
      // Filter by event type
      if (scheduleTypeFilter !== 'all') {
        const ev = events.find(e => e.id === s.event_id);
        if (ev && ev.event_type !== scheduleTypeFilter) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      const timeA = a && a.start_time ? new Date(a.start_time).getTime() : 0;
      const timeB = b && b.start_time ? new Date(b.start_time).getTime() : 0;
      return timeA - timeB;
    });

  const currentSelectedVenue = venues.find(v => v.id === Number(scheduleForm.venue_id)) || venues[0];

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {/* LEFT SIDEBAR: 4 Main Sections */}
      <div className="glass" style={{ flex: '1 1 270px', padding: '20px' }}>
        <h4 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontSize: '16px' }}>
          <Music size={20} color="var(--color-primary)" />
          Репертуар & Расписание
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Section 1: Программы */}
          <div
            onClick={() => setCurrentSection('events')}
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              background: currentSection === 'events' ? '#eff6ff' : '#f8fafc',
              border: currentSection === 'events' ? '1px solid #3b82f6' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Music size={18} color={currentSection === 'events' ? '#2563eb' : '#64748b'} />
              <span style={{ fontWeight: currentSection === 'events' ? 'bold' : '600', color: currentSection === 'events' ? '#1d4ed8' : '#334155', fontSize: '14px' }}>
                🎭 Программы
              </span>
            </div>
            <span style={{
              fontSize: '12px',
              background: currentSection === 'events' ? '#2563eb' : '#e2e8f0',
              color: currentSection === 'events' ? '#ffffff' : '#334155',
              padding: '2px 8px',
              borderRadius: '12px',
              fontWeight: 'bold'
            }}>
              {events.length}
            </span>
          </div>

          {/* Section 2: Расписание */}
          <div
            onClick={() => setCurrentSection('sessions')}
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              background: currentSection === 'sessions' ? '#eff6ff' : '#f8fafc',
              border: currentSection === 'sessions' ? '1px solid #3b82f6' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={18} color={currentSection === 'sessions' ? '#2563eb' : '#64748b'} />
              <span style={{ fontWeight: currentSection === 'sessions' ? 'bold' : '600', color: currentSection === 'sessions' ? '#1d4ed8' : '#334155', fontSize: '14px' }}>
                🗓️ Расписание
              </span>
            </div>
            <span style={{
              fontSize: '12px',
              background: currentSection === 'sessions' ? '#2563eb' : '#e2e8f0',
              color: currentSection === 'sessions' ? '#ffffff' : '#334155',
              padding: '2px 8px',
              borderRadius: '12px',
              fontWeight: 'bold'
            }}>
              {sessions.length}
            </span>
          </div>

          {/* Section 3: Справочник Музыканты */}
          <div
            onClick={() => setCurrentSection('musicians')}
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              background: currentSection === 'musicians' ? '#eff6ff' : '#f8fafc',
              border: currentSection === 'musicians' ? '1px solid #3b82f6' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mic size={18} color={currentSection === 'musicians' ? '#2563eb' : '#64748b'} />
              <span style={{ fontWeight: currentSection === 'musicians' ? 'bold' : '600', color: currentSection === 'musicians' ? '#1d4ed8' : '#334155', fontSize: '14px' }}>
                🎸 Музыканты
              </span>
            </div>
            <span style={{
              fontSize: '12px',
              background: currentSection === 'musicians' ? '#2563eb' : '#e2e8f0',
              color: currentSection === 'musicians' ? '#ffffff' : '#334155',
              padding: '2px 8px',
              borderRadius: '12px',
              fontWeight: 'bold'
            }}>
              {musicians.length}
            </span>
          </div>

          {/* Section 4: Конструктор схем */}
          <div
            onClick={() => {
              setCurrentSection('venues');
              setSelectedVenueForDeck(null); // Return to list view
            }}
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              background: currentSection === 'venues' ? '#eff6ff' : '#f8fafc',
              border: currentSection === 'venues' ? '1px solid #3b82f6' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layout size={18} color={currentSection === 'venues' ? '#2563eb' : '#64748b'} />
              <span style={{ fontWeight: currentSection === 'venues' ? 'bold' : '600', color: currentSection === 'venues' ? '#1d4ed8' : '#334155', fontSize: '14px' }}>
                📐 Конструктор схем
              </span>
            </div>
            <span style={{
              fontSize: '12px',
              background: currentSection === 'venues' ? '#2563eb' : '#e2e8f0',
              color: currentSection === 'venues' ? '#ffffff' : '#334155',
              padding: '2px 8px',
              borderRadius: '12px',
              fontWeight: 'bold'
            }}>
              {venues.length}
            </span>
          </div>

          {/* Section 5: Афиша (Виджет) */}
          <div
            onClick={() => setCurrentSection('afisha')}
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              background: currentSection === 'afisha' ? '#eff6ff' : '#f8fafc',
              border: currentSection === 'afisha' ? '1px solid #3b82f6' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={18} color={currentSection === 'afisha' ? '#2563eb' : '#64748b'} />
              <span style={{ fontWeight: currentSection === 'afisha' ? 'bold' : '600', color: currentSection === 'afisha' ? '#1d4ed8' : '#334155', fontSize: '14px' }}>
                ✨ Афиша (Виджет)
              </span>
            </div>
          </div>
        </div>
        
        {/* Section 6: Сайты & CMS */}
        <div
          onClick={() => setCurrentSection('sites')}
          style={{
            marginTop: '10px',
            padding: '14px 16px',
            borderRadius: '10px',
            background: currentSection === 'sites' ? '#eff6ff' : '#f8fafc',
            border: currentSection === 'sites' ? '1px solid #3b82f6' : '1px solid #e2e8f0',
            cursor: 'pointer',
            transition: 'all 0.15s',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Globe size={18} color={currentSection === 'sites' ? '#2563eb' : '#64748b'} />
            <span style={{ fontWeight: currentSection === 'sites' ? 'bold' : '600', color: currentSection === 'sites' ? '#1d4ed8' : '#334155', fontSize: '14px' }}>
              Сайты & CMS
            </span>
          </div>
        </div>

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
            💡 <strong>Единый процесс:</strong> Создавайте программы и сразу назначайте на них рейсы, выбирая или добавляя на лету нужные <strong>теплоходы, причалы и музыкантов</strong>.
          </div>
        </div>
      </div>

      {/* RIGHT WORKSPACE */}
      <div className="glass" style={{ flex: '1 1 700px', padding: '24px' }}>
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

        {/* 1. ПРОГРАММЫ (EVENTS) */}
        {currentSection === 'events' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Music size={22} color="var(--color-primary)" />
                  Репертуар программ ({events.length})
                </h3>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                  Создавайте программы и назначайте на них регулярные или одиночные рейсы
                </div>
              </div>
              <button
                onClick={handleOpenCreateEvent}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 20px', borderRadius: '8px', fontWeight: 'bold' }}
              >
                <Plus size={16} /> Создать программу
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {events.map(ev => {
                const programSessionsCount = sessions.filter(s => s.event_id === ev.id).length;
                return (
                  <div
                    key={ev.id}
                    style={{
                      padding: '18px 20px',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '16px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ flex: '1 1 340px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '17px', color: '#0f172a' }}>{ev.title}</span>
                        {ev.is_featured && (
                          <span style={{ fontSize: '10px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '2px 7px', borderRadius: '4px', fontWeight: 'bold' }}>
                            🔥 ХИТ СЕЗОНА
                          </span>
                        )}
                        <span style={{ fontSize: '11px', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>
                          🗓️ {programSessionsCount} {programSessionsCount === 1 ? 'рейс' : 'рейсов'}
                        </span>
                      </div>

                      <div style={{ fontSize: '13px', color: '#475569', marginTop: '6px' }}>
                        {ev.short_desc || '—'}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '10px', flexWrap: 'wrap', fontSize: '12px' }}>
                        <span style={{ background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>
                          /{ev.slug}/
                        </span>
                        <span style={{ color: '#64748b' }}>
                          ⏱ {ev.duration_minutes || 120} мин
                        </span>
                        <span style={{ color: '#64748b' }}>
                          🔞 {ev.age_restriction || '18+'}
                        </span>
                        <strong style={{ color: '#059669', fontSize: '14px' }}>
                          от {ev.min_price || 1500} ₽
                        </strong>
                        {(() => {
                          const tl = getTicketlandStatus(ev.iframe_code);
                          return (
                            <span style={{ fontSize: '11px', background: tl.bg, color: tl.color, padding: '3px 8px', borderRadius: '4px', fontWeight: '600' }}>
                              🎟️ {tl.label}
                            </span>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Action buttons on the program card */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleOpenScheduleModal(ev)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          background: '#2563eb',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(37,99,235,0.25)'
                        }}
                      >
                        <Calendar size={15} /> Назначить рейсы
                      </button>

                      <button
                        onClick={() => handleOpenEditEvent(ev)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '8px 12px',
                          background: '#f8fafc',
                          color: '#334155',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
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
                          padding: '8px 10px',
                          background: '#fff1f2',
                          color: '#e11d48',
                          border: '1px solid #fecdd3',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {events.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', background: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                  Программы еще не добавлены. Нажмите «Создать программу» выше!
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. РАСПИСАНИЕ & РЕЙСЫ (SESSIONS) */}
        {currentSection === 'sessions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={22} color="var(--color-primary)" />
                  Расписание рейсов ({filteredSessions.length})
                </h3>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                  Список всех назначенных сеансов, причалов и музыкантов на борту
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                  <button
                    onClick={() => setScheduleViewMode('list')}
                    style={{
                      padding: '6px 12px',
                      background: scheduleViewMode === 'list' ? '#e2e8f0' : '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: scheduleViewMode === 'list' ? 'bold' : 'normal'
                    }}
                  >
                    <List size={14} /> Список
                  </button>
                  <button
                    onClick={() => setScheduleViewMode('calendar')}
                    style={{
                      padding: '6px 12px',
                      background: scheduleViewMode === 'calendar' ? '#e2e8f0' : '#ffffff',
                      border: 'none',
                      borderLeft: '1px solid #cbd5e1',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: scheduleViewMode === 'calendar' ? 'bold' : 'normal'
                    }}
                  >
                    <Grid size={14} /> Календарь
                  </button>
                </div>

                <select
                  className="form-input"
                  value={scheduleTypeFilter}
                  onChange={e => setScheduleTypeFilter(e.target.value)}
                  style={{ fontSize: '13px', fontWeight: '600' }}
                >
                  <option value="all">Все типы мероприятий</option>
                  <option value="Музыкальный круиз">Музыкальный круиз</option>
                  <option value="Трибьют-концерт">Трибьют-концерт</option>
                  <option value="Джаз на Неве">Джаз на Неве</option>
                  <option value="Вечеринка">Вечеринка</option>
                  <option value="Экскурсия">Экскурсия</option>
                </select>

                <select
                  className="form-input"
                  value={scheduleProgramFilter}
                  onChange={e => setScheduleProgramFilter(e.target.value)}
                  style={{ fontSize: '13px', fontWeight: '600' }}
                >
                  <option value="all">Все программы ({sessions.length})</option>
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    const currentFilteredProg = events.find(e => e.id === Number(scheduleProgramFilter)) || events[0];
                    if (currentFilteredProg) handleOpenScheduleModal(currentFilteredProg);
                  }}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold' }}
                >
                  <Plus size={16} /> Назначить рейсы
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {scheduleViewMode === 'calendar' ? (
                (() => {
                  const year = calendarMonth.getFullYear();
                  const month = calendarMonth.getMonth();
                  const firstDay = new Date(year, month, 1).getDay();
                  const daysInMonth = new Date(year, month + 1, 0).getDate();
                  const startOffset = (firstDay === 0 ? 7 : firstDay) - 1; // Mon = 0
                  
                  const days = [];
                  for (let i = 0; i < startOffset; i++) days.push(null);
                  for (let i = 1; i <= daysInMonth; i++) days.push(i);

                  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

                  return (
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <button onClick={() => setCalendarMonth(new Date(year, month - 1, 1))} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}>&larr; Пред. месяц</button>
                        <strong style={{ fontSize: '16px' }}>{monthNames[month]} {year}</strong>
                        <button onClick={() => setCalendarMonth(new Date(year, month + 1, 1))} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}>След. месяц &rarr;</button>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontWeight: 'bold', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                        <div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div>Сб</div><div>Вс</div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', gridAutoRows: 'minmax(100px, auto)' }}>
                        {days.map((d, idx) => {
                          if (d === null) return <div key={`empty-${idx}`} style={{ background: '#f8fafc', borderRadius: '6px' }} />;
                          
                          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                          const daySessions = filteredSessions.filter(s => s.start_time.startsWith(dateStr));
                          
                          return (
                            <div key={`day-${d}`} style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px', display: 'flex', flexDirection: 'column', background: daySessions.length > 0 ? '#f0fdf4' : '#ffffff' }}>
                              <span style={{ fontSize: '14px', fontWeight: 'bold', color: daySessions.length > 0 ? '#16a34a' : '#64748b', marginBottom: '6px' }}>{d}</span>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', flex: 1 }}>
                                {daySessions.map(s => {
                                  const prog = events.find(e => e.id === s.event_id);
                                  const dur = s.duration_minutes || prog?.duration_minutes || 120;
                                  const tInfo = getSessionTimeRange(s.start_time, dur);
                                  return (
                                    <div key={s.id} style={{ fontSize: '10px', background: '#ffffff', border: '1px solid #dcfce3', padding: '4px 6px', borderRadius: '4px', textAlign: 'left', lineHeight: '1.2' }}>
                                      <strong style={{ color: '#0f172a' }}>{tInfo.range || s.start_time.split(' ')[1]}</strong><br/>
                                      <span style={{ color: '#2563eb', fontWeight: '500' }}>{s.event_title}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <>
                  {filteredSessions.slice(0, 60).map(s => {
                    const prog = events.find(e => e.id === s.event_id);
                    const dur = s.duration_minutes || prog?.duration_minutes || 120;
                    const tInfo = getSessionTimeRange(s.start_time, dur);
                    return (
                      <div
                        key={s.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '14px 18px',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          gap: '14px',
                          flexWrap: 'wrap'
                        }}
                      >
                        <div style={{ flex: '1 1 380px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <div style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#1d4ed8', fontSize: '14px', background: '#eff6ff', padding: '3px 8px', borderRadius: '6px' }}>
                              🗓️ {tInfo.date} &nbsp;⏰ {tInfo.range}
                            </div>
                            <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                              ⏱ {dur} мин
                            </span>
                            <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '15px' }}>
                              {s.event_title}
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px', flexWrap: 'wrap', fontSize: '12px', color: '#64748b' }}>
                            <span>📍 {s.venue_name} ({s.pier_address})</span>
                            {s.musician_names && s.musician_names.length > 0 && (
                              <span style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                                🎸 {s.musician_names.join(', ')}
                              </span>
                            )}
                          </div>
                        </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <strong style={{ color: '#059669', fontSize: '15px' }}>{s.min_price || 1500} ₽</strong>
                        <button
                          onClick={() => handleDeleteSession(s.id)}
                          title="Удалить рейс"
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

                  {filteredSessions.length > 60 && (
                    <div style={{ textAlign: 'center', padding: '12px', color: '#64748b', fontSize: '12px' }}>
                      Показано первые 60 из {filteredSessions.length} рейсов.
                    </div>
                  )}

                  {filteredSessions.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', background: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                      Рейсы для выбранной программы еще не созданы. Нажмите <strong>«Назначить рейсы»</strong> выше!
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* 3. СПРАВОЧНИК МУЗЫКАНТОВ (MUSICIANS DIRECTORY) */}
        {currentSection === 'musicians' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mic size={22} color="var(--color-primary)" />
                  Справочник музыкантов и артистов ({musicians.length})
                </h3>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                  База артистов и коллективов для привязки к рейсам и программам
                </div>
              </div>
              <button
                onClick={handleOpenAddMusician}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '8px', fontWeight: 'bold' }}
              >
                <Plus size={16} /> Добавить музыканта
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
              {musicians.map(mus => (
                <div
                  key={mus.id}
                  style={{
                    padding: '18px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <h4 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: 'bold' }}>
                        {mus.name}
                      </h4>
                      <span style={{ fontSize: '11px', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>
                        {mus.role}
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: '#7c3aed', fontWeight: '600', marginTop: '4px' }}>
                      🎵 {mus.genre}
                    </div>

                    <div style={{ fontSize: '13px', color: '#475569', marginTop: '8px', lineHeight: '1.4' }}>
                      {mus.description || 'Описание не указано'}
                    </div>

                    {mus.phone && (
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '10px' }}>
                        📞 Контакт: <strong>{mus.phone}</strong>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                    <button
                      onClick={() => handleOpenEditMusician(mus)}
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
                    <button
                      onClick={() => handleDeleteMusician(mus.id, mus.name)}
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
            </div>
          </div>
        )}

        {/* 4. ПЛОЩАДКИ & СУДА (VENUES / DECK BUILDER) */}
        {currentSection === 'venues' && (
          <div>
            {selectedVenueForDeck ? (
              <DeckBuilder 
                venue={venues.find(v => v.id === selectedVenueForDeck)} 
                onSave={(deckData) => {
                  const vn = venues.find(v => v.id === selectedVenueForDeck);
                  if (vn) {
                    saveVenues(venues.map(v => v.id === vn.id ? { ...v, deckData } : v));
                    showNotification('Схема рассадки сохранена!');
                  }
                }}
                onCancel={() => setSelectedVenueForDeck(null)}
              />
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Layout size={22} color="var(--color-primary)" />
                      Конструктор схем, теплоходы и причалы ({venues.length})
                    </h3>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                      Суда, их схемы рассадки (столики / танцпол) и адреса причалов
                    </div>
                  </div>
                  <button
                    onClick={handleOpenAddVenue}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '8px', fontWeight: 'bold' }}
                  >
                    <Plus size={16} /> Добавить судно
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {venues.map(vn => (
                    <div
                      key={vn.id}
                      style={{
                        padding: '18px',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: 'bold' }}>
                            {vn.name}
                          </h4>
                          <div style={{ fontSize: '13px', color: '#2563eb', margin: '6px 0 4px 0' }}>
                            📍 {vn.pier_address}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>
                            {vn.description}
                          </div>
                          {(() => {
                            const capInfo = getVenueCapacityBreakdown(vn);
                            const priceVal = validateDeckPricing(vn.deckData);
                            return (
                              <div style={{ marginTop: '8px', fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span>Вместимость: <strong>{capInfo.total} пассажиров</strong></span>
                                {capInfo.isCalculated ? (
                                  <span style={{ fontSize: '11px', background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                                    ✓ Схема активна: {capInfo.seats} кресел + {capInfo.zones} танцпол
                                  </span>
                                ) : (
                                  <span style={{ fontSize: '11px', background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '2px 8px', borderRadius: '12px' }}>
                                    ⚠️ Схема не нарисована (по умолчанию {vn.capacity} мест)
                                  </span>
                                )}
                                {vn.deckData && (
                                  priceVal.isValid ? (
                                    <span style={{ fontSize: '11px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '2px 6px', borderRadius: '6px', fontWeight: '600' }}>
                                      💰 Цены настроены
                                    </span>
                                  ) : (
                                    <span style={{ fontSize: '11px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '2px 6px', borderRadius: '6px', fontWeight: 'bold' }}>
                                      ⚠️ {priceVal.issues[0]}
                                    </span>
                                  )
                                )}
                              </div>
                            );
                          })()}
                        </div>

                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '300px' }}>
                          <button
                            onClick={() => setSelectedVenueForDeck(vn.id)}
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
                            <Layout size={14} /> Конструктор схемы
                          </button>
                          <button
                            onClick={() => handleDuplicateVenue(vn.id, vn.name)}
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
                            <Copy size={14} /> Копировать
                          </button>
                          <button
                            onClick={() => {
                              setEditingVenueId(vn.id);
                              setVenueForm({
                                name: vn.name,
                                pier_address: vn.pier_address,
                                capacity: vn.capacity || 120,
                                description: vn.description || ''
                              });
                              setVenueModalOpen(true);
                            }}
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
                            <Edit3 size={14} /> Настройки
                          </button>
                          <button
                            onClick={() => handleDeleteVenue(vn.id, vn.name)}
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
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. АФИША (WIDGET GENERATOR) */}
        {currentSection === 'afisha' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
              <Sparkles size={24} color="var(--color-primary)" />
              <div>
                <h3 style={{ margin: 0, color: '#0f172a', fontSize: '18px' }}>
                  Генератор виджета Афиши & Создание страниц
                </h3>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                  Выберите целевой сайт и контент для автоматической генерации страницы с виджетом продажи билетов
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Globe size={15} color="var(--color-primary)" />
                    Сайт (Коммерческий проект) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    className="form-input"
                    value={widgetSiteId}
                    onChange={(e) => setWidgetSiteId(e.target.value)}
                    required
                    style={{ width: '100%', marginTop: '6px', borderColor: !widgetSiteId ? '#f87171' : '#cbd5e1', fontWeight: '500' }}
                  >
                    <option value="">-- Выберите сайт (Обязательно) --</option>
                    {(() => {
                      const savedCms = localStorage.getItem('cms_domains_v2');
                      const list = savedCms ? JSON.parse(savedCms) : DEFAULT_DOMAINS;
                      return list.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.title})
                        </option>
                      ));
                    })()}
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: '600' }}>Программа</label>
                  <select
                    className="form-input"
                    value={widgetProgramId}
                    onChange={(e) => {
                      setWidgetProgramId(e.target.value);
                      setWidgetSessionId('');
                    }}
                    style={{ width: '100%', marginTop: '6px' }}
                  >
                    <option value="">Все программы (Сводная афиша)</option>
                    {events.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: '600' }}>Конкретный рейс / Сеанс</label>
                  <select
                    className="form-input"
                    value={widgetSessionId}
                    onChange={(e) => setWidgetSessionId(e.target.value)}
                    style={{ width: '100%', marginTop: '6px' }}
                  >
                    <option value="">Все доступные рейсы</option>
                    {sessions
                      .filter((s) => !widgetProgramId || s.event_id === Number(widgetProgramId))
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.start_time} — {s.event_title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  💡 При нажатии страница с виджетом будет создана на выбранном сайте и откроется в редакторе «Сайты & CMS».
                </div>
                <button
                  onClick={handleCreatePageWithWidget}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '8px', fontWeight: 'bold' }}
                >
                  <Sparkles size={18} />
                  Создать страницу с виджетом
                </button>
              </div>
            </div>

            <h4 style={{ margin: '0 0 16px 0', color: '#334155' }}>Предварительный просмотр Афиши:</h4>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
              <Afisha onSelectEvent={onSelectEvent} />
            </div>
          </div>
        )}

        {/* 6. САЙТЫ & CMS */}
        {currentSection === 'sites' && (
          <div>
            <SitesAdmin initialDomainId={sitesInitialDomainId} />
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: PROGRAM CREATE / EDIT                            */}
      {/* ========================================================= */}
      {eventModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '17px', color: '#0f172a' }}>
                {editingEventId ? 'Редактирование программы' : 'Новая программа в репертуар'}
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
                  <label className="form-label">Тип мероприятия</label>
                  <select className="form-input" value={eventForm.event_type} onChange={e => setEventForm({ ...eventForm, event_type: e.target.value })} style={{ width: '100%', marginTop: '4px' }}>
                    <option value="Музыкальный круиз">Музыкальный круиз</option>
                    <option value="Трибьют-концерт">Трибьют-концерт</option>
                    <option value="Джаз на Неве">Джаз на Неве</option>
                    <option value="Вечеринка">Вечеринка</option>
                    <option value="Экскурсия">Экскурсия</option>
                  </select>
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

      {/* ========================================================= */}
      {/* MODAL 2: UNIFIED EVENT CREATION & SCHEDULE GENERATOR      */}
      {/* ========================================================= */}
      {scheduleModalOpen && targetProgram && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '18px 24px', background: '#2563eb', color: 'white', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '17px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} /> Назначить рейсы (Создать мероприятие)
                </h4>
                <div style={{ fontSize: '12px', color: '#bfdbfe', marginTop: '2px' }}>
                  Программа: <strong>{targetProgram.title}</strong>
                </div>
              </div>
              <button onClick={() => setScheduleModalOpen(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', padding: '6px', color: 'white', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleSaveSchedule} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* 1. Program Selector (Explicit link between Session and Program) */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <label className="form-label" style={{ fontWeight: 'bold', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px', color: '#0f172a' }}>
                  <Music size={16} color="#2563eb" /> Программа (Репертуар) *
                </label>
                <select
                  className="form-input"
                  value={targetProgram.id}
                  onChange={(e) => {
                    const selected = events.find((ev) => ev.id === Number(e.target.value));
                    if (selected) {
                      setTargetProgram(selected);
                      setScheduleForm(prev => ({
                        ...prev,
                        min_price: selected.min_price || prev.min_price,
                        selected_musician_ids: selected.default_musician_ids || prev.selected_musician_ids
                      }));
                    }
                  }}
                  required
                  style={{ width: '100%', fontWeight: '600', fontSize: '14px', background: '#ffffff' }}
                >
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} ({ev.event_type || 'Концерт'}) — от {ev.min_price || 1500} ₽
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  Каждый созданный рейс (сеанс) автоматически привязывается к этой программе по ID и отображается в её афише.
                </div>
              </div>

              {/* Type Switcher: Single vs Recurring */}
              <div>
                <label className="form-label" style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block', color: '#0f172a' }}>
                  Тип назначения рейсов:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div
                    onClick={() => setScheduleMode('recurring')}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: scheduleMode === 'recurring' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      background: scheduleMode === 'recurring' ? '#eff6ff' : '#f8fafc',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: scheduleMode === 'recurring' ? '#1d4ed8' : '#334155' }}>
                      <input type="radio" checked={scheduleMode === 'recurring'} onChange={() => setScheduleMode('recurring')} />
                      <span>🗓️ Регулярные рейсы на сезон</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', marginLeft: '24px' }}>
                      Массовая генерация по дням недели на май–сентябрь
                    </div>
                  </div>

                  <div
                    onClick={() => setScheduleMode('single')}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: scheduleMode === 'single' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      background: scheduleMode === 'single' ? '#eff6ff' : '#f8fafc',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: scheduleMode === 'single' ? '#1d4ed8' : '#334155' }}>
                      <input type="radio" checked={scheduleMode === 'single'} onChange={() => setScheduleMode('single')} />
                      <span>🎟️ Одиночное мероприятие</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', marginLeft: '24px' }}>
                      Один конкретный рейс в выбранную дату и время
                    </div>
                  </div>
                </div>
              </div>

              {/* Venue & Pier with inline "+ Добавить судно/причал" button */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" style={{ fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Anchor size={16} color="#2563eb" /> Площадка, Теплоход и Причал *
                  </label>
                  <button
                    type="button"
                    onClick={handleOpenAddVenue}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      background: '#eff6ff',
                      color: '#2563eb',
                      border: '1px solid #bfdbfe',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={14} /> Добавить судно / причал
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                  <div>
                    <select
                      className="form-input"
                      value={scheduleForm.venue_id}
                      onChange={e => setScheduleForm({ ...scheduleForm, venue_id: Number(e.target.value) })}
                      required
                      style={{ width: '100%', fontWeight: '600' }}
                    >
                      {venues.map(vn => {
                        const cap = getVenueCapacityBreakdown(vn);
                        return (
                          <option key={vn.id} value={vn.id}>
                            {vn.name} ({cap.total} мест{cap.isCalculated ? `: ${cap.seats} ст. + ${cap.zones} вход.` : ''})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      className="form-input"
                      value={scheduleForm.min_price}
                      onChange={e => setScheduleForm({ ...scheduleForm, min_price: e.target.value })}
                      placeholder="Цена (₽)"
                      required
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                {currentSelectedVenue && (
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="#059669" />
                    <span>Причал: <strong>{currentSelectedVenue.pier_address}</strong> (вместимость по схеме: <strong>{getVenueCapacityBreakdown(currentSelectedVenue).total} чел.</strong>)</span>
                  </div>
                )}
              </div>

              {/* SINGLE MODE FIELDS */}
              {scheduleMode === 'single' && (
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label" style={{ fontWeight: '600' }}>Дата рейса *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={scheduleForm.single_date}
                      onChange={e => setScheduleForm({ ...scheduleForm, single_date: e.target.value })}
                      required
                      style={{ width: '100%', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontWeight: '600' }}>Время отправления *</label>
                    <input
                      type="time"
                      className="form-input"
                      value={scheduleForm.single_time}
                      onChange={e => setScheduleForm({ ...scheduleForm, single_time: e.target.value })}
                      required
                      style={{ width: '100%', marginTop: '4px' }}
                    />
                  </div>
                </div>
              )}

              {/* RECURRING MODE FIELDS */}
              {scheduleMode === 'recurring' && (
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label className="form-label" style={{ fontWeight: '600' }}>Период с:</label>
                      <input
                        type="date"
                        className="form-input"
                        value={scheduleForm.date_from}
                        onChange={e => setScheduleForm({ ...scheduleForm, date_from: e.target.value })}
                        required
                        style={{ width: '100%', marginTop: '4px' }}
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontWeight: '600' }}>Период по:</label>
                      <input
                        type="date"
                        className="form-input"
                        value={scheduleForm.date_to}
                        onChange={e => setScheduleForm({ ...scheduleForm, date_to: e.target.value })}
                        required
                        style={{ width: '100%', marginTop: '4px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label" style={{ fontWeight: '600', marginBottom: '6px', display: 'block' }}>Дни недели регулярных рейсов:</label>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {[
                        { id: 1, label: 'Пн' }, { id: 2, label: 'Вт' }, { id: 3, label: 'Ср' },
                        { id: 4, label: 'Чт' }, { id: 5, label: 'Пт' }, { id: 6, label: 'Сб' }, { id: 0, label: 'Вс' }
                      ].map(d => (
                        <label key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', cursor: 'pointer', background: '#ffffff', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '6px' }}>
                          <input
                            type="checkbox"
                            checked={scheduleForm.days_of_week.includes(d.id)}
                            onChange={e => {
                              if (e.target.checked) {
                                setScheduleForm({ ...scheduleForm, days_of_week: [...scheduleForm.days_of_week, d.id] });
                              } else {
                                setScheduleForm({ ...scheduleForm, days_of_week: scheduleForm.days_of_week.filter(id => id !== d.id) });
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

                  <div>
                    <label className="form-label" style={{ fontWeight: '600' }}>Время отправления (через запятую) *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={scheduleForm.times}
                      onChange={e => setScheduleForm({ ...scheduleForm, times: e.target.value })}
                      placeholder="19:00, 21:30"
                      required
                      style={{ width: '100%', marginTop: '4px' }}
                    />
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
                      Будет создан отдельный сеанс на каждое указанное время в каждый выбранный день недели
                    </div>
                  </div>
                </div>
              )}

              {/* MUSICIANS DIRECTORY PICKER & ADD BUTTON */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" style={{ fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mic size={16} color="#7c3aed" /> Музыканты / Артисты на борту:
                  </label>
                  <button
                    type="button"
                    onClick={handleOpenAddMusician}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      background: '#f3e8ff',
                      color: '#7e22ce',
                      border: '1px solid #d8b4fe',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={14} /> Добавить музыканта
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', maxHeight: '140px', overflowY: 'auto', padding: '4px' }}>
                  {musicians.map(m => {
                    const isSelected = scheduleForm.selected_musician_ids.includes(m.id);
                    return (
                      <div
                        key={m.id}
                        onClick={() => {
                          if (isSelected) {
                            setScheduleForm({ ...scheduleForm, selected_musician_ids: scheduleForm.selected_musician_ids.filter(id => id !== m.id) });
                          } else {
                            setScheduleForm({ ...scheduleForm, selected_musician_ids: [...scheduleForm.selected_musician_ids, m.id] });
                          }
                        }}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: isSelected ? '1px solid #7c3aed' : '1px solid #e2e8f0',
                          background: isSelected ? '#faf5ff' : '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <input type="checkbox" checked={isSelected} readOnly />
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontSize: '13px', fontWeight: isSelected ? 'bold' : '500', color: isSelected ? '#6b21a8' : '#1e293b', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {m.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            {m.genre}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setScheduleModalOpen(false)} style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer' }}>Отмена</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 24px', borderRadius: '8px', fontWeight: 'bold' }}>
                  {scheduleMode === 'single' ? 'Создать рейс' : 'Сгенерировать регулярные рейсы'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: MUSICIAN CREATE / EDIT                           */}
      {/* ========================================================= */}
      {musicianModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '540px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '17px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mic size={18} color="#7c3aed" /> {editingMusicianId ? 'Редактировать музыканта' : 'Новый артист в справочник'}
            </h4>
            <form onSubmit={handleSaveMusician} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="form-label" style={{ fontWeight: '600' }}>Имя артиста или Название группы *</label>
                <input
                  type="text"
                  className="form-input"
                  value={musicianForm.name}
                  onChange={e => setMusicianForm({ ...musicianForm, name: e.target.value })}
                  required
                  placeholder="Например: Рок-группа «Кинохроника»"
                  style={{ width: '100%', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: '600' }}>Формат / Роль</label>
                  <input
                    type="text"
                    className="form-input"
                    value={musicianForm.role}
                    onChange={e => setMusicianForm({ ...musicianForm, role: e.target.value })}
                    placeholder="Трибьют-группа, Солист..."
                    style={{ width: '100%', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: '600' }}>Музыкальный жанр</label>
                  <input
                    type="text"
                    className="form-input"
                    value={musicianForm.genre}
                    onChange={e => setMusicianForm({ ...musicianForm, genre: e.target.value })}
                    placeholder="Русский рок, Джаз..."
                    style={{ width: '100%', marginTop: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Краткое описание / репертуар</label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={musicianForm.description}
                  onChange={e => setMusicianForm({ ...musicianForm, description: e.target.value })}
                  placeholder="Исполнение хитов Цоя, живой звук..."
                  style={{ width: '100%', marginTop: '4px' }}
                />
              </div>

              <div>
                <label className="form-label">Телефон / Контакт представителя</label>
                <input
                  type="text"
                  className="form-input"
                  value={musicianForm.phone}
                  onChange={e => setMusicianForm({ ...musicianForm, phone: e.target.value })}
                  placeholder="+7 (921) ..."
                  style={{ width: '100%', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setMusicianModalOpen(false)} style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer' }}>Отмена</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', borderRadius: '8px' }}>Сохранить в справочник</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: VENUE & PIER CREATE / EDIT                       */}
      {/* ========================================================= */}
      {venueModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '540px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '17px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Anchor size={18} color="#2563eb" /> {editingVenueId ? 'Редактирование площадки / судна' : 'Новое судно и причал в справочник'}
            </h4>
            <form onSubmit={handleSaveVenue} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="form-label" style={{ fontWeight: '600' }}>Название судна / Площадки *</label>
                <input
                  type="text"
                  className="form-input"
                  value={venueForm.name}
                  onChange={e => setVenueForm({ ...venueForm, name: e.target.value })}
                  required
                  placeholder="Теплоход «Рок Хит Нева»"
                  style={{ width: '100%', marginTop: '4px' }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: '600' }}>Адрес причала отправления (выводится на билетах) *</label>
                <input
                  type="text"
                  className="form-input"
                  value={venueForm.pier_address}
                  onChange={e => setVenueForm({ ...venueForm, pier_address: e.target.value })}
                  required
                  placeholder="Санкт-Петербург, Причал Набережная Макарова, 34"
                  style={{ width: '100%', marginTop: '4px' }}
                />
              </div>

              <div>
                <label className="form-label">Вместимость судна (пассажиров)</label>
                <input
                  type="number"
                  className="form-input"
                  value={venueForm.capacity}
                  onChange={e => setVenueForm({ ...venueForm, capacity: e.target.value })}
                  style={{ width: '100%', marginTop: '4px' }}
                />
              </div>

              <div>
                <label className="form-label">Описание судна (палубы, бар, сцена)</label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={venueForm.description}
                  onChange={e => setVenueForm({ ...venueForm, description: e.target.value })}
                  placeholder="Двухпалубный теплоход, закрытый теплый салон и открытая верхняя палуба..."
                  style={{ width: '100%', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setVenueModalOpen(false)} style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer' }}>Отмена</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', borderRadius: '8px' }}>Сохранить в справочник</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
