import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Anchor, MapPin, Sparkles, Flame, Info, ChevronRight, X, Music, Check, Compass, Shield } from 'lucide-react';
import { getEvents, getShips } from '../db';

export default function Afisha({ onSelectEvent }) {
  const [events, setEvents] = useState([]);
  const [ships, setShips] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all'); // 'all', 'season_hits', 'bridges'
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShip, setSelectedShip] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSlots, setExpandedSlots] = useState({});
  const [infoModalEvent, setInfoModalEvent] = useState(null);

  useEffect(() => {
    async function loadData() {
      const fetchedEvents = await getEvents();
      const fetchedShips = await getShips();
      setEvents(fetchedEvents.filter(e => e.status === 'active'));
      setShips(fetchedShips);
    }
    loadData();
  }, []);

  const getShipName = (shipId) => {
    const ship = ships.find(s => s.id === shipId);
    return ship ? ship.name : 'Теплоход «Рок Хит Нева»';
  };

  const toggleExpandSlots = (eventId, e) => {
    if (e) e.stopPropagation();
    setExpandedSlots(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  const handleSlotClick = (event, slot, e) => {
    if (e) e.stopPropagation();
    onSelectEvent({
      ...event,
      date: slot.date,
      time: (slot.time.length === 5 ? slot.time + ':00' : slot.time),
      slotLabel: slot.dayStr,
      selectedSlotPrice: slot.price
    });
  };

  const handleBuyClick = (event, e) => {
    if (e) e.stopPropagation();
    const firstSlot = event.slots && event.slots.length > 0 ? event.slots[0] : null;
    onSelectEvent({
      ...event,
      date: firstSlot ? firstSlot.date : event.date,
      time: firstSlot ? (firstSlot.time.length === 5 ? firstSlot.time + ':00' : firstSlot.time) : event.time,
      slotLabel: firstSlot ? firstSlot.dayStr : event.date
    });
  };

  const filteredEvents = events.filter(event => {
    // Category match
    if (activeCategory === 'season_hits') {
      const isSeason = event.categories?.includes('season_hits') || event.is_hit;
      if (!isSeason) return false;
    } else if (activeCategory === 'bridges') {
      const isBridges = event.categories?.includes('bridges') || event.name.toLowerCase().includes('мост') || event.description?.toLowerCase().includes('мост');
      if (!isBridges) return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = event.name.toLowerCase().includes(q) || (event.full_title && event.full_title.toLowerCase().includes(q));
      const matchDesc = event.description && event.description.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    // Date match
    if (selectedDate) {
      const matchesMainDate = event.date === selectedDate;
      const matchesSlots = event.slots && event.slots.some(s => s.date === selectedDate);
      if (!matchesMainDate && !matchesSlots) return false;
    }

    // Ship match
    if (selectedShip && event.ship_id !== selectedShip) {
      return false;
    }

    return true;
  });

  return (
    <div className="afisha-page">
      {/* Concert Poster Hero Banner */}
      <div className="concert-hero glass">
        <div className="hero-decor-badge">
          <Sparkles size={16} /> Навигация 2026 в Санкт-Петербурге
        </div>
        <h1 className="hero-main-title">Афиша и билеты на концерты</h1>
        <p className="hero-main-subtitle">
          Музыкальные прогулки по Неве и Финскому заливу под разводными мостами
        </p>

        {/* Category Tabs */}
        <div className="afisha-tabs">
          <button 
            className={`afisha-tab-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            Все программы
          </button>
          <button 
            className={`afisha-tab-btn ${activeCategory === 'season_hits' ? 'active' : ''}`}
            onClick={() => setActiveCategory('season_hits')}
          >
            <Flame size={16} color="#e55f2e" style={{ marginRight: '6px' }} />
            Хиты сезона
          </button>
          <button 
            className={`afisha-tab-btn ${activeCategory === 'bridges' ? 'active' : ''}`}
            onClick={() => setActiveCategory('bridges')}
          >
            <Compass size={16} color="#2563eb" style={{ marginRight: '6px' }} />
            Разводные мосты
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="glass afisha-filter-bar">
        <div className="filter-item search-box">
          <label className="form-label">Поиск концерта</label>
          <input 
            type="text"
            className="form-input"
            placeholder="Например: Громыка, Цой, RHCP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-item date-box">
          <label className="form-label">Дата прогулки</label>
          <input 
            type="date" 
            className="form-input" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)} 
          />
        </div>

        <div className="filter-item ship-box">
          <label className="form-label">Выбор теплохода</label>
          <select 
            className="form-input"
            value={selectedShip}
            onChange={(e) => setSelectedShip(e.target.value)}
          >
            <option value="">Все теплоходы</option>
            {ships.map(ship => (
              <option key={ship.id} value={ship.id}>{ship.name}</option>
            ))}
          </select>
        </div>

        {(searchQuery || selectedDate || selectedShip || activeCategory !== 'all') && (
          <div className="filter-reset-container">
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedDate('');
                setSelectedShip('');
                setActiveCategory('all');
              }}
            >
              Сбросить
            </button>
          </div>
        )}
      </div>

      {/* Events Listing */}
      <div className="afisha-header-row">
        <h2>Доступные концерты и круизы ({filteredEvents.length})</h2>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="glass" style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Music size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <h3>Программ с выбранными параметрами не найдено</h3>
          <p style={{ marginTop: '8px' }}>Попробуйте выбрать другую дату или категорию.</p>
          <button 
            className="btn btn-primary" 
            style={{ marginTop: '16px' }}
            onClick={() => {
              setSearchQuery('');
              setSelectedDate('');
              setSelectedShip('');
              setActiveCategory('all');
            }}
          >
            Показать всю афишу
          </button>
        </div>
      ) : (
        <div className="afisha-cards-grid">
          {filteredEvents.map(event => {
            const isExpanded = !!expandedSlots[event.id];
            const slots = event.slots || [
              { id: 'default', date: event.date, dayStr: event.date, time: event.time?.slice(0, 5) || '19:00', price: event.price_standard }
            ];
            const visibleSlots = isExpanded ? slots : slots.slice(0, 4);
            const extraCount = slots.length - 4;

            return (
              <div key={event.id} className="concert-card glass">
                {/* Tags Row */}
                <div className="card-tags-row">
                  <span className="badge-tag badge-hit">
                    <Flame size={13} style={{ marginRight: '3px' }} /> Хит
                  </span>
                  <span className="badge-tag badge-age">
                    18+
                  </span>
                  <span className="badge-tag badge-time">
                    ⏱ {event.duration || '120 мин'}
                  </span>
                </div>

                {/* Event Title */}
                <h3 
                  className="concert-card-title"
                  onClick={() => setInfoModalEvent(event)}
                  title="Нажмите для подробной информации"
                >
                  {event.name}
                </h3>

                {/* Location / Pier */}
                <div className="concert-card-pier">
                  <MapPin size={15} color="#e55f2e" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{event.location || 'Санкт-Петербург, ст. м. Спортивная, причал Набережная Макарова, 34'}</span>
                </div>

                {/* Description */}
                <p className="concert-card-desc">
                  {event.description || 'Музыкальная прогулка по Неве с видом на разводные мосты и живым концертом'}
                </p>

                {/* Nearest Sailings (Ближайшие рейсы) */}
                <div className="concert-slots-section">
                  <div className="slots-heading">Ближайшие рейсы:</div>
                  <div className="slots-wrap">
                    {visibleSlots.map(slot => (
                      <button
                        key={slot.id}
                        className="slot-pill-btn"
                        onClick={(e) => handleSlotClick(event, slot, e)}
                        title={`Купить билет на ${slot.dayStr} ${slot.time}`}
                      >
                        <span className="slot-cal-icon">🗓</span>
                        <span className="slot-day">{slot.dayStr}</span>
                        <span className="slot-time">{slot.time}</span>
                        <span className="slot-price">{slot.price} ₽</span>
                      </button>
                    ))}

                    {extraCount > 0 && !isExpanded && (
                      <button 
                        className="slot-pill-more"
                        onClick={(e) => toggleExpandSlots(event.id, e)}
                      >
                        + еще {extraCount}
                      </button>
                    )}

                    {isExpanded && extraCount > 0 && (
                      <button 
                        className="slot-pill-more"
                        onClick={(e) => toggleExpandSlots(event.id, e)}
                      >
                        Свернуть
                      </button>
                    )}
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="concert-card-actions">
                  <button 
                    className="btn btn-primary buy-btn"
                    onClick={(e) => handleBuyClick(event, e)}
                  >
                    Купить от {event.price_standard} ₽
                  </button>
                  <button 
                    className="btn btn-secondary info-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInfoModalEvent(event);
                    }}
                  >
                    <Info size={16} /> Инфо
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Modal */}
      {infoModalEvent && (
        <div className="modal-backdrop" onClick={() => setInfoModalEvent(null)}>
          <div className="modal-window glass" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="card-tags-row" style={{ marginBottom: '8px' }}>
                  <span className="badge-tag badge-hit"><Flame size={13} /> Хит</span>
                  <span className="badge-tag badge-age">18+</span>
                  <span className="badge-tag badge-time">⏱ {infoModalEvent.duration || '120 мин'}</span>
                </div>
                <h2 style={{ fontSize: '22px', fontFamily: 'var(--font-title)' }}>
                  {infoModalEvent.full_title || infoModalEvent.name}
                </h2>
              </div>
              <button 
                className="modal-close-btn" 
                onClick={() => setInfoModalEvent(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="info-block">
                <div className="info-row">
                  <MapPin size={18} color="#e55f2e" />
                  <div>
                    <strong>Причал отправления:</strong>
                    <p>{infoModalEvent.location || 'Санкт-Петербург, ст. м. Спортивная, причал Набережная Макарова, 34'}</p>
                  </div>
                </div>

                <div className="info-row">
                  <Anchor size={18} color="#2563eb" />
                  <div>
                    <strong>Теплоход:</strong>
                    <p>{getShipName(infoModalEvent.ship_id)} (Две палубы, бар, ресторан, панорамный салон)</p>
                  </div>
                </div>

                <div className="info-row">
                  <Compass size={18} color="#16a34a" />
                  <div>
                    <strong>Маршрут:</strong>
                    <p>Акватория Невы, Эрмитаж, Стрелка Васильевского острова, Петропавловская крепость, разводные мосты (Дворцовый, Троицкий, Литейный), Финский залив.</p>
                  </div>
                </div>
              </div>

              <div className="info-desc-box">
                <h4 style={{ marginBottom: '8px', color: '#0f172a' }}>О программе:</h4>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                  {infoModalEvent.full_info || infoModalEvent.description}
                </p>
              </div>

              <div className="info-slots-box">
                <h4 style={{ marginBottom: '12px', color: '#0f172a' }}>Доступные даты и рейсы:</h4>
                <div className="slots-wrap">
                  {(infoModalEvent.slots || []).map(slot => (
                    <button
                      key={slot.id}
                      className="slot-pill-btn"
                      onClick={() => {
                        const ev = infoModalEvent;
                        setInfoModalEvent(null);
                        handleSlotClick(ev, slot);
                      }}
                    >
                      <span className="slot-cal-icon">🗓</span>
                      <span className="slot-day">{slot.dayStr}</span>
                      <span className="slot-time">{slot.time}</span>
                      <span className="slot-price">{slot.price} ₽</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setInfoModalEvent(null)}
              >
                Закрыть
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  const ev = infoModalEvent;
                  setInfoModalEvent(null);
                  handleBuyClick(ev);
                }}
              >
                Перейти к выбору мест от {infoModalEvent.price_standard} ₽
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
