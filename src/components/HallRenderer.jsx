import React, { useRef, useEffect } from 'react';
import { computeSeatPositions } from './DeckBuilder';
import { Ticket, Users, CheckCircle2 } from 'lucide-react';

const DEFAULT_CATEGORIES = [
  { id: 'vip_window', name: 'VIP у окна / Панорама', color: '#f59e0b', price: 2500 },
  { id: 'stage_front', name: 'У сцены / Премиум', color: '#ec4899', price: 3000 },
  { id: 'standard', name: 'Стандартный стол', color: '#3b82f6', price: 1500 },
  { id: 'entry_dance', name: 'Танцпол / Входной билет', color: '#8b5cf6', price: 1200 },
  { id: 'bar', name: 'Барная зона', color: '#10b981', price: 1000 }
];

export default function HallRenderer({
  hall,
  event,
  selectedSeat,
  setSelectedSeat,
  selectedSeats = [],
  setSelectedSeats,
  onToggleSeat,
  onSeatClick,
  occupiedSeats = [],
  orientation = 'vertical', // 'vertical' (bow up) or 'horizontal' (bow right)
  isReportMode = false,
  seatColorMap = {},
  readOnly = false
}) {
  const statusRef = useRef(null);

  if (!hall) return null;

  // Normalize selected array
  const activeSelectedList = selectedSeats && selectedSeats.length > 0
    ? selectedSeats
    : selectedSeat
    ? [selectedSeat]
    : [];

  const isSeatSelected = (seatId) => activeSelectedList.some((s) => s.id === seatId || s.seatNumber === seatId || String(s.seatNumber) === String(seatId) || String(s.id) === String(seatId));

  const categories = hall.categories && hall.categories.length > 0 ? hall.categories : DEFAULT_CATEGORIES;
  const getCategory = (catId) => {
    return categories.find((c) => c.id === catId) || categories[0] || { name: 'Стандарт', color: '#3b82f6', price: 1500 };
  };

  const handleSeatClick = (tableOrZone, seat) => {
    if (onSeatClick) {
      onSeatClick(tableOrZone, seat);
      return;
    }
    if (readOnly) return;
    if (occupiedSeats.includes(seat.id)) return;
    const cat = getCategory(seat.categoryId);
    const price = cat.price || (seat.categoryId === 'vip_window' || seat.categoryId === 'stage_front' ? event?.price_vip : event?.price_standard) || 1500;

    const seatObj = {
      id: seat.id,
      seatNumber: seat.seatNumber,
      tableId: tableOrZone.id,
      tableLabel: tableOrZone.label || tableOrZone.id,
      categoryName: cat.name,
      categoryId: cat.id,
      type: cat.id,
      price: price
    };

    if (onToggleSeat) {
      onToggleSeat(seatObj);
    } else if (setSelectedSeats) {
      setSelectedSeats((prev) => {
        const exists = prev.some((s) => s.id === seatObj.id);
        if (exists) {
          return prev.filter((s) => s.id !== seatObj.id);
        } else {
          return [...prev, seatObj];
        }
      });
    }

    if (setSelectedSeat) {
      if (selectedSeat && selectedSeat.id === seatObj.id) {
        setSelectedSeat(null);
      } else {
        setSelectedSeat(seatObj);
      }
    }
  };

  // --- 1. SPECIAL CASE: ONLY ENTRY TICKETS HALL ---
  if (hall.type === 'only_entry') {
    const totalCapacity = hall.capacity || 100;
    const entryCat = categories.find((c) => c.id === 'entry_dance') || categories[0];
    const ticketPrice = entryCat.price || event?.price_standard || 1000;
    const soldCount = occupiedSeats.filter((s) => s.startsWith('ENTRY-') || s.startsWith('T-') || !s.includes('-')).length;
    const availableCount = Math.max(0, totalCapacity - soldCount);

    return (
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: '#f5f3ff', color: '#7c3aed', marginBottom: '16px' }}>
          <Ticket size={28} />
        </div>
        <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 'bold', color: '#0f172a' }}>
          {hall.name || 'Свободный вход / Танцпол'}
        </h3>
        <p style={{ margin: '0 0 20px', color: '#64748b', fontSize: '14px', maxWidth: '500px', marginInline: 'auto' }}>
          {hall.description || 'На этом рейсе действует свободная рассадка и входные билеты. Выберите билет из доступной квоты.'}
        </p>

        {/* Stats card */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', maxWidth: '440px', margin: '0 auto 24px' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Всего мест</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>{totalCapacity}</div>
          </div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#166534' }}>Доступно</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a' }}>{availableCount}</div>
          </div>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '12px', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#991b1b' }}>Куплено</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626' }}>{soldCount}</div>
          </div>
        </div>

        {/* Interactive Ticket Grid */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '12px' }}>
            Сетка входных билетов (нажмите на свободный номер):
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              justifyContent: 'center',
              maxHeight: '220px',
              overflowY: 'auto',
              padding: '12px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}
          >
            {Array.from({ length: totalCapacity }, (_, i) => {
              const ticketNum = i + 1;
              const ticketId = `ENTRY-${ticketNum}`;
              const isOccupied = occupiedSeats.includes(ticketId) || occupiedSeats.includes(String(ticketNum));
              const isSelected = isSeatSelected(ticketId);

              return (
                <button
                  key={ticketId}
                  disabled={isOccupied}
                  onClick={() =>
                    handleSeatClick(
                      { id: 'Входной билет', label: 'Входная квота' },
                      { id: ticketId, seatNumber: ticketNum, categoryId: entryCat.id }
                    )
                  }
                  title={`Входной билет №${ticketNum} (${ticketPrice} ₽)${isOccupied ? ' — Занято' : isSelected ? ' — Выбран' : ''}`}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #16a34a' : isOccupied ? '1px solid #cbd5e1' : '1px solid #c4b5fd',
                    background: isSelected ? '#16a34a' : isOccupied ? '#e2e8f0' : '#f5f3ff',
                    color: isSelected ? '#ffffff' : isOccupied ? '#94a3b8' : '#6d28d9',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: isOccupied ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s',
                    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: isSelected ? '0 0 10px rgba(22, 163, 74, 0.4)' : 'none'
                  }}
                >
                  {ticketNum}
                </button>
              );
            })}
          </div>
        </div>

        {activeSelectedList.length > 0 && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: '600' }}>
            <CheckCircle2 size={18} />
            Выбрано входных билетов: {activeSelectedList.length} шт. на сумму {activeSelectedList.reduce((acc, s) => acc + (s.price || ticketPrice), 0)} ₽
          </div>
        )}
      </div>
    );
  }

  // --- 2. SCHEME WITH TABLES AND/OR ZONES ---
  const hasTables = hall.tables && Array.isArray(hall.tables) && hall.tables.length > 0;
  const hasZones = hall.zones && Array.isArray(hall.zones) && hall.zones.length > 0;
  const width = hall.width || 880;
  const height = hall.height || 520;
  const elementsScale = hall.elementsScale || 1.0;

  const totalSelectedSum = activeSelectedList.reduce((acc, s) => acc + (s.price || 1500), 0);
  const isVertical = orientation === 'vertical';
  // For vertical: SVG viewBox is (0, 0, height, width), bow pointing upwards
  const svgViewBox = isVertical ? `0 0 ${height} ${width}` : `0 0 ${width} ${height}`;

  const updateStatusBar = (info) => {
    if (!statusRef.current) return;
    if (!info) {
      if (activeSelectedList && activeSelectedList.length > 0) {
        statusRef.current.innerHTML = `
          <span style="display:inline-flex;align-items:center;background:#f0fdf4;padding:4px 14px;border-radius:20px;border:1px solid #bbf7d0;color:#166534;font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;">
            ✓ Выбрано мест: <strong>${activeSelectedList.length} шт.</strong> (${totalSelectedSum} ₽) — нажмите для изменения
          </span>
        `;
      } else {
        statusRef.current.innerHTML = `
          <span style="color:#64748b;font-size:12px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;">
            Нажмите на любые свободные места за столиками для выбора (можно выбрать несколько)
          </span>
        `;
      }
      return;
    }

    const badgeBg = info.isSelected ? '#dcfce7' : info.isOccupied ? '#fee2e2' : '#eff6ff';
    const badgeBorder = info.isSelected ? '#86efac' : info.isOccupied ? '#fca5a5' : '#bfdbfe';
    const badgeColor = info.isSelected ? '#15803d' : info.isOccupied ? '#991b1b' : '#1e40af';
    const statusNote = info.isOccupied ? '⛔ Занято' : info.isSelected ? '✓ Выбрано' : '🟢 Нажмите для выбора';

    statusRef.current.innerHTML = `
      <span style="display:inline-flex;align-items:center;background:${badgeBg};padding:4px 14px;border-radius:20px;border:1px solid ${badgeBorder};color:${badgeColor};font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;">
        📍 <strong>${info.tableLabel}, Место ${info.seatNumber}</strong> — ${info.categoryName} (${info.price} ₽) [${statusNote}]
      </span>
    `;
  };

  useEffect(() => {
    updateStatusBar(null);
  }, [activeSelectedList.length, totalSelectedSum]);

  if (hasTables || hasZones) {
    return (
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
        {/* Hover info strip with stable fixed height to prevent layout shift / jitter */}
        <div
          ref={statusRef}
          style={{
            height: '36px',
            minHeight: '36px',
            maxHeight: '36px',
            lineHeight: '36px',
            marginBottom: '12px',
            fontSize: '12px',
            textAlign: 'center',
            color: '#334155',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            boxSizing: 'border-box'
          }}
        >
          <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
            Нажмите на любые свободные места за столиками для выбора (можно выбрать несколько)
          </span>
        </div>

        {/* Interactive SVG Floorplan */}
        <div style={{ overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
          <svg
            viewBox={svgViewBox}
            style={{
              display: 'block',
              width: isVertical ? '100%' : '100%',
              maxWidth: isVertical ? '500px' : '100%',
              maxHeight: isVertical ? 'calc(100vh - 220px)' : '520px',
              margin: '0 auto',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #cbd5e1'
            }}
          >
            {/* Style definitions for smooth hover and selection */}
            <defs>
              <style>{`
                .hr-chair {
                  cursor: pointer;
                  pointer-events: auto;
                }
                .hr-chair circle {
                  transition: stroke 0.12s ease, opacity 0.12s ease;
                }
                .hr-chair:hover circle:not([fill="transparent"]) {
                  stroke: #0284c7 !important;
                  stroke-width: 2.2px !important;
                }
                .hr-chair.is-selected circle:not([fill="transparent"]) {
                  fill: #10b981 !important;
                  stroke: #047857 !important;
                  stroke-width: 2.2px !important;
                }
              `}</style>
            </defs>

            {/* Wrapper group for vertical rotation if vertical orientation requested */}
            <g transform={isVertical ? `rotate(-90) translate(-${width}, 0)` : undefined}>
            {/* Background Blueprint / Hull Outline */}
            {hall.bg_image ? (
              <g
                transform={`translate(${hall.bgOffsetX || 0}, ${hall.bgOffsetY || 0}) scale(${hall.bgScale || 1.0})`}
                transform-origin="center"
              >
                <image
                  href={hall.bg_image}
                  x="0"
                  y="0"
                  width={width}
                  height={height}
                  opacity={hall.bgOpacity || 0.85}
                  preserveAspectRatio="none"
                />
              </g>
            ) : (
              <g pointerEvents="none" className="ship-deck-vector-base">
                <defs>
                  <linearGradient id="hrDeckGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f8fafc" />
                    <stop offset="50%" stopColor="#f1f5f9" />
                    <stop offset="100%" stopColor="#e2e8f0" />
                  </linearGradient>
                  <linearGradient id="hrHullBorderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="50%" stopColor="#64748b" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>
                  <linearGradient id="hrSceneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#334155" />
                  </linearGradient>
                  <linearGradient id="hrBarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0f172a" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                  <filter id="hrDeckShadow" x="-5%" y="-5%" width="110%" height="110%">
                    <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0f172a" floodOpacity="0.06" />
                  </filter>
                </defs>

                {/* Outer Hull with Bulwark */}
                <path
                  d={`M 55,20 L ${width - 140},20 C ${width - 50},20 ${width - 5},${height * 0.28} ${width - 5},${height / 2} C ${width - 5},${height * 0.72} ${width - 50},${height - 20} ${width - 140},${height - 20} L 55,${height - 20} C 30,${height - 20} 20,${height * 0.75} 20,${height / 2} C 20,${height * 0.25} 30,20 55,20 Z`}
                  fill="#ffffff"
                  stroke="url(#hrHullBorderGrad)"
                  strokeWidth="3.5"
                  filter="url(#hrDeckShadow)"
                />

                {/* Inner Deck Walking Surface */}
                <path
                  d={`M 65,30 L ${width - 145},30 C ${width - 60},30 ${width - 18},${height * 0.29} ${width - 18},${height / 2} C ${width - 18},${height * 0.71} ${width - 60},${height - 30} ${width - 145},${height - 30} L 65,${height - 30} C 42,${height - 30} 32,${height * 0.73} 32,${height / 2} C 32,${height * 0.27} 42,30 65,30 Z`}
                  fill="url(#hrDeckGrad)"
                  stroke="#cbd5e1"
                  strokeWidth="1"
                />

                {/* Planking deck lines */}
                <line x1="160" y1="35" x2="160" y2={height - 35} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                <line x1={width - 220} y1="35" x2={width - 220} y2={height - 35} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />

                {/* Bow Panoramic Lounge Area (Right side / Bow) */}
                <path
                  d={`M ${width - 215},35 C ${width - 130},35 ${width - 24},${height * 0.3} ${width - 24},${height / 2} C ${width - 24},${height * 0.7} ${width - 130},${height - 35} ${width - 215},${height - 35} Z`}
                  fill="#f0fdf4"
                  opacity="0.4"
                  stroke="#86efac"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={width - 100}
                  y={height / 2 + 4}
                  fill="#15803d"
                  fontSize="10"
                  fontWeight="bold"
                  letterSpacing="1"
                  textAnchor="middle"
                  transform={isVertical ? `rotate(90, ${width - 100}, ${height / 2 + 4})` : undefined}
                >
                  НОС / ПАНОРАМА
                </text>

                {/* Professional Concert Stage (Left side / Saloon) */}
                <g filter="url(#hrDeckShadow)">
                  <rect 
                    x="70" 
                    y={height / 2 - 65} 
                    width="55" 
                    height="130" 
                    rx="10" 
                    fill="url(#hrSceneGrad)" 
                    stroke="#475569" 
                    strokeWidth="1.5" 
                  />
                  <rect 
                    x="74" 
                    y={height / 2 - 61} 
                    width="47" 
                    height="122" 
                    rx="7" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.2)" 
                    strokeWidth="1" 
                  />
                  <text
                    x="98"
                    y={height / 2 + 4}
                    fill="#f8fafc"
                    fontSize="11"
                    fontWeight="bold"
                    letterSpacing="2"
                    transform={isVertical ? undefined : `rotate(-90, 98, ${height / 2})`}
                    textAnchor="middle"
                  >
                    🎸 СЦЕНА
                  </text>
                </g>

                {/* Ship Bar & Promenade */}
                <g>
                  <rect 
                    x="135" 
                    y={height - 75} 
                    width="60" 
                    height="38" 
                    rx="6" 
                    fill="url(#hrBarGrad)" 
                    stroke="#334155" 
                    strokeWidth="1" 
                  />
                  <text
                    x="165"
                    y={height - 52}
                    fill="#f8fafc"
                    fontSize="9"
                    fontWeight="bold"
                    letterSpacing="1"
                    textAnchor="middle"
                    transform={isVertical ? `rotate(90, 165, ${height - 52})` : undefined}
                  >
                    🍹 БАР
                  </text>
                </g>

                {/* Stern Promenade (Leftmost) */}
                <text
                  x="42"
                  y={height / 2 + 4}
                  fill="#94a3b8"
                  fontSize="9"
                  fontWeight="bold"
                  letterSpacing="1"
                  transform={isVertical ? undefined : `rotate(-90, 42, ${height / 2})`}
                  textAnchor="middle"
                >
                  КОРМА
                </text>
              </g>
            )}

            {/* Entrance Zones (Танцпол / Сетка входных билетов) */}
            {(hall.zones || []).map((zone) => {
              const cat = getCategory(zone.categoryId || 'entry_dance');
              const price = cat.price || 1200;
              const cap = zone.capacity || 10;
              const cols = Math.max(2, Math.floor((zone.width - 16) / 24));
              const rows = Math.ceil(cap / cols);
              const cellW = (zone.width - 16) / cols;
              const cellH = Math.min(24, (zone.height - 36) / Math.max(1, rows));

              return (
                <g key={zone.id} transform={`translate(${zone.x}, ${zone.y})`}>
                  {/* Zone boundary */}
                  <rect
                    x="0"
                    y="0"
                    width={zone.width}
                    height={zone.height}
                    rx="10"
                    fill={cat.color}
                    fillOpacity="0.08"
                    stroke={cat.color}
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  {/* Zone Header */}
                  <rect
                    x="0"
                    y="0"
                    width={zone.width}
                    height="24"
                    rx="10"
                    fill={cat.color}
                    fillOpacity="0.2"
                  />
                  <text
                    x={zone.width / 2}
                    y="16"
                    fill="#0f172a"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {zone.label || zone.id} ({cap} мест)
                  </text>

                  {/* Interactive Entrance Tickets Grid */}
                  {Array.from({ length: cap }, (_, idx) => {
                    const ticketNum = idx + 1;
                    const ticketId = `${zone.id}-${ticketNum}`;
                    const r = Math.floor(idx / cols);
                    const c = idx % cols;
                    const cx = 8 + c * cellW + cellW / 2;
                    const cy = 34 + r * cellH + cellH / 2;

                    const isOccupied = occupiedSeats.includes(ticketId);
                    const isSelected = isSeatSelected(ticketId);

                    let seatFill = (isReportMode && seatColorMap[ticketId]) ? seatColorMap[ticketId] : cat.color;
                    let seatStroke = '#ffffff';

                    if (isOccupied && (!isReportMode || !seatColorMap[ticketId])) {
                      seatFill = '#cbd5e1';
                      seatStroke = '#94a3b8';
                    } else if (isSelected) {
                      seatFill = '#10b981';
                      seatStroke = '#047857';
                    }

                    return (
                      <g
                        key={ticketId}
                        className={`hr-chair ${isSelected ? 'is-selected' : ''}`}
                        transform={`translate(${cx}, ${cy})`}
                        onClick={() =>
                          handleSeatClick(
                            { id: zone.id, label: zone.label || zone.id },
                            { id: ticketId, seatNumber: ticketNum, categoryId: zone.categoryId || 'entry_dance' }
                          )
                        }
                        onMouseEnter={() =>
                          updateStatusBar({
                            tableLabel: zone.label || zone.id,
                            seatNumber: ticketNum,
                            categoryName: cat.name,
                            price: price,
                            isOccupied: isOccupied,
                            isSelected: isSelected
                          })
                        }
                        onMouseLeave={() => updateStatusBar(null)}
                        style={{ cursor: isOccupied ? (isReportMode ? 'pointer' : 'not-allowed') : 'pointer' }}
                      >
                        {/* Invisible hit-area buffer */}
                        <circle cx="0" cy="0" r="12" fill="transparent" />
                        <circle
                          cx="0"
                          cy="0"
                          r={isSelected ? '9' : '7.5'}
                          fill={seatFill}
                          stroke={seatStroke}
                          strokeWidth={isSelected ? '2' : '1'}
                          style={{
                            transition: 'stroke 0.12s, fill 0.12s'
                          }}
                        />
                        <text
                          x="0"
                          y="2.5"
                          transform={isVertical ? 'rotate(90)' : undefined}
                          fill={isOccupied ? '#64748b' : '#ffffff'}
                          fontSize="6.5"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="central"
                          pointerEvents="none"
                        >
                          {ticketNum}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* Tables and Interactive Seats */}
            {(hall.tables || []).map((table) => {
              const tblScale = table.scale || elementsScale;
              const tblWidth = table.width || 70;
              const tblHeight = table.height || 46;
              const tblRadius = table.roundRadius || 26;
              const positions = computeSeatPositions(table.type, table.seatsCount || table.seats?.length || 4, tblWidth, tblHeight, tblScale, tblRadius);

              const sRadius = tblRadius * tblScale;
              const sWidth = tblWidth * tblScale;
              const sHeight = tblHeight * tblScale;

              return (
                <g key={table.id} transform={`translate(${table.x}, ${table.y})`}>
                  {/* Table Surface */}
                  {table.type === 'round' ? (
                    <circle
                      cx="0"
                      cy="0"
                      r={sRadius}
                      fill="#ffffff"
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))' }}
                    />
                  ) : (
                    <rect
                      x={-sWidth / 2}
                      y={-sHeight / 2}
                      width={sWidth}
                      height={sHeight}
                      rx={8 * tblScale}
                      fill="#ffffff"
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))' }}
                    />
                  )}

                  {/* Table Label */}
                  <g transform={isVertical ? 'rotate(90)' : undefined}>
                    <text x="0" y={isVertical ? -4 : -1} fill="#0f172a" fontSize={Math.max(8, 11 * tblScale)} fontWeight="bold" textAnchor="middle" pointerEvents="none">
                      {table.id}
                    </text>
                    <text x="0" y={isVertical ? 8 * tblScale : 11 * tblScale} fill="#64748b" fontSize={Math.max(6, 8 * tblScale)} textAnchor="middle" pointerEvents="none">
                      {table.seats?.length || table.seatsCount} мест
                    </text>
                  </g>

                  {/* Individual Clickable Seats */}
                  {(table.seats || []).map((seat, seatIdx) => {
                    const pos = positions[seatIdx] || { relX: 0, relY: 0 };
                    const cat = getCategory(seat.categoryId);
                    const isOccupied = occupiedSeats.includes(seat.id);
                    const isSelected = isSeatSelected(seat.id);
                    const price = cat.price || 1500;

                    let seatFill = (isReportMode && seatColorMap[seat.id]) ? seatColorMap[seat.id] : cat.color;
                    let seatStroke = '#ffffff';
                    let strokeWidth = '1.5';

                    if (isOccupied && (!isReportMode || !seatColorMap[seat.id])) {
                      seatFill = '#cbd5e1';
                      seatStroke = '#94a3b8';
                    } else if (isSelected) {
                      seatFill = '#10b981';
                      seatStroke = '#047857';
                      strokeWidth = '2.2';
                    }

                    const chairRadius = (isSelected ? 9 : 7.5) * tblScale;

                    return (
                      <g
                        key={seat.id}
                        className={`hr-chair ${isSelected ? 'is-selected' : ''}`}
                        transform={`translate(${pos.relX}, ${pos.relY})`}
                        onClick={() => handleSeatClick(table, seat)}
                        onMouseEnter={() =>
                          updateStatusBar({
                            tableLabel: table.label || table.id,
                            seatNumber: seat.seatNumber,
                            categoryName: cat.name,
                            price: price,
                            isOccupied: isOccupied,
                            isSelected: isSelected
                          })
                        }
                        onMouseLeave={() => updateStatusBar(null)}
                        style={{ cursor: isOccupied ? (isReportMode ? 'pointer' : 'not-allowed') : 'pointer' }}
                      >
                        {/* Invisible hit-area buffer to prevent hover flickering */}
                        <circle cx="0" cy="0" r={chairRadius + 4} fill="transparent" />
                        {/* Chair circle */}
                        <circle
                          cx="0"
                          cy="0"
                          r={chairRadius}
                          fill={seatFill}
                          stroke={seatStroke}
                          strokeWidth={strokeWidth}
                          style={{
                            transition: 'stroke 0.12s, fill 0.12s'
                          }}
                        />
                        {/* Seat Number (with counter-rotation for readability in vertical mode) */}
                        <text
                          x="0"
                          y={3 * tblScale}
                          transform={isVertical ? 'rotate(90)' : undefined}
                          fill={isOccupied ? '#64748b' : '#ffffff'}
                          fontSize={Math.max(6, 8 * tblScale)}
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="central"
                          pointerEvents="none"
                        >
                          {seat.seatNumber}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })}
            </g>
          </svg>
        </div>

        {/* Categories Legend with Prices */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '16px',
            padding: '12px',
            background: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            fontSize: '12px'
          }}
        >
          {categories.map((cat) => (
            <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: cat.color }} />
              <span style={{ fontWeight: '500', color: '#0f172a' }}>{cat.name}</span>
              <span style={{ color: '#64748b', fontWeight: 'bold' }}>({cat.price} ₽)</span>
            </div>
          ))}

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#16a34a' }} />
            <span style={{ fontWeight: '500', color: '#16a34a' }}>Выбрано вами</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#cbd5e1', border: '1px solid #94a3b8' }} />
            <span style={{ color: '#94a3b8' }}>Занято</span>
          </div>
        </div>
      </div>
    );
  }

  // Fallback classic grid renderer
  const rows = hall.rows || 6;
  const cols = hall.seats_per_row || 10;
  const seats = [];

  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      const id = `Р${r}-М${c}`;
      const isVip = r <= 2;
      seats.push({ id, type: isVip ? 'vip' : 'standard', row: r, col: c });
    }
  }

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
      <div
        style={{
          background: '#e2e8f0',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          padding: '8px',
          textAlign: 'center',
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#475569',
          letterSpacing: '1px',
          marginBottom: '20px'
        }}
      >
        ▲ НОС ТЕПЛОХОДА / СЦЕНА / ПАНОРАМА ▲
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, minmax(36px, 1fr))`,
          gap: '8px',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto',
          maxWidth: '680px'
        }}
      >
        {seats.map((seat) => {
          const isOccupied = occupiedSeats.includes(seat.id);
          const isSelected = isSeatSelected(seat.id);
          const isVip = seat.type === 'vip';

          let bgColor = '#eff6ff';
          let textColor = '#1e40af';
          let borderColor = '#93c5fd';

          if (isVip) {
            bgColor = '#fef3c7';
            textColor = '#92400e';
            borderColor = '#f59e0b';
          }

          if (isSelected) {
            bgColor = '#16a34a';
            textColor = '#ffffff';
            borderColor = '#15803d';
          }

          if (isOccupied) {
            bgColor = '#e2e8f0';
            textColor = '#94a3b8';
            borderColor = '#cbd5e1';
          }

          return (
            <button
              key={seat.id}
              onClick={() =>
                handleSeatClick(
                  { id: `Ряд ${seat.row}`, label: `Ряд ${seat.row}` },
                  { id: seat.id, seatNumber: seat.col, categoryId: isVip ? 'vip_window' : 'standard' }
                )
              }
              disabled={isOccupied}
              title={`${seat.id} (${isVip ? 'VIP' : 'Стандарт'})${isOccupied ? ' — Занято' : ''}`}
              style={{
                aspectRatio: '1',
                borderRadius: '8px',
                border: `2px solid ${borderColor}`,
                background: bgColor,
                color: textColor,
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: isOccupied ? 'not-allowed' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
                boxShadow: isSelected ? '0 0 10px rgba(22, 163, 74, 0.5)' : '0 1px 2px rgba(0,0,0,0.05)',
                transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                padding: '2px'
              }}
            >
              <span>{seat.id}</span>
            </button>
          );
        })}
      </div>

      <div
        style={{
          background: '#f1f5f9',
          border: '1px dashed #cbd5e1',
          borderRadius: '8px',
          padding: '6px',
          textAlign: 'center',
          fontSize: '11px',
          color: '#64748b',
          marginTop: '20px'
        }}
      >
        ▼ КОРМА / ВХОД НА ТЕПЛОХОД ▼
      </div>
    </div>
  );
}


