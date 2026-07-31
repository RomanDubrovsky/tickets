import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Anchor, MapPin, Tag } from 'lucide-react';
import { getEvents, getShips } from '../db';

export default function Afisha({ onSelectEvent }) {
  const [events, setEvents] = useState([]);
  const [ships, setShips] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShip, setSelectedShip] = useState('');

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
    return ship ? ship.name : 'Теплоход';
  };

  const filteredEvents = events.filter(event => {
    const matchesDate = selectedDate ? event.date === selectedDate : true;
    const matchesShip = selectedShip ? event.ship_id === selectedShip : true;
    return matchesDate && matchesShip;
  });

  return (
    <div>
      {/* Hero Banner */}
      <div className="hero glass">
        <h1 className="hero-title">Теплоходные прогулки по Неве</h1>
        <p className="hero-subtitle">
          Бронируйте билеты на лучшие музыкальные круизы, экскурсии и гастрономические путешествия в Санкт-Петербурге.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => {
            const today = new Date().toISOString().split('T')[0];
            setSelectedDate(today);
          }}>На сегодня</button>
          <button className="btn btn-secondary" onClick={() => {
            setSelectedDate('');
            setSelectedShip('');
          }}>Показать все</button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass" style={{ padding: '20px', marginBottom: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <h3 style={{ fontFamily: 'var(--font-title)', marginRight: '16px' }}>Фильтр рейсов</h3>
        <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '200px' }}>
          <label className="form-label">Дата прогулки</label>
          <input 
            type="date" 
            className="form-input" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)} 
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '200px' }}>
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
      </div>

      {/* Events Listing */}
      <h2 style={{ fontFamily: 'var(--font-title)', marginBottom: '20px' }}>Доступные рейсы ({filteredEvents.length})</h2>
      {filteredEvents.length === 0 ? (
        <div className="glass" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p>Рейсов на выбранные параметры не найдено. Попробуйте сбросить фильтры.</p>
        </div>
      ) : (
        <div className="grid-cards">
          {filteredEvents.map(event => {
            const ship = ships.find(s => s.id === event.ship_id);
            return (
              <div key={event.id} className="cruise-card glass">
                <div className="card-img-container">
                  <img 
                    src={ship?.image_url || 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80'} 
                    alt={event.name} 
                    className="card-img"
                  />
                  <div className="card-badge">от {event.price_standard} ₽</div>
                </div>
                <div className="card-body">
                  <h3 className="card-title">{event.name}</h3>
                  <p className="card-desc">{event.description}</p>
                  
                  <div className="card-meta">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} /> {event.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> {event.time.slice(0, 5)}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Anchor size={14} /> {getShipName(event.ship_id)}
                    </span>
                  </div>
                  
                  <button 
                    className="btn btn-primary" 
                    style={{ marginTop: '10px', width: '100%' }}
                    onClick={() => onSelectEvent(event)}
                  >
                    Купить билет
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
