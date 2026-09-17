import React, { useState, useEffect } from 'react';
import { 
  Music, Calendar, Anchor, Plus, Edit3, Trash2, X, 
  Check, Sparkles, Filter, Clock, MapPin, Tag, Layers
} from 'lucide-react';

const INITIAL_EVENTS = [
  {
    id: 1,
    domain_id: 2,
    domain_name: 'rockhitneva.ru',
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
    domain_name: 'rockhitneva.ru',
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
    domain_name: 'rockhitneva.ru',
    title: 'Рок под разводными мостами',
    slug: 'rock-bridges',
    short_desc: 'Ночной круиз под разводку Дворцового и Троицкого мостов в сопровождении рок-бэнда.',
    duration_minutes: 150,
    age_restriction: '18+',
    min_price: 2200,
    is_featured: true,
    iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/rock-bridges/"></div>'
  },
  {
    id: 4,
    domain_id: 2,
    domain_name: 'rockhitneva.ru',
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
    domain_name: 'rockhitneva.ru',
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
    domain_name: 'aquasound.club',
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
    domain_name: 'aquasound.club',
    title: 'Разводные мосты',
    slug: 'bridges',
    short_desc: 'Романтический ночной рейс под музыку саксофона с выходом в Финский залив.',
    duration_minutes: 150,
    age_restriction: '18+',
    min_price: 2000,
    is_featured: true,
    iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/bridges/"></div>'
  }
];

const INITIAL_VENUES = [
  {
    id: 1,
    domain_id: 2,
    domain_name: 'rockhitneva.ru',
    name: 'Теплоход «Рок Хит Нева»',
    pier_address: 'Санкт-Петербург, ст. м. Спортивная, причал Набережная Макарова, 34',
    capacity: 120,
    description: 'Двухпалубный комфортабельный рок-теплоход с закрытым теплым салоном и открытой верхней палубой'
  },
  {
    id: 2,
    domain_id: 1,
    domain_name: 'aquasound.club',
    name: 'Теплоход «Акватория Звука»',
    pier_address: 'Санкт-Петербург, ст. м. Спортивная, причал Набережная Макарова, 34',
    capacity: 100,
    description: 'Музыкальный теплоход-клуб с баром, живым звуком и панорамным обзором разводных мостов'
  }
];

const INITIAL_SESSIONS = [
  {
    id: 101,
    domain_id: 2,
    domain_name: 'rockhitneva.ru',
    event_id: 3,
    event_title: 'Рок под разводными мостами',
    venue_id: 1,
    venue_name: 'Теплоход «Рок Хит Нева»',
    pier_address: 'Причал Наб. Макарова, 34',
    start_time: '2026-05-01 23:55',
    min_price: 2200
  },
  {
    id: 102,
    domain_id: 2,
    domain_name: 'rockhitneva.ru',
    event_id: 1,
    event_title: 'Брат (Саундтреки к фильму)',
    venue_id: 1,
    venue_name: 'Теплоход «Рок Хит Нева»',
    pier_address: 'Причал Наб. Макарова, 34',
    start_time: '2026-05-02 19:30',
    min_price: 1800
  },
  {
    id: 103,
    domain_id: 2,
    domain_name: 'rockhitneva.ru',
    event_id: 2,
    event_title: 'Виктор Цой & Кино',
    venue_id: 1,
    venue_name: 'Теплоход «Рок Хит Нева»',
    pier_address: 'Причал Наб. Макарова, 34',
    start_time: '2026-05-02 22:00',
    min_price: 1700
  },
  {
    id: 104,
    domain_id: 1,
    domain_name: 'aquasound.club',
    event_id: 6,
    event_title: 'Большой круг по Неве',
    venue_id: 2,
    venue_name: 'Теплоход «Акватория Звука»',
    pier_address: 'Причал Наб. Макарова, 34',
    start_time: '2026-05-01 18:00',
    min_price: 1400
  },
  {
    id: 105,
    domain_id: 1,
    domain_name: 'aquasound.club',
    event_id: 7,
    event_title: 'Разводные мосты',
    venue_id: 2,
    venue_name: 'Теплоход «Акватория Звука»',
    pier_address: 'Причал Наб. Макарова, 34',
    start_time: '2026-05-01 23:55',
    min_price: 2000
  }
];

