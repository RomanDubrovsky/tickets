import React, { useState, useEffect } from 'react';
import { getHallById, getEvents } from '../db';
import HallRenderer from './HallRenderer';

export default function SeatWidget() {
  const [event, setEvent] = useState(null);
  const [hall, setHall] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '' });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [agentCode, setAgentCode] = useState('');

  // Load event based on URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('event');
    const agent = params.get('agent');
    
    if (agent) setAgentCode(agent);
    
    if (!eventId) return;
    async function load() {
      const events = await getEvents();
      const ev = events.find(e => e.id === eventId);
      if (ev) {
        setEvent(ev);
        const h = await getHallById(ev.hall_id);
        setHall(h);
        
        // In a real scenario, this would fetch from the new API Gateway
        // GET /api/v1/tickets/availability?eventId=...
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const occupied = bookings
          .filter(b => b.event_id === ev.id && b.status !== 'cancelled')
          .map(b => b.seat_number);
        setOccupiedSeats(occupied);
      }
    }
    load();
  }, []);

  const handleBook = async () => {
    if (!selectedSeat || !customer.name || !customer.phone) return;
    setIsBooking(true);
    
    try {
      // 1. Hold seat (Mocking API Gateway call)
      const holdRes = await fetch('http://localhost:3001/api/v1/tickets/hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.id, seatId: selectedSeat.id })
      });
      const holdData = await holdRes.json();
      
      if (!holdData.success) {
        alert(holdData.message || 'Seat unavailable');
        setIsBooking(false);
        return;
      }

      // 2. Book seat via API Gateway
      const bookRes = await fetch('http://localhost:3001/api/v1/tickets/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          eventId: event.id, 
          seatId: selectedSeat.id, 
          holdId: holdData.data.holdId,
          customerInfo: customer,
          promoCode: agentCode
        })
      });
      
      const bookData = await bookRes.json();
      if (bookData.success) {
        setBookingSuccess(true);
        // Also update local storage so the rest of the app sees it (for this MVP)
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        bookings.push({
          id: bookData.data.bookingId,
          event_id: event.id,
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone,
          seat_number: selectedSeat.id,
          seat_category: selectedSeat.category || 'standard',
          price_paid: event.price_standard,
          status: 'confirmed',
          agent_id: agentCode,
          created_at: new Date().toISOString()
        });
        localStorage.setItem('bookings', JSON.stringify(bookings));
      } else {
        alert(bookData.message || 'Booking failed');
      }
    } catch (e) {
      console.error(e);
      alert('Error connecting to booking gateway. Is the server running?');
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

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap' }}>
      <div className="glass" style={{ flex: '1 1 600px', padding: '20px' }}>
        <h3 style={{ marginBottom: '16px' }}>Выбор места на рейс: {event.name}</h3>
        <HallRenderer
          hall={hall}
          event={event}
          selectedSeat={selectedSeat}
          setSelectedSeat={setSelectedSeat}
          occupiedSeats={occupiedSeats}
        />
      </div>
      
      <div className="glass" style={{ flex: '1 1 300px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3>Оформление билета</h3>
        {agentCode && <div style={{ fontSize: '12px', color: 'var(--color-primary)' }}>Агент: {agentCode}</div>}
        
        <input 
          type="text" 
          placeholder="Имя" 
          value={customer.name}
          onChange={e => setCustomer({...customer, name: e.target.value})}
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #444', background: '#222', color: 'white' }}
        />
        <input 
          type="tel" 
          placeholder="Телефон" 
          value={customer.phone}
          onChange={e => setCustomer({...customer, phone: e.target.value})}
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #444', background: '#222', color: 'white' }}
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={customer.email}
          onChange={e => setCustomer({...customer, email: e.target.value})}
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #444', background: '#222', color: 'white' }}
        />
        
        <div style={{ marginTop: 'auto' }}>
          <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Выбрано место:</span>
            <strong>{selectedSeat ? selectedSeat.id : '—'}</strong>
          </div>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <span>К оплате:</span>
            <strong style={{ color: 'var(--color-primary)' }}>
              {selectedSeat ? event.price_standard + ' ₽' : '0 ₽'}
            </strong>
          </div>
          <button 
            disabled={!selectedSeat || !customer.name || !customer.phone || isBooking}
            onClick={handleBook}
            style={{ width: '100%', padding: '12px', background: 'var(--color-primary)', color: 'black', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: (!selectedSeat || !customer.name || !customer.phone || isBooking) ? 'not-allowed' : 'pointer' }}
          >
            {isBooking ? 'Обработка...' : 'Оплатить'}
          </button>
        </div>
      </div>
    </div>
  );
}
