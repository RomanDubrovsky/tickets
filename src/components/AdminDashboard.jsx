import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryRes, alertsRes] = await Promise.all([
        fetch('http://localhost:3001/api/v1/admin/dashboard/summary').then(r => r.json()).catch(() => ({ success: false })),
        fetch('http://localhost:3001/api/v1/admin/dashboard/alerts').then(r => r.json()).catch(() => ({ success: false }))
      ]);

      if (summaryRes && summaryRes.success) {
        setSummary(summaryRes.data);
      }
      if (alertsRes && alertsRes.success) {
        setAlerts(alertsRes.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Загрузка аналитики...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Сводная аналитика</h2>
      
      {summary && (
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          <div style={{ padding: '20px', backgroundColor: '#f0f4f8', borderRadius: '8px', minWidth: '200px' }}>
            <h3 style={{ margin: '0 0 10px' }}>Выручка</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
              {parseFloat(summary.totalRevenue).toLocaleString('ru-RU')} ₽
            </p>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#f0f4f8', borderRadius: '8px', minWidth: '200px' }}>
            <h3 style={{ margin: '0 0 10px' }}>Продано билетов</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
              {summary.totalTickets}
            </p>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#f0f4f8', borderRadius: '8px', minWidth: '200px' }}>
            <h3 style={{ margin: '0 0 10px' }}>Средний чек</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
              {parseFloat(summary.averageTicketPrice).toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽
            </p>
          </div>
        </div>
      )}

      <h2>Точки внимания (Алерты)</h2>
      {alerts.length === 0 ? (
        <div style={{ padding: '15px', backgroundColor: '#e6ffe6', borderRadius: '8px', color: '#006600' }}>
          Всё в порядке! Новых проблем не обнаружено.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {alerts.map(alert => (
            <div 
              key={alert.id} 
              style={{ 
                padding: '15px', 
                backgroundColor: alert.level === 'critical' ? '#ffe6e6' : '#fff3cd', 
                borderLeft: `5px solid ${alert.level === 'critical' ? '#cc0000' : '#ffc107'}`,
                borderRadius: '4px' 
              }}
            >
              <h4 style={{ margin: '0 0 5px' }}>{alert.title}</h4>
              <p style={{ margin: 0 }}>{alert.message}</p>
              <small style={{ color: '#666', marginTop: '10px', display: 'block' }}>
                {new Date(alert.created_at).toLocaleString('ru-RU')}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
