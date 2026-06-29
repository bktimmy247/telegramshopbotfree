const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data.sqlite');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  telegram_id TEXT PRIMARY KEY,
  first_name TEXT,
  username TEXT,
  balance INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  tag TEXT NOT NULL DEFAULT 'FREE',
  icon TEXT NOT NULL DEFAULT '🎁',
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS stock_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_slug TEXT NOT NULL,
  payload TEXT NOT NULL,
  sold_to TEXT,
  sold_at TEXT,
  FOREIGN KEY(product_slug) REFERENCES products(slug)
);
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  telegram_id TEXT NOT NULL,
  product_slug TEXT,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL,
  payload TEXT,
  created_at TEXT NOT NULL
);
`);

function now() { return new Date().toISOString(); }

function ensureUser(from) {
  const id = String(from.id);
  const existing = db.prepare('SELECT * FROM users WHERE telegram_id=?').get(id);
  if (existing) return existing;
  db.prepare('INSERT INTO users (telegram_id, first_name, username, balance, created_at) VALUES (?, ?, ?, 0, ?)')
    .run(id, from.first_name || '', from.username || '', now());
  return db.prepare('SELECT * FROM users WHERE telegram_id=?').get(id);
}

function seedDemoData() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM products').get().c;
  if (count > 0) return;
  const insertProduct = db.prepare('INSERT INTO products (slug, name, description, price, tag, icon) VALUES (?, ?, ?, ?, ?, ?)');
  insertProduct.run('prompt-pack', 'Prompt Pack bán hàng', '20 prompt mẫu để viết bài bán hàng, inbox, chăm khách.', 49000, 'DEMO', '🧲');
  insertProduct.run('ebook-agent', 'Ebook AI Agent nhập môn', 'Tài liệu PDF giới thiệu AI Agent, Vibe Working, Vibe Coding.', 99000, 'HOT', '📘');
  insertProduct.run('template-bot', 'Template bot Telegram', 'Bộ khung ý tưởng bot bán sản phẩm số 24/7.', 149000, 'NEW', '🤖');

  const insertStock = db.prepare('INSERT INTO stock_items (product_slug, payload) VALUES (?, ?)');
  for (const [slug, prefix] of [['prompt-pack','PROMPT-PACK'], ['ebook-agent','EBOOK-LINK'], ['template-bot','BOT-TEMPLATE']]) {
    for (let i = 1; i <= 5; i++) insertStock.run(slug, `${prefix}-DEMO-${String(i).padStart(3, '0')}`);
  }
}

function products() {
  return db.prepare(`
    SELECT p.*, COUNT(s.id) AS stock
    FROM products p
    LEFT JOIN stock_items s ON s.product_slug=p.slug AND s.sold_to IS NULL
    WHERE p.active=1
    GROUP BY p.slug
    ORDER BY p.id ASC
  `).all();
}

function product(slug) {
  return db.prepare('SELECT * FROM products WHERE slug=? AND active=1').get(slug);
}

function addDemoBalance(telegramId, amount) {
  db.prepare('UPDATE users SET balance = balance + ? WHERE telegram_id=?').run(amount, String(telegramId));
  const code = 'NAPDEMO' + Date.now();
  db.prepare('INSERT INTO orders (code, telegram_id, amount, status, created_at) VALUES (?, ?, ?, ?, ?)')
    .run(code, String(telegramId), amount, 'paid_demo', now());
  return db.prepare('SELECT * FROM users WHERE telegram_id=?').get(String(telegramId));
}

function buyProduct(telegramId, slug) {
  const tx = db.transaction(() => {
    const u = db.prepare('SELECT * FROM users WHERE telegram_id=?').get(String(telegramId));
    const p = product(slug);
    if (!p) return { ok: false, error: 'Sản phẩm không tồn tại.' };
    if (!u || u.balance < p.price) return { ok: false, error: 'Số dư không đủ. Bấm Nạp demo để thử.' };
    const stock = db.prepare('SELECT * FROM stock_items WHERE product_slug=? AND sold_to IS NULL ORDER BY id LIMIT 1').get(slug);
    if (!stock) return { ok: false, error: 'Sản phẩm tạm hết stock.' };
    db.prepare('UPDATE users SET balance = balance - ? WHERE telegram_id=?').run(p.price, String(telegramId));
    db.prepare('UPDATE stock_items SET sold_to=?, sold_at=? WHERE id=?').run(String(telegramId), now(), stock.id);
    const code = 'BUY' + Date.now();
    db.prepare('INSERT INTO orders (code, telegram_id, product_slug, amount, status, payload, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(code, String(telegramId), slug, p.price, 'delivered', stock.payload, now());
    return { ok: true, code, product: p, payload: stock.payload, balance: u.balance - p.price };
  });
  return tx();
}

function stats() {
  return {
    users: db.prepare('SELECT COUNT(*) AS c FROM users').get().c,
    products: db.prepare('SELECT COUNT(*) AS c FROM products').get().c,
    orders: db.prepare('SELECT COUNT(*) AS c FROM orders').get().c,
    revenueDemo: db.prepare("SELECT COALESCE(SUM(amount),0) AS s FROM orders WHERE status='delivered'").get().s,
  };
}

module.exports = { db, ensureUser, seedDemoData, products, product, addDemoBalance, buyProduct, stats };
