import React, { useState, useEffect } from 'react';
import { getHallById, getEvents, createBooking } from '../db';
import { PRESET_SHIP_DECKS } from '../data/ship_blueprints';
import HallRenderer from './HallRenderer';
import RockHitNevaVesselScheme from './RockHitNevaVesselScheme';

export default function SeatWidget() {
  const [event, setEvent] = useState(null);
  const [hall, setHall] = useState(null);
  const [activeBlueprintId, setActiveBlueprintId] = useState('bp_rock_hit_neva');
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '' });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [agentCode, setAgentCode] = useState('');

  // Load event based on URL param or default
  useEffect(() => {
    // Check both search params and hash params (e.g. #widget?event=... or ?event=...)
    let eventId = new URLSearchParams(window.location.search).get('event');
    let agent = new URLSearchParams(window.location.search).get('agent');
    
    if (!eventId && window.location.hash.includes('?')) {
      const hashQuery = window.location.hash.split('?')[1];
      const hashParams = new URLSearchParams(hashQuery);
      eventId = hashParams.get('event');
      if (!agent) agent = hashParams.get('agent');
    }

    if (agent) setAgentCode(agent);

    async function load() {
      const events = await getEvents();
      let ev = eventId ? events.find(e => String(e.id) === String(eventId)) : null;
      if (!ev) {
        // Fallback to cached selected event or first active event or default event
        try {
          const cached = localStorage.getItem('selected_booking_event');
          if (cached) {
            const parsed = JSON.parse(cached);
            ev = events.find(e => String(e.id) === String(parsed.id)) || parsed;
          }
        } catch (e) {}
      }
      if (!ev && events && events.length > 0) {
        ev = events[0];
      }
      if (!ev) {
        ev = {
          id: 'default_event',
          name: 'Рок-хиты с симфоническим оркестром на теплоходе «Рок Хит Нева»',
          price_standard: 1500,
          price_vip: 2500,
          hall_id: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef'
        };
      }

      setEvent(ev);

      // Detect ship
      const evTitle = (ev.name || ev.title || '').toLowerCase();
      let initBp = 'bp_rock_hit_neva';
      if (evTitle.includes('201')) initBp = 'bp_m201';
      else if (evTitle.includes('солярис') || evTitle.includes('solaris')) initBp = 'bp_solaris';
      else if (evTitle.includes('125')) initBp = 'bp_m125_classic';
      else if (evTitle.includes('177')) initBp = 'bp_m177';
      setActiveBlueprintId(initBp);

      if (initBp !== 'bp_rock_hit_neva' && PRESET_SHIP_DECKS[initBp]) {
        setHall(PRESET_SHIP_DECKS[initBp]);
      } else {
        const h = await getHallById(ev.hall_id);
        setHall(h || PRESET_SHIP_DECKS.bp_rock_hit_neva || {
          id: 'default_hall',
          name: 'Теплоход «Рок Хит Нева»',
          type: 'custom_svg'
        });
      }

      try {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const occupied = bookings
          .filter(b => String(b.event_id) === String(ev.id) && b.status !== 'cancelled')
          .map(b => b.seat_number);
        setOccupiedSeats(occupied);
      } catch (e) {
        setOccupiedSeats([]);
      }
    }
    load();
  }, []);

  const handleBook = async () => {
    if (!selectedSeat || !customer.name || !customer.phone) return;
    setIsBooking(true);
    
    const priceToPay = selectedSeat.price || (selectedSeat.type === 'vip' ? event.price_vip : event.price_standard);

    try {
      const bookingRecord = await createBooking({
        event_id: event.id,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        seat_number: selectedSeat.id,
        seat_category: selectedSeat.categoryName || selectedSeat.type || 'standard',
        price_paid: priceToPay,
        status: 'confirmed',
        agent_id: agentCode || null,
        promoCode: agentCode || null
      });

      if (bookingRecord) {
        setBookingSuccess(true);
      } else {
        alert('Ошибка бронирования');
      }
    } catch (e) {
      console.error(e);
      alert('Ошибка при бронировании билета: ' + e.message);
    }
    setIsBooking(false);
  };

  if (!event || !hall) return <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  if (bookingSuccess) {
    return (
      <div className="glass" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-success)' }}>
        <h2>Оплата прошла успешно!</h2>
        <p>Билет отправлен на {customer.email}</p>
        <button onClick={() => window.location.reload()} style={{ marginTop: '20px' }}>Новый заказ</button>
      </div>
    );
  }

  const priceToPay = selectedSeat ? (selectedSeat.price || (selectedSeat.type === 'vip' ? event.price_vip : event.price_standard)) : 0;

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap' }}>
      <div className="glass" style={{ flex: '1 1 600px', padding: '20px' }}>
        <h3 style={{ marginBottom: '16px' }}>Выбор места на рейс: {event.name}</h3>
        {activeBlueprintId === 'bp_rock_hit_neva' ? (
          <div style={{ width: '100%', maxWidth: '440px', margin: '0 auto', overflow: 'visible' }}>
            <RockHitNevaVesselScheme
              readOnly={false}
              selectedSeat={selectedSeat}
              seatColorMap={occupiedSeats.reduce((acc, s) => {
                const num = String(s).replace(/^seat-|^S-|^T\d+-S/, '');
                acc[num] = '#94a3b8';
                return acc;
              }, {})}
              onSeatClick={(seatNum, seatData) => {
                const seatId = `seat-${seatNum}`;
                const isOcc = occupiedSeats.includes(seatId) || occupiedSeats.includes(String(seatNum)) || occupiedSeats.includes(`S-${seatNum}`);
                if (isOcc) {
                  alert(`Место №${seatNum} уже занято.`);
                  return;
                }
                const isUpper = seatData?.deck === 'upper' || seatData?.tableLabel?.includes('Верхняя') || seatNum > 70;
                const isVip = seatData?.categoryName?.toLowerCase().includes('vip') || (seatNum <= 2 || (seatNum >= 63 && seatNum <= 70) || (seatNum >= 71 && seatNum <= 82) || (seatNum >= 106 && seatNum <= 115));
                const price = seatData?.price || (isVip ? (event.price_vip || 2500) : (event.price_standard || 1500));
                setSelectedSeat({
                  id: seatId,
                  seatNumber: seatNum,
                  tableId: seatData?.tableLabel || (isUpper ? 'ВЕРХНЯЯ ПАЛУБА' : 'НИЖНЯЯ ПАЛУБА'),
                  type: isVip ? 'vip' : 'standard',
                  categoryId: seatData?.categoryId || (isVip ? 'vip_window' : 'standard'),
                  categoryName: seatData?.categoryName || (isVip ? 'VIP Панорама' : 'Стандартный стол'),
                  price: price
                });
              }}
            />
          </div>
        ) : (
          <HallRenderer
            hall={hall}
            event={event}
            selectedSeat={selectedSeat}
            setSelectedSeat={setSelectedSeat}
            occupiedSeats={occupiedSeats}
          />
        )}
      </div>
      
      <div className="glass" style={{ flex: '1 1 300px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3>Оформление билета</h3>
        {agentCode && <div style={{ fontSize: '12px', color: 'var(--color-primary)' }}>Агент: {agentCode}</div>}
        
        <input 
          type="text" 
          placeholder="Имя" 
          value={customer.name}
          onChange={e => setCustomer({...customer, name: e.target.value})}
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a' }}
        />
        <input 
          type="tel" 
          placeholder="Телефон" 
          value={customer.phone}
          onChange={e => setCustomer({...customer, phone: e.target.value})}
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a' }}
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={customer.email}
          onChange={e => setCustomer({...customer, email: e.target.value})}
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a' }}
        />
        
        <div style={{ marginTop: 'auto' }}>
          <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span>Выбрано:</span>
            <strong>{selectedSeat ? `${selectedSeat.tableLabel ? selectedSeat.tableLabel + ', ' : ''}Место ${selectedSeat.seatNumber || selectedSeat.id}` : '—'}</strong>
          </div>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <span>К оплате:</span>
            <strong style={{ color: 'var(--color-primary)', fontSize: '20px' }}>
              {priceToPay} ₽
            </strong>
          </div>
          <button 
            disabled={!selectedSeat || !customer.name || !customer.phone || isBooking}
            onClick={handleBook}
            style={{ width: '100%', padding: '12px', background: 'var(--color-primary)', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: (!selectedSeat || !customer.name || !customer.phone || isBooking) ? 'not-allowed' : 'pointer' }}
          >
            {isBooking ? 'Обработка...' : 'Оплатить'}
          </button>
        </div>
      </div>
    </div>
  );
}
