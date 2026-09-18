import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Trash2, Save, Layout, Layers, Check, Upload, Tag, Palette, 
  MousePointer, BoxSelect, Paintbrush, Copy, RefreshCw, ZoomIn, ZoomOut, Eye,
  Sliders, Move, Ticket, Sparkles, Grid, X
} from 'lucide-react';

const PRESET_COLORS = [
  '#f59e0b', // Amber / Gold (VIP)
  '#ec4899', // Pink (Premium / Scene)
  '#3b82f6', // Blue (Standard)
  '#8b5cf6', // Purple (Dance / Entry)
  '#10b981', // Emerald (Bar / Eco)
  '#ef4444', // Red (Exclusive)
  '#06b6d4', // Cyan (Deck upper)
  '#64748b'  // Slate (Economy)
];

const DEFAULT_CATEGORIES = [
  { id: 'vip_window', name: 'VIP у окна / Панорама', color: '#f59e0b', price: 2500 },
  { id: 'stage_front', name: 'У сцены / Премиум', color: '#ec4899', price: 3000 },
  { id: 'standard', name: 'Стандартный стол', color: '#3b82f6', price: 1500 },
  { id: 'entry_dance', name: 'Танцпол / Входной билет', color: '#8b5cf6', price: 1200 },
  { id: 'bar', name: 'Барная зона', color: '#10b981', price: 1000 }
];

// Helper to compute seat relative coordinates with scale
export function computeSeatPositions(tableType, seatsCount, width = 70, height = 46, scale = 1.0, roundRadius = 26) {
  const seats = [];
  const sRoundRadius = (roundRadius || 26) * scale;
  const sWidth = (width || 70) * scale;
  const sHeight = (height || 46) * scale;

  if (tableType === 'round') {
    const seatDistance = sRoundRadius + 15 * scale;
    for (let i = 0; i < seatsCount; i++) {
      const angle = (2 * Math.PI * i) / seatsCount - Math.PI / 2;
      const relX = Math.round(seatDistance * Math.cos(angle));
      const relY = Math.round(seatDistance * Math.sin(angle));
      seats.push({ relX, relY, angle });
    }
  } else {
    // Rectangular table
    const halfW = sWidth / 2;
    const halfH = sHeight / 2;
    const seatDist = 14 * scale;

    // Distribute seats: half on top, half on bottom
    const topCount = Math.ceil(seatsCount / 2);
    const bottomCount = Math.floor(seatsCount / 2);

    for (let i = 0; i < topCount; i++) {
      const step = sWidth / (topCount + 1);
      const relX = Math.round(-halfW + (i + 1) * step);
      const relY = Math.round(-halfH - seatDist);
      seats.push({ relX, relY, angle: -Math.PI / 2 });
    }
    for (let i = 0; i < bottomCount; i++) {
      const step = sWidth / (bottomCount + 1);
      const relX = Math.round(-halfW + (i + 1) * step);
      const relY = Math.round(halfH + seatDist);
      seats.push({ relX, relY, angle: Math.PI / 2 });
    }
  }
  return seats;
}

