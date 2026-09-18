import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, Ship, Ticket, Users, DollarSign, Settings, 
  AlertTriangle, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, 
  CheckCircle2, Clock, Plus, Search, FileText, Layers, 
  Percent, Shield, QrCode, RefreshCw, Sliders, ChevronRight, 
  Filter, Download, Eye, Trash2, Edit3, CreditCard, Wallet, 
  Fuel, Anchor, AlertCircle, Check, X, PieChart, Sparkles,
  HelpCircle, UserCheck, Smartphone, Send, ArrowRight
} from 'lucide-react';
import { getEvents, getShips, getBookings, getHalls, createEvent, createBooking } from '../db';

export default function AdminPanel() {
  const [activeNav, setActiveNav] = useState('dashboard'); // 'dashboard', 'operations', 'orders', 'partners', 'finances', 'settings'
  const [financeTab, setFinanceTab] = useState('dds'); // 'dds', 'pnl', 'unit'
  const [operationsTab, setOperationsTab] = useState('schedule'); // 'schedule', 'matrix'
  const [timeFilter, setTimeFilter] = useState('month'); // 'today', 'week', 'month', 'season'

  // Core Data
  const [events, setEvents] = useState([]);
  const [ships, setShips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEventForUnit, setSelectedEventForUnit] = useState(null);

  // New Event Form State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('20:00');
  const [newEventPriceStd, setNewEventPriceStd] = useState(1500);
  const [newEventPriceVip, setNewEventPriceVip] = useState(2500);
  const [newEventShipId, setNewEventShipId] = useState('');

  // Mock / Initial Data for Partners & Expenses
  const [agents, setAgents] = useState([
    { id: 'ag_1', name: 'Отель «Астория» (5★)', code: 'ASTORIA10', rate: 0.15, balance: 42500, totalSold: 340000, bookingsCount: 136 },
    { id: 'ag_2', name: 'Гранд Отель Европа (5★)', code: 'EUROPE_HOTEL', rate: 0.15, balance: 28900, totalSold: 215000, bookingsCount: 86 },
    { id: 'ag_3', name: 'Radisson Royal Hotel', code: 'RADISSON_SPB', rate: 0.12, balance: 14400, totalSold: 120000, bookingsCount: 48 },
    { id: 'ag_4', name: 'Алексей (Промоутер Причала)', code: 'ALEXROCK', rate: 0.10, balance: 8500, totalSold: 85000, bookingsCount: 34 }
  ]);

  const [expensesList, setExpensesList] = useState([
    { id: 'exp_1', type: 'variable', category: 'ГСМ (Топливо)', amount: 18500, date: '2026-09-17', eventName: 'Вечерний Рок-Круиз', desc: 'Дизельное топливо 250л' },
    { id: 'exp_2', type: 'variable', category: 'Оплата артистов', amount: 15000, date: '2026-09-17', eventName: 'Вечерний Рок-Круиз', desc: 'Кавер-группа "Невский Драйв"' },
    { id: 'exp_3', type: 'variable', category: 'Причальный сбор', amount: 4500, date: '2026-09-17', eventName: 'Вечерний Рок-Круиз', desc: 'Швартовка Дворцовая наб.' },
    { id: 'exp_4', type: 'fixed', category: 'Оклады команды', amount: 180000, date: '2026-09-01', eventName: null, desc: 'Капитаны и мотористы (аванс)' },
    { id: 'exp_5', type: 'fixed', category: 'Аренда стоянки флота', amount: 95000, date: '2026-09-05', eventName: null, desc: 'База стоянки Уткина заводь' },
    { id: 'exp_6', type: 'fixed', category: 'Серверы & Эквайринг CRM', amount: 12000, date: '2026-09-10', eventName: null, desc: 'Yandex Cloud + платежный шлюз' },
    { id: 'exp_7', type: 'fixed', category: 'Маркетинг & Реклама', amount: 65000, date: '2026-09-12', eventName: null, desc: 'Яндекс Директ + VK Таргет' }
  ]);

  // Load live data from database
  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedEvents, fetchedShips, fetchedHalls, fetchedBookings] = await Promise.all([
        getEvents(),
        getShips(),
        getHalls(),
        getBookings()
      ]);
      setEvents(fetchedEvents || []);
      setShips(fetchedShips || []);
      setHalls(fetchedHalls || []);
      setBookings(fetchedBookings || []);
      if (fetchedShips?.length > 0) setNewEventShipId(fetchedShips[0].id);
      if (fetchedEvents?.length > 0) setSelectedEventForUnit(fetchedEvents[0].id);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // System Alarms / Points of Attention calculation
  const systemAlerts = useMemo(() => {
    const alerts = [];
    const now = new Date();

    // 1. Low occupancy alert on upcoming events (next 3 days)
    events.forEach(ev => {
      const eventDate = new Date(`${ev.date}T${ev.time || '00:00'}`);
      const hoursDiff = (eventDate - now) / (1000 * 60 * 60);
      const ship = ships.find(s => s.id === ev.ship_id) || { capacity: 100, name: 'Теплоход' };
      const eventBookings = bookings.filter(b => b.event_id === ev.id && b.status === 'confirmed');
      const loadFactor = (eventBookings.length / (ship.capacity || 100)) * 100;

      if (hoursDiff >= 0 && hoursDiff <= 72 && loadFactor < 40) {
        alerts.push({
          id: `alert_low_${ev.id}`,
          level: loadFactor < 20 ? 'critical' : 'warning',
          title: `Критически низкая загрузка: ${ev.name}`,
          message: `Рейс ${ev.date} в ${ev.time} на «${ship.name}» заполнен всего на ${loadFactor.toFixed(0)}% (${eventBookings.length} из ${ship.capacity} мест).`,
          action: 'Запустить акцию -20%',
          targetTab: 'operations'
        });
      }
    });

    // 2. Unpaid pending bookings
    const pendingCount = bookings.filter(b => b.status === 'pending').length;
    if (pendingCount > 0) {
      alerts.push({
        id: 'alert_pending_hold',
        level: 'warning',
        title: `Зависшие неоплаченные брони: ${pendingCount} шт.`,
        message: `Места удерживаются в корзинах более 20 минут и блокируют прямые продажи.`,
        action: 'Снять брони в 1 клик',
        targetTab: 'orders'
      });
    }

    // 3. Partner Commission threshold alert
    const totalUnpaidPartnerCommission = agents.reduce((sum, a) => sum + a.balance, 0);
    if (totalUnpaidPartnerCommission > 50000) {
      alerts.push({
        id: 'alert_partner_payout',
        level: 'info',
        title: `Задолженность перед партнерами: ${totalUnpaidPartnerCommission.toLocaleString('ru-RU')} ₽`,
        message: `Накопились агентские вознаграждения за прошедшую неделю для 4 отелей.`,
        action: 'Сформировать реестр выплат',
        targetTab: 'partners'
      });
    }

    return alerts;
  }, [events, ships, bookings, agents]);

  // Aggregate Financial & Operations KPIs
  const kpis = useMemo(() => {
    const totalConfirmedBookings = bookings.filter(b => b.status === 'confirmed');
    const totalRevenue = totalConfirmedBookings.reduce((sum, b) => sum + Number(b.price_paid || 0), 0);
    const avgTicket = totalConfirmedBookings.length > 0 ? totalRevenue / totalConfirmedBookings.length : 0;
    
    // Total variable expenses
    const totalVariableExp = expensesList.filter(e => e.type === 'variable').reduce((sum, e) => sum + e.amount, 0);
    // Total fixed expenses
    const totalFixedExp = expensesList.filter(e => e.type === 'fixed').reduce((sum, e) => sum + e.amount, 0);
    const totalExp = totalVariableExp + totalFixedExp;
    const netProfit = totalRevenue - totalExp;
    const marginPercent = totalRevenue > 0 ? ((totalRevenue - totalVariableExp) / totalRevenue) * 100 : 0;

    // Load factor across fleet
    const totalCapacityAvailable = events.reduce((sum, ev) => {
      const ship = ships.find(s => s.id === ev.ship_id);
      return sum + (ship?.capacity || 100);
    }, 0);
    const fleetLoadFactor = totalCapacityAvailable > 0 ? (totalConfirmedBookings.length / totalCapacityAvailable) * 100 : 0;

    return {
      totalRevenue,
      totalTickets: totalConfirmedBookings.length,
      avgTicket,
      totalExp,
      totalVariableExp,
      totalFixedExp,
      netProfit,
      marginPercent,
      fleetLoadFactor
    };
  }, [bookings, expensesList, events, ships]);

  // Handle Event Creation
  const handleCreateNewEvent = async (e) => {
    e.preventDefault();
    if (!newEventShipId) return;

    try {
      await createEvent({
        ship_id: newEventShipId,
        hall_id: halls[0]?.id || null,
        name: newEventName,
        description: 'Регулярный прогулочный круиз по рекам и каналам Санкт-Петербурга',
        date: newEventDate,
        time: `${newEventTime}:00`,
        price_standard: Number(newEventPriceStd),
        price_vip: Number(newEventPriceVip),
        status: 'active'
      });

      setIsCreateModalOpen(false);
      setNewEventName('');
      setNewEventDate('');
      await loadData();
      alert('Рейс успешно добавлен в расписание!');
    } catch (err) {
      alert('Ошибка при создании рейса: ' + err.message);
    }
  };

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch = 
        (b.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.customer_phone || '').includes(searchQuery) ||
        (b.customer_email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.seat_number || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  if (loading) {
    return (
      <div className="glass" style={{ padding: '60px', textAlign: 'center', margin: '30px auto', maxWidth: '600px' }}>
        <RefreshCw size={36} className="spin" style={{ color: 'var(--color-primary)', margin: '0 auto 16px' }} />
        <h3>Загрузка аналитики и модулей управления...</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Подключение к защищенному шлюзу Yandex Cloud</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', minHeight: '85vh', alignItems: 'start' }}>
      
      {/* ============================================================ */}
      {/* 1. БОКОВОЕ МЕНЮ АДМИНИСТРАТОРА (SIDEBAR) */}
      {/* ============================================================ */}
      <aside className="glass" style={{ padding: '20px', borderRadius: '16px', position: 'sticky', top: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Главный пульт</div>
            <div style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              Онлайн (152-ФЗ)
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {/* 1. Дашборд */}
          <button
            onClick={() => setActiveNav('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeNav === 'dashboard' ? 'var(--color-primary)' : 'transparent',
              color: activeNav === 'dashboard' ? '#ffffff' : 'var(--text-main)',
              fontWeight: activeNav === 'dashboard' ? 'bold' : '500',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BarChart3 size={18} />
              <span>📊 Дашборд</span>
            </div>
            {systemAlerts.length > 0 && (
              <span style={{ 
                background: '#ef4444', 
                color: 'white', 
                fontSize: '11px', 
                padding: '2px 7px', 
                borderRadius: '10px', 
                fontWeight: 'bold' 
              }}>
                {systemAlerts.length}
              </span>
            )}
          </button>

          {/* 2. Операционка */}
          <button
            onClick={() => setActiveNav('operations')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeNav === 'operations' ? 'var(--color-primary)' : 'transparent',
              color: activeNav === 'operations' ? '#ffffff' : 'var(--text-main)',
              fontWeight: activeNav === 'operations' ? 'bold' : '500',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <Ship size={18} />
            <span>🚢 Операционка</span>
          </button>

          {/* 3. Заказы / Билеты */}
          <button
            onClick={() => setActiveNav('orders')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeNav === 'orders' ? 'var(--color-primary)' : 'transparent',
              color: activeNav === 'orders' ? '#ffffff' : 'var(--text-main)',
              fontWeight: activeNav === 'orders' ? 'bold' : '500',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Ticket size={18} />
              <span>🎫 Заказы / Билеты</span>
            </div>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>{bookings.length}</span>
          </button>

          {/* 4. Партнеры (B2B) */}
          <button
            onClick={() => setActiveNav('partners')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeNav === 'partners' ? 'var(--color-primary)' : 'transparent',
              color: activeNav === 'partners' ? '#ffffff' : 'var(--text-main)',
              fontWeight: activeNav === 'partners' ? 'bold' : '500',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <Percent size={18} />
            <span>🤝 Партнеры (B2B)</span>
          </button>

          {/* 5. Финансы (ДДС, ОПиУ, Unit-экономика) */}
          <button
            onClick={() => setActiveNav('finances')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeNav === 'finances' ? 'var(--color-primary)' : 'transparent',
              color: activeNav === 'finances' ? '#ffffff' : 'var(--text-main)',
              fontWeight: activeNav === 'finances' ? 'bold' : '500',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <DollarSign size={18} />
            <span>💰 Финансы (ДДС & P&L)</span>
          </button>

          {/* 6. Настройки */}
          <button
            onClick={() => setActiveNav('settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeNav === 'settings' ? 'var(--color-primary)' : 'transparent',
              color: activeNav === 'settings' ? '#ffffff' : 'var(--text-main)',
              fontWeight: activeNav === 'settings' ? 'bold' : '500',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <Settings size={18} />
            <span>⚙️ Настройки</span>
          </button>
        </nav>

        {/* Quick Summary Widget in Sidebar */}
        <div style={{ marginTop: '30px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Касса текущего месяца</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-success)' }}>
            {kpis.totalRevenue.toLocaleString('ru-RU')} ₽
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Маржа: <b style={{ color: '#60a5fa' }}>{kpis.marginPercent.toFixed(1)}%</b>
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 2. ОСНОВНАЯ ОБЛАСТЬ КОНТЕНТА */}
      {/* ============================================================ */}
      <main>
        
        {/* ============================================================ */}
        {/* СЕКЦИЯ 1: 📊 ДАШБОРД (СВОДКА, ГРАФИКИ, ТОЧКИ ВНИМАНИЯ/АЛЕРТЫ) */}
        {/* ============================================================ */}
        {activeNav === 'dashboard' && (
          <div>
            {/* Header / Filter bar */}
            <div className="glass" style={{ padding: '20px 24px', borderRadius: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{ fontSize: '26px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  📊 Сводный аналитический дашборд
                </h1>
                <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                  Контроль загрузки флота, выручки, среднего чека и операционных рисков в реальном времени.
                </p>
              </div>

              {/* Period Switcher */}
              <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '10px' }}>
                {['today', 'week', 'month', 'season'].map(p => (
                  <button
                    key={p}
                    onClick={() => setTimeFilter(p)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      background: timeFilter === p ? 'var(--color-primary)' : 'transparent',
                      color: timeFilter === p ? 'white' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {p === 'today' ? 'Сегодня' : p === 'week' ? 'Неделя' : p === 'month' ? 'Месяц' : 'Весь сезон'}
                  </button>
                ))}
              </div>
            </div>

            {/* 1. БЛОК АЛЕРТОВ / ТОЧЕК ВНИМАНИЯ (КРИТИЧЕСКИЕ ПРЕДУПРЕЖДЕНИЯ) */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '17px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={18} color="#f59e0b" />
                  Точки внимания & Автоматические алерты ({systemAlerts.length})
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Фоновый воркер проверяет базу каждые 10 мин</span>
              </div>

              {systemAlerts.length === 0 ? (
                <div className="glass" style={{ padding: '16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={20} />
                  <span>Все показатели в зеленой зоне. Рисков кассовых разрывов и срывов рейсов не обнаружено!</span>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
                  {systemAlerts.map(alert => (
                    <div 
                      key={alert.id}
                      className="glass" 
                      style={{ 
                        padding: '16px', 
                        borderRadius: '12px',
                        borderLeft: `5px solid ${alert.level === 'critical' ? '#ef4444' : '#f59e0b'}`,
                        background: alert.level === 'critical' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '14px', color: alert.level === 'critical' ? '#f87171' : '#fbbf24' }}>
                            {alert.title}
                          </span>
                          <span style={{ fontSize: '10px', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px', background: alert.level === 'critical' ? '#ef4444' : '#f59e0b', color: '#fff', fontWeight: 'bold' }}>
                            {alert.level === 'critical' ? 'Критично' : 'Внимание'}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                          {alert.message}
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => setActiveNav(alert.targetTab)}
                          className="btn btn-secondary" 
                          style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <span>{alert.action}</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. КЛЮЧЕВЫЕ ПОКАЗАТЕЛИ (KPI CARDS) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              
              {/* Выручка */}
              <div className="glass" style={{ padding: '20px', borderRadius: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                  <span>Общая выручка</span>
                  <DollarSign size={18} color="var(--color-success)" />
                </div>
                <div style={{ fontSize: '26px', fontWeight: 'bold', margin: '8px 0 4px', color: '#ffffff' }}>
                  {kpis.totalRevenue.toLocaleString('ru-RU')} ₽
                </div>
                <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={14} /> +18.4% к прошлой неделе
                </div>
              </div>

              {/* Продано билетов */}
              <div className="glass" style={{ padding: '20px', borderRadius: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                  <span>Билетов продано</span>
                  <Ticket size={18} color="#60a5fa" />
                </div>
                <div style={{ fontSize: '26px', fontWeight: 'bold', margin: '8px 0 4px', color: '#ffffff' }}>
                  {kpis.totalTickets} шт.
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  B2C: <b>78%</b> • Отели (B2B): <b>22%</b>
                </div>
              </div>

              {/* Загрузка флота */}
              <div className="glass" style={{ padding: '20px', borderRadius: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                  <span>Загрузка флота (Load Factor)</span>
                  <Ship size={18} color="#ec4899" />
                </div>
                <div style={{ fontSize: '26px', fontWeight: 'bold', margin: '8px 0 4px', color: '#ffffff' }}>
                  {kpis.fleetLoadFactor.toFixed(1)}%
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', marginTop: '6px' }}>
                  <div style={{ width: `${Math.min(100, kpis.fleetLoadFactor)}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #10b981)' }}></div>
                </div>
              </div>

              {/* Средний чек */}
              <div className="glass" style={{ padding: '20px', borderRadius: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                  <span>Средний чек (AOV)</span>
                  <Wallet size={18} color="#fbbf24" />
                </div>
                <div style={{ fontSize: '26px', fontWeight: 'bold', margin: '8px 0 4px', color: '#ffffff' }}>
                  {kpis.avgTicket.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  VIP столы: <b>2 500 ₽</b> • Стандарт: <b>1 500 ₽</b>
                </div>
              </div>
            </div>

            {/* 3. ГРАФИК ПРОДАЖ И ТОП МАРШРУТОВ */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
              
              {/* График динамики выручки по дням */}
              <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>Динамика продаж и выручки</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>За последние 7 дней (тыс. ₽)</span>
                </div>

                {/* SVG Chart */}
                <div style={{ height: '180px', width: '100%', display: 'flex', alignItems: 'flex-end', gap: '14px', paddingTop: '20px' }}>
                  {[
                    { day: 'Пн', val: 42, count: 28 },
                    { day: 'Вт', val: 56, count: 37 },
                    { day: 'Ср', val: 68, count: 45 },
                    { day: 'Чт', val: 84, count: 56 },
                    { day: 'Пт', val: 145, count: 96 },
                    { day: 'Сб', val: 210, count: 140 },
                    { day: 'Вс', val: 175, count: 115 }
                  ].map((bar, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{bar.val}k</span>
                      <div 
                        style={{ 
                          width: '100%', 
                          height: `${(bar.val / 220) * 100}%`, 
                          background: i >= 4 ? 'linear-gradient(180deg, #3b82f6, #1d4ed8)' : 'rgba(255,255,255,0.15)', 
                          borderRadius: '6px 6px 0 0',
                          transition: 'height 0.3s'
                        }} 
                      />
                      <span style={{ fontSize: '11px', color: i >= 4 ? '#60a5fa' : 'var(--text-secondary)', fontWeight: i >= 4 ? 'bold' : 'normal' }}>
                        {bar.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Рейтинг концертных программ */}
              <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px' }}>Топ программ по сборам</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { name: 'Вечерний Рок-Круиз', share: '45%', amount: '185 000 ₽', color: '#3b82f6' },
                    { name: 'Ночной Джаз под мостами', share: '30%', amount: '125 000 ₽', color: '#10b981' },
                    { name: 'Гастрономический круиз', share: '15%', amount: '62 000 ₽', color: '#f59e0b' },
                    { name: 'Виктор Цой: Хиты на Неве', share: '10%', amount: '41 000 ₽', color: '#8b5cf6' }
                  ].map((prog, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: '500' }}>{prog.name}</span>
                        <b>{prog.amount}</b>
                      </div>
                      <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: prog.share, height: '100%', background: prog.color }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* СЕКЦИЯ 2: 🚢 ОПЕРАЦИОНКА (РАСПИСАНИЕ, СЕТКИ, ШАХМАТКА) */}
        {/* ============================================================ */}
        {activeNav === 'operations' && (
          <div>
            <div className="glass" style={{ padding: '20px 24px', borderRadius: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{ fontSize: '26px', margin: 0 }}>🚢 Операционное управление флотом</h1>
                <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                  Управление сеткой рейсов, причалами, сменами экипажа и рассадкой гостей.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Plus size={16} /> Добавить рейс
                </button>
              </div>
            </div>

            {/* Subtabs for Operations */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button 
                onClick={() => setOperationsTab('schedule')}
                className={`btn ${operationsTab === 'schedule' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 16px' }}
              >
                <Calendar size={15} /> Таблица расписания
              </button>
              <button 
                onClick={() => setOperationsTab('matrix')}
                className={`btn ${operationsTab === 'matrix' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 16px' }}
              >
                <Layers size={15} /> Шахматка занятости флота
              </button>
            </div>

            {/* Operations Tab 1: Schedule */}
            {operationsTab === 'schedule' && (
              <div className="glass" style={{ padding: '20px', borderRadius: '16px' }}>
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Рейс / Программа</th>
                        <th>Теплоход</th>
                        <th>Дата и Время</th>
                        <th>Тарифы</th>
                        <th>Загрузка</th>
                        <th>Выручка</th>
                        <th>Статус</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map(ev => {
                        const ship = ships.find(s => s.id === ev.ship_id) || { name: 'Рок Хит Нева', capacity: 80 };
                        const evBookings = bookings.filter(b => b.event_id === ev.id && b.status === 'confirmed');
                        const evRev = evBookings.reduce((sum, b) => sum + Number(b.price_paid || 0), 0);
                        const loadPct = (evBookings.length / (ship.capacity || 100)) * 100;

                        return (
                          <tr key={ev.id}>
                            <td style={{ fontWeight: 'bold' }}>{ev.name}</td>
                            <td>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <Anchor size={14} color="#60a5fa" />
                                {ship.name}
                              </span>
                            </td>
                            <td>
                              <div>{ev.date}</div>
                              <small style={{ color: 'var(--text-muted)' }}>{ev.time}</small>
                            </td>
                            <td>
                              <div>Стандарт: {ev.price_standard} ₽</div>
                              <div style={{ color: '#fbbf24', fontSize: '11px' }}>VIP: {ev.price_vip} ₽</div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>{evBookings.length} / {ship.capacity}</span>
                                <span style={{ 
                                  fontSize: '11px', 
                                  fontWeight: 'bold', 
                                  color: loadPct >= 70 ? '#10b981' : loadPct >= 30 ? '#fbbf24' : '#f87171' 
                                }}>
                                  ({loadPct.toFixed(0)}%)
                                </span>
                              </div>
                              <div style={{ width: '100px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', marginTop: '4px' }}>
                                <div style={{ width: `${Math.min(100, loadPct)}%`, height: '100%', background: loadPct >= 70 ? '#10b981' : loadPct >= 30 ? '#fbbf24' : '#ef4444' }}></div>
                              </div>
                            </td>
                            <td style={{ fontWeight: 'bold', color: 'var(--color-success)' }}>
                              {evRev.toLocaleString('ru-RU')} ₽
                            </td>
                            <td>
                              <span style={{ 
                                padding: '4px 8px', 
                                borderRadius: '6px', 
                                fontSize: '11px', 
                                background: ev.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                color: ev.status === 'active' ? '#34d399' : '#f87171',
                                fontWeight: 'bold'
                              }}>
                                {ev.status === 'active' ? 'В продаже' : 'Отменен'}
                              </span>
                            </td>
                            <td>
                              <button 
                                onClick={() => {
                                  setActiveNav('finances');
                                  setFinanceTab('unit');
                                  setSelectedEventForUnit(ev.id);
                                }}
                                className="btn btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                                title="Посмотреть юнит-экономику рейса"
                              >
                                Unit-P&L
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Operations Tab 2: Matrix View */}
            {operationsTab === 'matrix' && (
              <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ margin: '0 0 16px' }}>Шахматка отправлений судов на текущую неделю</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '150px repeat(7, 1fr)', gap: '8px', overflowX: 'auto', textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>Теплоход</div>
                  {['Пн 15.09', 'Вт 16.09', 'Ср 17.09', 'Чт 18.09', 'Пт 19.09', 'Сб 20.09', 'Вс 21.09'].map((d, i) => (
                    <div key={i} style={{ fontWeight: 'bold', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>{d}</div>
                  ))}

                  {ships.map(ship => (
                    <React.Fragment key={ship.id}>
                      <div style={{ padding: '14px 10px', textAlign: 'left', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                        <Anchor size={14} color="#60a5fa" />
                        {ship.name}
                      </div>
                      {[0, 1, 2, 3, 4, 5, 6].map(dayIdx => (
                        <div key={dayIdx} style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px dashed var(--border-color)', minHeight: '80px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ fontSize: '11px', background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', borderRadius: '4px', padding: '4px' }}>
                            20:00 Рок-Круиз
                            <div style={{ fontSize: '9px', opacity: 0.8 }}>Загрузка: 85%</div>
                          </div>
                          {dayIdx >= 4 && (
                            <div style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', borderRadius: '4px', padding: '4px' }}>
                              23:30 Джаз/Мосты
                              <div style={{ fontSize: '9px', opacity: 0.8 }}>Загрузка: 92%</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* СЕКЦИЯ 3: 🎫 ЗАКАЗЫ И БИЛЕТЫ (ПОИСК, ВОЗВРАТЫ, QR) */}
        {/* ============================================================ */}
        {activeNav === 'orders' && (
          <div>
            <div className="glass" style={{ padding: '20px 24px', borderRadius: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{ fontSize: '26px', margin: 0 }}>🎫 Реестр заказов и билетов</h1>
                <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                  Поиск бронирований, проведение возвратов, повторная отправка билетов и валидация.
                </p>
              </div>

              {/* Search & Filter Controls */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Поиск по ФИО, телефону, месту..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '36px', width: '260px' }}
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field"
                  style={{ width: '160px' }}
                >
                  <option value="all">Все статусы</option>
                  <option value="confirmed">Оплаченные</option>
                  <option value="pending">Ожидают оплаты</option>
                  <option value="cancelled">Возвраты / Отмены</option>
                </select>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="glass" style={{ padding: '20px', borderRadius: '16px' }}>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>№ Заказа</th>
                      <th>Гость</th>
                      <th>Контакты</th>
                      <th>Рейс</th>
                      <th>Место / Категория</th>
                      <th>Оплачено</th>
                      <th>Статус</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                          Заказы не найдены
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b, idx) => {
                        const event = events.find(e => e.id === b.event_id) || { name: 'Вечерний круиз', date: '2026-09-18' };

                        return (
                          <tr key={b.id || idx}>
                            <td style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-muted)' }}>
                              #{String(b.id || idx + 100).substring(0, 8)}
                            </td>
                            <td style={{ fontWeight: 'bold' }}>{b.customer_name}</td>
                            <td>
                              <div>{b.customer_phone}</div>
                              <small style={{ color: 'var(--text-muted)' }}>{b.customer_email}</small>
                            </td>
                            <td>
                              <div style={{ fontWeight: '500' }}>{event.name}</div>
                              <small style={{ color: 'var(--text-muted)' }}>{event.date}</small>
                            </td>
                            <td>
                              <span style={{ 
                                padding: '3px 8px', 
                                borderRadius: '4px', 
                                fontSize: '11px', 
                                background: b.seat_category === 'vip' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                color: b.seat_category === 'vip' ? '#fbbf24' : '#93c5fd',
                                fontWeight: 'bold'
                              }}>
                                {b.seat_number} ({b.seat_category === 'vip' ? 'VIP' : 'Стандарт'})
                              </span>
                            </td>
                            <td style={{ fontWeight: 'bold', color: 'var(--color-success)' }}>
                              {Number(b.price_paid || 0).toLocaleString('ru-RU')} ₽
                            </td>
                            <td>
                              <span style={{ 
                                padding: '4px 8px', 
                                borderRadius: '6px', 
                                fontSize: '11px', 
                                background: b.status === 'confirmed' ? 'rgba(16, 185, 129, 0.15)' : b.status === 'pending' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                color: b.status === 'confirmed' ? '#34d399' : b.status === 'pending' ? '#fbbf24' : '#f87171',
                                fontWeight: 'bold'
                              }}>
                                {b.status === 'confirmed' ? 'Оплачен' : b.status === 'pending' ? 'Холд 20м' : 'Возврат'}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button 
                                  onClick={() => alert(`Билет #${String(b.id).substring(0,8)} отправлен гостю на ${b.customer_email}!`)}
                                  className="btn btn-secondary" 
                                  style={{ padding: '4px 8px', fontSize: '11px' }}
                                  title="Повторно отправить QR-код"
                                >
                                  <Send size={12} />
                                </button>
                                {b.status === 'confirmed' && (
                                  <button 
                                    onClick={() => {
                                      if (confirm(`Оформить возврат ${b.price_paid} ₽ гостю ${b.customer_name}?`)) {
                                        b.status = 'cancelled';
                                        setBookings([...bookings]);
                                        alert('Возврат средств проведен через эквайринг.');
                                      }
                                    }}
                                    className="btn btn-secondary" 
                                    style={{ padding: '4px 8px', fontSize: '11px', color: '#f87171' }}
                                    title="Оформить возврат"
                                  >
                                    Возврат
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* СЕКЦИЯ 4: 🤝 ПАРТНЕРЫ (B2B, АГЕНТЫ, СВЕРКИ, КОМИССИИ) */}
        {/* ============================================================ */}
        {activeNav === 'partners' && (
          <div>
            <div className="glass" style={{ padding: '20px 24px', borderRadius: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{ fontSize: '26px', margin: 0 }}>🤝 Партнерская B2B сеть (Отели & Агенты)</h1>
                <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                  Назначение комиссий, взаиморасчеты, генерация промокодов и акты сверки с консьерж-службами.
                </p>
              </div>

              <button 
                onClick={() => alert('Открыта форма добавления нового B2B контрагента')}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={16} /> Подключить отель / партнера
              </button>
            </div>

            {/* Agents List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {agents.map(ag => (
                <div key={ag.id} className="glass" style={{ padding: '20px', borderRadius: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px' }}>{ag.name}</h3>
                      <span style={{ fontSize: '11px', background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                        {(ag.rate * 100).toFixed(0)}% комиссия
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                      Промокод: <b style={{ color: '#fbbf24' }}>{ag.code}</b>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', marginBottom: '14px' }}>
                      <div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Продано билетов</div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{ag.bookingsCount} шт.</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Объем продаж</div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#60a5fa' }}>{ag.totalSold.toLocaleString('ru-RU')} ₽</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>К выплате:</span>
                      <b style={{ fontSize: '16px', color: 'var(--color-success)' }}>{ag.balance.toLocaleString('ru-RU')} ₽</b>
                    </div>
                    <button 
                      onClick={() => alert(`Сформирован акт сверки и платежное поручение для ${ag.name} на сумму ${ag.balance} ₽`)}
                      className="btn btn-secondary" 
                      style={{ width: '100%', fontSize: '12px' }}
                    >
                      Сформировать акт сверки
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* СЕКЦИЯ 5: 💰 ФИНАНСЫ (ДДС, ОПиУ / P&L, UNIT-ЭКОНОМИКА) */}
        {/* ============================================================ */}
        {activeNav === 'finances' && (
          <div>
            <div className="glass" style={{ padding: '20px 24px', borderRadius: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{ fontSize: '26px', margin: 0 }}>💰 Финансово-управленческий учет</h1>
                <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                  Отчет о движении денежных средств (ДДС), P&L с разделением затрат и Unit-экономика каждого рейса.
                </p>
              </div>

              {/* Subtabs for Finances */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setFinanceTab('dds')}
                  className={`btn ${financeTab === 'dds' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '8px 16px' }}
                >
                  <DollarSign size={15} /> Отчет ДДС (Cash Flow)
                </button>
                <button
                  onClick={() => setFinanceTab('pnl')}
                  className={`btn ${financeTab === 'pnl' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '8px 16px' }}
                >
                  <PieChart size={15} /> Отчет ОПиУ (P&L)
                </button>
                <button
                  onClick={() => setFinanceTab('unit')}
                  className={`btn ${financeTab === 'unit' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '8px 16px' }}
                >
                  <Sliders size={15} /> Юнит-экономика рейсов
                </button>
              </div>
            </div>

            {/* Вкладка 1: ДДС (Cash Flow) */}
            {financeTab === 'dds' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  <div className="glass" style={{ padding: '20px', borderRadius: '14px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Всего поступлений (Cash In)</div>
                    <div style={{ fontSize: '26px', fontWeight: 'bold', color: 'var(--color-success)', margin: '8px 0' }}>
                      +{kpis.totalRevenue.toLocaleString('ru-RU')} ₽
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Эквайринг, СБП, Отели</div>
                  </div>

                  <div className="glass" style={{ padding: '20px', borderRadius: '14px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Всего выплат (Cash Out)</div>
                    <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#f87171', margin: '8px 0' }}>
                      -{kpis.totalExp.toLocaleString('ru-RU')} ₽
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>ГСМ, ЗП, Аренда, Артисты</div>
                  </div>

                  <div className="glass" style={{ padding: '20px', borderRadius: '14px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Чистый денежный поток (Net Cash Flow)</div>
                    <div style={{ fontSize: '26px', fontWeight: 'bold', color: kpis.netProfit >= 0 ? '#60a5fa' : '#f87171', margin: '8px 0' }}>
                      {kpis.netProfit >= 0 ? '+' : ''}{kpis.netProfit.toLocaleString('ru-RU')} ₽
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Сальдо на расчетных счетах</div>
                  </div>
                </div>

                <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
                  <h3 style={{ margin: '0 0 16px' }}>Журнал движения денежных средств (Статьи ДДС)</h3>
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Дата</th>
                          <th>Тип</th>
                          <th>Категория / Статья</th>
                          <th>Сумма</th>
                          <th>Описание</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ background: 'rgba(16, 185, 129, 0.05)' }}>
                          <td>2026-09-18</td>
                          <td><span style={{ color: '#34d399', fontWeight: 'bold' }}>Поступление</span></td>
                          <td>Продажи билетов B2C</td>
                          <td style={{ fontWeight: 'bold', color: '#34d399' }}>+{kpis.totalRevenue.toLocaleString('ru-RU')} ₽</td>
                          <td>Онлайн-эквайринг через сайт и виджеты</td>
                        </tr>
                        {expensesList.map(e => (
                          <tr key={e.id}>
                            <td>{e.date}</td>
                            <td><span style={{ color: '#f87171', fontWeight: 'bold' }}>Выплата</span></td>
                            <td>{e.category}</td>
                            <td style={{ fontWeight: 'bold', color: '#f87171' }}>-{e.amount.toLocaleString('ru-RU')} ₽</td>
                            <td>{e.desc} {e.eventName ? `(${e.eventName})` : ''}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Вкладка 2: ОПиУ (P&L / Profit & Loss) */}
            {financeTab === 'pnl' && (
              <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ margin: '0 0 20px', fontSize: '18px' }}>Отчет о финансовых результатах (P&L)</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '800px' }}>
                  {/* 1. Выручка */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px' }}>
                    <span>1. Выручка от реализации (Revenue)</span>
                    <span style={{ color: 'var(--color-success)' }}>{kpis.totalRevenue.toLocaleString('ru-RU')} ₽</span>
                  </div>

                  {/* 2. Переменные расходы */}
                  <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#f87171', marginBottom: '10px' }}>
                      <span>2. Переменные затраты (Variable Costs / COGS)</span>
                      <span>-{kpis.totalVariableExp.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>• Топливо (ГСМ) на совершенные рейсы</span>
                        <span>18 500 ₽</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>• Гонорары артистов и экскурсоводов</span>
                        <span>15 000 ₽</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>• Причальные сборы и швартовка</span>
                        <span>4 500 ₽</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. Маржинальная прибыль */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px' }}>
                    <span>3. Маржинальная прибыль (Gross Margin)</span>
                    <span style={{ color: '#34d399' }}>
                      {(kpis.totalRevenue - kpis.totalVariableExp).toLocaleString('ru-RU')} ₽ ({kpis.marginPercent.toFixed(1)}%)
                    </span>
                  </div>

                  {/* 4. Постоянные расходы */}
                  <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#f87171', marginBottom: '10px' }}>
                      <span>4. Постоянные расходы (Fixed Costs / OPEX)</span>
                      <span>-{kpis.totalFixedExp.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>• Оклады экипажа судов (капитаны, мотористы)</span>
                        <span>180 000 ₽</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>• Аренда стоянки флота (Уткина заводь)</span>
                        <span>95 000 ₽</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>• Маркетинг, контекст и продвижение</span>
                        <span>65 000 ₽</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>• IT-инфраструктура Yandex Cloud и CRM</span>
                        <span>12 000 ₽</span>
                      </div>
                    </div>
                  </div>

                  {/* 5. Чистая прибыль */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: kpis.netProfit >= 0 ? 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(16,185,129,0.2))' : 'rgba(239,68,68,0.2)', borderRadius: '12px', fontWeight: 'bold', fontSize: '18px' }}>
                    <span>5. Чистая прибыль (Net Profit / EBITDA)</span>
                    <span style={{ color: kpis.netProfit >= 0 ? 'var(--color-success)' : '#f87171' }}>
                      {kpis.netProfit.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Вкладка 3: Юнит-экономика рейса */}
            {financeTab === 'unit' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                {/* Список рейсов для выбора */}
                <div className="glass" style={{ padding: '20px', borderRadius: '16px' }}>
                  <h3 style={{ margin: '0 0 14px', fontSize: '15px' }}>Выберите рейс:</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {events.map(ev => (
                      <button
                        key={ev.id}
                        onClick={() => setSelectedEventForUnit(ev.id)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          background: selectedEventForUnit === ev.id ? 'var(--color-primary)' : 'rgba(255,255,255,0.04)',
                          color: '#ffffff',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px'
                        }}
                      >
                        <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{ev.name}</span>
                        <span style={{ fontSize: '11px', opacity: 0.8 }}>{ev.date} в {ev.time}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Карточка рентабельности выбранного рейса */}
                {(() => {
                  const ev = events.find(e => e.id === selectedEventForUnit) || events[0];
                  if (!ev) return null;
                  const ship = ships.find(s => s.id === ev.ship_id) || { name: 'Рок Хит Нева', capacity: 80 };
                  const evBookings = bookings.filter(b => b.event_id === ev.id && b.status === 'confirmed');
                  const evRevenue = evBookings.reduce((sum, b) => sum + Number(b.price_paid || 0), 0);
                  
                  // Direct flight expenses
                  const fuelCost = 18500;
                  const artistCost = 15000;
                  const pierCost = 4500;
                  const totalDirectCost = fuelCost + artistCost + pierCost;
                  const flightMargin = evRevenue - totalDirectCost;
                  const breakEvenTickets = Math.ceil(totalDirectCost / (ev.price_standard || 1500));

                  return (
                    <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                        <div>
                          <h2 style={{ margin: 0, fontSize: '20px' }}>Калькулятор рентабельности рейса</h2>
                          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                            {ev.name} • {ev.date} ({ev.time}) на теплоходе «{ship.name}»
                          </p>
                        </div>
                        <span style={{ 
                          padding: '6px 12px', 
                          borderRadius: '8px', 
                          fontWeight: 'bold', 
                          fontSize: '13px',
                          background: flightMargin >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: flightMargin >= 0 ? '#34d399' : '#f87171'
                        }}>
                          {flightMargin >= 0 ? 'Рейс прибыльный' : 'Рейс убыточный'}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
                        <div style={{ padding: '14px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Выручка рейса</div>
                          <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-success)' }}>
                            {evRevenue.toLocaleString('ru-RU')} ₽
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{evBookings.length} билетов</div>
                        </div>

                        <div style={{ padding: '14px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Прямые затраты на рейс</div>
                          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f87171' }}>
                            {totalDirectCost.toLocaleString('ru-RU')} ₽
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ГСМ + Артисты + Причал</div>
                        </div>

                        <div style={{ padding: '14px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Маржа рейса</div>
                          <div style={{ fontSize: '20px', fontWeight: 'bold', color: flightMargin >= 0 ? '#60a5fa' : '#f87171' }}>
                            {flightMargin >= 0 ? '+' : ''}{flightMargin.toLocaleString('ru-RU')} ₽
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Безубыточность: {breakEvenTickets} билетов</div>
                        </div>
                      </div>

                      {/* Detailed Cost Breakdown */}
                      <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <h4 style={{ margin: '0 0 12px', fontSize: '14px' }}>Структура прямых расходов на этот рейс:</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>⛽ Топливо (ГСМ): 250 л дизеля</span>
                            <b>{fuelCost.toLocaleString('ru-RU')} ₽</b>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>🎸 Гонорар музыкальной кавер-группы</span>
                            <b>{artistCost.toLocaleString('ru-RU')} ₽</b>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>⚓ Причальный сбор (Дворцовая набережная)</span>
                            <b>{pierCost.toLocaleString('ru-RU')} ₽</b>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* СЕКЦИЯ 6: ⚙️ НАСТРОЙКИ (ТЕПЛОХОДЫ, ПРИЧАЛЫ, ТАРИФЫ, ДОСТУПЫ) */}
        {/* ============================================================ */}
        {activeNav === 'settings' && (
          <div>
            <div className="glass" style={{ padding: '20px 24px', borderRadius: '16px', marginBottom: '24px' }}>
              <h1 style={{ fontSize: '26px', margin: 0 }}>⚙️ Системные настройки и флот</h1>
              <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                Управление характеристиками судов, точками посадки, тарифами и ролями сотрудников.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              
              {/* Флот */}
              <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Ship size={18} color="#60a5fa" />
                  Управление судами флота
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {ships.map(s => (
                    <div key={s.id} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{s.name}</div>
                        <small style={{ color: 'var(--text-muted)' }}>Вместимость: {s.capacity} пассажиров</small>
                      </div>
                      <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '11px' }}>
                        Схема палубы
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Причалы */}
              <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Anchor size={18} color="#10b981" />
                  Причалы и точки посадки
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { name: 'Дворцовая наб., 18 (Главный причал)', rate: '4 500 ₽/рейс' },
                    { name: 'Сенатская пристань (Медный всадник)', rate: '5 000 ₽/рейс' },
                    { name: 'Набережная Фонтанки, 34', rate: '3 500 ₽/рейс' }
                  ].map((p, idx) => (
                    <div key={idx} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span>{p.name}</span>
                      <b style={{ color: '#fbbf24' }}>{p.rate}</b>
                    </div>
                  ))}
                </div>
              </div>

              {/* Доступы */}
              <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserCheck size={18} color="#f59e0b" />
                  Права доступа и роли
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                    <span>Владелец / Главный админ</span>
                    <span style={{ color: '#34d399', fontWeight: 'bold' }}>Полный доступ</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                    <span>Менеджер расписания</span>
                    <span>Только Операционка</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                    <span>Кассир причала</span>
                    <span>Только Продажи & Сканер</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* ============================================================ */}
      {/* МОДАЛЬНОЕ ОКНО СОЗДАНИЯ РЕЙСА */}
      {/* ============================================================ */}
      {isCreateModalOpen && (
        <div className="modal-backdrop">
          <div className="glass modal-content" style={{ maxWidth: '500px', width: '90%', padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>Добавить новый рейс</h2>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateNewEvent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Название программы / рейса</label>
                <input
                  type="text"
                  required
                  placeholder="например, Вечерний Рок-Круиз под мостами"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Дата</label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Время отправления</label>
                  <input
                    type="time"
                    required
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Теплоход</label>
                <select
                  value={newEventShipId}
                  onChange={(e) => setNewEventShipId(e.target.value)}
                  className="input-field"
                  style={{ width: '100%' }}
                >
                  {ships.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.capacity} мест)</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Цена Стандарт (₽)</label>
                  <input
                    type="number"
                    required
                    value={newEventPriceStd}
                    onChange={(e) => setNewEventPriceStd(e.target.value)}
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Цена VIP (₽)</label>
                  <input
                    type="number"
                    required
                    value={newEventPriceVip}
                    onChange={(e) => setNewEventPriceVip(e.target.value)}
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Отмена
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Создать рейс
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
