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

  const simulateScan = (isValid) => {
    if (isValid) {
      setScannedResult({ valid: true, message: 'Билет действителен. Проход разрешен.' });
    } else {
      setScannedResult({ valid: false, message: 'Ошибка: Билет не найден или уже использован!' });
    }
    
    // Clear result after 3 seconds
    setTimeout(() => setScannedResult(null), 3000);
  };

  return (
    <div className="glass" style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', borderRadius: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={20} color="var(--color-primary)" />
          Контролер
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: isOnline ? 'var(--color-success)' : 'var(--color-error)' }}>
          {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
          {isOnline ? 'Online' : 'Offline'}
        </div>
      </div>

      <div 
        style={{ 
          height: '250px', 
          background: '#111', 
          borderRadius: '8px', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          border: '2px dashed #444',
          marginBottom: '20px',
          position: 'relative'
        }}
      >
        {scannedResult ? (
          <div style={{ textAlign: 'center', padding: '20px', color: scannedResult.valid ? 'var(--color-success)' : 'var(--color-error)' }}>
            {scannedResult.valid ? <CheckCircle size={48} /> : <XCircle size={48} />}
            <h4 style={{ marginTop: '16px' }}>{scannedResult.message}</h4>
          </div>
        ) : (
          <>
            <QrCode size={64} color="#666" style={{ marginBottom: '16px' }} />
            <span style={{ color: '#666' }}>Наведите камеру на QR-код</span>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => simulateScan(true)}
          style={{ flex: 1, padding: '12px', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '4px', cursor: 'pointer' }}
        >
          Успешный скан
        </button>
        <button 
          onClick={() => simulateScan(false)}
          style={{ flex: 1, padding: '12px', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '4px', cursor: 'pointer' }}
        >
          Ошибка скана
        </button>
      </div>
      
      {!isOnline && (
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#999', textAlign: 'center' }}>
          Валидация происходит по локальному кэшу. Синхронизация начнется при появлении сети.
        </div>
      )}
    </div>
  );
}
