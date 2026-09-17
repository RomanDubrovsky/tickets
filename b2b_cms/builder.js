const fs = require('fs');
const path = require('path');
const db = require('./db');

const TEMPLATES = {
    flatsome: path.join(__dirname, 'templates', 'flatsome.html'),
    flatsome_event: path.join(__dirname, 'templates', 'flatsome_event.html'),
    aqua_main: path.join(__dirname, 'templates', 'aqua_main.html'),
    aqua_event: path.join(__dirname, 'templates', 'aqua_event.html'),
    spectral: path.join(__dirname, 'templates', 'base.html'),
    spectral_event: path.join(__dirname, 'templates', 'base_event.html')
};

const DIST_DIR = path.join(__dirname, 'dist');

if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
}

async function getDomainData(domainId) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM domains WHERE id = ?", [domainId], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function formatDateRu(dateStr) {
    if (!dateStr) return '';
    try {
        const parts = dateStr.split(' ');
        const datePart = parts[0];
        const timePart = parts[1] || '';
        
        const d = new Date(datePart);
        if (isNaN(d.getTime())) return dateStr;
        
        const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
        const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        
        const day = d.getDate();
        const month = months[d.getMonth()];
        const dayOfWeek = days[d.getDay()];
        
        return `${day} ${month} (${dayOfWeek})${timePart ? ' ' + timePart : ''}`;
    } catch(e) {
        return dateStr;
    }
}

