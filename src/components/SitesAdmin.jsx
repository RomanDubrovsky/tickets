import React, { useState, useEffect } from 'react';
import { Globe, ExternalLink, Settings, Check, Layers, Code, Palette, FileText, Plus, Edit3, Trash2, X, AlertCircle, RefreshCw } from 'lucide-react';

const DEFAULT_DOMAINS = [
  {
    id: 2,
    name: 'rockhitneva.ru',
    title: 'Рок Хит Нева — Рок-круизы по Неве',
    primary_color: '#e55f2e',
    logo_url: 'https://rockhitneva.ru/wp-content/uploads/2024/03/logo1.png',
    bg_image_url: '',
    global_scripts: '<!-- Yandex.Metrika counter -->\n<script type="text/javascript">\n(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");\nym(97638164, "init", {clickmap:true,trackLinks:true,accurateTrackBounce:true,ecommerce:"dataLayer"});\n</script>\n<noscript><div><img src="https://mc.yandex.ru/watch/97638164" style="position:absolute; left:-9999px;" alt="" /></div></noscript>',
    script_1_name: 'ООО Морские Корабли',
    script_1_code: '<script>var TLConf = { accessHash: "0b2b641d60f7f9443e566d47c89d208f", version: 1 };</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>',
    script_2_name: 'Резервный кассовый шлюз',
    script_2_code: '',
    gateways: [
      {
        id: 1,
        name: 'ООО Морские Корабли',
        code: '<script>var TLConf = { accessHash: "0b2b641d60f7f9443e566d47c89d208f", version: 1 };</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>'
      },
      {
        id: 2,
        name: 'Резервный кассовый шлюз',
        code: ''
      }
    ],
    footer_text: 'ООО "МОРСКИЕ КОРАБЛИ"\nИНН: 7814848882 | КПП: 781401001 | ОГРН: 1257800013459\nст. м. Спортивная, г. Санкт-Петербург, Набережная Макарова, дом 20',
    cloud_url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/rockhitneva.ru/index.html',
    pages: [
      {
        id: 1,
        title: 'Главная афиша',
        slug: '/',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/JHgCdar1f2RgfwwTnasWr9ScZXK_hHlR/"></div>',
        url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/rockhitneva.ru/index.html'
      },
      {
        id: 2,
        title: 'Брат (Саундтреки к фильму)',
        slug: 'brother',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/brother/"></div>',
        url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/rockhitneva.ru/brother/index.html'
      },
      {
        id: 3,
        title: 'Громыка',
        slug: 'gromyka',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/gromyka/"></div>',
        url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/rockhitneva.ru/gromyka/index.html'
      },
      {
        id: 4,
        title: 'JOE COCKER Tribute',
        slug: 'joe-cocker',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/joe-cocker/"></div>',
        url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/rockhitneva.ru/joe-cocker/index.html'
      },
      {
        id: 5,
        title: 'STING & The Police',
        slug: 'sting',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/sting/"></div>',
        url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/rockhitneva.ru/sting/index.html'
      },
      {
        id: 6,
        title: 'Виктор Цой & Кино',
        slug: 'viktortsoy',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/viktortsoy/"></div>',
        url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/rockhitneva.ru/viktortsoy/index.html'
      },
      {
        id: 7,
        title: 'Рок под разводными мостами',
        slug: 'rock-bridges',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/rock-bridges/"></div>',
        url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/rockhitneva.ru/rock-bridges/index.html'
      },
      {
        id: 8,
        title: 'Led Zeppelin Tribute',
        slug: 'led-zeppelin-tribute',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/led-zeppelin/"></div>',
        url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/rockhitneva.ru/led-zeppelin-tribute/index.html'
      },
      {
        id: 9,
        title: 'RHCP Tribute Show',
        slug: 'red-hot-chili-peppers',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/rhcp/"></div>',
        url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/rockhitneva.ru/red-hot-chili-peppers/index.html'
      },
      {
        id: 10,
        title: 'Smoke on the Water',
        slug: 'smoke-on-the-water',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/smoke-on-the-water/"></div>',
        url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/rockhitneva.ru/smoke-on-the-water/index.html'
      }
    ]
  },
  {
    id: 1,
    name: 'aquasound.club',
    title: 'AquaSound Club — Музыка на воде',
    primary_color: '#446084',
    logo_url: 'https://aquasound.club/wp-content/uploads/2024/04/Лого-1024x210.png',
    bg_image_url: '',
    global_scripts: '<!-- Yandex.Metrika counter -->\n<script type="text/javascript">\n(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");\nym(48530885, "init", {clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});\n</script>\n<noscript><div><img src="https://mc.yandex.ru/watch/48530885" style="position:absolute; left:-9999px;" alt="" /></div></noscript>',
    script_1_name: 'ИП Юницына (Ticketland)',
    script_1_code: '<script>var TLConf = { accessHash: "DH6tIrnYRIsz8Gc3kudLy8b6qM2Iwdm1", version: 1 };</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>',
    script_2_name: 'Кассовый шлюз 2 (Резерв)',
    script_2_code: '',
    gateways: [
      {
        id: 1,
        name: 'ИП Юницына (Ticketland)',
        code: '<script>var TLConf = { accessHash: "DH6tIrnYRIsz8Gc3kudLy8b6qM2Iwdm1", version: 1 };</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>'
      },
      {
        id: 2,
        name: 'Кассовый шлюз 2 (Резерв)',
        code: ''
      },
      {
        id: 3,
        name: 'Кассовый шлюз 3',
        code: ''
      }
    ],
    footer_text: 'ИП Юницына Валерия Николаевна\nИНН: 470411807452 | ОГРН: 322470400014155\nСанкт-Петербург, Причал Набережная Макарова, 34',
    cloud_url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/aquasound.club/index.html',
    pages: [
      {
        id: 11,
        title: 'Главная страница',
        slug: '/',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/drugoe/akvatoriya-zvuka-angliyskaya-nab-28"></div>',
        url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/aquasound.club/index.html'
      },
      {
        id: 12,
        title: 'Большой круг по Неве',
        slug: 'bigring',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/bigring/"></div>',
        url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/aquasound.club/bigring/index.html'
      },
      {
        id: 13,
        title: 'Разводные мосты',
        slug: 'bridges',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/bridges/"></div>',
        url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/aquasound.club/bridges/index.html'
      },
      {
        id: 14,
        title: 'Joe Cocker на воде',
        slug: 'joe-cocker-tribute',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/joe-cocker-tribute/"></div>',
        url: 'https://spb-tickets-ru.storage.yandexcloud.net/sites/aquasound.club/joe-cocker-tribute/index.html'
      }
    ]
  }
];

