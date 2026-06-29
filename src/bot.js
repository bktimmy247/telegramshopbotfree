require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { ensureUser, seedDemoData, products, product, addDemoBalance, buyProduct, stats } = require('./db');

seedDemoData();

const token = process.env.BOT_TOKEN;
const adminIds = (process.env.ADMIN_IDS || '').split(',').map(s => s.trim()).filter(Boolean);

function money(v) { return new Intl.NumberFormat('vi-VN').format(v) + 'đ'; }
function isAdmin(ctx) { return adminIds.includes(String(ctx.from?.id)); }


const LOCKED_MODULES = {
  vietqr: {
    title: '🏦 Thanh toán VietQR/SePay/Casso',
    benefit: 'Tự nhận chuyển khoản, match mã NAP, cộng tiền vào ví và chống cộng trùng giao dịch.',
    paid: 'Webhook bảo mật + idempotency + log transaction.'
  },
  import_stock: {
    title: '📥 Import stock hàng loạt',
    benefit: 'Dán/import hàng trăm key/link/license một lần thay vì nhập thủ công từng dòng.',
    paid: 'Admin flow nhập stock, kiểm tra trùng, thống kê tồn kho.'
  },
  broadcast: {
    title: '📣 Broadcast khách hàng',
    benefit: 'Gửi thông báo sản phẩm mới/ưu đãi tới khách đã mua hoặc từng quan tâm.',
    paid: 'Lọc tệp, chống spam, lịch gửi và đo phản hồi.'
  },
  dashboard: {
    title: '📊 Dashboard doanh thu',
    benefit: 'Xem doanh thu, đơn hàng, sản phẩm bán chạy, số dư khách hàng.',
    paid: 'Dashboard web/admin bảo mật, export báo cáo.'
  },
  deploy: {
    title: '🚀 Deploy 24/7',
    benefit: 'Đưa bot lên VPS/domain để chạy liên tục, không phụ thuộc máy cá nhân.',
    paid: 'PM2/systemd, Cloudflare Tunnel/domain, log, backup, restart tự động.'
  },
  security: {
    title: '🔐 Bảo mật webhook',
    benefit: 'Chặn webhook giả, bảo vệ token/API key và tránh mất tiền vì xử lý sai giao dịch.',
    paid: 'Verify signature/API key, env secret, rate limit, backup.'
  },
  reseller: {
    title: '🤝 Reseller/API',
    benefit: 'Cho cộng tác viên bán lại hoặc hệ thống khác gọi API tạo đơn/giao hàng.',
    paid: 'API key riêng, hạn mức, log reseller, chia hoa hồng.'
  },
  language: {
    title: '🌐 Đa ngôn ngữ',
    benefit: 'Đổi tiếng Việt/Anh hoặc cá nhân hóa lời nhắn theo từng tệp khách.',
    paid: 'i18n, template message và cấu hình theo ngành.'
  }
};

function mainMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('🎁 Sản phẩm', 'products'), Markup.button.callback('💰 Nạp demo', 'topup_demo')],
    [Markup.button.callback('👤 Tài khoản', 'account'), Markup.button.callback('📦 Đơn demo', 'orders_info')],
    [Markup.button.callback('🏦 VietQR tự động 🔒', 'locked:vietqr'), Markup.button.callback('📥 Import stock 🔒', 'locked:import_stock')],
    [Markup.button.callback('📣 Broadcast 🔒', 'locked:broadcast'), Markup.button.callback('📊 Dashboard 🔒', 'locked:dashboard')],
    [Markup.button.callback('🚀 Deploy 24/7 🔒', 'locked:deploy'), Markup.button.callback('🔐 Bảo mật 🔒', 'locked:security')],
    [Markup.button.callback('🤝 Reseller/API 🔒', 'locked:reseller'), Markup.button.callback('🌐 Đa ngôn ngữ 🔒', 'locked:language')],
    [Markup.button.callback('💬 Mở khóa bản chạy thật', 'paid_offer')],
  ]);
}

