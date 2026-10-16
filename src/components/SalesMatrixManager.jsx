import React, { useState, useMemo } from 'react';
import { 
  DollarSign, TrendingUp, Users, Calendar, Filter, Plus, 
  Search, Download, CheckCircle2, ChevronRight, BarChart3, Ship, Sparkles 
} from 'lucide-react';
import { REAL_AGENTS, REAL_SALES_MATRIX, DB_CLUSTER_INFO } from '../db';

export default function SalesMatrixManager() {
  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem('pm_sales_matrix_v1');
    return saved ? JSON.parse(saved) : REAL_SALES_MATRIX;
  });

  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedVessel, setSelectedVessel] = useState('all');
  const [selectedSlot, setSelectedSlot] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newSaleForm, setNewSaleForm] = useState({
    date: '2026-05-15',
    day_of_week: 'Пятница',
    time_slot: '20:30',
    program: 'Легенды Русского Рока: КИНО & Виктор Цой',
    vessel: 'М-177',
    gorbilet: 25,
    biglion: 10,
    neva_concert: 8,
    rockhitneva: 15,
    sputnik: 5,
    promoters: 12,
    site: 18,
    price_per_ticket: 1500,
    notes: 'Основной пятничный рейс'
  });

  const saveSales = (newSales) => {
    setSales(newSales);
    localStorage.setItem('pm_sales_matrix_v1', JSON.stringify(newSales));
  };

  const filteredSales = useMemo(() => {
    return sales.filter(item => {
      if (selectedYear !== 'all' && item.year !== selectedYear) return false;
      if (selectedVessel !== 'all' && !item.vessel?.toLowerCase().includes(selectedVessel.toLowerCase())) return false;
      if (selectedSlot !== 'all' && item.time_slot !== selectedSlot) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchProg = item.program?.toLowerCase().includes(q);
        const matchDate = item.date?.toLowerCase().includes(q);
        const matchNotes = item.notes?.toLowerCase().includes(q);
        if (!matchProg && !matchDate && !matchNotes) return false;
      }
      return true;
    });
  }, [sales, selectedYear, selectedVessel, selectedSlot, searchQuery]);

  const stats = useMemo(() => {
    let totalTickets = 0;
    let totalRevenue = 0;
    let gorbiletTotal = 0;
    let siteTotal = 0;
    let biglionTotal = 0;
    let nevaConcertTotal = 0;

    filteredSales.forEach(s => {
      totalTickets += (s.total_tickets || 0);
      totalRevenue += (s.revenue || 0);
      gorbiletTotal += (s.gorbilet || 0);
      siteTotal += (s.site || 0);
      biglionTotal += (s.biglion || 0);
      nevaConcertTotal += (s.neva_concert || 0);
    });

    const avgTicket = totalTickets > 0 ? Math.round(totalRevenue / totalTickets) : 1500;

    return {
      totalTickets,
      totalRevenue,
      gorbiletTotal,
      siteTotal,
      biglionTotal,
      nevaConcertTotal,
      avgTicket,
      voyagesCount: filteredSales.length
    };
  }, [filteredSales]);

  const handleAddSale = (e) => {
    e.preventDefault();
    const totalTix = 
      Number(newSaleForm.gorbilet || 0) +
      Number(newSaleForm.biglion || 0) +
      Number(newSaleForm.neva_concert || 0) +
      Number(newSaleForm.rockhitneva || 0) +
      Number(newSaleForm.sputnik || 0) +
      Number(newSaleForm.promoters || 0) +
      Number(newSaleForm.site || 0);

    const rev = totalTix * Number(newSaleForm.price_per_ticket || 1500);

    const newRecord = {
      id: `sale-${Date.now()}`,
      year: newSaleForm.date.substring(0, 4) || '2026',
      date: newSaleForm.date,
      day_of_week: newSaleForm.day_of_week,
      time_slot: newSaleForm.time_slot,
      program: newSaleForm.program,
      vessel: newSaleForm.vessel,
      gorbilet: Number(newSaleForm.gorbilet || 0),
      biglion: Number(newSaleForm.biglion || 0),
      neva_concert: Number(newSaleForm.neva_concert || 0),
      rockhitneva: Number(newSaleForm.rockhitneva || 0),
      sputnik: Number(newSaleForm.sputnik || 0),
      promoters: Number(newSaleForm.promoters || 0),
      site: Number(newSaleForm.site || 0),
      total_tickets: totalTix,
      revenue: rev,
      notes: newSaleForm.notes
    };

    saveSales([newRecord, ...sales]);
    setIsAddModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* DB CLUSTER BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: '#ffffff',
        padding: '16px 20px',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 10px #10b981'
          }}></div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🛡️ Источник правды:</span>
              <span style={{ color: '#38bdf8' }}>Германия (Frankfurt / EU PostgreSQL)</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '8px' }}>• Рабочая реплика: Yandex Cloud</span>
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
              Данные синхронизированы из рабочей книги <strong style={{ color: '#cbd5e1' }}>продажи.xlsx</strong> (34 листа, сводки 2023–2026)
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          style={{
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px'
          }}
        >
          <Plus size={16} />
          Внести рейс / продажи
        </button>
      </div>

      {/* STATS OVERVIEW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="glass" style={{ padding: '16px', borderRadius: '10px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>ВСЕГО ПРОДАНО БИЛЕТОВ</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginTop: '6px' }}>
            {stats.totalTickets.toLocaleString()} шт.
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>По {stats.voyagesCount} рейсам</div>
        </div>

        <div className="glass" style={{ padding: '16px', borderRadius: '10px', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>СУММАРНАЯ ВЫРУЧКА</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginTop: '6px' }}>
            {stats.totalRevenue.toLocaleString()} ₽
          </div>
          <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>Ср. чек: {stats.avgTicket} ₽</div>
        </div>

        <div className="glass" style={{ padding: '16px', borderRadius: '10px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>ГОРБИЛЕТ (ЛИДЕР КАНАЛОВ)</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginTop: '6px' }}>
            {stats.gorbiletTotal.toLocaleString()} шт.
          </div>
          <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '4px' }}>
            {stats.totalTickets > 0 ? Math.round((stats.gorbiletTotal / stats.totalTickets) * 100) : 0}% от всех продаж
          </div>
        </div>

        <div className="glass" style={{ padding: '16px', borderRadius: '10px', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>ПРЯМОЙ САЙТ & РОК ХИТ</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginTop: '6px' }}>
            {stats.siteTotal.toLocaleString()} шт.
          </div>
          <div style={{ fontSize: '11px', color: '#8b5cf6', marginTop: '4px' }}>Прямые продажи без комиссии</div>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="glass" style={{ padding: '16px', borderRadius: '10px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="#64748b" />
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Фильтры:</span>
        </div>

        {/* Year Filter */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#ffffff' }}
        >
          <option value="2026">Сезон 2026</option>
          <option value="2025">Сезон 2025</option>
          <option value="all">Все сезоны</option>
        </select>

        {/* Vessel Filter */}
        <select
          value={selectedVessel}
          onChange={(e) => setSelectedVessel(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#ffffff' }}
        >
          <option value="all">Все теплоходы</option>
          <option value="М-177">М-177 (Рок Хит)</option>
          <option value="Солярис">Солярис (Премиум)</option>
          <option value="М-125">М-125 (Акустика)</option>
          <option value="М-201">М-201 (VIP Мангал)</option>
        </select>

        {/* Slot Filter */}
        <select
          value={selectedSlot}
          onChange={(e) => setSelectedSlot(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#ffffff' }}
        >
          <option value="all">Все слоты времени</option>
          <option value="15:30">15:30 (Дневной)</option>
          <option value="18:00">18:00 (Вечерний)</option>
          <option value="20:30">20:30 (Прайм-тайм)</option>
          <option value="23:55">23:55 (Разводные мосты)</option>
        </select>

        {/* Search Input */}
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <input
            type="text"
            placeholder="Поиск по программе, дате или примечанию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '13px'
            }}
          />
        </div>
      </div>

      {/* SALES MATRIX TABLE */}
      <div className="glass" style={{ padding: '20px', borderRadius: '12px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '12px 10px' }}>Дата / День</th>
              <th style={{ padding: '12px 10px' }}>Слот</th>
              <th style={{ padding: '12px 10px' }}>Программа / Теплоход</th>
              <th style={{ padding: '12px 10px', textAlign: 'center', background: '#fef3c7' }}>Горбилет</th>
              <th style={{ padding: '12px 10px', textAlign: 'center' }}>Биглион</th>
              <th style={{ padding: '12px 10px', textAlign: 'center' }}>Нева Концерт</th>
              <th style={{ padding: '12px 10px', textAlign: 'center' }}>Спутник</th>
              <th style={{ padding: '12px 10px', textAlign: 'center' }}>Промо</th>
              <th style={{ padding: '12px 10px', textAlign: 'center', background: '#eff6ff' }}>Сайт</th>
              <th style={{ padding: '12px 10px', textAlign: 'center', fontWeight: 'bold' }}>Итого</th>
              <th style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 'bold' }}>Выручка</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((row, idx) => (
              <tr key={row.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 10px', fontWeight: '600', color: '#0f172a' }}>
                  <div>{row.date}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'normal' }}>{row.day_of_week}</div>
                </td>
                <td style={{ padding: '12px 10px' }}>
                  <span style={{
                    background: '#e0f2fe',
                    color: '#0369a1',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}>
                    {row.time_slot}
                  </span>
                </td>
                <td style={{ padding: '12px 10px' }}>
                  <div style={{ fontWeight: '600', color: '#1e293b' }}>{row.program}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <Ship size={12} /> {row.vessel}
                  </div>
                </td>
                <td style={{ padding: '12px 10px', textAlign: 'center', fontWeight: 'bold', color: '#d97706', background: '#fffbeb' }}>
                  {row.gorbilet || 0}
                </td>
                <td style={{ padding: '12px 10px', textAlign: 'center', color: '#475569' }}>
                  {row.biglion || 0}
                </td>
                <td style={{ padding: '12px 10px', textAlign: 'center', color: '#475569' }}>
                  {row.neva_concert || 0}
                </td>
                <td style={{ padding: '12px 10px', textAlign: 'center', color: '#475569' }}>
                  {row.sputnik || 0}
                </td>
                <td style={{ padding: '12px 10px', textAlign: 'center', color: '#475569' }}>
                  {row.promoters || 0}
                </td>
                <td style={{ padding: '12px 10px', textAlign: 'center', fontWeight: 'bold', color: '#2563eb', background: '#eff6ff' }}>
                  {row.site || 0}
                </td>
                <td style={{ padding: '12px 10px', textAlign: 'center', fontWeight: 'bold', color: '#0f172a' }}>
                  <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px' }}>
                    {row.total_tickets}
                  </span>
                </td>
                <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 'bold', color: '#16a34a' }}>
                  {(row.revenue || 0).toLocaleString()} ₽
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSales.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Рейсы по выбранным фильтрам не найдены.
          </div>
        )}
      </div>

      {/* MODAL: ADD VOYAGE SALE */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="glass" style={{
            background: '#ffffff',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '600px',
            padding: '24px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#0f172a' }}>Внести рейс и сводку по агентам</h3>
            
            <form onSubmit={handleAddSale} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Дата рейса</label>
                  <input
                    type="date"
                    required
                    value={newSaleForm.date}
                    onChange={(e) => setNewSaleForm({ ...newSaleForm, date: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Время отправления</label>
                  <select
                    value={newSaleForm.time_slot}
                    onChange={(e) => setNewSaleForm({ ...newSaleForm, time_slot: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                  >
                    <option value="15:30">15:30 (Дневной)</option>
                    <option value="18:00">18:00 (Вечерний)</option>
                    <option value="20:30">20:30 (Рок-шоу)</option>
                    <option value="23:55">23:55 (Разводные мосты)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Программа</label>
                <input
                  type="text"
                  required
                  value={newSaleForm.program}
                  onChange={(e) => setNewSaleForm({ ...newSaleForm, program: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Теплоход</label>
                  <select
                    value={newSaleForm.vessel}
                    onChange={(e) => setNewSaleForm({ ...newSaleForm, vessel: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                  >
                    <option value="М-177">М-177 (Рок Хит Нева)</option>
                    <option value="Солярис">Солярис (Премиум)</option>
                    <option value="М-125">М-125 (Акустика)</option>
                    <option value="М-201">М-201 (VIP)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Тариф за билет (₽)</label>
                  <input
                    type="number"
                    value={newSaleForm.price_per_ticket}
                    onChange={(e) => setNewSaleForm({ ...newSaleForm, price_per_ticket: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                  />
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155', marginBottom: '8px' }}>
                  Продажи по каналам (количество билетов):
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b' }}>Горбилет</label>
                    <input
                      type="number"
                      value={newSaleForm.gorbilet}
                      onChange={(e) => setNewSaleForm({ ...newSaleForm, gorbilet: e.target.value })}
                      style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b' }}>Сайт</label>
                    <input
                      type="number"
                      value={newSaleForm.site}
                      onChange={(e) => setNewSaleForm({ ...newSaleForm, site: e.target.value })}
                      style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b' }}>Биглион</label>
                    <input
                      type="number"
                      value={newSaleForm.biglion}
                      onChange={(e) => setNewSaleForm({ ...newSaleForm, biglion: e.target.value })}
                      style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b' }}>Нева Концерт</label>
                    <input
                      type="number"
                      value={newSaleForm.neva_concert}
                      onChange={(e) => setNewSaleForm({ ...newSaleForm, neva_concert: e.target.value })}
                      style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b' }}>Спутник</label>
                    <input
                      type="number"
                      value={newSaleForm.sputnik}
                      onChange={(e) => setNewSaleForm({ ...newSaleForm, sputnik: e.target.value })}
                      style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b' }}>Промоутеры</label>
                    <input
                      type="number"
                      value={newSaleForm.promoters}
                      onChange={(e) => setNewSaleForm({ ...newSaleForm, promoters: e.target.value })}
                      style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer' }}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Сохранить рейс
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
