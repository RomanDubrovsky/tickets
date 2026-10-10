import React, { useState, useMemo, useEffect } from 'react';
import { 
  Ship, Calendar, Clock, Users, DollarSign, Search, Filter, 
  ChevronLeft, ChevronRight, Layers, LayoutGrid, Tag, Eye, CheckCircle2, 
  Phone, Mail, Ticket, AlertCircle, RefreshCw, BarChart2, Info, X, Music
} from 'lucide-react';
import voyagesData from '../data/ship_voyages_data.json';
import HallRenderer from './HallRenderer';
import RockHitNevaVesselScheme from './RockHitNevaVesselScheme';
import { SHIP_BLUEPRINTS, PRESET_SHIP_DECKS } from '../data/ship_blueprints';

// Color and label mappings for sales channels (Refined Dusty Blue / Muted Maritime Palette)
export const CHANNEL_CONFIG = {
  'с': { 
    id: 'site', 
    name: 'Сайт (Онлайн)', 
    short: 'Сайт', 
    color: '#3b82f6', // Slate blue
    textColor: '#ffffff',
    bgLight: '#eff6ff',
    borderColor: '#93c5fd'
  },
  'к': { 
    id: 'kassir', 
    name: 'Кассир.ру', 
    short: 'Кассир', 
    color: '#6366f1', // Dusty indigo
    textColor: '#ffffff',
    bgLight: '#eef2ff',
    borderColor: '#a5b4fc'
  },
  'б': { 
    id: 'bileter', 
    name: 'Билетёр (ДТЗК)', 
    short: 'Билетёр', 
    color: '#0284c7', // Steel blue
    textColor: '#ffffff',
    bgLight: '#f0f9ff',
    borderColor: '#7dd3fc'
  },
  'биг': { 
    id: 'biglion', 
    name: 'Биглион (Купоны)', 
    short: 'Биглион', 
    color: '#8b5cf6', // Muted violet
    textColor: '#ffffff',
    bgLight: '#f5f3ff',
    borderColor: '#c4b5fd'
  },
  'куп': { 
    id: 'coupon', 
    name: 'Купоны / Партнеры', 
    short: 'Купон', 
    color: '#7c3aed', // Dusty purple
    textColor: '#ffffff',
    bgLight: '#faf5ff',
    borderColor: '#d8b4fe'
  },
  'п': { 
    id: 'prichal', 
    name: 'Причал (Касса)', 
    short: 'Причал', 
    color: '#0d9488', // Dusty marine cyan / teal
    textColor: '#ffffff',
    bgLight: '#f0fdfa',
    borderColor: '#99f6e4'
  },
  'соф': { 
    id: 'sofit', 
    name: 'Софит', 
    short: 'Софит', 
    color: '#475569', // Muted slate
    textColor: '#ffffff',
    bgLight: '#f1f5f9',
    borderColor: '#cbd5e1'
  },
  'тб': { 
    id: 'ticketbest', 
    name: 'Тикет Бест', 
    short: 'Тикет Бест', 
    color: '#2563eb', // Royal maritime blue
    textColor: '#ffffff',
    bgLight: '#eff6ff',
    borderColor: '#93c5fd'
  },
  'г': { 
    id: 'hotel', 
    name: 'Гостиница / Отель', 
    short: 'Отель', 
    color: '#d97706', // Warm amber / brass
    textColor: '#ffffff',
    bgLight: '#fffbeb',
    borderColor: '#fde68a'
  },
  'выг': { 
    id: 'vygoda', 
    name: 'Выгода (Купонатор)', 
    short: 'Выгода', 
    color: '#ea580c', // Muted terracotta
    textColor: '#ffffff',
    bgLight: '#fff7ed',
    borderColor: '#fed7aa'
  }
};

// Layout structure of ship салона
export const DECK_GRID = {
  columns: ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'],
  rows: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  labels: {
    'F12': { text: 'СЦЕНА', type: 'stage', spanCols: 3, spanRows: 2 },
    'J22': { text: 'БАР', type: 'bar', spanCols: 3, spanRows: 2 },
    // VIP Lounges
    'B4': { text: 'VIP 1', type: 'vip_label', category: 'I' },
    'D4': { text: 'VIP 2', type: 'vip_label', category: 'I' },
    'B9': { text: 'VIP 3', type: 'vip_label', category: 'I' },
    'D9': { text: 'VIP 4', type: 'vip_label', category: 'I' },
    'B14': { text: 'VIP 5', type: 'vip_label', category: 'I' },
    'D14': { text: 'VIP 6', type: 'vip_label', category: 'I' },
    // Standard tables
    'G4': { text: 'Стол 1', type: 'table_label', category: 'II' },
    'K5': { text: 'Стол 2', type: 'table_label', category: 'II' },
    'G7': { text: 'Стол 3', type: 'table_label', category: 'II' },
    'K8': { text: 'Стол 4', type: 'table_label', category: 'II' },
    'K11': { text: 'Стол 6', type: 'table_label', category: 'II' },
    'G15': { text: 'Стол 5', type: 'table_label', category: 'II' },
    'K14': { text: 'Стол 8', type: 'table_label', category: 'II' },
    'G18': { text: 'Стол 7', type: 'table_label', category: 'II' },
    'K17': { text: 'Стол 10', type: 'table_label', category: 'II' },
    'G21': { text: 'Стол 9', type: 'table_label', category: 'II' },
    // Special zones
    'O4': { text: 'Купоны', type: 'zone_label', category: 'III' },
    'O14': { text: 'Зона IV (Дисконт)', type: 'zone_label', category: 'IV' }
  }
};

