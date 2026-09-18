import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Anchor, CreditCard, ChevronLeft, CheckCircle, Percent, Trash2, X, Ticket } from 'lucide-react';
import { createBooking, verifyPromoCode, getBookings, getHallById, getHalls } from '../db';
import HallRenderer from './HallRenderer';

export default function BookingDetails({ event, onBack }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedAgent, setAppliedAgent] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [bookedSeatsSummary, setBookedSeatsSummary] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [hall, setHall] = useState(null);

  // Check for referral code in URL on load (e.g. ?promo=ALEXROCK)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const promo = params.get('promo');
    if (promo) {
      setPromoCode(promo);
      handleApplyPromo(promo);
    }
  }, []);

  // Fetch hall and occupied seats for this event
  useEffect(() => {
    async function loadEventData() {
      // 1. Load Hall
      let h = null;
      if (event.hall_id) {
        h = await getHallById(event.hall_id);
      }
      if (!h) {
        const halls = await getHalls();
        h = halls.find((x) => x.type === 'custom_svg') || halls[0];
      }
      setHall(h);

      // 2. Load Bookings
      const allBookings = await getBookings();
      const filtered = allBookings
        .filter((b) => b.event_id === event.id && b.status !== 'cancelled')
        .map((b) => b.seat_number);
      setOccupiedSeats(filtered);
    }
    loadEventData();
  }, [event.id, event.hall_id]);

  const handleApplyPromo = async (codeToVerify) => {
    const code = codeToVerify || promoCode;
    if (!code) return;
    setPromoError('');
    setPromoSuccess('');

    try {
      const agent = await verifyPromoCode(code);
      if (agent) {
        setAppliedAgent(agent);
        setPromoSuccess(`Промокод применен! Скидка партнера 10% учтена.`);
      } else {
        setAppliedAgent(null);
        setPromoError('Неверный промокод.');
      }
    } catch (e) {
      setPromoError('Ошибка проверки промокода.');
    }
  };

  const handleToggleSeat = (seatObj) => {
    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.id === seatObj.id);
      if (exists) {
        return prev.filter((s) => s.id !== seatObj.id);
      } else {
        return [...prev, seatObj];
      }
    });
  };

  const handleRemoveSeat = (seatId) => {
    setSelectedSeats((prev) => prev.filter((s) => s.id !== seatId));
  };

  const getSeatPrice = (seat) => {
    const basePrice = Number(seat.price) || (seat.type === 'vip' || seat.categoryId === 'vip_window' ? event.price_vip : event.price_standard) || 1500;
    if (appliedAgent) {
      return Math.round(basePrice * 0.9);
    }
    return basePrice;
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat), 0);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (selectedSeats.length === 0) return;
    setIsSubmitting(true);

    try {
      // Create a booking for each selected seat
      for (const seat of selectedSeats) {
        const bookingPayload = {
          event_id: event.id,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          seat_number: seat.id,
          seat_category: seat.categoryName || seat.type || 'standard',
          price_paid: getSeatPrice(seat),
          status: 'confirmed',
          agent_id: appliedAgent ? appliedAgent.id : null
        };
        await createBooking(bookingPayload);
      }

      setBookedSeatsSummary([...selectedSeats]);
      setIsBooked(true);
    } catch (err) {
      alert('Ошибка при бронировании: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isBooked) {
    return (
      <div className="glass" style={{ padding: '40px', textAlign: 'center', maxWidth: '640px', margin: '40px auto' }}>
        <CheckCircle size={64} color="var(--color-success)" style={{ marginBottom: '20px' }} />
        <h2 style={{ fontFamily: 'var(--font-title)', marginBottom: '12px' }}>Билеты успешно оформлены!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Электронные посадочные билеты с QR-кодами и инструкцией отправлены на почту <strong>{customerEmail}</strong>.
        </p>

        <div className="glass" style={{ padding: '20px', marginBottom: '24px', textAlign: 'left', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ marginBottom: '8px' }}><strong>Рейс:</strong> {event.name}</div>
          <div style={{ marginBottom: '8px' }}><strong>Дата и время:</strong> {event.date} в {event.time.slice(0, 5)}</div>
          <div style={{ marginBottom: '12px' }}>
            <strong>Оформленные места ({bookedSeatsSummary.length} шт.):</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {bookedSeatsSummary.map((s) => (
                <span
                  key={s.id}
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    color: '#166534',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}
                >
                  {s.tableLabel ? `${s.tableLabel}, Место ${s.seatNumber}` : s.id} ({s.categoryName || 'Стандарт'})
                </span>
              ))}
            </div>
          </div>
          <div style={{ fontSize: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '10px', marginTop: '10px' }}>
            <strong>Итого оплачено:</strong> <span style={{ color: '#16a34a', fontWeight: 'bold' }}>{bookedSeatsSummary.reduce((acc, s) => acc + getSeatPrice(s), 0)} ₽</span>
          </div>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '28px', alignItems: 'start' }}>
        {/* Left Column: Interactive Seat Selector */}
        <div className="glass" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h2 style={{ fontFamily: 'var(--font-title)', margin: 0 }}>Выбор мест на схеме теплохода</h2>
            {selectedSeats.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedSeats([])}
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Trash2 size={12} /> Сбросить выбор
              </button>
            )}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
            Кликните по свободным креслам за столиками или в зоне танцпола. Вы можете выбрать сразу несколько мест.
          </p>

          <HallRenderer
            hall={hall}
            event={event}
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
            onToggleSeat={handleToggleSeat}
            occupiedSeats={occupiedSeats}
          />
        </div>

        {/* Right Column: Checkout Info & Cart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Cruise brief */}
          <div className="glass" style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', marginBottom: '16px' }}>Информация о рейсе</h3>
            <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#0f172a' }}>{event.name}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="var(--color-primary)" /> <strong>Дата:</strong> {event.date}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="var(--color-primary)" /> <strong>Время отправления:</strong> {event.time.slice(0, 5)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Anchor size={16} color="var(--color-primary)" /> <strong>Маршрут:</strong> Центральная акватория Невы (под разводные мосты)
              </div>
            </div>
          </div>

          {/* Form and Selected Cart */}
          <div className="glass" style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', marginBottom: '20px' }}>Оформление заказа</h3>

            {/* Selected Seats Cart Box */}
            <div style={{ marginBottom: '20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Ticket size={16} color="var(--color-primary)" /> Выбранные места:
                </div>
                <span style={{ fontSize: '12px', background: selectedSeats.length > 0 ? '#dcfce7' : '#f1f5f9', color: selectedSeats.length > 0 ? '#166534' : '#64748b', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                  {selectedSeats.length} шт.
                </span>
              </div>

              {selectedSeats.length === 0 ? (
                <div style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '12px 0' }}>
                  Нажмите на кресла на схеме палубы слева, чтобы выбрать билеты.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                  {selectedSeats.map((seat) => {
                    const price = getSeatPrice(seat);
                    return (
                      <div
                        key={seat.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '13px'
                        }}
                      >
                        <div>
                          <strong>{seat.tableLabel ? `${seat.tableLabel}, Место ${seat.seatNumber}` : seat.id}</strong>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{seat.categoryName || 'Стандарт'}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{price} ₽</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSeat(seat.id)}
                            title="Удалить из заказа"
                            style={{
                              border: 'none',
                              background: '#fee2e2',
                              color: '#ef4444',
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              padding: 0
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

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
                <label className="form-label">Email для отправки билетов</label>
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
                <label className="form-label">Промокод партнера / отеля</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Например, ALEXROCK или ASTORIA10"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button type="button" className="btn btn-secondary" onClick={() => handleApplyPromo()}>
                    Применить
                  </button>
                </div>
                {promoError && <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px' }}>{promoError}</span>}
                {promoSuccess && <span style={{ color: 'var(--color-success)', fontSize: '12px', marginTop: '4px' }}>{promoSuccess}</span>}
              </div>

              {/* Total & Submit */}
              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Итого к оплате ({selectedSeats.length} {selectedSeats.length === 1 ? 'билет' : selectedSeats.length < 5 ? 'билета' : 'билетов'}):
                  </span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                    {getTotalPrice()} ₽
                  </span>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '15px' }}
                  disabled={selectedSeats.length === 0 || isSubmitting}
                >
                  <CreditCard size={18} /> {isSubmitting ? 'Оформление...' : `Оплатить ${getTotalPrice() > 0 ? `${getTotalPrice()} ₽` : ''} и получить билеты`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


