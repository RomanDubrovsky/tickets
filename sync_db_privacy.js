const sqlite3 = require('./b2b_cms/node_modules/sqlite3');
const db = new sqlite3.Database('./b2b_cms/cms.db');

const ENTITIES = {
    2: {
        'domain': 'rockhitneva.ru',
        'legal_name': 'ООО «МОРСКИЕ КОРАБЛИ»',
        'inn': '7814848882',
        'kpp': '781401001',
        'ogrn': '1257800013459',
        'address': '197198, г. Санкт-Петербург, Набережная Макарова, дом 20',
        'email': 'rockhitneva@gmail.com',
        'phone': '+7 (812) 927-50-57'
    },
    1: {
        'domain': 'aquasound.club',
        'legal_name': 'Индивидуальный предприниматель Юницына Валерия Николаевна',
        'inn': '470411807452',
        'kpp': '—',
        'ogrn': '322470400014155',
        'address': '199034, г. Санкт-Петербург, Набережная Макарова, дом 34',
        'email': 'Pochtalera@gmail.com',
        'phone': '+7 (911) 219-59-31'
    },
    7: {
        'domain': 'gradnaneve.ru',
        'legal_name': 'Индивидуальный предприниматель Куренной Владислав Юрьевич',
        'inn': '780230933072',
        'kpp': '—',
        'ogrn': '319784700148920',
        'address': '190000, г. Санкт-Петербург, Английская набережная, дом 28',
        'email': 'admin@gradnaneve.ru',
        'phone': '+7 (911) 928-80-77'
    },
    6: {
        'domain': 'nevaconcert.ru',
        'legal_name': 'Индивидуальный предприниматель Куренной Владислав Юрьевич',
        'inn': '780230933072',
        'kpp': '—',
        'ogrn': '319784700148920',
        'address': '190000, г. Санкт-Петербург, Английская набережная, дом 28',
        'email': 'concertneva@gmail.com',
        'phone': '+7 (911) 928-80-77'
    }
};

function getSnippet(ent) {
    return `<div class="legal-privacy-doc" style="max-width: 960px; margin: 0 auto; padding: 25px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; line-height: 1.6;">
        <h1 style="font-size: 24px; font-weight: 800; text-align: center; margin-bottom: 8px;">ПОЛИТИКА ОБРАБОТКИ ПЕРСОНАЛЬНЫХ ДАННЫХ (152-ФЗ)</h1>
        <p style="font-size: 13px; text-align: center; color: #64748b; margin-bottom: 24px;">Оператор: ${ent.legal_name} (ИНН: ${ent.inn}) • Сайт: https://${ent.domain}</p>
        <p>Настоящая Политика определяет порядок сбора, обработки и защиты персональных данных покупателей электронных билетов в соответствии с требованиями Федерального закона № 152-ФЗ «О персональных данных».</p>
        <h3 style="font-size: 16px; margin-top: 20px; color: #2563eb;">1. Категории обрабатываемых данных</h3>
        <p>ФИО пассажира, адрес электронной почты (для билета и кассового чека по 54-ФЗ), контактный телефон, технические cookie-файлы. Данные банковских карт Оператором не собираются и не хранятся.</p>
        <h3 style="font-size: 16px; margin-top: 20px; color: #2563eb;">2. Безопасность платежей Сбербанка</h3>
        <p>Оплата происходит через защищенный платежный шлюз ПАО СБЕРБАНК по стандартам PCI DSS и протоколу шифрования SSL 256-bit (МИР, Visa, Mastercard, СБП, SberPay).</p>
        <h3 style="font-size: 16px; margin-top: 20px; color: #2563eb;">3. Контакты и реквизиты Оператора</h3>
        <p><strong>${ent.legal_name}</strong><br>ИНН: ${ent.inn}<br>ОГРН: ${ent.ogrn}<br>Адрес: ${ent.address}<br>Email: ${ent.email} | Тел: ${ent.phone}</p>
    </div>`;
}

db.serialize(() => {
    Object.entries(ENTITIES).forEach(([domainId, ent]) => {
        const snippet = getSnippet(ent);
        db.run("UPDATE pages SET iframe_code = ? WHERE domain_id = ? AND slug = 'pr'", [snippet, domainId], function(err) {
            if (err) console.error('Error domain ' + domainId, err);
            else console.log('Updated db page pr for domain ' + domainId + ' (' + ent.domain + '), affected: ' + this.changes);
        });
    });
});
