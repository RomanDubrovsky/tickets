const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');
const builder = require('./builder');

const app = express();
const PORT = process.env.PORT || 3000;

// Hardcoded password for managers (In production, use hashed passwords from DB)
const ADMIN_PASSWORD = 'password123';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'b2b_cms_secret_key',
    resave: false,
    saveUninitialized: false
}));

// Middleware для проверки авторизации
function requireAuth(req, res, next) {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Routes
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', (req, res) => {
    if (req.body.password === ADMIN_PASSWORD) {
        req.session.isAuthenticated = true;
        res.redirect('/');
    } else {
        res.render('login', { error: 'Неверный пароль' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Dashboard
app.get('/', requireAuth, (req, res) => {
    db.all("SELECT * FROM domains", (err, domains) => {
        if (err) return res.status(500).send(err.message);
        db.all(`
            SELECT pages.*, domains.name as domain_name 
            FROM pages 
            JOIN domains ON pages.domain_id = domains.id
            ORDER BY created_at DESC
        `, (err, pages) => {
            if (err) return res.status(500).send(err.message);
            res.render('dashboard', { domains, pages });
        });
    });
});

// Сохранение глобальных скриптов и настроек домена
app.post('/domain/edit', requireAuth, (req, res) => {
    const { domain_id, global_scripts, primary_color, logo_url, bg_image_url, script_1_name, script_1_code, script_2_name, script_2_code, footer_text } = req.body;
    db.run(
        "UPDATE domains SET global_scripts = ?, primary_color = ?, logo_url = ?, bg_image_url = ?, script_1_name = ?, script_1_code = ?, script_2_name = ?, script_2_code = ?, footer_text = ? WHERE id = ?", 
        [global_scripts, primary_color, logo_url, bg_image_url, script_1_name, script_1_code, script_2_name, script_2_code, footer_text, domain_id], 
        async function(err) {
            if (err) return res.status(500).send(err.message);
            try {
                await builder.rebuildDomain(domain_id);
                res.redirect('/');
            } catch(e) {
                res.status(500).send(e.message);
            }
        }
    );
});

// Добавление новой страницы (GET)
app.get('/page/add', requireAuth, (req, res) => {
    db.all("SELECT * FROM domains", (err, domains) => {
        if (err) return res.status(500).send(err.message);
        res.render('edit_page', { page: null, domains });
    });
});

// Редактирование страницы (GET)
app.get('/page/edit/:id', requireAuth, (req, res) => {
    db.get("SELECT * FROM pages WHERE id = ?", [req.params.id], (err, page) => {
        if (err) return res.status(500).send(err.message);
        if (!page) return res.status(404).send('Страница не найдена');
        
        db.all("SELECT * FROM domains", (err, domains) => {
            res.render('edit_page', { page, domains });
        });
    });
});

// Сохранение страницы (POST - Create / Update)
app.post('/page/save', requireAuth, (req, res) => {
    const { id, domain_id, title, slug, iframe_code, script_choice } = req.body;
    
    if (id) {
        // Update
        db.get("SELECT * FROM pages WHERE id = ?", [id], async (err, oldPage) => {
            if (err) return res.status(500).send(err.message);
            
            db.run(
                "UPDATE pages SET domain_id = ?, title = ?, slug = ?, iframe_code = ?, script_choice = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", 
                [domain_id, title, slug, iframe_code, script_choice || 1, id], 
                async function(err) {
                    if (err) return res.status(500).send(err.message);
                    
                    try {
                        // Если slug изменился, нужно удалить старую статику
                        if (oldPage && oldPage.slug !== slug) {
                            await builder.deletePage(oldPage);
                        }
                        
                        // Собираем новую страницу
                        db.get("SELECT * FROM pages WHERE id = ?", [id], async (err, newPage) => {
                            await builder.buildPage(newPage);
                            res.redirect('/');
                        });
                    } catch(e) {
                        res.status(500).send(e.message);
                    }
                }
            );
        });
    } else {
        // Create
        db.run(
            "INSERT INTO pages (domain_id, title, slug, iframe_code, script_choice) VALUES (?, ?, ?, ?, ?)",
            [domain_id, title, slug, iframe_code, script_choice || 1],
            function(err) {
                if (err) return res.status(500).send(err.message);
                
                db.get("SELECT * FROM pages WHERE id = ?", [this.lastID], async (err, newPage) => {
                    try {
                        await builder.buildPage(newPage);
                        res.redirect('/');
                    } catch(e) {
                        res.status(500).send(e.message);
                    }
                });
            }
        );
    }
});

// Удаление страницы (POST)
app.post('/page/delete/:id', requireAuth, (req, res) => {
    db.get("SELECT * FROM pages WHERE id = ?", [req.params.id], (err, page) => {
        if (err || !page) return res.status(500).send("Ошибка");
        
        db.run("DELETE FROM pages WHERE id = ?", [req.params.id], async function(err) {
            if (err) return res.status(500).send(err.message);
            
            try {
                await builder.deletePage(page);
                res.redirect('/');
            } catch(e) {
                res.status(500).send(e.message);
            }
        });
    });
});

app.listen(PORT, () => {
    console.log(`B2B CMS работает на http://localhost:${PORT}`);
});
