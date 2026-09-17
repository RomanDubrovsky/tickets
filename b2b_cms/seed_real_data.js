const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // 1. Очистим текущие записи, чтобы начать с чистого листа
    db.run("DELETE FROM pages");
    db.run("DELETE FROM domains");

    // 2. Вставляем Домен 1: aquasound.club (Акватория Звука)
    db.run(`
        INSERT INTO domains (
            id, name, primary_color, logo_url, bg_image_url, footer_text,
            script_1_name, script_1_code, script_2_name, script_2_code, global_scripts
        ) VALUES (
            1,
            'aquasound.club',
            '#446084',
            'https://aquasound.club/wp-content/uploads/2024/04/Лого-1024x210.png',
            '',
            'ИП Юницына Валерия Николаевна\\nИНН: 470411807452\\nОГРН: 322470400014155\\nСанкт-Петербург, ст. м. Спортивная, причал Набережная Макарова, 34',
            'ИП Юницына',
            '<script>var TLConf = { accessHash: "DH6tIrnYRIsz8Gc3kudLy8b6qM2Iwdm1", version: 1 };</script><script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>',
            'Резервный Ticketland',
            '',
            '<!-- Yandex.Metrika counter --><script type="text/javascript">(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");ym(48530885, "init", {clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});</script><noscript><div><img src="https://mc.yandex.ru/watch/48530885" style="position:absolute; left:-9999px;" alt="" /></div></noscript>'
        )
    `);

    // 3. Вставляем Домен 2: rockhitneva.ru (Рок Хит Нева)
    db.run(`
        INSERT INTO domains (
            id, name, primary_color, logo_url, bg_image_url, footer_text,
            script_1_name, script_1_code, script_2_name, script_2_code, global_scripts
        ) VALUES (
            2,
            'rockhitneva.ru',
            '#e55f2e',
            'https://rockhitneva.ru/wp-content/uploads/2024/03/logo1.png',
            '',
            'ООО "МОРСКИЕ КОРАБЛИ"\\nИНН: 7814848882\\nКПП: 781401001\\nОГРН: 1257800013459\\nст. м. Спортивная, г. Санкт-Петербург, ул. Макарова, дом 20',
            'ООО Морские Корабли',
            '<script>var TLConf = { accessHash: "0b2b641d60f7f9443e566d47c89d208f", version: 1 };</script><script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>',
            'Резервный Ticketland',
            '',
            '<!-- Yandex.Metrika counter --><script type="text/javascript">(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");ym(97638164, "init", {clickmap:true,trackLinks:true,accurateTrackBounce:true,ecommerce:"dataLayer"});</script><noscript><div><img src="https://mc.yandex.ru/watch/97638164" style="position:absolute; left:-9999px;" alt="" /></div></noscript>'
        )
    `);

    // 4. Вставляем Главную страницу для Акватории Звука
    db.run(`
        INSERT INTO pages (domain_id, title, slug, iframe_code, script_choice) VALUES (
            1,
            'Акватория Звука — Музыкальный теплоход',
            '',
            '
            <div style="text-align: center; margin-bottom: 40px; color: #555;">
                <h2>Одно из самых романтических мест для встреч в нашем городе – прогулка на теплоходе по Неве и Финскому заливу</h2>
                <p style="font-size: 1.1rem; max-width: 800px; margin: 0 auto; line-height: 1.6;">Мы не проводим скучных записанных заранее аудио-экскурсий, как все. Только у нас виды Петербурга с верхней палубы сопровождает живое общение с известными петербуржцами о своем городе. А на нижней палубе, вас, как всегда, ждет живая музыка и полное погружение в жизнь на ночной Неве.</p>
            </div>
            
            <div id="tlFrameContainer" data-start="https://spb.ticketland.ru/drugoe/akvatoriya-zvuka-angliyskaya-nab-28"></div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-top: 60px;">
                <div style="background: white; padding: 25px; border-radius: 10px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <h4 style="color: #446084;">Две тёплые палубы</h4>
                    <p style="font-size: 0.95rem; color: #666;">Нижняя палуба — концерт.<br>Верхняя палуба — экскурсия и DJ.</p>
                </div>
                <div style="background: white; padding: 25px; border-radius: 10px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <h4 style="color: #446084;">Маршруты</h4>
                    <p style="font-size: 0.95rem; color: #666;">Самые протяженные.<br>Удобные причалы на маршруте.</p>
                </div>
                <div style="background: white; padding: 25px; border-radius: 10px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <h4 style="color: #446084;">Только живьём!</h4>
                    <p style="font-size: 0.95rem; color: #666;">Живая музыка от известных музыкантов. Экскурсии от знаковых жителей.</p>
                </div>
                <div style="background: white; padding: 25px; border-radius: 10px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <h4 style="color: #446084;">Меню от шеф-повара</h4>
                    <p style="font-size: 0.95rem; color: #666;">Фирменный гриль "Дым над водой".</p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 40px;">
                <a href="https://vk.com/topic-20975141_28577032" target="_blank" style="display: inline-block; background: #446084; color: white; padding: 12px 35px; border-radius: 30px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 10px rgba(68, 96, 132, 0.3);">ЧИТАТЬ ОТЗЫВЫ В ВК</a>
            </div>
            ',
            1
        )
    `);

    // 5. Вставляем Главную страницу для Рок Хит Нева
    db.run(`
        INSERT INTO pages (domain_id, title, slug, iframe_code, script_choice) VALUES (
            2,
            'Рок Хит Нева — музыкальный теплоход',
            '',
            '
            <div style="text-align: center; margin-bottom: 40px; color: #444;">
                <h2 style="text-transform: uppercase;"><span style="color: #e55f2e;">ROCK</span> – концерт в сердце Петербурга</h2>
                <h2 style="text-transform: uppercase;"><span style="color: #e55f2e;">HIT</span> – хиты на все времена</h2>
                <h2 style="text-transform: uppercase;"><span style="color: #e55f2e;">NEVA</span> – романтика речной прогулки</h2>
                <h3 style="color: #777; font-weight: 400; margin-top: 15px;">19 лет как мы не проводим скучных экскурсий!</h3>
            </div>
            
            <div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/JHgCdar1f2RgfwwTnasWr9ScZXK_hHlR/"></div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-top: 60px;">
                <div style="background: white; padding: 25px; border-radius: 10px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <h4 style="color: #e55f2e;">Две тёплые палубы</h4>
                    <p style="font-size: 0.95rem; color: #666;">Нижняя палуба — рок-концерт.<br>Верхняя палуба — экскурсия и DJ.</p>
                </div>
                <div style="background: white; padding: 25px; border-radius: 10px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <h4 style="color: #e55f2e;">Маршруты</h4>
                    <p style="font-size: 0.95rem; color: #666;">Самые протяженные.<br>Удобные причалы на маршруте.</p>
                </div>
                <div style="background: white; padding: 25px; border-radius: 10px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <h4 style="color: #e55f2e;">Легендарные хиты</h4>
                    <p style="font-size: 0.95rem; color: #666;">Живой трибьют мировым шедеврам рока от лучших питерских музыкантов.</p>
                </div>
                <div style="background: white; padding: 25px; border-radius: 10px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <h4 style="color: #e55f2e;">Гриль-бар</h4>
                    <p style="font-size: 0.95rem; color: #666;">Сочное мясо, закуски и напитки во время круиза.</p>
                </div>
            </div>
            ',
            1
        )
    `);

    console.log("Данные сайтов Акватория Звука и Рок Хит Нева успешно импортированы!");
});
