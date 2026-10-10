import React, { useState, useEffect, useMemo } from 'react';
import {
  Sun, Moon, 
  Users, Smartphone, QrCode, DollarSign, CheckCircle2, 
  Clock, MapPin, Ticket, Percent, ArrowRight, RefreshCw, 
  Share2, Copy, Check, ShieldCheck, Sparkles, AlertCircle,
  TrendingUp, Award, UserCheck, Flame, ChevronRight, ChevronDown,
  Layers, GitFork, UserPlus, Sliders, XCircle, Send, CheckCircle,
  FileSpreadsheet, MessageSquare, History, PhoneCall, Filter, Eye, AlertTriangle,
  Compass, Radio, Shield, HelpCircle
} from 'lucide-react';
import { getEvents, getShips, getBookings, createBooking } from '../db';
import { 
  INITIAL_PROMO_POINTS, 
  ALL_PROMOTERS_LIST, 
  ALL_STATICS_LIST, 
  INITIAL_DISCOUNT_REQUESTS, 
  INITIAL_REFUSES 
} from '../data/promo_data';

export default function PromoApp() {
  // Режим экрана: 'promoter' (уличный агент) или 'dispatcher' (главный промоутер / статик)
  const [roleMode, setRoleMode] = useState('promoter');
  
  // Текущий промоутер
  const [selectedPromoterId, setSelectedPromoterId] = useState(ALL_PROMOTERS_LIST[0].id);
  const selectedAgent = useMemo(() => {
    return ALL_PROMOTERS_LIST.find(p => p.id === selectedPromoterId) || ALL_PROMOTERS_LIST[0];
  }, [selectedPromoterId]);

  // Текущий статик (главный промоутер точки)
  const [selectedStaticId, setSelectedStaticId] = useState(ALL_STATICS_LIST[0].id);
  const selectedStatic = useMemo(() => {
    return ALL_STATICS_LIST.find(s => s.id === selectedStaticId) || ALL_STATICS_LIST[0];
  }, [selectedStaticId]);

  // Вкладка уличного промоутера: 'sales' | 'request' | 'refuse' | 'stats'
  const [promoterTab, setPromoterTab] = useState('sales');

  // Вкладка главного промоутера: 'tree' | 'queue' | 'refuses' | 'commissions'
  const [dispatcherTab, setDispatcherTab] = useState('tree');

  // Хранилище точек и иерархии
  const [pointsData, setPointsData] = useState(() => {
    try {
      const saved = localStorage.getItem('spb_promo_points_v1');
      return saved ? JSON.parse(saved) : INITIAL_PROMO_POINTS;
    } catch (e) {
      return INITIAL_PROMO_POINTS;
    }
  });

  // Запросы скидок
  const [discountRequests, setDiscountRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('spb_promo_discount_requests_v1');
      return saved ? JSON.parse(saved) : INITIAL_DISCOUNT_REQUESTS;
    } catch (e) {
      return INITIAL_DISCOUNT_REQUESTS;
    }
  });

  // Журнал отказов
  const [refusesList, setRefusesList] = useState(() => {
    try {
      const saved = localStorage.getItem('spb_promo_refuses_v1');
      return saved ? JSON.parse(saved) : INITIAL_REFUSES;
    } catch (e) {
      return INITIAL_REFUSES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('spb_promo_points_v1', JSON.stringify(pointsData));
    } catch (e) {}
  }, [pointsData]);

  useEffect(() => {
    try {
      localStorage.setItem('spb_promo_discount_requests_v1', JSON.stringify(discountRequests));
    } catch (e) {}
  }, [discountRequests]);

  useEffect(() => {
    try {
      localStorage.setItem('spb_promo_refuses_v1', JSON.stringify(refusesList));
    } catch (e) {}
  }, [refusesList]);

  // Данные базы (рейсы, корабли, продажи)
  const [events, setEvents] = useState([]);
  const [ships, setShips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  // Форма быстрой продажи
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticketsCount, setTicketsCount] = useState(2);
  const [paymentMode, setPaymentMode] = useState('sbp_qr');
  const [clientPhone, setClientPhone] = useState('');
  
  // Результат продажи
  const [saleResult, setSaleResult] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Форма согласования скидки
  const [reqCruise, setReqCruise] = useState('');
  const [reqPeople, setReqPeople] = useState(2);
  const [reqCustomPrice, setReqCustomPrice] = useState(1200);
  const [reqTimeWalk, setReqTimeWalk] = useState(15);
  const [reqComment, setReqComment] = useState('');
  const [reqSuccessMsg, setReqSuccessMsg] = useState(false);

  // Форма фиксации отказа
  const [refReason, setRefReason] = useState('Дорого / Слишком высокая цена');
  const [refPeople, setRefPeople] = useState(2);
  const [refComment, setRefComment] = useState('');
  const [refSuccessMsg, setRefSuccessMsg] = useState(false);

  // Раскрытые узлы дерева иерархии
  const [expandedNodes, setExpandedNodes] = useState({
    'point_palace': true,
    'point_senat': true,
    'point_arrow': true,
    'stat_andrey': true,
    'stat_igor': true,
    'stat_victor': true
  });

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const loadData = async () => {
    const [fetchedEvents, fetchedShips, fetchedBookings] = await Promise.all([
      getEvents(),
      getShips(),
      getBookings()
    ]);
    setEvents(fetchedEvents);
    setShips(fetchedShips);
    setBookings(fetchedBookings);
    
    if (fetchedEvents.length > 0 && !selectedEvent) {
      setSelectedEvent(fetchedEvents[0]);
      if (fetchedEvents[0].slots && fetchedEvents[0].slots.length > 0) {
        setSelectedSlot(fetchedEvents[0].slots[0]);
      }
      setReqCruise(fetchedEvents[0].name);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setReqCruise(event.name);
    if (event.slots && event.slots.length > 0) {
      setSelectedSlot(event.slots[0]);
    } else {
      setSelectedSlot({
        id: 'default',
        time: event.time?.slice(0, 5) || '19:00',
        date: event.date,
        price: event.price_standard || 1500
      });
    }
  };

  const getAvailableSeats = (event, slot) => {
    if (!event) return 100;
    const ship = ships.find(s => s.id === event.ship_id);
    const capacity = ship?.capacity || 100;
    
    const eventBookings = bookings.filter(b => 
      b.event_id === event.id && 
      (!slot || b.slot_id === slot.id || !b.slot_id) &&
      b.status !== 'cancelled'
    );
    return Math.max(0, capacity - eventBookings.length);
  };

  const handleCompleteSale = async (overridePrice = null) => {
    if (!selectedEvent || !selectedSlot) return;
    setIsSubmitting(true);

    const pricePerTicket = overridePrice || selectedSlot.price || selectedEvent.price_standard || 1500;
    const totalAmount = pricePerTicket * ticketsCount;
    const agentEarning = Math.round(totalAmount * (selectedAgent.commissionRate || 0.20));

    try {
      const newBookings = [];
      const bookingGroupId = 'PRM-' + Math.random().toString(36).substring(2, 8).toUpperCase();

      for (let i = 0; i < ticketsCount; i++) {
        const b = await createBooking({
          event_id: selectedEvent.id,
          slot_id: selectedSlot.id,
          seat_number: `Борт-ПРОМО-${Math.floor(Math.random() * 899 + 100)}`,
          seat_category: 'standard',
          customer_name: `Гость (${selectedAgent.name})`,
          customer_phone: clientPhone || 'Оплата на набережной',
          customer_email: 'promo@tickets.ru',
          price_paid: pricePerTicket,
          payment_method: paymentMode,
          status: 'confirmed',
          promo_agent_id: selectedAgent.id,
          promo_group_id: bookingGroupId,
          promo_commission: Math.round(agentEarning / ticketsCount)
        });
        newBookings.push(b);
      }

      setSaleResult({
        groupId: bookingGroupId,
        eventName: selectedEvent.name,
        time: selectedSlot.time || selectedEvent.time?.slice(0, 5),
        date: selectedSlot.dayStr || selectedEvent.date,
        location: selectedEvent.location,
        ticketsCount,
        totalAmount,
        agentEarning,
        paymentMode,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=PROMO-${bookingGroupId}`
      });

      await loadData();
    } catch (err) {
      console.error(err);
      alert('Ошибка при оформлении билета. Попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendDiscountRequest = (e) => {
    e.preventDefault();
    const newReq = {
      id: 'req_' + Date.now(),
      promoterId: selectedAgent.id,
      promoterName: selectedAgent.name,
      pointName: selectedAgent.pointName,
      cruiseName: reqCruise || selectedEvent?.name || 'Парадный Петербург',
      time: selectedSlot?.time || 'Ближайший',
      people: Number(reqPeople),
      basePrice: selectedSlot?.price || selectedEvent?.price_standard || 1500,
      requestedPrice: Number(reqCustomPrice),
      timeWalk: Number(reqTimeWalk),
      paymentMethod: paymentMode,
      comment: reqComment,
      status: 'pending',
      createdAt: new Date().toISOString(),
      approvedBy: null
    };

    setDiscountRequests(prev => [newReq, ...prev]);
    setReqSuccessMsg(true);
    setReqComment('');
    setTimeout(() => setReqSuccessMsg(false), 3500);
  };

  const handleRecordRefuse = (e) => {
    e.preventDefault();
    const newRef = {
      id: 'ref_' + Date.now(),
      promoterId: selectedAgent.id,
      promoterName: selectedAgent.name,
      pointName: selectedAgent.pointName,
      cruiseName: selectedEvent?.name || 'Парадный Петербург',
      people: Number(refPeople),
      price: selectedSlot?.price || selectedEvent?.price_standard || 1500,
      reason: refReason,
      timeWalk: 15,
      comment: refComment,
      date: new Date().toISOString()
    };

    setRefusesList(prev => [newRef, ...prev]);
    setRefSuccessMsg(true);
    setRefComment('');
    setTimeout(() => setRefSuccessMsg(false), 3500);
  };

  const handleApproveDiscount = (reqId) => {
    setDiscountRequests(prev => prev.map(r => {
      if (r.id === reqId) {
        return { ...r, status: 'approved', approvedBy: selectedStatic.name };
      }
      return r;
    }));
  };

  const handleRejectDiscount = (reqId) => {
    setDiscountRequests(prev => prev.map(r => {
      if (r.id === reqId) {
        return { ...r, status: 'rejected', approvedBy: selectedStatic.name };
      }
      return r;
    }));
  };

  const handleUpdatePromoterPrecent = (promoterId, newPrecent) => {
    setPointsData(prev => prev.map(point => ({
      ...point,
      statics: point.statics.map(st => ({
        ...st,
        promoters: st.promoters.map(pr => {
          if (pr.id === promoterId) {
            return { ...pr, promoterPrecent: Number(newPrecent) };
          }
          return pr;
        })
      }))
    })));
  };

  const handleUpdateStaticPrecents = (staticId, p1, p2) => {
    setPointsData(prev => prev.map(point => ({
      ...point,
      statics: point.statics.map(st => {
        if (st.id === staticId) {
          return { ...st, staticPrecent: Number(p1), staticPrecent2: Number(p2) };
        }
        return st;
      })
    })));
  };

  const handleExportRefusesCSV = () => {
    const headers = ['ID', 'Дата', 'Точка', 'Промоутер', 'Рейс', 'Гостей', 'Цена билета', 'Причина отказа', 'Комментарий'];
    const rows = refusesList.map(r => [
      r.id,
      new Date(r.date).toLocaleString('ru-RU'),
      `"${r.pointName || ''}"`,
      `"${r.promoterName || ''}"`,
      `"${r.cruiseName || ''}"`,
      r.people,
      r.price,
      `"${r.reason || ''}"`,
      `"${(r.comment || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `refuses_report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const agentBookings = bookings.filter(b => b.promo_agent_id === selectedAgent.id);
  const agentTotalTickets = agentBookings.length;
  const agentTotalRevenue = agentBookings.reduce((sum, b) => sum + (Number(b.price_paid) || 0), 0);
  const agentTotalEarned = agentBookings.reduce((sum, b) => sum + (Number(b.promo_commission) || (Number(b.price_paid) * (selectedAgent.commissionRate || 0.20)) || 0), 0);

  const myDiscountRequests = discountRequests.filter(r => r.promoterId === selectedAgent.id);
  const pendingRequestsCount = discountRequests.filter(r => r.status === 'pending').length;

  const pricePerTicket = selectedSlot?.price || selectedEvent?.price_standard || 1500;
  const currentTotal = pricePerTicket * ticketsCount;
  const currentEarning = Math.round(currentTotal * (selectedAgent.commissionRate || 0.20));
  const freeSeats = selectedEvent && selectedSlot ? getAvailableSeats(selectedEvent, selectedSlot) : 0;

  const treeAggregates = useMemo(() => {
    let globalSumma = 0;
    let globalTickets = 0;
    let globalPromoterZp = 0;
    let globalStaticZp = 0;

    const pointsTree = pointsData.map(pt => {
      let ptSumma = 0;
      let ptTickets = 0;
      let ptPromoterZp = 0;
      let ptStaticZp = 0;

      const staticsTree = pt.statics.map(st => {
        let stSumma = 0;
        let stTickets = 0;
        let stPromoterZp = 0;

        const promotersTree = st.promoters.map(pr => {
          const prBookings = bookings.filter(b => b.promo_agent_id === pr.id);
          const prRev = prBookings.reduce((s, b) => s + (Number(b.price_paid) || 0), 0);
          const prTix = prBookings.length;
          const prZp = prBookings.reduce((s, b) => s + (Number(b.promo_commission) || Math.round(Number(b.price_paid) * pr.promoterPrecent / 100)), 0);

          stSumma += prRev;
          stTickets += prTix;
          stPromoterZp += prZp;

          return {
            ...pr,
            revenue: prRev,
            tickets: prTix,
            zp: prZp
          };
        });

        const isPlanDone = stSumma >= (pt.dailyTarget || 60000);
        const effectiveStaticRate = st.staticPrecent + (isPlanDone ? (st.staticPrecent2 || 0) : 0);
        const stZp = Math.round(stSumma * effectiveStaticRate / 100);

        ptSumma += stSumma;
        ptTickets += stTickets;
        ptPromoterZp += stPromoterZp;
        ptStaticZp += stZp;

        return {
          ...st,
          revenue: stSumma,
          tickets: stTickets,
          promoterZp: stPromoterZp,
          staticZp: stZp,
          effectiveRate: effectiveStaticRate,
          isPlanDone,
          promoters: promotersTree
        };
      });

      globalSumma += ptSumma;
      globalTickets += ptTickets;
      globalPromoterZp += ptPromoterZp;
      globalStaticZp += ptStaticZp;

      return {
        ...pt,
        revenue: ptSumma,
        tickets: ptTickets,
        promoterZp: ptPromoterZp,
        staticZp: ptStaticZp,
        statics: staticsTree
      };
    });

    return {
      points: pointsTree,
      global: {
        summa: globalSumma,
        tickets: globalTickets,
        promoterZp: globalPromoterZp,
        staticZp: globalStaticZp,
        totalZp: globalPromoterZp + globalStaticZp
      }
    };
  }, [pointsData, bookings]);
  // Тема оформления: 'light' (светлая по умолчанию) или 'dark' (тёмная)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('spb_promo_theme') || 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('spb_promo_theme', theme);
    } catch (e) {}
  }, [theme]);

  const isLight = theme === 'light';

  const T = {
    isLight,
    // Фоновые цвета
    pageBg: isLight ? '#f8fafc' : '#0a0f1d',
    headerBg: isLight ? '#ffffff' : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    headerBorder: isLight ? '#e2e8f0' : '#334155',
    headerShadow: isLight ? '0 2px 10px rgba(0,0,0,0.05)' : '0 4px 20px rgba(0,0,0,0.5)',
    pillBg: isLight ? '#f1f5f9' : '#0f172a',
    pillBorder: isLight ? '#cbd5e1' : '#334155',
    pillText: isLight ? '#475569' : '#94a3b8',
    
    // Карточки и контейнеры
    cardBg: isLight ? '#ffffff' : '#1e293b',
    cardInner: isLight ? '#f8fafc' : '#0f172a',
    cardSubtle: isLight ? '#f1f5f9' : '#131b2e',
    cardBorder: isLight ? '#e2e8f0' : '#334155',
    cardBorderStrong: isLight ? '#cbd5e1' : '#475569',
    cardShadow: isLight ? '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' : 'none',
    
    // Вкладки
    tabInactiveBg: isLight ? '#ffffff' : '#1e293b',
    tabInactiveBorder: isLight ? '#cbd5e1' : '#334155',
    tabInactiveText: isLight ? '#475569' : '#94a3b8',
    
    // Инпуты и селекты
    inputBg: isLight ? '#ffffff' : '#0f172a',
    inputBorder: isLight ? '#cbd5e1' : '#475569',
    inputText: isLight ? '#0f172a' : '#ffffff',
    
    // Текст
    textMain: isLight ? '#0f172a' : '#f8fafc',
    textHeading: isLight ? '#0f172a' : '#ffffff',
    textSub: isLight ? '#334155' : '#cbd5e1',
    textMuted: isLight ? '#64748b' : '#94a3b8',
    
    // Акценты
    cyan: isLight ? '#0284c7' : '#38bdf8',
    cyanBadgeBg: isLight ? 'rgba(2, 132, 199, 0.1)' : 'rgba(56, 189, 248, 0.2)',
    cyanBadgeBorder: isLight ? 'rgba(2, 132, 199, 0.25)' : 'rgba(255,255,255,0.1)',
    purple: isLight ? '#7c3aed' : '#c084fc',
    purpleBadgeBg: isLight ? 'rgba(124, 58, 237, 0.1)' : 'rgba(168, 85, 247, 0.2)',
    emerald: isLight ? '#059669' : '#34d399',
    amber: isLight ? '#b45309' : '#facc15',
    amberWarm: isLight ? '#d97706' : '#fbbf24',
    red: isLight ? '#dc2626' : '#f87171',
    
    // Плашки и баннеры
    summaryBg: isLight ? 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    summaryBorder: isLight ? '#cbd5e1' : '#475569',
    emeraldBanner: isLight 
      ? 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.06) 100%)' 
      : 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(5,150,105,0.1) 100%)',
    purpleBanner: isLight 
      ? 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(99,102,241,0.05) 100%)' 
      : 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(99,102,241,0.1) 100%)',
    redBanner: isLight 
      ? 'linear-gradient(135deg, rgba(220,38,38,0.08) 0%, rgba(185,28,28,0.04) 100%)' 
      : 'linear-gradient(135deg, rgba(220,38,38,0.15) 0%, rgba(185,28,28,0.1) 100%)',
      
    // Таблица диспетчера
    tableHeaderBg: isLight ? '#f1f5f9' : '#1e293b',
    tableHeaderBorder: isLight ? '#e2e8f0' : '#334155',
    tableHeaderText: isLight ? '#64748b' : '#94a3b8',
    tableRowPoint: isLight ? '#f8fafc' : '#172033',
    tableRowStatic: isLight ? '#ffffff' : '#131b2e',
    tableRowPromoter: isLight ? '#f8fafc' : '#0d1526',
    tableBorder: isLight ? '#e2e8f0' : '#334155',
    tableSubBorder: isLight ? '#edf2f7' : '#23314d'
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', minHeight: '100vh', background: T.pageBg, color: T.textMain, paddingBottom: '90px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* 1. ГЛАВНАЯ ШАПКА: ПЕРЕКЛЮЧАТЕЛЬ РОЛИ (УЛИЦА vs ШТАБ СТАТИКА) И ТЕМА */}
      <div style={{ background: T.headerBg, padding: '16px 20px', borderBottom: `1px solid ${T.headerBorder}`, position: 'sticky', top: 0, zIndex: 50, boxShadow: T.headerShadow }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
              <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: T.textMuted, fontWeight: 700 }}>
                СИСТЕМА УЛИЧНЫХ ПРОДАЖ И АГЕНТОВ
              </span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: T.textHeading, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{roleMode === 'promoter' ? selectedAgent.name : selectedStatic.name}</span>
              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: roleMode === 'promoter' ? T.cyanBadgeBg : T.purpleBadgeBg, color: roleMode === 'promoter' ? T.cyan : T.purple, border: `1px solid ${roleMode === 'promoter' ? T.cyanBadgeBorder : 'rgba(124,58,237,0.25)'}` }}>
                {roleMode === 'promoter' ? 'Полевой промоутер' : 'Главный промоутер (Статик)'}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: T.cyan, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <MapPin size={13} /> {roleMode === 'promoter' ? `${selectedAgent.pointName} • ${selectedAgent.spot}` : `${selectedStatic.pointName} • Причал`}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* ПЕРЕКЛЮЧАТЕЛЬ РОЛЕЙ */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: T.pillBg, padding: '4px', borderRadius: '12px', border: `1px solid ${T.pillBorder}` }}>
              <button
                type="button"
                onClick={() => setRoleMode('promoter')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: roleMode === 'promoter' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
                  color: roleMode === 'promoter' ? '#fff' : T.pillText,
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <Smartphone size={16} />
                <span>Полевой агент</span>
              </button>

              <button
                type="button"
                onClick={() => setRoleMode('dispatcher')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: roleMode === 'dispatcher' ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' : 'transparent',
                  color: roleMode === 'dispatcher' ? '#fff' : T.pillText,
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s'
                }}
              >
                <GitFork size={16} />
                <span>Штаб / Главный (Статик)</span>
                {pendingRequestsCount > 0 && (
                  <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: 900, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {pendingRequestsCount}
                  </span>
                )}
              </button>
            </div>

            {/* ПЕРЕКЛЮЧАТЕЛЬ СВЕТЛОЙ / ТЕМНОЙ ТЕМЫ */}
            <button
              type="button"
              onClick={() => setTheme(isLight ? 'dark' : 'light')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '8px 14px',
                borderRadius: '12px',
                border: `1px solid ${T.pillBorder}`,
                background: T.inputBg,
                color: T.textMain,
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isLight ? '0 1px 4px rgba(0,0,0,0.06)' : 'none'
              }}
              title={isLight ? 'Переключить на тёмную тему' : 'Переключить на светлую тему'}
            >
              {isLight ? (
                <>
                  <Moon size={16} color="#6366f1" />
                  <span>Тёмная</span>
                </>
              ) : (
                <>
                  <Sun size={16} color="#f59e0b" />
                  <span>Светлая</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Быстрый выбор конкретного сотрудника из списка для демо/симуляции */}
        <div style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          {roleMode === 'promoter' ? (
            <select 
              value={selectedPromoterId} 
              onChange={(e) => setSelectedPromoterId(e.target.value)}
              style={{ width: '100%', background: T.inputBg, color: T.inputText, border: `1px solid ${T.inputBorder}`, padding: '7px 12px', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
            >
              {ALL_PROMOTERS_LIST.map(p => (
                <option key={p.id} value={p.id}>
                  Смена промоутера: {p.name} [{p.pointName} • {p.spot}] — ставка {p.promoterPrecent}%
                </option>
              ))}
            </select>
          ) : (
            <select 
              value={selectedStaticId} 
              onChange={(e) => setSelectedStaticId(e.target.value)}
              style={{ width: '100%', background: T.inputBg, color: T.inputText, border: `1px solid ${isLight ? '#7c3aed' : '#7c3aed'}`, padding: '7px 12px', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
            >
              {ALL_STATICS_LIST.map(s => (
                <option key={s.id} value={s.id}>
                  Статик причала: {s.name} [{s.pointName}] — ставка {s.staticPrecent}% + {s.staticPrecent2}% бонус
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* РЕЖИМ 1: ПОЛЕВОЙ ПРОМОУТЕР (НАБЕРЕЖНАЯ) */}
      {roleMode === 'promoter' && (
        <div style={{ padding: '16px' }}>
          
          {/* Подменю промоутера: Продажа / Спеццена / Отказ / Моя касса */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => { setSaleResult(null); setPromoterTab('sales'); }}
              style={{
                padding: '10px 4px',
                borderRadius: '10px',
                background: promoterTab === 'sales' ? '#0284c7' : T.tabInactiveBg,
                color: promoterTab === 'sales' ? '#fff' : T.tabInactiveText,
                border: '1px solid',
                borderColor: promoterTab === 'sales' ? '#38bdf8' : T.tabInactiveBorder,
                fontSize: '12px',
                fontWeight: promoterTab === 'sales' ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                boxShadow: promoterTab === 'sales' ? '0 2px 8px rgba(2, 132, 199, 0.25)' : T.cardShadow
              }}
            >
              <Ticket size={18} />
              <span>Продажа</span>
            </button>

            <button
              type="button"
              onClick={() => setPromoterTab('request')}
              style={{
                padding: '10px 4px',
                borderRadius: '10px',
                background: promoterTab === 'request' ? '#7c3aed' : T.tabInactiveBg,
                color: promoterTab === 'request' ? '#fff' : T.tabInactiveText,
                border: '1px solid',
                borderColor: promoterTab === 'request' ? '#a855f7' : T.tabInactiveBorder,
                fontSize: '12px',
                fontWeight: promoterTab === 'request' ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                position: 'relative',
                boxShadow: promoterTab === 'request' ? '0 2px 8px rgba(124, 58, 237, 0.25)' : T.cardShadow
              }}
            >
              <Flame size={18} style={{ color: '#f59e0b' }} />
              <span>Спеццена</span>
              {myDiscountRequests.filter(r => r.status === 'pending').length > 0 && (
                <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
              )}
            </button>

            <button
              type="button"
              onClick={() => setPromoterTab('refuse')}
              style={{
                padding: '10px 4px',
                borderRadius: '10px',
                background: promoterTab === 'refuse' ? '#dc2626' : T.tabInactiveBg,
                color: promoterTab === 'refuse' ? '#fff' : T.tabInactiveText,
                border: '1px solid',
                borderColor: promoterTab === 'refuse' ? '#f87171' : T.tabInactiveBorder,
                fontSize: '12px',
                fontWeight: promoterTab === 'refuse' ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                boxShadow: promoterTab === 'refuse' ? '0 2px 8px rgba(220, 38, 38, 0.25)' : T.cardShadow
              }}
            >
              <XCircle size={18} />
              <span>Отказ</span>
            </button>

            <button
              type="button"
              onClick={() => setPromoterTab('stats')}
              style={{
                padding: '10px 4px',
                borderRadius: '10px',
                background: promoterTab === 'stats' ? '#059669' : T.tabInactiveBg,
                color: promoterTab === 'stats' ? '#fff' : T.tabInactiveText,
                border: '1px solid',
                borderColor: promoterTab === 'stats' ? '#34d399' : T.tabInactiveBorder,
                fontSize: '12px',
                fontWeight: promoterTab === 'stats' ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                boxShadow: promoterTab === 'stats' ? '0 2px 8px rgba(5, 150, 105, 0.25)' : T.cardShadow
              }}
            >
              <TrendingUp size={18} />
              <span>Моя касса</span>
            </button>
          </div>

          {/* 1.1: БЫСТРАЯ ПРОДАЖА */}
          {promoterTab === 'sales' && !saleResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Уведомление об одобрении скидки, если есть */}
              {myDiscountRequests.filter(r => r.status === 'approved').length > 0 && (
                <div style={{ background: T.emeraldBanner, border: '1px solid #10b981', padding: '12px 14px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13px', color: T.textHeading }}>Шеф одобрил спеццену!</div>
                        <div style={{ fontSize: '11px', color: isLight ? '#065f46' : '#a7f3d0' }}>
                          {myDiscountRequests.find(r => r.status === 'approved').people} чел. по {myDiscountRequests.find(r => r.status === 'approved').requestedPrice} ₽ ({myDiscountRequests.find(r => r.status === 'approved').cruiseName})
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const r = myDiscountRequests.find(r => r.status === 'approved');
                        setTicketsCount(r.people);
                        handleCompleteSale(r.requestedPrice);
                      }}
                      style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                    >
                      Пробить
                    </button>
                  </div>
                </div>
              )}

              {/* Выбор рейса */}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: T.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  1. Выберите рейс
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {events.map(ev => {
                    const isSelected = selectedEvent?.id === ev.id;
                    return (
                      <div 
                        key={ev.id}
                        onClick={() => handleSelectEvent(ev)}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          background: isSelected 
                            ? (isLight ? '#eff6ff' : 'linear-gradient(135deg, rgba(37,99,235,0.2) 0%, rgba(14,165,233,0.15) 100%)') 
                            : T.cardBg,
                          border: isSelected ? '2px solid #0284c7' : `1px solid ${T.cardBorder}`,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: T.cardShadow
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '15px', color: isSelected ? T.cyan : T.textHeading }}>
                              {ev.name}
                            </div>
                            <div style={{ fontSize: '12px', color: T.textMuted, marginTop: '2px' }}>
                              {ev.description || 'Прогулка на комфортабельном теплоходе'}
                            </div>
                          </div>
                          <div style={{ fontWeight: 700, color: T.amber, fontSize: '15px', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                            {ev.price_standard || 1500} ₽
                          </div>
                        </div>

                        {isSelected && ev.slots && ev.slots.length > 0 && (
                          <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: `1px solid ${T.cardBorder}` }}>
                            <div style={{ fontSize: '12px', color: T.textMuted, marginBottom: '6px' }}>Время отправления сегодня:</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {ev.slots.map(slot => {
                                const isSlotSelected = selectedSlot?.id === slot.id;
                                const available = getAvailableSeats(ev, slot);
                                return (
                                  <button
                                    key={slot.id}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedSlot(slot);
                                    }}
                                    style={{
                                      padding: '6px 12px',
                                      borderRadius: '8px',
                                      border: isSlotSelected ? '2px solid #38bdf8' : `1px solid ${T.cardBorderStrong}`,
                                      background: isSlotSelected ? '#0284c7' : T.cardInner,
                                      color: isSlotSelected ? '#fff' : T.textMain,
                                      fontSize: '12px',
                                      fontWeight: 600,
                                      cursor: 'pointer'
                                    }}
                                  >
                                    {slot.time || '19:00'} ({available} мест)
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Количество билетов */}
              <div style={{ background: T.cardBg, padding: '16px', borderRadius: '12px', border: `1px solid ${T.cardBorder}`, boxShadow: T.cardShadow }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: T.textMuted, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  2. Количество пассажиров
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setTicketsCount(num)}
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '10px',
                          border: ticketsCount === num ? '2px solid #38bdf8' : `1px solid ${T.cardBorderStrong}`,
                          background: ticketsCount === num ? '#0284c7' : T.cardInner,
                          color: ticketsCount === num ? '#fff' : T.textMain,
                          fontWeight: 700,
                          fontSize: '16px',
                          cursor: 'pointer'
                        }}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: T.textMuted }}>Осталось на рейсе</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: freeSeats > 10 ? '#10b981' : '#dc2626' }}>
                      {freeSeats} мест
                    </div>
                  </div>
                </div>
              </div>

              {/* Способ оплаты и телефон клиента */}
              <div style={{ background: T.cardBg, padding: '16px', borderRadius: '12px', border: `1px solid ${T.cardBorder}`, boxShadow: T.cardShadow }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: T.textMuted, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  3. Оплата и телефон
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('sbp_qr')}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: paymentMode === 'sbp_qr' ? '2px solid #10b981' : `1px solid ${T.cardBorderStrong}`,
                      background: paymentMode === 'sbp_qr' ? (isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.15)') : T.cardInner,
                      color: T.textMain,
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '14px', color: T.emerald }}>
                      <QrCode size={16} /> QR СБП
                    </div>
                    <div style={{ fontSize: '11px', color: T.textMuted, marginTop: '4px' }}>
                      Клиент платит телефоном
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMode('cash')}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: paymentMode === 'cash' ? '2px solid #f59e0b' : `1px solid ${T.cardBorderStrong}`,
                      background: paymentMode === 'cash' ? (isLight ? '#fffbeb' : 'rgba(245, 158, 11, 0.15)') : T.cardInner,
                      color: T.textMain,
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '14px', color: T.amberWarm }}>
                      <DollarSign size={16} /> Наличные
                    </div>
                    <div style={{ fontSize: '11px', color: T.textMuted, marginTop: '4px' }}>
                      Оплата на руки
                    </div>
                  </button>
                </div>

                <input 
                  type="tel"
                  placeholder="Телефон клиента (для SMS-билета)"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  style={{ width: '100%', background: T.inputBg, border: `1px solid ${T.inputBorder}`, padding: '10px 12px', borderRadius: '8px', color: T.inputText, fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>

              {/* Итог и кнопка печати/выдачи */}
              <div style={{ background: T.summaryBg, padding: '16px', borderRadius: '12px', border: `1px solid ${T.summaryBorder}`, boxShadow: T.cardShadow }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: T.textMuted }}>Сумма с клиента ({ticketsCount} билета):</span>
                  <span style={{ fontSize: '22px', fontWeight: 800, color: T.amber }}>{currentTotal} ₽</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '13px', color: T.cyan, fontWeight: 600 }}>Ваш заработок ({selectedAgent.promoterPrecent}%):</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: T.emerald }}>+{currentEarning} ₽</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    disabled={isSubmitting || freeSeats < ticketsCount}
                    onClick={() => handleCompleteSale()}
                    style={{
                      flex: 1,
                      padding: '16px',
                      borderRadius: '12px',
                      background: freeSeats < ticketsCount ? '#94a3b8' : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                      color: '#fff',
                      border: 'none',
                      fontSize: '15px',
                      fontWeight: 800,
                      cursor: freeSeats < ticketsCount ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    {isSubmitting ? (
                      <RefreshCw size={20} className="animate-spin" />
                    ) : (
                      <>
                        <QrCode size={20} />
                        <span>{paymentMode === 'sbp_qr' ? 'ВЫДАТЬ QR НА ОПЛАТУ' : 'ПРОБИТЬ И ВЫДАТЬ БИЛЕТ'}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPromoterTab('request')}
                    title="Клиент не согласен на эту цену? Запросить спеццену у шефа!"
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      background: isLight ? '#fef3c7' : 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid #f59e0b',
                      color: T.amberWarm,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Flame size={20} />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ЭКРАН ВЫДАННОГО БИЛЕТА */}
          {saleResult && (
            <div style={{ background: T.cardBg, borderRadius: '16px', padding: '20px', border: '2px solid #10b981', textAlign: 'center', boxShadow: T.cardShadow }}>
              <div style={{ display: 'inline-flex', padding: '8px', background: isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.2)', borderRadius: '50%', color: T.emerald, marginBottom: '10px' }}>
                <CheckCircle2 size={36} />
              </div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 800, color: T.textHeading }}>
                {saleResult.paymentMode === 'sbp_qr' ? 'QR-КОД ДЛЯ ОПЛАТЫ И ПОСАДКИ' : 'БИЛЕТ УСПЕШНО ОФОРМЛЕН!'}
              </h2>
              <div style={{ fontSize: '13px', color: T.textMuted, marginBottom: '16px' }}>
                Номер группы бронирования: <strong style={{ color: T.cyan }}>{saleResult.groupId}</strong>
              </div>

              {/* QR-код SVG */}
              <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', display: 'inline-block', marginBottom: '16px', border: `1px solid ${T.cardBorder}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <img 
                  src={saleResult.qrCodeUrl} 
                  alt="Посадочный QR" 
                  style={{ width: '200px', height: '200px', display: 'block' }} 
                />
              </div>

              <div style={{ background: T.cardInner, border: `1px solid ${T.cardBorder}`, padding: '14px', borderRadius: '10px', textAlign: 'left', marginBottom: '16px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: T.textMuted }}>Рейс:</span>
                  <strong style={{ color: T.textHeading }}>{saleResult.eventName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: T.textMuted }}>Отправление:</span>
                  <strong style={{ color: T.cyan }}>{saleResult.date}, {saleResult.time}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: T.textMuted }}>Кол-во пассажиров:</span>
                  <strong style={{ color: T.textHeading }}>{saleResult.ticketsCount} чел.</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: T.textMuted }}>Сумма заказа:</span>
                  <strong style={{ color: T.amber }}>{saleResult.totalAmount} ₽</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${T.cardBorder}`, paddingTop: '6px', marginTop: '6px' }}>
                  <span style={{ color: T.emerald, fontWeight: 600 }}>Ваша комиссия:</span>
                  <strong style={{ color: T.emerald, fontSize: '15px' }}>+{saleResult.agentEarning} ₽</strong>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://promo.tickets.ru/b/${saleResult.groupId}`);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#0284c7',
                    color: '#fff',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {copiedLink ? <Check size={16} /> : <Share2 size={16} />}
                  <span>{copiedLink ? 'Ссылка скопирована!' : 'Скопировать ссылку для гостя'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSaleResult(null)}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    background: isLight ? '#e2e8f0' : '#334155',
                    color: isLight ? '#1e293b' : '#fff',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Новая продажа
                </button>
              </div>
            </div>
          )}

          {/* 1.2: ЗАЯВКА НА СОГЛАСОВАНИЕ СКИДКИ */}
          {promoterTab === 'request' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: T.purpleBanner, border: '1px solid #7c3aed', padding: '16px', borderRadius: '14px', boxShadow: T.cardShadow }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ padding: '8px', borderRadius: '8px', background: '#7c3aed', color: '#fff' }}>
                    <Flame size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '16px', color: T.textHeading }}>Запрос спеццены / Скидки</div>
                    <div style={{ fontSize: '12px', color: T.textSub }}>Оперативное согласование со старшим промоутером ({selectedAgent.staticName})</div>
                  </div>
                </div>

                {reqSuccessMsg && (
                  <div style={{ background: '#10b981', color: '#fff', padding: '10px 14px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} /> Заявка отправлена шефу! Ожидайте подтверждения на экране.
                  </div>
                )}

                <form onSubmit={handleSendDiscountRequest} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: T.textMuted, display: 'block', marginBottom: '4px' }}>Рейс:</label>
                    <select 
                      value={reqCruise} 
                      onChange={(e) => setReqCruise(e.target.value)}
                      style={{ width: '100%', background: T.inputBg, border: `1px solid ${T.inputBorder}`, color: T.inputText, padding: '10px', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                    >
                      {events.map(ev => (
                        <option key={ev.id} value={ev.name}>{ev.name} (база {ev.price_standard || 1500} ₽)</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: T.textMuted, display: 'block', marginBottom: '4px' }}>Гостей (чел):</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="30"
                        value={reqPeople} 
                        onChange={(e) => setReqPeople(e.target.value)}
                        style={{ width: '100%', background: T.inputBg, border: `1px solid ${T.inputBorder}`, color: T.inputText, padding: '10px', borderRadius: '8px', fontSize: '15px', fontWeight: 700, boxSizing: 'border-box', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: T.textMuted, display: 'block', marginBottom: '4px' }}>Желаемая цена (₽/билет):</label>
                      <input 
                        type="number" 
                        step="50"
                        value={reqCustomPrice} 
                        onChange={(e) => setReqCustomPrice(e.target.value)}
                        style={{ width: '100%', background: T.inputBg, border: '1px solid #7c3aed', color: T.amber, padding: '10px', borderRadius: '8px', fontSize: '15px', fontWeight: 800, boxSizing: 'border-box', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: T.textMuted, display: 'block', marginBottom: '4px' }}>Минут до отправления (timeWalk):</label>
                      <input 
                        type="number" 
                        value={reqTimeWalk} 
                        onChange={(e) => setReqTimeWalk(e.target.value)}
                        style={{ width: '100%', background: T.inputBg, border: `1px solid ${T.inputBorder}`, color: T.inputText, padding: '10px', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: T.textMuted, display: 'block', marginBottom: '4px' }}>Форма расчета:</label>
                      <select 
                        value={paymentMode} 
                        onChange={(e) => setPaymentMode(e.target.value)}
                        style={{ width: '100%', background: T.inputBg, border: `1px solid ${T.inputBorder}`, color: T.inputText, padding: '10px', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                      >
                        <option value="cash">Наличные на руки</option>
                        <option value="sbp_qr">СБП QR код</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: T.textMuted, display: 'block', marginBottom: '4px' }}>Аргумент для статика (почему сбрасываем):</label>
                    <input 
                      type="text" 
                      placeholder="Например: Семья из 4 чел, уходят к катеру за 1200, нал на руках"
                      value={reqComment} 
                      onChange={(e) => setReqComment(e.target.value)}
                      style={{ width: '100%', background: T.inputBg, border: `1px solid ${T.inputBorder}`, color: T.inputText, padding: '10px', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      marginTop: '6px',
                      background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                      color: '#fff',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '15px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Send size={18} />
                    <span>ОТПРАВИТЬ ЗАЯВКУ ШЕФУ (СТАТИКУ)</span>
                  </button>
                </form>
              </div>

              {/* Список моих запросов */}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: T.textMuted, marginBottom: '8px', textTransform: 'uppercase' }}>
                  Мои последние согласования ({myDiscountRequests.length})
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {myDiscountRequests.map(req => (
                    <div 
                      key={req.id}
                      style={{
                        background: T.cardBg,
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1px solid',
                        borderColor: req.status === 'approved' ? '#10b981' : req.status === 'rejected' ? '#ef4444' : '#f59e0b',
                        boxShadow: T.cardShadow,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 700, fontSize: '14px', color: T.textHeading }}>{req.cruiseName}</span>
                          <span style={{ fontSize: '11px', padding: '1px 6px', borderRadius: '4px', background: req.status === 'approved' ? (isLight ? '#ecfdf5' : 'rgba(16,185,129,0.2)') : req.status === 'rejected' ? (isLight ? '#fef2f2' : 'rgba(239,68,68,0.2)') : (isLight ? '#fffbeb' : 'rgba(245,158,11,0.2)'), color: req.status === 'approved' ? T.emerald : req.status === 'rejected' ? T.red : T.amberWarm, fontWeight: 700 }}>
                            {req.status === 'approved' ? 'ОДОБРЕНО' : req.status === 'rejected' ? 'ОТКЛОНЕНО' : 'ЖДЕТ ОТВЕТА'}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: T.textMuted, marginTop: '2px' }}>
                          {req.people} чел. по <strong style={{ color: T.textHeading }}>{req.requestedPrice} ₽</strong> (вместо {req.basePrice} ₽) • {req.timeWalk} мин до рейса
                        </div>
                        {req.comment && (
                          <div style={{ fontSize: '11px', color: T.textSub, marginTop: '2px', fontStyle: 'italic' }}>
                            "{req.comment}"
                          </div>
                        )}
                      </div>

                      {req.status === 'approved' && (
                        <button
                          type="button"
                          onClick={() => {
                            setTicketsCount(req.people);
                            handleCompleteSale(req.requestedPrice);
                          }}
                          style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                        >
                          Выдать билет
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 1.3: ФИКСАЦИЯ ОТКАЗА КЛИЕНТА */}
          {promoterTab === 'refuse' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: T.redBanner, border: '1px solid #dc2626', padding: '16px', borderRadius: '14px', boxShadow: T.cardShadow }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ padding: '8px', borderRadius: '8px', background: '#dc2626', color: '#fff' }}>
                    <XCircle size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '16px', color: T.textHeading }}>Быстрая фиксация отказа (Упущенный клиент)</div>
                    <div style={{ fontSize: '12px', color: T.textSub }}>Анализ причин срыва сделок для руководства точки</div>
                  </div>
                </div>

                {refSuccessMsg && (
                  <div style={{ background: '#10b981', color: '#fff', padding: '10px 14px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', marginBottom: '12px' }}>
                    Отказ зафиксирован в журнале точки!
                  </div>
                )}

                <form onSubmit={handleRecordRefuse} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: T.textMuted, display: 'block', marginBottom: '4px' }}>Главная причина срыва:</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
                      {[
                        'Дорого / Слишком высокая цена',
                        'Не успевают по времени / Спешат',
                        'Погода / Ветер на реке / Дождь',
                        'Ушли на малый катер / К конкурентам',
                        'Просто гуляют / Передумали'
                      ].map(rzn => (
                        <label 
                          key={rzn} 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: refReason === rzn ? (isLight ? '#fef2f2' : 'rgba(239, 68, 68, 0.2)') : T.inputBg,
                            border: refReason === rzn ? '1px solid #ef4444' : `1px solid ${T.cardBorder}`,
                            padding: '10px 12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            color: T.textMain
                          }}
                        >
                          <input 
                            type="radio" 
                            name="refuseReason" 
                            checked={refReason === rzn} 
                            onChange={() => setRefReason(rzn)} 
                          />
                          <span>{rzn}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: T.textMuted, display: 'block', marginBottom: '4px' }}>Сколько человек ушло:</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="20"
                        value={refPeople} 
                        onChange={(e) => setRefPeople(e.target.value)}
                        style={{ width: '100%', background: T.inputBg, border: `1px solid ${T.inputBorder}`, color: T.inputText, padding: '10px', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: T.textMuted, display: 'block', marginBottom: '4px' }}>Точка контакта:</label>
                      <div style={{ padding: '10px', background: T.cardInner, border: `1px solid ${T.cardBorder}`, borderRadius: '8px', color: T.cyan, fontSize: '13px', fontWeight: 600 }}>
                        {selectedAgent.spot}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: T.textMuted, display: 'block', marginBottom: '4px' }}>Комментарий промоутера:</label>
                    <input 
                      type="text" 
                      placeholder="Что именно говорили клиенты перед уходом..."
                      value={refComment} 
                      onChange={(e) => setRefComment(e.target.value)}
                      style={{ width: '100%', background: T.inputBg, border: `1px solid ${T.inputBorder}`, color: T.inputText, padding: '10px', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      marginTop: '6px',
                      background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                      color: '#fff',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <XCircle size={18} />
                    <span>ЗАФИКСИРОВАТЬ ОТКАЗ В БАЗЕ ТОЧКИ</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 1.4: МОЯ КАССА И ЗАРПЛАТА */}
          {promoterTab === 'stats' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: T.summaryBg, padding: '20px', borderRadius: '16px', border: `1px solid ${T.cardBorder}`, textAlign: 'center', boxShadow: T.cardShadow }}>
                <div style={{ fontSize: '13px', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                  Мой заработок за смену ({selectedAgent.promoterPrecent}%)
                </div>
                <div style={{ fontSize: '36px', fontWeight: 900, color: T.emerald, margin: '8px 0' }}>
                  {agentTotalEarned.toLocaleString('ru-RU')} ₽
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '12px' }}>
                  <div style={{ background: T.cardBg, padding: '8px 14px', borderRadius: '8px', border: `1px solid ${T.cardBorder}`, boxShadow: T.cardShadow }}>
                    <div style={{ fontSize: '11px', color: T.textMuted }}>Продано билетов</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: T.cyan }}>{agentTotalTickets} шт.</div>
                  </div>
                  <div style={{ background: T.cardBg, padding: '8px 14px', borderRadius: '8px', border: `1px solid ${T.cardBorder}`, boxShadow: T.cardShadow }}>
                    <div style={{ fontSize: '11px', color: T.textMuted }}>Общая выручка</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: T.amber }}>{agentTotalRevenue.toLocaleString('ru-RU')} ₽</div>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: T.textHeading, marginBottom: '10px' }}>
                  Лента моих билетов ({agentBookings.length})
                </div>

                {agentBookings.length === 0 ? (
                  <div style={{ background: T.cardBg, padding: '30px', borderRadius: '12px', textAlign: 'center', color: T.textMuted, border: `1px solid ${T.cardBorder}`, boxShadow: T.cardShadow }}>
                    Пока нет оформленных билетов в текущей смене. Оформите первую группу!
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {agentBookings.slice().reverse().map((b, idx) => (
                      <div 
                        key={b.id || idx}
                        style={{
                          background: T.cardBg,
                          padding: '12px 14px',
                          borderRadius: '10px',
                          border: `1px solid ${T.cardBorder}`,
                          boxShadow: T.cardShadow,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '14px', color: T.textHeading }}>
                            Билет #{b.id?.slice(0, 8) || idx + 1}
                          </div>
                          <div style={{ fontSize: '12px', color: T.textMuted, marginTop: '2px' }}>
                            {b.seat_number} • Оплата: {b.payment_method === 'sbp_qr' ? 'СБП QR' : 'Наличные'}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, color: T.emerald, fontSize: '14px' }}>
                            +{b.promo_commission || Math.round(Number(b.price_paid) * (selectedAgent.promoterPrecent / 100))} ₽
                          </div>
                          <div style={{ fontSize: '11px', color: T.textMuted }}>
                            Чек: {b.price_paid} ₽
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* РЕЖИМ 2: ГЛАВНЫЙ ПРОМОУТЕР / СТАТИК (ШТАБ И ДЕРЕВО СЕТИ) */}
      {roleMode === 'dispatcher' && (
        <div style={{ padding: '20px' }}>
          
          <div style={{ display: 'flex', gap: '8px', borderBottom: `1px solid ${T.cardBorder}`, paddingBottom: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setDispatcherTab('tree')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                border: dispatcherTab === 'tree' ? 'none' : `1px solid ${T.tabInactiveBorder}`,
                background: dispatcherTab === 'tree' ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' : T.tabInactiveBg,
                color: dispatcherTab === 'tree' ? '#fff' : T.tabInactiveText,
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: dispatcherTab === 'tree' ? '0 2px 8px rgba(124, 58, 237, 0.25)' : T.cardShadow
              }}
            >
              <GitFork size={16} />
              <span>Дерево промоутеров (Hierarchy Tree)</span>
            </button>

            <button
              type="button"
              onClick={() => setDispatcherTab('queue')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                border: dispatcherTab === 'queue' ? 'none' : `1px solid ${T.tabInactiveBorder}`,
                background: dispatcherTab === 'queue' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : T.tabInactiveBg,
                color: dispatcherTab === 'queue' ? '#fff' : T.tabInactiveText,
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                position: 'relative',
                boxShadow: dispatcherTab === 'queue' ? '0 2px 8px rgba(2, 132, 199, 0.25)' : T.cardShadow
              }}
            >
              <MessageSquare size={16} />
              <span>Пульт согласования скидок</span>
              {pendingRequestsCount > 0 && (
                <span style={{ background: '#ef4444', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>
                  {pendingRequestsCount} новых
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setDispatcherTab('refuses')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                border: dispatcherTab === 'refuses' ? 'none' : `1px solid ${T.tabInactiveBorder}`,
                background: dispatcherTab === 'refuses' ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' : T.tabInactiveBg,
                color: dispatcherTab === 'refuses' ? '#fff' : T.tabInactiveText,
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: dispatcherTab === 'refuses' ? '0 2px 8px rgba(220, 38, 38, 0.25)' : T.cardShadow
              }}
            >
              <XCircle size={16} />
              <span>Журнал отказов (Refuses)</span>
            </button>

            <button
              type="button"
              onClick={() => setDispatcherTab('commissions')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                border: dispatcherTab === 'commissions' ? 'none' : `1px solid ${T.tabInactiveBorder}`,
                background: dispatcherTab === 'commissions' ? (isLight ? '#334155' : '#475569') : T.tabInactiveBg,
                color: dispatcherTab === 'commissions' ? '#fff' : T.tabInactiveText,
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: dispatcherTab === 'commissions' ? '0 2px 8px rgba(0,0,0,0.1)' : T.cardShadow
              }}
            >
              <Sliders size={16} />
              <span>Управление ставками (%)</span>
            </button>
          </div>

          {/* 2.1: ДЕРЕВО ПРОМОУТЕРОВ */}
          {dispatcherTab === 'tree' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div style={{ background: T.cardBg, padding: '16px', borderRadius: '12px', border: `1px solid ${T.cardBorder}`, boxShadow: T.cardShadow }}>
                  <div style={{ fontSize: '12px', color: T.textMuted }}>Общая выручка сети</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: T.amber, marginTop: '4px' }}>
                    {treeAggregates.global.summa.toLocaleString('ru-RU')} ₽
                  </div>
                  <div style={{ fontSize: '11px', color: '#10b981', marginTop: '2px' }}>{treeAggregates.global.tickets} билетов продано</div>
                </div>

                <div style={{ background: T.cardBg, padding: '16px', borderRadius: '12px', border: `1px solid ${T.cardBorder}`, boxShadow: T.cardShadow }}>
                  <div style={{ fontSize: '12px', color: T.textMuted }}>ЗП полевых промоутеров</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: T.cyan, marginTop: '4px' }}>
                    {treeAggregates.global.promoterZp.toLocaleString('ru-RU')} ₽
                  </div>
                  <div style={{ fontSize: '11px', color: T.textMuted, marginTop: '2px' }}>Комиссия с набережных (18-25%)</div>
                </div>

                <div style={{ background: T.cardBg, padding: '16px', borderRadius: '12px', border: `1px solid ${T.cardBorder}`, boxShadow: T.cardShadow }}>
                  <div style={{ fontSize: '12px', color: T.textMuted }}>ЗП главных промоутеров (Статиков)</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: T.purple, marginTop: '4px' }}>
                    {treeAggregates.global.staticZp.toLocaleString('ru-RU')} ₽
                  </div>
                  <div style={{ fontSize: '11px', color: T.textMuted, marginTop: '2px' }}>Кураторский процент (5-10%)</div>
                </div>

                <div style={{ background: T.cardBg, padding: '16px', borderRadius: '12px', border: `1px solid ${T.cardBorder}`, boxShadow: T.cardShadow }}>
                  <div style={{ fontSize: '12px', color: T.textMuted }}>ФОТ Промо-команды всего</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: T.emerald, marginTop: '4px' }}>
                    {treeAggregates.global.totalZp.toLocaleString('ru-RU')} ₽
                  </div>
                  <div style={{ fontSize: '11px', color: T.textMuted, marginTop: '2px' }}>Все начисления за смену</div>
                </div>
              </div>

              <div style={{ background: T.cardBg, borderRadius: '14px', border: `1px solid ${T.cardBorder}`, overflow: 'hidden', boxShadow: T.cardShadow }}>
                <div style={{ padding: '14px 20px', background: T.tableHeaderBg, borderBottom: `1px solid ${T.cardBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: T.textHeading, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <GitFork size={18} style={{ color: '#7c3aed' }} />
                    <span>Иерархическая структура точек и агентов</span>
                  </div>
                  <div style={{ fontSize: '12px', color: T.textMuted }}>
                    Кликните на строку для раскрытия веток
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: T.tableHeaderBg, color: T.tableHeaderText, borderBottom: `1px solid ${T.tableHeaderBorder}`, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
                        <th style={{ padding: '12px 16px' }}>Узел сети (Точка / Статик / Промоутер)</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Выручка</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>Ставка (%)</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>ЗП агента</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>Продано</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {treeAggregates.points.map(point => {
                        const isPointExpanded = expandedNodes[point.id];
                        return (
                          <React.Fragment key={point.id}>
                            <tr 
                              onClick={() => toggleNode(point.id)}
                              style={{ 
                                background: T.tableRowPoint, 
                                borderBottom: `1px solid ${T.tableBorder}`, 
                                cursor: 'pointer',
                                fontWeight: 700 
                              }}
                            >
                              <td style={{ padding: '12px 16px', color: T.textHeading, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {isPointExpanded ? <ChevronDown size={16} color={T.cyan} /> : <ChevronRight size={16} color={T.textMuted} />}
                                <MapPin size={16} color={T.cyan} />
                                <span>{point.name}</span>
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'right', color: T.amber, fontWeight: 800 }}>
                                {point.revenue.toLocaleString('ru-RU')} ₽
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'center', color: T.textMuted }}>
                                План: {point.dailyTarget / 1000}к
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'right', color: T.emerald, fontWeight: 800 }}>
                                {(point.promoterZp + point.staticZp).toLocaleString('ru-RU')} ₽
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'center', color: T.textHeading }}>
                                {point.tickets} шт.
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: isLight ? '#ecfdf5' : 'rgba(16,185,129,0.15)', color: T.emerald, fontWeight: 600 }}>
                                  Точка открыта
                                </span>
                              </td>
                            </tr>

                            {isPointExpanded && point.statics.map(stat => {
                              const isStatExpanded = expandedNodes[stat.id];
                              return (
                                <React.Fragment key={stat.id}>
                                  <tr 
                                    onClick={() => toggleNode(stat.id)}
                                    style={{ 
                                      background: T.tableRowStatic, 
                                      borderBottom: `1px solid ${T.tableSubBorder}`, 
                                      cursor: 'pointer' 
                                    }}
                                  >
                                    <td style={{ padding: '10px 16px 10px 36px', color: T.purple, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                                      {isStatExpanded ? <ChevronDown size={14} color={T.purple} /> : <ChevronRight size={14} color={T.textMuted} />}
                                      <ShieldCheck size={16} color={T.purple} />
                                      <span>{stat.name}</span>
                                      <span style={{ fontSize: '11px', color: T.textMuted, fontWeight: 400 }}>({stat.phone})</span>
                                    </td>
                                    <td style={{ padding: '10px 16px', textAlign: 'right', color: T.textSub }}>
                                      {stat.revenue.toLocaleString('ru-RU')} ₽
                                    </td>
                                    <td style={{ padding: '10px 16px', textAlign: 'center', color: T.purple, fontWeight: 700 }}>
                                      {stat.staticPrecent}% {stat.isPlanDone ? `+ ${stat.staticPrecent2}% бонус` : `(+${stat.staticPrecent2}%)`}
                                    </td>
                                    <td style={{ padding: '10px 16px', textAlign: 'right', color: T.purple, fontWeight: 800 }}>
                                      {stat.staticZp.toLocaleString('ru-RU')} ₽
                                    </td>
                                    <td style={{ padding: '10px 16px', textAlign: 'center', color: T.textSub }}>
                                      {stat.tickets} шт.
                                    </td>
                                    <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                                      <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: stat.isPlanDone ? (isLight ? '#ecfdf5' : 'rgba(16,185,129,0.2)') : (isLight ? '#f1f5f9' : 'rgba(148,163,184,0.1)'), color: stat.isPlanDone ? T.emerald : T.textMuted, fontWeight: 600 }}>
                                        {stat.isPlanDone ? 'План выполнен' : 'В процессе'}
                                      </span>
                                    </td>
                                  </tr>

                                  {isStatExpanded && stat.promoters.map(prom => (
                                    <tr 
                                      key={prom.id}
                                      style={{ 
                                        background: T.tableRowPromoter, 
                                        borderBottom: `1px solid ${T.tableSubBorder}` 
                                      }}
                                    >
                                      <td style={{ padding: '8px 16px 8px 60px', color: T.textSub, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: T.cyan }} />
                                        <span style={{ fontWeight: 600, color: T.textHeading }}>{prom.name}</span>
                                        <span style={{ fontSize: '11px', color: T.textMuted }}>• {prom.spot}</span>
                                      </td>
                                      <td style={{ padding: '8px 16px', textAlign: 'right', color: T.textSub }}>
                                        {prom.revenue.toLocaleString('ru-RU')} ₽
                                      </td>
                                      <td style={{ padding: '8px 16px', textAlign: 'center', color: T.cyan, fontWeight: 700 }}>
                                        {prom.promoterPrecent}%
                                      </td>
                                      <td style={{ padding: '8px 16px', textAlign: 'right', color: T.emerald, fontWeight: 700 }}>
                                        {prom.zp.toLocaleString('ru-RU')} ₽
                                      </td>
                                      <td style={{ padding: '8px 16px', textAlign: 'center', color: T.textSub }}>
                                        {prom.tickets} шт.
                                      </td>
                                      <td style={{ padding: '8px 16px', textAlign: 'center' }}>
                                        <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: isLight ? '#f0f9ff' : 'rgba(56,189,248,0.15)', color: T.cyan, fontWeight: 600 }}>
                                          В поле
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </React.Fragment>
                              );
                            })}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* 2.2: ПУЛЬТ СОГЛАСОВАНИЯ СКИДОК */}
          {dispatcherTab === 'queue' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: T.textHeading }}>
                    Входящие запросы скидок от уличных промоутеров
                  </h3>
                  <div style={{ fontSize: '13px', color: T.textMuted }}>
                    Оперативное подтверждение снижения цены для удержания туристов на набережной
                  </div>
                </div>

                <div style={{ background: T.cardInner, padding: '6px 12px', borderRadius: '8px', border: `1px solid ${T.cardBorder}`, fontSize: '12px', color: T.cyan }}>
                  Ожидают решения: <strong>{pendingRequestsCount}</strong>
                </div>
              </div>

              {discountRequests.length === 0 ? (
                <div style={{ background: T.cardBg, padding: '40px', borderRadius: '12px', textAlign: 'center', color: T.textMuted, border: `1px solid ${T.cardBorder}`, boxShadow: T.cardShadow }}>
                  Входящих заявок на скидки пока нет.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {discountRequests.map(req => (
                    <div 
                      key={req.id}
                      style={{
                        background: T.cardBg,
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: req.status === 'pending' ? '#f59e0b' : req.status === 'approved' ? '#10b981' : '#ef4444',
                        boxShadow: T.cardShadow,
                        padding: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 800, fontSize: '16px', color: T.textHeading }}>{req.cruiseName}</span>
                            <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, background: req.status === 'approved' ? (isLight ? '#ecfdf5' : 'rgba(16,185,129,0.2)') : req.status === 'rejected' ? (isLight ? '#fef2f2' : 'rgba(239,68,68,0.2)') : (isLight ? '#fffbeb' : 'rgba(245,158,11,0.2)'), color: req.status === 'approved' ? T.emerald : req.status === 'rejected' ? T.red : T.amberWarm }}>
                              {req.status === 'approved' ? 'ОДОБРЕНО ШЕФОМ' : req.status === 'rejected' ? 'ОТКЛОНЕНО' : 'ТРЕБУЕТ СОГЛАСОВАНИЯ'}
                            </span>
                          </div>
                          
                          <div style={{ fontSize: '13px', color: T.textSub, marginTop: '6px' }}>
                            Промоутер: <strong style={{ color: T.cyan }}>{req.promoterName}</strong> • Точка: <strong>{req.pointName}</strong> • Оплата: {req.paymentMethod === 'cash' ? 'Наличные' : 'СБП QR'}
                          </div>
                          
                          <div style={{ fontSize: '13px', color: T.textMuted, marginTop: '4px' }}>
                            Группа: <strong>{req.people} чел.</strong> • Базовая цена: <s>{req.basePrice} ₽</s> • Запрошено: <strong style={{ color: T.amber, fontSize: '15px' }}>{req.requestedPrice} ₽</strong> (Скидка {Math.round((1 - req.requestedPrice / req.basePrice) * 100)}%)
                          </div>

                          {req.timeWalk && (
                            <div style={{ fontSize: '12px', color: T.amberWarm, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={13} /> До отправления: <strong>{req.timeWalk} минут</strong>
                            </div>
                          )}

                          {req.comment && (
                            <div style={{ background: T.cardInner, padding: '8px 12px', borderRadius: '8px', fontSize: '12px', color: T.textMain, marginTop: '8px', borderLeft: '3px solid #7c3aed', border: `1px solid ${T.cardBorder}` }}>
                              Комментарий с улицы: "{req.comment}"
                            </div>
                          )}
                        </div>

                        {req.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleApproveDiscount(req.id)}
                              style={{
                                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 16px',
                                borderRadius: '8px',
                                fontWeight: 800,
                                fontSize: '13px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <CheckCircle size={16} />
                              <span>ОДОБРИТЬ СКИДКУ</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRejectDiscount(req.id)}
                              style={{
                                background: isLight ? '#f1f5f9' : '#334155',
                                color: T.red,
                                border: '1px solid #ef4444',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                fontWeight: 700,
                                fontSize: '13px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <XCircle size={16} />
                              <span>ОТКЛОНИТЬ</span>
                            </button>
                          </div>
                        ) : (
                          <div style={{ fontSize: '12px', color: T.textMuted, textAlign: 'right' }}>
                            Решение принял: {req.approvedBy || selectedStatic.name}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2.3: ЖУРНАЛ ОТКАЗОВ (REFUSES) */}
          {dispatcherTab === 'refuses' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: T.textHeading }}>
                    Журнал отказов туристов на набережных ({refusesList.length})
                  </h3>
                  <div style={{ fontSize: '13px', color: T.textMuted }}>
                    Фиксация упущенных клиентов для анализа ценообразования и работы с возражениями
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleExportRefusesCSV}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#0284c7',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  <FileSpreadsheet size={16} />
                  <span>Экспорт журнала в Excel / CSV</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div style={{ background: T.cardBg, padding: '16px', borderRadius: '12px', border: '1px solid #ef4444', boxShadow: T.cardShadow }}>
                  <div style={{ fontSize: '12px', color: T.textMuted }}>Упущено туристов</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: T.red, marginTop: '4px' }}>
                    {refusesList.reduce((s, r) => s + (Number(r.people) || 0), 0)} чел.
                  </div>
                  <div style={{ fontSize: '11px', color: T.textMuted, marginTop: '2px' }}>Зафиксировано на точках</div>
                </div>

                <div style={{ background: T.cardBg, padding: '16px', borderRadius: '12px', border: `1px solid ${T.cardBorder}`, boxShadow: T.cardShadow }}>
                  <div style={{ fontSize: '12px', color: T.textMuted }}>Упущенная выручка (оценка)</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: T.amber, marginTop: '4px' }}>
                    {refusesList.reduce((s, r) => s + ((Number(r.people) || 0) * (Number(r.price) || 1500)), 0).toLocaleString('ru-RU')} ₽
                  </div>
                  <div style={{ fontSize: '11px', color: T.textMuted, marginTop: '2px' }}>По номинальной цене билетов</div>
                </div>
              </div>

              <div style={{ background: T.cardBg, borderRadius: '12px', border: `1px solid ${T.cardBorder}`, overflow: 'hidden', boxShadow: T.cardShadow }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: T.tableHeaderBg, color: T.tableHeaderText, borderBottom: `1px solid ${T.tableHeaderBorder}`, fontSize: '11px', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 16px' }}>Время</th>
                        <th style={{ padding: '12px 16px' }}>Точка / Промоутер</th>
                        <th style={{ padding: '12px 16px' }}>Рейс</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center' }}>Гостей</th>
                        <th style={{ padding: '12px 16px' }}>Причина срыва</th>
                        <th style={{ padding: '12px 16px' }}>Комментарий</th>
                      </tr>
                    </thead>
                    <tbody>
                      {refusesList.map(ref => (
                        <tr key={ref.id} style={{ borderBottom: `1px solid ${T.tableBorder}` }}>
                          <td style={{ padding: '12px 16px', color: T.textMuted, whiteSpace: 'nowrap' }}>
                            {new Date(ref.date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontWeight: 600, color: T.textHeading }}>{ref.promoterName}</div>
                            <div style={{ fontSize: '11px', color: T.cyan }}>{ref.pointName}</div>
                          </td>
                          <td style={{ padding: '12px 16px', color: T.textSub }}>
                            {ref.cruiseName}
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: T.red }}>
                            {ref.people} чел.
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: isLight ? '#fef2f2' : 'rgba(239,68,68,0.15)', color: T.red, fontWeight: 600 }}>
                              {ref.reason}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', color: T.textSub, fontStyle: 'italic', maxWidth: '280px' }}>
                            {ref.comment || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2.4: НАСТРОЙКА КОМИССИЙ (%) */}
          {dispatcherTab === 'commissions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: T.textHeading }}>
                  Настройка дифференцированных ставок промоутеров и статиков
                </h3>
                <div style={{ fontSize: '13px', color: T.textMuted }}>
                  Изменение базовых комиссий и бонусов за перевыполнение плана (из исторического модуля neva.js)
                </div>
              </div>

              {pointsData.map(pt => (
                <div key={pt.id} style={{ background: T.cardBg, borderRadius: '12px', border: `1px solid ${T.cardBorder}`, padding: '16px', boxShadow: T.cardShadow }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: `1px solid ${T.cardBorder}`, paddingBottom: '10px' }}>
                    <div style={{ fontWeight: 800, fontSize: '16px', color: T.cyan, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={18} />
                      <span>{pt.name}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: T.textMuted }}>
                      Целевой план точки: <strong>{pt.dailyTarget.toLocaleString('ru-RU')} ₽</strong>
                    </div>
                  </div>

                  {pt.statics.map(st => (
                    <div key={st.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ background: T.cardInner, border: `1px solid ${T.cardBorder}`, padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: T.purple, fontSize: '14px' }}>
                            Главный промоутер (Статик): {st.name}
                          </div>
                          <div style={{ fontSize: '11px', color: T.textMuted }}>Телефон: {st.phone}</div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div>
                            <span style={{ fontSize: '11px', color: T.textMuted, display: 'block' }}>Базовый % статика:</span>
                            <input 
                              type="number" 
                              value={st.staticPrecent} 
                              onChange={(e) => handleUpdateStaticPrecents(st.id, e.target.value, st.staticPrecent2)}
                              style={{ width: '60px', background: T.inputBg, border: '1px solid #7c3aed', color: T.inputText, padding: '4px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '14px', outline: 'none' }}
                            /> %
                          </div>
                          <div>
                            <span style={{ fontSize: '11px', color: T.textMuted, display: 'block' }}>Бонусный % (+при плане):</span>
                            <input 
                              type="number" 
                              value={st.staticPrecent2} 
                              onChange={(e) => handleUpdateStaticPrecents(st.id, st.staticPrecent, e.target.value)}
                              style={{ width: '60px', background: T.inputBg, border: '1px solid #7c3aed', color: T.inputText, padding: '4px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '14px', outline: 'none' }}
                            /> %
                          </div>
                        </div>
                      </div>

                      <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {st.promoters.map(pr => (
                          <div key={pr.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: T.cardSubtle, border: `1px solid ${T.cardBorder}`, padding: '8px 12px', borderRadius: '8px' }}>
                            <div>
                              <span style={{ fontWeight: 600, color: T.textHeading, fontSize: '13px' }}>{pr.name}</span>
                              <span style={{ fontSize: '11px', color: T.textMuted, marginLeft: '8px' }}>({pr.spot})</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '12px', color: T.textMuted }}>Ставка промоутера:</span>
                              <input 
                                type="number" 
                                value={pr.promoterPrecent} 
                                onChange={(e) => handleUpdatePromoterPrecent(pr.id, e.target.value)}
                                style={{ width: '60px', background: T.inputBg, border: '1px solid #38bdf8', color: T.cyan, padding: '4px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '14px', outline: 'none' }}
                              /> %
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
