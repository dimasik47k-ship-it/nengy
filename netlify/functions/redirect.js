const { getDB, saveDB, parseUserAgent } = require('./db-simple');

exports.handler = async (event) => {
  // Получаем код из пути
  let code = event.path.split('/').filter(Boolean).pop();
  
  // Если код это 'redirect', значит путь был /:code и код в следующем сегменте
  if (code === 'redirect' || code === '.netlify' || code === 'functions') {
    // Пробуем получить из rawUrl
    const urlParts = (event.rawUrl || event.path).split('/').filter(Boolean);
    code = urlParts[urlParts.length - 1];
  }
  
  const db = await getDB();
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
  
  await saveDB(db);

  return {
    statusCode: 302,
    headers: { Location: link.url },
    body: ''
  };
};
