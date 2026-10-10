import React, { useState, useEffect } from 'react';
import { Shield, QrCode, Wifi, WifiOff, CheckCircle, XCircle } from 'lucide-react';

export default function ScannerApp() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [scannedResult, setScannedResult] = useState(null); // { valid: true/false, message: '' }
  const [cachedSignatures, setCachedSignatures] = useState([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // In a real app, this would fetch from the server when online
    setCachedSignatures(['booking_123', 'booking_456']); // Mock signatures

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [manualCode, setManualCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const validateTicket = async (codeToValidate) => {
    if (!codeToValidate) return;
    setIsValidating(true);
    try {
      const res = await fetch('/api/v1/boarding/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket_code: codeToValidate.trim().toUpperCase() })
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setScannedResult({
          valid: true,
          message: data.message || 'Проход разрешен! Билет погашен.',
          details: data.data
        });
      } else {
        setScannedResult({
          valid: false,
          message: data.message || 'Ошибка: Недействительный билет',
          details: null
        });
      }
    } catch (err) {
      setScannedResult({
        valid: false,
        message: 'Ошибка связи с сервером СКУД: ' + err.message
      });
    } finally {
      setIsValidating(false);
      setTimeout(() => setScannedResult(null), 5000);
    }
  };

  return (
    <div className="glass" style={{ maxWidth: '420px', margin: '20px auto', padding: '24px', borderRadius: '16px', background: '#0f172a', color: '#f8fafc', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 700 }}>
          <Shield size={22} color="#38bdf8" />
          СКУД: Контроль посадки
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: isOnline ? '#4ade80' : '#f87171' }}>
          {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
          {isOnline ? 'Онлайн' : 'Офлайн'}
        </div>
      </div>

      <div 
        style={{ 
          minHeight: '220px', 
          background: '#090d16', 
          borderRadius: '12px', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          border: scannedResult ? (scannedResult.valid ? '2px solid #22c55e' : '2px solid #ef4444') : '2px dashed #334155',
          marginBottom: '20px',
          padding: '20px',
          transition: 'all 0.3s ease'
        }}
      >
        {scannedResult ? (
          <div style={{ textAlign: 'center', color: scannedResult.valid ? '#4ade80' : '#f87171' }}>
            {scannedResult.valid ? <CheckCircle size={56} /> : <XCircle size={56} />}
            <h4 style={{ margin: '14px 0 8px 0', fontSize: '16px' }}>{scannedResult.message}</h4>
            {scannedResult.details && (
              <div style={{ fontSize: '12px', color: '#cbd5e1', textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '10px 14px', borderRadius: '8px', marginTop: '10px' }}>
                <div><strong>Гость:</strong> {scannedResult.details.customer_name}</div>
                <div><strong>Билетов:</strong> {scannedResult.details.passengers_count} чел. ({scannedResult.details.category})</div>
                <div><strong>Теплоход:</strong> {scannedResult.details.ship_name}</div>
              </div>
            )}
          </div>
        ) : (
          <>
            <QrCode size={56} color="#64748b" style={{ marginBottom: '14px' }} />
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>Готов к сканированию билетов</span>
            <span style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>Sputnik8 • Промоутеры • Сайт</span>
          </>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            placeholder="Код билета (напр. SHP-2026-F9A1)" 
            value={manualCode} 
            onChange={(e) => setManualCode(e.target.value)}
            style={{ flex: 1, background: '#1e293b', border: '1px solid #475569', color: '#f8fafc', padding: '10px 14px', borderRadius: '8px', fontSize: '14px' }}
          />
          <button 
            onClick={() => validateTicket(manualCode)}
            disabled={isValidating || !manualCode}
            style={{ padding: '10px 16px', background: '#0284c7', border: 'none', color: '#fff', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
          >
            {isValidating ? '...' : 'Проверить'}
          </button>
        </div>
      </div>
    </div>
  );
}
