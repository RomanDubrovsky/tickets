import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const STANDARD_TICKETLAND_GATEWAYS = [
  {
    id: 1,
    name: 'ООО «Морские корабли» (Рок Хит Нева)',
    code: '<script type="text/javascript">\n    var TLConf = {\n        accessHash: "0b2b641d60f7f9443e566d47c89d208f",\n        version: 1,\n    };\n</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>'
  },
  {
    id: 2,
    name: 'ООО «Морские корабли» (Акватория)',
    code: '<script type="text/javascript">\n    var TLConf = {\n        accessHash: "8c8d43b735f10cc868462481cd0b51d5",\n        version: 1,\n    };\n</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>'
  },
  {
    id: 3,
    name: 'ИП Юницына Валерия Николаевна (Рок Хит Нева)',
    code: '<script type="text/javascript">\n    var TLConf = {\n        accessHash: "389069140c1ca808d0da0b0007a4fe33",\n        version: 1,\n    };\n</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>'
  },
  {
    id: 4,
    name: 'ИП Юницына Валерия Николаевна (Акватория)',
    code: '<script type="text/javascript">\n    var TLConf = {\n        accessHash: "DH6tIrnYRIsz8Gc3kudLy8b6qM2Iwdm1",\n        version: 1,\n    };\n</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>'
  }
];

const TEMPLATES = {
  flatsome: path.join(__dirname, 'templates', 'flatsome.html'),
  flatsome_event: path.join(__dirname, 'templates', 'flatsome_event.html'),
  aqua_main: path.join(__dirname, 'templates', 'aqua_main.html'),
  aqua_event: path.join(__dirname, 'templates', 'aqua_event.html'),
  nevaconcert_main: path.join(__dirname, 'templates', 'nevaconcert_main.html'),
  nevaconcert_event: path.join(__dirname, 'templates', 'nevaconcert_event.html'),
  gradnaneve_main: path.join(__dirname, 'templates', 'gradnaneve_main.html'),
  gradnaneve_event: path.join(__dirname, 'templates', 'gradnaneve_event.html'),
  spectral: path.join(__dirname, 'templates', 'base.html'),
  spectral_event: path.join(__dirname, 'templates', 'base_event.html')
};

export function renderPageHtml(domain, page) {
  const isHomePage = !page.slug || page.slug === '/' || page.slug === '';

  let templateFile;
  const domName = domain.name || '';
  if (domName.includes('nevaconcert')) {
    templateFile = isHomePage ? TEMPLATES.nevaconcert_main : TEMPLATES.nevaconcert_event;
  } else if (domName.includes('gradnaneve')) {
    templateFile = isHomePage ? TEMPLATES.gradnaneve_main : TEMPLATES.gradnaneve_event;
  } else if (domName.includes('aquasound')) {
    templateFile = isHomePage ? TEMPLATES.aqua_main : TEMPLATES.aqua_event;
  } else if (domName.includes('rockhit') || domain.template === 'flatsome') {
    templateFile = isHomePage ? TEMPLATES.flatsome : TEMPLATES.flatsome_event;
  } else {
    templateFile = isHomePage ? TEMPLATES.spectral : TEMPLATES.spectral_event;
  }

  if (!fs.existsSync(templateFile)) {
    throw new Error(`Шаблон не найден: ${templateFile}`);
  }

  let html = fs.readFileSync(templateFile, 'utf-8');
  const primaryColor = domain.primary_color || (domName.includes('rockhit') ? '#e55f2e' : '#446084');
  let contentToInject = page.iframe_code || '';

  html = html.replace(/{{TITLE}}/g, page.title || 'Билеты на теплоход');
  html = html.replace(/{{IFRAME_CODE}}/g, contentToInject);

  const partnerTrackerScript = `
  <!-- PARTNER & PROMO ATTRIBUTION -->
  <script>
  (function() {
      try {
          var params = new URLSearchParams(window.location.search);
          var promo = params.get('promo') || params.get('agent') || params.get('ref');
          if (promo) {
              localStorage.setItem('ship_partner_promo', promo.toUpperCase());
          }
          var storedPromo = localStorage.getItem('ship_partner_promo');
          if (storedPromo) {
              document.querySelectorAll('a.partner-link, a[href^="/"]').forEach(function(el) {
                  var href = el.getAttribute('href');
                  if (href && !href.includes('promo=')) {
                      el.setAttribute('href', href + (href.includes('?') ? '&' : '?') + 'promo=' + encodeURIComponent(storedPromo));
                  }
              });
          }
      } catch(e) {}
  })();
  </script>
  `;

  const combinedGlobalScripts = (domain.global_scripts || '') + '\n' + partnerTrackerScript;
  html = html.replace(/{{GLOBAL_SCRIPTS}}/g, combinedGlobalScripts);
  html = html.replace(/{{PRIMARY_COLOR}}/g, primaryColor);

  let logoHtml = '';
  if (domain.logo_url) {
    logoHtml = `<img src="${domain.logo_url}" alt="Logo" class="site-logo">`;
  }
  html = html.replace(/{{LOGO_HTML}}/g, logoHtml);

  let bgStyle = '';
  if (domain.bg_image_url) {
    bgStyle = `background-image: url('${domain.bg_image_url}'); background-size: cover; background-attachment: fixed; background-position: center;`;
  }
  html = html.replace(/{{BG_STYLE}}/g, bgStyle);

  // Ticket script / Gateway resolution
  let ticketScript = '';
  let gateways = [];
  if (domain.gateways_json) {
    try {
      gateways = typeof domain.gateways_json === 'string' ? JSON.parse(domain.gateways_json) : domain.gateways_json;
    } catch (e) {}
  }
  if (!Array.isArray(gateways) || gateways.length === 0) {
    gateways = STANDARD_TICKETLAND_GATEWAYS;
  }

  const choiceId = (page.script_choice !== undefined && page.script_choice !== null) ? parseInt(page.script_choice, 10) : 1;
  let selectedGateway = gateways.find(g => g.id === choiceId) || STANDARD_TICKETLAND_GATEWAYS.find(g => g.id === choiceId) || gateways[0];
  if (selectedGateway && selectedGateway.code) {
    ticketScript = selectedGateway.code;
  } else {
    ticketScript = domain.script_1_code || '';
  }
  html = html.replace(/{{TICKET_SCRIPT}}/g, ticketScript);
  html = html.replace(/{{FOOTER_TEXT}}/g, domain.footer_text || '');

  // Static prefix
  const staticPrefix = '/static';
  html = html.replace(/{{STATIC_PREFIX}}/g, staticPrefix);

  return html;
}
