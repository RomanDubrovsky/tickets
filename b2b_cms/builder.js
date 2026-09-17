const fs = require('fs');
const path = require('path');
const db = require('./db');

const TEMPLATE_PATH = path.join(__dirname, 'templates', 'base.html');
const DIST_DIR = path.join(__dirname, 'dist');

// Убедимся, что папка dist существует
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

async function buildPage(page) {
    const domain = await getDomainData(page.domain_id);
    if (!domain) throw new Error("Домен не найден");

    // Читаем базовый шаблон
    let html = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

    // Подставляем данные
    html = html.replace(/{{TITLE}}/g, page.title);
    html = html.replace(/{{IFRAME_CODE}}/g, page.iframe_code);
    html = html.replace(/{{GLOBAL_SCRIPTS}}/g, domain.global_scripts || '');
    
    // Дизайн
    const primaryColor = domain.primary_color || '#0d6efd';
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

    // Билетный скрипт
    let ticketScript = '';
    if (page.script_choice === 2) {
        ticketScript = domain.script_2_code || '';
    } else {
        ticketScript = domain.script_1_code || '';
    }
    html = html.replace(/{{TICKET_SCRIPT}}/g, ticketScript);
    
    // Подвал
    html = html.replace(/{{FOOTER_TEXT}}/g, domain.footer_text || '');

    // Формируем путь для сохранения
    // Если slug пустой или "/", сохраняем в корень домена (index.html)
    // Иначе создаем папку slug/index.html
    const isHomePage = !page.slug || page.slug === '/';
    const domainDir = path.join(DIST_DIR, domain.name);
    
    let targetDir = domainDir;
    if (!isHomePage) {
        // Очищаем slug от слэшей по краям
        const cleanSlug = page.slug.replace(/^\/+|\/+$/g, '');
        targetDir = path.join(domainDir, cleanSlug);
    }

    // Создаем директории
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    // Записываем index.html
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
        // Удаляем только index.html
        const indexPath = path.join(domainDir, 'index.html');
        if (fs.existsSync(indexPath)) fs.unlinkSync(indexPath);
    } else {
        // Удаляем всю папку с событием
        const cleanSlug = page.slug.replace(/^\/+|\/+$/g, '');
        const targetDir = path.join(domainDir, cleanSlug);
        
        // Рекурсивно удаляем папку (Node 14.14+)
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
    rebuildDomain
};
