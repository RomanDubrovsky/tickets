import React, { useState, useEffect } from 'react';
import { Anchor, Calendar, Shield, Percent, Ticket, QrCode, Layout, Globe, HelpCircle, Music, Sparkles, Smartphone, BookOpen, Target } from 'lucide-react';
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
import PromoApp from './components/PromoApp';
import HelpModal from './components/HelpModal';
import ClientDocsPortal from './components/ClientDocsPortal';
import VkMarketingAgent from './components/VkMarketingAgent';

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
      } else if (hash === '#occupancy') {
        setCurrentView('occupancy');
      } else if (hash === '#builder') {
        setCurrentView('builder');
      } else if (hash === '#sites') {
        setCurrentView('sites');
      } else if (hash === '#programs' || hash === '#events') {
        setCurrentView('programs');
      } else if (hash === '#sessions') {
        setCurrentView('sessions');
      } else if (hash === '#musicians') {
        setCurrentView('musicians');
      } else if (hash === '#piers') {
        setCurrentView('piers');
      } else if (hash === '#venues' || hash === '#fleet') {
        setCurrentView('venues');
      } else if (hash === '#afisha') {
        setCurrentView('afisha');
      } else if (hash === '#booking') {
        setCurrentView('booking');
      } else if (hash === '#agent' || hash === '#hotels') {
        setCurrentView('agent');
      } else if (hash === '#promo') {
        setCurrentView('promo');
      } else if (hash === '#seller') {
        setCurrentView('seller');
      } else if (hash === '#admin') {
        setCurrentView('admin');
      } else if (hash === '#marketing' || hash === '#target' || hash === '#vk') {
        setCurrentView('marketing');
      } else if (hash === '#geo' || hash === '#geoscout') {
        setCurrentView('geo');
      } else if (hash === '#docs' || hash === '#help' || hash === '#client-docs') {
        setCurrentView('docs');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view, hash = '') => {
    setCurrentView(view);
    if (hash && window.location.hash !== hash) {
      window.location.hash = hash;
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
        return <ProgramsManager defaultSection="events" onSelectEvent={handleSelectEvent} navigateTo={navigateTo} />;
      case 'sessions':
        return <ProgramsManager defaultSection="sessions" onSelectEvent={handleSelectEvent} navigateTo={navigateTo} />;
      case 'venues':
        return <ProgramsManager defaultSection="venues" onSelectEvent={handleSelectEvent} navigateTo={navigateTo} />;
      case 'musicians':
        return <ProgramsManager defaultSection="musicians" onSelectEvent={handleSelectEvent} navigateTo={navigateTo} />;
      case 'piers':
        return <ProgramsManager defaultSection="piers" onSelectEvent={handleSelectEvent} navigateTo={navigateTo} />;
      case 'sites':
        return <ProgramsManager defaultSection="sites" onSelectEvent={handleSelectEvent} navigateTo={navigateTo} />;
      case 'occupancy':
        return <ProgramsManager defaultSection="occupancy" onSelectEvent={handleSelectEvent} navigateTo={navigateTo} />;
      case 'builder':
        return <DeckBuilder />;
      case 'widget':
        return <SeatWidget />;
      case 'scanner':
        return <ScannerApp />;
      case 'afisha':
        return <ProgramsManager defaultSection="afisha" onSelectEvent={handleSelectEvent} navigateTo={navigateTo} />;
      case 'booking':
        return <BookingDetails event={selectedEvent} onBack={handleBackToAfisha} />;
      case 'admin':
        return <AdminPanel />;
      case 'marketing':
      case 'geo':
        return <ProgramsManager defaultSection="marketing" onSelectEvent={handleSelectEvent} navigateTo={navigateTo} />;
      case 'agent':
        return <AgentPanel />;
      case 'promo':
        return <PromoApp />;
      case 'seller':
        return <SellerPanel onBack={handleBackToAfisha} />;
      case 'docs':
        return <ClientDocsPortal onNavigateToSection={(target) => navigateTo(target, `#${target}`)} />;
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
              {/* 1. Менеджер (Репертуар, Расписание, Флот, Афиша, Сайты, Монитор мест, Маркетинг & AI) */}
              <button
                className={`nav-link ${currentView === 'programs' || currentView === 'sessions' || currentView === 'venues' || currentView === 'musicians' || currentView === 'afisha' || currentView === 'sites' || currentView === 'occupancy' || currentView === 'marketing' || currentView === 'geo' ? 'active' : ''}`}
                onClick={() => navigateTo('programs', '#programs')}
                title="Рабочее место менеджера (Репертуар, расписание, судна, афиша, сайты, маркетинг & AI)"
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

              {/* 4. Промоутеры PWA (Полевые продажи на набережных) */}
              <button
                className={`nav-link ${currentView === 'promo' ? 'active' : ''}`}
                onClick={() => navigateTo('promo', '#promo')}
                title="Мобильный терминал промоутера (PWA для набережных и причалов)"
              >
                <Smartphone size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Промоутеры PWA
              </button>

              {/* 5. Администратор */}
              <button
                className={`nav-link ${currentView === 'admin' ? 'active' : ''}`}
                onClick={() => navigateTo('admin', '#admin')}
                title="Панель администратора"
              >
                <Shield size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Администратор
              </button>

              {/* 6. База знаний / Документация для заказчика (с ИИ) */}
              <button
                className={`nav-link ${currentView === 'docs' ? 'active' : ''}`}
                onClick={() => navigateTo('docs', '#docs')}
                title="Интерактивная база знаний для заказчика с ИИ-поиском и надиктовыванием ТЗ"
                style={{
                  background: currentView === 'docs' 
                    ? 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' 
                    : '#ffffff',
                  border: currentView === 'docs' 
                    ? '2px solid #7c3aed' 
                    : '2px solid #8b5cf6',
                  color: currentView === 'docs' ? '#ffffff' : '#6d28d9',
                  borderRadius: '24px',
                  padding: '7px 16px',
                  fontWeight: '800',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  cursor: 'pointer',
                  marginLeft: '8px',
                  boxShadow: currentView === 'docs' 
                    ? '0 4px 14px rgba(124, 58, 237, 0.4)' 
                    : '0 2px 8px rgba(139, 92, 246, 0.15)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Sparkles size={16} color={currentView === 'docs' ? '#fde047' : '#7c3aed'} />
                <span style={{ letterSpacing: '0.2px' }}>База знаний (ИИ)</span>
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
        <footer className="glass" style={{ margin: '40px 16px 24px', padding: '28px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '18px', marginBottom: '14px', fontSize: '13px', fontWeight: '500' }}>
            <a href="/pr/offer.html" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#38bdf8'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>
              📄 Договор оферты
            </a>
            <span style={{ color: '#475569' }}>•</span>
            <a href="/pr/privacy.html" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#38bdf8'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>
              🔒 Политика конфиденциальности (152-ФЗ)
            </a>
            <span style={{ color: '#475569' }}>•</span>
            <a href="/pr/offer.html#refund" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#38bdf8'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>
              🔄 Правила возврата билетов
            </a>
            <span style={{ color: '#475569' }}>•</span>
            <a href="#venues" onClick={(e) => { e.preventDefault(); navigateTo('venues', '#venues'); }} style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#38bdf8'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>
              ⚓ Причалы и флот
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#64748b', marginRight: '6px' }}>Безопасные онлайн-платежи через <strong>ПАО Сбербанк</strong>:</span>
            <span style={{ background: '#0079c2', color: '#ffffff', padding: '2px 7px', borderRadius: '4px', fontSize: '11px', fontWeight: '800' }}>МИР</span>
            <span style={{ background: '#1a1f71', color: '#ffffff', padding: '2px 7px', borderRadius: '4px', fontSize: '11px', fontWeight: '800' }}>VISA</span>
            <span style={{ background: '#eb001b', color: '#ffffff', padding: '2px 7px', borderRadius: '4px', fontSize: '11px', fontWeight: '800' }}>Mastercard</span>
            <span style={{ background: '#0f172a', color: '#38bdf8', padding: '2px 7px', borderRadius: '4px', fontSize: '11px', fontWeight: '800' }}>СБП</span>
            <span style={{ background: '#22c55e', color: '#ffffff', padding: '2px 7px', borderRadius: '4px', fontSize: '11px', fontWeight: '800' }}>SberPay</span>
          </div>

          <p style={{ margin: '4px 0', color: '#64748b' }}>
            © 2026 Единая платформа теплоходных концертных прогулок Санкт-Петербурга.
          </p>
          <p style={{ marginTop: '4px', fontSize: '11px', color: '#475569' }}>
            ООО «МОРСКИЕ КОРАБЛИ» (ИНН 7814848882) • ИП Юницына В.Н. (ИНН 470411807452) • ИП Куренной В.Ю. (ИНН 780230933072) • Защищённая инфраструктура Yandex Cloud
          </p>
        </footer>
      )}
    </div>
  );
}
