const https = require('https');
const url = 'https://www.ticketland.ru/site/internalFrame/?iframe-internal=1&lite-layout=1&iframe-hash=0b2b641d60f7f9443e566d47c89d208f';

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const titleMatch = d.match(/<title>([^<]+)<\/title>/);
    console.log('Title:', titleMatch ? titleMatch[1] : 'No title');
    const h1Match = d.match(/<h1[^>]*>([^<]+)<\/h1>/);
    console.log('H1:', h1Match ? h1Match[1] : 'No H1');
  });
});
