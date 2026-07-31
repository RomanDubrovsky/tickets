import React, { useState, useEffect } from 'react';
import { getHallById, getEvents } from '../db';
import HallRenderer from './HallRenderer';

export default function SeatWidget() {
  const [event, setEvent] = useState(null);
  const [hall, setHall] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);

  // Load event based on URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('event');
    if (!eventId) return;
    async function load() {
      const events = await getEvents();
      const ev = events.find(e => e.id === eventId);
      if (ev) {
        setEvent(ev);
        const h = await getHallById(ev.hall_id);
        setHall(h);
        // Load occupied seats for this event
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const occupied = bookings
          .filter(b => b.event_id === ev.id && b.status !== 'cancelled')
          .map(b => b.seat_number);
        setOccupiedSeats(occupied);
      }
    }
    load();
  }, []);

  if (!event || !hall) return <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="glass" style={{ padding: '20px' }}>
      <HallRenderer
        hall={hall}
        event={event}
        selectedSeat={selectedSeat}
        setSelectedSeat={setSelectedSeat}
        occupiedSeats={occupiedSeats}
      />
    </div>
  );
}
