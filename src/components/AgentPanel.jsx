import React, { useState, useEffect } from 'react';
import { 
  Building, Users, QrCode, Ticket, Percent, DollarSign, 
  CheckCircle, Calendar, Clock, MapPin, Mail, Phone, 
  CreditCard, Smartphone, Sparkles, Download, ExternalLink, 
  FileText, Printer, Flame, Music, Search, Award, Check, 
  ChevronRight, RefreshCw, X, BedDouble, ShieldCheck
} from 'lucide-react';
import { getEvents, getBookings, createBooking, getShips } from '../db';

const INITIAL_HOTELS = [
  {
    id: 'hotel_astoria',
    name: 'Отель «Астория» (5★)',
    address: 'Большая Морская ул., 39',
    promo_code: 'ASTORIA_HOTEL',
    commission_rate: 0.15, // 15% общая комиссия отеля
    staff_bonus_rate: 0.05, // 5% сотруднику на ресепшн
    hotel_net_rate: 0.10, // 10% отелю
    staff: [
      { id: 'st_1', name: 'Анна Смирнова', role: 'Старший консьерж' },
      { id: 'st_2', name: 'Екатерина Попова', role: 'Администратор ресепшн' },
      { id: 'st_3', name: 'Мария Иванова', role: 'Ночной портье' }
    ]
  },
  {
    id: 'hotel_europe',
    name: 'Гранд Отель Европа (5★)',
    address: 'Михайловская ул., 1/7',
    promo_code: 'EUROPE_HOTEL',
    commission_rate: 0.15,
    staff_bonus_rate: 0.05,
    hotel_net_rate: 0.10,
    staff: [
      { id: 'st_4', name: 'Ольга Кузнецова', role: 'Служба консьержей' },
      { id: 'st_5', name: 'Дмитрий Соколов', role: 'Администратор' }
    ]
  },
  {
    id: 'hotel_radisson',
    name: 'Radisson Royal Hotel (5★)',
    address: 'Невский пр., 49/2',
    promo_code: 'RADISSON_SPB',
    commission_rate: 0.12,
    staff_bonus_rate: 0.04,
    hotel_net_rate: 0.08,
    staff: [
      { id: 'st_6', name: 'Алина Васильева', role: 'Администратор' }
    ]
  }
];