export default function DeckBuilder({ venue, onSave, onCancel }) {
  // Use venue data if available, otherwise defaults
  const initialDeck = venue?.deckData || {};
  
  const [deckWidth, setDeckWidth] = useState(initialDeck.width || 880);
  const [deckHeight, setDeckHeight] = useState(initialDeck.height || 520);
  const [deckName, setDeckName] = useState(venue?.name || 'Верхняя палуба «Рок Хит Нева»');
  
  // Element Scaling and Blueprint controls
  const [elementsScale, setElementsScale] = useState(initialDeck.elementsScale || 1.0); // 0.5 to 2.0
  const [bgImage, setBgImage] = useState(initialDeck.bg_image || null);
  const [bgOpacity, setBgOpacity] = useState(0.85);
  const [bgScale, setBgScale] = useState(initialDeck.bg_scale || 1.0);
  const [bgOffsetX, setBgOffsetX] = useState(initialDeck.bg_offset_x || 0);
  const [bgOffsetY, setBgOffsetY] = useState(initialDeck.bg_offset_y || 0);

  // Categories state
  const [categories, setCategories] = useState(initialDeck.categories && initialDeck.categories.length > 0 ? initialDeck.categories : DEFAULT_CATEGORIES);
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0].id);
  const [newCatName, setNewCatName] = useState('');
  const [newCatPrice, setNewCatPrice] = useState(2000);
  const [newCatColor, setNewCatColor] = useState('#8b5cf6');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Editor mode: 'move' | 'zone_select' | 'paint'
  const [toolMode, setToolMode] = useState('move');

  // Entrance Ticket Zones (Танцпол / Входные билеты / Сетка)
  const [zones, setZones] = useState(initialDeck.zones || [
    {
      id: 'Z1',
      label: 'Танцпол у сцены',
      x: 80,
      y: 190,
      width: 100,
      height: 140,
      capacity: 20,
      categoryId: 'entry_dance'
    }
  ]);

  // Tables state
  const [tables, setTables] = useState(initialDeck.tables || [
    {
      id: 'T1',
      label: 'Стол 1',
      type: 'round',
      x: 230,
      y: 110,
      radius: 26,
      seatsCount: 4,
      categoryId: 'stage_front',
      seats: [
        { id: 'T1-1', seatNumber: 1, categoryId: 'stage_front' },
        { id: 'T1-2', seatNumber: 2, categoryId: 'stage_front' },
        { id: 'T1-3', seatNumber: 3, categoryId: 'stage_front' },
        { id: 'T1-4', seatNumber: 4, categoryId: 'stage_front' }
      ]
    },
    {
      id: 'T2',
      label: 'Стол 2',
      type: 'round',
      x: 230,
      y: 410,
      radius: 26,
      seatsCount: 4,
      categoryId: 'stage_front',
      seats: [
        { id: 'T2-1', seatNumber: 1, categoryId: 'stage_front' },
        { id: 'T2-2', seatNumber: 2, categoryId: 'stage_front' },
        { id: 'T2-3', seatNumber: 3, categoryId: 'stage_front' },
        { id: 'T2-4', seatNumber: 4, categoryId: 'stage_front' }
      ]
    },
    {
      id: 'T3',
      label: 'Стол 3 (У окна)',
      type: 'rect',
      x: 410,
      y: 90,
      width: 70,
      height: 46,
      seatsCount: 6,
      categoryId: 'vip_window',
      seats: [
        { id: 'T3-1', seatNumber: 1, categoryId: 'vip_window' },
        { id: 'T3-2', seatNumber: 2, categoryId: 'vip_window' },
        { id: 'T3-3', seatNumber: 3, categoryId: 'vip_window' },
        { id: 'T3-4', seatNumber: 4, categoryId: 'vip_window' },
        { id: 'T3-5', seatNumber: 5, categoryId: 'vip_window' },
        { id: 'T3-6', seatNumber: 6, categoryId: 'vip_window' }
      ]
    },
    {
      id: 'T4',
      label: 'Стол 4 (У окна)',
      type: 'rect',
      x: 410,
      y: 430,
      width: 70,
      height: 46,
      seatsCount: 6,
      categoryId: 'vip_window',
      seats: [
        { id: 'T4-1', seatNumber: 1, categoryId: 'vip_window' },
        { id: 'T4-2', seatNumber: 2, categoryId: 'vip_window' },
        { id: 'T4-3', seatNumber: 3, categoryId: 'vip_window' },
        { id: 'T4-4', seatNumber: 4, categoryId: 'vip_window' },
        { id: 'T4-5', seatNumber: 5, categoryId: 'vip_window' },
        { id: 'T4-6', seatNumber: 6, categoryId: 'vip_window' }
      ]
    },
    {
      id: 'T5',
      label: 'Стол 5 (Центр)',
      type: 'round',
      x: 580,
      y: 200,
      radius: 26,
      seatsCount: 4,
      categoryId: 'standard',
      seats: [
        { id: 'T5-1', seatNumber: 1, categoryId: 'standard' },
        { id: 'T5-2', seatNumber: 2, categoryId: 'standard' },
        { id: 'T5-3', seatNumber: 3, categoryId: 'standard' },
        { id: 'T5-4', seatNumber: 4, categoryId: 'standard' }
      ]
    },
    {
      id: 'T6',
      label: 'Стол 6 (Центр)',
      type: 'round',
      x: 580,
      y: 320,
      radius: 26,
      seatsCount: 4,
      categoryId: 'standard',
      seats: [
        { id: 'T6-1', seatNumber: 1, categoryId: 'standard' },
        { id: 'T6-2', seatNumber: 2, categoryId: 'standard' },
        { id: 'T6-3', seatNumber: 3, categoryId: 'standard' },
        { id: 'T6-4', seatNumber: 4, categoryId: 'standard' }
      ]
    },
    {
      id: 'T7',
      label: 'Стол 7 (Корма)',
      type: 'rect',
      x: 730,
      y: 260,
      width: 70,
      height: 46,
      seatsCount: 6,
      categoryId: 'standard',
      seats: [
        { id: 'T7-1', seatNumber: 1, categoryId: 'standard' },
        { id: 'T7-2', seatNumber: 2, categoryId: 'standard' },
        { id: 'T7-3', seatNumber: 3, categoryId: 'standard' },
        { id: 'T7-4', seatNumber: 4, categoryId: 'standard' },
        { id: 'T7-5', seatNumber: 5, categoryId: 'standard' },
        { id: 'T7-6', seatNumber: 6, categoryId: 'standard' }
      ]
    }
  ]);

  // Selections
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState(new Set()); // For multi/zone selection

  // Dragging state
  const [draggingTableId, setDraggingTableId] = useState(null);
  const [draggingZoneId, setDraggingZoneId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Zone selection marquee box
  const [isSelectingZone, setIsSelectingZone] = useState(false);
  const [selectionBox, setSelectionBox] = useState(null);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const svgRef = useRef(null);
  const fileInputRef = useRef(null);

  // Category helpers
  const getCategory = (catId) => {
    return categories.find((c) => c.id === catId) || categories[0] || { name: 'Без категории', color: '#64748b', price: 0 };
  };

  // Convert client coordinates to SVG coordinates
  const getSvgCoordinates = (e) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: svgP.x, y: svgP.y };
  };

  // Mouse Down on Canvas
  const handleCanvasMouseDown = (e) => {
    if (e.target === svgRef.current || e.target.tagName === 'rect' || e.target.tagName === 'path' || e.target.tagName === 'image') {
      const coords = getSvgCoordinates(e);
      if (toolMode === 'zone_select') {
        setIsSelectingZone(true);
        setSelectionBox({ startX: coords.x, startY: coords.y, currentX: coords.x, currentY: coords.y });
        setSelectedSeatIds(new Set());
        setSelectedTableId(null);
        setSelectedSeatId(null);
        setSelectedZoneId(null);
      } else {
        setSelectedTableId(null);
        setSelectedSeatId(null);
        setSelectedZoneId(null);
        setSelectedSeatIds(new Set());
      }
    }
  };

  // Mouse Move on Canvas
  const handleCanvasMouseMove = (e) => {
    const coords = getSvgCoordinates(e);

    // 1. Move table dragging
    if (draggingTableId && svgRef.current) {
      const newX = Math.max(30, Math.min(deckWidth - 30, Math.round(coords.x - dragOffset.x)));
      const newY = Math.max(30, Math.min(deckHeight - 30, Math.round(coords.y - dragOffset.y)));
      setTables((prev) =>
        prev.map((t) => (t.id === draggingTableId ? { ...t, x: newX, y: newY } : t))
      );
    }

    // 2. Move zone dragging
    if (draggingZoneId && svgRef.current) {
      const newX = Math.max(10, Math.min(deckWidth - 120, Math.round(coords.x - dragOffset.x)));
      const newY = Math.max(10, Math.min(deckHeight - 120, Math.round(coords.y - dragOffset.y)));
      setZones((prev) =>
        prev.map((z) => (z.id === draggingZoneId ? { ...z, x: newX, y: newY } : z))
      );
    }

    // 3. Zone selection marquee box
    if (isSelectingZone && selectionBox) {
      setSelectionBox((prev) => ({ ...prev, currentX: coords.x, currentY: coords.y }));

      const x1 = Math.min(selectionBox.startX, coords.x);
      const x2 = Math.max(selectionBox.startX, coords.x);
      const y1 = Math.min(selectionBox.startY, coords.y);
      const y2 = Math.max(selectionBox.startY, coords.y);

      const insideSeats = new Set();
      tables.forEach((t) => {
        const positions = computeSeatPositions(t.type, t.seatsCount, t.width, t.height, elementsScale, t.radius);
        t.seats.forEach((s, idx) => {
          const pos = positions[idx] || { relX: 0, relY: 0 };
          const absX = t.x + pos.relX;
          const absY = t.y + pos.relY;
          if (absX >= x1 && absX <= x2 && absY >= y1 && absY <= y2) {
            insideSeats.add(s.id);
          }
        });
      });
      setSelectedSeatIds(insideSeats);
    }
  };

  // Mouse Up on Canvas
  const handleCanvasMouseUp = () => {
    if (draggingTableId) setDraggingTableId(null);
    if (draggingZoneId) setDraggingZoneId(null);
    if (isSelectingZone) {
      setIsSelectingZone(false);
      setSelectionBox(null);
    }
  };

  // Table Mouse Down
  const handleTableMouseDown = (table, e) => {
    e.stopPropagation();
    if (toolMode === 'paint') {
      paintTable(table.id, activeCategoryId);
      return;
    }
    if (toolMode === 'zone_select') return;

    setSelectedTableId(table.id);
    setSelectedSeatId(null);
    setSelectedZoneId(null);
    setSelectedSeatIds(new Set());
    setDraggingTableId(table.id);

    const coords = getSvgCoordinates(e);
    setDragOffset({
      x: coords.x - table.x,
      y: coords.y - table.y
    });
  };

  // Zone Mouse Down
  const handleZoneMouseDown = (zone, e) => {
    e.stopPropagation();
    if (toolMode === 'paint') {
      setZones((prev) => prev.map((z) => (z.id === zone.id ? { ...z, categoryId: activeCategoryId } : z)));
      return;
    }
    if (toolMode === 'zone_select') return;

    setSelectedZoneId(zone.id);
    setSelectedTableId(null);
    setSelectedSeatId(null);
    setSelectedSeatIds(new Set());
    setDraggingZoneId(zone.id);

    const coords = getSvgCoordinates(e);
    setDragOffset({
      x: coords.x - zone.x,
      y: coords.y - zone.y
    });
  };

  // Seat Click / Mouse Down
  const handleSeatClick = (table, seat, e) => {
    e.stopPropagation();
    if (toolMode === 'paint') {
      paintSeat(table.id, seat.id, activeCategoryId);
      return;
    }

    setSelectedTableId(table.id);
    setSelectedSeatId(seat.id);
    setSelectedZoneId(null);
    setSelectedSeatIds(new Set([seat.id]));
  };

  // Paint single seat
  const paintSeat = (tableId, seatId, catId) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        const newSeats = t.seats.map((s) => (s.id === seatId ? { ...s, categoryId: catId } : s));
        return { ...t, seats: newSeats };
      })
    );
  };

  // Paint whole table
  const paintTable = (tableId, catId) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        const newSeats = t.seats.map((s) => ({ ...s, categoryId: catId }));
        return { ...t, categoryId: catId, seats: newSeats };
      })
    );
  };

  // Assign category to all selected seats in zone
  const assignCategoryToSelection = (catId) => {
    if (selectedSeatIds.size === 0 && selectedTableId) {
      paintTable(selectedTableId, catId);
      return;
    }

    setTables((prev) =>
      prev.map((t) => {
        let changed = false;
        const newSeats = t.seats.map((s) => {
          if (selectedSeatIds.has(s.id)) {
            changed = true;
            return { ...s, categoryId: catId };
          }
          return s;
        });
        return changed ? { ...t, seats: newSeats } : t;
      })
    );
  };

  // Add new table
  const addTable = (type) => {
    const newNum = tables.length + 1;
    const newId = `T${newNum}`;
    const seatsCount = type === 'round' ? 4 : 6;
    const newSeats = Array.from({ length: seatsCount }, (_, i) => ({
      id: `${newId}-${i + 1}`,
      seatNumber: i + 1,
      categoryId: activeCategoryId
    }));

    const newTable = {
      id: newId,
      label: `Стол ${newNum}`,
      type: type,
      radius: 26,
      width: 70,
      height: 46,
      x: 200 + ((tables.length * 45) % (deckWidth - 300)),
      y: 160 + ((tables.length * 35) % (deckHeight - 200)),
      seatsCount: seatsCount,
      categoryId: activeCategoryId,
      seats: newSeats
    };

    setTables([...tables, newTable]);
    setSelectedTableId(newId);
    setSelectedSeatId(null);
    setSelectedZoneId(null);
    setSelectedSeatIds(new Set());
  };

  // Add Entrance Ticket Zone (Танцпол / Сетка)
  const addZone = () => {
    const newNum = zones.length + 1;
    const newId = `Z${newNum}`;
    const newZone = {
      id: newId,
      label: `Танцпол ${newNum} (Входные билеты)`,
      x: 100 + (zones.length * 40) % (deckWidth - 250),
      y: 180,
      width: 120,
      height: 140,
      capacity: 30,
      categoryId: 'entry_dance'
    };
    setZones([...zones, newZone]);
    setSelectedZoneId(newId);
    setSelectedTableId(null);
    setSelectedSeatId(null);
    setSelectedSeatIds(new Set());
  };

  // Update table seat count
  const setTableSeatsCount = (tableId, newCount) => {
    const count = Math.max(1, Math.min(16, parseInt(newCount, 10) || 1));
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        const currentSeats = t.seats || [];
        const newSeats = [];
        for (let i = 0; i < count; i++) {
          if (currentSeats[i]) {
            newSeats.push(currentSeats[i]);
          } else {
            newSeats.push({
              id: `${t.id}-${i + 1}`,
              seatNumber: i + 1,
              categoryId: t.categoryId || activeCategoryId
            });
          }
        }
        return { ...t, seatsCount: count, seats: newSeats };
      })
    );
  };

  // Remove table
  const removeSelectedTable = () => {
    if (!selectedTableId) return;
    setTables(tables.filter((t) => t.id !== selectedTableId));
    setSelectedTableId(null);
    setSelectedSeatId(null);
    setSelectedSeatIds(new Set());
  };

  // Remove zone
  const removeSelectedZone = () => {
    if (!selectedZoneId) return;
    setZones(zones.filter((z) => z.id !== selectedZoneId));
    setSelectedZoneId(null);
  };

  // Duplicate table
  const duplicateSelectedTable = () => {
    const current = tables.find((t) => t.id === selectedTableId);
    if (!current) return;
    const newNum = tables.length + 1;
    const newId = `T${newNum}`;
    const newSeats = current.seats.map((s, idx) => ({
      ...s,
      id: `${newId}-${idx + 1}`,
      seatNumber: idx + 1
    }));
    const newTable = {
      ...current,
      id: newId,
      label: `Стол ${newNum}`,
      x: Math.min(deckWidth - 80, current.x + 40),
      y: Math.min(deckHeight - 80, current.y + 40),
      seats: newSeats
    };
    setTables([...tables, newTable]);
    setSelectedTableId(newId);
    setSelectedSeatId(null);
  };

  // Add custom category
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const newId = `cat_${Date.now()}`;
    const newCat = {
      id: newId,
      name: newCatName.trim(),
      color: newCatColor,
      price: Number(newCatPrice) || 1000
    };
    setCategories([...categories, newCat]);
    setActiveCategoryId(newId);
    setNewCatName('');
    setIsAddingCategory(false);
  };

  // Delete Category
  const handleDeleteCategory = (catId) => {
    if (categories.length <= 1) {
      alert('Нельзя удалить последнюю оставшуюся категорию');
      return;
    }
    const filtered = categories.filter((c) => c.id !== catId);
    setCategories(filtered);
    if (activeCategoryId === catId) {
      setActiveCategoryId(filtered[0].id);
    }
    setTables((prev) =>
      prev.map((t) => ({
        ...t,
        categoryId: t.categoryId === catId ? filtered[0].id : t.categoryId,
        seats: t.seats.map((s) => (s.categoryId === catId ? { ...s, categoryId: filtered[0].id } : s))
      }))
    );
  };

  // Blueprint background image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBgImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save full hall schema
  const handleSave = () => {
    const deckData = {
      width: deckWidth,
      height: deckHeight,
      elementsScale: elementsScale,
      categories: categories,
      zones: zones,
      tables: tables,
      bg_image: bgImage || null,
      bg_scale: bgScale,
      bg_offset_x: bgOffsetX,
      bg_offset_y: bgOffsetY,
    };

    if (onSave) {
      onSave(deckData);
    }
    
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const selectedTable = tables.find((t) => t.id === selectedTableId);
  const selectedSeat = selectedTable?.seats.find((s) => s.id === selectedSeatId);
  const selectedZone = zones.find((z) => z.id === selectedZoneId);

  // Total stats
  const totalTableSeats = tables.reduce((acc, t) => acc + (t.seats?.length || 0), 0);
  const totalZoneTickets = zones.reduce((acc, z) => acc + (Number(z.capacity) || 0), 0);
  const totalCapacity = totalTableSeats + totalZoneTickets;

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', userSelect: 'none' }}>
      {/* Visual Canvas Area */}
      <div className="glass" style={{ flex: '1 1 720px', padding: '24px' }}>
        {/* Top Header & Save Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
              <Layout size={22} color="var(--color-primary)" />
              Конструктор палуб, столов и зон входных билетов
            </h3>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Масштабирование столов, привязка подложки, зоны танцпола и гибкое зонирование цен
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-secondary"
              style={{ padding: '8px 14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Upload size={15} />
              {bgImage ? 'Сменить план' : 'Загрузить план'}
            </button>

            {onCancel && (
              <button
                onClick={onCancel}
                className="btn btn-secondary"
                style={{ padding: '8px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}
              >
                <X size={16} />
                Отмена
              </button>
            )}

            <button
              onClick={handleSave}
              className="btn btn-primary"
              style={{ padding: '8px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {savedSuccess ? <Check size={16} /> : <Save size={16} />}
              {savedSuccess ? 'Схема сохранена!' : 'Сохранить схему'}
            </button>
          </div>
        </div>

        {/* Global Element Scale & Blueprint Bar */}
        <div 
          style={{ 
            background: '#ffffff', 
            padding: '10px 14px', 
            borderRadius: '10px', 
            border: '1px solid #e2e8f0', 
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          {/* Elements Scale Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '280px' }}>
            <Sliders size={16} color="var(--color-primary)" />
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
              Масштаб столиков: {Math.round(elementsScale * 100)}%
            </span>
            <input
              type="range"
              min="0.5"
              max="1.8"
              step="0.05"
              value={elementsScale}
              onChange={(e) => setElementsScale(parseFloat(e.target.value))}
              style={{ flex: 1, cursor: 'pointer' }}
            />
          </div>

          {/* Background Alignment Controls if Blueprint is uploaded */}
          {bgImage && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Масштаб плана:</span>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={bgScale}
                  onChange={(e) => setBgScale(parseFloat(e.target.value))}
                  style={{ width: '80px', cursor: 'pointer' }}
                />
                <span>{Math.round(bgScale * 100)}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Прозрачность:</span>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={bgOpacity}
                  onChange={(e) => setBgOpacity(parseFloat(e.target.value))}
                  style={{ width: '70px', cursor: 'pointer' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Mode Selector Bar */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            background: '#f1f5f9', 
            padding: '8px 12px', 
            borderRadius: '10px', 
            marginBottom: '14px', 
            flexWrap: 'wrap', 
            gap: '10px' 
          }}
        >
          {/* Tool Modes */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setToolMode('move')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: toolMode === 'move' ? 'var(--color-primary)' : '#cbd5e1',
                background: toolMode === 'move' ? '#eff6ff' : '#ffffff',
                color: toolMode === 'move' ? '#1d4ed8' : '#334155',
                fontWeight: toolMode === 'move' ? '600' : 'normal',
                cursor: 'pointer',
                fontSize: '13px'
              }}
              title="Перемещение столов, зон танцпола и выбор элементов"
            >
              <MousePointer size={15} /> Выбор и перемещение
            </button>

            <button
              onClick={() => {
                setToolMode('zone_select');
                setSelectedTableId(null);
                setSelectedSeatId(null);
                setSelectedZoneId(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: toolMode === 'zone_select' ? 'var(--color-primary)' : '#cbd5e1',
                background: toolMode === 'zone_select' ? '#eff6ff' : '#ffffff',
                color: toolMode === 'zone_select' ? '#1d4ed8' : '#334155',
                fontWeight: toolMode === 'zone_select' ? '600' : 'normal',
                cursor: 'pointer',
                fontSize: '13px'
              }}
              title="Зажмите мышь и выделите рамкой зону мест для массового присвоения категории"
            >
              <BoxSelect size={15} /> Выделение зоны (Рамка)
            </button>

            <button
              onClick={() => setToolMode('paint')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: toolMode === 'paint' ? 'var(--color-primary)' : '#cbd5e1',
                background: toolMode === 'paint' ? '#eff6ff' : '#ffffff',
                color: toolMode === 'paint' ? '#1d4ed8' : '#334155',
                fontWeight: toolMode === 'paint' ? '600' : 'normal',
                cursor: 'pointer',
                fontSize: '13px'
              }}
              title="Кликайте по местам или зонам для быстрой покраски выбранной категорией"
            >
              <Paintbrush size={15} /> Покраска категорией
            </button>
          </div>

          {/* Quick Active Category Badge for Paint Mode */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <span style={{ color: '#64748b' }}>Активная категория:</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 8px',
                borderRadius: '6px',
                background: '#ffffff',
                border: `1px solid ${getCategory(activeCategoryId).color}`,
                fontWeight: '600',
                color: '#0f172a'
              }}
            >
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: getCategory(activeCategoryId).color }} />
              {getCategory(activeCategoryId).name} ({getCategory(activeCategoryId).price} ₽)
            </span>
          </div>
        </div>

        {/* Zone Selection Action Banner */}
        {selectedSeatIds.size > 0 && (
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              padding: '10px 16px',
              borderRadius: '8px',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#166534', fontWeight: 'bold' }}>
              <Check size={18} color="#16a34a" />
              Выделено мест в зоне: {selectedSeatIds.size} шт.
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: '#166534' }}>Присвоить категорию:</span>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => assignCategoryToSelection(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: `1px solid ${cat.color}`,
                    background: '#ffffff',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: '#0f172a'
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }} />
                  {cat.name} ({cat.price} ₽)
                </button>
              ))}
              <button
                onClick={() => setSelectedSeatIds(new Set())}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  fontSize: '12px',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                Снять выбор
              </button>
            </div>
          </div>
        )}

        {/* Interactive SVG Canvas */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '12px',
            overflowX: 'auto',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
          }}
        >
          <svg
            ref={svgRef}
            width={deckWidth}
            height={deckHeight}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            style={{
              display: 'block',
              margin: '0 auto',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '2px dashed #cbd5e1',
              cursor: toolMode === 'zone_select' ? 'crosshair' : toolMode === 'paint' ? 'cell' : 'default'
            }}
          >
            {/* Custom Deck Blueprint (if uploaded) */}
            {bgImage ? (
              <g transform={`translate(${bgOffsetX}, ${bgOffsetY}) scale(${bgScale})`}>
                <image href={bgImage} x="0" y="0" width={deckWidth} height={deckHeight} opacity={bgOpacity} preserveAspectRatio="none" />
              </g>
            ) : (
              /* Default Ship Deck Contour & Scene */
              <g pointerEvents="none">
                <path
                  d={`M 60,30 L ${deckWidth - 90},30 Q ${deckWidth - 10},${deckHeight / 2} ${deckWidth - 90},${deckHeight - 30} L 60,${deckHeight - 30} Q 15,${deckHeight / 2} 60,30 Z`}
                  fill="#ffffff"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray="5 3"
                />
                <rect x="75" y={deckHeight / 2 - 55} width="40" height="110" rx="8" fill="#e2e8f0" stroke="#cbd5e1" />
                <text
                  x="95"
                  y={deckHeight / 2 + 4}
                  fill="#475569"
                  fontSize="11"
                  fontWeight="bold"
                  transform={`rotate(-90, 95, ${deckHeight / 2})`}
                  textAnchor="middle"
                >
                  СЦЕНА / ПАНОРАМА
                </text>

                <rect x={deckWidth - 75} y={deckHeight / 2 - 45} width="25" height="90" rx="6" fill="#e2e8f0" stroke="#cbd5e1" />
                <text
                  x={deckWidth - 62}
                  y={deckHeight / 2 + 4}
                  fill="#64748b"
                  fontSize="9"
                  fontWeight="bold"
                  transform={`rotate(90, ${deckWidth - 62}, ${deckHeight / 2})`}
                  textAnchor="middle"
                >
                  БАР / ВХОД
                </text>
              </g>
            )}

            {/* Render Entrance Ticket Zones (Танцпол / Сетка входных мест) */}
            {zones.map((zone) => {
              const isZoneSelected = selectedZoneId === zone.id;
              const isDragging = draggingZoneId === zone.id;
              const cat = getCategory(zone.categoryId);

              return (
                <g
                  key={zone.id}
                  transform={`translate(${zone.x}, ${zone.y})`}
                  onMouseDown={(e) => handleZoneMouseDown(zone, e)}
                  style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                >
                  {/* Zone Background Box */}
                  <rect
                    x="0"
                    y="0"
                    width={zone.width}
                    height={zone.height}
                    rx="10"
                    fill={isZoneSelected ? '#eff6ff' : cat.color}
                    fillOpacity={isZoneSelected ? '0.25' : '0.12'}
                    stroke={isZoneSelected ? '#2563eb' : cat.color}
                    strokeWidth={isZoneSelected ? '3' : '2'}
                    strokeDasharray={isZoneSelected ? 'none' : '4 3'}
                  />

                  {/* Zone Header Label */}
                  <rect
                    x="0"
                    y="0"
                    width={zone.width}
                    height="24"
                    rx="10"
                    fill={cat.color}
                    fillOpacity="0.85"
                  />
                  <text
                    x={zone.width / 2}
                    y="16"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    pointerEvents="none"
                  >
                    {zone.label || 'ТАНЦПОЛ'}
                  </text>

                  {/* Zone Capacity & Price Badge */}
                  <text
                    x={zone.width / 2}
                    y={zone.height / 2 + 4}
                    fill="#0f172a"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    pointerEvents="none"
                  >
                    {zone.capacity} вх. билетов
                  </text>
                  <text
                    x={zone.width / 2}
                    y={zone.height / 2 + 18}
                    fill={cat.color}
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    pointerEvents="none"
                  >
                    {cat.price} ₽ / билет
                  </text>

                  {/* Mini-grid indicator in zone */}
                  <g opacity="0.4" pointerEvents="none">
                    {Array.from({ length: Math.min(12, zone.capacity) }).map((_, idx) => {
                      const cols = 4;
                      const r = Math.floor(idx / cols);
                      const c = idx % cols;
                      const startY = zone.height - 28;
                      return (
                        <circle
                          key={idx}
                          cx={zone.width / 2 - 24 + c * 16}
                          cy={startY + r * 10}
                          r="3"
                          fill={cat.color}
                        />
                      );
                    })}
                  </g>
                </g>
              );
            })}

            {/* Render Tables and Individual Seats */}
            {tables.map((table) => {
              const isTableSelected = selectedTableId === table.id;
              const isDragging = draggingTableId === table.id;
              const sRadius = (table.radius || 26) * elementsScale;
              const sWidth = (table.width || 70) * elementsScale;
              const sHeight = (table.height || 46) * elementsScale;
              const positions = computeSeatPositions(table.type, table.seatsCount, table.width, table.height, elementsScale, table.radius);

              return (
                <g key={table.id} transform={`translate(${table.x}, ${table.y})`}>
                  {/* Table Surface */}
                  <g
                    onMouseDown={(e) => handleTableMouseDown(table, e)}
                    style={{ cursor: toolMode === 'paint' ? 'cell' : isDragging ? 'grabbing' : 'grab' }}
                  >
                    {table.type === 'round' ? (
                      <circle
                        cx="0"
                        cy="0"
                        r={sRadius}
                        fill={isTableSelected ? '#dbeafe' : '#ffffff'}
                        stroke={isTableSelected ? '#2563eb' : '#94a3b8'}
                        strokeWidth={isTableSelected ? '3' : '1.5'}
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))' }}
                      />
                    ) : (
                      <rect
                        x={-sWidth / 2}
                        y={-sHeight / 2}
                        width={sWidth}
                        height={sHeight}
                        rx={8 * elementsScale}
                        fill={isTableSelected ? '#dbeafe' : '#ffffff'}
                        stroke={isTableSelected ? '#2563eb' : '#94a3b8'}
                        strokeWidth={isTableSelected ? '3' : '1.5'}
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))' }}
                      />
                    )}

                    {/* Table Label */}
                    <text
                      x="0"
                      y={-1 * elementsScale}
                      fill={isTableSelected ? '#1e40af' : '#0f172a'}
                      fontSize={Math.max(9, 11 * elementsScale)}
                      fontWeight="bold"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      {table.id}
                    </text>
                    <text
                      x="0"
                      y={10 * elementsScale}
                      fill="#64748b"
                      fontSize={Math.max(7, 8 * elementsScale)}
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      {table.seatsCount} мест
                    </text>
                  </g>

                  {/* Individual Seats around Table */}
                  {table.seats.map((seat, seatIdx) => {
                    const pos = positions[seatIdx] || { relX: 0, relY: 0 };
                    const cat = getCategory(seat.categoryId);
                    const isSeatSelected = selectedSeatId === seat.id || selectedSeatIds.has(seat.id);
                    const seatR = Math.max(7, 10 * elementsScale);

                    return (
                      <g
                        key={seat.id}
                        transform={`translate(${pos.relX}, ${pos.relY})`}
                        onClick={(e) => handleSeatClick(table, seat, e)}
                        style={{ cursor: 'pointer' }}
                      >
                        {/* Seat Circle (Chair) */}
                        <circle
                          cx="0"
                          cy="0"
                          r={seatR}
                          fill={isSeatSelected ? '#22c55e' : cat.color}
                          stroke={isSeatSelected ? '#15803d' : '#ffffff'}
                          strokeWidth={isSeatSelected ? '2.5' : '1.5'}
                          style={{
                            transition: 'all 0.1s',
                            filter: isSeatSelected ? 'drop-shadow(0 0 4px #22c55e)' : 'none'
                          }}
                        />
                        {/* Seat Number */}
                        <text
                          x="0"
                          y={3 * elementsScale}
                          fill="#ffffff"
                          fontSize={Math.max(6, 8 * elementsScale)}
                          fontWeight="bold"
                          textAnchor="middle"
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

            {/* Selection Box / Marquee Rectangle during Zone Select */}
            {isSelectingZone && selectionBox && (
              <rect
                x={Math.min(selectionBox.startX, selectionBox.currentX)}
                y={Math.min(selectionBox.startY, selectionBox.currentY)}
                width={Math.abs(selectionBox.currentX - selectionBox.startX)}
                height={Math.abs(selectionBox.currentY - selectionBox.startY)}
                fill="rgba(59, 130, 246, 0.15)"
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                pointerEvents="none"
              />
            )}
          </svg>
        </div>

        {/* Action Toolbar Below Canvas */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => addTable('round')}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
          >
            <Plus size={15} /> Круглый стол (4 места)
          </button>
          <button
            onClick={() => addTable('rect')}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
          >
            <Plus size={15} /> Прямоугольный стол (6 мест)
          </button>

          <button
            onClick={addZone}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              background: '#f3e8ff',
              color: '#7e22ce',
              border: '1px solid #d8b4fe',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            <Grid size={15} /> + Танцпол / Входная зона
          </button>

          {selectedTable && (
            <>
              <button
                onClick={duplicateSelectedTable}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
                title="Дублировать выбранный стол"
              >
                <Copy size={15} /> Дублировать {selectedTable.id}
              </button>
              <button
                onClick={removeSelectedTable}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  background: '#fee2e2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                <Trash2 size={15} /> Удалить {selectedTable.id}
              </button>
            </>
          )}

          {selectedZone && (
            <button
              onClick={removeSelectedZone}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                background: '#fee2e2',
                color: '#dc2626',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              <Trash2 size={15} /> Удалить {selectedZone.label || selectedZone.id}
            </button>
          )}

          {bgImage && (
            <button
              onClick={() => setBgImage(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                background: '#f1f5f9',
                color: '#64748b',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                marginLeft: 'auto'
              }}
            >
              Сбросить подложку
            </button>
          )}
        </div>
      </div>

      {/* Right Sidebar: Categories & Property Inspector */}
      <div className="glass" style={{ flex: '1 1 300px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Categories Manager Header */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
              <Palette size={18} color="var(--color-primary)" />
              Категории мест и цены
            </h4>
            <button
              onClick={() => setIsAddingCategory(!isAddingCategory)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              {isAddingCategory ? 'Отмена' : '+ Добавить'}
            </button>
          </div>

          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Цвета категорий отображаются на стульях/зонах и определяют цену билета
          </span>

          {/* Form to add category */}
          {isAddingCategory && (
            <form onSubmit={handleAddCategory} style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
              <div style={{ marginBottom: '8px' }}>
                <label className="form-label" style={{ fontSize: '11px' }}>Название категории</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Например, Танцпол / Входной"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  style={{ width: '100%', fontSize: '12px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: '11px' }}>Цена билета (₽)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newCatPrice}
                    onChange={(e) => setNewCatPrice(e.target.value)}
                    style={{ width: '100%', fontSize: '12px' }}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: '11px' }}>Цвет</label>
                  <input
                    type="color"
                    className="form-input"
                    value={newCatColor}
                    onChange={(e) => setNewCatColor(e.target.value)}
                    style={{ width: '100%', height: '36px', padding: '2px', cursor: 'pointer' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '6px', fontSize: '12px' }}>
                Создать категорию
              </button>
            </form>
          )}

          {/* Categories List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
            {categories.map((cat) => {
              const isActive = activeCategoryId === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: `1.5px solid ${isActive ? cat.color : '#e2e8f0'}`,
                    background: isActive ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: cat.color }} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{cat.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{cat.price} ₽ / место</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {categories.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(cat.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: '2px'
                        }}
                        title="Удалить категорию"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <hr style={{ borderColor: '#e2e8f0', margin: 0 }} />

        {/* Selected Element Properties */}
        <div>
          <h4 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
            <Layers size={18} color="var(--color-primary)" />
            Свойства выбранного элемента
          </h4>

          {selectedZone ? (
            /* Zone Selected */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#f3e8ff', padding: '10px', borderRadius: '8px', border: '1px solid #d8b4fe' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#6b21a8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Grid size={15} /> Зона входных билетов: {selectedZone.id}
                </div>
                <div style={{ fontSize: '11px', color: '#7e22ce' }}>Сетка свободной рассадки / Танцпол</div>
              </div>

              <div>
                <label className="form-label">Название зоны</label>
                <input
                  type="text"
                  className="form-input"
                  value={selectedZone.label || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setZones(zones.map((z) => (z.id === selectedZone.id ? { ...z, label: val } : z)));
                  }}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label className="form-label">Количество входных билетов (квота)</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  className="form-input"
                  value={selectedZone.capacity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 1;
                    setZones(zones.map((z) => (z.id === selectedZone.id ? { ...z, capacity: val } : z)));
                  }}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label className="form-label">Категория билетов в зоне</label>
                <select
                  className="form-input"
                  value={selectedZone.categoryId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setZones(zones.map((z) => (z.id === selectedZone.id ? { ...z, categoryId: val } : z)));
                  }}
                  style={{ width: '100%' }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.price} ₽)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="form-label">Ширина (px)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={selectedZone.width}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 50;
                      setZones(zones.map((z) => (z.id === selectedZone.id ? { ...z, width: val } : z)));
                    }}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label className="form-label">Высота (px)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={selectedZone.height}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 50;
                      setZones(zones.map((z) => (z.id === selectedZone.id ? { ...z, height: val } : z)));
                    }}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>
          ) : selectedSeat ? (
            /* Single Seat Selected */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a' }}>
                  Выбрано: Место {selectedSeat.seatNumber} ({selectedTable?.label || selectedTable?.id})
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>ID места: {selectedSeat.id}</div>
              </div>

              <div>
                <label className="form-label">Категория места</label>
                <select
                  className="form-input"
                  value={selectedSeat.categoryId}
                  onChange={(e) => paintSeat(selectedTable.id, selectedSeat.id, e.target.value)}
                  style={{ width: '100%' }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.price} ₽)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : selectedTable ? (
            /* Table Selected */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="form-label">Название / ID стола</label>
                <input
                  type="text"
                  className="form-input"
                  value={selectedTable.label || selectedTable.id}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTables(tables.map((t) => (t.id === selectedTable.id ? { ...t, label: val } : t)));
                  }}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label className="form-label">Количество мест за столом</label>
                <input
                  type="number"
                  min="1"
                  max="16"
                  className="form-input"
                  value={selectedTable.seatsCount}
                  onChange={(e) => setTableSeatsCount(selectedTable.id, e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label className="form-label">Присвоить категорию всему столу</label>
                <select
                  className="form-input"
                  value={selectedTable.categoryId}
                  onChange={(e) => paintTable(selectedTable.id, e.target.value)}
                  style={{ width: '100%' }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.price} ₽)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">X (px)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={selectedTable.x}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 0;
                      setTables(tables.map((t) => (t.id === selectedTable.id ? { ...t, x: val } : t)));
                    }}
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Y (px)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={selectedTable.y}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 0;
                      setTables(tables.map((t) => (t.id === selectedTable.id ? { ...t, y: val } : t)));
                    }}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', padding: '16px 0' }}>
              Кликните на стол, зону танцпола или отдельное место для настройки
            </div>
          )}
        </div>

        <hr style={{ borderColor: '#e2e8f0', margin: 0 }} />

        {/* General Deck Settings */}
        <div>
          <label className="form-label">Название палубы / схемы</label>
          <input
            type="text"
            className="form-input"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            style={{ width: '100%' }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '12px', fontSize: '12px', color: '#64748b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Столов: <strong>{tables.length}</strong></span>
              <span>Мест за столами: <strong>{totalTableSeats}</strong></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Зон танцпола/входных: <strong>{zones.length}</strong></span>
              <span>Входных билетов: <strong>{totalZoneTickets}</strong></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '4px', fontWeight: 'bold', color: '#0f172a' }}>
              <span>Общая вместимость:</span>
              <span>{totalCapacity} чел.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