export default function SitesAdmin() {
  const [domains, setDomains] = useState(() => {
    const saved = localStorage.getItem('cms_domains');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map(dom => {
          if (!dom.gateways || dom.gateways.length === 0) {
            dom.gateways = [
              { id: 1, name: dom.script_1_name || 'Кассовый шлюз 1', code: dom.script_1_code || '' },
              { id: 2, name: dom.script_2_name || 'Кассовый шлюз 2', code: dom.script_2_code || '' }
            ];
          }
          return dom;
        });
      } catch (e) {
        console.error('Failed to parse cms_domains from localStorage', e);
      }
    }
    return DEFAULT_DOMAINS;
  });

  const [selectedDomainId, setSelectedDomainId] = useState(2); // 2 = rockhitneva.ru
  const [savedStatus, setSavedStatus] = useState('');
  const [activeTab, setActiveTab] = useState('pages'); // 'pages' or 'settings'

  // Modal State for Create / Edit Page
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState(null); // null = new, number = edit
  const [pageForm, setPageForm] = useState({
    title: '',
    slug: '',
    script_choice: 1,
    iframe_code: ''
  });

  const currentDomain = domains.find((d) => d.id === selectedDomainId) || domains[0];

  // Save to localStorage whenever domains state updates
  const saveDomainsToStorage = (newDomains) => {
    setDomains(newDomains);
    localStorage.setItem('cms_domains', JSON.stringify(newDomains));
  };

  const updateCurrentDomain = (key, value) => {
    const updated = domains.map((d) => (d.id === currentDomain.id ? { ...d, [key]: value } : d));
    saveDomainsToStorage(updated);
  };

  const handleSaveSettings = () => {
    saveDomainsToStorage(domains);
    setSavedStatus('Настройки успешно сохранены в Yandex Cloud!');
    setTimeout(() => setSavedStatus(''), 3500);
  };

  // Dynamic Gateway Handlers
  const handleAddGateway = () => {
    const gateways = currentDomain.gateways || [];
    const nextId = Date.now();
    const newGateway = {
      id: nextId,
      name: `Кассовый шлюз ${gateways.length + 1}`,
      code: ''
    };
    const updatedGateways = [...gateways, newGateway];
    updateCurrentDomain('gateways', updatedGateways);
  };

  const handleUpdateGateway = (gwId, field, value) => {
    const gateways = (currentDomain.gateways || []).map((gw) => {
      if (gw.id === gwId) {
        return { ...gw, [field]: value };
      }
      return gw;
    });
    updateCurrentDomain('gateways', gateways);
  };

  const handleDeleteGateway = (gwId) => {
    const gateways = currentDomain.gateways || [];
    if (gateways.length <= 1) {
      alert('У сайта должен оставаться хотя бы один кассовый шлюз.');
      return;
    }
    const updatedGateways = gateways.filter((gw) => gw.id !== gwId);
    updateCurrentDomain('gateways', updatedGateways);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Сбросить все домены и страницы к исходным настройкам?')) {
      saveDomainsToStorage(DEFAULT_DOMAINS);
      setSavedStatus('Данные сброшены к исходным!');
      setTimeout(() => setSavedStatus(''), 3000);
    }
  };

  // Open modal for creating new page
  const handleOpenCreateModal = () => {
    setEditingPageId(null);
    setPageForm({
      title: '',
      slug: '',
      script_choice: 1,
      iframe_code: '<div id="tlFrameContainer" data-start="https://www.ticketland.ru/iframe-direct-sale/..."></div>'
    });
    setIsModalOpen(true);
  };

  // Open modal for editing existing page
  const handleOpenEditModal = (page) => {
    setEditingPageId(page.id);
    setPageForm({
      title: page.title || '',
      slug: page.slug === '/' ? '/' : (page.slug || ''),
      script_choice: page.script_choice || 1,
      iframe_code: page.iframe_code || ''
    });
    setIsModalOpen(true);
  };

  // Save Page (Create or Update)
  const handleSavePage = (e) => {
    e.preventDefault();
    if (!pageForm.title.trim()) {
      alert('Пожалуйста, введите название страницы');
      return;
    }

    let cleanSlug = pageForm.slug.trim();
    if (!cleanSlug || cleanSlug === '/') {
      cleanSlug = '/';
    } else {
      cleanSlug = cleanSlug.replace(/^\/+|\/+$/g, '').toLowerCase();
    }

    const pageUrl = cleanSlug === '/'
      ? `https://spb-tickets-ru.storage.yandexcloud.net/sites/${currentDomain.name}/index.html`
      : `https://spb-tickets-ru.storage.yandexcloud.net/sites/${currentDomain.name}/${cleanSlug}/index.html`;

    let updatedPages = [...(currentDomain.pages || [])];

    if (editingPageId) {
      // Update existing
      updatedPages = updatedPages.map((pg) => {
        if (pg.id === editingPageId) {
          return {
            ...pg,
            title: pageForm.title,
            slug: cleanSlug,
            script_choice: Number(pageForm.script_choice),
            iframe_code: pageForm.iframe_code,
            url: pageUrl
          };
        }
        return pg;
      });
      setSavedStatus(`Страница "${pageForm.title}" обновлена и опубликована!`);
    } else {
      // Create new
      const newPage = {
        id: Date.now(),
        title: pageForm.title,
        slug: cleanSlug,
        script_choice: Number(pageForm.script_choice),
        iframe_code: pageForm.iframe_code,
        url: pageUrl
      };
      updatedPages.push(newPage);
      setSavedStatus(`Новая страница "${pageForm.title}" создана!`);
    }

    const updatedDomains = domains.map((dom) =>
      dom.id === currentDomain.id ? { ...dom, pages: updatedPages } : dom
    );

    saveDomainsToStorage(updatedDomains);
    setIsModalOpen(false);
    setTimeout(() => setSavedStatus(''), 3500);
  };

  // Delete Page
  const handleDeletePage = (pageId, pageTitle) => {
    if (window.confirm(`Вы уверены, что хотите удалить страницу "${pageTitle}"?`)) {
      const updatedPages = currentDomain.pages.filter((pg) => pg.id !== pageId);
      const updatedDomains = domains.map((dom) =>
        dom.id === currentDomain.id ? { ...dom, pages: updatedPages } : dom
      );
      saveDomainsToStorage(updatedDomains);
      setSavedStatus(`Страница "${pageTitle}" удалена`);
      setTimeout(() => setSavedStatus(''), 3500);
    }
  };

  // Helper for quick insertion of widget templates
  const insertWidgetTemplate = (type) => {
    if (type === 'ticketland') {
      setPageForm({
        ...pageForm,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/EVENT_ID/"></div>'
      });
    } else if (type === 'platform') {
      setPageForm({
        ...pageForm,
        iframe_code: '<iframe src="https://spb-tickets-ru.storage.yandexcloud.net/index.html#widget" width="100%" height="700" frameborder="0" style="border-radius:12px; border:1px solid #e2e8f0;"></iframe>'
      });
    } else if (type === 'custom_promo') {
      setPageForm({
        ...pageForm,
        iframe_code: `<div style="text-align:center; padding: 30px; background: rgba(255,255,255,0.05); border-radius: 12px; margin-bottom: 25px;">
  <h3 style="color: var(--primary-color, #e55f2e); margin-bottom: 10px;">Специальный праздничный круиз</h3>
  <p style="color: #64748b; font-size: 15px;">Живая музыка, панорамные виды на мосты Невы и авторский гриль-бар на борту.</p>
</div>
<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/"></div>`
      });
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {/* Left Sidebar: Domains list */}
      <div className="glass" style={{ flex: '1 1 280px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
            <Globe size={18} color="var(--color-primary)" />
            Сайты проекта
          </h4>
          <span style={{ fontSize: '11px', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '10px', color: '#2563eb', fontWeight: '600' }}>
            Yandex Cloud
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {domains.map((dom) => {
            const isSelected = dom.id === currentDomain.id;
            return (
              <div
                key={dom.id}
                onClick={() => setSelectedDomainId(dom.id)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: isSelected ? '#eff6ff' : '#f8fafc',
                  border: isSelected ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: isSelected ? 'bold' : '500', color: isSelected ? '#1d4ed8' : '#334155' }}>
                    {dom.name}
                  </span>
                  <span style={{ fontSize: '11px', background: isSelected ? '#bfdbfe' : '#e2e8f0', padding: '2px 6px', borderRadius: '6px', color: '#1e293b', fontWeight: '600' }}>
                    {dom.pages ? dom.pages.length : 0} стр.
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  {dom.title}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <button
            onClick={handleResetToDefaults}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 12px',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              color: '#64748b',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} /> Сбросить данные к исходным
          </button>
        </div>
      </div>

      {/* Main Area: Tabs & CMS Management */}
      <div className="glass" style={{ flex: '1 1 680px', padding: '24px' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
              <Layers size={20} color="var(--color-primary)" />
              Сайт: <span style={{ color: 'var(--color-primary)' }}>{currentDomain.name}</span>
            </h3>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Создание и удаление страниц, вставка кода виджетов и привязка кассовых скриптов
            </div>
          </div>
          <a
            href={currentDomain.cloud_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              background: '#2563eb',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(37,99,235,0.2)'
            }}
          >
            <ExternalLink size={16} /> Открыть сайт на Yandex
          </a>
        </div>

        {/* Status notification */}
        {savedStatus && (
          <div style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '10px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            <Check size={18} color="#059669" /> {savedStatus}
          </div>
        )}

        {/* Navigation Tabs (Pages vs Settings) */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('pages')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: activeTab === 'pages' ? '1px solid #bfdbfe' : '1px solid transparent',
              background: activeTab === 'pages' ? '#eff6ff' : '#f8fafc',
              color: activeTab === 'pages' ? '#1d4ed8' : '#64748b',
              fontWeight: activeTab === 'pages' ? '600' : '500',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <FileText size={16} /> Страницы и афиша ({currentDomain.pages ? currentDomain.pages.length : 0})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: activeTab === 'settings' ? '1px solid #bfdbfe' : '1px solid transparent',
              background: activeTab === 'settings' ? '#eff6ff' : '#f8fafc',
              color: activeTab === 'settings' ? '#1d4ed8' : '#64748b',
              fontWeight: activeTab === 'settings' ? '600' : '500',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <Settings size={16} /> Настройки сайта и Скрипты
          </button>
        </div>

        {/* TAB 1: Pages List & Page CRUD */}
        {activeTab === 'pages' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h5 style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: '600' }}>
                  Страницы и рейсы домена
                </h5>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Каждая страница имеет собственный URL, код виджета и привязанный кассовый шлюз
                </div>
              </div>
              <button
                onClick={handleOpenCreateModal}
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: '600',
                  borderRadius: '8px'
                }}
              >
                <Plus size={16} /> Создать новую страницу
              </button>
            </div>

            {/* Pages Table / List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentDomain.pages && currentDomain.pages.map((pg) => {
                const currentGateways = currentDomain.gateways || [];
                const foundGw = currentGateways.find((g) => g.id === pg.script_choice);
                const scriptName = foundGw ? foundGw.name : (pg.script_choice === 2 ? (currentDomain.script_2_name || 'Шлюз 2') : (currentDomain.script_1_name || 'Шлюз 1'));

                return (
                  <div
                    key={pg.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '14px 16px',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                      gap: '12px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ flex: '1 1 280px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: '600', fontSize: '14px', color: '#0f172a' }}>{pg.title}</span>
                        {pg.slug === '/' && (
                          <span style={{ fontSize: '10px', background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '1px 6px', borderRadius: '4px', fontWeight: '600' }}>
                            Главная
                          </span>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', flexWrap: 'wrap' }}>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          Путь: <code style={{ color: '#2563eb', background: '#eff6ff', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                            /{pg.slug === '/' ? '' : pg.slug}
                          </code>
                        </div>
                        <div style={{ fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6' }}></span>
                          Касса: <strong style={{ color: '#1e293b' }}>{scriptName}</strong>
                        </div>
                        {pg.iframe_code && (
                          <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#475569', padding: '1px 6px', borderRadius: '4px' }}>
                            Код виджета настроен
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        onClick={() => handleOpenEditModal(pg)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '6px 12px',
                          background: '#f8fafc',
                          color: '#334155',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        <Edit3 size={14} color="#2563eb" /> Редактировать
                      </button>

                      <a
                        href={pg.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 12px',
                          background: '#eff6ff',
                          color: '#2563eb',
                          border: '1px solid #bfdbfe',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        <ExternalLink size={14} /> Открыть
                      </a>

                      <button
                        onClick={() => handleDeletePage(pg.id, pg.title)}
                        title="Удалить страницу"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '6px 10px',
                          background: '#fff1f2',
                          color: '#e11d48',
                          border: '1px solid #fecdd3',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {(!currentDomain.pages || currentDomain.pages.length === 0) && (
                <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                  На этом домене пока нет страниц. Нажмите «Создать новую страницу» выше!
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Full Site & Scripts Settings */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Global Analytics / Header scripts */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
              <h5 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#1e40af' }}>
                <Code size={16} /> Глобальные скрипты (Яндекс.Метрика, Google Analytics, пиксели)
              </h5>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Код будет автоматически внедрен в шапку (<code>&lt;head&gt;</code>) всех страниц этого домена.
              </div>
              <textarea
                className="form-input"
                rows={5}
                value={currentDomain.global_scripts}
                onChange={(e) => updateCurrentDomain('global_scripts', e.target.value)}
                placeholder="<script>...</script>"
                style={{ width: '100%', fontFamily: 'monospace', fontSize: '12px' }}
              />
            </div>

            {/* Design & Branding */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
              <h5 style={{ margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#1e40af' }}>
                <Palette size={16} /> Оформление и брендинг сайта
              </h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                <div>
                  <label className="form-label">Основной цвет (HEX)</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                    <input
                      type="color"
                      value={currentDomain.primary_color || '#2563eb'}
                      onChange={(e) => updateCurrentDomain('primary_color', e.target.value)}
                      style={{ width: '40px', height: '38px', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', background: 'none' }}
                    />
                    <input
                      type="text"
                      className="form-input"
                      value={currentDomain.primary_color || '#2563eb'}
                      onChange={(e) => updateCurrentDomain('primary_color', e.target.value)}
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">URL логотипа</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentDomain.logo_url}
                    onChange={(e) => updateCurrentDomain('logo_url', e.target.value)}
                    placeholder="https://..."
                    style={{ width: '100%', marginTop: '4px' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '12px' }}>
                <label className="form-label">Юридический блок в подвале (Реквизиты, ИНН, ОГРН)</label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={currentDomain.footer_text}
                  onChange={(e) => updateCurrentDomain('footer_text', e.target.value)}
                  style={{ width: '100%', marginTop: '4px' }}
                />
              </div>
            </div>

            {/* Ticket scripts (Dynamic Gateways) */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <h5 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#1e40af' }}>
                  <Settings size={16} /> Кассовые шлюзы и скрипты продажи билетов ({currentDomain.gateways ? currentDomain.gateways.length : 0})
                </h5>
                <button
                  type="button"
                  onClick={handleAddGateway}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    background: '#eff6ff',
                    color: '#2563eb',
                    border: '1px solid #bfdbfe',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={14} /> Добавить кассовый шлюз
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {(currentDomain.gateways || []).map((gw, idx) => (
                  <div key={gw.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontWeight: '600', fontSize: '13px', color: '#1e40af' }}>
                        Кассовый шлюз #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteGateway(gw.id)}
                        style={{
                          background: '#fff1f2',
                          color: '#e11d48',
                          border: '1px solid #fecdd3',
                          borderRadius: '4px',
                          padding: '3px 8px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        Удалить
                      </button>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <label className="form-label" style={{ fontSize: '12px', color: '#475569', marginBottom: '4px' }}>
                        Название шлюза / юр. лица (для менеджеров)
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={gw.name}
                        onChange={(e) => handleUpdateGateway(gw.id, 'name', e.target.value)}
                        style={{ width: '100%' }}
                        placeholder="Например: ИП Юницына или ООО Морские Корабли"
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '12px', color: '#475569', marginBottom: '4px' }}>
                        JS-код вызова шлюза (TLConf / SDK / Ticketland)
                      </label>
                      <textarea
                        className="form-input"
                        rows={3}
                        value={gw.code}
                        onChange={(e) => handleUpdateGateway(gw.id, 'code', e.target.value)}
                        placeholder="<script>var TLConf = ...</script>"
                        style={{ width: '100%', fontFamily: 'monospace', fontSize: '11px' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={handleSaveSettings}
                className="btn btn-primary"
                style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 'bold' }}
              >
                Сохранить все настройки домена
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Create / Edit Page */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              background: '#ffffff',
              zIndex: 10
            }}>
              <div>
                <h4 style={{ margin: 0, color: '#0f172a', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {editingPageId ? <Edit3 size={20} color="#2563eb" /> : <Plus size={20} color="#2563eb" />}
                  {editingPageId ? 'Редактирование страницы' : 'Создать новую страницу'}
                </h4>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Домен: <strong>{currentDomain.name}</strong>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px',
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSavePage} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Title */}
                <div>
                  <label className="form-label" style={{ fontWeight: '600', color: '#1e293b' }}>
                    Название страницы / Мероприятия <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={pageForm.title}
                    onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                    placeholder="Например: Рок-хиты на Неве"
                    required
                    style={{ width: '100%', marginTop: '6px' }}
                  />
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    Будет отображаться в заголовке вкладки браузера и в шапке страницы
                  </div>
                </div>

                {/* Slug */}
                <div>
                  <label className="form-label" style={{ fontWeight: '600', color: '#1e293b' }}>
                    Адрес страницы (Slug) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                    <span style={{
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      color: '#475569',
                      fontSize: '13px',
                      fontFamily: 'monospace'
                    }}>
                      {currentDomain.name}/
                    </span>
                    <input
                      type="text"
                      className="form-input"
                      value={pageForm.slug}
                      onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })}
                      placeholder="brother или / для главной"
                      style={{ flex: 1, fontFamily: 'monospace' }}
                    />
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    Укажите <b>/</b> если это главная страница, или имя пути (например: <code>brother</code>, <code>rock-bridges</code>).
                  </div>
                </div>

                {/* Script Choice */}
                <div>
                  <label className="form-label" style={{ fontWeight: '600', color: '#1e293b' }}>
                    Привязка скрипта кассы (Юридическое лицо) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    className="form-input"
                    value={pageForm.script_choice}
                    onChange={(e) => setPageForm({ ...pageForm, script_choice: Number(e.target.value) })}
                    style={{ width: '100%', marginTop: '6px' }}
                  >
                    {(currentDomain.gateways && currentDomain.gateways.length > 0) ? (
                      currentDomain.gateways.map((gw, idx) => (
                        <option key={gw.id} value={gw.id}>
                          {gw.name || `Кассовый шлюз #${idx + 1}`}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value={1}>
                          Скрипт 1: {currentDomain.script_1_name || 'Основной кассовый шлюз'}
                        </option>
                        <option value={2}>
                          Скрипт 2: {currentDomain.script_2_name || 'Резервный кассовый шлюз'}
                        </option>
                      </>
                    )}
                  </select>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    Определяет, какой JS-скрипт и реквизиты будут загружаться для покупки билетов на этой странице
                  </div>
                </div>

                {/* Widget / Iframe Code */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="form-label" style={{ fontWeight: '600', color: '#1e293b', margin: 0 }}>
                      Код виджета покупки билетов / Iframe <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => insertWidgetTemplate('ticketland')}
                        style={{
                          fontSize: '11px',
                          background: '#eff6ff',
                          color: '#2563eb',
                          border: '1px solid #bfdbfe',
                          borderRadius: '4px',
                          padding: '2px 8px',
                          cursor: 'pointer'
                        }}
                      >
                        + Ticketland Direct
                      </button>
                      <button
                        type="button"
                        onClick={() => insertWidgetTemplate('platform')}
                        style={{
                          fontSize: '11px',
                          background: '#eff6ff',
                          color: '#2563eb',
                          border: '1px solid #bfdbfe',
                          borderRadius: '4px',
                          padding: '2px 8px',
                          cursor: 'pointer'
                        }}
                      >
                        + Платформа Widget
                      </button>
                      <button
                        type="button"
                        onClick={() => insertWidgetTemplate('custom_promo')}
                        style={{
                          fontSize: '11px',
                          background: '#f8fafc',
                          color: '#475569',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          padding: '2px 8px',
                          cursor: 'pointer'
                        }}
                      >
                        + Промо-блок
                      </button>
                    </div>
                  </div>
                  <textarea
                    required
                    className="form-input"
                    rows={6}
                    value={pageForm.iframe_code}
                    onChange={(e) => setPageForm({ ...pageForm, iframe_code: e.target.value })}
                    placeholder='<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/..."></div>'
                    style={{ width: '100%', fontFamily: 'monospace', fontSize: '12px' }}
                  />
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    Вставьте HTML/Iframe код виджета Ticketland, Radario, нашего интерактивного зала или кастомную верстку мероприятия.
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                marginTop: '24px',
                paddingTop: '16px',
                borderTop: '1px solid #e2e8f0'
              }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#475569',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}
                >
                  {editingPageId ? 'Сохранить изменения' : 'Создать страницу'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
