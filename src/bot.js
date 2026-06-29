require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { ensureUser, seedDemoData, products, product, addDemoBalance, buyProduct, stats } = require('./db');

seedDemoData();

const token = process.env.BOT_TOKEN;
const adminIds = (process.env.ADMIN_IDS || '').split(',').map(s => s.trim()).filter(Boolean);

function money(v) { return new Intl.NumberFormat('vi-VN').format(v) + 'đ'; }
function isAdmin(ctx) { return adminIds.includes(String(ctx.from?.id)); }


function mainMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('🎁 Sản phẩm', 'products'), Markup.button.callback('💰 Nạp demo', 'topup_demo')],
    [Markup.button.callback('👤 Tài khoản', 'account'), Markup.button.callback('📦 Đơn demo', 'orders_info')],
    [Markup.button.callback('🏦 VietQR tự động', 'locked:vietqr'), Markup.button.callback('📥 Import stock', 'locked:import_stock')],
    [Markup.button.callback('📣 Broadcast', 'locked:broadcast'), Markup.button.callback('📊 Dashboard', 'locked:dashboard')],
    [Markup.button.callback('🚀 Deploy 24/7', 'locked:deploy'), Markup.button.callback('🔐 Bảo mật', 'locked:security')],
    [Markup.button.callback('🤝 Reseller/API', 'locked:reseller'), Markup.button.callback('🌐 Đa ngôn ngữ', 'locked:language')],
  ]);
}

function productButtons() {
  const rows = products().map(p => [Markup.button.callback(`${p.icon} [${p.tag}] ${p.name} — ${money(p.price)} (${p.stock})`, `product:${p.slug}`)]);
  rows.push([Markup.button.callback('⬅️ Về menu', 'menu')]);
  return Markup.inlineKeyboard(rows);
}

function accountText(user) {
  return `👤 Tài khoản demo\n\nID: ${user.telegram_id}\nSố dư demo: ${money(user.balance)}\n\nBản demo dùng ví mô phỏng để học flow đặt hàng và giao payload tự động.`;
}

function register(bot) {
  bot.start(async (ctx) => {
    const u = ensureUser(ctx.from);
    await ctx.reply(
      `🤖 Chào ${ctx.from.first_name || 'bạn'}!\n\nĐây là bot bán sản phẩm số 24/7 bản FREE DEMO.\nBạn có thể xem sản phẩm, nạp tiền demo và mua thử để hiểu flow tự động giao hàng.`,
      mainMenu()
    );
  });

  bot.action('menu', async (ctx) => {
    ensureUser(ctx.from);
    await ctx.editMessageText('🏠 Menu chính — Bot bán hàng 24/7 bản free demo', mainMenu());
  });

  bot.action('products', async (ctx) => {
    ensureUser(ctx.from);
    await ctx.editMessageText('🎁 Danh sách sản phẩm demo\n\nChọn một sản phẩm để xem chi tiết:', productButtons());
  });

  bot.action(/product:(.+)/, async (ctx) => {
    ensureUser(ctx.from);
    const slug = ctx.match[1];
    const p = product(slug);
    if (!p) return ctx.answerCbQuery('Sản phẩm không tồn tại');
    const stock = products().find(x => x.slug === slug)?.stock || 0;
    await ctx.editMessageText(
      `${p.icon} ${p.name}\n\n${p.description}\n\nGiá: ${money(p.price)}\nStock demo: ${stock}\n\nBấm mua để nhận payload/license demo tự động.`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`✅ Mua ${money(p.price)}`, `buy:${p.slug}`)],
        [Markup.button.callback('⬅️ Danh sách', 'products')],
      ])
    );
  });

  bot.action(/buy:(.+)/, async (ctx) => {
    ensureUser(ctx.from);
    const result = buyProduct(ctx.from.id, ctx.match[1]);
    if (!result.ok) return ctx.answerCbQuery(result.error, { show_alert: true });
    await ctx.editMessageText(
      `✅ Mua thành công!\n\nMã đơn: ${result.code}\nSản phẩm: ${result.product.name}\nPayload demo:\n\n\`${result.payload}\`\n\nSố dư còn lại: ${money(result.balance)}\n\nĐây là bản demo minh họa flow giao payload tự động.`, 
      { parse_mode: 'Markdown', ...mainMenu() }
    );
  });

  bot.action('topup_demo', async (ctx) => {
    const u = ensureUser(ctx.from);
    const updated = addDemoBalance(u.telegram_id, 300000);
    await ctx.editMessageText(`💰 Đã nạp demo 300.000đ\n\nSố dư hiện tại: ${money(updated.balance)}\n\nĐây là giao dịch mô phỏng trong bản demo.`, mainMenu());
  });

  bot.action('account', async (ctx) => {
    const u = ensureUser(ctx.from);
    await ctx.editMessageText(accountText(u), mainMenu());
  });

  bot.action('orders_info', async (ctx) => {
    await ctx.editMessageText('📦 Bản demo lưu đơn hàng trong SQLite.\n\nCác module thống kê/export/broadcast đang ở trạng thái khóa trong bản demo.', mainMenu());
  });

  bot.action(/locked:(.+)/, async (ctx) => {
    await ctx.answerCbQuery('T\u00ednh n\u0103ng ch\u01b0a m\u1edf kho\u00e1.', { show_alert: true });
  });

  bot.command('admin', async (ctx) => {
    if (!isAdmin(ctx)) return ctx.reply('Bạn không phải admin demo.');
    const s = stats();
    await ctx.reply(`📊 Admin demo\n\nUsers: ${s.users}\nProducts: ${s.products}\nOrders: ${s.orders}\nRevenue demo: ${money(s.revenueDemo)}\n\nBản demo chỉ có thống kê cơ bản.`);
  });
}

if (require.main === module) {
  if (!token) {
    console.error('Missing BOT_TOKEN. Copy .env.example to .env and set BOT_TOKEN.');
    process.exit(1);
  }
  const bot = new Telegraf(token);
  register(bot);
  bot.catch((err, ctx) => {
    console.error('Bot handler error:', err?.message || err);
    console.error('Update:', ctx?.updateType);
  });

  (async () => {
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });
    await bot.launch();
    console.log('Telegram shop bot FREE demo is running...');
  })().catch((err) => {
    console.error('Bot launch failed:', err?.message || err);
    process.exit(1);
  });

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

module.exports = { register, mainMenu, productButtons };
