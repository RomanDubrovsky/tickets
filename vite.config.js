import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Vite plugin to save customer voice recordings and structured specs to customer_tz/
function customerTzPlugin() {
  return {
    name: 'customer-tz-saver',
    configureServer(server) {
      server.middlewares.use('/api/save-customer-tz', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          return res.end('Method Not Allowed');
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            const tzDir = path.resolve(process.cwd(), 'customer_tz');
            if (!fs.existsSync(tzDir)) {
              fs.mkdirSync(tzDir, { recursive: true });
            }

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const safeTitle = (data.title || 'Новое_ТЗ').replace(/[\\/:*?"<>|\s]/g, '_').slice(0, 40);
            const fileName = `ТЗ_${timestamp}_${safeTitle}.md`;
            const filePath = path.join(tzDir, fileName);

            const mdContent = `# ТЕХНИЧЕСКОЕ ЗАДАНИЕ ОТ ЗАКАЗЧИКА (ГОЛОСОВОЙ ВВОД)
**Дата и время**: ${new Date().toLocaleString('ru-RU')}
**Тема**: ${data.title || 'Без названия'}
**Автор / Заказчик**: ${data.author || 'Заказчик'}
**Статус**: 🟡 Требует обсуждения с разработчиком

---

## 🎯 1. Краткая суть идеи простыми словами
${data.summary || 'Не указано'}

---

## 📋 2. Структурированные требования (ТЗ)
${data.structuredRequirements || 'Не указано'}

---

## 🛠 3. Предлагаемое техническое решение и архитектура
${data.technicalSolution || 'Будет сформировано разработчиком при обсуждении'}

---

## 🎙️ 4. Исходная прямая речь заказчика (Стенограмма)
> ${data.rawTranscript || data.voiceText || 'Стенограмма отсутствует'}

---
*Файл автоматически сохранен системой в каталог \`c:\\Ships\\customer_tz\\${fileName}\`*
`;

            fs.writeFileSync(filePath, mdContent, 'utf-8');

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              success: true, 
              filePath, 
              fileName 
            }));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), customerTzPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) return 'vendor-icons';
            return 'vendor';
          }
        }
      }
    }
  }
})
