import React, { useState } from 'react';
import { 
  Ship, Eye, CheckCircle2, Layers, Compass, 
  MapPin, Users, Info, X, ExternalLink, Ticket, ArrowRight, Sparkles
} from 'lucide-react';
import RockHitNevaVesselScheme from './RockHitNevaVesselScheme';

export const ASTRA_SCHEMES_MAP = {
  bp_rock_hit_neva: {
    svg: '/ships_schemes/rock_hit_neva_scheme.svg',
    name: '«Рок Хит Нева»'
  },
  bp_m177: {
    svg: '/ships_schemes/moskva_177_scheme.svg',
    name: '«Москва-177»'
  },
  bp_m125_classic: {
    svg: '/ships_schemes/moskva_125_classic_scheme.svg',
    name: '«Москва-125 (Классическая)»'
  },
  bp_m201: {
    svg: '/ships_schemes/moskva_201_scheme.svg',
    name: '«Москва-201»'
  },
  bp_solaris: {
    svg: '/ships_schemes/solaris_scheme.svg',
    name: '«Солярис»'
  }
};

export default function FleetSchemesCatalog({ onSelectShipForBooking }) {
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewShip, setPreviewShip] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);

  // All ships in fleet with accurate vector schemes
  const ships = [
    {
      id: 'bp_rock_hit_neva',
      name: 'Теплоход «Рок Хит Нева»',
      model: 'Флагманский музыкальный лайнер',
      capacity: 115,
      pier: 'Причал Набережная Макарова, 34',
      type: 'Двухпалубный (Нижний ресторанный салон + Верхняя панорамная палуба)',
      badge: 'Астра-Марин Вектор',
      badgeColor: '#1d4ed8',
      badgeBg: '#eff6ff',
      isVectorAstra: true,
      description: 'Двухпалубный рок-лайнер: нижний ресторанный салон (1–70), бар, сцена и верхняя панорамная палуба (71–115). Общая вместимость 115 посадочных мест.'
    },
    {
      id: 'bp_m177',
      name: 'Концертный флагман «Москва-177»',
      model: 'Тип Москва (Концертный флагман)',
      capacity: 96,
      pier: 'Дворцовая набережная, 18',
      type: 'Двухпалубный лайнер',
      badge: 'Астра-Марин Вектор',
      badgeColor: '#1d4ed8',
      badgeBg: '#eff6ff',
      isVectorAstra: true,
      description: 'Президентский мостик, кают-компания Президентов, Невский бар, рок-сцена с барабанами и танцпол. 96 посадочных мест.'
    },
    {
      id: 'bp_m125_classic',
      name: 'Теплоход «Москва-125» (Живой звук)',
      model: 'Тип Москва (Классический салон)',
      capacity: 100,
      pier: 'Причал Спуск со львами',
      type: 'Двухпалубный салон',
      badge: 'Астра-Марин Вектор',
      badgeColor: '#1d4ed8',
      badgeBg: '#eff6ff',
      isVectorAstra: true,
      description: 'Носовая VIP-зона, сцена, теплый закрытый верхний салон, DJ-пульт и мангал. 100 посадочных мест.'
    },
    {
      id: 'bp_m201',
      name: 'Теплоход «Москва-201» (VIP диваны & мангал)',
      model: 'Тип Москва (Панорамный лайнер)',
      capacity: 108,
      pier: 'Причал Медный всадник',
      type: 'Двухпалубный лайнер с лаунжем',
      badge: 'Астра-Марин Вектор',
      badgeColor: '#1d4ed8',
      badgeBg: '#eff6ff',
      isVectorAstra: true,
      description: '6 носовых VIP-диванов, концертная рок-сцена, бар, мангал на углях и верхний панорамный зал. 108 посадочных мест.'
    },
    {
      id: 'bp_solaris',
      name: 'Премиум-лайнер «Солярис»',
      model: 'Премиум-класс',
      capacity: 87,
      pier: 'Английская набережная, 28',
      type: 'Круизный премиум-теплоход',
      badge: 'Астра-Марин Вектор',
      badgeColor: '#1d4ed8',
      badgeBg: '#eff6ff',
      isVectorAstra: true,
      description: 'Капитанский VIP-партер у сцены, акустический рояль, винтовая лестница и видовая верхняя терраса. 87 посадочных мест.'
    }
  ];

  const handleOpenPreview = (ship) => {
    setPreviewShip(ship);
    setSelectedSeat(null);
    setPreviewModalOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewModalOpen(false);
    setPreviewShip(null);
    setSelectedSeat(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0369a1 100%)', 
          color: '#ffffff', 
          borderRadius: '16px', 
          padding: '24px 28px',
          boxShadow: '0 10px 25px -5px rgba(3, 105, 161, 0.3)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Ship size={26} color="#93c5fd" />
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>
                Флот и Схемы судов компании
              </h2>
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: '#e0f2fe', maxWidth: '750px', lineHeight: '1.5' }}>
              Каталог флота с аутентичными векторными схемами рассадки в фирменном стиле <strong>Астра-Марин</strong>.
              Для каждого судна доступна интерактивная векторная схема с кликабельными местами и разделением по палубам и зонам.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {ships.map((s) => (
              <button
                key={s.id}
                onClick={() => handleOpenPreview(s)}
                style={{
                  background: '#ffffff',
                  color: '#1e3a8a',
                  border: 'none',
                  padding: '9px 15px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
              >
                <Eye size={14} color="#1d4ed8" /> {s.name.replace('Теплоход ', '').replace('Премиум-лайнер ', '').replace('Концертный флагман ', '')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Ships */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {ships.map((ship) => (
          <div
            key={ship.id}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: ship.id === 'bp_rock_hit_neva' ? '2px solid #3b82f6' : '1px solid #e2e8f0',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span
                  style={{
                    background: ship.badgeBg,
                    color: ship.badgeColor,
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Sparkles size={12} /> {ship.badge}
                </span>

                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#0f172a',
                    background: '#f8fafc',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <Users size={14} color="#64748b" /> {ship.capacity} мест
                </span>
              </div>

              <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                {ship.name}
              </h3>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '12px' }}>
                {ship.model}
              </div>

              <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                {ship.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="#0284c7" />
                  <span><strong>Базовый причал:</strong> {ship.pier}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={14} color="#0284c7" />
                  <span><strong>Конфигурация:</strong> {ship.type}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
              <button
                onClick={() => handleOpenPreview(ship)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: ship.id === 'bp_rock_hit_neva' ? '#1d4ed8' : '#eff6ff',
                  color: ship.id === 'bp_rock_hit_neva' ? '#ffffff' : '#1d4ed8',
                  border: '1px solid ' + (ship.id === 'bp_rock_hit_neva' ? '#1d4ed8' : '#bfdbfe'),
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'background 0.15s'
                }}
              >
                <Eye size={15} /> Предпросмотр схемы
              </button>
              
              <button
                onClick={() => {
                  window.location.hash = '#booking';
                }}
                title="Перейти к покупке билетов"
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Ticket size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Live Customer View Scheme Preview for Clients / Stakeholders */}
      {previewModalOpen && previewShip && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={handleClosePreview}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              maxWidth: '920px',
              width: '100%',
              maxHeight: '94vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#f8fafc'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Ship size={20} color="#1d4ed8" />
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                    {previewShip.name}
                  </h3>
                  <span style={{ fontSize: '11px', background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                    Векторная схема Астра-Марин
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Аутентичная векторная схема рассадки судна • Вместимость: {previewShip.capacity} мест
                </div>
              </div>

              <button
                onClick={handleClosePreview}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#475569'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Ship Quick-Switch Tabs inside Modal */}
            <div 
              style={{ 
                display: 'flex', 
                gap: '8px', 
                padding: '10px 20px', 
                background: '#f1f5f9', 
                borderBottom: '1px solid #e2e8f0', 
                overflowX: 'auto',
                alignItems: 'center'
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', whiteSpace: 'nowrap', marginRight: '4px' }}>
                Флот:
              </span>
              {ships.map((s) => {
                const isActive = previewShip.id === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setPreviewShip(s);
                      setSelectedSeat(null);
                    }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      border: isActive ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      background: isActive ? '#eff6ff' : '#ffffff',
                      color: isActive ? '#1d4ed8' : '#334155',
                      fontWeight: isActive ? '700' : '600',
                      fontSize: '12px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <span>{s.name.replace('Теплоход ', '').replace('Премиум-лайнер ', '').replace('Концертный флагман ', '')}</span>
                    <span style={{ fontSize: '10px', opacity: 0.75 }}>({s.capacity})</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body: Vessel Scheme */}
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#93c5fd', border: '1px solid #60a5fa' }}></span>
                  <span>Свободное место</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981', border: '1px solid #059669' }}></span>
                  <span>Выбранное место</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#f1f5f9', border: '1px solid #cbd5e1' }}></span>
                  <span>Столики / Интерьер</span>
                </div>
              </div>

              <div style={{ width: '100%', maxWidth: '460px', background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <RockHitNevaVesselScheme
                  key={previewShip.id}
                  schemeSvgUrl={ASTRA_SCHEMES_MAP[previewShip.id]?.svg || '/ships_schemes/rock_hit_neva_scheme.svg'}
                  selectedSeat={selectedSeat}
                  onSeatClick={(seatNum) => {
                    setSelectedSeat(selectedSeat === seatNum ? null : seatNum);
                  }}
                />
              </div>

              {selectedSeat && (
                <div 
                  style={{ 
                    marginTop: '16px', 
                    padding: '12px 20px', 
                    background: '#ecfdf5', 
                    border: '1px solid #a7f3d0', 
                    borderRadius: '12px',
                    color: '#065f46',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <CheckCircle2 size={16} color="#059669" />
                  <span>
                    Выбрано место <strong>№{typeof selectedSeat === 'object' ? selectedSeat.number || selectedSeat.id : selectedSeat}</strong>. Интерактивная схема работает штатно!
                  </span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '14px 24px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#f8fafc'
              }}
            >
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                📍 {previewShip.pier} • Вместимость: {previewShip.capacity} чел.
              </div>
              <button
                onClick={() => {
                  handleClosePreview();
                  window.location.hash = '#booking';
                }}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '13px' }}
              >
                <span>Перейти к покупке билетов</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
