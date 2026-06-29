# Telegram Shop Bot 24/7 - Free Demo

Day la ban demo ma nguon mo de hoc cach xay dung mot bot Telegram ban san pham so tu dong.

Muc tieu cua project la minh hoa cac thanh phan co ban cua mot shop bot:

- danh muc san pham,
- vi noi bo demo,
- don hang,
- stock/license mau,
- giao payload tu dong,
- luu du lieu bang SQLite.

Project phu hop cho muc dich hoc tap, nghien cuu, demo san pham va lam nen tang de phat trien them.

## Tinh nang trong ban demo

- Menu Telegram bang nut bam.
- Danh muc san pham so.
- Vi demo.
- Nap tien demo bang nut bam.
- Mua san pham bang so du demo.
- Tu dong giao payload/license demo.
- Luu users/products/stock/orders bang SQLite.
- Lenh `/admin` xem thong ke co ban.
- Mot so module nang cao duoc hien thi o trang thai khoa de minh hoa roadmap phat trien.

## Cac module nang cao dang khoa

Cac module duoi day chi la placeholder trong ban demo. Khi bam vao, bot se giai thich muc dich cua module de nguoi hoc hieu kien truc tong the.

- Thanh toan VietQR/SePay/Casso.
- Import stock/license hang loat.
- Broadcast khach hang.
- Dashboard doanh thu.
- Webhook bao mat.
- Deploy 24/7.
- Backup/monitoring.
- Reseller/API.
- Da ngon ngu.

Cac module nay chua duoc trien khai trong ban free demo.

## Cai dat nhanh

```bash
npm install
cp .env.example .env
```

Sua `.env`:

```env
BOT_TOKEN=token_botfather_cua_ban
ADMIN_IDS=telegram_id_cua_ban
```

Chay bot:

```bash
npm start
```

Test core flow khong can Telegram token:

```bash
npm run smoke
```

## Flow trai nghiem

1. Gui `/start` de mo menu.
2. Bam **San pham**.
3. Chon san pham.
4. Neu thieu so du, bam **Nap demo**.
5. Mua san pham.
6. Bot giao payload/license demo tu dong.
7. Admin dung `/admin` xem so lieu co ban.

## Goi y san pham so phu hop

- Ebook / PDF.
- Template Notion/Canva/Prompt.
- Link khoa hoc rieng tu.
- License/key phan mem do ban so huu.
- File tai lieu, checklist, script.
- Goi tu van/booking lich.

Khong khuyen khich dung project de ban tai khoan crack/share, san pham vi pham ban quyen hoac vi pham dieu khoan nen tang.

## Roadmap ky thuat

Mot ban trien khai day du co the mo rong them:

- Webhook thanh toan that.
- Xac thuc giao dich va chong xu ly trung.
- Admin dashboard.
- Import/export du lieu.
- Deploy VPS hoac cloud.
- Backup database.
- Log va monitoring.
- Phan quyen admin/operator.

## Cau truc project

```text
src/
  bot.js      # Telegram bot handlers
  db.js       # SQLite schema + business logic
  smoke.js    # Local smoke test

.env.example
README.md
```

## Luu y bao mat

- Khong commit `.env`.
- Khong commit database that.
- Khong dua token bot len GitHub.
- Khong xu ly thanh toan that neu chua co xac thuc webhook va idempotency.

---

Ban demo nay chi dung cho hoc tap va thu nghiem. Neu dung trong moi truong that, can ra soat bao mat, thanh toan, backup va van hanh 24/7.
