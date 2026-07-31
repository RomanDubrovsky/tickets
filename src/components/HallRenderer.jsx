import React from 'react';
import './HallRenderer.css'; // optional style file

export default function HallRenderer({ hall, event, selectedSeat, setSelectedSeat, occupiedSeats }) {
  if (!hall) return null;

  const handleSeatClick = (seat) => {
    if (occupiedSeats.includes(seat.id)) return;
    setSelectedSeat(seat);
  };

  if (hall.type === 'grid') {
    const rows = hall.rows || 0;
    const cols = hall.seats_per_row || 0;
    const seats = [];
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        const id = `R${r}C${c}`;
        seats.push({ id, type: 'standard' });
      }
    }
    return (
      <div className="hall-grid">
        {seats.map(seat => {
          const isOccupied = occupiedSeats.includes(seat.id);
          const isSelected = selectedSeat && selectedSeat.id === seat.id;
          return (
            <div
              key={seat.id}
              className={`seat ${isOccupied ? 'occupied' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSeatClick(seat)}
            >
              {seat.id}
            </div>
          );
        })}
      </div>
    );
  }

  // custom_svg rendering
  const seats = hall.seats_json || [];
  return (
    <div className="hall-svg" style={{ position: 'relative' }}>
      <img src={hall.svg_path} alt={hall.name} style={{ width: '100%' }} />
      {seats.map(seat => {
        const isOccupied = occupiedSeats.includes(seat.id);
        const isSelected = selectedSeat && selectedSeat.id === seat.id;
        const size = seat.category === 'vip' ? 20 : 14;
        const left = `${seat.x}px`;
        const top = `${seat.y}px`;
        return (
          <div
            key={seat.id}
            className={`seat ${seat.category} ${isOccupied ? 'occupied' : ''} ${isSelected ? 'selected' : ''}`}
            style={{
              position: 'absolute',
              left,
              top,
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: isOccupied ? 'var(--color-muted)' : isSelected ? 'var(--color-success)' : seat.category === 'vip' ? 'var(--color-warning)' : 'var(--color-primary)',
              cursor: isOccupied ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '10px'
            }}
            onClick={() => handleSeatClick({ id: seat.id, type: seat.category })}
          >
            {seat.id}
          </div>
        );
      })}
    </div>
  );
}