export default function AgentPanel() {
  const [hotels, setHotels] = useState(INITIAL_HOTELS);
  const [selectedHotel, setSelectedHotel] = useState(INITIAL_HOTELS[0]);
  const [selectedStaff, setSelectedStaff] = useState(INITIAL_HOTELS[0].staff[0]);
  const [activeWorkspaceMode, setActiveWorkspaceMode] = useState('reception'); // 'reception' | 'admin'

  // Events & Bookings
  const [events, setEvents] = useState([]);
  const [ships, setShips] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Reception Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState('');

  // Guest booking modal
  const [bookingModalEvent, setBookingModalEvent] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [ticketsCount, setTicketsCount] = useState(2);
  const [ticketCategory, setTicketCategory] = useState('standard'); // 'standard' or 'vip'
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('sbp_qr'); // 'sbp_qr', 'terminal', 'room_charge'
  
  // Success receipt modal
  const [successBooking, setSuccessBooking] = useState(null);

  const loadData = async () => {
    const fetchedEvents = await getEvents();
    const fetchedBookings = await getBookings();
    const fetchedShips = await getShips();
    setEvents(fetchedEvents);
    setBookings(fetchedBookings);
    setShips(fetchedShips);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleHotelChange = (hotelId) => {
    const hotel = hotels.find(h => h.id === hotelId) || hotels[0];
    setSelectedHotel(hotel);
    setSelectedStaff(hotel.staff[0]);
  };

  // Filter hotel bookings
  const hotelBookings = bookings.filter(b => b.hotel_id === selectedHotel.id || b.agent_id === selectedHotel.id);

  // Calculations for Hotel Admin
  const totalRevenue = hotelBookings.reduce((sum, b) => sum + (Number(b.price_paid) || 0), 0);
  const totalTickets = hotelBookings.length;
  const hotelCommission = totalRevenue * selectedHotel.commission_rate;
  const staffBonusPool = totalRevenue * selectedHotel.staff_bonus_rate;
  const hotelNetProfit = totalRevenue * selectedHotel.hotel_net_rate;

  // Open booking modal
  const handleStartBooking = (event, slot = null) => {
    setBookingModalEvent(event);
    const initialSlot = slot || (event.slots && event.slots[0]) || {
      id: 'default',
      date: event.date,
      dayStr: event.date,
      time: event.time?.slice(0, 5) || '19:00',
      price: event.price_standard || 1500
    };
    setSelectedSlot(initialSlot);
    setTicketsCount(2);
    setTicketCategory('standard');
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setRoomNumber('');
    setPaymentMethod('sbp_qr');
  };

  // Submit booking for hotel guest
  const handleConfirmGuestBooking = async (e) => {
    e.preventDefault();
    if (!customerEmail && !customerPhone) {
      alert('Укажите Email или телефон гостя для отправки электронного билета!');
      return;
    }

    const pricePerTicket = ticketCategory === 'vip' 
      ? (bookingModalEvent.price_vip || 2500) 
      : (selectedSlot?.price || bookingModalEvent.price_standard || 1500);
    const totalPrice = pricePerTicket * Number(ticketsCount);

    try {
      const newBooking = await createBooking({
        event_id: bookingModalEvent.id,
        event_name: bookingModalEvent.name || bookingModalEvent.title,
        hotel_id: selectedHotel.id,
        hotel_name: selectedHotel.name,
        agent_id: selectedHotel.id,
        staff_name: selectedStaff?.name || 'Ресепшн',
        customer_name: customerName || `Гость отеля (${selectedHotel.name})`,
        customer_email: customerEmail || 'guest@hotel.spb.ru',
        customer_phone: customerPhone || 'Не указан',
        room_number: roomNumber || '—',
        seat_number: `${ticketCategory === 'vip' ? 'VIP' : 'STD'} x${ticketsCount}`,
        seat_category: ticketCategory,
        slot_date: selectedSlot?.dayStr || selectedSlot?.date || bookingModalEvent.date,
        slot_time: selectedSlot?.time || bookingModalEvent.time?.slice(0, 5) || '19:00',
        departure_location: bookingModalEvent.location || 'Причал Набережная Макарова, 34',
        price_paid: totalPrice,
        tickets_count: Number(ticketsCount),
        payment_method: paymentMethod,
        promo_code: selectedHotel.promo_code,
        status: 'confirmed'
      });

      await loadData();
      setBookingModalEvent(null);
      setSuccessBooking(newBooking);
    } catch (err) {
      alert('Ошибка при оформлении билета: ' + err.message);
    }
  };

  // Filter events for reception showcase
  const filteredEvents = events.filter(ev => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (ev.name || ev.title || '').toLowerCase().includes(q);
      const matchDesc = (ev.description || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'season_hits' && !ev.is_hit && !ev.is_featured) return false;
      if (selectedCategory === 'bridges' && !ev.name?.toLowerCase().includes('мост') && !ev.slug?.includes('bridge')) return false;
    }
    if (selectedDateFilter && ev.date && ev.date !== selectedDateFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="agent-workspace" style={{ maxWidth: '1300px', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* Top Banner: Hotel Selector & Mode Switcher */}
      <div className="glass" style={{ padding: '20px 24px', borderRadius: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Building size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <select 
                className="form-input" 
                value={selectedHotel.id} 
                onChange={(e) => handleHotelChange(e.target.value)}
                style={{ fontWeight: 'bold', fontSize: '18px', padding: '6px 12px', background: 'transparent', border: '1px solid #cbd5e1' }}
              >
                {hotels.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
              <span style={{ fontSize: '12px', background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                Комиссия отеля: {selectedHotel.commission_rate * 100}%
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              📍 {selectedHotel.address} • Промокод партнера: <strong style={{ color: '#0f172a' }}>{selectedHotel.promo_code}</strong>
            </div>
          </div>
        </div>

        {/* Workspace Mode Switcher: Reception vs Hotel Admin */}
        <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
          <button
            onClick={() => setActiveWorkspaceMode('reception')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeWorkspaceMode === 'reception' ? '#ffffff' : 'transparent',
              color: activeWorkspaceMode === 'reception' ? '#1d4ed8' : '#64748b',
              fontWeight: 'bold',
              fontSize: '14px',
              boxShadow: activeWorkspaceMode === 'reception' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <BedDouble size={18} />
            Стойка ресепшн / Консьерж
          </button>
          <button
            onClick={() => setActiveWorkspaceMode('admin')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeWorkspaceMode === 'admin' ? '#ffffff' : 'transparent',
              color: activeWorkspaceMode === 'admin' ? '#1d4ed8' : '#64748b',
              fontWeight: 'bold',
              fontSize: '14px',
              boxShadow: activeWorkspaceMode === 'admin' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <Award size={18} />
            Кабинет управляющего отеля
          </button>
        </div>
      </div>

      {/* ========================================================================================= */}
      {/* 1. RECEPTION & CONCIERGE WORKSPACE                                                       */}
      {/* ========================================================================================= */}
      {activeWorkspaceMode === 'reception' && (
        <div>
          {/* Active Concierge Staff Bar */}
          <div className="glass" style={{ padding: '16px 24px', borderRadius: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', background: 'linear-gradient(to right, #eff6ff, #f8fafc)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Дежурный консьерж / сотрудник ресепшн:</span>
              <select 
                className="form-input"
                value={selectedStaff?.id || ''}
                onChange={(e) => {
                  const st = selectedHotel.staff.find(s => s.id === e.target.value);
                  if (st) setSelectedStaff(st);
                }}
                style={{ fontWeight: 'bold', color: '#1e3a8a', padding: '4px 10px' }}
              >
                {selectedHotel.staff.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                ))}
              </select>
            </div>
            <div style={{ fontSize: '13px', color: '#059669', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={16} /> Ваша личная премия: {selectedHotel.staff_bonus_rate * 100}% с каждого проданного билета
            </div>
          </div>

          {/* Search & Fast Filtering Bar for Guest Selection */}
          <div className="glass" style={{ padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '2 1 240px', position: 'relative' }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Поиск программы: Рок под мостами, Цой, Джаз, Брат..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '38px', width: '100%' }}
              />
            </div>

            <div style={{ flex: '1 1 180px' }}>
              <select 
                className="form-input" 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="all">Все жанры и программы</option>
                <option value="season_hits">🔥 Хиты сезона для гостей</option>
                <option value="bridges">🌉 Круизы под разводными мостами</option>
              </select>
            </div>

            <div style={{ flex: '1 1 160px' }}>
              <input 
                type="date" 
                className="form-input" 
                value={selectedDateFilter}
                onChange={(e) => setSelectedDateFilter(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            {(searchQuery || selectedCategory !== 'all' || selectedDateFilter) && (
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedDateFilter('');
                }}
              >
                Сбросить
              </button>
            )}
          </div>

          {/* Events Showcase for Concierge */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
            {filteredEvents.map(event => {
              const slots = event.slots || [
                { id: 'default', date: event.date, dayStr: event.date, time: event.time?.slice(0, 5) || '19:00', price: event.price_standard || 1500 }
              ];

              return (
                <div key={event.id} className="glass" style={{ borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #e2e8f0', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                  <div>
                    {/* Visual Card Header */}
                    <div style={{
                      height: '140px',
                      backgroundColor: `hsl(${(event.id.length * 47) % 360 || 210}, 45%, 82%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      gap: '6px',
                      color: 'rgba(15, 23, 42, 0.6)'
                    }}>
                      <Music size={36} opacity={0.6} />
                      <span style={{ fontSize: '13px', fontWeight: '600' }}>Музыкальный круиз по Неве</span>
                    </div>

                    <div style={{ padding: '18px 20px' }}>
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                          🔥 Хит для туристов
                        </span>
                        <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '6px' }}>
                          ⏱ {event.duration || '120 мин'}
                        </span>
                      </div>

                      <h3 style={{ margin: '0 0 8px 0', fontSize: '17px', color: '#0f172a', lineHeight: '1.3' }}>
                        {event.name || event.title}
                      </h3>

                      <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.4', marginBottom: '14px', height: '36px', overflow: 'hidden' }}>
                        {event.description || 'Панорамная прогулка по Неве и Финскому заливу под разводными мостами с живой музыкой'}
                      </p>

                      <div style={{ fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                        <MapPin size={14} color="#e55f2e" style={{ flexShrink: 0 }} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {event.location || 'Причал Набережная Макарова, 34'}
                        </span>
                      </div>

                      {/* Nearest Slots buttons */}
                      <div style={{ marginBottom: '14px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155', marginBottom: '6px' }}>Ближайшие рейсы:</div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {slots.slice(0, 3).map(slot => (
                            <button
                              key={slot.id}
                              onClick={() => handleStartBooking(event, slot)}
                              style={{
                                fontSize: '12px',
                                padding: '5px 10px',
                                background: '#eff6ff',
                                border: '1px solid #bfdbfe',
                                color: '#1d4ed8',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '600'
                              }}
                            >
                              🗓️ {slot.dayStr || slot.date} {slot.time} ({slot.price} ₽)
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div style={{ padding: '14px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Билеты от</span>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#059669' }}>
                        {event.price_standard || 1500} ₽
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartBooking(event)}
                      className="btn btn-primary"
                      style={{ padding: '8px 18px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}
                    >
                      <Ticket size={16} /> Оформить гостю
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* 2. HOTEL ADMIN & REVENUE SHARE DASHBOARD                                                 */}
      {/* ========================================================================================= */}
      {activeWorkspaceMode === 'admin' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* KPI Dashboard Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="glass" style={{ padding: '20px', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
              <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Продано билетов гостям</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', marginTop: '4px' }}>
                {totalTickets} шт.
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>через стойку ресепшн и QR-номера</div>
            </div>

            <div className="glass" style={{ padding: '20px', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
              <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Оборот продаж отеля</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669', marginTop: '4px' }}>
                {totalRevenue.toLocaleString()} ₽
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>общий объем покупок билетов</div>
            </div>

            <div className="glass" style={{ padding: '20px', borderRadius: '12px', borderLeft: '4px solid #8b5cf6' }}>
              <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Общая комиссия ({selectedHotel.commission_rate * 100}%)</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#7c3aed', marginTop: '4px' }}>
                {hotelCommission.toLocaleString()} ₽
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>начислено от билетной платформы</div>
            </div>

            <div className="glass" style={{ padding: '20px', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
              <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Премии консьержам ({selectedHotel.staff_bonus_rate * 100}%)</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#d97706', marginTop: '4px' }}>
                {staffBonusPool.toLocaleString()} ₽
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>фонд мотивации ресепшн</div>
            </div>

            <div className="glass" style={{ padding: '20px', borderRadius: '12px', borderLeft: '4px solid #06b6d4' }}>
              <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Чистая прибыль отеля ({selectedHotel.hotel_net_rate * 100}%)</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0891b2', marginTop: '4px' }}>
                {hotelNetProfit.toLocaleString()} ₽
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>доход в бюджет гостиницы</div>
            </div>
          </div>

          {/* Two Columns: Staff Performance & QR Table Tents Generator */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', alignItems: 'start' }}>
            
            {/* Staff Motivation Table */}
            <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={20} color="#3b82f6" /> Мотивация сотрудников ресепшн
                  </h3>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    Расчет премий дежурным администраторам и консьержам за прямые продажи гостям
                  </div>
                </div>
              </div>

              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Сотрудник</th>
                      <th>Должность</th>
                      <th>Продано билетов</th>
                      <th>Выручка</th>
                      <th>Бонус (5%)</th>
                      <th>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedHotel.staff.map(st => {
                      const staffSales = hotelBookings.filter(b => b.staff_name === st.name);
                      const staffRev = staffSales.reduce((sum, b) => sum + (Number(b.price_paid) || 0), 0);
                      const staffBonus = staffRev * selectedHotel.staff_bonus_rate;

                      return (
                        <tr key={st.id}>
                          <td><strong>{st.name}</strong></td>
                          <td><span style={{ fontSize: '12px', color: '#64748b' }}>{st.role}</span></td>
                          <td><span style={{ fontWeight: 'bold', color: '#1d4ed8' }}>{staffSales.length} шт.</span></td>
                          <td>{staffRev.toLocaleString()} ₽</td>
                          <td><strong style={{ color: '#059669', fontSize: '14px' }}>+{staffBonus.toLocaleString()} ₽</strong></td>
                          <td>
                            <button 
                              onClick={() => alert(`Премия ${staffBonus} ₽ для сотрудника ${st.name} подтверждена к выплате в расчетный лист!`)}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '11px', padding: '4px 8px' }}
                            >
                              К выплате
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table Tent & QR Code Materials */}
            <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <QrCode size={20} color="#8b5cf6" /> Тейбл-тенты в номера гостей
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.4', marginBottom: '16px' }}>
                Разместите фирменные QR-стойки в номерах отеля. Постоялец сканирует QR-код телефоном, выбирает рейс, а отель автоматически получает <strong>{selectedHotel.commission_rate * 100}%</strong> комиссии!
              </p>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'inline-block', padding: '12px', background: '#ffffff', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', marginBottom: '10px' }}>
                  <QrCode size={120} color="#1e293b" />
                </div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a' }}>
                  Афиша для гостей {selectedHotel.name}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  Промокод партнера: <code>{selectedHotel.promo_code}</code>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => alert('Макет тейбл-тента для печати формата A5 отправлен на печать!')}
                  className="btn btn-primary" 
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px' }}
                >
                  <Printer size={16} /> Печать тейбл-тента
                </button>
                <button 
                  onClick={() => alert(`Ссылка для гостя: ${window.location.origin}/?promo=${selectedHotel.promo_code}`)}
                  className="btn btn-secondary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}
                >
                  <ExternalLink size={16} /> Ссылка
                </button>
              </div>
            </div>
          </div>

          {/* Full Hotel Guest Orders Log */}
          <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} color="#3b82f6" /> Журнал заказов гостей отеля
            </h3>

            {hotelBookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px', color: '#64748b', background: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                Заказов от гостей этого отеля пока нет. Перейдите во вкладку <strong>«Стойка ресепшн»</strong> для первого оформления!
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Гость / Номер</th>
                      <th>Программа и рейс</th>
                      <th>Билеты</th>
                      <th>Сумма</th>
                      <th>Комиссия отеля</th>
                      <th>Кто оформил</th>
                      <th>Оплата</th>
                      <th>Дата</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotelBookings.map(b => (
                      <tr key={b.id}>
                        <td>
                          <strong>{b.customer_name}</strong>
                          {b.room_number && b.room_number !== '—' && (
                            <div style={{ fontSize: '11px', color: '#2563eb' }}>№ комн: {b.room_number}</div>
                          )}
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{b.customer_email}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: '600' }}>{b.event_name || 'Музыкальный круиз'}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>🗓️ {b.slot_date} в {b.slot_time}</div>
                        </td>
                        <td>
                          <span style={{ fontSize: '12px', background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                            {b.seat_number || '2 билета'}
                          </span>
                        </td>
                        <td><strong>{b.price_paid} ₽</strong></td>
                        <td>
                          <strong style={{ color: '#059669' }}>
                            +{(Number(b.price_paid) * selectedHotel.commission_rate).toLocaleString()} ₽
                          </strong>
                        </td>
                        <td>
                          <span style={{ fontSize: '12px', color: '#334155' }}>{b.staff_name || 'Ресепшн'}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                            {b.payment_method === 'sbp_qr' ? 'СБП (QR)' : b.payment_method === 'room_charge' ? 'На счет номера' : 'Терминал'}
                          </span>
                        </td>
                        <td><span style={{ fontSize: '12px', color: '#64748b' }}>{new Date(b.created_at).toLocaleTimeString().slice(0, 5)}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* MODAL 1: CONCIERGE GUEST BOOKING FORM                                                    */}
      {/* ========================================================================================= */}
      {bookingModalEvent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '18px 24px', background: 'linear-gradient(135deg, #1e40af, #2563eb)', color: 'white', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '17px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Ticket size={18} /> Оформление билетов для гостя отеля
                </h4>
                <div style={{ fontSize: '12px', color: '#bfdbfe', marginTop: '2px' }}>
                  {selectedHotel.name} • Консьерж: {selectedStaff?.name}
                </div>
              </div>
              <button onClick={() => setBookingModalEvent(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', padding: '6px', color: 'white', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleConfirmGuestBooking} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Selected Program & Slot Info */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '15px' }}>
                  {bookingModalEvent.name || bookingModalEvent.title}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  📍 {bookingModalEvent.location || 'Причал Набережная Макарова, 34'}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {(bookingModalEvent.slots || [{ id: 's1', dayStr: bookingModalEvent.date, time: bookingModalEvent.time?.slice(0, 5) || '19:00', price: bookingModalEvent.price_standard || 1500 }]).map(slot => (
                    <button
                      type="button"
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        border: selectedSlot?.id === slot.id ? '2px solid #2563eb' : '1px solid #cbd5e1',
                        background: selectedSlot?.id === slot.id ? '#eff6ff' : '#ffffff',
                        color: selectedSlot?.id === slot.id ? '#1d4ed8' : '#334155',
                        cursor: 'pointer'
                      }}
                    >
                      🗓️ {slot.dayStr || slot.date} в {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tickets Count & Category */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: '600' }}>Количество билетов</label>
                  <select 
                    className="form-input" 
                    value={ticketsCount} 
                    onChange={e => setTicketsCount(Number(e.target.value))}
                    style={{ width: '100%', marginTop: '4px', fontWeight: 'bold' }}
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'билет' : n < 5 ? 'билета' : 'билетов'}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: '600' }}>Категория мест</label>
                  <select 
                    className="form-input" 
                    value={ticketCategory} 
                    onChange={e => setTicketCategory(e.target.value)}
                    style={{ width: '100%', marginTop: '4px', fontWeight: 'bold' }}
                  >
                    <option value="standard">Главная палуба ({selectedSlot?.price || bookingModalEvent.price_standard || 1500} ₽)</option>
                    <option value="vip">VIP у панорамных окон ({bookingModalEvent.price_vip || 2500} ₽)</option>
                  </select>
                </div>
              </div>

              {/* Guest Details */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
                <div style={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '10px', fontSize: '14px' }}>Данные постояльца:</div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '10px' }}>
                  <div>
                    <label className="form-label">ФИО гостя (или контактное лицо)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Иван Петров" 
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      style={{ width: '100%', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label className="form-label">№ комнаты</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="304" 
                      value={roomNumber}
                      onChange={e => setRoomNumber(e.target.value)}
                      style={{ width: '100%', marginTop: '4px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label">Email гостя (для электронного билета) *</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="guest@mail.com" 
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      required
                      style={{ width: '100%', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label className="form-label">Телефон для SMS-напоминания</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      placeholder="+7 (999) 000-00-00" 
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      style={{ width: '100%', marginTop: '4px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
                <label className="form-label" style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>
                  Способ оплаты:
                </label>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <div 
                    onClick={() => setPaymentMethod('sbp_qr')}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: paymentMethod === 'sbp_qr' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      background: paymentMethod === 'sbp_qr' ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <Smartphone size={18} color={paymentMethod === 'sbp_qr' ? '#2563eb' : '#64748b'} />
                    <div style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '4px' }}>QR-код СБП</div>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('terminal')}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: paymentMethod === 'terminal' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      background: paymentMethod === 'terminal' ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <CreditCard size={18} color={paymentMethod === 'terminal' ? '#2563eb' : '#64748b'} />
                    <div style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '4px' }}>Терминал отеля</div>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('room_charge')}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: paymentMethod === 'room_charge' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      background: paymentMethod === 'room_charge' ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <Building size={18} color={paymentMethod === 'room_charge' ? '#2563eb' : '#64748b'} />
                    <div style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '4px' }}>В счет номера</div>
                  </div>
                </div>
              </div>

              {/* Total Calculation */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Итого к оплате за {ticketsCount} билета(-ов):</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#059669' }}>
                    {((ticketCategory === 'vip' ? (bookingModalEvent.price_vip || 2500) : (selectedSlot?.price || bookingModalEvent.price_standard || 1500)) * ticketsCount).toLocaleString()} ₽
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '12px', color: '#7c3aed', fontWeight: 'bold' }}>
                  Премия консьержа (+5%): +{(((ticketCategory === 'vip' ? (bookingModalEvent.price_vip || 2500) : (selectedSlot?.price || bookingModalEvent.price_standard || 1500)) * ticketsCount) * selectedHotel.staff_bonus_rate).toLocaleString()} ₽
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setBookingModalEvent(null)} style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer' }}>Отмена</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} /> Оформить и отправить билет гостю
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* MODAL 2: SUCCESS RECEIPT & TICKET                                                        */}
      {/* ========================================================================================= */}
      {successBooking && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '500px', padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', textAlign: 'center' }}>
            
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <CheckCircle size={36} />
            </div>

            <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', color: '#0f172a' }}>
              Билет успешно оформлен!
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              Электронный посадочный талон отправлен на почту <strong>{successBooking.customer_email}</strong>
            </p>

            {/* Boarding Pass Preview Box */}
            <div style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '18px', textAlign: 'left', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Посадочный талон</div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#0f172a' }}>{successBooking.event_name}</div>
                </div>
                <QrCode size={50} color="#1e293b" />
              </div>

              <div style={{ fontSize: '12px', color: '#475569', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                <div>🗓️ <strong>{successBooking.slot_date} в {successBooking.slot_time}</strong></div>
                <div>🎟️ <strong>{successBooking.seat_number}</strong></div>
                <div>👤 <strong>{successBooking.customer_name}</strong></div>
                <div>🏨 <strong>№ {successBooking.room_number || 'Отель'}</strong></div>
              </div>

              <div style={{ marginTop: '10px', fontSize: '11px', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                📍 {successBooking.departure_location}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => window.print()}
                className="btn btn-secondary" 
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Printer size={16} /> Печать чека
              </button>
              <button 
                onClick={() => setSuccessBooking(null)}
                className="btn btn-primary" 
                style={{ flex: 1 }}
              >
                Готово
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
