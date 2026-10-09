import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { renderPageHtml, STANDARD_TICKETLAND_GATEWAYS } from './cmsBuilder.js';

function getS3Client() {
  const accessKeyId = process.env.YC_STORAGE_ACCESS_KEY;
  const secretAccessKey = process.env.YC_STORAGE_SECRET_KEY;
  if (!accessKeyId || !secretAccessKey) {
    console.warn('⚠️ Storage credentials missing in environment variables');
  }
  return new S3Client({
    region: 'ru-central1',
    endpoint: 'https://storage.yandexcloud.net',
    credentials: {
      accessKeyId: accessKeyId || '',
      secretAccessKey: secretAccessKey || ''
    }
  });
}

const DEFAULT_SEED_DOMAINS = [
  {
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
    gateways: STANDARD_TICKETLAND_GATEWAYS,
    footer_text: 'ООО "МОРСКИЕ КОРАБЛИ"\nИНН: 7814848882 | КПП: 781401001 | ОГРН: 1257800013459\nст. м. Спортивная, г. Санкт-Петербург, Набережная Макарова, дом 20',
    cloud_url: 'https://rockhitneva.ru/',
    pages: [
      {
        title: 'Главная афиша',
        slug: '/',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/JHgCdar1f2RgfwwTnasWr9ScZXK_hHlR/"></div>',
        url: 'https://rockhitneva.ru/'
      },
      {
        title: 'Договор оферты',
        slug: 'оферта',
        script_choice: 1,
        iframe_code: '',
        url: 'https://rockhitneva.ru/оферта/'
      },
      {
        title: 'Политика обработки персональных данных (PR)',
        slug: 'pr',
        script_choice: 1,
        iframe_code: '',
        url: 'https://rockhitneva.ru/pr/'
      },
      {
        title: 'Правила заказа билетов',
        slug: 'правила-заказа-билетов',
        script_choice: 1,
        iframe_code: '',
        url: 'https://rockhitneva.ru/правила-заказа-билетов/'
      },
      {
        title: 'Брат (Саундтреки к фильму)',
        slug: 'brother',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/brother/"></div>',
        url: 'https://rockhitneva.ru/brother/'
      },
      {
        title: 'Громыка',
        slug: 'gromyka',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/gromyka/"></div>',
        url: 'https://rockhitneva.ru/gromyka/'
      },
      {
        title: 'JOE COCKER Tribute',
        slug: 'joe-cocker',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/joe-cocker/"></div>',
        url: 'https://rockhitneva.ru/joe-cocker/'
      },
      {
        title: 'STING & The Police',
        slug: 'sting',
        script_choice: 1,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/sting/"></div>',
        url: 'https://rockhitneva.ru/sting/'
      }
    ]
  },
  {
    name: 'aquasound.club',
    title: 'Акватория Звука — Музыкальные прогулки по Неве',
    primary_color: '#0083ca',
    logo_url: 'https://aquasound.club/wp-content/uploads/2024/04/logo.png',
    bg_image_url: '',
    global_scripts: '<!-- Yandex.Metrika counter -->\n<script type="text/javascript">\n(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");\nym(97638164, "init", {clickmap:true,trackLinks:true,accurateTrackBounce:true,ecommerce:"dataLayer"});\n</script>',
    script_1_name: 'ООО «Морские корабли» (Акватория)',
    script_1_code: '<script>var TLConf = { accessHash: "8c8d43b735f10cc868462481cd0b51d5", version: 1 };</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>',
    script_2_name: 'ИП Юницына Валерия Николаевна (Акватория)',
    script_2_code: '<script>var TLConf = { accessHash: "DH6tIrnYRIsz8Gc3kudLy8b6qM2Iwdm1", version: 1 };</script>\n<script async src="https://www.ticketland.ru/iframe/loaderJs/"></script>',
    gateways: STANDARD_TICKETLAND_GATEWAYS,
    footer_text: 'ООО "МОРСКИЕ КОРАБЛИ"\nИНН: 7814848882 | КПП: 781401001 | ОГРН: 1257800013459\nСанкт-Петербург, Университетская набережная 13',
    cloud_url: 'https://aquasound.club/',
    pages: [
      {
        title: 'Главная афиша',
        slug: '/',
        script_choice: 2,
        iframe_code: '<div id="tlFrameContainer" data-start="https://spb.ticketland.ru/iframe-direct-sale/aquasound/"></div>',
        url: 'https://aquasound.club/'
      },
      {
        title: 'Договор оферты',
        slug: 'оферта',
        script_choice: 2,
        iframe_code: '',
        url: 'https://aquasound.club/оферта/'
      },
      {
        title: 'Политика конфиденциальности (PR)',
        slug: 'pr',
        script_choice: 2,
        iframe_code: '',
        url: 'https://aquasound.club/pr/'
      },
      {
        title: 'Правила заказа билетов',
        slug: 'правила-заказа-билетов',
        script_choice: 2,
        iframe_code: '',
        url: 'https://aquasound.club/правила-заказа-билетов/'
      }
    ]
  }
];

