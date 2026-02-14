const { getDB, saveDB, generateUniqueCode, parseUserAgent } = require('./db-simple');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Получаем путь из rawUrl или path
  let path = event.path;
  
  // Убираем префикс функции если есть
  if (path.startsWith('/.netlify/functions/api')) {
    path = path.replace('/.netlify/functions/api', '');
  }
  
  // Если путь начинается с /api, убираем это
  if (path.startsWith('/api')) {
    path = path.replace('/api', '');
  }
  
  // Если путь пустой, ставим /
  if (!path || path === '') {
    path = '/';
  }
  
  const method = event.httpMethod;

  try {
    const db = await getDB();

    // POST /shorten
    if (path === '/shorten' && method === 'POST') {
      const { url } = JSON.parse(event.body);
      if (!url) return { statusCode: 400, headers, body: JSON.stringify({ error: 'URL required' }) };
      
      try { new URL(url); } catch (e) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid URL' }) };
      }
      
      const code = await generateUniqueCode();
      db.links[code] = {
        url,
        created: new Date().toISOString(),
        clicks: 0,
        stats: []
      };
      await saveDB(db);
      
      const shortUrl = `${event.headers.origin || event.headers.host || 'https://shorto.netlify.app'}/${code}`;
      return { statusCode: 200, headers, body: JSON.stringify({ short_url: shortUrl, code }) };
    }

    // POST /shorten/bulk
    if (path === '/shorten/bulk' && method === 'POST') {
      const { urls } = JSON.parse(event.body);
      const results = [];
      const errors = [];
      
      for (const url of urls) {
        try {
          new URL(url);
          const code = await generateUniqueCode();
          db.links[code] = {
            url,
            created: new Date().toISOString(),
            clicks: 0,
            stats: []
          };
          const shortUrl = `${event.headers.origin || event.headers.host || 'https://shorto.netlify.app'}/${code}`;
          results.push({ url, short_url: shortUrl, code });
        } catch (e) {
          errors.push({ url, error: 'Invalid URL' });
        }
      }
      
      await saveDB(db);
      return { statusCode: 200, headers, body: JSON.stringify({ results, errors }) };
    }

    // GET /urls
    if (path === '/urls' && method === 'GET') {
      const links = Object.entries(db.links).map(([code, data]) => ({
        code,
        short_url: `${event.headers.origin || event.headers.host || 'https://shorto.netlify.app'}/${code}`,
        original_url: data.url,
        clicks: data.clicks,
        created_at: data.created
      }));
      return { statusCode: 200, headers, body: JSON.stringify({ urls: links }) };
    }

    // GET /analytics
    if (path === '/analytics' && method === 'GET') {
      const totalLinks = Object.keys(db.links).length;
      const totalClicks = Object.values(db.links).reduce((sum, link) => sum + link.clicks, 0);
      
      const devices = {}, browsers = {}, os = {}, byDay = {}, byHour = Array(24).fill(0), countries = {};
      
      Object.values(db.links).forEach(link => {
        (link.stats || []).forEach(stat => {
          const device = stat.device || 'Unknown';
          const browser = stat.browser || 'Unknown';
          const osName = stat.os || 'Unknown';
          const country = stat.country || 'Unknown';
          
          devices[device] = (devices[device] || 0) + 1;
          browsers[browser] = (browsers[browser] || 0) + 1;
          os[osName] = (os[osName] || 0) + 1;
          countries[country] = (countries[country] || 0) + 1;
          
          const timestamp = stat.timestamp || stat.time;
          if (timestamp) {
            const date = new Date(timestamp).toISOString().slice(0, 10);
            byDay[date] = (byDay[date] || 0) + 1;
            const hour = new Date(timestamp).getHours();
            byHour[hour]++;
          }
        });
      });
      
      const byDayArray = Object.entries(byDay).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date));
      const byDeviceArray = Object.entries(devices).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
      const byBrowserArray = Object.entries(browsers).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
      const byCountryArray = Object.entries(countries).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
      
      return { statusCode: 200, headers, body: JSON.stringify({
        total_links: totalLinks,
        total_clicks: totalClicks,
        avg_clicks: totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0,
        by_day: byDayArray,
        by_device: byDeviceArray,
        by_browser: byBrowserArray,
        by_country: byCountryArray,
        by_hour: byHour,
        devices, browsers, operating_systems: os
      })};
    }

    // GET /geo
    if (path === '/geo' && method === 'GET') {
      const countries = {}, cities = {};
      Object.values(db.links).forEach(link => {
        (link.stats || []).forEach(stat => {
          const country = stat.country || 'Unknown';
          const city = stat.city || 'Unknown';
          countries[country] = (countries[country] || 0) + 1;
          cities[city] = (cities[city] || 0) + 1;
        });
      });
      
      const countriesArray = Object.entries(countries).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
      const citiesArray = Object.entries(cities).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
      
      return { statusCode: 200, headers, body: JSON.stringify({ countries: countriesArray, cities: citiesArray }) };
    }

    // POST /register
    if (path === '/register' && method === 'POST') {
      const { username, email, password } = JSON.parse(event.body);
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
      await saveDB(db);
      
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, token: 'token-' + userId, user }) };
    }

    // POST /login
    if (path === '/login' && method === 'POST') {
      const { username, email } = JSON.parse(event.body);
      const userId = Math.random().toString(36).substring(7);
      const apiToken = 'api_' + Math.random().toString(36).substring(2);
      
      const user = {
        id: userId,
        username: username || email || 'User',
        email: email || '',
        api_token: apiToken
      };
      
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, token: 'token-' + userId, user }) };
    }

    // GET /stats/:code
    const statsMatch = path.match(/^\/stats\/([^/]+)$/);
    if (statsMatch && method === 'GET') {
      const code = statsMatch[1];
      const link = db.links[code];
      if (!link) return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
      
      return { statusCode: 200, headers, body: JSON.stringify({
        code, url: link.url, clicks: link.clicks, created: link.created, stats: link.stats || []
      })};
    }

    // GET /clicks/:code
    const clicksMatch = path.match(/^\/clicks\/([^/]+)$/);
    if (clicksMatch && method === 'GET') {
      const code = clicksMatch[1];
      const link = db.links[code];
      if (!link) return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
      
      const byDay = {}, byHour = Array(24).fill(0), devices = {}, browsers = {}, os = {}, countries = {};
      
      (link.stats || []).forEach(stat => {
        const timestamp = stat.timestamp || stat.time;
        if (timestamp) {
          const date = new Date(timestamp).toISOString().slice(0, 10);
          byDay[date] = (byDay[date] || 0) + 1;
          const hour = new Date(timestamp).getHours();
          byHour[hour]++;
        }
        
        const device = stat.device || 'Unknown';
        const browser = stat.browser || 'Unknown';
        const osName = stat.os || 'Unknown';
        const country = stat.country || 'Unknown';
        
        devices[device] = (devices[device] || 0) + 1;
        browsers[browser] = (browsers[browser] || 0) + 1;
        os[osName] = (os[osName] || 0) + 1;
        countries[country] = (countries[country] || 0) + 1;
      });
      
      const byDayArray = Object.entries(byDay).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date));
      const devicesArray = Object.entries(devices).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
      const browsersArray = Object.entries(browsers).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
      const osArray = Object.entries(os).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
      const countriesArray = Object.entries(countries).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
      
      return { statusCode: 200, headers, body: JSON.stringify({
        by_day: byDayArray, by_hour: byHour, by_device: devicesArray,
        by_browser: browsersArray, by_os: osArray, by_country: countriesArray,
        recent_clicks: (link.stats || []).slice(-50).reverse()
      })};
    }

    // PUT /update/:code
    const updateMatch = path.match(/^\/update\/([^/]+)$/);
    if (updateMatch && method === 'PUT') {
      const code = updateMatch[1];
      const { url } = JSON.parse(event.body);
      if (!db.links[code]) return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
      
      db.links[code].url = url;
      await saveDB(db);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    // DELETE /delete/:code
    const deleteMatch = path.match(/^\/delete\/([^/]+)$/);
    if (deleteMatch && method === 'DELETE') {
      const code = deleteMatch[1];
      if (!db.links[code]) return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
      
      delete db.links[code];
      await saveDB(db);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
