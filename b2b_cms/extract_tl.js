const https = require('https');
https.get('https://www.ticketland.ru/iframe/loaderJs/', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log(d.substring(27800, 28300));
  });
});
