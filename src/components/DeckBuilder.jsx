import React, { useState } from 'react';
import { Plus, Trash2, Save, Layout, Layers, Check } from 'lucide-react';

export default function DeckBuilder() {
  const [deckWidth, setDeckWidth] = useState(600);
  const [deckHeight, setDeckHeight] = useState(380);
  const [deckName, setDeckName] = useState('Верхняя палуба «Рок Хит Нева»');
  const [tables, setTables] = useState([
    { id: 'T1', x: 80, y: 60, type: 'round', seats: 4, category: 'vip', priceMultiplier: 1.5 },
    { id: 'T2', x: 220, y: 60, type: 'round', seats: 4, category: 'standard', priceMultiplier: 1.0 },
    { id: 'T3', x: 360, y: 60, type: 'rect', seats: 6, category: 'standard', priceMultiplier: 1.0 },
    { id: 'T4', x: 80, y: 220, type: 'round', seats: 4, category: 'vip', priceMultiplier: 1.5 },
    { id: 'T5', x: 220, y: 220, type: 'round', seats: 4, category: 'standard', priceMultiplier: 1.0 },
    { id: 'T6', x: 360, y: 220, type: 'rect', seats: 6, category: 'standard', priceMultiplier: 1.0 }
  ]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const addTable = (type) => {
    const newId = `T${tables.length + 1}`;
    const newTable = {
      id: newId,
      x: 100 + (tables.length * 15) % 300,
      y: 100 + (tables.length * 15) % 150,
      type: type, // 'round' or 'rect'
      seats: type === 'round' ? 4 : 6,
      category: 'standard',
      priceMultiplier: 1.0
    };
    setTables([...tables, newTable]);
    setSelectedItem(newTable);
  };

  const handleDrag = (id, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const svgRect = e.currentTarget.closest('svg').getBoundingClientRect();
    const newX = Math.max(20, Math.min(deckWidth - 60, e.clientX - svgRect.left - 25));
    const newY = Math.max(20, Math.min(deckHeight - 60, e.clientY - svgRect.top - 25));

    setTables(tables.map(t => t.id === id ? { ...t, x: Math.round(newX), y: Math.round(newY) } : t));
  };

  const removeSelected = () => {
    if (!selectedItem) return;
    setTables(tables.filter(t => t.id !== selectedItem.id));
    setSelectedItem(null);
  };

  const handleSave = () => {
    // Generate standard seats_json structure
    const schemaJSON = tables.map(t => ({
      id: t.id,
      x: t.x,
      y: t.y,
      type: t.type,
      category: t.category,
      seatsCount: t.seats,
      priceMultiplier: t.priceMultiplier
    }));

    const halls = JSON.parse(localStorage.getItem('halls') || '[]');
    const newHall = {
      id: crypto.randomUUID(),
      name: deckName,
      type: 'custom_svg',
      seats_json: schemaJSON,
      created_at: new Date().toISOString()
    };
    halls.push(newHall);
    localStorage.setItem('halls', JSON.stringify(halls));

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {/* Visual Canvas */}
      <div className="glass" style={{ flex: '1 1 650px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layout size={20} color="var(--color-primary)" />
              Конструктор палубы корабля / Зала
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Перетаскивайте столики и настраивайте категории мест (VIP / Стандарт)
            </span>
          </div>
          <button 
            onClick={handleSave}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              background: 'var(--color-primary)', 
              color: '#000', 
              fontWeight: 'bold', 
              padding: '8px 16px', 
              border: 'none', 
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {savedSuccess ? <Check size={16} /> : <Save size={16} />}
            {savedSuccess ? 'Сохранено в базу' : 'Сохранить схему'}
          </button>
        </div>

        {/* Interactive Deck SVG */}
        <div style={{ background: '#0a101d', borderRadius: '12px', border: '1px solid #223', padding: '16px', overflowX: 'auto' }}>
          <svg width={deckWidth} height={deckHeight} style={{ border: '2px dashed #334e68', borderRadius: '8px', display: 'block', margin: '0 auto' }}>
            {/* Ship Bow/Stern Outline */}
            <path 
              d={`M 40,20 L ${deckWidth-60},20 Q ${deckWidth-10},${deckHeight/2} ${deckWidth-60},${deckHeight-20} L 40,${deckHeight-20} Z`} 
              fill="#10192c" 
              stroke="#1e3a5f" 
              strokeWidth="2" 
            />
            {/* Stage / Bar area */}
            <rect x="50" y={deckHeight/2 - 40} width="30" height="80" fill="#2d3748" rx="4" />
            <text x="65" y={deckHeight/2 + 4} fill="#a0aec0" fontSize="10" transform={`rotate(-90, 65, ${deckHeight/2})`} textAnchor="middle">СЦЕНА / БАР</text>

            {/* Placed Tables */}
            {tables.map(t => {
              const isSelected = selectedItem && selectedItem.id === t.id;
              const isVip = t.category === 'vip';
              return (
                <g 
                  key={t.id} 
                  transform={`translate(${t.x}, ${t.y})`}
                  onClick={() => setSelectedItem(t)}
                  style={{ cursor: 'grab' }}
                >
                  {t.type === 'round' ? (
                    <circle 
                      cx="25" 
                      cy="25" 
                      r="22" 
                      fill={isVip ? '#d97706' : (isSelected ? 'var(--color-primary)' : '#2b6cb0')} 
                      stroke={isSelected ? '#fff' : '#1a202c'} 
                      strokeWidth={isSelected ? '3' : '1.5'} 
                    />
                  ) : (
                    <rect 
                      x="0" 
                      y="5" 
                      width="50" 
                      height="35" 
                      rx="6" 
                      fill={isVip ? '#d97706' : (isSelected ? 'var(--color-primary)' : '#2b6cb0')} 
                      stroke={isSelected ? '#fff' : '#1a202c'} 
                      strokeWidth={isSelected ? '3' : '1.5'} 
                    />
                  )}
                  <text 
                    x="25" 
                    y="29" 
                    fill="#ffffff" 
                    fontSize="12" 
                    fontWeight="bold" 
                    textAnchor="middle"
                  >
                    {t.id}
                  </text>
                  <text 
                    x="25" 
                    y="42" 
                    fill="#e2e8f0" 
                    fontSize="9" 
                    textAnchor="middle"
                  >
                    {t.seats} мест
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <button 
            onClick={() => addTable('round')} 
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: '#1e293b', color: 'white', border: '1px solid #334155', borderRadius: '4px', cursor: 'pointer' }}
          >
            <Plus size={16} /> Добавить круглый стол
          </button>
          <button 
            onClick={() => addTable('rect')} 
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: '#1e293b', color: 'white', border: '1px solid #334155', borderRadius: '4px', cursor: 'pointer' }}
          >
            <Plus size={16} /> Добавить диван/прямоугольный
          </button>
          {selectedItem && (
            <button 
              onClick={removeSelected} 
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: '#7f1d1d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: 'auto' }}
            >
              <Trash2 size={16} /> Удалить {selectedItem.id}
            </button>
          )}
        </div>
      </div>

      {/* Property Inspector */}
      <div className="glass" style={{ flex: '1 1 280px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color="var(--color-primary)" />
          Параметры объекта
        </h4>

        <div>
          <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Название зала / палубы</label>
          <input 
            type="text" 
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: 'white', marginTop: '4px' }}
          />
        </div>

        {selectedItem ? (
          <>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Номер / ID стола</label>
              <input 
                type="text" 
                value={selectedItem.id}
                onChange={(e) => {
                  const val = e.target.value;
                  setTables(tables.map(t => t.id === selectedItem.id ? { ...t, id: val } : t));
                  setSelectedItem({ ...selectedItem, id: val });
                }}
                style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: 'white', marginTop: '4px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Категория</label>
              <select 
                value={selectedItem.category}
                onChange={(e) => {
                  const val = e.target.value;
                  setTables(tables.map(t => t.id === selectedItem.id ? { ...t, category: val } : t));
                  setSelectedItem({ ...selectedItem, category: val });
                }}
                style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: 'white', marginTop: '4px' }}
              >
                <option value="standard">Стандартный</option>
                <option value="vip">VIP (У окна / Панорама)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Количество мест</label>
              <input 
                type="number" 
                value={selectedItem.seats}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 1;
                  setTables(tables.map(t => t.id === selectedItem.id ? { ...t, seats: val } : t));
                  setSelectedItem({ ...selectedItem, seats: val });
                }}
                style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: 'white', marginTop: '4px' }}
              />
            </div>

            {/* Position inputs */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>X (px)</label>
                <input 
                  type="number" 
                  value={selectedItem.x}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 0;
                    setTables(tables.map(t => t.id === selectedItem.id ? { ...t, x: val } : t));
                    setSelectedItem({ ...selectedItem, x: val });
                  }}
                  style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: 'white', marginTop: '4px' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Y (px)</label>
                <input 
                  type="number" 
                  value={selectedItem.y}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 0;
                    setTables(tables.map(t => t.id === selectedItem.id ? { ...t, y: val } : t));
                    setSelectedItem({ ...selectedItem, y: val });
                  }}
                  style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: 'white', marginTop: '4px' }}
                />
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto 0' }}>
            Кликните на столик на схеме, чтобы настроить его параметры
          </div>
        )}
      </div>
    </div>
  );
}
