const { getLinks, parseUserAgent } = require('./db');

exports.handler = async (event) => {
  const code = event.path.split('/').pop();
  const links = await getLinks();
  const link = await links.findOne({ code });

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

  await links.updateOne(
    { code },
    { 
      $inc: { clicks: 1 },
      $push: { stats: stat }
    }
  );

  return {
    statusCode: 302,
    headers: { Location: link.url },
    body: ''
  };
};
