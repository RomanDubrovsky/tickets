import React, { useState, useEffect } from 'react';
import { Globe, ExternalLink, Settings, Check, Layers, Code, Palette, FileText, Plus, Edit3, Trash2, X, RefreshCw } from 'lucide-react';
import { API_BASE } from '../db';

export const STANDARD_TICKETLAND_GATEWAYS = [
  {
    id: 3,
    name: 'ИП Юницына Валерия Николаевна (Рок Хит Нева)',
    code: '<script type="text/javascript">\n    var TLConf = {\n        accessHash: "389069140c1ca808d0da0b0007a4fe33",\n        version: 1,\n    };\n</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>'
  },
  {
    id: 4,
    name: 'ИП Юницына Валерия Николаевна (Акватория)',
    code: '<script type="text/javascript">\n    var TLConf = {\n        accessHash: "DH6tIrnYRIsz8Gc3kudLy8b6qM2Iwdm1",\n        version: 1,\n    };\n</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>'
  },
  {
    id: 1,
    name: 'ООО «Морские корабли» (Рок Хит Нева)',
    code: '<script type="text/javascript">\n    var TLConf = {\n        accessHash: "0b2b641d60f7f9443e566d47c89d208f",\n        version: 1,\n    };\n</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>'
  },
  {
    id: 2,
    name: 'ООО «Морские корабли» (Акватория)',
    code: '<script type="text/javascript">\n    var TLConf = {\n        accessHash: "8c8d43b735f10cc868462481cd0b51d5",\n        version: 1,\n    };\n</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>'
  }
];

export const ensureStandardGateways = (gateways) => {
  if (!Array.isArray(gateways) || gateways.length === 0) {
    return [...STANDARD_TICKETLAND_GATEWAYS];
  }
  const result = [...gateways];
  STANDARD_TICKETLAND_GATEWAYS.forEach(stdGw => {
    const idx = result.findIndex(g => g.id === stdGw.id);
    if (idx === -1) {
      result.push(stdGw);
    } else if (!result[idx].code || result[idx].code.trim() === '' || (result[idx].name && (result[idx].name.includes('Резерв') || result[idx].name.startsWith('Юрлицо') || result[idx].name.startsWith('Кассовый шлюз')))) {
      result[idx] = { ...result[idx], name: stdGw.name, code: stdGw.code };
    }
  });
  return result;
};

