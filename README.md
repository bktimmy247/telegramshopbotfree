# Bot BÃ¡n HÃ ng Telegram 24/7 â€” Free Demo

ÄÃ¢y lÃ  báº£n demo mÃ£ nguá»“n má»Ÿ Ä‘á»ƒ há»c cÃ¡ch xÃ¢y dá»±ng má»™t bot Telegram bÃ¡n sáº£n pháº©m sá»‘ tá»± Ä‘á»™ng.

Má»¥c tiÃªu cá»§a project lÃ  minh há»a cÃ¡c thÃ nh pháº§n cÆ¡ báº£n cá»§a má»™t shop bot:

- danh má»¥c sáº£n pháº©m,
- vÃ­ ná»™i bá»™ demo,
- Ä‘Æ¡n hÃ ng,
- stock/license máº«u,
- giao payload tá»± Ä‘á»™ng,
- lÆ°u dá»¯ liá»‡u báº±ng SQLite.

Project phÃ¹ há»£p cho má»¥c Ä‘Ã­ch há»c táº­p, nghiÃªn cá»©u, demo sáº£n pháº©m vÃ  lÃ m ná»n táº£ng Ä‘á»ƒ phÃ¡t triá»ƒn thÃªm.

## TÃ­nh nÄƒng trong báº£n demo

- Menu Telegram báº±ng nÃºt báº¥m.
- Danh má»¥c sáº£n pháº©m sá»‘.
- VÃ­ demo.
- Náº¡p tiá»n demo báº±ng nÃºt báº¥m.
- Mua sáº£n pháº©m báº±ng sá»‘ dÆ° demo.
- Tá»± Ä‘á»™ng giao payload/license demo.
- LÆ°u users/products/stock/orders báº±ng SQLite.
- Lá»‡nh `/admin` xem thá»‘ng kÃª cÆ¡ báº£n.
- Má»™t sá»‘ module nÃ¢ng cao Ä‘Æ°á»£c hiá»ƒn thá»‹ á»Ÿ tráº¡ng thÃ¡i khÃ³a Ä‘á»ƒ minh há»a roadmap phÃ¡t triá»ƒn.

## CÃ¡c module nÃ¢ng cao Ä‘ang khÃ³a

CÃ¡c module dÆ°á»›i Ä‘Ã¢y chá»‰ lÃ  placeholder trong báº£n demo. Khi báº¥m vÃ o, bot sáº½ giáº£i thÃ­ch má»¥c Ä‘Ã­ch cá»§a module Ä‘á»ƒ ngÆ°á»i há»c hiá»ƒu kiáº¿n trÃºc tá»•ng thá»ƒ.

- Thanh toÃ¡n VietQR/SePay/Casso.
- Import stock/license hÃ ng loáº¡t.
- Broadcast khÃ¡ch hÃ ng.
- Dashboard doanh thu.
- Webhook báº£o máº­t.
- Deploy 24/7.
- Backup/monitoring.
- Reseller/API.
- Äa ngÃ´n ngá»¯.

CÃ¡c module nÃ y chÆ°a Ä‘Æ°á»£c triá»ƒn khai trong báº£n free demo.

## CÃ i Ä‘áº·t nhanh

```bash
npm install
cp .env.example .env
```

Sá»­a `.env`:

```env
BOT_TOKEN=token_botfather_cua_ban
ADMIN_IDS=telegram_id_cua_ban
```

Cháº¡y bot:

```bash
npm start
```

Test core flow khÃ´ng cáº§n Telegram token:

```bash
npm run smoke
```

## Flow tráº£i nghiá»‡m

1. Gá»­i `/start` Ä‘á»ƒ má»Ÿ menu.
2. Báº¥m **Sáº£n pháº©m**.
3. Chá»n sáº£n pháº©m.
4. Náº¿u thiáº¿u sá»‘ dÆ°, báº¥m **Náº¡p demo**.
5. Mua sáº£n pháº©m.
6. Bot giao payload/license demo tá»± Ä‘á»™ng.
7. Admin dÃ¹ng `/admin` xem sá»‘ liá»‡u cÆ¡ báº£n.

## Gá»£i Ã½ sáº£n pháº©m sá»‘ phÃ¹ há»£p

- Ebook / PDF.
- Template Notion/Canva/Prompt.
- Link khÃ³a há»c riÃªng tÆ°.
- License/key pháº§n má»m do báº¡n sá»Ÿ há»¯u.
- File tÃ i liá»‡u, checklist, script.
- GÃ³i tÆ° váº¥n/booking lá»‹ch.

KhÃ´ng khuyáº¿n khÃ­ch dÃ¹ng project Ä‘á»ƒ bÃ¡n tÃ i khoáº£n crack/share, sáº£n pháº©m vi pháº¡m báº£n quyá»n hoáº·c vi pháº¡m Ä‘iá»u khoáº£n ná»n táº£ng.

## Roadmap ká»¹ thuáº­t

Má»™t báº£n triá»ƒn khai Ä‘áº§y Ä‘á»§ cÃ³ thá»ƒ má»Ÿ rá»™ng thÃªm:

- Webhook thanh toÃ¡n tháº­t.
- XÃ¡c thá»±c giao dá»‹ch vÃ  chá»‘ng xá»­ lÃ½ trÃ¹ng.
- Admin dashboard.
- Import/export dá»¯ liá»‡u.
- Deploy VPS hoáº·c cloud.
- Backup database.
- Log vÃ  monitoring.
- PhÃ¢n quyá»n admin/operator.

## Cáº¥u trÃºc project

```text
src/
  bot.js      # Telegram bot handlers
  db.js       # SQLite schema + business logic
  smoke.js    # Local smoke test


.env.example
README.md
```

## LÆ°u Ã½ báº£o máº­t

- KhÃ´ng commit `.env`.
- KhÃ´ng commit database tháº­t.
- KhÃ´ng Ä‘Æ°a token bot lÃªn GitHub.
- KhÃ´ng xá»­ lÃ½ thanh toÃ¡n tháº­t náº¿u chÆ°a cÃ³ xÃ¡c thá»±c webhook vÃ  idempotency.

---

Báº£n demo nÃ y chá»‰ dÃ¹ng cho há»c táº­p vÃ  thá»­ nghiá»‡m. Náº¿u dÃ¹ng trong mÃ´i trÆ°á»ng tháº­t, cáº§n rÃ  soÃ¡t báº£o máº­t, thanh toÃ¡n, backup vÃ  váº­n hÃ nh 24/7.

