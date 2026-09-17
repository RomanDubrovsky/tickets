import React, { useState, useEffect } from 'react';
import { Anchor, Calendar, Shield, Percent, Ticket, QrCode, Layout } from 'lucide-react';
import Afisha from './components/Afisha';
import BookingDetails from './components/BookingDetails';
import AdminPanel from './components/AdminPanel';
import AgentPanel from './components/AgentPanel';
import SellerPanel from './components/SellerPanel';
import SeatWidget from './components/SeatWidget';
import ScannerApp from './components/ScannerApp';
import DeckBuilder from './components/DeckBuilder';

export default function App() {
  const [currentView, setCurrentView] = useState('afisha'); // 'afisha', 'booking', 'admin', 'agent', 'seller', 'widget', 'scanner', 'builder'
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Simple hash‑based routing for widget and scanner modes
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#widget') {
        setCurrentView('widget');
      } else if (window.location.hash === '#scanner') {
        setCurrentView('scanner');
      } else if (window.location.hash === '#builder') {
        setCurrentView('builder');
      } else if (currentView === 'widget' || currentView === 'scanner' || currentView === 'builder') {
        setCurrentView('afisha');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    // initial check
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentView]);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setCurrentView('booking');
  };

  const handleBackToAfisha = () => {
    setSelectedEvent(null);
    setCurrentView('afisha');
  };

  // Render based on view
  const renderMain = () => {
    switch (currentView) {
      case 'widget':
        return <SeatWidget />;
      case 'scanner':
        return <ScannerApp />;
      case 'builder':
        return <DeckBuilder />;
      case 'afisha':
        return <Afisha onSelectEvent={handleSelectEvent} />;
      case 'booking':
        return selectedEvent ? (
          <BookingDetails event={selectedEvent} onBack={handleBackToAfisha} />
        ) : null;
      case 'admin':
        return <AdminPanel />;
      case 'agent':
        return <AgentPanel />;
      case 'seller':
        return <SellerPanel onBack={handleBackToAfisha} />;
      default:
        return null;
    }
  };

  const showChrome = currentView !== 'widget' && currentView !== 'scanner';

  return (
    <div className="app-container">
      {showChrome && (
        <header className="main-content" style={{ paddingBottom: 0 }}>
          <nav className="navbar glass">
            <div className="nav-brand" onClick={handleBackToAfisha}>
              <Anchor size={28} style={{ color: 'var(--color-primary)' }} />
              <span>ПЛАТФОРМА</span>
            </div>
            <div className="nav-links">
              <button
                className={`nav-link ${currentView === 'afisha' || currentView === 'booking' ? 'active' : ''}`}
                onClick={handleBackToAfisha}
              >
                <Calendar size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Афиша рейсов
              </button>
              <button
                className={`nav-link ${currentView === 'builder' ? 'active' : ''}`}
                onClick={() => setCurrentView('builder')}
              >
                <Layout size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Конструктор схем
              </button>
              <button
                className={`nav-link ${currentView === 'seller' ? 'active' : ''}`}
                onClick={() => setCurrentView('seller')}
              >
                <Ticket size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Касса Причала
              </button>
              <button
                className={`nav-link ${currentView === 'agent' ? 'active' : ''}`}
                onClick={() => setCurrentView('agent')}
              >
                <Percent size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Кабинет Партнера
              </button>
              <button
                className={`nav-link ${currentView === 'admin' ? 'active' : ''}`}
                onClick={() => setCurrentView('admin')}
              >
                <Shield size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Админка
              </button>
              <button
                className={`nav-link`}
                onClick={() => window.location.hash = '#scanner'}
              >
                <QrCode size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Сканер (PWA)
              </button>
            </div>
          </nav>
        </header>
      )}


      <main className="main-content">{renderMain()}</main>

      {showChrome && (
        <footer className="glass" style={{ margin: '40px 16px 24px', padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
          <p>© 2026 Платформа теплоходных прогулок. Все права защищены.</p>
          <p style={{ marginTop: '4px', fontSize: '11px' }}>Разработано для демонстрации MVP с поддержкой СУБД Supabase</p>
        </footer>
      )}
    </div>
  );
}
