import React, { useState, useEffect } from 'react';
import { Anchor, Calendar, Shield, Percent, Ticket, QrCode, Layout, Globe, HelpCircle, Music, Sparkles } from 'lucide-react';
import Afisha from './components/Afisha';
import BookingDetails from './components/BookingDetails';
import AdminPanel from './components/AdminPanel';
import AgentPanel from './components/AgentPanel';
import SellerPanel from './components/SellerPanel';
import SeatWidget from './components/SeatWidget';
import ScannerApp from './components/ScannerApp';
import DeckBuilder from './components/DeckBuilder';
import SitesAdmin from './components/SitesAdmin';
import ProgramsManager from './components/ProgramsManager';
import HelpModal from './components/HelpModal';

export default function App() {
  const [currentView, setCurrentView] = useState('programs'); // 'programs', 'sessions', 'venues', 'sites', 'builder', 'afisha', 'booking', 'admin', 'agent', 'seller', 'widget', 'scanner'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Hash-based view sync
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.split('?')[0];
      if (hash === '#widget') {
        setCurrentView('widget');
      } else if (hash === '#scanner') {
        setCurrentView('scanner');
      } else if (hash === '#builder') {
        setCurrentView('builder');
      } else if (hash === '#sites') {
        setCurrentView('sites');
      } else if (hash === '#programs' || hash === '#events') {
        setCurrentView('programs');
      } else if (hash === '#sessions') {
        setCurrentView('sessions');
      } else if (hash === '#venues') {
        setCurrentView('venues');
      } else if (hash === '#afisha') {
        setCurrentView('afisha');
      } else if (hash === '#agent' || hash === '#hotels') {
        setCurrentView('agent');
      } else if (hash === '#seller') {
        setCurrentView('seller');
      } else if (hash === '#admin') {
        setCurrentView('admin');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view, hash = '') => {
    setCurrentView(view);
    if (window.location.hash !== hash) {
      window.history.pushState(null, '', hash || window.location.pathname + window.location.search);
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setCurrentView('booking');
  };

  const handleBackToAfisha = () => {
    setSelectedEvent(null);
    navigateTo('afisha', '#afisha');
  };

  // Render based on view
  const renderMain = () => {
    switch (currentView) {
      case 'programs':
        return <ProgramsManager defaultSection="events" />;
      case 'sessions':
        return <ProgramsManager defaultSection="sessions" />;
      case 'venues':
        return <ProgramsManager defaultSection="venues" />;
      case 'sites':
        return <ProgramsManager defaultSection="sites" />;
      case 'builder':
        return <DeckBuilder />;
      case 'widget':
        return <SeatWidget />;
      case 'scanner':
        return <ScannerApp />;
      case 'afisha':
        return <ProgramsManager defaultSection="afisha" onSelectEvent={handleSelectEvent} navigateTo={navigateTo} />;
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
        return <ProgramsManager defaultSection="events" />;
    }
  };

  const showChrome = currentView !== 'widget' && currentView !== 'scanner';

  return (
    <div className="app-container">
      {showChrome && (
        <header className="main-content" style={{ paddingBottom: 0 }}>
          <nav className="navbar glass">
            <div className="nav-brand" onClick={() => navigateTo('programs', '#programs')} style={{ cursor: 'pointer' }}>
              <Anchor size={28} style={{ color: 'var(--color-primary)' }} />
              <span>ПЛАТФОРМА</span>
            </div>
            <div className="nav-links">
              {/* 1. Менеджер (Репертуар & Расписание & Площадки & Афиша & Сайты) */}
              <button
                className={`nav-link ${currentView === 'programs' || currentView === 'sessions' || currentView === 'venues' || currentView === 'musicians' || currentView === 'afisha' || currentView === 'sites' ? 'active' : ''}`}
                onClick={() => navigateTo('programs', '#programs')}
                title="Рабочее место менеджера (Репертуар, расписание, судна, афиша, сайты)"
              >
                <Music size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Менеджер
              </button>

              {/* 2. Касса причала (Продажа билетов & История & Сканер) */}
              <button
                className={`nav-link ${currentView === 'seller' || currentView === 'scanner' ? 'active' : ''}`}
                onClick={() => navigateTo('seller', '#seller')}
                title="Рабочее место кассира/контролера на причале (Продажа и проверка билетов)"
              >
                <Ticket size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Касса причала
              </button>

              {/* 3. Партнеры & Отели (Стойка ресепшн + Управляющий отеля) */}
              <button
                className={`nav-link ${currentView === 'agent' ? 'active' : ''}`}
                onClick={() => navigateTo('agent', '#agent')}
                title="Рабочее место отеля / партнера (Ресепшн для гостей и кабинет управляющего)"
              >
                <Percent size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Отели & Партнеры
              </button>

              {/* 4. Администратор */}
              <button
                className={`nav-link ${currentView === 'admin' ? 'active' : ''}`}
                onClick={() => navigateTo('admin', '#admin')}
                title="Панель администратора"
              >
                <Shield size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Администратор
              </button>

              {/* Contextual Help Trigger Button */}
              <button
                className="nav-link help-btn"
                onClick={() => setIsHelpOpen(true)}
                title="Справка и инструкция по этой странице"
                style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  color: '#93c5fd',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  marginLeft: '8px'
                }}
              >
                <HelpCircle size={18} color="#60a5fa" />
                <span>Справка</span>
              </button>
            </div>
          </nav>
        </header>
      )}

      {/* Floating Help Button for Widget and Scanner views */}
      {!showChrome && (
        <button
          onClick={() => setIsHelpOpen(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 9000,
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            padding: '10px 18px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
            cursor: 'pointer'
          }}
        >
          <HelpCircle size={20} />
          <span>Инструкция</span>
        </button>
      )}

      <main className="main-content">{renderMain()}</main>

      {/* Contextual Help Modal */}
      <HelpModal 
        currentView={currentView}
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {showChrome && (
        <footer className="glass" style={{ margin: '40px 16px 24px', padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
          <p>© 2026 Единая платформа теплоходных прогулок Санкт-Петербурга. Все права защищены.</p>
          <p style={{ marginTop: '4px', fontSize: '11px' }}>Инфраструктура Yandex Cloud (152-ФЗ) • Доступ без паролей для менеджеров</p>
        </footer>
      )}
    </div>
  );
}
