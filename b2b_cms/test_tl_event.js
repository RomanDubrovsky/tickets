const https = require('https');
const id = '29194639';
const urls = [
  `https://spb.ticketland.ru/show/${id}/`,
  `https://spb.ticketland.ru/teatry/teplohod-rock-hit-neva/`,
  `https://www.ticketland.ru/hallplan/${id}/`,
  `https://widget.ticketland.ru/hallplan/${id}/`
];

urls.forEach(u => {
  https.get(u, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  }, res => {
    console.log(u, '->', res.statusCode);
  }).on('error', e => console.log(u, '-> error:', e.message));
});