function productButtons() {
  const rows = products().map(p => [Markup.button.callback(`${p.icon} [${p.tag}] ${p.name} — ${money(p.price)} (${p.stock})`, `product:${p.slug}`)]);
  rows.push([Markup.button.callback('⬅️ Về menu', 'menu')]);
  return Markup.inlineKeyboard(rows);
}

function accountText(user) {
  return `👤 Tài khoản demo\n\nID: ${user.telegram_id}\nSố dư demo: ${money(user.balance)}\n\nBản free dùng ví demo để học flow. Muốn nhận tiền thật cần tích hợp VietQR/SePay/Casso + webhook bảo mật.`;
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
      `✅ Mua thành công!\n\nMã đơn: ${result.code}\nSản phẩm: ${result.product.name}\nPayload demo:\n\n\`${result.payload}\`\n\nSố dư còn lại: ${money(result.balance)}\n\nĐây là bản demo. Bản chạy thật sẽ giao file/key/link thật và ghi log đơn hàng đầy đủ.`,
      { parse_mode: 'Markdown', ...mainMenu() }
    );
  });

  bot.action('topup_demo', async (ctx) => {
    const u = ensureUser(ctx.from);
    const updated = addDemoBalance(u.telegram_id, 300000);
    await ctx.editMessageText(`💰 Đã nạp demo 300.000đ\n\nSố dư hiện tại: ${money(updated.balance)}\n\nBản free giả lập nạp tiền. Bản paid sẽ dùng VietQR/SePay/Casso webhook.`, mainMenu());
  });

  bot.action('account', async (ctx) => {
    const u = ensureUser(ctx.from);
    await ctx.editMessageText(accountText(u), mainMenu());
  });

  bot.action('orders_info', async (ctx) => {
    await ctx.editMessageText('📦 Bản free lưu đơn demo trong SQLite.\n\nTrong bản paid có thể thêm:\n- Trang admin xem đơn\n- Export Excel\n- Broadcast khách đã mua\n- Theo dõi doanh thu theo ngày', mainMenu());
  });

  bot.action(/locked:(.+)/, async (ctx) => {
    const key = ctx.match[1];
    const mod = LOCKED_MODULES[key];
    if (!mod) return ctx.answerCbQuery('Module đang khóa trong bản free', { show_alert: true });
    await ctx.editMessageText(
      `🔒 ${mod.title}

Module này được khóa trong bản free demo.

Trong bản chạy thật, nó giúp:
${mod.benefit}

Phần triển khai cần học/thực hành:
${mod.paid}

Muốn nhận checklist mở module này?
Comment/inbox: BOT247`,
      Markup.inlineKeyboard([
        [Markup.button.callback('🚀 Muốn bản chạy thật', 'paid_offer')],
        [Markup.button.callback('⬅️ Về menu', 'menu')],
      ])
    );
  });

  bot.action('paid_offer', async (ctx) => {
    await ctx.editMessageText(
      '🚀 Muốn bản chạy thật 24/7?\n\nBản triển khai thật sẽ có:\n✅ VietQR/SePay/Casso tự cộng tiền\n✅ Webhook bảo mật, chống trùng giao dịch\n✅ Admin thêm sản phẩm/stock\n✅ Deploy VPS/Cloudflare Tunnel\n✅ Backup dữ liệu\n✅ Cá nhân hóa theo ngành hàng\n\nInbox “BOT247” để nhận checklist và lộ trình triển khai.',
      mainMenu()
    );
  });

  bot.command('admin', async (ctx) => {
    if (!isAdmin(ctx)) return ctx.reply('Bạn không phải admin demo.');
    const s = stats();
    await ctx.reply(`📊 Admin demo\n\nUsers: ${s.users}\nProducts: ${s.products}\nOrders: ${s.orders}\nRevenue demo: ${money(s.revenueDemo)}\n\nBản free chỉ có stats cơ bản. Bản paid sẽ có dashboard/admin flow nâng cao.`);
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