const DEFAULT_DOMAINS = [
  {
    id: 2,
    name: 'rockhitneva.ru',
    title: 'Рок Хит Нева — Рок-круизы по Неве',
    primary_color: '#e55f2e',
    logo_url: 'https://rockhitneva.ru/wp-content/uploads/2024/03/logo1.png',
    bg_image_url: '',
    global_scripts: '<!-- Yandex.Metrika counter -->\n<script type="text/javascript">\n(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");\nym(97638164, "init", {clickmap:true,trackLinks:true,accurateTrackBounce:true,ecommerce:"dataLayer"});\n</script>\n<noscript><div><img src="https://mc.yandex.ru/watch/97638164" style="position:absolute; left:-9999px;" alt="" /></div></noscript>',
    script_1_name: 'ООО «Морские корабли» (Рок Хит Нева)',
    script_1_code: '<script>var TLConf = { accessHash: "0b2b641d60f7f9443e566d47c89d208f", version: 1 };</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>',
    script_2_name: 'ИП Юницына Валерия Николаевна (Рок Хит Нева)',
    script_2_code: '<script>var TLConf = { accessHash: "389069140c1ca808d0da0b0007a4fe33", version: 1 };</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>',
    gateways: [...STANDARD_TICKETLAND_GATEWAYS],
    footer_text: 'ООО "МОРСКИЕ КОРАБЛИ"\nИНН: 7814848882 | КПП: 781401001 | ОГРН: 1257800013459\nст. м. Спортивная, г. Санкт-Петербург, Набережная Макарова, дом 20',
    cloud_url: 'https://rockhitneva.ru/',
    pages: [
      {
        id: 3,
        title: 'Главная афиша',
        slug: '/',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/JHgCdar1f2RgfwwTnasWr9ScZXK_hHlR/"></div>',
        url: 'https://rockhitneva.ru/'
      },
      {
        id: 101,
        title: 'Договор оферты',
        slug: 'оферта',
        script_choice: 1,
        iframe_code: '',
        url: 'https://rockhitneva.ru/оферта/'
      },
      {
        id: 102,
        title: 'Политика обработки персональных данных (PR)',
        slug: 'pr',
        script_choice: 1,
        iframe_code: '',
        url: 'https://rockhitneva.ru/pr/'
      },
      {
        id: 103,
        title: 'Правила заказа билетов',
        slug: 'правила-заказа-билетов',
        script_choice: 1,
        iframe_code: '',
        url: 'https://rockhitneva.ru/правила-заказа-билетов/'
      },
      {
        id: 2,
        title: 'Брат (Саундтреки к фильму)',
        slug: 'brother',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/brother/"></div>',
        url: 'https://rockhitneva.ru/brother/'
      },
      {
        id: 3,
        title: 'Громыка',
        slug: 'gromyka',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/gromyka/"></div>',
        url: 'https://rockhitneva.ru/gromyka/'
      },
      {
        id: 4,
        title: 'JOE COCKER Tribute',
        slug: 'joe-cocker',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/joe-cocker/"></div>',
        url: 'https://rockhitneva.ru/joe-cocker/'
      },
      {
        id: 5,
        title: 'STING & The Police',
        slug: 'sting',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/sting/"></div>',
        url: 'https://rockhitneva.ru/sting/'
      },
      {
        id: 6,
        title: 'Виктор Цой & Кино',
        slug: 'viktortsoy',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/viktortsoy/"></div>',
        url: 'https://rockhitneva.ru/viktortsoy/'
      },
      {
        id: 7,
        title: 'Рок под разводными мостами',
        slug: 'rock-bridges',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/rock-bridges/"></div>',
        url: 'https://rockhitneva.ru/rock-bridges/'
      },
      {
        id: 8,
        title: 'Led Zeppelin Tribute',
        slug: 'led-zeppelin-tribute',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/led-zeppelin/"></div>',
        url: 'https://rockhitneva.ru/led-zeppelin-tribute/'
      },
      {
        id: 9,
        title: 'RHCP Tribute Show',
        slug: 'red-hot-chili-peppers',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/rhcp/"></div>',
        url: 'https://rockhitneva.ru/red-hot-chili-peppers/'
      },
      {
        id: 10,
        title: 'Smoke on the Water',
        slug: 'smoke-on-the-water',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/smoke-on-the-water/"></div>',
        url: 'https://rockhitneva.ru/smoke-on-the-water/'
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
    script_1_name: 'ООО «Морские корабли» (Акватория)',
    script_1_code: '<script>var TLConf = { accessHash: "8c8d43b735f10cc868462481cd0b51d5", version: 1 };</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>',
    script_2_name: 'ИП Юницына Валерия Николаевна (Акватория)',
    script_2_code: '<script>var TLConf = { accessHash: "DH6tIrnYRIsz8Gc3kudLy8b6qM2Iwdm1", version: 1 };</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>',
    gateways: [...STANDARD_TICKETLAND_GATEWAYS],
    footer_text: 'ИП Юницына Валерия Николаевна\nИНН: 470411807452 | ОГРН: 322470400014155\nСанкт-Петербург, Причал Набережная Макарова, 34',
    cloud_url: 'https://aquasound.club/',
    pages: [
      {
        id: 23,
        title: 'Главная страница',
        slug: '/',
        script_choice: 2,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/drugoe/akvatoriya-zvuka-angliyskaya-nab-28"></div>',
        url: 'https://aquasound.club/'
      },
      {
        id: 111,
        title: 'Договор оферты',
        slug: 'оферта',
        script_choice: 1,
        iframe_code: '',
        url: 'https://aquasound.club/оферта/'
      },
      {
        id: 112,
        title: 'Политика обработки персональных данных (PR)',
        slug: 'pr',
        script_choice: 1,
        iframe_code: '',
        url: 'https://aquasound.club/pr/'
      },
      {
        id: 113,
        title: 'Правила заказа билетов',
        slug: 'правила-заказа-билетов',
        script_choice: 1,
        iframe_code: '',
        url: 'https://aquasound.club/правила-заказа-билетов/'
      },
      {
        id: 12,
        title: 'Большой круг по Неве',
        slug: 'bigring',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/bigring/"></div>',
        url: 'https://aquasound.club/bigring/'
      },
      {
        id: 13,
        title: 'Разводные мосты',
        slug: 'bridges',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/bridges/"></div>',
        url: 'https://aquasound.club/bridges/'
      },
      {
        id: 14,
        title: 'Joe Cocker на воде',
        slug: 'joe-cocker-tribute',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/joe-cocker-tribute/"></div>',
        url: 'https://aquasound.club/joe-cocker-tribute/'
      }
    ]
  },
  {
    id: 6,
    name: 'nevaconcert.ru',
    title: 'Нева-концерт — Музыкальный теплоход',
    primary_color: '#446084',
    logo_url: 'https://nevaconcert.ru/wp-content/uploads/2024/10/Sloy_0.png',
    bg_image_url: '',
    global_scripts: '<!-- Yandex.Metrika counter -->\n<script type="text/javascript">\n(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");\nym(97637990, "init", {clickmap:true,trackLinks:true,accurateTrackBounce:true});\n</script>\n<noscript><div><img src="https://mc.yandex.ru/watch/97637990" style="position:absolute; left:-9999px;" alt="" /></div></noscript>',
    script_1_name: 'ООО «Морские корабли» (Рок Хит Нева)',
    script_1_code: '<script>var TLConf = { accessHash: "0b2b641d60f7f9443e566d47c89d208f", version: 1 };</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>',
    script_2_name: 'ИП Юницына Валерия Николаевна (Рок Хит Нева)',
    script_2_code: '<script>var TLConf = { accessHash: "389069140c1ca808d0da0b0007a4fe33", version: 1 };</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>',
    gateways: [...STANDARD_TICKETLAND_GATEWAYS],
    footer_text: 'ИП Куренной Владислав Юрьевич\nИНН: 780230933072\nКонтакты: concertneva@gmail.com, +7 (911) 928-80-77\nПричалы: Английская набережная 28',
    cloud_url: 'https://nevaconcert.ru/',
    pages: [
      {
        id: 27,
        title: 'Главная страница (Лендинг)',
        slug: '/',
        script_choice: 1,
        iframe_code: '',
        url: 'https://nevaconcert.ru/'
      },
      {
        id: 22,
        title: 'Договор оферты',
        slug: 'оферта',
        script_choice: 1,
        iframe_code: '',
        url: 'https://nevaconcert.ru/оферта/'
      },
      {
        id: 23,
        title: 'Политика обработки персональных данных (PR)',
        slug: 'pr',
        script_choice: 1,
        iframe_code: '',
        url: 'https://nevaconcert.ru/pr/'
      },
      {
        id: 24,
        title: 'Правила заказа билетов',
        slug: 'правила-заказа-билетов',
        script_choice: 1,
        iframe_code: '',
        url: 'https://nevaconcert.ru/правила-заказа-билетов/'
      }
    ]
  },
  {
    id: 7,
    name: 'gradnaneve.ru',
    title: 'Град на Неве — Прогулки в тёплом салоне теплохода',
    primary_color: '#446084',
    logo_url: 'https://gradnaneve.ru/wp-content/uploads/2024/05/Grad_na_neve_logo.png',
    bg_image_url: '',
    global_scripts: '',
    script_1_name: 'ООО «Морские корабли» (Рок Хит Нева)',
    script_1_code: '<script>var TLConf = { accessHash: "0b2b641d60f7f9443e566d47c89d208f", version: 1 };</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>',
    script_2_name: 'ИП Юницына Валерия Николаевна (Рок Хит Нева)',
    script_2_code: '<script>var TLConf = { accessHash: "389069140c1ca808d0da0b0007a4fe33", version: 1 };</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>',
    gateways: [...STANDARD_TICKETLAND_GATEWAYS],
    footer_text: 'ИП Куренной Владислав Юрьевич\nИНН: 780230933072\nКонтакты: admin@gradnaneve.ru, +7 (911) 928-80-77\nПричал: Английская набережная, 28',
    cloud_url: 'https://gradnaneve.ru/',
    pages: [
      {
        id: 32,
        title: 'Главная страница (Лендинг)',
        slug: '/',
        script_choice: 1,
        iframe_code: '',
        url: 'https://gradnaneve.ru/'
      },
      {
        id: 32,
        title: 'Договор оферты',
        slug: 'оферта',
        script_choice: 1,
        iframe_code: '',
        url: 'https://gradnaneve.ru/оферта/'
      },
      {
        id: 33,
        title: 'Политика обработки персональных данных (PR)',
        slug: 'pr',
        script_choice: 1,
        iframe_code: '',
        url: 'https://gradnaneve.ru/pr/'
      },
      {
        id: 34,
        title: 'Правила заказа билетов',
        slug: 'правила-заказа-билетов',
        script_choice: 1,
        iframe_code: '',
        url: 'https://gradnaneve.ru/правила-заказа-билетов/'
      }
    ]
  }
];

export { DEFAULT_DOMAINS };

export const getGatewayToken = (code) => {
  if (!code) return '';
  const match = code.match(/accessHash:\s*["']([^"']+)["']/i);
  return match ? match[1] : '';
};

// Гарантируем, что главная страница домена всегда существует и ВСЕГДА стоит на 1-м месте в списке
export const getOrderedPages = (domain) => {
  if (!domain) return [];
  const pages = domain.pages ? [...domain.pages] : [];

  // Ищем главную страницу (slug === '/' или пустой)
  const homeIdx = pages.findIndex(p => p.slug === '/' || !p.slug || p.slug === '');
  let homePage = null;

  if (homeIdx !== -1) {
    homePage = pages.splice(homeIdx, 1)[0];
  } else {
    // Дефолтная главная страница для домена, если ее еще нет в списке
    const defaultIframe = domain.id === 2 
      ? '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/JHgCdar1f2RgfwwTnasWr9ScZXK_hHlR/"></div>'
      : (domain.id === 1 ? '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/drugoe/akvatoriya-zvuka-angliyskaya-nab-28"></div>' : '');

    homePage = {
      id: domain.id === 2 ? 3 : (domain.id === 1 ? 23 : (domain.id === 6 ? 27 : (domain.id === 7 ? 32 : Date.now()))),
      title: domain.title || `Главная страница (${domain.name})`,
      slug: '/',
      script_choice: domain.id === 1 ? 2 : 1,
      iframe_code: defaultIframe,
      url: domain.cloud_url || `https://${domain.name}/`
    };
  }

  const normalizedHome = {
    ...homePage,
    slug: '/',
    url: domain.cloud_url || `https://${domain.name}/`,
    isHome: true
  };

  // Все остальные страницы сортируем по id DESC
  const otherPages = pages.sort((a, b) => (b.id || 0) - (a.id || 0));

  return [normalizedHome, ...otherPages];
};

export default function SitesAdmin({ initialDomainId, initialSelectedPageId }) {
  const [domains, setDomains] = useState(() => {
    const saved = localStorage.getItem('cms_domains_v8');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(d => ({ ...d, gateways: ensureStandardGateways(d.gateways), pages: getOrderedPages(d) }));
        }
      } catch (e) {
        console.error(e);
      }
    }
    const oldSaved = localStorage.getItem('cms_domains_v7') || localStorage.getItem('cms_domains_v6');
    if (oldSaved) {
      try {
        const parsedOld = JSON.parse(oldSaved);
        if (Array.isArray(parsedOld) && parsedOld.length > 0) {
          const updated = parsedOld.map(d => ({ ...d, gateways: ensureStandardGateways(d.gateways), pages: getOrderedPages(d) }));
          localStorage.setItem('cms_domains_v8', JSON.stringify(updated));
          return updated;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_DOMAINS.map(d => ({ ...d, gateways: ensureStandardGateways(d.gateways), pages: getOrderedPages(d) }));
  });

  const [selectedDomainId, setSelectedDomainId] = useState(initialDomainId || 2); // 2 = rockhitneva.ru

  useEffect(() => {
    if (initialDomainId) {
      setSelectedDomainId(initialDomainId);
    }
  }, [initialDomainId]);

  const fetchDomainsFromApi = async () => {
    try {
      const res = await fetch(`${API_BASE}/cms/domains`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.domains && data.domains.length > 0) {
          const ordered = data.domains.map(d => ({
            ...d,
            gateways: ensureStandardGateways(d.gateways),
            pages: getOrderedPages(d)
          }));
          setDomains(ordered);
          localStorage.setItem('cms_domains_v8', JSON.stringify(ordered));
        }
      }
    } catch (err) {
      console.warn('CMS API load fallback to local storage:', err);
    }
  };

  useEffect(() => {
    fetchDomainsFromApi();
  }, []);

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
    localStorage.setItem('cms_domains_v8', JSON.stringify(newDomains));
    localStorage.setItem('cms_domains_v7', JSON.stringify(newDomains));
    localStorage.setItem('cms_domains_v6', JSON.stringify(newDomains));
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
      script_choice: (currentDomain && currentDomain.id === 1) ? 2 : 1,
      iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/..."></div>'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (page) => {
    const isHome = page.slug === '/' || !page.slug || page.isHome;
    setEditingPageId(page.id);
    setPageForm({
      title: page.title || '',
      slug: isHome ? '/' : (page.slug || ''),
      script_choice: page.script_choice || 1,
      iframe_code: page.iframe_code || ''
    });
    setIsModalOpen(true);
  };

  const handleSavePage = async (e) => {
    e.preventDefault();
    if (!pageForm.title.trim()) {
      alert('Введите название страницы');
      return;
    }

    let cleanSlug = pageForm.slug.trim();
    const isHome = !cleanSlug || cleanSlug === '/';
    if (isHome) {
      cleanSlug = '/';
    } else {
      cleanSlug = cleanSlug.replace(/^\/+|\/+$/g, '').toLowerCase();
    }

    const pageUrl = cleanSlug === '/'
      ? `https://${currentDomain.name}/`
      : `https://${currentDomain.name}/${cleanSlug}/`;

    let updatedPages = [...(currentDomain.pages || [])];
    const isEditingHome = isHome || (editingPageId && updatedPages.find(p => p.id === editingPageId && (p.slug === '/' || !p.slug)));

    // Точный реальный id главной страницы из БД
    let effectivePageId = editingPageId;
    if (isEditingHome && (typeof editingPageId === 'string' || !editingPageId || editingPageId > 1000000000)) {
      if (currentDomain.id === 2) effectivePageId = 3;
      else if (currentDomain.id === 1) effectivePageId = 23;
      else if (currentDomain.id === 6) effectivePageId = 27;
      else if (currentDomain.id === 7) effectivePageId = 32;
    }

    const pagePayload = {
      id: effectivePageId,
      domain_id: currentDomain.id,
      domain_name: currentDomain.name,
      title: pageForm.title,
      slug: cleanSlug,
      script_choice: Number(pageForm.script_choice),
      iframe_code: pageForm.iframe_code
    };

    if (editingPageId) {
      let pageFound = false;
      updatedPages = updatedPages.map(pg => {
        const isThisHome = isEditingHome && (pg.slug === '/' || !pg.slug || pg.id === editingPageId);
        if (pg.id === editingPageId || isThisHome) {
          pageFound = true;
          return {
            ...pg,
            id: effectivePageId || pg.id,
            title: pageForm.title,
            slug: cleanSlug,
            script_choice: Number(pageForm.script_choice),
            iframe_code: pageForm.iframe_code,
            url: pageUrl
          };
        }
        return pg;
      });

      if (!pageFound && isEditingHome) {
        updatedPages.unshift({
          id: effectivePageId || Date.now(),
          title: pageForm.title,
          slug: '/',
          script_choice: Number(pageForm.script_choice),
          iframe_code: pageForm.iframe_code,
          url: pageUrl
        });
      }

    } else {
      const newPage = {
        id: Date.now(),
        title: pageForm.title,
        slug: cleanSlug,
        script_choice: Number(pageForm.script_choice),
        iframe_code: pageForm.iframe_code,
        url: pageUrl
      };
      if (isHome) {
        updatedPages.unshift(newPage);
      } else {
        const homeIdx = updatedPages.findIndex(p => p.slug === '/' || !p.slug);
        if (homeIdx !== -1) {
          updatedPages.splice(homeIdx + 1, 0, newPage);
        } else {
          updatedPages.unshift(newPage);
        }
      }
    }

    const finalOrderedPages = getOrderedPages({ ...currentDomain, pages: updatedPages });
    const updatedDomains = domains.map(dom => dom.id === currentDomain.id ? { ...dom, pages: finalOrderedPages } : dom);
    saveDomainsToStorage(updatedDomains);
    setIsModalOpen(false);

    // Call live server CMS API to compile HTML and deploy to Yandex Object Storage S3
    try {
      const res = await fetch(`${API_BASE}/cms/pages/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pagePayload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(`Страница "${pageForm.title}" успешно создана и опубликована в облаке S3!`);
        fetchDomainsFromApi();
      } else {
        alert('Ошибка при публикации страницы в облаке S3: ' + (data.error || 'Неизвестная ошибка'));
      }
    } catch (err) {
      console.error('Failed to sync page with live server:', err);
      showNotification(`Страница сохранена локально (ошибка соединения с сервером: ${err.message})`);
    }
  };

  const handleDeletePage = async (pageId, pageTitle, slug) => {
    if (!slug || slug === '/') {
      alert('Главную страницу сайта нельзя удалить.');
      return;
    }
    if (window.confirm(`Удалить страницу "${pageTitle}"?`)) {
      const updatedPages = currentDomain.pages.filter(pg => pg.id !== pageId);
      const finalOrdered = getOrderedPages({ ...currentDomain, pages: updatedPages });
      const updatedDomains = domains.map(dom => dom.id === currentDomain.id ? { ...dom, pages: finalOrdered } : dom);
      saveDomainsToStorage(updatedDomains);

      try {
        const res = await fetch(`${API_BASE}/cms/pages/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: pageId, domain_id: currentDomain.id, slug })
        });
        const data = await res.json();
        if (data.success) {
          showNotification(`Страница "${pageTitle}" удалена из базы и хранилища S3`);
        } else {
          showNotification(`Страница "${pageTitle}" удалена`);
        }
        fetchDomainsFromApi();
      } catch (err) {
        console.error('Failed to delete on live server:', err);
        showNotification(`Страница "${pageTitle}" удалена локально`);
      }
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
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: isSelected ? '#eff6ff' : '#f8fafc',
                  border: isSelected ? '1.5px solid #3b82f6' : '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  boxShadow: isSelected ? '0 2px 4px rgba(59, 130, 246, 0.1)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: isSelected ? 'bold' : '600', color: isSelected ? '#1d4ed8' : '#334155', fontSize: '14px' }}>
                    {dom.name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', background: isSelected ? '#bfdbfe' : '#e2e8f0', padding: '2px 7px', borderRadius: '10px', color: '#1e293b', fontWeight: 'bold' }}>
                      {dom.pages ? dom.pages.length : 0} стр.
                    </span>
                    <a
                      href={dom.cloud_url || `https://${dom.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title={`Открыть сайт ${dom.name}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px 7px',
                        background: isSelected ? '#2563eb' : '#e2e8f0',
                        color: isSelected ? '#ffffff' : '#475569',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontSize: '11px',
                        fontWeight: '600',
                        transition: 'all 0.15s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#1d4ed8';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isSelected ? '#2563eb' : '#e2e8f0';
                        e.currentTarget.style.color = isSelected ? '#ffffff' : '#475569';
                      }}
                    >
                      <ExternalLink size={13} style={{ marginRight: '3px' }} /> Открыть
                    </a>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {dom.title}
                </div>
              </div>
            );
          })}
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
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    fetchDomainsFromApi();
                    showNotification('Синхронизация данных с сервером выполнена!');
                  }}
                  title="Синхронизировать с сервером"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', fontSize: '13px', borderRadius: '8px', background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer', color: '#334155' }}
                >
                  <RefreshCw size={14} /> Синхронизировать
                </button>
                <button
                  onClick={handleOpenCreateModal}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '13px', fontWeight: 'bold', borderRadius: '8px' }}
                >
                  <Plus size={16} /> Создать страницу
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {getOrderedPages(currentDomain).map(pg => {
                const isHome = pg.slug === '/' || !pg.slug || pg.isHome;
                const currentGateways = ensureStandardGateways(currentDomain.gateways);
                const foundGw = currentGateways.find(g => g.id === pg.script_choice) || STANDARD_TICKETLAND_GATEWAYS.find(g => g.id === pg.script_choice);
                const gwToken = foundGw ? getGatewayToken(foundGw.code) : '';
                const scriptName = foundGw ? `${foundGw.name}${gwToken ? ` — ${gwToken}` : ''}` : 'Кассовый шлюз';

                return (
                  <div
                    key={pg.id || (isHome ? 'home' : pg.slug)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: isHome ? '16px 18px' : '14px 16px',
                      background: isHome ? 'linear-gradient(to right, #f0f7ff, #ffffff)' : '#ffffff',
                      border: isHome ? '1.5px solid #60a5fa' : '1px solid #e2e8f0',
                      borderRadius: '10px',
                      boxShadow: isHome ? '0 2px 8px rgba(37, 99, 235, 0.08)' : '0 1px 3px rgba(0,0,0,0.03)',
                      gap: '12px',
                      flexWrap: 'wrap',
                      position: 'relative'
                    }}
                  >
                    <div style={{ flex: '1 1 280px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 'bold', fontSize: isHome ? '15px' : '14px', color: isHome ? '#1e3a8a' : '#0f172a' }}>
                          {pg.title}
                        </span>
                        {isHome ? (
                          <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            ⭐ Главная страница
                          </span>
                        ) : null}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', flexWrap: 'wrap', fontSize: '12px' }}>
                        <div>
                          Путь: <code style={{ color: isHome ? '#16a34a' : '#2563eb', background: isHome ? '#f0fdf4' : '#eff6ff', border: isHome ? '1px solid #bbf7d0' : 'none', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                            {isHome ? '/ (Главная)' : `/${pg.slug}`}
                          </code>
                        </div>
                        <div style={{ color: '#475569' }}>
                          Касса: <strong style={{ color: '#1e293b' }}>{scriptName}</strong>
                        </div>
                        {isHome && (
                          <div style={{ color: '#059669', fontSize: '11px', fontWeight: '500' }}>
                            ✓ Всегда наверху списка
                          </div>
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
                          background: isHome ? '#eff6ff' : '#f8fafc',
                          color: isHome ? '#1d4ed8' : '#334155',
                          border: isHome ? '1px solid #93c5fd' : '1px solid #cbd5e1',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        <Edit3 size={14} color="#2563eb" /> Редактировать
                      </button>

                      <a
                        href={pg.url || `https://${currentDomain.name}/`}
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

                      {!isHome ? (
                        <button
                          onClick={() => handleDeletePage(pg.id, pg.title, pg.slug)}
                          title="Удалить страницу"
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
                      ) : (
                        <div
                          title="Главную страницу нельзя удалить"
                          style={{
                            padding: '6px 10px',
                            color: '#cbd5e1',
                            cursor: 'not-allowed',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Trash2 size={14} style={{ opacity: 0.3 }} />
                        </div>
                      )}
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
                {ensureStandardGateways(currentDomain.gateways).map((gw, idx) => (
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ margin: 0, fontSize: '17px', color: '#0f172a', fontWeight: 'bold' }}>
                {pageForm.slug === '/' ? '⭐ Редактирование главной страницы' : (editingPageId ? 'Редактирование страницы' : 'Создать новую страницу')}
              </h4>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSavePage} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label" style={{ fontWeight: '600' }}>Название страницы *</label>
                <input
                  type="text"
                  className="form-input"
                  value={pageForm.title}
                  onChange={e => setPageForm({ ...pageForm, title: e.target.value })}
                  placeholder={pageForm.slug === '/' ? 'Главная афиша сайта' : 'Название страницы'}
                  required
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: '600' }}>Slug (URL адрес страницы) *</label>
                <input
                  type="text"
                  className="form-input"
                  value={pageForm.slug}
                  disabled={pageForm.slug === '/'}
                  onChange={e => setPageForm({ ...pageForm, slug: e.target.value })}
                  placeholder="brother или /"
                  required
                  style={{
                    width: '100%',
                    fontFamily: 'monospace',
                    background: pageForm.slug === '/' ? '#f8fafc' : '#ffffff',
                    color: pageForm.slug === '/' ? '#475569' : '#0f172a',
                    cursor: pageForm.slug === '/' ? 'not-allowed' : 'text'
                  }}
                />
                {pageForm.slug === '/' ? (
                  <div style={{ fontSize: '12px', color: '#059669', marginTop: '4px', fontWeight: '500' }}>
                    ⭐ Корневой URL главной страницы: <code>https://{currentDomain.name}/</code> (slug зафиксирован как <code>/</code>)
                  </div>
                ) : (
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    URL страницы будет: <code>https://{currentDomain.name}/{pageForm.slug || 'slug'}/</code>
                  </div>
                )}
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: '600' }}>Привязка кассового шлюза (Юрлицо Ticketland)</label>
                <select
                  className="form-input"
                  value={pageForm.script_choice}
                  onChange={e => setPageForm({ ...pageForm, script_choice: Number(e.target.value) })}
                  style={{ width: '100%' }}
                >
                  {ensureStandardGateways(currentDomain.gateways).map(gw => {
                    const token = getGatewayToken(gw.code);
                    return (
                      <option key={gw.id} value={gw.id}>
                        {gw.name}{token ? ` — ${token}` : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: '600' }}>Код виджета / Iframe Ticketland</label>
                <textarea
                  className="form-input"
                  rows={5}
                  value={pageForm.iframe_code}
                  onChange={e => setPageForm({ ...pageForm, iframe_code: e.target.value })}
                  placeholder='<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/..."></div>'
                  style={{ width: '100%', fontFamily: 'monospace', fontSize: '12px' }}
                />
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  {pageForm.slug === '/'
                    ? 'Виджет будет встроен непосредственно в контейнер билетов на главной странице сайта.'
                    : 'Виджет или HTML-код, который выводится на данной внутренней странице.'}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer' }}>Отмена</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold' }}>
                  {pageForm.slug === '/' ? 'Сохранить главную страницу' : 'Сохранить страницу'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