async function generateAfishaHtml(domainId, primaryColor) {
    return new Promise((resolve, reject) => {
        db.all(`
            SELECT events.*, venues.name as venue_name, venues.pier_address
            FROM events
            LEFT JOIN venues ON events.domain_id = venues.domain_id
            WHERE events.domain_id = ?
            ORDER BY events.is_featured DESC, events.id DESC
        `, [domainId], (err, events) => {
            if (err) return resolve('');
            if (!events || events.length === 0) return resolve('<p class="text-center text-white p-4">Расписание формируется</p>');

            db.all(`
                SELECT sessions.*, events.slug as event_slug, venues.name as venue_name, venues.pier_address
                FROM sessions
                JOIN events ON sessions.event_id = events.id
                LEFT JOIN venues ON sessions.venue_id = venues.id
                WHERE events.domain_id = ? AND sessions.status = 'active'
                ORDER BY sessions.start_time ASC
            `, [domainId], (err2, sessions) => {
                if (err2) sessions = [];

                const sessionsByEvent = {};
                sessions.forEach(s => {
                    if (!sessionsByEvent[s.event_id]) sessionsByEvent[s.event_id] = [];
                    sessionsByEvent[s.event_id].push(s);
                });

                let html = `
                <!-- AFISHA COMPONENT -->
                <div class="afisha-wrapper" style="font-family: 'Lato', sans-serif; color: #fff; max-width: 1200px; margin: 0 auto; padding: 20px 10px;">
                    <div style="text-align: center; margin-bottom: 35px;">
                        <h2 style="color: #fff; font-size: 2.2rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Афиша и билеты на концерты</h2>
                        <p style="color: #cbd5e1; font-size: 1.1rem; max-width: 700px; margin: 0 auto;">Музыкальные прогулки по Неве и Финскому заливу под разводными мостами</p>
                    </div>

                    <!-- Date Filter Bar -->
                    <div class="afisha-filter-bar" style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 35px;">
                        <button class="afisha-filter-btn active" onclick="filterAfisha('all', this)" style="background: ${primaryColor}; border: 1px solid ${primaryColor}; color: #fff; padding: 8px 18px; border-radius: 25px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">Все программы</button>
                        <button class="afisha-filter-btn" onclick="filterAfisha('featured', this)" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.25); color: #fff; padding: 8px 18px; border-radius: 25px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">🔥 Хиты сезона</button>
                        <button class="afisha-filter-btn" onclick="filterAfisha('bridges', this)" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.25); color: #fff; padding: 8px 18px; border-radius: 25px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">🌉 Разводные мосты</button>
                    </div>

                    <!-- Events Grid -->
                    <div class="afisha-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 25px;">
                `;

                events.forEach(ev => {
                    const eventSessions = sessionsByEvent[ev.id] || [];
                    const isFeatured = ev.is_featured === 1;
                    const eventSlug = ev.slug.replace(/^\/+|\/+$/g, '');
                    const eventUrl = `/${eventSlug}/`;
                    const pierText = ev.pier_address || 'Набережная Макарова, 34';

                    let categoryTag = 'regular';
                    if (isFeatured) categoryTag = 'featured';
                    if (ev.title.toLowerCase().includes('мост') || ev.slug.includes('bridge')) categoryTag += ' bridges';

                    html += `
                        <div class="afisha-card" data-category="${categoryTag}" style="background: #1e293b; border-radius: 14px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0,0,0,0.35); transition: transform 0.2s ease, box-shadow 0.2s ease;">
                            <!-- Header / Badges -->
                            <div style="background: linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95)), url('${ev.image_url || ''}') center/cover; padding: 20px 20px 15px; border-bottom: 1px solid rgba(255,255,255,0.06); position: relative;">
                                <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px;">
                                    ${isFeatured ? `<span style="background: #e55f2e; color: #fff; font-size: 0.72rem; font-weight: 800; padding: 3px 9px; border-radius: 4px; text-transform: uppercase;">Хит</span>` : ''}
                                    <span style="background: rgba(255,255,255,0.15); color: #e2e8f0; font-size: 0.72rem; font-weight: 700; padding: 3px 8px; border-radius: 4px;">${ev.age_restriction || '18+'}</span>
                                    <span style="background: rgba(255,255,255,0.15); color: #e2e8f0; font-size: 0.72rem; font-weight: 700; padding: 3px 8px; border-radius: 4px;">⏱ ${ev.duration_minutes || 120} мин</span>
                                </div>
                                <h3 style="margin: 0 0 8px; font-size: 1.3rem; font-weight: 700; line-height: 1.3;">
                                    <a href="${eventUrl}" class="partner-link" style="color: #fff; text-decoration: none;">${ev.title}</a>
                                </h3>
                                <div style="color: #94a3b8; font-size: 0.85rem; display: flex; align-items: center; gap: 4px;">
                                    <span>📍 ${pierText}</span>
                                </div>
                            </div>

                            <!-- Description -->
                            <div style="padding: 15px 20px; flex-grow: 1; display: flex; flex-direction: column;">
                                <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.5; margin-bottom: 15px; flex-grow: 1;">
                                    ${ev.short_desc || 'Музыкальный круиз по Неве с панорамным видом на разводные мосты, живым звуком и баром на борту.'}
                                </p>

                                <!-- Sessions / Time slots -->
                                <div style="margin-bottom: 15px;">
                                    <div style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: #94a3b8; margin-bottom: 8px; letter-spacing: 0.5px;">Ближайшие рейсы:</div>
                                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                    `;

                    if (eventSessions.length > 0) {
                        eventSessions.slice(0, 4).forEach(sess => {
                            const formattedTime = formatDateRu(sess.start_time);
                            const price = sess.min_price || ev.min_price || 1500;
                            html += `
                                <a href="${eventUrl}" class="partner-link" style="background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); color: #f1f5f9; padding: 5px 10px; border-radius: 6px; font-size: 0.8rem; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; transition: background 0.15s;">
                                    <span>🗓 ${formattedTime}</span>
                                    <strong style="color: #38bdf8;">${price} ₽</strong>
                                </a>
                            `;
                        });
                        if (eventSessions.length > 4) {
                            html += `<a href="${eventUrl}" class="partner-link" style="background: rgba(255,255,255,0.04); color: #94a3b8; padding: 5px 8px; border-radius: 6px; font-size: 0.75rem; text-decoration: none; align-self: center;">+ еще ${eventSessions.length - 4}</a>`;
                        }
                    } else {
                        html += `<span style="color: #64748b; font-size: 0.8rem;">Сеансы скоро появятся</span>`;
                    }

                    html += `
                                    </div>
                                </div>

                                <!-- Action Buttons -->
                                <div style="display: flex; gap: 10px; align-items: center; margin-top: auto;">
                                    <a href="${eventUrl}" class="partner-link" style="flex: 1; background: ${primaryColor}; color: #fff; text-align: center; padding: 10px 14px; border-radius: 8px; font-weight: 700; font-size: 0.95rem; text-decoration: none; box-shadow: 0 4px 12px rgba(0,0,0,0.25);">
                                        Купить от ${ev.min_price || 1500} ₽
                                    </a>
                                    <a href="${eventUrl}" class="partner-link" style="background: rgba(255,255,255,0.08); color: #cbd5e1; padding: 10px 14px; border-radius: 8px; font-size: 0.9rem; text-decoration: none;">
                                        Инфо
                                    </a>
                                </div>
                            </div>
                        </div>
                    `;
                });

                html += `
                    </div>
                </div>

                <script>
                function filterAfisha(category, btn) {
                    const buttons = document.querySelectorAll('.afisha-filter-btn');
                    buttons.forEach(b => {
                        b.style.background = 'rgba(255,255,255,0.1)';
                        b.style.borderColor = 'rgba(255,255,255,0.25)';
                        b.classList.remove('active');
                    });
                    btn.style.background = '${primaryColor}';
                    btn.style.borderColor = '${primaryColor}';
                    btn.classList.add('active');

                    const cards = document.querySelectorAll('.afisha-card');
                    cards.forEach(card => {
                        const cats = card.getAttribute('data-category') || '';
                        if (category === 'all' || cats.includes(category)) {
                            card.style.display = 'flex';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }
                </script>
                `;

                resolve(html);
            });
        });
    });
}

