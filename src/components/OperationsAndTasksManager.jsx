import React, { useState, useMemo } from 'react';
import { 
  Users, Mic, Phone, ExternalLink, CheckSquare, Square, 
  Search, Filter, Plus, ShieldCheck, Megaphone, AlertCircle, Compass, Anchor 
} from 'lucide-react';
import { REAL_MUSICIANS, REAL_GUIDES, REAL_CAPTAINS, REAL_CAMPAIGNS, REAL_TASKS } from '../db';

export default function OperationsAndTasksManager() {
  const [activeSubTab, setActiveSubTab] = useState('musicians'); // 'musicians' | 'staff' | 'marketing' | 'tasks'
  const [searchQuery, setSearchQuery] = useState('');

  // Local storage states
  const [musicians, setMusicians] = useState(() => {
    const s = localStorage.getItem('pm_real_musicians_v1');
    return s ? JSON.parse(s) : REAL_MUSICIANS;
  });

  const [guides, setGuides] = useState(() => {
    const s = localStorage.getItem('pm_real_guides_v1');
    return s ? JSON.parse(s) : REAL_GUIDES;
  });

  const [captains, setCaptains] = useState(() => {
    const s = localStorage.getItem('pm_real_captains_v1');
    return s ? JSON.parse(s) : REAL_CAPTAINS;
  });

  const [campaigns, setCampaigns] = useState(() => {
    const s = localStorage.getItem('pm_real_campaigns_v1');
    return s ? JSON.parse(s) : REAL_CAMPAIGNS;
  });

  const [tasks, setTasks] = useState(() => {
    const s = localStorage.getItem('pm_real_tasks_v1');
    return s ? JSON.parse(s) : REAL_TASKS;
  });

  // Filtered musicians
  const filteredMusicians = useMemo(() => {
    if (!searchQuery.trim()) return musicians.slice(0, 100); // paginate first 100
    const q = searchQuery.toLowerCase();
    return musicians.filter(m => 
      m.name?.toLowerCase().includes(q) || 
      m.phone?.toLowerCase().includes(q) || 
      m.details?.toLowerCase().includes(q)
    );
  }, [musicians, searchQuery]);

  const toggleTaskStatus = (id) => {
    const updated = tasks.map(t => {
      if (t.id === id) {
        return { ...t, status: t.status === 'Выполнено' ? 'В работе' : 'Выполнено' };
      }
      return t;
    });
    setTasks(updated);
    localStorage.setItem('pm_real_tasks_v1', JSON.stringify(updated));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* SUBTABS HEADER */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveSubTab('musicians')}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            background: activeSubTab === 'musicians' ? '#2563eb' : '#f1f5f9',
            color: activeSubTab === 'musicians' ? '#ffffff' : '#334155',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px'
          }}
        >
          <Mic size={16} />
          🎸 Артисты и Райдеры ({musicians.length})
        </button>

        <button
          onClick={() => setActiveSubTab('staff')}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            background: activeSubTab === 'staff' ? '#2563eb' : '#f1f5f9',
            color: activeSubTab === 'staff' ? '#ffffff' : '#334155',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px'
          }}
        >
          <Compass size={16} />
          🧭 Гиды и Капитаны ({guides.length + captains.length})
        </button>

        <button
          onClick={() => setActiveSubTab('marketing')}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            background: activeSubTab === 'marketing' ? '#2563eb' : '#f1f5f9',
            color: activeSubTab === 'marketing' ? '#ffffff' : '#334155',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px'
          }}
        >
          <Megaphone size={16} />
          📢 РК 2026 и Бюджеты ({campaigns.length})
        </button>

        <button
          onClick={() => setActiveSubTab('tasks')}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            background: activeSubTab === 'tasks' ? '#2563eb' : '#f1f5f9',
            color: activeSubTab === 'tasks' ? '#ffffff' : '#334155',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px'
          }}
        >
          <CheckSquare size={16} />
          📋 Вопросы и Задачи ({tasks.length})
        </button>
      </div>

      {/* 1. MUSICIANS TAB */}
      {activeSubTab === 'musicians' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass" style={{ padding: '14px 20px', borderRadius: '10px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Поиск по 650+ музыкантам, телефону или группе..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '14px' }}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Показано: {filteredMusicians.length} из {musicians.length}
            </span>
          </div>

          <div className="glass" style={{ padding: '20px', borderRadius: '12px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px 10px' }}>Артист / Коллектив</th>
                  <th style={{ padding: '12px 10px' }}>Роль</th>
                  <th style={{ padding: '12px 10px' }}>Телефон</th>
                  <th style={{ padding: '12px 10px' }}>Технический райдер / Ссылки</th>
                  <th style={{ padding: '12px 10px' }}>Детали и график</th>
                </tr>
              </thead>
              <tbody>
                {filteredMusicians.map((m, idx) => (
                  <tr key={m.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 'bold', color: '#0f172a' }}>
                      {m.name}
                    </td>
                    <td style={{ padding: '12px 10px', color: '#475569' }}>
                      <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', fontSize: '12px' }}>
                        {m.role || 'Музыкант'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', color: '#0369a1' }}>
                      {m.phone ? (
                        <a href={`tel:${m.phone}`} style={{ color: '#0284c7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={13} /> {m.phone}
                        </a>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      {m.rider_url ? (
                        <a 
                          href={m.rider_url.startsWith('http') ? m.rider_url : `https://${m.rider_url}`} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: '#2563eb',
                            background: '#eff6ff',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '12px'
                          }}
                        >
                          <ExternalLink size={12} /> Райдер
                        </a>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '12px' }}>Без райдера</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 10px', color: '#64748b', fontSize: '12px' }}>
                      {m.details || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. STAFF (GUIDES & CAPTAINS) */}
      {activeSubTab === 'staff' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Guides */}
          <div className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
            <h4 style={{ margin: '0 0 16px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={18} color="#0284c7" />
              Экскурсоводы и Гиды ({guides.length})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {guides.map((g, idx) => (
                <div key={g.id || idx} style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{g.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{g.details || 'Экскурсовод'}</div>
                  </div>
                  {g.phone && (
                    <a href={`tel:${g.phone}`} style={{ color: '#0284c7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                      <Phone size={13} /> {g.phone}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Captains */}
          <div className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
            <h4 style={{ margin: '0 0 16px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Anchor size={18} color="#0284c7" />
              Капитаны и Судоводители
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {captains.concat([
                { id: 'c-1', name: 'Глушков С.В.', role: 'Капитан', details: 'Теплоход «М-177» (Рок Хит Нева)' },
                { id: 'c-2', name: 'Елизаров А.П.', role: 'Капитан', details: 'Теплоход «Солярис»' },
                { id: 'c-3', name: 'Юрий Николаевич', role: 'Капитан-наставник', details: 'Теплоход «М-125»' }
              ]).map((c, idx) => (
                <div key={c.id || idx} style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{c.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{c.details}</div>
                  </div>
                  <span style={{ fontSize: '12px', background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                    На вахте
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. MARKETING CAMPAIGNS (РК 2026) */}
      {activeSubTab === 'marketing' && (
        <div className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Megaphone size={18} color="#f59e0b" />
            Рекламные кампании & Бюджеты (РК 2026 из Excel)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
            {campaigns.map((ad, idx) => (
              <div key={ad.id || idx} style={{ padding: '16px', background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '14px' }}>{ad.channel}</div>
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    background: ad.status === 'Активна' ? '#dcfce7' : '#fef3c7',
                    color: ad.status === 'Активна' ? '#16a34a' : '#d97706'
                  }}>
                    {ad.status}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                  <strong>Срок:</strong> {ad.period || 'Сезон 2026'}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  <strong>Бюджет:</strong> {ad.budget || 'По согласованию'}
                </div>
                {ad.details && (
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '8px', background: '#f8fafc', padding: '8px', borderRadius: '6px' }}>
                    {ad.details}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TASKS & QUESTIONS */}
      {activeSubTab === 'tasks' && (
        <div className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckSquare size={18} color="#16a34a" />
            Операционный трекер задач (Вопросы & Список дел)
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tasks.map((t, idx) => {
              const isDone = t.status === 'Выполнено';
              return (
                <div 
                  key={t.id || idx} 
                  onClick={() => toggleTaskStatus(t.id)}
                  style={{ 
                    padding: '14px 18px', 
                    background: isDone ? '#f8fafc' : '#ffffff', 
                    borderRadius: '8px', 
                    border: isDone ? '1px solid #e2e8f0' : '1px solid #cbd5e1', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {isDone ? (
                      <CheckSquare size={18} color="#16a34a" />
                    ) : (
                      <Square size={18} color="#94a3b8" />
                    )}
                    <div>
                      <div style={{ 
                        fontWeight: isDone ? 'normal' : '600', 
                        color: isDone ? '#94a3b8' : '#0f172a',
                        textDecoration: isDone ? 'line-through' : 'none'
                      }}>
                        {t.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        Категория: {t.category}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    background: t.priority === 'Высокий' ? '#fee2e2' : '#f1f5f9',
                    color: t.priority === 'Высокий' ? '#dc2626' : '#64748b'
                  }}>
                    {t.priority} приоритет
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
