import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Anchor, CreditCard, ChevronLeft, CheckCircle, Percent } from 'lucide-react';
import { createBooking, verifyPromoCode, getBookings, getHallById, getHalls } from '../db';
import HallRenderer from './HallRenderer';

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
    const basePrice = Number(selectedSeat.price) || (selectedSeat.type === 'vip' ? event.price_vip : event.price_standard);
    if (appliedAgent) {
      // 10% discount off base price for using agent promo code
      return Math.round(basePrice * 0.9);
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
        seat_category: selectedSeat.categoryName || selectedSeat.type || 'standard',
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
          <div style={{ marginBottom: '8px' }}>
            <strong>Место:</strong> {selectedSeat.tableLabel ? `${selectedSeat.tableLabel}, Место ${selectedSeat.seatNumber}` : selectedSeat.id} ({selectedSeat.categoryName || 'Стандарт'})
          </div>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '28px', alignItems: 'start' }}>
        {/* Left Column: Interactive Seat Selector */}
        <div className="glass" style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-title)', marginBottom: '8px' }}>Выбор места на схеме теплохода</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
            Выберите свободный столик и место. Стоимость билета зависит от выбранной категории.
          </p>

          <HallRenderer
            hall={hall}
            event={event}
            selectedSeat={selectedSeat}
            setSelectedSeat={setSelectedSeat}
            occupiedSeats={occupiedSeats}
          />
        </div>

        {/* Right Column: Checkout Info */}
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
                <Anchor size={16} color="var(--color-primary)" /> <strong>Маршрут:</strong> Центральная акватория Невы (под мосты)
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
                  <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                    Выбрано:{' '}
                    {selectedSeat ? (
                      <strong style={{ color: '#0f172a' }}>
                        {selectedSeat.tableLabel ? `${selectedSeat.tableLabel}, Место ${selectedSeat.seatNumber}` : selectedSeat.id} (
                        {selectedSeat.categoryName})
                      </strong>
                    ) : (
                      'Не выбрано'
                    )}
                  </span>
                  <span style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                    {getPrice()} ₽
                  </span>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '15px' }}
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

