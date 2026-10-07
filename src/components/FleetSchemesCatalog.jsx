import React, { useState } from 'react';
import { 
  Ship, Eye, CheckCircle2, Layers, Compass, 
  MapPin, Users, Info, ExternalLink, Ticket, ArrowRight, Sparkles
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
  // All ships in fleet with accurate vector schemes
  const ships = [
    {
      id: 'bp_rock_hit_neva',
      name: 'Теплоход «Рок Хит Нева»',
      model: 'Флагманский музыкальный лайнер',
      capacity: 115,
      pier: 'Причал Набережная Макарова, 34',
      type: 'Двухпалубный (Нижний ресторанный салон + Верхняя открытая палуба)',
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
      description: 'Президентский мостик, VIP-ложи 1A–3B, Невский бар, танцпол перед рок-сценой и верхний концертный партер. 96 посадочных мест.'
    },
    {
      id: 'bp_m125_classic',
      name: 'Теплоход «Москва-125» (Живой звук)',
      model: 'Тип Москва (Классическая компоновка)',
      capacity: 100,
      pier: 'Набережная Фонтанки, 34',
      type: 'Двухпалубный теплоход-ресторан',
      badge: 'Астра-Марин Вектор',
      badgeColor: '#1d4ed8',
      badgeBg: '#eff6ff',
      isVectorAstra: true,
      description: 'Классическая европейская банкетная рассадка со столиками на 4 персоны, сценой для живого звука и уютной верхней палубой. 100 посадочных мест.'
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

  // Selected ship for direct display on the first screen (default is Rock Hit Neva)
  const [selectedShipId, setSelectedShipId] = useState('bp_rock_hit_neva');
  const [selectedSeat, setSelectedSeat] = useState(null);

  const currentShip = ships.find((s) => s.id === selectedShipId) || ships[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Header & Ship Switcher Navigation Bar (Single place to select ship) */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)', 
          color: '#ffffff', 
          borderRadius: '16px', 
          padding: '20px 24px',
          boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.25)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Ship size={24} color="#60a5fa" />
            <div>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', letterSpacing: '-0.3px', color: '#ffffff' }}>
                Флот и Схемы судов компании
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#93c5fd' }}>
                Аутентичные векторные схемы рассадки в фирменном стиле <strong>Астра-Марин</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => { window.location.hash = '#booking'; }}
              className="btn btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                fontSize: '13px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)'
              }}
            >
              <Ticket size={15} />
              <span>Купить билет на рейс</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Fleet Switcher Pills (Top Bar) */}
        <div 
          style={{ 
            display: 'flex', 
            gap: '8px', 
            overflowX: 'auto', 
            paddingBottom: '4px',
            scrollbarWidth: 'thin'
          }}
        >
          {ships.map((ship) => {
            const isActive = ship.id === selectedShipId;
            return (
              <button
                key={ship.id}
                onClick={() => {
                  setSelectedShipId(ship.id);
                  setSelectedSeat(null);
                }}
                style={{
                  padding: '9px 16px',
                  borderRadius: '12px',
                  border: isActive ? '2px solid #60a5fa' : '1px solid rgba(255,255,255,0.15)',
                  background: isActive ? '#ffffff' : 'rgba(255,255,255,0.08)',
                  color: isActive ? '#1e3a8a' : '#f8fafc',
                  fontWeight: isActive ? '800' : '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 4px 14px rgba(0,0,0,0.2)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Ship size={15} color={isActive ? '#1d4ed8' : '#93c5fd'} />
                <span>{ship.name.replace('Теплоход ', '').replace('Премиум-лайнер ', '').replace('Концертный флагман ', '')}</span>
                <span 
                  style={{ 
                    fontSize: '11px', 
                    padding: '2px 7px',
                    borderRadius: '10px',
                    background: isActive ? '#eff6ff' : 'rgba(255,255,255,0.12)',
                    color: isActive ? '#1d4ed8' : '#cbd5e1',
                    fontWeight: '700'
                  }}
                >
                  {ship.capacity} мест
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Direct Interactive Scheme Viewer on First Screen (No modal/popup needed) */}
      <div 
        style={{ 
          background: '#ffffff', 
          borderRadius: '16px', 
          border: '1px solid #e2e8f0', 
          boxShadow: '0 4px 16px -2px rgba(0,0,0,0.06)',
          overflow: 'hidden'
        }}
      >
        {/* Info Header of Selected Ship */}
        <div 
          style={{ 
            padding: '16px 24px', 
            borderBottom: '1px solid #f1f5f9', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            background: '#fafafa'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                {currentShip.name}
              </h3>
              <span 
                style={{
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  padding: '3px 9px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '700'
                }}
              >
                {currentShip.badge} • {currentShip.capacity} мест
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              📍 {currentShip.pier} &nbsp;|&nbsp; 🛳️ {currentShip.model} &nbsp;|&nbsp; {currentShip.type}
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', fontSize: '12px', color: '#475569' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#93c5fd', border: '1px solid #60a5fa' }}></span>
              <span>Свободно</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981', border: '1px solid #059669' }}></span>
              <span>Выбрано</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#f1f5f9', border: '1px solid #cbd5e1' }}></span>
              <span>Столики</span>
            </div>
          </div>
        </div>

        {/* Main Scheme Display Canvas */}
        <div 
          style={{ 
            padding: '24px 16px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            background: '#f8fafc',
            minHeight: '650px'
          }}
        >
          <div 
            style={{ 
              width: '100%', 
              maxWidth: '520px', 
              background: '#ffffff', 
              padding: '20px', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <RockHitNevaVesselScheme
              key={currentShip.id}
              schemeSvgUrl={ASTRA_SCHEMES_MAP[currentShip.id]?.svg || '/ships_schemes/rock_hit_neva_scheme.svg'}
              selectedSeat={selectedSeat}
              onSeatClick={(seatNum) => {
                setSelectedSeat(selectedSeat === seatNum ? null : seatNum);
              }}
            />
          </div>

          {/* Seat selection notification */}
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
                Выбрано место <strong>№{typeof selectedSeat === 'object' ? selectedSeat.number || selectedSeat.id : selectedSeat}</strong> на теплоходе {currentShip.name}. Векторная схема Астра-Марин полностью интерактивна!
              </span>
            </div>
          )}

          {/* Description footer */}
          <div 
            style={{ 
              marginTop: '18px', 
              maxWidth: '720px', 
              textAlign: 'center', 
              fontSize: '13px', 
              color: '#64748b', 
              lineHeight: '1.5' 
            }}
          >
            {currentShip.description}
          </div>
        </div>
      </div>
    </div>
  );
}