export default function ProgramsManager({ defaultSection = 'events' }) {
  const [currentSection, setCurrentSection] = useState(defaultSection); // 'events', 'sessions', 'venues'
  const [selectedSiteFilter, setSelectedSiteFilter] = useState('all'); // 'all', '2' (rockhitneva), '1' (aquasound)
  const [notification, setNotification] = useState('');

  // LocalStorage State
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('pm_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [venues, setVenues] = useState(() => {
    const saved = localStorage.getItem('pm_venues');
    return saved ? JSON.parse(saved) : INITIAL_VENUES;
  });

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('pm_sessions');
    return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
  });

  const saveEvents = (data) => {
    setEvents(data);
    localStorage.setItem('pm_events', JSON.stringify(data));
  };

  const saveVenues = (data) => {
    setVenues(data);
    localStorage.setItem('pm_venues', JSON.stringify(data));
  };

  const saveSessions = (data) => {
    setSessions(data);
    localStorage.setItem('pm_sessions', JSON.stringify(data));
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  // Modals state
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '', slug: '', domain_id: 2, short_desc: '', age_restriction: '18+',
    duration_minutes: 120, min_price: 1800, is_featured: true, iframe_code: ''
  });

  const [massGenModalOpen, setMassGenModalOpen] = useState(false);
  const [massGenForm, setMassGenForm] = useState({
    event_id: '',
    venue_id: '',
    date_from: '2026-05-01',
    date_to: '2026-09-30',
    days_of_week: [5, 6, 0],
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
    name: '', domain_id: 2, pier_address: 'Санкт-Петербург, Причал Набережная Макарова, 34', capacity: 120, description: ''
  });

  // Filtered lists based on Site filter
  const filteredEvents = selectedSiteFilter === 'all' 
    ? events 
    : events.filter(e => e.domain_id === Number(selectedSiteFilter));

  const filteredSessions = selectedSiteFilter === 'all' 
    ? sessions 
    : sessions.filter(s => s.domain_id === Number(selectedSiteFilter));

  const filteredVenues = selectedSiteFilter === 'all' 
    ? venues 
    : venues.filter(v => v.domain_id === Number(selectedSiteFilter));

  // Event handlers
  const handleOpenCreateEvent = () => {
    setEditingEventId(null);
    setEventForm({
      title: '',
      slug: '',
      domain_id: selectedSiteFilter === 'all' ? 2 : Number(selectedSiteFilter),
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
      domain_id: ev.domain_id || 2,
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
    const cleanSlug = eventForm.slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const domName = Number(eventForm.domain_id) === 1 ? 'aquasound.club' : 'rockhitneva.ru';

    if (editingEventId) {
      const updated = events.map(ev => ev.id === editingEventId ? {
        ...ev,
        title: eventForm.title,
        slug: cleanSlug,
        domain_id: Number(eventForm.domain_id),
        domain_name: domName,
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
        domain_id: Number(eventForm.domain_id),
        domain_name: domName,
        short_desc: eventForm.short_desc,
        age_restriction: eventForm.age_restriction,
        duration_minutes: Number(eventForm.duration_minutes),
        min_price: Number(eventForm.min_price),
        is_featured: eventForm.is_featured,
        iframe_code: eventForm.iframe_code
      };
      saveEvents([...events, newEv]);
      showNotification('Новое мероприятие создано!');
    }
    setEventModalOpen(false);
  };

  const handleDeleteEvent = (id, title) => {
    if (window.confirm(`Удалить программу "${title}"?`)) {
      saveEvents(events.filter(e => e.id !== id));
      showNotification(`Программа "${title}" удалена`);
    }
  };

  // Mass Generator
  const handleOpenMassGen = () => {
    const firstEv = filteredEvents[0] || events[0];
    const firstVn = filteredVenues[0] || venues[0];
    setMassGenForm({
      event_id: firstEv ? firstEv.id : '',
      venue_id: firstVn ? firstVn.id : '',
      date_from: '2026-05-01',
      date_to: '2026-09-30',
      days_of_week: [5, 6, 0],
      times: '19:00, 21:30',
      min_price: firstEv ? firstEv.min_price : 1800
    });
    setMassGenModalOpen(true);
  };

  const handleRunMassGenerator = (e) => {
    e.preventDefault();
    const ev = events.find(item => item.id === Number(massGenForm.event_id));
    const vn = venues.find(item => item.id === Number(massGenForm.venue_id));
    if (!ev) {
      alert('Выберите программу');
      return;
    }

    const timeList = massGenForm.times.split(',').map(t => t.trim()).filter(Boolean);
    const startDate = new Date(massGenForm.date_from);
    const endDate = new Date(massGenForm.date_to);
    const newSessions = [];
    let count = 0;

    let curr = new Date(startDate);
    while (curr <= endDate) {
      const dayOfWeek = curr.getDay();
      if (massGenForm.days_of_week.includes(dayOfWeek)) {
        const year = curr.getFullYear();
        const month = String(curr.getMonth() + 1).padStart(2, '0');
        const day = String(curr.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        for (const t of timeList) {
          count++;
          newSessions.push({
            id: Date.now() + count,
            domain_id: ev.domain_id,
            domain_name: ev.domain_name,
            event_id: ev.id,
            event_title: ev.title,
            venue_id: vn ? vn.id : 1,
            venue_name: vn ? vn.name : 'Теплоход',
            pier_address: vn ? vn.pier_address : 'Причал Наб. Макарова, 34',
            start_time: `${dateStr} ${t}`,
            min_price: Number(massGenForm.min_price)
          });
        }
      }
      curr.setDate(curr.getDate() + 1);
    }

    saveSessions([...sessions, ...newSessions]);
    setMassGenModalOpen(false);
    showNotification(`Сгенерировано ${newSessions.length} рейсов на сезон!`);
  };

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {/* LEFT SIDEBAR: 3 Sections */}
      <div className="glass" style={{ flex: '1 1 280px', padding: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.5px' }}>
            Фильтр по сайту:
          </label>
          <select 
            className="form-input" 
            value={selectedSiteFilter} 
            onChange={e => setSelectedSiteFilter(e.target.value)}
            style={{ width: '100%', marginTop: '6px', fontWeight: '600' }}
          >
            <option value="all">🌐 Все сайты проекта</option>
            <option value="2">🎸 rockhitneva.ru</option>
            <option value="1">🎵 aquasound.club</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Menu Item 1: Программы */}
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
              <span style={{ fontWeight: currentSection === 'events' ? 'bold' : '600', color: currentSection === 'events' ? '#1d4ed8' : '#334155' }}>
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
              {filteredEvents.length}
            </span>
          </div>

          {/* Menu Item 2: Расписание & Рейсы */}
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
              <span style={{ fontWeight: currentSection === 'sessions' ? 'bold' : '600', color: currentSection === 'sessions' ? '#1d4ed8' : '#334155' }}>
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
              {filteredSessions.length}
            </span>
          </div>

          {/* Menu Item 3: Площадки & Суда */}
          <div
            onClick={() => setCurrentSection('venues')}
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
              <Anchor size={18} color={currentSection === 'venues' ? '#2563eb' : '#64748b'} />
              <span style={{ fontWeight: currentSection === 'venues' ? 'bold' : '600', color: currentSection === 'venues' ? '#1d4ed8' : '#334155' }}>
                📌 Площадки & Суда
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
              {filteredVenues.length}
            </span>
          </div>
        </div>

        {/* Quick Action Button on left */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <button
            onClick={handleOpenMassGen}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 14px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(37,99,235,0.25)'
            }}
          >
            <Sparkles size={16} /> 🚀 Генератор на сезон
          </button>
        </div>
      </div>

      {/* RIGHT WORKSPACE: List & Management */}
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

        {/* SECTION 1: ПРОГРАММЫ (EVENTS) */}
        {currentSection === 'events' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Music size={22} color="var(--color-primary)" />
                  Репертуар программ ({filteredEvents.length})
                </h3>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                  Создание и редактирование концертных программ, длительности, цен и Ticketland-кода
                </div>
              </div>
              <button
                onClick={handleOpenCreateEvent}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '8px', fontWeight: 'bold' }}
              >
                <Plus size={16} /> Создать программу
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredEvents.map(ev => (
                <div
                  key={ev.id}
                  style={{
                    padding: '16px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ flex: '1 1 320px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#0f172a' }}>{ev.title}</span>
                      {ev.is_featured && (
                        <span style={{ fontSize: '10px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                          🔥 ХИТ СЕЗОНА
                        </span>
                      )}
                      <span style={{ fontSize: '11px', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>
                        {ev.domain_name}
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
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => handleOpenEditEvent(ev)}
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

              {filteredEvents.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', background: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                  Мероприятия не найдены. Нажмите «Создать программу» выше!
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION 2: РАСПИСАНИЕ & РЕЙСЫ (SESSIONS) */}
        {currentSection === 'sessions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={22} color="var(--color-primary)" />
                  Расписание рейсов ({filteredSessions.length})
                </h3>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                  Все рейсы на сезон по дням недели и времени отправления
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
                  <Sparkles size={16} /> 🚀 Генератор на сезон
                </button>
                <button
                  onClick={() => {
                    const firstEv = filteredEvents[0] || events[0];
                    const firstVn = filteredVenues[0] || venues[0];
                    setSessionForm({
                      event_id: firstEv ? firstEv.id : '',
                      venue_id: firstVn ? firstVn.id : '',
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
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredSessions.slice(0, 50).map(s => (
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
                    <strong style={{ color: '#059669', fontSize: '14px' }}>{s.min_price || 1500} ₽</strong>
                    <button
                      onClick={() => {
                        saveSessions(sessions.filter(item => item.id !== s.id));
                        showNotification('Рейс удален');
                      }}
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

              {filteredSessions.length > 50 && (
                <div style={{ textAlign: 'center', padding: '12px', color: '#64748b', fontSize: '12px' }}>
                  Показано первые 50 из {filteredSessions.length} рейсов.
                </div>
              )}

              {filteredSessions.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', background: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                  Расписание пусто. Нажмите <strong>«🚀 Генератор на сезон»</strong> для автозаполнения с мая по сентябрь!
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION 3: ПЛОЩАДКИ & СУДА (VENUES) */}
        {currentSection === 'venues' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Anchor size={22} color="var(--color-primary)" />
                  Площадки, теплоходы и причалы ({filteredVenues.length})
                </h3>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                  Адрес причала отправления, вместимость судов и описание
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingVenueId(null);
                  setVenueForm({
                    name: '',
                    domain_id: selectedSiteFilter === 'all' ? 2 : Number(selectedSiteFilter),
                    pier_address: 'Санкт-Петербург, Причал Набережная Макарова, 34',
                    capacity: 120,
                    description: ''
                  });
                  setVenueModalOpen(true);
                }}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '8px', fontWeight: 'bold' }}
              >
                <Plus size={16} /> Добавить судно
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredVenues.map(vn => (
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: 'bold' }}>
                          {vn.name}
                        </h4>
                        <span style={{ fontSize: '11px', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>
                          {vn.domain_name}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#2563eb', margin: '6px 0 4px 0' }}>
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
                        onClick={() => {
                          setEditingVenueId(vn.id);
                          setVenueForm({
                            name: vn.name,
                            domain_id: vn.domain_id || 2,
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
                        <Edit3 size={14} color="#2563eb" /> Редактировать
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: '600' }}>Название программы *</label>
                  <input type="text" className="form-input" value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} required placeholder="Например: Рок под разводными мостами" style={{ width: '100%', marginTop: '4px' }} />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: '600' }}>Сайт проекта</label>
                  <select className="form-input" value={eventForm.domain_id} onChange={e => setEventForm({ ...eventForm, domain_id: Number(e.target.value) })} style={{ width: '100%', marginTop: '4px' }}>
                    <option value={2}>rockhitneva.ru</option>
                    <option value={1}>aquasound.club</option>
                  </select>
                </div>
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
                <Sparkles size={18} /> Генератор расписания на сезон
              </h4>
              <button onClick={() => setMassGenModalOpen(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', padding: '6px', color: 'white', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleRunMassGenerator} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: '600' }}>Программа *</label>
                  <select className="form-input" value={massGenForm.event_id} onChange={e => setMassGenForm({ ...massGenForm, event_id: e.target.value })} required style={{ width: '100%', marginTop: '4px' }}>
                    {events.map(ev => (
                      <option key={ev.id} value={ev.id}>{ev.title} ({ev.domain_name})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: '600' }}>Площадка / Теплоход *</label>
                  <select className="form-input" value={massGenForm.venue_id} onChange={e => setMassGenForm({ ...massGenForm, venue_id: e.target.value })} required style={{ width: '100%', marginTop: '4px' }}>
                    {venues.map(vn => (
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
                domain_id: ev.domain_id,
                domain_name: ev.domain_name,
                event_id: ev.id,
                event_title: ev.title,
                venue_id: vn ? vn.id : 1,
                venue_name: vn ? vn.name : 'Теплоход',
                pier_address: vn ? vn.pier_address : 'Причал Наб. Макарова, 34',
                start_time: sessionForm.start_time,
                min_price: Number(sessionForm.min_price)
              };
              saveSessions([...sessions, newS]);
              setSessionModalOpen(false);
              showNotification('Рейс добавлен в расписание');
            }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="form-label">Программа</label>
                <select className="form-input" value={sessionForm.event_id} onChange={e => setSessionForm({ ...sessionForm, event_id: e.target.value })} style={{ width: '100%' }}>
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.title} ({ev.domain_name})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Площадка</label>
                <select className="form-input" value={sessionForm.venue_id} onChange={e => setSessionForm({ ...sessionForm, venue_id: e.target.value })} style={{ width: '100%' }}>
                  {venues.map(vn => (
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
            <h4 style={{ margin: '0 0 16px 0', fontSize: '17px' }}>{editingVenueId ? 'Редактирование судна' : 'Новое судно / площадка'}</h4>
            <form onSubmit={e => {
              e.preventDefault();
              const domName = Number(venueForm.domain_id) === 1 ? 'aquasound.club' : 'rockhitneva.ru';
              if (editingVenueId) {
                const updated = venues.map(v => v.id === editingVenueId ? {
                  ...v,
                  name: venueForm.name,
                  domain_id: Number(venueForm.domain_id),
                  domain_name: domName,
                  pier_address: venueForm.pier_address,
                  capacity: Number(venueForm.capacity),
                  description: venueForm.description
                } : v);
                saveVenues(updated);
                showNotification('Площадка сохранена');
              } else {
                const newVn = {
                  id: Date.now(),
                  name: venueForm.name,
                  domain_id: Number(venueForm.domain_id),
                  domain_name: domName,
                  pier_address: venueForm.pier_address,
                  capacity: Number(venueForm.capacity),
                  description: venueForm.description
                };
                saveVenues([...venues, newVn]);
                showNotification('Судно добавлено');
              }
              setVenueModalOpen(false);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="form-label" style={{ fontWeight: '600' }}>Название судна *</label>
                <input type="text" className="form-input" value={venueForm.name} onChange={e => setVenueForm({ ...venueForm, name: e.target.value })} required placeholder="Теплоход «Рок Хит Нева»" style={{ width: '100%' }} />
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: '600' }}>Сайт проекта</label>
                <select className="form-input" value={venueForm.domain_id} onChange={e => setVenueForm({ ...venueForm, domain_id: Number(e.target.value) })} style={{ width: '100%' }}>
                  <option value={2}>rockhitneva.ru</option>
                  <option value={1}>aquasound.club</option>
                </select>
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: '600' }}>Адрес причала (для билетов) *</label>
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
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', borderRadius: '8px' }}>Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
