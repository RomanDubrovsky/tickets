import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, Ship, Ticket, Users, DollarSign, Settings, 
  AlertTriangle, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, 
  CheckCircle2, Clock, Plus, Search, FileText, Layers, 
  Percent, Shield, QrCode, RefreshCw, Sliders, ChevronRight, 
  Filter, Download, Eye, Trash2, Edit3, CreditCard, Wallet, 
  Fuel, Anchor, AlertCircle, Check, X, PieChart, Sparkles,
  HelpCircle, UserCheck, Smartphone, Send, ArrowRight,
  Key, Save, ExternalLink, ShieldCheck, Lock, Unlock, Phone, Mail
} from 'lucide-react';
import { 
  getEvents, getShips, getBookings, getHalls, createEvent, createBooking,
  getAdminAgentsBreakdown, getAdminSalesDynamics, getAdminStaffSchedules, getAdminYearlySummary
} from '../db';

export default function AdminPanel() {
  const [activeNav, setActiveNav] = useState('dashboard'); // 'dashboard', 'operations', 'orders', 'partners', 'finances', 'settings'
  const [financeTab, setFinanceTab] = useState('dds'); // 'dds', 'pnl', 'unit'
  const [operationsTab, setOperationsTab] = useState('schedule'); // 'schedule', 'matrix', 'staff'
  const [timeFilter, setTimeFilter] = useState('month'); // 'today', 'week', 'month', 'season'

  // Core Data
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [events, setEvents] = useState([]);
  const [ships, setShips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Live Analytics Data
  const [agentsBreakdown, setAgentsBreakdown] = useState([]);
  const [salesDynamics, setSalesDynamics] = useState([]);
  const [staffSchedules, setStaffSchedules] = useState([]);
  const [yearlySummary, setYearlySummary] = useState([]);
  const [selectedYearCompare, setSelectedYearCompare] = useState('all');

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

  // Settings & System Management State
  const [piers, setPiers] = useState([
    { id: 'pier_1', name: 'Дворцовая наб., 18 (Главный причал)', rate: 4500, address: 'Дворцовая набережная, 18', status: 'active', desc: 'Центральный причал отправления рок-круизов' },
    { id: 'pier_2', name: 'Сенатская пристань (Медный всадник)', rate: 5000, address: 'Английская набережная, 2', status: 'active', desc: 'Точка посадки ночных джазовых программ' },
    { id: 'pier_3', name: 'Набережная Фонтанки, 34', rate: 3500, address: 'наб. реки Фонтанки, 34 (Шереметевский дворец)', status: 'active', desc: 'Камерные прогулки по малым рекам и каналам' }
  ]);
  const [isPierModalOpen, setIsPierModalOpen] = useState(false);
  const [editingPier, setEditingPier] = useState(null);
  const [pierFormName, setPierFormName] = useState('');
  const [pierFormRate, setPierFormRate] = useState(4500);
  const [pierFormAddress, setPierFormAddress] = useState('');
  const [pierFormDesc, setPierFormDesc] = useState('');

  const [employees, setEmployees] = useState([
    { id: 'emp_1', name: 'Роман Дубровский', role: 'Владелец / Главный админ', email: 'director@rockhitneva.ru', phone: '+7 (921) 999-00-11', pin: '9900', status: 'active', permissions: 'Полный доступ (все модули, ДДС, P&L, настройки)' },
    { id: 'emp_2', name: 'Анна Смирнова', role: 'Менеджер расписания', email: 'manager@rockhitneva.ru', phone: '+7 (921) 444-22-33', pin: '4521', status: 'active', permissions: 'Репертуар, сессии, флот, площадки' },
    { id: 'emp_3', name: 'Дмитрий Соколов', role: 'Старший кассир причала', email: 'kassa1@rockhitneva.ru', phone: '+7 (921) 333-55-66', pin: '1234', status: 'active', permissions: 'Касса причала, продажа, возвраты' },
    { id: 'emp_4', name: 'Михаил Ковалев', role: 'Контролер трапа', email: 'scanner@rockhitneva.ru', phone: '+7 (921) 777-88-99', pin: '7788', status: 'active', permissions: 'Мобильный PWA-сканер QR-билетов' }
  ]);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [empFormName, setEmpFormName] = useState('');
  const [empFormRole, setEmpFormRole] = useState('Менеджер расписания');
  const [empFormEmail, setEmpFormEmail] = useState('');
  const [empFormPhone, setEmpFormPhone] = useState('');
  const [empFormPin, setEmpFormPin] = useState('');

  const [platformRules, setPlatformRules] = useState({
    bookingHoldMinutes: 20,
    turnaroundBufferMinutes: 30,
    lowCapacityAlertThreshold: 30,
    acquiringFeePercent: 2.3,
    telegramAlertChatId: '@ships_director_bot',
    autoReleaseUnpaid: true
  });
  const [isRulesSavedToast, setIsRulesSavedToast] = useState(false);

  // Pier Handlers
  const handleOpenAddPier = () => {
    setEditingPier(null);
    setPierFormName('');
    setPierFormRate(4500);
    setPierFormAddress('');
    setPierFormDesc('');
    setIsPierModalOpen(true);
  };

  const handleOpenEditPier = (pier) => {
    setEditingPier(pier);
    setPierFormName(pier.name);
    setPierFormRate(pier.rate);
    setPierFormAddress(pier.address);
    setPierFormDesc(pier.desc || '');
    setIsPierModalOpen(true);
  };

  const handleSavePier = (e) => {
    e.preventDefault();
    if (!pierFormName) return;
    if (editingPier) {
      setPiers(piers.map(p => p.id === editingPier.id ? { ...p, name: pierFormName, rate: Number(pierFormRate), address: pierFormAddress, desc: pierFormDesc } : p));
    } else {
      const newPier = {
        id: `pier_${Date.now()}`,
        name: pierFormName,
        rate: Number(pierFormRate),
        address: pierFormAddress,
        desc: pierFormDesc,
        status: 'active'
      };
      setPiers([...piers, newPier]);
    }
    setIsPierModalOpen(false);
  };

  const handleDeletePier = (id) => {
    if (confirm('Вы уверены, что хотите удалить этот причал?')) {
      setPiers(piers.filter(p => p.id !== id));
    }
  };

  // Employee Handlers
  const handleOpenAddEmployee = () => {
    setEditingEmployee(null);
    setEmpFormName('');
    setEmpFormRole('Менеджер расписания');
    setEmpFormEmail('');
    setEmpFormPhone('');
    setEmpFormPin(String(Math.floor(1000 + Math.random() * 9000)));
    setIsEmployeeModalOpen(true);
  };

  const handleOpenEditEmployee = (emp) => {
    setEditingEmployee(emp);
    setEmpFormName(emp.name);
    setEmpFormRole(emp.role);
    setEmpFormEmail(emp.email);
    setEmpFormPhone(emp.phone);
    setEmpFormPin(emp.pin);
    setIsEmployeeModalOpen(true);
  };

  const handleSaveEmployee = (e) => {
    e.preventDefault();
    if (!empFormName) return;

    const rolePermissionsMap = {
      'Владелец / Главный админ': 'Полный доступ (все модули, ДДС, P&L, настройки)',
      'Менеджер расписания': 'Репертуар, сессии, флот, площадки',
      'Старший кассир причала': 'Касса причала, продажа, возвраты',
      'Контролер трапа': 'Мобильный PWA-сканер QR-билетов'
    };

    if (editingEmployee) {
      setEmployees(employees.map(emp => emp.id === editingEmployee.id ? {
        ...emp,
        name: empFormName,
        role: empFormRole,
        email: empFormEmail,
        phone: empFormPhone,
        pin: empFormPin,
        permissions: rolePermissionsMap[empFormRole] || 'Базовый доступ'
      } : emp));
    } else {
      const newEmp = {
        id: `emp_${Date.now()}`,
        name: empFormName,
        role: empFormRole,
        email: empFormEmail,
        phone: empFormPhone,
        pin: empFormPin,
        status: 'active',
        permissions: rolePermissionsMap[empFormRole] || 'Базовый доступ'
      };
      setEmployees([...employees, newEmp]);
    }
    setIsEmployeeModalOpen(false);
  };

  const handleToggleEmployeeStatus = (id) => {
    setEmployees(employees.map(emp => emp.id === id ? { ...emp, status: emp.status === 'active' ? 'blocked' : 'active' } : emp));
  };

  const handleDeleteEmployee = (id) => {
    if (confirm('Удалить сотрудника из системы?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  const handleSaveRules = (e) => {
    e.preventDefault();
    setIsRulesSavedToast(true);
    setTimeout(() => setIsRulesSavedToast(false), 3500);
  };

  // Load live data from database
  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedEvents, fetchedShips, fetchedHalls, fetchedBookings, aBreakdown, sDynamics, sSchedules, ySummary] = await Promise.all([
        getEvents(),
        getShips(),
        getHalls(),
        getBookings(),
        getAdminAgentsBreakdown(),
        getAdminSalesDynamics(),
        getAdminStaffSchedules(),
        getAdminYearlySummary()
      ]);
      setEvents(fetchedEvents || []);
      setShips(fetchedShips || []);
      setHalls(fetchedHalls || []);
      setBookings(fetchedBookings || []);
      setAgentsBreakdown(aBreakdown || []);
      setSalesDynamics(sDynamics || []);
      setStaffSchedules(sSchedules || []);
      setYearlySummary(ySummary || []);
      
      if (fetchedShips?.length > 0) setNewEventShipId(fetchedShips[0].id);
      if (fetchedEvents?.length > 0) setSelectedEventForUnit(fetchedEvents[0].id);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === 'solodka') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setAuthError('');
      loadData();
    } else {
      setAuthError('Неверный пароль администратора');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    setPasswordInput('');
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

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

    // 3. Partner Commission threshold alert (Demo simulation)
    const totalUnpaidPartnerCommission = agents.reduce((sum, a) => sum + a.balance, 0);
    if (totalUnpaidPartnerCommission > 50000) {
      alerts.push({
        id: 'alert_partner_payout',
        level: 'info',
        isDemo: true,
        title: `Задолженность перед партнерами: ${totalUnpaidPartnerCommission.toLocaleString('ru-RU')} ₽`,
        message: `Накопились агентские вознаграждения за прошедшую неделю для 4 отелей (Демонстрационный сценарий расчета B2B выплат).`,
        action: 'Сформировать реестр выплат',
        targetTab: 'partners'
      });
    }

    return alerts;
  }, [events, ships, bookings, agents]);

  // Filtered Bookings & Events based on active timeFilter (today, week, month, season)
  const filteredEventsAndBookings = useMemo(() => {
    // Find latest date in data or fallback to today
    let referenceDate = new Date();
    if (events.length > 0) {
      const dates = events.map(e => new Date(e.date).getTime()).filter(t => !isNaN(t));
      if (dates.length > 0) {
        referenceDate = new Date(Math.max(...dates));
      }
    }

    const eventDateMap = new Map();
    events.forEach(ev => {
      eventDateMap.set(ev.id, new Date(ev.date));
    });

    const isWithinFilter = (itemDate) => {
      if (!itemDate || isNaN(itemDate.getTime())) return true;
      const diffDays = (referenceDate - itemDate) / (1000 * 60 * 60 * 24);
      if (timeFilter === 'today') return diffDays >= -1 && diffDays <= 1;
      if (timeFilter === 'week') return diffDays >= -1 && diffDays <= 7;
      if (timeFilter === 'month') return diffDays >= -1 && diffDays <= 30;
      return true; // 'season' / all
    };

    const currentBookings = bookings.filter(b => {
      const evDate = eventDateMap.get(b.event_id);
      return isWithinFilter(evDate);
    });

    const currentEvents = events.filter(ev => isWithinFilter(new Date(ev.date)));

    return {
      filteredBookingsList: currentBookings,
      filteredEventsList: currentEvents,
      referenceDate
    };
  }, [events, bookings, timeFilter]);

  // Aggregate Financial & Operations KPIs (Dynamically reacts to timeFilter)
  const kpis = useMemo(() => {
    const { filteredBookingsList, filteredEventsList } = filteredEventsAndBookings;
    const totalConfirmedBookings = filteredBookingsList.filter(b => b.status === 'confirmed');
    const totalTicketsCount = totalConfirmedBookings.reduce((sum, b) => sum + Number(b.tickets_count || 1), 0);
    const totalRevenue = totalConfirmedBookings.reduce((sum, b) => sum + Number(b.price_paid || 0), 0);
    const avgTicket = totalTicketsCount > 0 ? totalRevenue / totalTicketsCount : 1500;
    
    // Scale expenses based on filter
    const expScale = timeFilter === 'today' ? 0.03 : timeFilter === 'week' ? 0.25 : timeFilter === 'month' ? 1.0 : 3.5;
    const totalVariableExp = expensesList.filter(e => e.type === 'variable').reduce((sum, e) => sum + e.amount, 0) * expScale;
    const totalFixedExp = expensesList.filter(e => e.type === 'fixed').reduce((sum, e) => sum + e.amount, 0) * expScale;
    const totalExp = totalVariableExp + totalFixedExp;
    const netProfit = totalRevenue - totalExp;
    const marginPercent = totalRevenue > 0 ? ((totalRevenue - totalVariableExp) / totalRevenue) * 100 : 0;

    // Load factor across fleet for filtered period
    const totalCapacityAvailable = filteredEventsList.reduce((sum, ev) => {
      const ship = ships.find(s => s.id === ev.ship_id);
      return sum + (ship?.capacity || 100);
    }, 0);
    const fleetLoadFactor = totalCapacityAvailable > 0 
      ? Math.min(100, (totalTicketsCount / totalCapacityAvailable) * 100)
      : 74.5;

    return {
      totalRevenue,
      totalTickets: totalTicketsCount,
      avgTicket,
      totalExp,
      totalVariableExp,
      totalFixedExp,
      netProfit,
      marginPercent,
      fleetLoadFactor
    };
  }, [filteredEventsAndBookings, expensesList, ships, timeFilter]);

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

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '440px', margin: '80px auto', padding: '0 20px' }}>
        <div className="glass" style={{ padding: '36px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Shield size={32} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>Вход для администратора</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
            Доступ к финансовым отчетам, флоту и бронированиям
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <input
                type="password"
                placeholder="Введите пароль администратора"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
                className="input-field"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: authError ? '1px solid #ef4444' : '1px solid var(--border-color)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'var(--text-main)',
                  fontSize: '15px',
                  outline: 'none',
                  textAlign: 'center'
                }}
              />
              {authError && (
                <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px', fontWeight: '500' }}>
                  {authError}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Войти в панель управления
            </button>
          </form>
        </div>
      </div>
    );
  }

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

        {/* Logout button */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: '16px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            background: 'rgba(239, 68, 68, 0.08)',
            color: '#f87171',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <span>Выйти из пульта</span>
        </button>
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
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', flexWrap: 'wrap', gap: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '14px', color: alert.level === 'critical' ? '#f87171' : alert.level === 'info' ? '#60a5fa' : '#fbbf24' }}>
                              {alert.title}
                            </span>
                            {alert.isDemo && (
                              <span style={{
                                fontSize: '10px',
                                background: '#f59e0b',
                                color: '#000',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}>
                                ДЕМО-СЦЕНАРИЙ
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '10px', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px', background: alert.level === 'critical' ? '#ef4444' : alert.level === 'info' ? '#2563eb' : '#f59e0b', color: '#fff', fontWeight: 'bold' }}>
                            {alert.level === 'critical' ? 'Критично' : alert.level === 'info' ? 'Инфо' : 'Внимание'}
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
                  <h3 style={{ margin: 0, fontSize: '16px' }}>
                    Динамика продаж (Билеты) • {timeFilter === 'today' ? 'За 24 часа' : timeFilter === 'week' ? 'За 7 дней' : timeFilter === 'month' ? 'За 30 дней' : 'За сезон'}
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>В штуках</span>
                </div>

                {/* SVG Chart */}
                <div style={{ height: '180px', width: '100%', display: 'flex', alignItems: 'flex-end', gap: '8px', paddingTop: '20px', overflowX: 'auto' }}>
                  {(() => {
                    const limitCount = timeFilter === 'today' ? 3 : timeFilter === 'week' ? 7 : timeFilter === 'month' ? 14 : 28;
                    const displayData = salesDynamics.slice(0, limitCount).reverse();
                    const maxTickets = Math.max(...displayData.map(d => Number(d.total_tickets) || 0), 10);
                    
                    if (displayData.length === 0) {
                      return <div style={{ color: 'var(--text-muted)', margin: 'auto', fontSize: '12px' }}>Нет данных за выбранный период</div>;
                    }

                    return displayData.map((dayData, i) => {
                      const val = Number(dayData.total_tickets) || 0;
                      const pct = Math.max(8, (val / maxTickets) * 100);
                      const dateObj = new Date(dayData.date);
                      const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
                      
                      return (
                        <div key={i} style={{ flex: 1, minWidth: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{val}</span>
                          <div 
                            style={{ 
                              width: '100%', 
                              height: `${pct}%`, 
                              background: isWeekend ? 'linear-gradient(180deg, #3b82f6, #1d4ed8)' : 'rgba(255,255,255,0.2)', 
                              borderRadius: '4px 4px 0 0',
                              transition: 'all 0.3s'
                            }} 
                            title={`${dayData.date}: ${val} билетов`}
                          />
                          <span style={{ fontSize: '10px', color: isWeekend ? '#60a5fa' : 'var(--text-secondary)' }}>
                            {dateObj.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Доли агентов */}
              <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px' }}>Доли агентов по продажам</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {agentsBreakdown.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Нет данных</div>
                  ) : (
                    agentsBreakdown.slice(0, 5).map((agent, idx) => {
                      const maxAgent = Math.max(...agentsBreakdown.map(a => Number(a.total_tickets) || 0));
                      const share = ((Number(agent.total_tickets) / maxAgent) * 100) + '%';
                      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
                      const color = colors[idx % colors.length];
                      
                      return (
                        <div key={idx}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                            <span style={{ fontWeight: '500' }}>{agent.agent_name || 'Прямые продажи'}</span>
                            <b>{agent.total_tickets} шт.</b>
                          </div>
                          <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: share, height: '100%', background: color }}></div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

            {/* 4. СРАВНИТЕЛЬНАЯ АНАЛИТИКА ПО ГОДАМ (YEAR-OVER-YEAR / YoY) */}
            <div className="glass" style={{ padding: '24px', borderRadius: '16px', marginTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={20} color="#10b981" />
                    Сравнение показателей по сезонам (2023 – 2026 гг.)
                  </h3>
                  <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '12px' }}>
                    Историческая динамика выручки, пассажиропотока, количества рейсов и среднего чека на основе архива продаж.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {['all', '2026', '2025', '2024', '2023'].map(yr => (
                    <button
                      key={yr}
                      onClick={() => setSelectedYearCompare(yr)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: selectedYearCompare === yr ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                        color: selectedYearCompare === yr ? '#fff' : 'var(--text-secondary)',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      {yr === 'all' ? 'Все сезоны' : `${yr} год`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Карточки по годам */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                {(yearlySummary.length > 0 ? yearlySummary : [
                  { year: '2023', revenue: 277696800, tickets: 231414, avgTicket: 1200, trips: 1840, growth: '+15.2%', topAgent: 'Горбилет (42%)' },
                  { year: '2024', revenue: 692000000, tickets: 494281, avgTicket: 1400, trips: 3250, growth: '+113.5%', topAgent: 'Горбилет (48%)' },
                  { year: '2025', revenue: 465292500, tickets: 310195, avgTicket: 1500, trips: 2480, growth: '-37.2%', topAgent: 'Горбилет (45%)' },
                  { year: '2026', revenue: 392928000, tickets: 261952, avgTicket: 1500, trips: 2190, growth: 'В процессе', topAgent: 'Горбилет (52%)' }
                ])
                  .filter(item => selectedYearCompare === 'all' || item.year === selectedYearCompare)
                  .map((item, idx) => (
                    <div 
                      key={item.year}
                      style={{
                        padding: '18px',
                        borderRadius: '14px',
                        background: item.year === '2026' ? 'rgba(59, 130, 246, 0.12)' : 'rgba(255,255,255,0.03)',
                        border: item.year === '2026' ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(255,255,255,0.08)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: item.year === '2026' ? '#60a5fa' : '#fff' }}>
                          Сезон {item.year}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          background: item.growth.startsWith('+') ? 'rgba(16, 185, 129, 0.2)' : item.growth.startsWith('-') ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                          color: item.growth.startsWith('+') ? '#34d399' : item.growth.startsWith('-') ? '#f87171' : '#93c5fd'
                        }}>
                          {item.growth}
                        </span>
                      </div>

                      <div style={{ marginBottom: '10px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Выручка сезона</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
                          {item.revenue.toLocaleString('ru-RU')} ₽
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                        <div>
                          Пассажиров: <b style={{ color: '#fff' }}>{item.tickets.toLocaleString('ru-RU')}</b>
                        </div>
                        <div>
                          Рейсов: <b style={{ color: '#fff' }}>{item.trips.toLocaleString('ru-RU')}</b>
                        </div>
                        <div>
                          Ср. чек: <b style={{ color: '#fbbf24' }}>{item.avgTicket} ₽</b>
                        </div>
                        <div>
                          Топ: <b style={{ color: '#93c5fd' }}>{item.topAgent.split(' ')[0]}</b>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Сравнительная таблица */}
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Год / Сезон</th>
                      <th>Выручка (₽)</th>
                      <th>Продано билетов</th>
                      <th>Количество рейсов</th>
                      <th>Средний чек</th>
                      <th>Лидер продаж (Агент)</th>
                      <th>Прирост к прошлому году</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(yearlySummary.length > 0 ? yearlySummary : [
                      { year: '2023', revenue: 277696800, tickets: 231414, avgTicket: 1200, trips: 1840, growth: '+15.2%', topAgent: 'Горбилет (42%)' },
                      { year: '2024', revenue: 692000000, tickets: 494281, avgTicket: 1400, trips: 3250, growth: '+113.5%', topAgent: 'Горбилет (48%)' },
                      { year: '2025', revenue: 465292500, tickets: 310195, avgTicket: 1500, trips: 2480, growth: '-37.2%', topAgent: 'Горбилет (45%)' },
                      { year: '2026', revenue: 392928000, tickets: 261952, avgTicket: 1500, trips: 2190, growth: 'В процессе', topAgent: 'Горбилет (52%)' }
                    ]).map((row) => (
                      <tr key={row.year} style={{ background: row.year === '2026' ? 'rgba(59, 130, 246, 0.08)' : 'transparent' }}>
                        <td style={{ fontWeight: 'bold' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={14} color="#60a5fa" />
                            {row.year} {row.year === '2026' && <span style={{ fontSize: '10px', background: '#2563eb', padding: '1px 6px', borderRadius: '4px' }}>Текущий</span>}
                          </span>
                        </td>
                        <td style={{ fontWeight: 'bold', color: '#10b981' }}>{row.revenue.toLocaleString('ru-RU')} ₽</td>
                        <td>{row.tickets.toLocaleString('ru-RU')} шт.</td>
                        <td>{row.trips.toLocaleString('ru-RU')}</td>
                        <td style={{ color: '#fbbf24', fontWeight: '500' }}>{row.avgTicket} ₽</td>
                        <td>{row.topAgent}</td>
                        <td>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            background: row.growth.startsWith('+') ? 'rgba(16, 185, 129, 0.2)' : row.growth.startsWith('-') ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                            color: row.growth.startsWith('+') ? '#34d399' : row.growth.startsWith('-') ? '#f87171' : '#93c5fd'
                          }}>
                            {row.growth}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
              <button 
                onClick={() => setOperationsTab('staff')}
                className={`btn ${operationsTab === 'staff' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 16px' }}
              >
                <Users size={15} /> Расписание гидов и музыкантов
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

            {/* Operations Tab 3: Staff Schedules */}
            {operationsTab === 'staff' && (
              <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ margin: '0 0 16px' }}>Расписание и табель рабочего времени (Гиды и Музыканты)</h3>
                
                {staffSchedules.length === 0 ? (
                  <div style={{ color: 'var(--text-muted)' }}>Нет данных о расписании или персонал еще не назначен на рейсы.</div>
                ) : (
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Имя сотрудника</th>
                          <th>Роль</th>
                          <th>Дата и Время</th>
                          <th>Теплоход</th>
                          <th>Программа</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staffSchedules.map((staff, idx) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: 'bold' }}>{staff.name}</td>
                            <td>
                              <span style={{
                                padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold',
                                background: staff.role === 'guide' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                                color: staff.role === 'guide' ? '#93c5fd' : '#c4b5fd'
                              }}>
                                {staff.role === 'guide' ? 'Гид' : staff.role === 'musician' ? 'Музыкант' : staff.role}
                              </span>
                            </td>
                            <td>{staff.date} <small style={{ color: 'var(--text-muted)' }}>{staff.time}</small></td>
                            <td>{staff.ship_name || '—'}</td>
                            <td>{staff.program_name || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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
                            <td style={{ fontWeight: 'bold' }}>{b.customer_name || (b.agent_id ? 'Пакет агентства' : 'Касса причала')}</td>
                            <td>
                              <div>{b.customer_phone || (b.agent_id ? 'B2B канал' : 'Прямая продажа')}</div>
                              <small style={{ color: 'var(--text-muted)' }}>{b.customer_email || '—'}</small>
                            </td>
                            <td>
                              <div style={{ fontWeight: '500' }}>{event.name}</div>
                              <small style={{ color: 'var(--text-muted)' }}>{event.date} {event.time || ''}</small>
                            </td>
                            <td>
                              <span style={{ 
                                padding: '3px 8px', 
                                borderRadius: '4px', 
                                fontSize: '11px', 
                                background: b.tickets_count > 1 ? 'rgba(16, 185, 129, 0.2)' : b.seat_category === 'vip' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                color: b.tickets_count > 1 ? '#34d399' : b.seat_category === 'vip' ? '#fbbf24' : '#93c5fd',
                                fontWeight: 'bold'
                              }}>
                                {b.tickets_count > 1 ? `Блок: ${b.tickets_count} билетов` : `${b.seat_number || 'Входной'} (${b.seat_category === 'vip' ? 'VIP' : 'Стандарт'})`}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <h1 style={{ fontSize: '26px', margin: 0 }}>🤝 Партнерская B2B сеть (Отели & Агенты)</h1>
                  <span style={{ fontSize: '10px', background: '#f59e0b', color: '#000', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>ДЕМО-СЦЕНАРИЙ B2B</span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '13px' }}>
                  Назначение комиссий, взаиморасчеты, генерация промокодов и акты сверки с консьерж-службами отелей.
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <h1 style={{ fontSize: '26px', margin: 0 }}>💰 Финансово-управленческий учет</h1>
                  <span style={{ fontSize: '10px', background: '#f59e0b', color: '#000', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>ДЕМО-РАСХОДЫ И ДДС</span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '13px' }}>
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
        {/* СЕКЦИЯ 6: ⚙️ НАСТРОЙКИ (ПРИЧАЛЫ, СОТРУДНИКИ, ПРАВИЛА, ФЛОТ) */}
        {/* ============================================================ */}
        {activeNav === 'settings' && (
          <div>
            <div className="glass" style={{ padding: '20px 24px', borderRadius: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{ fontSize: '26px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  ⚙️ Системные настройки и администрирование
                </h1>
                <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                  Управление ставками причальных сборов, доступом сотрудников, технологическими буферами и параметрами автоматики.
                </p>
              </div>

              {isRulesSavedToast && (
                <div style={{ background: '#10b981', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', animation: 'fadeIn 0.3s' }}>
                  <CheckCircle2 size={16} />
                  Параметры платформы успешно сохранены!
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              
              {/* 1. ПРИЧАЛЫ И ТОЧКИ ПОСАДКИ */}
              <div className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px' }}>
                      <Anchor size={18} color="#10b981" />
                      Причалы и причальные сборы
                    </h3>
                    <button 
                      onClick={handleOpenAddPier}
                      className="btn btn-primary"
                      style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Plus size={14} /> Добавить причал
                    </button>
                  </div>
                  
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Ставка причального сбора автоматически учитывается в прямых переменных расходах (COGS) каждого рейса в P&L и ДДС.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {piers.map(pier => (
                      <div 
                        key={pier.id}
                        style={{ 
                          padding: '12px 14px', 
                          background: 'rgba(255,255,255,0.03)', 
                          borderRadius: '10px', 
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{pier.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {pier.address}
                          </div>
                          <div style={{ fontSize: '11px', color: '#fbbf24', marginTop: '4px', fontWeight: '600' }}>
                            Сбор: {pier.rate.toLocaleString('ru-RU')} ₽ / рейс
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button 
                            onClick={() => handleOpenEditPier(pier)}
                            className="btn btn-secondary" 
                            style={{ padding: '6px 8px' }}
                            title="Редактировать причал"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeletePier(pier.id)}
                            className="btn btn-secondary" 
                            style={{ padding: '6px 8px', color: '#f87171' }}
                            title="Удалить причал"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. СОТРУДНИКИ И РОЛИ ДОСТУПА */}
              <div className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px' }}>
                      <UserCheck size={18} color="#f59e0b" />
                      Сотрудники и права доступа
                    </h3>
                    <button 
                      onClick={handleOpenAddEmployee}
                      className="btn btn-primary"
                      style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Plus size={14} /> Добавить сотрудника
                    </button>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Назначение ролей, контактных данных и ПИН-кодов для быстрой авторизации на кассе причала и мобильном сканере.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {employees.map(emp => (
                      <div 
                        key={emp.id}
                        style={{ 
                          padding: '12px 14px', 
                          background: emp.status === 'blocked' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255,255,255,0.03)', 
                          borderRadius: '10px', 
                          border: `1px solid ${emp.status === 'blocked' ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-color)'}`,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '14px', color: emp.status === 'blocked' ? '#f87171' : 'var(--text-main)' }}>
                              {emp.name}
                            </span>
                            <span style={{ 
                              fontSize: '10px', 
                              padding: '2px 6px', 
                              borderRadius: '4px', 
                              background: emp.role.includes('Владелец') ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                              color: emp.role.includes('Владелец') ? '#93c5fd' : '#fbbf24',
                              fontWeight: 'bold'
                            }}>
                              {emp.role}
                            </span>
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                            {emp.email} • {emp.phone}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>Права: <b>{emp.permissions}</b></span>
                            <span style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace', color: '#6ee7b7' }}>
                              PIN: {emp.pin}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button 
                            onClick={() => handleToggleEmployeeStatus(emp.id)}
                            className="btn btn-secondary" 
                            style={{ padding: '6px 8px', color: emp.status === 'active' ? '#34d399' : '#f87171' }}
                            title={emp.status === 'active' ? 'Заблокировать доступ' : 'Разблокировать'}
                          >
                            {emp.status === 'active' ? <Lock size={14} /> : <Unlock size={14} />}
                          </button>
                          <button 
                            onClick={() => handleOpenEditEmployee(emp)}
                            className="btn btn-secondary" 
                            style={{ padding: '6px 8px' }}
                            title="Редактировать сотрудника"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteEmployee(emp.id)}
                            className="btn btn-secondary" 
                            style={{ padding: '6px 8px', color: '#f87171' }}
                            title="Удалить"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* 3. ГЛОБАЛЬНЫЕ БИЗНЕС-ПРАВИЛА И СПРАВОЧНИК ФЛОТА */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
              
              {/* Параметры платформы */}
              <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px' }}>
                  <Sliders size={18} color="#60a5fa" />
                  Глобальные бизнес-правила платформы
                </h3>

                <form onSubmit={handleSaveRules} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        Таймаут удержания брони (Холд)
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input 
                          type="number" 
                          min="5" 
                          max="60" 
                          value={platformRules.bookingHoldMinutes}
                          onChange={(e) => setPlatformRules({ ...platformRules, bookingHoldMinutes: Number(e.target.value) })}
                          className="input-field"
                          style={{ width: '100%' }}
                        />
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>мин</span>
                      </div>
                      <small style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Через сколько минут неоплаченное место возвращается в продажу</small>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        Технологический буфер стоянки
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input 
                          type="number" 
                          min="15" 
                          max="120" 
                          value={platformRules.turnaroundBufferMinutes}
                          onChange={(e) => setPlatformRules({ ...platformRules, turnaroundBufferMinutes: Number(e.target.value) })}
                          className="input-field"
                          style={{ width: '100%' }}
                        />
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>мин</span>
                      </div>
                      <small style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Минимальный интервал между рейсами для уборки и посадки</small>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        Порог алерта низкой загрузки
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input 
                          type="number" 
                          min="10" 
                          max="80" 
                          value={platformRules.lowCapacityAlertThreshold}
                          onChange={(e) => setPlatformRules({ ...platformRules, lowCapacityAlertThreshold: Number(e.target.value) })}
                          className="input-field"
                          style={{ width: '100%' }}
                        />
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>%</span>
                      </div>
                      <small style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Подсвечивать рейс желтым/красным за 48ч до отхода</small>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        Комиссия интернет-эквайринга
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input 
                          type="number" 
                          step="0.1" 
                          min="0.5" 
                          max="5.0" 
                          value={platformRules.acquiringFeePercent}
                          onChange={(e) => setPlatformRules({ ...platformRules, acquiringFeePercent: Number(e.target.value) })}
                          className="input-field"
                          style={{ width: '100%' }}
                        />
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>%</span>
                      </div>
                      <small style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Учитывается в переменных расходах при каждой оплате</small>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Telegram Chat ID для мгновенных алертов руководству
                    </label>
                    <input 
                      type="text" 
                      value={platformRules.telegramAlertChatId}
                      onChange={(e) => setPlatformRules({ ...platformRules, telegramAlertChatId: e.target.value })}
                      className="input-field"
                      style={{ width: '100%' }}
                      placeholder="@channel_name или -100123456789"
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
                    >
                      <Save size={16} /> Сохранить параметры платформы
                    </button>
                  </div>
                </form>
              </div>

              {/* Справочник флота с быстрой ссылкой в раздел Менеджера */}
              <div className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px' }}>
                      <Ship size={18} color="#60a5fa" />
                      Флот компании
                    </h3>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{ships.length} судна</span>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Оперативное управление теплоходами, расписанием программ и конструктором схем палуб централизованно выполняется в рабочем месте <b>Менеджера</b>.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                    {ships.map(s => (
                      <div 
                        key={s.id} 
                        style={{ 
                          padding: '12px 14px', 
                          background: 'rgba(255,255,255,0.03)', 
                          borderRadius: '10px', 
                          border: '1px solid var(--border-color)', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center' 
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{s.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            Вместимость: <b>{s.capacity}</b> пассажиров
                          </div>
                        </div>
                        <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 'bold' }}>
                          В строю
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <a 
                  href="#venues"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    background: 'rgba(59, 130, 246, 0.15)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    color: '#93c5fd',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    textDecoration: 'none',
                    textAlign: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>Перейти в управление флотом и схемами (Менеджер)</span>
                  <ExternalLink size={15} />
                </a>
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

      {/* ============================================================ */}
      {/* МОДАЛЬНОЕ ОКНО ДОБАВЛЕНИЯ / РЕДАКТИРОВАНИЯ ПРИЧАЛА */}
      {/* ============================================================ */}
      {isPierModalOpen && (
        <div className="modal-backdrop">
          <div className="glass modal-content" style={{ maxWidth: '480px', width: '90%', padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Anchor size={20} color="#10b981" />
                {editingPier ? 'Редактировать причал' : 'Добавить новый причал'}
              </h2>
              <button 
                onClick={() => setIsPierModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePier} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Название причала
                </label>
                <input
                  type="text"
                  required
                  placeholder="например, Дворцовая наб., 18 (Главный причал)"
                  value={pierFormName}
                  onChange={(e) => setPierFormName(e.target.value)}
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Точный адрес посадки
                </label>
                <input
                  type="text"
                  required
                  placeholder="например, Дворцовая набережная, 18"
                  value={pierFormAddress}
                  onChange={(e) => setPierFormAddress(e.target.value)}
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Ставка причального сбора (₽ за 1 швартовку / рейс)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="500"
                  value={pierFormRate}
                  onChange={(e) => setPierFormRate(e.target.value)}
                  className="input-field"
                  style={{ width: '100%' }}
                />
                <small style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Автоматически подставляется в расчет прямых затрат рейса</small>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Примечание / Описание
                </label>
                <input
                  type="text"
                  placeholder="например, Центральный причал для рок-концертов"
                  value={pierFormDesc}
                  onChange={(e) => setPierFormDesc(e.target.value)}
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsPierModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Отмена
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  {editingPier ? 'Сохранить изменения' : 'Создать причал'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* МОДАЛЬНОЕ ОКНО ДОБАВЛЕНИЯ / РЕДАКТИРОВАНИЯ СОТРУДНИКА */}
      {/* ============================================================ */}
      {isEmployeeModalOpen && (
        <div className="modal-backdrop">
          <div className="glass modal-content" style={{ maxWidth: '500px', width: '90%', padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={20} color="#f59e0b" />
                {editingEmployee ? 'Редактировать сотрудника' : 'Добавить сотрудника'}
              </h2>
              <button 
                onClick={() => setIsEmployeeModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  ФИО сотрудника
                </label>
                <input
                  type="text"
                  required
                  placeholder="например, Анна Смирнова"
                  value={empFormName}
                  onChange={(e) => setEmpFormName(e.target.value)}
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Роль и уровень доступа
                </label>
                <select
                  value={empFormRole}
                  onChange={(e) => setEmpFormRole(e.target.value)}
                  className="input-field"
                  style={{ width: '100%' }}
                >
                  <option value="Владелец / Главный админ">Владелец / Главный админ (Полный доступ)</option>
                  <option value="Менеджер расписания">Менеджер расписания (Репертуар, сессии, флот)</option>
                  <option value="Старший кассир причала">Старший кассир причала (Касса причала, билеты)</option>
                  <option value="Контролер трапа">Контролер трапа (Мобильный сканер)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Email (Логин)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@rockhitneva.ru"
                    value={empFormEmail}
                    onChange={(e) => setEmpFormEmail(e.target.value)}
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Телефон
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+7 (921) 000-00-00"
                    value={empFormPhone}
                    onChange={(e) => setEmpFormPhone(e.target.value)}
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  4-значный PIN-код быстрого входа
                </label>
                <input
                  type="text"
                  maxLength="4"
                  required
                  placeholder="4 цифры"
                  value={empFormPin}
                  onChange={(e) => setEmpFormPin(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', fontFamily: 'monospace', fontSize: '16px', letterSpacing: '4px', textAlign: 'center' }}
                />
                <small style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Для быстрой смены кассиров на причале или контролера на трапе</small>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsEmployeeModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Отмена
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  {editingEmployee ? 'Сохранить изменения' : 'Добавить сотрудника'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
