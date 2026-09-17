import React, { useState, useEffect } from 'react';
import { DollarSign, Shield, Users, Ticket, ArrowLeft, Percent, Compass, Plus, Star } from 'lucide-react';
import { getEvents, getBookings, createBooking } from '../db';
import HallRenderer from './HallRenderer';

export default function SellerPanel({ onBack }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [currentHall, setCurrentHall] = useState(null);
  const [activeTab, setActiveTab] = useState('sell'); // 'sell', 'history'

  const mockHalls = {
    'f2c1d6e2-1b2a-4c3c-9f7e-1234567890ab': {
      id: 'f2c1d6e2-1b2a-4c3c-9f7e-1234567890ab',
      name: 'Концертный зал',
      type: 'grid',
      rows: 6,
      seats_per_row: 10
    }
  };

  const loadData = async () => {
    const fetchedEvents = await getEvents();
    const fetchedBookings = await getBookings();
    setEvents(fetchedEvents);
    setBookings(fetchedBookings);
    if (fetchedEvents.length > 0 && !selectedEvent) {
      handleSelectEvent(fetchedEvents[0], fetchedBookings);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectEvent = (event, currentBookings = bookings) => {
    setSelectedEvent(event);
    setSelectedSeat(null);
    
    // Load hall definition
    const hall = mockHalls[event.hall_id] || {
      id: event.hall_id,
      name: 'Зал по умолчанию',
      type: 'grid',
      rows: 8,
      seats_per_row: 12
    };
    setCurrentHall(hall);

    // Calculate occupied seats for this event
    const occupied = currentBookings
      .filter(b => b.event_id === event.id)
      .map(b => b.seat_number);
    setOccupiedSeats(occupied);
  };

  const handleSellTicket = async (e) => {
    e.preventDefault();
    if (!selectedEvent || !selectedSeat) {
      alert('Пожалуйста, выберите место на схеме!');
      return;
    }

    const price = selectedSeat.type === 'vip' ? selectedEvent.price_vip : selectedEvent.price_standard;

    try {
      await createBooking({
        event_id: selectedEvent.id,
        seat_number: selectedSeat.id,
        seat_category: selectedSeat.type,
        customer_name: customerName || 'Быстрая продажа (Касса)',
        customer_phone: customerPhone || 'Нет данных',
        customer_email: customerEmail || 'cashier@tickets.ru',
        price_paid: price,
        status: 'confirmed'
      });

      // Clear Form & Reload
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
      setSelectedSeat(null);
      
      await loadData();
      alert('Билет успешно продан и распечатан!');
    } catch (err) {
      alert('Ошибка при продаже билета: ' + err.message);
    }
  };

  // Filter cashier sales
  const cashierBookings = bookings.filter(b => b.customer_email === 'cashier@tickets.ru' || b.customer_name.includes('Касса'));

  return (
    <div>
      <div className="glass" style={{ padding: '24px', marginBottom: '32px' }}>
        <h1 className="hero-title" style={{ fontSize: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Ticket size={32} color="var(--color-primary)" /> Кабинет Кассира / Продавца (Причал)
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Быстрая продажа билетов офлайн на причале. Прямой выбор мест на схеме и моментальная регистрация посадочного талона.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button 
          className={`btn ${activeTab === 'sell' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('sell')}
        >
          <Plus size={16} /> Продажа билетов
        </button>
        <button 
          className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('history')}
        >
          <Users size={16} /> История продаж кассы
        </button>
      </div>

      {activeTab === 'sell' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px', alignItems: 'start' }}>
          {/* Left Column: Hall & Selection */}
          <div className="glass" style={{ padding: '24px' }}>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Выберите рейс для продажи</label>
              <select 
                className="form-input"
                value={selectedEvent?.id || ''}
                onChange={(e) => {
                  const ev = events.find(item => item.id === e.target.value);
                  if (ev) handleSelectEvent(ev);
                }}
              >
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name} — {ev.date} в {ev.time.slice(0, 5)}
                  </option>
                ))}
              </select>
            </div>

            {selectedEvent && currentHall && (
              <div>
                <h3 style={{ marginBottom: '16px', fontFamily: 'var(--font-title)' }}>
                  Схема мест: {currentHall.name}
                </h3>
                
                <div style={{ margin: '20px 0', display: 'flex', gap: '20px', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></div>
                    <span style={{ fontSize: '13px' }}>Стандарт ({selectedEvent.price_standard} ₽)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--color-warning)' }}></div>
                    <span style={{ fontSize: '13px' }}>VIP ({selectedEvent.price_vip} ₽)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--color-muted)' }}></div>
                    <span style={{ fontSize: '13px' }}>Занято</span>
                  </div>
                </div>

                <div style={{ overflowX: 'auto', padding: '10px' }}>
                  <HallRenderer
                    hall={currentHall}
                    event={selectedEvent}
                    selectedSeat={selectedSeat}
                    setSelectedSeat={setSelectedSeat}
                    occupiedSeats={occupiedSeats}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Fast Checkout Form */}
          <div className="glass" style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', marginBottom: '20px' }}>Оформление билета</h3>
            
            {selectedSeat ? (
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Выбранное место:</span>
                  <strong style={{ color: 'var(--color-success)' }}>{selectedSeat.id}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Категория:</span>
                  <strong>{selectedSeat.type === 'vip' ? 'VIP палуба' : 'Главная палуба'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>К оплате:</span>
                  <strong style={{ fontSize: '18px', color: 'var(--color-success)' }}>
                    {selectedSeat.type === 'vip' ? selectedEvent.price_vip : selectedEvent.price_standard} ₽
                  </strong>
                </div>
              </div>
            ) : (
              <div style={{ border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '8px', padding: '30px', textAlign: 'center', marginBottom: '20px', color: 'var(--text-secondary)' }}>
                Выберите место на схеме слева для оформления билета
              </div>
            )}

            <form onSubmit={handleSellTicket}>
              <div className="form-group">
                <label className="form-label">Имя пассажира (необязательно)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Иван Иванов" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Телефон для СМС (необязательно)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="+7 (999) 000-00-00" 
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '12px' }}
                disabled={!selectedSeat}
              >
                Печать посадочного талона
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="glass" style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-title)', marginBottom: '16px' }}>Билеты, проданные через кассу причала</h2>
          {cashierBookings.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
              Сегодня продаж через кассу пока не зарегистрировано.
            </p>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID билета</th>
                    <th>Рейс</th>
                    <th>Место</th>
                    <th>Сумма</th>
                    <th>Время продажи</th>
                  </tr>
                </thead>
                <tbody>
                  {cashierBookings.map(b => (
                    <tr key={b.id}>
                      <td><span style={{ fontSize: '11px', fontFamily: 'monospace' }}>{b.id.slice(0, 8)}...</span></td>
                      <td>{events.find(e => e.id === b.event_id)?.name || 'Текущий рейс'}</td>
                      <td><strong>{b.seat_number}</strong> ({b.seat_category === 'vip' ? 'VIP' : 'Стандарт'})</td>
                      <td>{b.price_paid} ₽</td>
                      <td>{new Date(b.created_at).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