export async function initCmsTables(pool) {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cms_domains (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        title TEXT,
        primary_color VARCHAR(50),
        logo_url TEXT,
        bg_image_url TEXT,
        global_scripts TEXT,
        script_1_name TEXT,
        script_1_code TEXT,
        script_2_name TEXT,
        script_2_code TEXT,
        gateways_json JSONB,
        footer_text TEXT,
        cloud_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS cms_pages (
        id SERIAL PRIMARY KEY,
        domain_id INT REFERENCES cms_domains(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        slug VARCHAR(255) NOT NULL,
        script_choice INT DEFAULT 1,
        iframe_code TEXT,
        url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(domain_id, slug)
      );
    `);

    // Check if initial seeding is needed
    const countRes = await pool.query('SELECT COUNT(*) FROM cms_domains');
    if (parseInt(countRes.rows[0].count, 10) === 0) {
      console.log('Seeding initial CMS domains and pages in PostgreSQL...');
      for (const d of DEFAULT_SEED_DOMAINS) {
        const insDom = await pool.query(`
          INSERT INTO cms_domains (
            name, title, primary_color, logo_url, bg_image_url, global_scripts,
            script_1_name, script_1_code, script_2_name, script_2_code,
            gateways_json, footer_text, cloud_url
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          RETURNING id;
        `, [
          d.name, d.title, d.primary_color, d.logo_url, d.bg_image_url, d.global_scripts,
          d.script_1_name, d.script_1_code, d.script_2_name, d.script_2_code,
          JSON.stringify(d.gateways), d.footer_text, d.cloud_url
        ]);
        const domainId = insDom.rows[0].id;

        for (const p of d.pages) {
          await pool.query(`
            INSERT INTO cms_pages (domain_id, title, slug, script_choice, iframe_code, url)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (domain_id, slug) DO NOTHING;
          `, [domainId, p.title, p.slug, p.script_choice, p.iframe_code, p.url]);
        }
      }
      console.log('CMS default domains and pages seeded successfully!');
    }
  } catch (err) {
    console.error('Error initializing CMS tables:', err);
  }
}

export function setupCmsRoutes(app, pool) {
  initCmsTables(pool);

  // 1. Get all domains with their pages & gateways
  app.get('/api/v1/cms/domains', async (req, res) => {
    try {
      const domainsRes = await pool.query('SELECT * FROM cms_domains ORDER BY id ASC');
      const pagesRes = await pool.query('SELECT * FROM cms_pages ORDER BY id ASC');

      const domains = domainsRes.rows.map(d => {
        let gateways = d.gateways_json;
        if (typeof gateways === 'string') {
          try { gateways = JSON.parse(gateways); } catch(e) {}
        }
        if (!Array.isArray(gateways) || gateways.length === 0) {
          gateways = STANDARD_TICKETLAND_GATEWAYS;
        }

        const domainPages = pagesRes.rows
          .filter(p => p.domain_id === d.id)
          .map(p => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            script_choice: p.script_choice,
            iframe_code: p.iframe_code,
            url: p.url || (p.slug === '/' ? `https://${d.name}/` : `https://${d.name}/${p.slug}/`)
          }));

        return {
          id: d.id,
          name: d.name,
          title: d.title,
          primary_color: d.primary_color,
          logo_url: d.logo_url,
          bg_image_url: d.bg_image_url,
          global_scripts: d.global_scripts,
          script_1_name: d.script_1_name,
          script_1_code: d.script_1_code,
          script_2_name: d.script_2_name,
          script_2_code: d.script_2_code,
          gateways,
          footer_text: d.footer_text,
          cloud_url: d.cloud_url || `https://${d.name}/`,
          pages: domainPages
        };
      });

      res.json({ success: true, domains });
    } catch (err) {
      console.error('Failed to get CMS domains:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 2. Save/Create Page and auto-deploy to S3
  app.post('/api/v1/cms/pages/save', async (req, res) => {
    try {
      const { domain_id, domain_name, title, slug, iframe_code, script_choice } = req.body;

      if (!title) {
        return res.status(400).json({ success: false, error: 'Название страницы обязательно' });
      }

      // Find domain
      let domain;
      if (domain_id) {
        const domRes = await pool.query('SELECT * FROM cms_domains WHERE id = $1', [domain_id]);
        domain = domRes.rows[0];
      } else if (domain_name) {
        const domRes = await pool.query('SELECT * FROM cms_domains WHERE name = $1', [domain_name]);
        domain = domRes.rows[0];
      }

      if (!domain) {
        return res.status(404).json({ success: false, error: 'Домен не найден' });
      }

      // Normalize slug
      let cleanSlug = (slug || '').trim().toLowerCase().replace(/^\/+|\/+$/g, '');
      const isHome = !cleanSlug || cleanSlug === '/';
      if (isHome) cleanSlug = '/';

      const pageUrl = isHome ? `https://${domain.name}/` : `https://${domain.name}/${cleanSlug}/`;

      // Render HTML via template
      const compiledHtml = renderPageHtml(domain, {
        title,
        slug: cleanSlug,
        iframe_code,
        script_choice
      });

      // Upload directly to Yandex Object Storage (S3)
      const s3 = getS3Client();
      const s3Key = isHome ? 'index.html' : `${cleanSlug}/index.html`;

      await s3.send(new PutObjectCommand({
        Bucket: domain.name,
        Key: s3Key,
        Body: Buffer.from(compiledHtml, 'utf-8'),
        ContentType: 'text/html; charset=utf-8',
        CacheControl: 'no-cache, no-store, must-revalidate'
      }));

      // If non-ascii / cyrillic slug, upload URL-encoded key as well
      const encodedSlug = encodeURIComponent(cleanSlug);
      if (!isHome && encodedSlug !== cleanSlug) {
        await s3.send(new PutObjectCommand({
          Bucket: domain.name,
          Key: `${encodedSlug}/index.html`,
          Body: Buffer.from(compiledHtml, 'utf-8'),
          ContentType: 'text/html; charset=utf-8',
          CacheControl: 'no-cache, no-store, must-revalidate'
        }));
      }

      // Upsert into PostgreSQL
      const saveRes = await pool.query(`
        INSERT INTO cms_pages (domain_id, title, slug, script_choice, iframe_code, url, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        ON CONFLICT (domain_id, slug) DO UPDATE SET
          title = EXCLUDED.title,
          script_choice = EXCLUDED.script_choice,
          iframe_code = EXCLUDED.iframe_code,
          url = EXCLUDED.url,
          updated_at = NOW()
        RETURNING *;
      `, [domain.id, title, cleanSlug, script_choice || 1, iframe_code || '', pageUrl]);

      const savedPage = saveRes.rows[0];
      console.log(`Page saved and published to S3: ${domain.name} -> ${pageUrl}`);

      res.json({
        success: true,
        message: 'Страница успешно сохранена и опубликована в облаке S3',
        page: {
          id: savedPage.id,
          title: savedPage.title,
          slug: savedPage.slug,
          script_choice: savedPage.script_choice,
          iframe_code: savedPage.iframe_code,
          url: savedPage.url
        },
        url: pageUrl
      });
    } catch (err) {
      console.error('Error saving CMS page:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 3. Delete Page
  app.post('/api/v1/cms/pages/delete', async (req, res) => {
    try {
      const { domain_id, slug } = req.body;
      if (!domain_id || !slug || slug === '/') {
        return res.status(400).json({ success: false, error: 'Нельзя удалить главную страницу' });
      }

      const domRes = await pool.query('SELECT name FROM cms_domains WHERE id = $1', [domain_id]);
      if (domRes.rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Домен не найден' });
      }
      const domainName = domRes.rows[0].name;

      const cleanSlug = slug.trim().toLowerCase().replace(/^\/+|\/+$/g, '');
      await pool.query('DELETE FROM cms_pages WHERE domain_id = $1 AND slug = $2', [domain_id, cleanSlug]);

      // Delete from S3
      const s3 = getS3Client();
      try {
        await s3.send(new DeleteObjectCommand({
          Bucket: domainName,
          Key: `${cleanSlug}/index.html`
        }));
        const encodedSlug = encodeURIComponent(cleanSlug);
        if (encodedSlug !== cleanSlug) {
          await s3.send(new DeleteObjectCommand({
            Bucket: domainName,
            Key: `${encodedSlug}/index.html`
          }));
        }
      } catch (s3Err) {
        console.warn('S3 delete warning:', s3Err);
      }

      res.json({ success: true, message: 'Страница успешно удалена' });
    } catch (err) {
      console.error('Error deleting CMS page:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });
}
