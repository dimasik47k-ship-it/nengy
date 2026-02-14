const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const DB_FILE = 'database.json';

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

let db = loadDB();

app.use(express.json());
app.use(express.static('.'));

function genCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return db.links[code] ? genCode() : code;
}

// API endpoints
app.post('/api/shorten', (req, res) => {
  const { url } = req.body;
  console.log('Shorten request:', url);
  
  if (!url) return res.status(400).json({ error: 'URL required' });
  
  try {
    new URL(url);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  
  const code = genCode();
  db.links[code] = {
    url,
    created: new Date().toISOString(),
    clicks: 0,
    stats: []
  };
  saveDB(db);
  
  const shortUrl = `${req.protocol}://${req.get('host')}/${code}`;
  console.log('Created:', shortUrl);
  res.json({ short_url: shortUrl, code });
});

app.get('/api/urls', (req, res) => {
  const links = Object.entries(db.links).map(([code, data]) => ({
    code,
    short_url: `${req.protocol}://${req.get('host')}/${code}`,
    original_url: data.url,
    clicks: data.clicks,
    created_at: data.created
  }));
  
  console.log('Returning', links.length, 'links');
  res.json({ urls: links });
});

app.get('/api/analytics', (req, res) => {
  const totalLinks = Object.keys(db.links).length;
  const totalClicks = Object.values(db.links).reduce((sum, link) => sum + link.clicks, 0);
  
  // Собираем детальную статистику
  const devices = {};
  const browsers = {};
  const os = {};
  const byDay = {};
  const byHour = Array(24).fill(0);
  const countries = {};
  
  Object.values(db.links).forEach(link => {
    (link.stats || []).forEach(stat => {
      // Device, browser, OS
      const device = stat.device || 'Unknown';
      const browser = stat.browser || 'Unknown';
      const osName = stat.os || 'Unknown';
      
      devices[device] = (devices[device] || 0) + 1;
      browsers[browser] = (browsers[browser] || 0) + 1;
      os[osName] = (os[osName] || 0) + 1;
      
      // By day
      const timestamp = stat.timestamp || stat.time;
      if (timestamp) {
        const date = new Date(timestamp).toISOString().slice(0, 10);
        byDay[date] = (byDay[date] || 0) + 1;
        
        // By hour
        const hour = new Date(timestamp).getHours();
        byHour[hour]++;
      }
      
      // Countries
      const country = stat.country || 'Unknown';
      countries[country] = (countries[country] || 0) + 1;
    });
  });
  
  // Convert to arrays
  const byDayArray = Object.entries(byDay)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
    
  const byDeviceArray = Object.entries(devices)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
    
  const byBrowserArray = Object.entries(browsers)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
    
  const byCountryArray = Object.entries(countries)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  
  res.json({
    total_links: totalLinks,
    total_clicks: totalClicks,
    avg_clicks: totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0,
    by_day: byDayArray,
    by_device: byDeviceArray,
    by_browser: byBrowserArray,
    by_country: byCountryArray,
    by_hour: byHour,
    devices: devices,
    browsers: browsers,
    operating_systems: os
  });
});

app.get('/api/geo', (req, res) => {
  // Собираем статистику по странам
  const countries = {};
  const cities = {};
  
  Object.values(db.links).forEach(link => {
    (link.stats || []).forEach(stat => {
      const country = stat.country || 'Unknown';
      const city = stat.city || 'Unknown';
      countries[country] = (countries[country] || 0) + 1;
      cities[city] = (cities[city] || 0) + 1;
    });
  });
  
  const countriesArray = Object.entries(countries)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
    
  const citiesArray = Object.entries(cities)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  
  res.json({ countries: countriesArray, cities: citiesArray });
});

app.post('/api/register', (req, res) => {
  console.log('Register request:', req.body);
  
  const { username, email, password } = req.body;
  const userId = Math.random().toString(36).substring(7);
  const apiToken = 'api_' + Math.random().toString(36).substring(2);
  
  const user = {
    id: userId,
    username: username || email || 'User',
    email: email || '',
    api_token: apiToken,
    created: new Date().toISOString()
  };
  
  db.users[userId] = user;
  saveDB(db);
  
  res.json({ 
    success: true, 
    token: 'token-' + userId,
    user: user
  });
});

app.post('/api/login', (req, res) => {
  console.log('Login request:', req.body);
  
  const { username, email } = req.body;
  const userId = Math.random().toString(36).substring(7);
  const apiToken = 'api_' + Math.random().toString(36).substring(2);
  
  const user = {
    id: userId,
    username: username || email || 'User',
    email: email || '',
    api_token: apiToken
  };
  
  res.json({ 
    success: true, 
    token: 'token-' + userId,
    user: user
  });
});

app.get('/api/stats/:code', (req, res) => {
  const link = db.links[req.params.code];
  if (!link) return res.status(404).json({ error: 'Not found' });
  
  res.json({
    code: req.params.code,
    url: link.url,
    clicks: link.clicks,
    created: link.created,
    stats: link.stats || []
  });
});

app.get('/api/clicks/:code', (req, res) => {
  const link = db.links[req.params.code];
  if (!link) return res.status(404).json({ error: 'Not found' });
  
  // Группируем клики по дням
  const byDay = {};
  const byHour = Array(24).fill(0);
  const devices = {};
  const browsers = {};
  const os = {};
  const countries = {};
  
  (link.stats || []).forEach(stat => {
    // По дням
    const timestamp = stat.timestamp || stat.time;
    if (timestamp) {
      const date = new Date(timestamp).toISOString().slice(0, 10);
      byDay[date] = (byDay[date] || 0) + 1;
      
      // По часам
      const hour = new Date(timestamp).getHours();
      byHour[hour]++;
    }
    
    // Устройства, браузеры, ОС, страны
    const device = stat.device || 'Unknown';
    const browser = stat.browser || 'Unknown';
    const osName = stat.os || 'Unknown';
    const country = stat.country || 'Unknown';
    
    devices[device] = (devices[device] || 0) + 1;
    browsers[browser] = (browsers[browser] || 0) + 1;
    os[osName] = (os[osName] || 0) + 1;
    countries[country] = (countries[country] || 0) + 1;
  });
  
  // Конвертируем в массивы
  const byDayArray = Object.entries(byDay)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
    
  const devicesArray = Object.entries(devices)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
    
  const browsersArray = Object.entries(browsers)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
    
  const osArray = Object.entries(os)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
    
  const countriesArray = Object.entries(countries)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  
  res.json({
    by_day: byDayArray,
    by_hour: byHour,
    by_device: devicesArray,
    by_browser: browsersArray,
    by_os: osArray,
    by_country: countriesArray,
    recent_clicks: (link.stats || []).slice(-50).reverse()
  });
});

// Redirect
// Парсинг User-Agent
function parseUserAgent(ua) {
  const browser = ua.match(/(Chrome|Firefox|Safari|Edge|Opera|OPR)\/[\d.]+/)?.[1] || 'Unknown';
  const os = ua.includes('Windows') ? 'Windows' : 
             ua.includes('Mac') ? 'macOS' : 
             ua.includes('Linux') ? 'Linux' : 
             ua.includes('Android') ? 'Android' : 
             ua.includes('iOS') ? 'iOS' : 'Unknown';
  const device = ua.includes('Mobile') || ua.includes('Android') ? 'Mobile' : 
                 ua.includes('Tablet') ? 'Tablet' : 'Desktop';
  return { browser, os, device };
}

// Получение геолокации по IP (заглушка, можно подключить API)
function getGeoLocation(ip) {
  // В реальном проекте используй API типа ipapi.co или geoip-lite
  return {
    country: 'Unknown',
    city: 'Unknown',
    countryCode: 'XX'
  };
}

app.get('/:code', (req, res) => {
  const code = req.params.code;
  
  // Игнорируем статические файлы
  if (code.includes('.') || code === 'api' || code === 'static') {
    return res.status(404).send('Not found');
  }
  
  const link = db.links[code];
  if (!link) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html><head><meta charset="UTF-8"><title>404</title></head>
      <body style="background:#08090d;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;text-align:center">
      <div><h1 style="font-size:80px;color:#ff6b35">404</h1><p style="font-size:24px">Ссылка не найдена</p><a href="/" style="color:#ff6b35;text-decoration:none;font-size:18px">← Главная</a></div>
      </body></html>
    `);
  }
  
  // Собираем полную аналитику
  const ua = req.get('user-agent') || '';
  const { browser, os, device } = parseUserAgent(ua);
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const geo = getGeoLocation(ip);
  
  link.clicks++;
  link.stats = link.stats || [];
  link.stats.push({
    timestamp: new Date().toISOString(),
    ip: ip,
    userAgent: ua,
    browser: browser,
    os: os,
    device: device,
    country: geo.country,
    countryCode: geo.countryCode,
    city: geo.city,
    referer: req.get('referer') || 'direct',
    language: req.get('accept-language')?.split(',')[0] || 'unknown'
  });
  
  saveDB(db);
  console.log(`Redirect ${code}: ${link.clicks} clicks`);
  
  res.redirect(302, link.url);
});

app.listen(PORT, () => {
  console.log(`\n◆ shorto сервер запущен на http://localhost:${PORT}\n`);
});
