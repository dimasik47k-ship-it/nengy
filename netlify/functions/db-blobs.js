const { getStore } = require('@netlify/blobs');

async function getDB() {
  const store = getStore('shorto-db');
  const data = await store.get('database', { type: 'json' });
  return data || { links: {}, users: {} };
}

async function saveDB(db) {
  const store = getStore('shorto-db');
  await store.set('database', JSON.stringify(db));
}

function genCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function generateUniqueCode() {
  const db = await getDB();
  let code = genCode();
  while (db.links[code]) {
    code = genCode();
  }
  return code;
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

module.exports = {
  getDB,
  saveDB,
  generateUniqueCode,
  parseUserAgent
};
