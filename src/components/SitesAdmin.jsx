import React, { useState, useEffect } from 'react';
import { Globe, ExternalLink, Settings, Check, Layers, Code, Palette, FileText, Plus, Edit3, Trash2, X, RefreshCw } from 'lucide-react';

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
    const saved = localStorage.getItem('cms_domains_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_DOMAINS;
  });

  const [selectedDomainId, setSelectedDomainId] = useState(2); // 2 = rockhitneva.ru
  const [activeTab, setActiveTab] = useState('pages'); // 'pages' or 'gateways'
  const [notification, setNotification] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState(null);
  const [pageForm, setPageForm] = useState({
    title: '', slug: '', script_choice: 1, iframe_code: ''
  });

  const currentDomain = domains.find(d => d.id === selectedDomainId) || domains[0];

  const saveDomainsToStorage = (newDomains) => {
    setDomains(newDomains);
    localStorage.setItem('cms_domains_v2', JSON.stringify(newDomains));
  };

  const updateCurrentDomain = (key, value) => {
    const updated = domains.map(d => d.id === currentDomain.id ? { ...d, [key]: value } : d);
    saveDomainsToStorage(updated);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  // Gateways
  const handleAddGateway = () => {
    const gateways = currentDomain.gateways || [];
    const newGateway = {
      id: Date.now(),
      name: `Кассовый шлюз ${gateways.length + 1}`,
      code: '<script>var TLConf = { accessHash: "...", version: 1 };</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>'
    };
    updateCurrentDomain('gateways', [...gateways, newGateway]);
    showNotification('Кассовый шлюз добавлен');
  };

  const handleUpdateGateway = (gwId, field, value) => {
    const gateways = (currentDomain.gateways || []).map(gw => gw.id === gwId ? { ...gw, [field]: value } : gw);
    updateCurrentDomain('gateways', gateways);
  };

  const handleDeleteGateway = (gwId) => {
    const gateways = currentDomain.gateways || [];
    if (gateways.length <= 1) {
      alert('У сайта должен оставаться хотя бы один кассовый шлюз.');
      return;
    }
    updateCurrentDomain('gateways', gateways.filter(gw => gw.id !== gwId));
    showNotification('Кассовый шлюз удален');
  };

  // Pages
  const handleOpenCreateModal = () => {
    setEditingPageId(null);
    setPageForm({
      title: '',
      slug: '',
      script_choice: 1,
      iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/..."></div>'
    });
    setIsModalOpen(true);
  };

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

  const handleSavePage = (e) => {
    e.preventDefault();
    if (!pageForm.title.trim()) {
      alert('Введите название страницы');
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
      updatedPages = updatedPages.map(pg => pg.id === editingPageId ? {
        ...pg,
        title: pageForm.title,
        slug: cleanSlug,
        script_choice: Number(pageForm.script_choice),
        iframe_code: pageForm.iframe_code,
        url: pageUrl
      } : pg);
      showNotification(`Страница "${pageForm.title}" обновлена!`);
    } else {
      const newPage = {
        id: Date.now(),
        title: pageForm.title,
        slug: cleanSlug,
        script_choice: Number(pageForm.script_choice),
        iframe_code: pageForm.iframe_code,
        url: pageUrl
      };
      updatedPages.push(newPage);
      showNotification(`Страница "${pageForm.title}" создана!`);
    }

    const updatedDomains = domains.map(dom => dom.id === currentDomain.id ? { ...dom, pages: updatedPages } : dom);
    saveDomainsToStorage(updatedDomains);
    setIsModalOpen(false);
  };

  const handleDeletePage = (pageId, pageTitle) => {
    if (window.confirm(`Удалить страницу "${pageTitle}"?`)) {
      const updatedPages = currentDomain.pages.filter(pg => pg.id !== pageId);
      const updatedDomains = domains.map(dom => dom.id === currentDomain.id ? { ...dom, pages: updatedPages } : dom);
      saveDomainsToStorage(updatedDomains);
      showNotification(`Страница "${pageTitle}" удалена`);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {/* LEFT SIDEBAR: DOMAINS */}
      <div className="glass" style={{ flex: '1 1 280px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
            <Globe size={18} color="var(--color-primary)" />
            Сайты проекта
          </h4>
          <span style={{ fontSize: '11px', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '10px', color: '#2563eb', fontWeight: 'bold' }}>
            Yandex Cloud
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {domains.map(dom => {
            const isSelected = dom.id === currentDomain.id;
            return (
              <div
                key={dom.id}
                onClick={() => setSelectedDomainId(dom.id)}
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  background: isSelected ? '#eff6ff' : '#f8fafc',
                  border: isSelected ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: isSelected ? 'bold' : '600', color: isSelected ? '#1d4ed8' : '#334155' }}>
                    {dom.name}
                  </span>
                  <span style={{ fontSize: '11px', background: isSelected ? '#bfdbfe' : '#e2e8f0', padding: '2px 8px', borderRadius: '10px', color: '#1e293b', fontWeight: 'bold' }}>
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

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a
            href={currentDomain.cloud_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px',
              background: '#2563eb',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 'bold'
            }}
          >
            <ExternalLink size={15} /> Открыть {currentDomain.name}
          </a>
        </div>
      </div>

      {/* RIGHT WORKSPACE */}
      <div className="glass" style={{ flex: '1 1 700px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={22} color="var(--color-primary)" />
              Сайт: <span style={{ color: 'var(--color-primary)' }}>{currentDomain.name}</span>
            </h3>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
              Управление посадочными страницами, привязкой кассовых шлюзов и аналитикой
            </div>
          </div>
        </div>

        {notification && (
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
            <Check size={18} color="#059669" /> {notification}
          </div>
        )}

        {/* Navigation Tabs */}
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
              fontWeight: activeTab === 'pages' ? 'bold' : '500',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <FileText size={16} /> 🌐 Страницы сайта ({currentDomain.pages ? currentDomain.pages.length : 0})
          </button>

          <button
            onClick={() => setActiveTab('gateways')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: activeTab === 'gateways' ? '1px solid #bfdbfe' : '1px solid transparent',
              background: activeTab === 'gateways' ? '#eff6ff' : '#f8fafc',
              color: activeTab === 'gateways' ? '#1d4ed8' : '#64748b',
              fontWeight: activeTab === 'gateways' ? 'bold' : '500',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <Settings size={16} /> ⚙️ Кассовые шлюзы & Юр. лица
          </button>
        </div>

        {/* TAB 1: PAGES */}
        {activeTab === 'pages' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h5 style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: 'bold' }}>
                  Страницы и афиша на домене
                </h5>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Каждая страница имеет готовый статический URL на Yandex Cloud
                </div>
              </div>
              <button
                onClick={handleOpenCreateModal}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '13px', fontWeight: 'bold', borderRadius: '8px' }}
              >
                <Plus size={16} /> Создать страницу
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(currentDomain.pages || []).map(pg => {
                const currentGateways = currentDomain.gateways || [];
                const foundGw = currentGateways.find(g => g.id === pg.script_choice);
                const scriptName = foundGw ? foundGw.name : 'Кассовый шлюз';

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
                        <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#0f172a' }}>{pg.title}</span>
                        {pg.slug === '/' && (
                          <span style={{ fontSize: '10px', background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '1px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                            Главная
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', flexWrap: 'wrap', fontSize: '12px' }}>
                        <div>
                          Путь: <code style={{ color: '#2563eb', background: '#eff6ff', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                            /{pg.slug === '/' ? '' : pg.slug}
                          </code>
                        </div>
                        <div style={{ color: '#475569' }}>
                          Касса: <strong style={{ color: '#1e293b' }}>{scriptName}</strong>
                        </div>
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
                        <ExternalLink size={14} /> Открыть на YC
                      </a>

                      <button
                        onClick={() => handleDeletePage(pg.id, pg.title)}
                        style={{
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
            </div>
          </div>
        )}

        {/* TAB 2: GATEWAYS & SETTINGS */}
        {activeTab === 'gateways' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <h5 style={{ margin: 0, fontSize: '14px', color: '#1e40af', fontWeight: 'bold' }}>
                  Кассовые шлюзы & Юридические лица Ticketland
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
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={14} /> Добавить кассовый шлюз
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {(currentDomain.gateways || []).map((gw, idx) => (
                  <div key={gw.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#1e40af' }}>
                        Кассовый шлюз #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteGateway(gw.id)}
                        style={{ background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3', borderRadius: '4px', padding: '3px 8px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}
                      >
                        Удалить
                      </button>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <label className="form-label" style={{ fontSize: '12px', color: '#475569', marginBottom: '4px' }}>
                        Название юрлица (для менеджеров)
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={gw.name}
                        onChange={e => handleUpdateGateway(gw.id, 'name', e.target.value)}
                        style={{ width: '100%' }}
                        placeholder="ООО Морские Корабли или ИП Юницына"
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '12px', color: '#475569', marginBottom: '4px' }}>
                        JS-код вызова шлюза (TLConf accessHash)
                      </label>
                      <textarea
                        className="form-input"
                        rows={3}
                        value={gw.code}
                        onChange={e => handleUpdateGateway(gw.id, 'code', e.target.value)}
                        placeholder='<script>var TLConf = { accessHash: "...", version: 1 };</script>'
                        style={{ width: '100%', fontFamily: 'monospace', fontSize: '11px' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
              <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#1e40af', fontWeight: 'bold' }}>
                Глобальные скрипты (Яндекс.Метрика / счетчики)
              </h5>
              <textarea
                className="form-input"
                rows={4}
                value={currentDomain.global_scripts || ''}
                onChange={e => updateCurrentDomain('global_scripts', e.target.value)}
                style={{ width: '100%', fontFamily: 'monospace', fontSize: '12px' }}
              />
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
              <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#1e40af', fontWeight: 'bold' }}>
                Юридический подвал сайта (Реквизиты)
              </h5>
              <textarea
                className="form-input"
                rows={3}
                value={currentDomain.footer_text || ''}
                onChange={e => updateCurrentDomain('footer_text', e.target.value)}
                style={{ width: '100%', fontSize: '12px' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Page Create/Edit */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '640px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '17px' }}>{editingPageId ? 'Редактирование страницы' : 'Создать новую страницу'}</h4>
            <form onSubmit={handleSavePage} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label" style={{ fontWeight: '600' }}>Название страницы *</label>
                <input type="text" className="form-input" value={pageForm.title} onChange={e => setPageForm({ ...pageForm, title: e.target.value })} required style={{ width: '100%' }} />
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: '600' }}>Slug (латиницей или / для главной) *</label>
                <input type="text" className="form-input" value={pageForm.slug} onChange={e => setPageForm({ ...pageForm, slug: e.target.value })} placeholder="brother или /" required style={{ width: '100%', fontFamily: 'monospace' }} />
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: '600' }}>Привязка кассового шлюза</label>
                <select className="form-input" value={pageForm.script_choice} onChange={e => setPageForm({ ...pageForm, script_choice: Number(e.target.value) })} style={{ width: '100%' }}>
                  {(currentDomain.gateways || []).map(gw => (
                    <option key={gw.id} value={gw.id}>{gw.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: '600' }}>Код виджета / Iframe</label>
                <textarea className="form-input" rows={4} value={pageForm.iframe_code} onChange={e => setPageForm({ ...pageForm, iframe_code: e.target.value })} style={{ width: '100%', fontFamily: 'monospace', fontSize: '12px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer' }}>Отмена</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', borderRadius: '8px' }}>Сохранить страницу</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
