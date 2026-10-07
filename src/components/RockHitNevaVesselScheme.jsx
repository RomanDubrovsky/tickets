import React, { useState, useEffect, useRef } from 'react';

/**
 * RockHitNevaVesselScheme
 * Renders the accurate 2-deck architectural ship vector layout (Lower Saloon + Upper Panorama Deck, 70 seats)
 * inspired by Astra Marine marine architecture, restyled into a refined Dusty Blue & Slate maritime palette.
 * 
 * Features:
 * - 100% stable hover & click interaction with zero jitter / layout shift
 * - Direct DOM-driven status pill (zero React re-renders on mousemove)
 * - Hardware-accelerated vector SVG stroke hover highlighting
 * - Multi-seat selection support with glowing emerald highlighting
 */
export default function RockHitNevaVesselScheme({
  schemeSvgUrl = '/ships_schemes/rock_hit_neva_scheme.svg',
  seatColorMap = {},
  selectedSeat = null,
  selectedSeats = [],
  onSeatClick = () => {},
  readOnly = false,
  deckCells = {},
  channelFilter = 'all'
}) {
  const [svgContent, setSvgContent] = useState('');
  const containerRef = useRef(null);
  const statusRef = useRef(null);

  // Fetch or load the pristine SVG template
  useEffect(() => {
    fetch(schemeSvgUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load scheme SVG: ${schemeSvgUrl}`);
        return res.text();
      })
      .then((text) => {
        // Strip XML declaration or doctype if present
        let cleaned = text.replace(/<\?xml[^>]*\?>/gi, '').replace(/<!DOCTYPE[^>]*>/gi, '');
        // Clean CSS vector highlighting - no drop-shadow filters that cause SVG bounding box shifts
        const styleBlock = `
          <style>
            g[data-seat-number] {
              cursor: pointer;
              pointer-events: auto;
            }
            g[data-seat-number] path {
              transition: stroke 0.12s ease, opacity 0.12s ease;
            }
            g[data-seat-number]:hover path {
              opacity: 0.85;
              stroke: #0284c7 !important;
              stroke-width: 1.8px !important;
            }
            g[data-seat-number].is-selected path {
              stroke: #047857 !important;
              stroke-width: 2.2px !important;
              fill: #10b981 !important;
            }
            g[data-seat-number] text, g[data-seat-number] tspan {
              pointer-events: none !important;
              user-select: none !important;
            }
          </style>
        `;
        cleaned = cleaned.replace(/<svg([^>]*)>/i, `<svg$1>${styleBlock}`);
        setSvgContent(cleaned);
      })
      .catch((err) => {
        console.error('Error loading vessel scheme SVG:', err);
      });
  }, [schemeSvgUrl]);

  // Update default status text when selection changes
  const updateDefaultStatus = () => {
    if (!statusRef.current) return;
    if (selectedSeats && selectedSeats.length > 0) {
      statusRef.current.innerHTML = `
        <span style="display:inline-flex;align-items:center;background:#f0fdf4;padding:4px 12px;border-radius:18px;border:1px solid #bbf7d0;color:#166534;font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;">
          ✓ Выбрано: <strong>${selectedSeats.length} мест</strong> — кликните для изменения
        </span>
      `;
    } else {
      statusRef.current.innerHTML = `
        <span style="color:#64748b;font-size:12px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;">
          Наведите на место или нажмите для выбора билета
        </span>
      `;
    }
  };

  // Modify SVG in DOM after render to hook click events and apply seat colors
  useEffect(() => {
    if (!containerRef.current || !svgContent) return;

    const svgEl = containerRef.current.querySelector('svg');
    if (!svgEl) return;

    // Make SVG responsive & fit full vessel without cutting or requiring inner scroll
    svgEl.setAttribute('width', '100%');
    svgEl.setAttribute('height', '100%');
    svgEl.style.width = '100%';
    svgEl.style.height = 'auto';
    svgEl.style.maxHeight = 'none';
    svgEl.style.display = 'block';
    svgEl.style.margin = '0 auto';

    updateDefaultStatus();

    // Find all 70 seats
    const seatGroups = svgEl.querySelectorAll('g[data-seat-number]');
    seatGroups.forEach((g) => {
      const seatNum = g.getAttribute('data-seat-number');
      const num = parseInt(seatNum, 10);
      
      const isSelected = (selectedSeats && selectedSeats.some(s => 
        s.id === num || 
        s.seatNumber === num || 
        s.id === `seat-${num}` || 
        s.id === `S-${num}` ||
        String(s.seatNumber) === String(num) ||
        String(s.id) === String(num)
      )) || (selectedSeat && (selectedSeat.number === num || selectedSeat.seatNumber === num || selectedSeat === num || selectedSeat === seatNum));

      // Color logic: check seatColorMap by seat number (e.g. '1', 1, or mapped ID)
      const mappedColor = seatColorMap[seatNum] || seatColorMap[num] || seatColorMap[`seat-${num}`];
      
      let seatFill = mappedColor || '#93c5fd';
      if (isSelected) {
        seatFill = '#10b981'; // Selected accent
      }

      // Update inner paths fill safely
      const paths = g.querySelectorAll('path');
      paths.forEach((p) => {
        const origFill = p.getAttribute('data-orig-fill') || p.getAttribute('fill');
        if (!p.hasAttribute('data-orig-fill') && origFill) {
          p.setAttribute('data-orig-fill', origFill);
        }
        if (origFill && origFill !== 'none') {
          p.setAttribute('fill', seatFill);
        }
      });

      // Pointer & Selection handling
      g.style.cursor = readOnly && !onSeatClick ? 'default' : 'pointer';
      if (isSelected) {
        g.classList.add('is-selected');
      } else {
        g.classList.remove('is-selected');
      }

      const attrTable = g.getAttribute('data-table-label');
      const attrCat = g.getAttribute('data-category-name');
      const attrPrice = g.getAttribute('data-price');
      const attrCatId = g.getAttribute('data-category-id');
      const isVip = attrCat ? attrCat.toLowerCase().includes('vip') : (num <= 9 || num >= 63);
      const seatPrice = attrPrice ? parseInt(attrPrice, 10) : (isVip ? 2500 : 1500);
      const deckName = attrTable || (isVip ? (num <= 9 ? 'VIP Нос' : 'VIP Корма') : (num <= 36 ? 'Нижняя палуба' : 'Верхняя палуба'));
      const catName = attrCat || (isVip ? 'VIP Панорама' : 'Стандарт');

      // Clean existing listeners to prevent duplicates
      g.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (onSeatClick) {
          onSeatClick(num, {
            seatNumber: num,
            color: seatFill,
            tableLabel: deckName,
            categoryName: catName,
            categoryId: attrCatId || (isVip ? 'vip_front' : 'standard'),
            price: seatPrice,
            channelVal: deckCells[seatNum]
          });
        }
      };

      g.onmouseenter = () => {
        if (!statusRef.current) return;
        const isOcc = mappedColor === '#94a3b8' || (seatColorMap[num] && seatColorMap[num] !== '#93c5fd' && seatColorMap[num] !== '#10b981');
        
        const badgeBg = isSelected ? '#dcfce7' : isOcc ? '#fee2e2' : '#eff6ff';
        const badgeBorder = isSelected ? '#86efac' : isOcc ? '#fca5a5' : '#bfdbfe';
        const badgeColor = isSelected ? '#15803d' : isOcc ? '#991b1b' : '#1e40af';
        const statusNote = isOcc ? '🔴 Занято' : isSelected ? '✓ Выбрано' : '🟢 Выбрать';

        statusRef.current.innerHTML = `
          <span style="display:inline-flex;align-items:center;background:${badgeBg};padding:4px 12px;border-radius:18px;border:1px solid ${badgeBorder};color:${badgeColor};font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;">
            📍 <strong>${deckName}, Место №${num}</strong> — ${catName} (${seatPrice} ₽) [${statusNote}]
          </span>
        `;
      };

      g.onmouseleave = () => {
        updateDefaultStatus();
      };
    });
  }, [svgContent, seatColorMap, selectedSeat, selectedSeats, onSeatClick, readOnly, deckCells]);

  return (
    <div 
      style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '440px', 
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'visible'
      }}
    >
      {/* Absolute Zero-Shift Fixed-Height Status Strip (100% stable, non-wrapping) */}
      <div
        ref={statusRef}
        style={{
          width: '100%',
          height: '36px',
          minHeight: '36px',
          maxHeight: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '8px',
          fontSize: '12px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          flexShrink: 0
        }}
      >
        <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Наведите на место или нажмите для выбора билета
        </span>
      </div>

      {/* SVG Container (Full vessel visible without inner scroll) */}
      <div 
        ref={containerRef} 
        style={{ 
          width: '100%', 
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #cbd5e1',
          boxShadow: '0 4px 18px rgba(15, 23, 42, 0.05)',
          padding: '6px',
          overflow: 'visible',
          display: 'flex',
          justifyContent: 'center',
          boxSizing: 'border-box'
        }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
}
