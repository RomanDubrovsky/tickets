import React, { useState, useMemo } from 'react';
import { 
  Ship, Calendar, Clock, Users, DollarSign, Search, Filter, 
  ChevronLeft, ChevronRight, Layers, Tag, Eye, CheckCircle2, 
  Phone, Mail, Ticket, AlertCircle, RefreshCw, BarChart2, Info
} from 'lucide-react';
import voyagesData from '../data/ship_voyages_data.json';

// Color and label mappings for sales channels
export const CHANNEL_CONFIG = {
  'с': { 
    id: 'site', 
    name: 'Сайт (Онлайн)', 
    short: 'Сайт', 
    color: '#10b981', // Emerald green
    textColor: '#ffffff',
    bgLight: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#059669'
  },
  'к': { 
    id: 'kassir', 
    name: 'Кассир.ру', 
    short: 'Кассир', 
    color: '#3b82f6', // Bright blue
    textColor: '#ffffff',
    bgLight: 'rgba(59, 130, 246, 0.15)',
    borderColor: '#2563eb'
  },
  'б': { 
    id: 'bileter', 
    name: 'Билетёр (ДТЗК)', 
    short: 'Билетёр', 
    color: '#f59e0b', // Amber / Orange
    textColor: '#ffffff',
    bgLight: 'rgba(245, 158, 11, 0.15)',
    borderColor: '#d97706'
  },
  'биг': { 
    id: 'biglion', 
    name: 'Биглион (Купоны)', 
    short: 'Биглион', 
    color: '#8b5cf6', // Violet
    textColor: '#ffffff',
    bgLight: 'rgba(139, 92, 246, 0.15)',
    borderColor: '#7c3aed'
  },
  'куп': { 
    id: 'coupon', 
    name: 'Купоны / Партнеры', 
    short: 'Купон', 
    color: '#a855f7', // Purple
    textColor: '#ffffff',
    bgLight: 'rgba(168, 85, 247, 0.15)',
    borderColor: '#9333ea'
  },
  'п': { 
    id: 'prichal', 
    name: 'Причал (Касса)', 
    short: 'Причал', 
    color: '#06b6d4', // Cyan
    textColor: '#ffffff',
    bgLight: 'rgba(6, 182, 212, 0.15)',
    borderColor: '#0891b2'
  },
  'соф': { 
    id: 'sofit', 
    name: 'Софит', 
    short: 'Софит', 
    color: '#ec4899', // Pink
    textColor: '#ffffff',
    bgLight: 'rgba(236, 72, 153, 0.15)',
    borderColor: '#db2777'
  },
  'тб': { 
    id: 'ticketbest', 
    name: 'Тикет Бест', 
    short: 'Тикет Бест', 
    color: '#14b8a6', // Teal
    textColor: '#ffffff',
    bgLight: 'rgba(20, 184, 166, 0.15)',
    borderColor: '#0d9488'
  },
  'г': { 
    id: 'hotel', 
    name: 'Гостиница / Отель', 
    short: 'Отель', 
    color: '#eab308', // Yellow
    textColor: '#ffffff',
    bgLight: 'rgba(234, 179, 8, 0.15)',
    borderColor: '#ca8a04'
  },
  'выг': { 
    id: 'vygoda', 
    name: 'Выгода (Купонатор)', 
    short: 'Выгода', 
    color: '#f97316', 
    textColor: '#ffffff',
    bgLight: 'rgba(249, 115, 22, 0.15)',
    borderColor: '#ea580c'
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

export default function ShipOccupancyMonitor() {
  const [selectedVoyageId, setSelectedVoyageId] = useState(voyagesData[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [activeViewTab, setActiveViewTab] = useState('deck'); // 'deck' | 'guests' | 'analytics'

  // Current voyage
  const currentVoyage = useMemo(() => {
    return voyagesData.find(v => v.id === selectedVoyageId) || voyagesData[0];
  }, [selectedVoyageId]);

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

  // Filtered voyages for dropdown search
  const filteredVoyages = useMemo(() => {
    if (!searchQuery.trim()) return voyagesData;
    const q = searchQuery.toLowerCase();
    return voyagesData.filter(v => 
      v.id.toLowerCase().includes(q) ||
      (v.date && v.date.toLowerCase().includes(q)) ||
      (v.program && v.program.toLowerCase().includes(q)) ||
      (v.admin && v.admin.toLowerCase().includes(q))
    );
  }, [searchQuery]);

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
      
      {/* HEADER: Title & Voyage Selector */}
      <div className="glass" style={{ padding: '20px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
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
          </div>

          {/* Quick Voyage Stepper */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handlePrevVoyage}
              disabled={currentIndex <= 0}
              className="btn-glass"
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: currentIndex <= 0 ? '#f1f5f9' : '#ffffff',
                border: '1px solid #cbd5e1',
                cursor: currentIndex <= 0 ? 'not-allowed' : 'pointer',
                opacity: currentIndex <= 0 ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              <ChevronLeft size={16} /> Предыдущий рейс
            </button>

            <span style={{ fontSize: '13px', color: '#475569', fontWeight: 'bold' }}>
              Рейс {currentIndex + 1} из {voyagesData.length}
            </span>

            <button
              onClick={handleNextVoyage}
              disabled={currentIndex >= voyagesData.length - 1}
              className="btn-glass"
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: currentIndex >= voyagesData.length - 1 ? '#f1f5f9' : '#ffffff',
                border: '1px solid #cbd5e1',
                cursor: currentIndex >= voyagesData.length - 1 ? 'not-allowed' : 'pointer',
                opacity: currentIndex >= voyagesData.length - 1 ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              Следующий рейс <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* VOYAGE CARDS / SELECTOR ROW */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '220px' }}>
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Поиск рейса (дата, программа)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '13px',
                width: '100%',
                background: '#ffffff'
              }}
            />
          </div>

          <div style={{ flex: '1 1 300px' }}>
            <select
              value={selectedVoyageId}
              onChange={(e) => {
                setSelectedVoyageId(e.target.value);
                setSelectedSeat(null);
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #3b82f6',
                background: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b'
              }}
            >
              {filteredVoyages.map(v => (
                <option key={v.id} value={v.id}>
                  {v.date} ({v.time}) — {v.program} [Билетов: {v.total_tickets}] {v.admin ? `| Админ: ${v.admin}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* View Tab Buttons */}
          <div style={{ display: 'flex', gap: '6px' }}>
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
                gap: '6px'
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
                gap: '6px'
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
                gap: '6px'
              }}
            >
              <BarChart2 size={15} /> Каналы продаж
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
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', marginTop: '2px' }}>{currentVoyage.date}</div>
              <div style={{ fontSize: '12px', color: '#10b981', marginTop: '2px' }}>Отправление: {currentVoyage.time}</div>
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

      {/* MAIN VIEW AREA */}
      {activeViewTab === 'deck' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '20px' }}>
          
          {/* LEFT: INTERACTIVE SHIP DECK VISUALIZER */}
          <div className="glass" style={{ padding: '24px', borderRadius: '16px', overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Ship size={18} color="#2563eb" />
                Схема рассадки салона («Рок Хит Нева»)
              </h3>

              {/* Filter by Channel */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={15} color="#64748b" />
                <select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                    background: '#ffffff'
                  }}
                >
                  <option value="all">Все каналы продаж</option>
                  <option value="с">Только Сайт</option>
                  <option value="к">Только Кассир.ру</option>
                  <option value="б">Только Билетёр</option>
                  <option value="биг">Только Биглион / Купоны</option>
                </select>
              </div>
            </div>

            {/* CHANNEL LEGEND BADGES */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px', padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'flex', alignItems: 'center', marginRight: '6px' }}>
                Цвета источников:
              </div>
              {Object.entries(CHANNEL_CONFIG).map(([key, cfg]) => {
                const count = stats.byChannel[key] || 0;
                return (
                  <div
                    key={key}
                    onClick={() => setChannelFilter(channelFilter === key ? 'all' : key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      background: cfg.bgLight,
                      border: `1px solid ${channelFilter === key ? cfg.borderColor : 'transparent'}`,
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: cfg.borderColor
                    }}
                  >
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: cfg.color }}></span>
                    <span>{cfg.short}</span>
                    <span style={{ background: cfg.color, color: '#ffffff', borderRadius: '10px', padding: '1px 6px', fontSize: '10px' }}>
                      {count}
                    </span>
                  </div>
                );
              })}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', fontSize: '12px', color: '#94a3b8' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#e2e8f0', border: '1px solid #cbd5e1' }}></span>
                <span>Свободно</span>
              </div>
            </div>

            {/* SHIP CABIN VISUAL GRID */}
            <div 
              style={{ 
                margin: '0 auto', 
                maxWidth: '720px', 
                background: '#ffffff', 
                border: '2px solid #94a3b8', 
                borderRadius: '36px 36px 16px 16px', 
                padding: '24px 20px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                position: 'relative'
              }}
            >
              {/* Ship Nose / Bow Label */}
              <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '11px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '14px' }}>
                ▲ НОС СУДНА / НАПРАВЛЕНИЕ ДВИЖЕНИЯ ▲
              </div>

              {/* Grid Matrix */}
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${DECK_GRID.columns.length}, 1fr)`, gap: '6px' }}>
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
                            color: '#ffffff',
                            borderRadius: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            letterSpacing: '1px',
                            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.3)',
                            zIndex: 2
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
                            borderRadius: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            letterSpacing: '1px',
                            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.3)',
                            zIndex: 2
                          }}
                        >
                          🍸 БАР
                        </div>
                      );
                    }
                    if (['K22', 'L22', 'J23', 'K23', 'L23'].includes(ref)) {
                      return null; // Spanned by J22
                    }

                    // 3. Static Table Label (VIP or Standard Table center)
                    if (seatInfo?.labelInfo) {
                      const lbl = seatInfo.labelInfo;
                      const isVip = lbl.type === 'vip_label';
                      return (
                        <div
                          key={ref}
                          style={{
                            background: isVip ? '#fef3c7' : '#f1f5f9',
                            border: `1px dashed ${isVip ? '#d97706' : '#94a3b8'}`,
                            borderRadius: isVip ? '8px' : '4px',
                            color: isVip ? '#92400e' : '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: isVip ? '11px' : '10px',
                            fontWeight: 'bold',
                            minHeight: '28px',
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
                            border: isSelected ? '2px solid #000000' : `1px solid ${seatInfo.channel.borderColor}`,
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            minHeight: '28px',
                            cursor: 'pointer',
                            opacity: isMatchedFilter ? 1 : 0.25,
                            transform: isSelected ? 'scale(1.1)' : 'none',
                            transition: 'all 0.15s ease',
                            boxShadow: isSelected ? '0 4px 8px rgba(0,0,0,0.2)' : 'none'
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
                          minHeight: '28px',
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

              {/* Ship Stern / Back Label */}
              <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '11px', fontWeight: 'bold', letterSpacing: '2px', marginTop: '16px' }}>
                ▼ КОРМА СУДНА / ВЫХОД НА ОТКРЫТУЮ ПАЛУБУ ▼
              </div>
            </div>
          </div>

          {/* RIGHT: SEAT & GUEST DETAIL CARD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* SEAT CARD */}
            <div className="glass" style={{ padding: '20px', borderRadius: '16px' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={16} color="#2563eb" />
                Информация о месте
              </h3>

              {selectedSeat ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>Координата на схеме:</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', background: '#eff6ff', color: '#1e40af', padding: '2px 8px', borderRadius: '6px' }}>
                      Ячейка {selectedSeat.ref}
                    </span>
                  </div>

                  {selectedSeat.status === 'occupied' ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>Источник брони:</span>
                        <span 
                          style={{ 
                            fontSize: '12px', 
                            fontWeight: 'bold', 
                            background: selectedSeat.channel.bgLight, 
                            color: selectedSeat.channel.borderColor,
                            padding: '3px 8px',
                            borderRadius: '6px'
                          }}
                        >
                          {selectedSeat.channel.name}
                        </span>
                      </div>

                      <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155', marginBottom: '6px' }}>
                          Статус места в рейсе:
                        </div>
                        <div style={{ fontSize: '13px', color: '#0f172a' }}>
                          ✅ Выкуплено / Синхронизировано
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                          Метка в Excel: <strong>«{selectedSeat.val}»</strong>
                        </div>
                      </div>

                      {/* Guest details if found */}
                      {selectedSeat.guest && (
                        <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e40af', marginBottom: '6px' }}>
                            Данные пассажира:
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a' }}>
                            {selectedSeat.guest.name || 'Имя не указано'}
                          </div>
                          {selectedSeat.guest.phone && (
                            <div style={{ fontSize: '12px', color: '#334155', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Phone size={13} color="#2563eb" /> {selectedSeat.guest.phone}
                            </div>
                          )}
                          {selectedSeat.guest.ticket_or_coupon && (
                            <div style={{ fontSize: '12px', color: '#334155', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Ticket size={13} color="#2563eb" /> №: {selectedSeat.guest.ticket_or_coupon}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', color: '#64748b', fontSize: '13px' }}>
                      🟢 Место свободно для продажи на сайте или кассе причала.
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 12px', color: '#94a3b8', fontSize: '13px' }}>
                  Нажмите на любое место на схеме теплохода, чтобы увидеть источник продажи и данные пассажира.
                </div>
              )}
            </div>

            {/* CHANNEL BREAKDOWN MINI CARD */}
            <div className="glass" style={{ padding: '20px', borderRadius: '16px' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={16} color="#2563eb" />
                Сводка по агентам рейса
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(currentVoyage?.source_breakdown || {}).map(([srcName, data]) => {
                  if (srcName === '∑' || Number(data.total) <= 0) return null;
                  return (
                    <div 
                      key={srcName}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        fontSize: '13px'
                      }}
                    >
                      <span style={{ fontWeight: '600', color: '#334155' }}>{srcName}</span>
                      <span style={{ fontWeight: 'bold', color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>
                        {data.total} бил.
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

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
      )}

    </div>
  );
}
