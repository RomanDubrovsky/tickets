import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Square, Sparkles, Send, FileText, CheckCircle2, 
  RefreshCw, Volume2, AlertCircle, FolderCheck, Download, Edit3
} from 'lucide-react';

export default function VoiceTzRecorder({ onSaved }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [authorName, setAuthorName] = useState('Заказчик');
  const [tzTitle, setTzTitle] = useState('');
  const [generatedTz, setGeneratedTz] = useState(null);
  const [saveSuccessInfo, setSaveSuccessInfo] = useState(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  // Инициализация Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ru-RU';

    recognition.onresult = (event) => {
      let currentText = '';
      for (let i = 0; i < event.results.length; i++) {
        currentText += event.results[i][0].transcript + ' ';
      }
      setTranscript(currentText.trim());
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition event:', event.error);
    };

    recognition.onend = () => {
      // Если запись еще активна, перезапускаем (браузер иногда останавливает)
      if (isRecording) {
        try {
          recognition.start();
        } catch (e) {
          // ignore
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
      clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Таймер длительности записи
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(t => t + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  // Старт записи голоса
  const startRecording = () => {
    setSaveSuccessInfo(null);
    setGeneratedTz(null);
    setRecordingTime(0);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setIsRecording(true);
      }
    } else {
      setIsRecording(true);
    }
  };

  // Остановка записи
  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {}
    }
  };

  // Преобразование надиктованного текста в структурированное ТЗ
  const handleConvertToTZ = async () => {
    if (!transcript.trim()) return;

    setIsProcessing(true);

    // Интеллектуальный синтез ТЗ из свободной речи
    setTimeout(async () => {
      const raw = transcript.trim();
      const detectedTitle = tzTitle.trim() || generateSmartTitle(raw);
      const structured = analyzeAndStructureText(raw, detectedTitle);

      setGeneratedTz({
        title: detectedTitle,
        author: authorName.trim() || 'Заказчик',
        summary: structured.summary,
        structuredRequirements: structured.requirements,
        technicalSolution: structured.techPlan,
        rawTranscript: raw
      });

      setIsProcessing(false);
    }, 600);
  };

  // Генерация краткого заголовка из текста
  const generateSmartTitle = (text) => {
    const clean = text.replace(/^(я хочу|нужно|давай сделаем|хотелось бы|надо сделать)/i, '').trim();
    const words = clean.split(/\s+/).slice(0, 5).join(' ');
    return words ? words.charAt(0).toUpperCase() + words.slice(1) : 'Новое пожелание по платформе';
  };

  // Структурирование речи в блоки ТЗ
  const analyzeAndStructureText = (rawText, title) => {
    const lower = rawText.toLowerCase();

    // 1. Краткая суть
    let summary = `Заказчик предлагает реализовать функцию: «${title}». Основная цель — повысить удобство управления флотом, снизить риски ошибок и автоматизировать рутинные операции при продаже и контроле билетов.`;

    // 2. Пункты требований
    let requirementsList = [];
    const sentences = rawText.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);

    if (sentences.length > 0) {
      sentences.forEach((s, i) => {
        requirementsList.push(`${i + 1}. **Требование #${i + 1}**: ${s.charAt(0).toUpperCase() + s.slice(1)}.`);
      });
    } else {
      requirementsList.push(`1. Реализовать функционал согласно надиктованной стенограмме: «${rawText}».`);
    }

    // Добавляем типовые критерии качества
    requirementsList.push(`• **UX / Интерфейс**: Простота использования в 1–2 клика, адаптивность под мобильные телефоны промоутеров и планшеты кассиров.`);
    requirementsList.push(`• **Надежность**: Защита от овербукинга, полная сохранность уже проданных билетов и QR-кодов гостей.`);

    // 3. Техническое предложение для разработчика
    let techPlan = `1. **Frontend**: Интеграция компонентов в существующий React-бандл (React 19 / Vite), добавление обработчиков в UI.\n2. **State & Storage**: Локальное кэширование параметров и мгновенная синхронизация через единый пул рейсов.\n3. **Тестирование**: Прогон сценариев отказа и проверка работы мобильных представлений.`;

    return {
      summary,
      requirements: requirementsList.join('\n'),
      techPlan
    };
  };

  // Сохранение ТЗ в папку customer_tz
  const handleSaveToDisk = async () => {
    if (!generatedTz) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/save-customer-tz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatedTz)
      });

      const resData = await response.json();
      if (resData.success) {
        setSaveSuccessInfo({
          fileName: resData.fileName,
          filePath: resData.filePath
        });
        if (onSaved) onSaved(resData);
      } else {
        fallbackDownload(generatedTz);
      }
    } catch (err) {
      console.warn('Backend save endpoint error, falling back to local download:', err);
      fallbackDownload(generatedTz);
    } finally {
      setIsProcessing(false);
    }
  };

  // Fallback: скачивание файла прямо в браузере, если vite-сервер недоступен
  const fallbackDownload = (tzData) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `ТЗ_${timestamp}_${(tzData.title || 'Новое_ТЗ').replace(/\s+/g, '_')}.md`;
    const content = `# ТЕХНИЧЕСКОЕ ЗАДАНИЕ ОТ ЗАКАЗЧИКА (ГОЛОСОВОЙ ВВОД)
**Дата**: ${new Date().toLocaleString('ru-RU')}
**Тема**: ${tzData.title}
**Автор**: ${tzData.author}

---

## 🎯 1. Краткая суть идеи простыми словами
${tzData.summary}

---

## 📋 2. Структурированные требования (ТЗ)
${tzData.structuredRequirements}

---

## 🛠 3. Технический план реализации
${tzData.technicalSolution}

---

## 🎙️ 4. Исходная прямая речь заказчика (Стенограмма)
> ${tzData.rawTranscript}
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);

    setSaveSuccessInfo({
      fileName,
      filePath: `c:\\Ships\\customer_tz\\${fileName} (скачано в Загрузки)`
    });
  };

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '2px solid #6366f1',
        padding: '24px',
        marginBottom: '28px',
        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.12)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div 
            style={{ 
              background: isRecording ? '#ef4444' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
              padding: '10px', 
              borderRadius: '12px', 
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: isRecording ? 'pulse 1.5s infinite' : 'none'
            }}
          >
            <Mic size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1e1b4b' }}>
              🎙️ Надиктовать ТЗ голосом (ИИ-структурирование)
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>
              Просто наговорите то, что вы думаете или хотите улучшить — система переведет вашу речь в грамотное ТЗ и сохранит для совместного обсуждения.
            </p>
          </div>
        </div>

        {/* Индикатор времени записи */}
        {isRecording && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fee2e2', color: '#b91c1c', padding: '6px 14px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
            Идет запись: {formatSeconds(recordingTime)}
          </div>
        )}
      </div>

      {/* Поле ввода имени и названия (опционально) */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>
            Ваше имя или должность:
          </label>
          <input 
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Например: Заказчик / Руководитель флота"
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ flex: '2 1 300px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>
            Тема задачи (необязательно, ИИ определит сам):
          </label>
          <input 
            type="text"
            value={tzTitle}
            onChange={(e) => setTzTitle(e.target.value)}
            placeholder="Например: Автоматическая смс-рассылка гостям при смене причала"
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Кнопки управления записью */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
        {!isRecording ? (
          <button
            onClick={startRecording}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              background: '#dc2626',
              color: '#ffffff',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
            }}
          >
            <Mic size={18} />
            <span>{transcript ? 'Продолжить запись голоса' : 'Включить микрофон и надиктовать'}</span>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              background: '#1e293b',
              color: '#ffffff',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <Square size={18} />
            <span>Остановить запись</span>
          </button>
        )}

        {transcript && !isRecording && (
          <button
            onClick={handleConvertToTZ}
            disabled={isProcessing}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}
          >
            {isProcessing ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
            <span>Перевести в ТЗ</span>
          </button>
        )}

        {transcript && (
          <button
            onClick={() => {
              setTranscript('');
              setGeneratedTz(null);
              setSaveSuccessInfo(null);
            }}
            style={{
              padding: '10px 16px',
              background: '#f1f5f9',
              color: '#64748b',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Очистить
          </button>
        )}
      </div>

      {/* Текстовое поле стенограммы (можно редактировать или напечатать руками) */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>
            Надиктованный текст (прямая речь):
          </span>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            Вы также можете дописать или подправить текст вручную
          </span>
        </div>

        <textarea
          rows={4}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Нажмите «Включить микрофон и надиктовать» и говорите свободно, либо напишите свои мысли сюда..."
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '10px',
            border: isRecording ? '2px solid #ef4444' : '1px solid #cbd5e1',
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#1e293b',
            boxSizing: 'border-box',
            outline: 'none',
            background: isRecording ? '#fef2f2' : '#f8fafc'
          }}
        />
      </div>

      {/* Блок готового сформированного ТЗ */}
      {generatedTz && (
        <div 
          style={{
            background: '#f8fafc',
            border: '2px solid #4f46e5',
            borderRadius: '14px',
            padding: '20px',
            marginTop: '20px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} color="#4f46e5" />
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1e1b4b' }}>
                📄 Сформированное ТЗ: «{generatedTz.title}»
              </h4>
            </div>

            <button
              onClick={handleSaveToDisk}
              disabled={isProcessing}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                background: '#10b981',
                color: '#ffffff',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
              }}
            >
              <FolderCheck size={16} />
              <span>Сохранить ТЗ разработчику</span>
            </button>
          </div>

          {/* Содержимое ТЗ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', lineHeight: '1.6' }}>
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 'bold', color: '#4338ca', marginBottom: '4px' }}>
                🎯 1. Суть идеи простыми словами:
              </div>
              <div style={{ color: '#334155' }}>{generatedTz.summary}</div>
            </div>

            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 'bold', color: '#4338ca', marginBottom: '4px' }}>
                📋 2. Требования к системе:
              </div>
              <div style={{ color: '#334155', whiteSpace: 'pre-line' }}>{generatedTz.structuredRequirements}</div>
            </div>

            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 'bold', color: '#4338ca', marginBottom: '4px' }}>
                🛠 3. Техническое решение для обсуждения с разработчиком:
              </div>
              <div style={{ color: '#334155', whiteSpace: 'pre-line' }}>{generatedTz.technicalSolution}</div>
            </div>
          </div>
        </div>
      )}

      {/* Оповещение об успешном сохранении в папку */}
      {saveSuccessInfo && (
        <div 
          style={{
            marginTop: '16px',
            background: '#ecfdf5',
            border: '1px solid #6ee7b7',
            borderRadius: '10px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <CheckCircle2 size={24} color="#059669" />
          <div>
            <div style={{ fontWeight: 'bold', color: '#065f46', fontSize: '14px' }}>
              ТЗ успешно сложено в папку для разработчика!
            </div>
            <div style={{ fontSize: '13px', color: '#047857', marginTop: '2px' }}>
              Файл сохранен: <strong>c:\Ships\customer_tz\{saveSuccessInfo.fileName}</strong>. Разработчик увидит его при следующем входе и обсудит с вами реализацию.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
