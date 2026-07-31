import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Anchor, CreditCard, ChevronLeft, CheckCircle, Percent } from 'lucide-react';
import { createBooking, verifyPromoCode, getBookings } from '../db';

export default function BookingDetails({ event, onBack }) {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedAgent, setAppliedAgent] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [occupiedSeats, setOccupiedSeats] = useState([]);

  // Check for referral code in URL on load (e.g. ?promo=ALEXROCK)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const promo = params.get('promo');
    if (promo) {
      setPromoCode(promo);
      handleApplyPromo(promo);
    }
  }, []);

  // Fetch occupied seats for this event
  useEffect(() => {
    async function loadBookings() {
      const allBookings = await getBookings();
      const filtered = allBookings
        .filter(b => b.event_id === event.id && b.status !== 'cancelled')
        .map(b => b.seat_number);
      setOccupiedSeats(filtered);
    }
    loadBookings();
  }, [event.id]);

  const handleApplyPromo = async (codeToVerify) => {
    const code = codeToVerify || promoCode;
    if (!code) return;
    setPromoError('');
    setPromoSuccess('');
    
    try {
      const agent = await verifyPromoCode(code);
      if (agent) {
        setAppliedAgent(agent);
        setPromoSuccess(`Промокод применен! Скидка агента учтена.`);
      } else {
        setAppliedAgent(null);
        setPromoError('Неверный промокод.');
      }
    } catch (e) {
      setPromoError('Ошибка проверки промокода.');
    }
  };

  const getPrice = () => {
    if (!selectedSeat) return 0;
    const basePrice = selectedSeat.type === 'vip' ? event.price_vip : event.price_standard;
    if (appliedAgent) {
      // 10% discount off base price for using agent promo code
      return basePrice * 0.9;
    }
    return basePrice;
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!selectedSeat) return;
    setIsSubmitting(true);

    try {
      const bookingPayload = {
        event_id: event.id,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        seat_number: selectedSeat.id,
        seat_category: selectedSeat.type,
        price_paid: getPrice(),
        status: 'confirmed',
        agent_id: appliedAgent ? appliedAgent.id : null
      };

      await createBooking(bookingPayload);
      setIsBooked(true);
    } catch (err) {
      alert('Ошибка при бронировании: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate seat layout (30 standard, 10 VIP)
  const standardSeats = Array.from({ length: 30 }, (_, i) => `S${i + 1}`);
  const vipSeats = Array.from({ length: 10 }, (_, i) => `V${i + 1}`);

  if (isBooked) {
    return (
      <div className="glass" style={{ padding: '40px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
        <CheckCircle size={64} color="var(--color-success)" style={{ marginBottom: '20px' }} />
        <h2 style={{ fontFamily: 'var(--font-title)', marginBottom: '12px' }}>Билет успешно оформлен!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Инструкции и PDF-бланк билета со штрих-кодом отправлены на почту <strong>{customerEmail}</strong>.
        </p>
        <div className="glass" style={{ padding: '16px', marginBottom: '24px', textAlign: 'left', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ marginBottom: '8px' }}><strong>Рейс:</strong> {event.name}</div>
          <div style={{ marginBottom: '8px' }}><strong>Дата и время:</strong> {event.date} в {event.time.slice(0, 5)}</div>
          <div style={{ marginBottom: '8px' }}><strong>Место:</strong> {selectedSeat.id} ({selectedSeat.type === 'vip' ? 'VIP Палуба' : 'Главная палуба'})</div>
          <div><strong>Оплачено:</strong> {getPrice()} ₽</div>
        </div>
        <button className="btn btn-primary" onClick={onBack}>Вернуться к афише</button>
      </div>
    );
  }

  return (
    <div>
      <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: '20px' }}>
        <ChevronLeft size={16} /> Назад к афише
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
        {/* Left Column: Seat Selector */}
        <div className="glass" style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-title)', marginBottom: '8px' }}>Выбор места на теплоходе</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
            Нажмите на любое свободное место для выбора. Цены зависят от категории палубы.
          </p>

          <div className="seat-map-container glass">
            {/* VIP Deck */}
            <div className="ship-deck">
              <div className="deck-title">👑 VIP Палуба (с мягкими диванами) — {event.price_vip} ₽</div>
              <div className="seats-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                {vipSeats.map(id => {
                  const isOccupied = occupiedSeats.includes(id);
                  const isSelected = selectedSeat?.id === id;
                  return (
                    <div 
                      key={id}
                      className={`seat vip ${isSelected ? 'selected' : ''} ${isOccupied ? 'occupied' : ''}`}
                      onClick={() => !isOccupied && setSelectedSeat({ id, type: 'vip' })}
                    >
                      {id}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Standard Deck */}
            <div className="ship-deck">
              <div className="deck-title">🚢 Главная палуба — {event.price_standard} ₽</div>
              <div className="seats-grid">
                {standardSeats.map(id => {
                  const isOccupied = occupiedSeats.includes(id);
                  const isSelected = selectedSeat?.id === id;
                  return (
                    <div 
                      key={id}
                      className={`seat standard ${isSelected ? 'selected' : ''} ${isOccupied ? 'occupied' : ''}`}
                      onClick={() => !isOccupied && setSelectedSeat({ id, type: 'standard' })}
                    >
                      {id}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="legend">
              <div className="legend-item">
                <div className="legend-color standard"></div>
                <span>Стандарт</span>
              </div>
              <div className="legend-item">
                <div className="legend-color vip"></div>
                <span>VIP Палуба</span>
              </div>
              <div className="legend-item">
                <div className="legend-color success"></div>
                <span>Выбрано</span>
              </div>
              <div className="legend-item">
                <div className="legend-color occupied"></div>
                <span>Занято</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Cruise brief */}
          <div className="glass" style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', marginBottom: '16px' }}>Информация о рейсе</h3>
            <h2 style={{ fontSize: '22px', marginBottom: '16px' }}>{event.name}</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} /> <strong>Дата:</strong> {event.date}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} /> <strong>Время отправления:</strong> {event.time.slice(0, 5)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Anchor size={16} /> <strong>Маршрут:</strong> Центральная акватория Невы
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="glass" style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', marginBottom: '20px' }}>Оформление заказа</h3>
            
            <form onSubmit={handleSubmitBooking}>
              <div className="form-group">
                <label className="form-label">ФИО пассажира</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Иванов Иван Иванович" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email для отправки билета</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="ivan@example.com" 
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Телефон для связи</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  placeholder="+7 (999) 123-45-67" 
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required 
                />
              </div>

              {/* Promo code */}
              <div className="form-group">
                <label className="form-label">Промокод (агента)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Например, ALEXROCK" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => handleApplyPromo()}
                  >
                    Применить
                  </button>
                </div>
                {promoError && <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px' }}>{promoError}</span>}
                {promoSuccess && <span style={{ color: 'var(--color-success)', fontSize: '12px', marginTop: '4px' }}>{promoSuccess}</span>}
              </div>

              {/* Total & Submit */}
              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Выбранное место: {selectedSeat ? <strong>{selectedSeat.id}</strong> : 'Не выбрано'}
                  </span>
                  <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    Итого: {getPrice()} ₽
                  </span>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '14px' }}
                  disabled={!selectedSeat || isSubmitting}
                >
                  <CreditCard size={18} /> {isSubmitting ? 'Оформление...' : 'Оплатить и получить билет'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
