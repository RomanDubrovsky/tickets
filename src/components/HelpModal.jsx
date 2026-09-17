import React from 'react';
import { HelpCircle, X, Lightbulb, BookOpen } from 'lucide-react';
import { pageHelpData } from './HelpModal.data';

export default function HelpModal({ currentView, isOpen, onClose }) {
  if (!isOpen) return null;

  const data = pageHelpData[currentView] || pageHelpData.afisha;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          padding: '28px',
          position: 'relative',
          color: '#0f172a'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#0f172a';
            e.currentTarget.style.background = '#e2e8f0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#64748b';
            e.currentTarget.style.background = '#f1f5f9';
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div 
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb'
            }}
          >
            <HelpCircle size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>{data.title}</h2>
              {data.badge && (
                <span 
                  style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: '#eff6ff',
                    color: '#2563eb',
                    border: '1px solid #bfdbfe',
                    fontWeight: '600'
                  }}
                >
                  {data.badge}
                </span>
              )}
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
              Инструкция и назначение страницы
            </div>
          </div>
        </div>

        {/* Overview section */}
        <div 
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '20px',
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#334155'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', color: '#2563eb', marginBottom: '6px' }}>
            <BookOpen size={16} /> Описание раздела:
          </div>
          {data.overview}
        </div>

        {/* Step by step guide */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#0f172a' }}>
            📋 Пошаговая инструкция для менеджера:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.steps.map((step, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  gap: '12px',
                  background: '#f8fafc',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  borderLeft: '3px solid #2563eb',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#1e40af', marginBottom: '3px' }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
                    {step.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Tips */}
        {data.tips && data.tips.length > 0 && (
          <div 
            style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '10px',
              padding: '14px',
              marginBottom: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', color: '#b45309', fontSize: '13px', marginBottom: '8px' }}>
              <Lightbulb size={16} /> Важные нюансы и подсказки:
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: '#92400e', lineHeight: '1.6' }}>
              {data.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              background: 'var(--color-primary)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Понятно, закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
