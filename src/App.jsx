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
import HelpModal from './components/HelpModal';

export default function App() {
  const [currentView, setCurrentView] = useState('events'); // 'events', 'sessions', 'builder', 'sites', 'afisha', 'booking', 'admin', 'agent', 'seller', 'widget', 'scanner'
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
      } else if (hash === '#events') {
        setCurrentView('events');
      } else if (hash === '#sessions') {
        setCurrentView('sessions');
      } else if (hash === '#afisha') {
        setCurrentView('afisha');
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
      case 'events':
        return <SitesAdmin initialTab="events" />;
      case 'sessions':
        return <SitesAdmin initialTab="sessions" />;
      case 'sites':
        return <SitesAdmin initialTab="pages" />;
      case 'builder':
        return <DeckBuilder />;
      case 'widget':
        return <SeatWidget />;
      case 'scanner':
        return <ScannerApp />;
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
        return <SitesAdmin initialTab="events" />;
    }
  };

  const showChrome = currentView !== 'widget' && currentView !== 'scanner';

  return (
    <div className="app-container">
      {showChrome && (
        <header className="main-content" style={{ paddingBottom: 0 }}>
          <nav className="navbar glass">
            <div className="nav-brand" onClick={() => navigateTo('events', '#events')} style={{ cursor: 'pointer' }}>
              <Anchor size={28} style={{ color: 'var(--color-primary)' }} />
              <span>ПЛАТФОРМА</span>
            </div>
            <div className="nav-links">
              {/* Core Manager Tools */}
              <button
                className={`nav-link ${currentView === 'events' ? 'active' : ''}`}
                onClick={() => navigateTo('events', '#events')}
                title="Репертуар программ, концертов и цены"
              >
                <Music size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Программы
              </button>

              <button
                className={`nav-link ${currentView === 'sessions' ? 'active' : ''}`}
                onClick={() => navigateTo('sessions', '#sessions')}
                title="Расписание рейсов и Массовый генератор"
              >
                <Calendar size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Расписание & Рейсы
              </button>

              <button
                className={`nav-link ${currentView === 'builder' ? 'active' : ''}`}
                onClick={() => navigateTo('builder', '#builder')}
                title="Визуальный конструктор схем рассадки"
              >
                <Layout size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Конструктор схем
              </button>

              <button
                className={`nav-link ${currentView === 'sites' ? 'active' : ''}`}
                onClick={() => navigateTo('sites', '#sites')}
                title="Управление сайтами, страницами и кассовыми шлюзами"
              >
                <Globe size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Сайты & CMS
              </button>

              <button
                className={`nav-link ${currentView === 'seller' ? 'active' : ''}`}
                onClick={() => navigateTo('seller', '')}
                title="Терминал кассира на причале"
              >
                <Ticket size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Касса Причала
              </button>

              <button
                className={`nav-link ${currentView === 'agent' ? 'active' : ''}`}
                onClick={() => navigateTo('agent', '')}
                title="Кабинет агента и реферальные ссылки"
              >
                <Percent size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Партнеры
              </button>

              <button
                className={`nav-link ${currentView === 'admin' ? 'active' : ''}`}
                onClick={() => navigateTo('admin', '')}
                title="Панель администратора"
              >
                <Shield size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Админка
              </button>

              <button
                className={`nav-link ${currentView === 'afisha' || currentView === 'booking' ? 'active' : ''}`}
                onClick={() => navigateTo('afisha', '#afisha')}
                title="Клиентская афиша рейсов"
              >
                <Sparkles size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Афиша
              </button>

              <button
                className={`nav-link ${currentView === 'scanner' ? 'active' : ''}`}
                onClick={() => navigateTo('scanner', '#scanner')}
                title="Сканер QR-кодов билетов"
              >
                <QrCode size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Сканер
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

      {/* Floating Help Button for Widget and Scanner views where header is hidden */}
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
