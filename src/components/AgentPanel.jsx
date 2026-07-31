import React, { useState, useEffect } from 'react';
import { Percent, Link as LinkIcon, DollarSign, Copy, User } from 'lucide-react';
import { getAgents, getBookings } from '../db';

export default function AgentPanel() {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    async function loadData() {
      const fetchedAgents = await getAgents();
      const fetchedBookings = await getBookings();
      setAgents(fetchedAgents);
      setBookings(fetchedBookings);
      if (fetchedAgents.length > 0) {
        setSelectedAgent(fetchedAgents[0]);
      }
    }
    loadData();
  }, []);

  const getAgentBookings = () => {
    if (!selectedAgent) return [];
    return bookings.filter(b => b.agent_id === selectedAgent.id);
  };

  const getAgentRevenue = () => {
    const agentBookings = getAgentBookings();
    return agentBookings.reduce((sum, b) => sum + Number(b.price_paid), 0);
  };

  const getAgentCommission = () => {
    if (!selectedAgent) return 0;
    const revenue = getAgentRevenue();
    return revenue * selectedAgent.commission_rate;
  };

  const getReferralLink = () => {
    if (!selectedAgent) return '';
    const origin = window.location.origin;
    return `${origin}/?promo=${selectedAgent.promo_code}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getReferralLink());
    setCopySuccess('Ссылка скопирована!');
    setTimeout(() => setCopySuccess(''), 3000);
  };

  return (
    <div>
      <div className="glass" style={{ padding: '24px', marginBottom: '32px' }}>
        <h1 className="hero-title" style={{ fontSize: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Percent size={32} color="var(--color-accent)" /> Кабинет Партнера / Агента
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Выберите партнера, чтобы сгенерировать его реферальные ссылки, следить за продажами билетов и смотреть начисленную комиссию.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', alignItems: 'start' }}>
        {/* Left Column: Select Agent & Referral */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass" style={{ padding: '24px' }}>
            <div className="form-group">
              <label className="form-label">Текущий партнер (Агент)</label>
              <select 
                className="form-input"
                value={selectedAgent?.id || ''}
                onChange={(e) => {
                  const agent = agents.find(a => a.id === e.target.value);
                  setSelectedAgent(agent);
                }}
              >
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} ({agent.promo_code})
                  </option>
                ))}
              </select>
            </div>

            {selectedAgent && (
              <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Размер комиссии:</span>
                  <strong>{selectedAgent.commission_rate * 100}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Промокод:</span>
                  <strong>{selectedAgent.promo_code}</strong>
                </div>
              </div>
            )}
          </div>

          {selectedAgent && (
            <div className="glass" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-title)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LinkIcon size={18} /> Ваша партнерская ссылка
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
                Покупатели, перешедшие по этой ссылке, автоматически привязываются к вашему аккаунту и получают 10% скидку.
              </p>
              
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  value={getReferralLink()} 
                  readOnly 
                  style={{ flex: 1, fontSize: '12px' }}
                />
                <button className="btn btn-secondary" onClick={handleCopyLink}>
                  <Copy size={16} />
                </button>
              </div>
              {copySuccess && <span style={{ color: 'var(--color-success)', fontSize: '12px' }}>{copySuccess}</span>}
            </div>
          )}
        </div>

        {/* Right Column: Earnings & Booking History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Earnings Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="glass" style={{ padding: '20px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Объем продаж</span>
              <div style={{ fontSize: '28px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                {getAgentRevenue()} ₽
              </div>
            </div>
            <div className="glass" style={{ padding: '20px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Заработано комиссионных</span>
              <div style={{ fontSize: '28px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: 'var(--color-success)' }}>
                {getAgentCommission()} ₽
              </div>
            </div>
          </div>

          {/* Bookings table */}
          <div className="glass" style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', marginBottom: '16px' }}>Ваши продажи</h3>
            {getAgentBookings().length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                Продаж по вашей реферальной ссылке или промокоду пока не зафиксировано.
              </p>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Покупатель</th>
                      <th>Место</th>
                      <th>Сумма продажи</th>
                      <th>Комиссия ({selectedAgent.commission_rate * 100}%)</th>
                      <th>Дата</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getAgentBookings().map(booking => (
                      <tr key={booking.id}>
                        <td>{booking.customer_name}</td>
                        <td>{booking.seat_number}</td>
                        <td>{booking.price_paid} ₽</td>
                        <td>{Number(booking.price_paid) * selectedAgent.commission_rate} ₽</td>
                        <td>{new Date(booking.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