// Time formatting helper for Excel decimal days, "11,59", "2100.0", etc.
export function formatVoyageTime(rawTime) {
  if (!rawTime) return '';
  const str = String(rawTime).trim();
  if (str === '2100.0' || str === '2100') return '21:00';
  if (str === '11,59' || str === '11.59.' || str === '11.59') return '11:59';
  if (str === '23.59' || str === '23.59.') return '23:59';
  const num = Number(str);
  if (!isNaN(num) && num > 0 && num < 1) {
    const totalMinutes = Math.round(num * 24 * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }
  return str.replace('.', ':');
}

// Date formatting helper
export function formatVoyageDate(rawDate, sheetName) {
  const d = String(rawDate || '').trim();
  const s = String(sheetName || '').trim();
  if (d === 'Дата' || !d) {
    if (s && s !== 'Дата') return `Рейс ${s}`;
    return 'Рейс';
  }
  let res = d;
  res = res.replace(/сент[.\s]*/gi, ' сентября ')
           .replace(/окт[.\s]*/gi, ' октября ')
           .replace(/нояб[.\s]*(ря)?/gi, ' ноября ');
  if (res.endsWith('.')) res = res.slice(0, -1);
  return res.trim();
}

export default function ShipOccupancyMonitor() {
  const [selectedVoyageId, setSelectedVoyageId] = useState(voyagesData[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgramFilter, setSelectedProgramFilter] = useState('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [activeViewTab, setActiveViewTab] = useState('deck'); // 'deck' | 'guests' | 'analytics'
  const [deckViewMode, setDeckViewMode] = useState('ship'); // 'ship' (architectural scheme) | 'grid' (excel chess)
  const [selectedBlueprintId, setSelectedBlueprintId] = useState('auto'); // ship scheme selector

  // Current voyage
  const currentVoyage = useMemo(() => {
    return voyagesData.find(v => v.id === selectedVoyageId) || voyagesData[0];
  }, [selectedVoyageId]);

  // Auto-detect ship scheme based on voyage program or venue
  const activeBlueprint = useMemo(() => {
    if (selectedBlueprintId && selectedBlueprintId !== 'auto') {
      return selectedBlueprintId;
    }
    const prog = (currentVoyage?.program || '').toLowerCase();
    if (prog.includes('солярис')) return 'bp_solaris';
    if (prog.includes('201') || prog.includes('москва 201')) return 'bp_m201';
    if (prog.includes('125') || prog.includes('москва 125')) return 'bp_m125_classic';
    if (prog.includes('танц')) return 'bp_m177_dance';
    return 'bp_rock_hit_neva';
  }, [selectedBlueprintId, currentVoyage]);

  // Index navigation
  const currentIndex = useMemo(() => {
    return voyagesData.findIndex(v => v.id === selectedVoyageId);
  }, [selectedVoyageId]);

  const handlePrevVoyage = () => {
    if (currentIndex > 0) {
      setSelectedVoyageId(voyagesData[currentIndex - 1].id);
      setSelectedSeat(null);
    }
  };

  const handleNextVoyage = () => {
    if (currentIndex < voyagesData.length - 1) {
      setSelectedVoyageId(voyagesData[currentIndex + 1].id);
      setSelectedSeat(null);
    }
  };

  // Map seats to deck_cells & sales channels dynamically for selected ship scheme
  const { seatColorMap, blueprintHallData, activeShipInfo } = useMemo(() => {
    const isRockHitNevaScheme = activeBlueprint === 'bp_rock_hit_neva';
    const rawDeck = PRESET_SHIP_DECKS[activeBlueprint] || PRESET_SHIP_DECKS.bp_m177 || {};
    const deckCells = currentVoyage?.deck_cells || {};
    const colorMap = {};

    const cellEntries = Object.entries(deckCells);
    const validOccupiedCells = [];
    cellEntries.forEach(([cellRef, val]) => {
      if (!val) return;
      const norm = String(val).toLowerCase().trim();
      if (!['сцена', 'бар', 'v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'купоны', 'дисконт', 'входные', 'билеты', 'iv'].includes(norm) &&
          !DECK_GRID.labels[cellRef] &&
          !(val.replace('.0', '').match(/^\d+$/) && Number(val) <= 20)) {
        validOccupiedCells.push({ cellRef, val, norm });
      }
    });

    if (isRockHitNevaScheme) {
      // Populate seats 1 to 70 for Rock Hit Neva 2-deck vector scheme
      for (let seatNum = 1; seatNum <= 70; seatNum++) {
        if (seatNum <= validOccupiedCells.length) {
          const item = validOccupiedCells[seatNum - 1];
          const cfg = CHANNEL_CONFIG[item.norm];
          const isMatched = channelFilter === 'all' || item.norm === channelFilter;
          const color = isMatched ? (cfg?.color || '#3b82f6') : '#cbd5e1';
          colorMap[seatNum] = color;
          colorMap[String(seatNum)] = color;
        }
      }
    } else {
      // Generic preset mapping for other ships (Москва-125, Москва-201, Солярис, МТС Холл)
      const allTables = rawDeck.tables || [];
      let seatCounter = 0;
      allTables.forEach(t => {
        const count = t.seatsCount || 4;
        for (let i = 1; i <= count; i++) {
          const seatId = `${t.id}-${i}`;
          if (seatCounter < validOccupiedCells.length) {
            const item = validOccupiedCells[seatCounter];
            const cfg = CHANNEL_CONFIG[item.norm];
            const isMatched = channelFilter === 'all' || item.norm === channelFilter;
            const color = isMatched ? (cfg?.color || '#3b82f6') : '#cbd5e1';
            colorMap[seatId] = color;
          }
          seatCounter++;
        }
      });
    }

    const occupiedSeatKeys = Object.keys(colorMap);

    const hall = {
      ...rawDeck,
      id: `${activeBlueprint}_live`,
      name: currentVoyage?.ship_name || rawDeck.name || 'Теплоход',
      width: rawDeck.width || 1200,
      height: rawDeck.height || 600,
      occupiedSeats: occupiedSeatKeys
    };

    const bpMeta = SHIP_BLUEPRINTS.find(b => b.id === activeBlueprint) || {
      id: 'bp_rock_hit_neva',
      shipName: '«Рок Хит Нева» (Двухпалубный флагман — 70 мест)',
      shipModel: 'Рок Хит Нева'
    };

    return { 
      seatColorMap: colorMap, 
      blueprintHallData: hall, 
      validOccupiedCells,
      activeShipInfo: bpMeta
    };
  }, [currentVoyage, channelFilter, activeBlueprint]);

  const handleBlueprintSeatClick = (seat, tableOrExtra) => {
    if (!currentVoyage) return;
    const seatNum = typeof seat === 'number' ? seat : (seat?.seatNumber || seat?.id);
    const guests = currentVoyage.guests || [];
    const guest = guests.find(g => 
      g.comments?.includes(String(seatNum)) || 
      g.table?.includes(String(seatNum))
    ) || guests[seatNum % (guests.length || 1)] || {
      name: `Пассажир (Место №${seatNum})`,
      phone: '+7 (921) 900-00-00',
      ticket_or_coupon: `TKT-${seatNum}-A`,
      source: 'Сайт'
    };

    const channelCode = (tableOrExtra?.channelVal || guest?.source || 'с').toLowerCase();
    const cfg = CHANNEL_CONFIG[channelCode] || CHANNEL_CONFIG['с'];

    setSelectedSeat({
      status: 'occupied',
      ref: `Место №${seatNum} (${seatNum <= 9 || seatNum >= 63 ? 'Нижняя палуба' : 'Верхняя палуба'})`,
      val: guest?.source || cfg.name,
      channel: cfg,
      guest: guest
    });
  };



  // Precomputed statistics map for each voyage (for fast dropdown rendering)
  const voyageStatsMap = useMemo(() => {
    const map = {};
    voyagesData.forEach(v => {
      const deckCells = v.deck_cells || {};
      let occupied = 0;
      Object.entries(deckCells).forEach(([ref, val]) => {
        if (!val) return;
        const norm = String(val).toLowerCase().trim();
        if (
          !DECK_GRID.labels[ref] &&
          !['сцена', 'бар', 'v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'купоны', 'дисконт', 'входные', 'билеты', 'iv'].includes(norm) &&
          !(val.replace('.0', '').match(/^\d+$/) && Number(val) <= 20)
        ) {
          occupied++;
        }
      });
      const tkt = parseInt(v.total_tickets, 10);
      const count = !isNaN(tkt) && tkt > occupied ? tkt : occupied;
      const capacity = 70;
      const percent = Math.min(100, Math.round((count / capacity) * 100));
      map[v.id] = { count, capacity, percent };
    });
    return map;
  }, []);

  // Program filters list
  const availableProgramsList = useMemo(() => {
    return [
      { value: 'all', label: 'Все программы' },
      { value: 'ритм', label: '🎵 Ритм / Рок-хиты' },
      { value: 'мост', label: '🌉 Разводные мосты' },
      { value: 'зеппелин', label: '🎸 Led Zeppelin (Трибьют)' },
      { value: 'брит', label: '🇬🇧 Британское вторжение' },
      { value: 'ночь', label: '🌙 Ночные рейсы' },
      { value: 'программа', label: '🚢 Стандартная программа' },
      { value: 'отмен', label: '⚠️ Отмененные рейсы' }
    ];
  }, []);

  // Dates filters list
  const availableDatesList = useMemo(() => {
    const list = [
      { value: 'all', label: 'Все даты и месяцы' },
      { value: 'sep', label: '📅 Сентябрь 2026' },
      { value: 'oct', label: '📅 Октябрь 2026' },
      { value: 'nov', label: '📅 Ноябрь 2026' }
    ];
    const seen = new Set();
    voyagesData.forEach(v => {
      const d = (v.date || '').trim();
      if (!d || d === 'Дата' || seen.has(d)) return;
      seen.add(d);
      list.push({
        value: d,
        label: `День: ${formatVoyageDate(d, v.sheet_name)}`
      });
    });
    return list;
  }, []);

  // Filtered voyages by program, date, and search query
  const filteredVoyages = useMemo(() => {
    return voyagesData.filter(v => {
      // 1. Program filter
      if (selectedProgramFilter !== 'all') {
        const prog = (v.program || '').toLowerCase();
        const target = selectedProgramFilter.toLowerCase();
        if (!prog.includes(target)) {
          return false;
        }
      }

      // 2. Date / Month filter
      if (selectedDateFilter !== 'all') {
        const dStr = (v.date || '').toLowerCase();
        const sName = (v.sheet_name || '').toLowerCase();
        if (selectedDateFilter === 'sep') {
          if (!dStr.includes('сент') && !dStr.includes('.09') && !sName.includes('.09') && !sName.includes('09')) return false;
        } else if (selectedDateFilter === 'oct') {
          if (!dStr.includes('окт') && !dStr.includes('.10') && !sName.includes('.10') && !sName.includes('10')) return false;
        } else if (selectedDateFilter === 'nov') {
          if (!dStr.includes('нояб') && !dStr.includes('.11') && !sName.includes('.11') && !sName.includes('11')) return false;
        } else {
          if (!dStr.includes(selectedDateFilter.toLowerCase()) && !sName.includes(selectedDateFilter.toLowerCase())) {
            return false;
          }
        }
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = v.id.toLowerCase().includes(q);
        const matchDate = (v.date && v.date.toLowerCase().includes(q)) || (v.sheet_name && v.sheet_name.toLowerCase().includes(q));
        const matchProg = v.program && v.program.toLowerCase().includes(q);
        const matchAdmin = v.admin && v.admin.toLowerCase().includes(q);
        const matchArtists = v.artists && v.artists.toLowerCase().includes(q);
        const matchTime = v.time && String(v.time).toLowerCase().includes(q);
        if (!matchId && !matchDate && !matchProg && !matchAdmin && !matchArtists && !matchTime) {
          return false;
        }
      }

      return true;
    });
  }, [selectedProgramFilter, selectedDateFilter, searchQuery]);

  // Keep selectedVoyageId pointing to a valid voyage in filteredVoyages
  useEffect(() => {
    if (filteredVoyages.length > 0) {
      const exists = filteredVoyages.some(v => v.id === selectedVoyageId);
      if (!exists) {
        setSelectedVoyageId(filteredVoyages[0].id);
        setSelectedSeat(null);
      }
    }
  }, [filteredVoyages, selectedVoyageId]);

  // Index navigation within filtered voyages
  const filteredCurrentIndex = useMemo(() => {
    return filteredVoyages.findIndex(v => v.id === selectedVoyageId);
  }, [filteredVoyages, selectedVoyageId]);

  const handlePrevFilteredVoyage = () => {
    if (filteredCurrentIndex > 0) {
      setSelectedVoyageId(filteredVoyages[filteredCurrentIndex - 1].id);
      setSelectedSeat(null);
    }
  };

  const handleNextFilteredVoyage = () => {
    if (filteredCurrentIndex < filteredVoyages.length - 1) {
      setSelectedVoyageId(filteredVoyages[filteredCurrentIndex + 1].id);
      setSelectedSeat(null);
    }
  };

  const formatVoyageLabel = (v) => {
    const d = formatVoyageDate(v.date, v.sheet_name);
    const t = formatVoyageTime(v.time);
    const p = v.program || 'Программа';
    const st = voyageStatsMap[v.id] || { count: 0, capacity: 70, percent: 0 };
    const isCancel = p.toLowerCase().includes('отмен');
    const cancelBadge = isCancel ? ' [ОТМЕНЕН]' : '';
    const timePart = t ? ` (${t})` : '';
    return `${d}${timePart} — ${p}${cancelBadge} [Занято: ${st.count}/${st.capacity} • ${st.percent}%]`;
  };

  // Statistics calculation for current voyage
  const stats = useMemo(() => {
    if (!currentVoyage) return { totalOccupied: 0, byChannel: {}, totalCapacity: 80 };
    const deckCells = currentVoyage.deck_cells || {};
    const byChannel = {};
    let totalOccupied = 0;

    Object.entries(deckCells).forEach(([ref, val]) => {
      // Check if it's not a structural element or label
      if (
        !DECK_GRID.labels[ref] &&
        !['СЦЕНА', 'БАР', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'Купоны', 'Дисконт', 'Входные', 'Билеты', 'IV'].includes(val) &&
        !(val.replace('.0', '').match(/^\d+$/) && Number(val) <= 20)
      ) {
        totalOccupied++;
        const normKey = val.toLowerCase();
        byChannel[normKey] = (byChannel[normKey] || 0) + 1;
      }
    });

    return {
      totalOccupied,
      byChannel,
      totalCapacity: 80,
      occupancyPercent: Math.min(100, Math.round((totalOccupied / 80) * 100))
    };
  }, [currentVoyage]);

  // Check seat status helper
  const getSeatInfo = (ref) => {
    if (!currentVoyage) return null;
    const val = currentVoyage.deck_cells[ref];
    if (!val) {
      return { status: 'free', ref, text: 'Свободно' };
    }

    if (DECK_GRID.labels[ref]) {
      return { status: 'label', ref, labelInfo: DECK_GRID.labels[ref] };
    }

    // It is an occupied seat
    const norm = val.toLowerCase();
    const channel = CHANNEL_CONFIG[norm] || {
      name: `Источник: ${val}`,
      short: val,
      color: '#64748b',
      textColor: '#ffffff',
      bgLight: 'rgba(100, 116, 139, 0.15)',
      borderColor: '#475569'
    };

    return {
      status: 'occupied',
      ref,
      val,
      channel,
      guest: currentVoyage.guests?.find(g => g.comments?.includes(ref) || g.ticket_or_coupon?.includes(ref))
    };
  };

  return (
    <div className="occupancy-monitor" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* HEADER: Title, View Tabs & Unified Voyage Selector */}
      <div className="glass" style={{ padding: '20px', borderRadius: '16px' }}>
        {/* ROW 1: Title and View Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#3b82f6', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ship size={24} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#0f172a' }}>
                Монитор Заполненности Рейсов Теплохода
              </h2>
              <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '13px' }}>
                Онлайн-шахматка палубы и сквозная синхронизация со всеми билетными источниками (ship.xlsx)
              </p>
            </div>
          </div>

          {/* View Tab Buttons */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveViewTab('deck')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                background: activeViewTab === 'deck' ? '#2563eb' : '#e2e8f0',
                color: activeViewTab === 'deck' ? '#ffffff' : '#475569',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <Layers size={15} /> Схема корабля
            </button>
            <button
              onClick={() => setActiveViewTab('guests')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                background: activeViewTab === 'guests' ? '#2563eb' : '#e2e8f0',
                color: activeViewTab === 'guests' ? '#ffffff' : '#475569',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <Users size={15} /> Список пассажиров ({currentVoyage?.guests?.length || 0})
            </button>
            <button
              onClick={() => setActiveViewTab('analytics')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                background: activeViewTab === 'analytics' ? '#2563eb' : '#e2e8f0',
                color: activeViewTab === 'analytics' ? '#ffffff' : '#475569',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <BarChart2 size={15} /> Каналы продаж
            </button>
          </div>
        </div>

        {/* ROW 2: UNIFIED VOYAGE CONTROLS (SEARCH, FILTERS, SELECTOR & STEPPER) */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          {/* Program filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Music size={14} color="#64748b" />
            <select
              value={selectedProgramFilter}
              onChange={(e) => setSelectedProgramFilter(e.target.value)}
              style={{
                padding: '7px 10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: selectedProgramFilter !== 'all' ? '#eff6ff' : '#ffffff',
                color: selectedProgramFilter !== 'all' ? '#1d4ed8' : '#334155',
                fontWeight: selectedProgramFilter !== 'all' ? '600' : 'normal',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              {availableProgramsList.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Date filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color="#64748b" />
            <select
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              style={{
                padding: '7px 10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: selectedDateFilter !== 'all' ? '#eff6ff' : '#ffffff',
                color: selectedDateFilter !== 'all' ? '#1d4ed8' : '#334155',
                fontWeight: selectedDateFilter !== 'all' ? '600' : 'normal',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              {availableDatesList.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>

          {/* Search box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 180px', minWidth: '180px', position: 'relative' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px' }} />
            <input
              type="text"
              placeholder="Поиск по программе, дате, артистам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '7px 28px 7px 32px',
                fontSize: '13px',
                width: '100%',
                background: '#ffffff'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: 0
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Reset button if any filter is active */}
          {(selectedProgramFilter !== 'all' || selectedDateFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedProgramFilter('all');
                setSelectedDateFilter('all');
                setSearchQuery('');
              }}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                background: '#e2e8f0',
                border: '1px solid #cbd5e1',
                color: '#475569',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RefreshCw size={12} /> Сброс
            </button>
          )}

          {/* Voyage Dropdown */}
          <div style={{ flex: '2 1 300px', minWidth: '240px' }}>
            <select
              value={selectedVoyageId}
              onChange={(e) => {
                setSelectedVoyageId(e.target.value);
                setSelectedSeat(null);
              }}
              style={{
                width: '100%',
                padding: '7px 12px',
                borderRadius: '8px',
                border: '2px solid #3b82f6',
                background: '#ffffff',
                fontSize: '13px',
                fontWeight: '600',
                color: '#1e293b',
                cursor: 'pointer'
              }}
            >
              {filteredVoyages.length === 0 ? (
                <option value="">Рейсы не найдены по фильтрам</option>
              ) : (
                filteredVoyages.map(v => (
                  <option key={v.id} value={v.id}>
                    {formatVoyageLabel(v)}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Stepper buttons right next to voyage dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <button
              onClick={handlePrevFilteredVoyage}
              disabled={filteredCurrentIndex <= 0}
              title="Предыдущий рейс"
              style={{
                padding: '7px 10px',
                borderRadius: '8px 0 0 8px',
                border: '1px solid #cbd5e1',
                background: filteredCurrentIndex <= 0 ? '#f1f5f9' : '#ffffff',
                color: filteredCurrentIndex <= 0 ? '#cbd5e1' : '#1e293b',
                cursor: filteredCurrentIndex <= 0 ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ padding: '0 8px', fontSize: '12px', fontWeight: 'bold', color: '#475569', whiteSpace: 'nowrap', borderTop: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', height: '32px', display: 'flex', alignItems: 'center', background: '#f8fafc' }}>
              {filteredVoyages.length > 0 ? `${filteredCurrentIndex + 1} / ${filteredVoyages.length}` : '0 / 0'}
            </span>
            <button
              onClick={handleNextFilteredVoyage}
              disabled={filteredCurrentIndex >= filteredVoyages.length - 1}
              title="Следующий рейс"
              style={{
                padding: '7px 10px',
                borderRadius: '0 8px 8px 0',
                border: '1px solid #cbd5e1',
                background: filteredCurrentIndex >= filteredVoyages.length - 1 ? '#f1f5f9' : '#ffffff',
                color: filteredCurrentIndex >= filteredVoyages.length - 1 ? '#cbd5e1' : '#1e293b',
                cursor: filteredCurrentIndex >= filteredVoyages.length - 1 ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* CURRENT VOYAGE INFO BANNER */}
        {currentVoyage && (
          <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Программа и артисты</div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', marginTop: '2px' }}>{currentVoyage.program || 'Регулярный рейс'}</div>
              <div style={{ fontSize: '12px', color: '#3b82f6', marginTop: '2px' }}>{currentVoyage.artists || 'Живая музыка'}</div>
            </div>

            <div style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Дата и время отправления</div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', marginTop: '2px' }}>
                {formatVoyageDate(currentVoyage.date, currentVoyage.sheet_name)}
              </div>
              <div style={{ fontSize: '12px', color: '#10b981', marginTop: '2px', fontWeight: '600' }}>
                Отправление: {formatVoyageTime(currentVoyage.time) || '23:59'}
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Заполненность борта</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb' }}>{stats.totalOccupied}</span>
                <span style={{ fontSize: '13px', color: '#64748b' }}>/ {stats.totalCapacity} мест ({stats.occupancyPercent}%)</span>
              </div>
              <div style={{ width: '100%', background: '#e2e8f0', height: '6px', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${stats.occupancyPercent}%`, background: stats.occupancyPercent > 80 ? '#ef4444' : '#10b981', height: '100%' }}></div>
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Администратор и статус</div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', marginTop: '2px' }}>{currentVoyage.admin || 'Дежурный администратор'}</div>
              <div style={{ fontSize: '12px', color: currentVoyage.program?.toLowerCase().includes('отмена') ? '#ef4444' : '#10b981', marginTop: '2px' }}>
                {currentVoyage.program?.toLowerCase().includes('отмена') ? '⚠️ Рейс отменен' : '✅ Рейс подтвержден'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MAIN VIEW AREA: DECK (SINGLE CLEAN COLUMN FIT-TO-SCREEN NO VERTICAL SCROLL) */}
      {activeViewTab === 'deck' && (
        <div 
          className="glass" 
          style={{ 
            padding: '16px 20px', 
            borderRadius: '16px', 
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            overflow: 'visible',
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'
          }}
        >
          {/* DECK VIEW CONTROLS: Vessel Info Badge, Mode Switcher & Channel Filter */}
          <div 
            style={{ 
              width: '100%', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '14px', 
              flexWrap: 'wrap', 
              gap: '10px' 
            }}
          >
            {/* Vessel Info Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#eff6ff', padding: '6px 14px', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '13px', color: '#1e40af', fontWeight: 'bold' }}>
              <Ship size={16} color="#2563eb" />
              <span>Теплоход «{activeShipInfo.shipName || 'Рок Хит Нева'}» ({activeShipInfo.totalSeats || 70} мест, 2 палубы)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {/* View Mode Switcher: Ship Blueprint vs Excel Grid */}
              <div style={{ display: 'inline-flex', background: '#e2e8f0', borderRadius: '8px', padding: '3px', gap: '2px' }}>
                <button
                  type="button"
                  onClick={() => setDeckViewMode('ship')}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: deckViewMode === 'ship' ? '#2563eb' : 'transparent',
                    color: deckViewMode === 'ship' ? '#ffffff' : '#475569',
                    fontSize: '12px',
                    fontWeight: deckViewMode === 'ship' ? 'bold' : 'normal',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Ship size={14} /> Схема судна
                </button>
                <button
                  type="button"
                  onClick={() => setDeckViewMode('grid')}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: deckViewMode === 'grid' ? '#2563eb' : 'transparent',
                    color: deckViewMode === 'grid' ? '#ffffff' : '#475569',
                    fontSize: '12px',
                    fontWeight: deckViewMode === 'grid' ? 'bold' : 'normal',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <LayoutGrid size={14} /> Сетка Excel
                </button>
              </div>

              {/* Filter by Channel */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter size={14} color="#64748b" />
                <select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                    background: '#ffffff',
                    color: '#334155',
                    cursor: 'pointer'
                  }}
                >
                  <option value="all">Все каналы продаж</option>
                  <option value="с">Сайт</option>
                  <option value="к">Кассир.ру</option>
                  <option value="б">Билетёр</option>
                  <option value="биг">Биглион</option>
                  <option value="п">Причал</option>
                </select>
              </div>
            </div>
          </div>

          {/* CHANNEL LEGEND BADGES (Compact Dust Blue / Pastel Line) */}
          <div 
            style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              justifyContent: 'center',
              alignItems: 'center',
              gap: '6px', 
              marginBottom: '10px', 
              padding: '6px 12px', 
              background: '#f1f5f9', 
              borderRadius: '8px', 
              border: '1px solid #e2e8f0',
              width: '100%',
              maxWidth: '820px'
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', marginRight: '4px' }}>
              Источники:
            </span>
            {Object.entries(CHANNEL_CONFIG).map(([key, cfg]) => {
              const count = stats.byChannel[key] || 0;
              if (count === 0 && key !== 'с' && key !== 'к' && key !== 'б') return null;
              const isSelected = channelFilter === key;
              return (
                <div
                  key={key}
                  onClick={() => setChannelFilter(channelFilter === key ? 'all' : key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: isSelected ? cfg.color : cfg.bgLight,
                    border: `1px solid ${isSelected ? cfg.color : cfg.borderColor}`,
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: isSelected ? '#ffffff' : cfg.borderColor,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isSelected ? '#ffffff' : cfg.color }}></span>
                  <span>{cfg.short}</span>
                  <span 
                    style={{ 
                      background: isSelected ? 'rgba(255,255,255,0.25)' : cfg.color, 
                      color: '#ffffff', 
                      borderRadius: '8px', 
                      padding: '0px 5px', 
                      fontSize: '10px' 
                    }}
                  >
                    {count}
                  </span>
                </div>
              );
            })}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px', fontSize: '11px', color: '#64748b' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e8eef5', border: '1px solid #cbd5e1' }}></span>
              <span>Свободно</span>
            </div>
          </div>

          {/* Architectural Ship Deck Scheme or Classic Excel Grid */}
          {deckViewMode === 'ship' ? (
            <div 
              style={{ 
                width: '100%', 
                maxWidth: activeBlueprint === 'bp_rock_hit_neva' ? '500px' : '960px',
                flex: '1 1 auto', 
                background: '#ffffff', 
                borderRadius: '24px', 
                border: '1px solid #cbd5e1', 
                padding: '16px', 
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                overflow: 'visible',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {activeBlueprint === 'bp_rock_hit_neva' ? (
                <RockHitNevaVesselScheme
                  seatColorMap={seatColorMap}
                  selectedSeat={selectedSeat}
                  onSeatClick={handleBlueprintSeatClick}
                  deckCells={currentVoyage?.deck_cells || {}}
                  channelFilter={channelFilter}
                />
              ) : (
                <div style={{ width: '100%', overflowX: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ marginBottom: '8px', fontSize: '13px', fontWeight: 'bold', color: '#1e3a8a' }}>
                    🚢 {activeShipInfo?.shipName}
                  </div>
                  <HallRenderer
                    hall={blueprintHallData}
                    orientation="vertical"
                    readOnly={false}
                    selectedSeat={selectedSeat}
                    onSeatClick={(seat, table) => {
                      const seatId = `${table.id}-${seat.number}`;
                      const guests = currentVoyage?.guests || [];
                      const guest = guests.find(g => g.comments?.includes(seatId) || g.table?.includes(table.label)) || {
                        name: `Пассажир (${table.label}, Место ${seat.number})`,
                        phone: '+7 (921) 900-00-00',
                        ticket_or_coupon: `TKT-${seatId}`,
                        source: 'Сайт'
                      };
                      setSelectedSeat({
                        status: 'occupied',
                        ref: `${table.label} (Место №${seat.number})`,
                        val: guest.source,
                        channel: CHANNEL_CONFIG['с'],
                        guest: guest
                      });
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
          <div 
            style={{ 
              width: '100%',
              maxWidth: '680px', 
              flex: '1 1 auto',
              background: '#fcfdfd', 
              border: '2px solid #cbd5e1', 
              borderRadius: '28px 28px 14px 14px', 
              padding: '12px 16px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box'
            }}
          >
            {/* Ship Bow Label */}
            <div style={{ textAlign: 'center', color: '#64748b', fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px', paddingBottom: '4px' }}>
              ▲ НОС СУДНА ▲
            </div>

            {/* Grid Matrix (15 cols x 21 rows) */}
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: `repeat(${DECK_GRID.columns.length}, 1fr)`, 
                gap: '3px',
                width: '100%',
                alignContent: 'center'
              }}
            >
              {DECK_GRID.rows.map(r => {
                return DECK_GRID.columns.map(c => {
                  const ref = `${c}${r}`;
                  const seatInfo = getSeatInfo(ref);

                  // 1. Stage element
                  if (ref === 'F12') {
                    return (
                      <div
                        key={ref}
                        style={{
                          gridColumn: 'span 3',
                          gridRow: 'span 2',
                          background: 'linear-gradient(135deg, #1e293b, #334155)',
                          color: '#f8fafc',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '11px',
                          letterSpacing: '1px',
                          boxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)',
                          zIndex: 2,
                          minHeight: '44px'
                        }}
                      >
                        🎸 СЦЕНА
                      </div>
                    );
                  }
                  if (['G12', 'H12', 'F13', 'G13', 'H13'].includes(ref)) {
                    return null; // Spanned by F12
                  }

                  // 2. Bar element
                  if (ref === 'J22') {
                    return (
                      <div
                        key={ref}
                        style={{
                          gridColumn: 'span 3',
                          gridRow: 'span 2',
                          background: 'linear-gradient(135deg, #0f766e, #14b8a6)',
                          color: '#ffffff',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '11px',
                          letterSpacing: '1px',
                          boxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)',
                          zIndex: 2,
                          minHeight: '44px'
                        }}
                      >
                        🍸 БАР
                      </div>
                    );
                  }
                  if (['K22', 'L22', 'J23', 'K23', 'L23'].includes(ref)) {
                    return null; // Spanned by J22
                  }

                  // 3. Static Table Label
                  if (seatInfo?.labelInfo) {
                    const lbl = seatInfo.labelInfo;
                    const isVip = lbl.type === 'vip_label';
                    return (
                      <div
                        key={ref}
                        style={{
                          background: isVip ? '#fef3c7' : '#f1f5f9',
                          border: `1px dashed ${isVip ? '#d97706' : '#cbd5e1'}`,
                          borderRadius: isVip ? '6px' : '4px',
                          color: isVip ? '#92400e' : '#475569',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          minHeight: '22px',
                          gridColumn: lbl.spanCols ? `span ${lbl.spanCols}` : 'span 1'
                        }}
                      >
                        {lbl.text}
                      </div>
                    );
                  }

                  // 4. Occupied Seat
                  if (seatInfo?.status === 'occupied') {
                    const isMatchedFilter = channelFilter === 'all' || seatInfo.val?.toLowerCase() === channelFilter;
                    const isSelected = selectedSeat?.ref === ref;

                    return (
                      <div
                        key={ref}
                        onClick={() => setSelectedSeat(seatInfo)}
                        title={`Место ${ref}: ${seatInfo.channel.name} (${seatInfo.val})`}
                        style={{
                          background: isMatchedFilter ? seatInfo.channel.color : '#e2e8f0',
                          color: seatInfo.channel.textColor,
                          border: isSelected ? '2px solid #0f172a' : `1px solid ${seatInfo.channel.borderColor}`,
                          borderRadius: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          minHeight: '22px',
                          cursor: 'pointer',
                          opacity: isMatchedFilter ? 1 : 0.25,
                          transform: isSelected ? 'scale(1.15)' : 'none',
                          transition: 'all 0.15s ease',
                          zIndex: isSelected ? 10 : 1,
                          boxShadow: isSelected ? '0 0 10px rgba(37, 99, 235, 0.6)' : 'none'
                        }}
                      >
                        {seatInfo.val}
                      </div>
                    );
                  }

                  // 5. Empty / Free cell
                  return (
                    <div
                      key={ref}
                      onClick={() => setSelectedSeat({ status: 'free', ref, text: 'Свободное место' })}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #f1f5f9',
                        borderRadius: '4px',
                        minHeight: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#cbd5e1',
                        fontSize: '9px'
                      }}
                    >
                      ·
                    </div>
                  );
                });
              })}
            </div>

            {/* Ship Stern Label */}
            <div style={{ textAlign: 'center', color: '#64748b', fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px', paddingTop: '4px' }}>
              ▼ КОРМА СУДНА ▼
            </div>
          </div>
          )}

          {/* FLOATING DETAIL DRAWER / BOTTOM SHEET WHEN SEAT IS SELECTED */}
          {selectedSeat && (
            <div 
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'calc(100% - 40px)',
                maxWidth: '620px',
                background: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #94a3b8',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.25)',
                padding: '14px 18px',
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                animation: 'fadeInUp 0.2s ease-out'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                <div 
                  style={{ 
                    padding: '8px 12px', 
                    borderRadius: '10px', 
                    background: selectedSeat.status === 'occupied' ? selectedSeat.channel?.bgLight || '#eff6ff' : '#f0fdf4',
                    border: `1px solid ${selectedSeat.status === 'occupied' ? selectedSeat.channel?.borderColor || '#93c5fd' : '#86efac'}`,
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Ячейка</div>
                  <div style={{ fontSize: '17px', fontWeight: 'bold', color: '#0f172a' }}>{selectedSeat.ref}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                  {selectedSeat.status === 'occupied' ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span 
                          style={{ 
                            fontSize: '12px', 
                            fontWeight: 'bold', 
                            background: selectedSeat.channel.bgLight, 
                            color: selectedSeat.channel.borderColor,
                            padding: '2px 8px',
                            borderRadius: '6px'
                          }}
                        >
                          {selectedSeat.channel.name}
                        </span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                          Метка: <strong>«{selectedSeat.val}»</strong>
                        </span>
                      </div>

                      {selectedSeat.guest ? (
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span>👤 {selectedSeat.guest.name || 'Пассажир'}</span>
                          {selectedSeat.guest.phone && (
                            <span style={{ color: '#2563eb', fontSize: '12px', fontWeight: 'normal' }}>
                              📞 {selectedSeat.guest.phone}
                            </span>
                          )}
                          {selectedSeat.guest.ticket_or_coupon && (
                            <span style={{ color: '#475569', fontSize: '12px', fontWeight: 'normal' }}>
                              🎟️ №{selectedSeat.guest.ticket_or_coupon}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          Синхронизировано по ведомости рейса.
                        </div>
                      )}
                    </>
                  ) : (
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#166534' }}>
                        🟢 Место свободно
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        Доступно для онлайн-продажи на сайте или через кассу причала.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedSeat(null)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#475569'
                }}
                title="Закрыть"
              >
                <X size={16} />
              </button>
            </div>
          )}

        </div>
      )}

      {/* VIEW: PASSENGERS / GUESTS LIST */}
      {activeViewTab === 'guests' && (
        <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
              Журнал регистрации билетов и купонов на рейс ({currentVoyage?.guests?.length || 0} записей)
            </h3>
          </div>

          {currentVoyage?.guests?.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', textAlign: 'left', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '10px 12px' }}>№</th>
                    <th style={{ padding: '10px 12px' }}>Пассажир / Имя</th>
                    <th style={{ padding: '10px 12px' }}>Телефон / Email</th>
                    <th style={{ padding: '10px 12px' }}>Номер билета / Купона</th>
                    <th style={{ padding: '10px 12px' }}>Пин-код</th>
                    <th style={{ padding: '10px 12px' }}>Канал / Продавец</th>
                    <th style={{ padding: '10px 12px' }}>Кол-во</th>
                    <th style={{ padding: '10px 12px' }}>Примечание</th>
                  </tr>
                </thead>
                <tbody>
                  {currentVoyage.guests.map((g, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      <td style={{ padding: '10px 12px', color: '#64748b' }}>{idx + 1}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 'bold', color: '#0f172a' }}>{g.name || '—'}</td>
                      <td style={{ padding: '10px 12px', color: '#334155' }}>{g.phone || '—'}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: '#2563eb' }}>{g.ticket_or_coupon || '—'}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{g.pin || '—'}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ background: '#eff6ff', color: '#1e40af', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                          {g.seller}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', fontWeight: 'bold' }}>{g.qty || 1}</td>
                      <td style={{ padding: '10px 12px', color: '#64748b' }}>{g.comments || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              Нет отдельных записей ручной регистрации на этот рейс (продажи велись по агрегированным ведомостям).
            </div>
          )}
        </div>
      )}

      {/* VIEW: ANALYTICS & SOURCES */}
      {activeViewTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Summary Mini Cards */}
          <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tag size={18} color="#2563eb" />
              Сводка по агентам и билетным каналам рейса
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {Object.entries(currentVoyage?.source_breakdown || {}).map(([srcName, data]) => {
                if (srcName === '∑' || Number(data.total) <= 0) return null;
                return (
                  <div 
                    key={srcName}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                  >
                    <span style={{ fontWeight: '600', color: '#334155', fontSize: '14px' }}>{srcName}</span>
                    <span style={{ fontWeight: 'bold', color: '#1e40af', background: '#eff6ff', padding: '4px 10px', borderRadius: '12px', fontSize: '13px' }}>
                      {data.total} бил.
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold' }}>
              Детальная раскладка продаж по источникам и категориям мест
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', textAlign: 'left', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '10px 12px' }}>Источник</th>
                    <th style={{ padding: '10px 12px' }}>Кат. I (VIP)</th>
                    <th style={{ padding: '10px 12px' }}>Кат. II (Столы)</th>
                    <th style={{ padding: '10px 12px' }}>Кат. III (Купоны)</th>
                    <th style={{ padding: '10px 12px' }}>Кат. IV (Дисконт)</th>
                    <th style={{ padding: '10px 12px' }}>Кат. V (Входные)</th>
                    <th style={{ padding: '10px 12px' }}>Всего билетов</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(currentVoyage?.source_breakdown || {}).map(([src, d], i) => (
                    <tr 
                      key={src} 
                      style={{ 
                        borderBottom: '1px solid #e2e8f0', 
                        background: src === '∑' ? '#eff6ff' : (i % 2 === 0 ? '#ffffff' : '#f8fafc'),
                        fontWeight: src === '∑' ? 'bold' : 'normal'
                      }}
                    >
                      <td style={{ padding: '10px 12px', color: src === '∑' ? '#1e40af' : '#0f172a' }}>{src}</td>
                      <td style={{ padding: '10px 12px' }}>{d.cat_I}</td>
                      <td style={{ padding: '10px 12px' }}>{d.cat_II}</td>
                      <td style={{ padding: '10px 12px' }}>{d.cat_III}</td>
                      <td style={{ padding: '10px 12px' }}>{d.cat_IV}</td>
                      <td style={{ padding: '10px 12px' }}>{d.cat_V}</td>
                      <td style={{ padding: '10px 12px', color: '#2563eb', fontWeight: 'bold' }}>{d.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
