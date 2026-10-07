import { spawn } from 'child_process';

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const userDataDir = "C:\\Ships\\.chrome_debug_temp_diag";

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9238',
  `--user-data-dir=${userDataDir}`,
  '--window-size=1400,900',
  '--disable-gpu',
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const targetsRes = await fetch('http://127.0.0.1:9238/json/list');
  const targets = await targetsRes.json();
  const pageTarget = targets.find(t => t.type === 'page');

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  let id = 1;
  const callbacks = new Map();
  const consoleErrors = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled' && (msg.params.type === 'error' || msg.params.type === 'warning')) {
      consoleErrors.push({ type: msg.params.type, text: msg.params.args.map(a => a.value || a.description).join(' ') });
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      consoleErrors.push({ type: 'exception', text: msg.params.exceptionDetails.text });
    }
    if (msg.id && callbacks.has(msg.id)) {
      callbacks.get(msg.id)(msg.result);
      callbacks.delete(msg.id);
    }
  };

  const send = (method, params = {}) => new Promise((resolve) => {
    const reqId = id++;
    callbacks.set(reqId, resolve);
    ws.send(JSON.stringify({ id: reqId, method, params }));
  });

  await new Promise(r => ws.onopen = r);

  await send('Page.enable');
  await send('Runtime.enable');

  await send('Page.navigate', { url: 'https://spb-tickets-ru.storage.yandexcloud.net/index.html#booking' });
  await new Promise(r => setTimeout(r, 2000));

  const blueprints = [
    'bp_rock_hit_neva',
    'bp_m177',
    'bp_m125_classic',
    'bp_m125_styled',
    'bp_m201',
    'bp_solaris',
    'bp_m177_dance'
  ];

  for (const bp of blueprints) {
    console.log(`\n=================== TESTING ${bp} ===================`);
    consoleErrors.length = 0;

    // Switch blueprint
    const switchRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const select = document.querySelector('select');
        select.value = '${bp}';
        select.dispatchEvent(new Event('change', { bubbles: true }));
        return { selectedValue: select.value };
      })()`,
      returnByValue: true
    });
    await new Promise(r => setTimeout(r, 1000));

    // Check SVG rendered
    const checkRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const svg = document.querySelector('svg');
        const circles = Array.from(document.querySelectorAll('svg circle'));
        const tables = Array.from(document.querySelectorAll('svg rect'));
        const hasRockHit = !!document.querySelector('.rock-hit-neva-container');
        const hasHallRenderer = !!document.querySelector('.hall-renderer');
        
        // Find first clickable seat
        let clickableSeats = [];
        if (hasRockHit) {
          clickableSeats = Array.from(document.querySelectorAll('g[data-seat-number]'));
        } else {
          clickableSeats = Array.from(document.querySelectorAll('g[style*="pointer"]'));
        }

        return {
          hasSvg: !!svg,
          viewBox: svg ? svg.getAttribute('viewBox') : null,
          width: svg ? svg.clientWidth : 0,
          height: svg ? svg.clientHeight : 0,
          totalCircles: circles.length,
          clickableCount: clickableSeats.length,
          hasRockHit,
          hasHallRenderer
        };
      })()`,
      returnByValue: true
    });

    console.log('DOM check:', checkRes.result.value);

    // Hover test: simulate mouse movement across 10 points
    const hoverJitter = await send('Runtime.evaluate', {
      expression: `(() => {
        const statusEl = document.querySelector('[style*="minHeight: 36px"], [style*="min-height: 36px"]') || document.querySelector('span[title]');
        let initialH = statusEl ? statusEl.getBoundingClientRect().height : 0;
        let heights = [];
        
        const seats = Array.from(document.querySelectorAll('circle, path')).slice(0, 15);
        for (const s of seats) {
          s.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
          if (statusEl) heights.push(statusEl.getBoundingClientRect().height);
        }
        return { initialH, maxH: Math.max(...heights, initialH), minH: Math.min(...heights, initialH) };
      })()`,
      returnByValue: true
    });
    console.log('Hover stability:', hoverJitter.result.value);

    // Click test: click first available seat
    const clickTest = await send('Runtime.evaluate', {
      expression: `(() => {
        let seat = document.querySelector('g[data-seat-number]') || document.querySelector('g[style*="pointer"]');
        if (seat) {
          seat.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        }
        const cartItems = Array.from(document.querySelectorAll('[style*="justify-content: space-between"], [style*="justifyContent: space-between"]'))
          .map(el => el.innerText.replace(/\\n/g, ' '));
        const totalText = document.body.innerText.match(/ИТОГО:\\s*([\\d\\s]+₽)/i)?.[0] || 'none';
        return { clicked: !!seat, cartItems, totalText };
      })()`,
      returnByValue: true
    });
    console.log('Click result:', clickTest.result.value);

    if (consoleErrors.length > 0) {
      console.log('Console errors:', consoleErrors);
    }
  }

  ws.close();
} catch (e) {
  console.error('Error during test:', e);
} finally {
  chrome.kill();
}
