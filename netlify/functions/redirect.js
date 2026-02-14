const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../../database.json');

function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
  } catch (e) {}
  return { links: {}, users: {} };
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function parseUserAgent(ua) {
  const browser = ua.match(/(Chrome|Firefox|Safari|Edge|Opera|OPR)\/[\d.]+/)?.[1] || 'Unknown';
  const os = ua.includes('Windows') ? 'Windows' : 
             ua.includes('Mac') ? 'macOS' : 
             ua.includes('Linux') ? 'Linux' : 
             ua.includes('Android') ? 'Android' : 
             ua.includes('iOS') ? 'iOS' : 'Unknown';
  const device = ua.includes('Mobile') || ua.includes('Android') ? 'Mobile' : 
                 ua.includes('Tablet') || ua.includes('iPad') ? 'Tablet' : 'Desktop';
  return { browser, os, device };
}

exports.handler = async (event) => {
  const code = event.path.split('/').pop();
  const db = loadDB();
  const link = db.links[code];

  if (!link) {
    return {
      statusCode: 302,
      headers: { Location: '/' },
      body: ''
    };
  }

  // Сохраняем статистику
  const ua = event.headers['user-agent'] || '';
  const { browser, os, device } = parseUserAgent(ua);
  
  const stat = {
    timestamp: new Date().toISOString(),
    ip: event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'Unknown',
    userAgent: ua,
    browser,
    os,
    device,
    country: 'Unknown',
    countryCode: 'XX',
    city: 'Unknown',
    referer: event.headers.referer || 'direct',
    language: event.headers['accept-language']?.split(',')[0] || 'en'
  };

  link.clicks++;
  link.stats = link.stats || [];
  link.stats.push(stat);
  saveDB(db);

  return {
    statusCode: 302,
    headers: { Location: link.url },
    body: ''
  };
};
