const fs = require('fs');
const path = require('path');

// 1. Flatsome Event Template
const flatsomePath = path.join(__dirname, 'templates', 'flatsome.html');
const flatsomeText = fs.readFileSync(flatsomePath, 'utf-8');

const mainIdx = flatsomeText.indexOf('<main id="main"');
const footerIdx = flatsomeText.indexOf('<footer id="footer"');

if (mainIdx === -1 || footerIdx === -1) {
    console.error('Could not find main or footer in flatsome.html');
    process.exit(1);
}

let headerPart = flatsomeText.substring(0, mainIdx);
let footerPart = flatsomeText.substring(footerIdx);

// Add GLOBAL_SCRIPTS placeholder if not present
if (!headerPart.includes('{{GLOBAL_SCRIPTS}}')) {
    headerPart = headerPart.replace('</head>', '{{GLOBAL_SCRIPTS}}\n</head>');
}

// Ensure flatsome.html also has GLOBAL_SCRIPTS
if (!flatsomeText.includes('{{GLOBAL_SCRIPTS}}')) {
    const updatedFlatsome = flatsomeText.replace('</head>', '{{GLOBAL_SCRIPTS}}\n</head>');
    fs.writeFileSync(flatsomePath, updatedFlatsome, 'utf-8');
    console.log('Updated flatsome.html with {{GLOBAL_SCRIPTS}}');
}

const eventMain = `\t<main id="main" class="">\n\n<div id="content" role="main" class="content-area">\n\t<section class="section" id="section_event_widget">\n\t\t<div class="bg section-bg fill bg-fill bg-loaded"></div>\n\t\t<div class="section-content relative container" style="padding-top: 30px; padding-bottom: 40px; min-height: 700px;">\n\t\t\t{{IFRAME_CODE}}\n\t\t</div>\n\t\t<style>\n\t\t#section_event_widget {\n\t\t  padding-top: 20px;\n\t\t  padding-bottom: 20px;\n\t\t  background-color: rgb(54, 59, 74);\n\t\t}\n\t\t</style>\n\t</section>\n</div>\n\n</main>\n\n`;

const flatsomeEventPath = path.join(__dirname, 'templates', 'flatsome_event.html');
fs.writeFileSync(flatsomeEventPath, headerPart + eventMain + footerPart, 'utf-8');
console.log('flatsome_event.html created successfully!');

// 2. Base / Spectral Event Template
const basePath = path.join(__dirname, 'templates', 'base.html');
const baseText = fs.readFileSync(basePath, 'utf-8');

// For event page, remove banner section and have afisha directly
let baseEventText = baseText.replace(
    /<!-- Banner -->[\s\S]*?<!-- Афиша — главный блок -->/,
    `<!-- Афиша — главный блок для мероприятий -->`
);
baseEventText = baseEventText.replace(
    '<section id="afisha" class="afisha-section">',
    '<section id="afisha" class="afisha-section" style="padding-top: 6em; min-height: 600px;">'
);

const baseEventPath = path.join(__dirname, 'templates', 'base_event.html');
fs.writeFileSync(baseEventPath, baseEventText, 'utf-8');
console.log('base_event.html created successfully!');
