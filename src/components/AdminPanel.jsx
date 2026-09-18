import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Shield, Calendar, Users, DollarSign, Activity } from 'lucide-react';
import { getEvents, getShips, createEvent, getBookings, getHalls } from '../db';
import AdminDashboard from './AdminDashboard';

export default function AdminPanel() {
  const [events, setEvents] = useState([]);
  const [ships, setShips] = useState([]);
  const [halls, setHalls] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:00');
  const [priceStandard, setPriceStandard] = useState(1500);
  const [priceVip, setPriceVip] = useState(2500);
  const [shipId, setShipId] = useState('');
  const [hallId, setHallId] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const loadData = async () => {
    const fetchedEvents = await getEvents();
    const fetchedShips = await getShips();
    const fetchedHalls = await getHalls();
    const fetchedBookings = await getBookings();
    setEvents(fetchedEvents);
    setShips(fetchedShips);
    setHalls(fetchedHalls);
    setBookings(fetchedBookings);
    if (fetchedShips.length > 0) setShipId(fetchedShips[0].id);
    if (fetchedHalls.length > 0) setHallId(fetchedHalls[0].id);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!shipId) return;

    try {
      await createEvent({
        ship_id: shipId,
        hall_id: hallId || (halls[0]?.id),
        name,
        description,
        date,
        time: `${time}:00`,
        price_standard: Number(priceStandard),
        price_vip: Number(priceVip),
        status: 'active'
      });
      
      // Reset form
      setName('');
      setDescription('');
      setDate('');
      
      await loadData();
      alert('Рейс успешно добавлен!');
    } catch (err) {
      alert('Ошибка добавления рейса: ' + err.message);
    }
  };

  const getShipName = (id) => {
    const ship = ships.find(s => s.id === id);
    return ship ? ship.name : 'Теплоход';
  };

  // Stats
  const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.price_paid), 0);
  const totalTickets = bookings.length;

  return (
    <div>
      <div className="glass" style={{ padding: '24px', marginBottom: '32px' }}>
        <h1 className="hero-title" style={{ fontSize: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Shield size={32} color="var(--color-primary)" /> Панель Администратора (Стиклер)
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Управление расписанием рейсов теплоходов и мониторинг продаж билетов в реальном времени.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button 
          className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <Activity size={16} /> Дашборд
        </button>
        <button 
          className={`btn ${activeTab === 'events' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('events')}
        >
          <Calendar size={16} /> Рейсы
        </button>
        <button 
          className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('bookings')}
        >
          <Users size={16} /> Проданные билеты
        </button>
        <button 
          className={`btn ${activeTab === 'new-event' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('new-event')}
        >
          <Plus size={16} /> Добавить рейс
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass" style={{ padding: '20px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Выручка (всего)</span>
          <div style={{ fontSize: '28px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <DollarSign size={24} color="var(--color-success)" /> {totalRevenue} ₽
          </div>
        </div>
        <div className="glass" style={{ padding: '20px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Билетов продано</span>
          <div style={{ fontSize: '28px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <Users size={24} color="var(--color-accent)" /> {totalTickets} шт.
          </div>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'dashboard' && (
        <div className="glass">
          <AdminDashboard />
        </div>
      )}

      {activeTab === 'events' && (
        <div className="glass" style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-title)', marginBottom: '16px' }}>Расписание рейсов</h2>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Рейс</th>
                  <th>Теплоход</th>
                  <th>Дата</th>
                  <th>Время</th>
                  <th>Стандарт (₽)</th>
                  <th>VIP (₽)</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event.id}>
                    <td><strong>{event.name}</strong></td>
                    <td>{getShipName(event.ship_id)}</td>
                    <td>{event.date}</td>
                    <td>{event.time.slice(0, 5)}</td>
                    <td>{event.price_standard}</td>
                    <td>{event.price_vip}</td>
                    <td>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '12px', 
                        background: event.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: event.status === 'active' ? 'var(--color-success)' : 'var(--color-danger)'
                      }}>
                        {event.status === 'active' ? 'Активен' : 'Неактивен'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="glass" style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-title)', marginBottom: '16px' }}>Список проданных билетов</h2>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Пассажир</th>
                  <th>Телефон</th>
                  <th>Рейс</th>
                  <th>Место</th>
                  <th>Палуба</th>
                  <th>Оплачено</th>
                  <th>Дата покупки</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id}>
                    <td>
                      <div><strong>{booking.customer_name}</strong></div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{booking.customer_email}</div>
                    </td>
                    <td>{booking.customer_phone}</td>
                    <td>{booking.events?.name || 'Загрузка...'}</td>
                    <td>{booking.seat_number}</td>
                    <td>
                      <span style={{ 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        fontSize: '11px', 
                        background: booking.seat_category === 'vip' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                        color: booking.seat_category === 'vip' ? 'var(--color-vip)' : '#a5b4fc'
                      }}>
                        {booking.seat_category === 'vip' ? 'VIP' : 'Стандарт'}
                      </span>
                    </td>
                    <td>{booking.price_paid} ₽</td>
                    <td>{new Date(booking.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'new-event' && (
        <div className="glass" style={{ padding: '24px', maxWidth: '600px' }}>
          <h2 style={{ fontFamily: 'var(--font-title)', marginBottom: '20px' }}>Создать новый рейс</h2>
          <form onSubmit={handleCreateEvent}>
            <div className="form-group">
              <label className="form-label">Название рейса</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Например, Вечерний круиз под разводными мостами" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Описание</label>
              <textarea 
                className="form-input" 
                rows="3"
                placeholder="Подробное описание программы круиза..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Теплоход</label>
                <select 
                  className="form-input"
                  value={shipId}
                  onChange={(e) => setShipId(e.target.value)}
                  required
                >
                  {ships.map(ship => (
                    <option key={ship.id} value={ship.id}>{ship.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Схема зала / палубы</label>
                <select 
                  className="form-input"
                  value={hallId}
                  onChange={(e) => setHallId(e.target.value)}
                  required
                >
                  {halls.map(hall => (
                    <option key={hall.id} value={hall.id}>{hall.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Дата рейса</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Время отправления</label>
                <input 
                  type="time" 
                  className="form-input" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Цена Стандарт (₽)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={priceStandard}
                  onChange={(e) => setPriceStandard(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Цена VIP (₽)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={priceVip}
                  onChange={(e) => setPriceVip(e.target.value)}
                  required 
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
              Создать рейс и запустить продажи
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
