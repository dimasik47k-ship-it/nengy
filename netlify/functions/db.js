const { MongoClient } = require('mongodb');

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const DB_NAME = process.env.MONGODB_DB || 'shorto';

  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

async function getLinks() {
  const { db } = await connectToDatabase();
  return db.collection('links');
}

async function getUsers() {
  const { db } = await connectToDatabase();
  return db.collection('users');
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
  const links = await getLinks();
  let code = genCode();
  while (await links.findOne({ code })) {
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
  connectToDatabase,
  getLinks,
  getUsers,
  generateUniqueCode,
  parseUserAgent
};