async function buildPage(page) {
    const domain = await getDomainData(page.domain_id);
    if (!domain) throw new Error("Домен не найден");

    const isHomePage = !page.slug || page.slug === '/' || page.slug === '';

    // Выбираем оригинальный шаблон для соответствующего домена
    let templateFile;
    if (domain.name.includes('aquasound')) {
        templateFile = isHomePage ? TEMPLATES.aqua_main : TEMPLATES.aqua_event;
    } else if (domain.name.includes('rockhit') || domain.template === 'flatsome') {
        templateFile = isHomePage ? TEMPLATES.flatsome : TEMPLATES.flatsome_event;
    } else {
        templateFile = isHomePage ? TEMPLATES.spectral : TEMPLATES.spectral_event;
    }
    let html = fs.readFileSync(templateFile, 'utf-8');

    const primaryColor = domain.primary_color || (domain.name.includes('rockhit') ? '#e55f2e' : '#446084');

    // Вставляем код фрейма/виджета (например, Ticketland)
    let contentToInject = page.iframe_code || '';

    // Подставляем данные
    html = html.replace(/{{TITLE}}/g, page.title);
    html = html.replace(/{{IFRAME_CODE}}/g, contentToInject);
    
    // Сквозной скрипт атрибуции партнеров и промокодов
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

    // Билетный скрипт (динамические кассовые шлюзы)
    let ticketScript = '';
    let gateways = [];
    if (domain.gateways_json) {
        try {
            gateways = typeof domain.gateways_json === 'string' ? JSON.parse(domain.gateways_json) : domain.gateways_json;
        } catch(e) {}
    }
    if (!Array.isArray(gateways) || gateways.length === 0) {
        gateways = [
            { id: 1, name: domain.script_1_name || 'Юрлицо 1', code: domain.script_1_code || '' },
            { id: 2, name: domain.script_2_name || 'Юрлицо 2', code: domain.script_2_code || '' }
        ];
    }
    
    const choiceId = (page.script_choice !== undefined && page.script_choice !== null) ? parseInt(page.script_choice) : 1;
    const selectedGateway = gateways.find(g => g.id === choiceId) || gateways[0];
    if (selectedGateway) {
        ticketScript = selectedGateway.code || '';
    } else {
        ticketScript = domain.script_1_code || '';
    }
    html = html.replace(/{{TICKET_SCRIPT}}/g, ticketScript);
    
    // Подвал
    html = html.replace(/{{FOOTER_TEXT}}/g, domain.footer_text || '');

    const domainDir = path.join(DIST_DIR, domain.name);
    
    // Копируем общие статические ассеты (CSS, JS, шрифты) в папку домена
    const staticAssetsSrc = path.join(__dirname, 'static_assets');
    const staticAssetsDest = path.join(domainDir, 'static');
    if (fs.existsSync(staticAssetsSrc)) {
        fs.cpSync(staticAssetsSrc, staticAssetsDest, { recursive: true });
    }

    let staticPrefix = './static';
    let targetDir = domainDir;
    if (!isHomePage) {
        const cleanSlug = page.slug.replace(/^\/+|\/+$/g, '');
        const depth = cleanSlug.split('/').filter(Boolean).length;
        staticPrefix = depth > 0 ? '../'.repeat(depth) + 'static' : './static';
        targetDir = path.join(domainDir, cleanSlug);
    }
    html = html.replace(/{{STATIC_PREFIX}}/g, staticPrefix);

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    const indexPath = path.join(targetDir, 'index.html');
    fs.writeFileSync(indexPath, html, 'utf-8');
    
    return indexPath;
}

async function deletePage(page) {
    const domain = await getDomainData(page.domain_id);
    if (!domain) return;
    
    const isHomePage = !page.slug || page.slug === '/';
    const domainDir = path.join(DIST_DIR, domain.name);
    
    if (isHomePage) {
        const indexPath = path.join(domainDir, 'index.html');
        if (fs.existsSync(indexPath)) fs.unlinkSync(indexPath);
    } else {
        const cleanSlug = page.slug.replace(/^\/+|\/+$/g, '');
        const targetDir = path.join(domainDir, cleanSlug);
        if (fs.existsSync(targetDir)) {
            fs.rmSync(targetDir, { recursive: true, force: true });
        }
    }
}

async function rebuildDomain(domainId) {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM pages WHERE domain_id = ?", [domainId], async (err, pages) => {
            if (err) return reject(err);
            try {
                for (let page of pages) {
                    await buildPage(page);
                }
                resolve();
            } catch(e) {
                reject(e);
            }
        });
    });
}

module.exports = {
    buildPage,
    deletePage,
    rebuildDomain,
    generateAfishaHtml
};