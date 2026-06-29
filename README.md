# Bot Bán Hàng Telegram 24/7 — Free Demo

Đây là bản **free/open-source demo** để học cách tạo một bot Telegram bán sản phẩm số tự động bằng AI Agent.

> Mục tiêu của bản này: giúp người mới nhìn thấy flow thật — xem sản phẩm, nạp tiền demo, mua hàng, nhận key/link demo tự động.

## Demo có gì?

- Menu Telegram giống bản shop bot production.
- Danh mục sản phẩm số.
- Ví nội bộ demo.
- Nạp tiền demo bằng nút bấm.
- Mua sản phẩm bằng số dư demo.
- Tự động giao payload/license demo.
- Lưu users/products/stock/orders bằng SQLite.
- Lệnh `/admin` xem thống kê cơ bản.
- Các module production có biểu tượng 🔒 để người học thấy roadmap bản chạy thật.

## Bản free KHÔNG có gì?

Bản này cố ý để các phần production dưới dạng **module khóa 🔒**. Khi người dùng bấm vào, bot sẽ giải thích module đó làm được gì và CTA về từ khóa `BOT247`.

Các module khóa gồm:

- VietQR/SePay/Casso webhook nhận tiền thật.
- Import stock/license hàng loạt.
- Broadcast/segment khách hàng.
- Dashboard doanh thu.
- Domain/webhook bảo mật.
- Deploy VPS chạy 24/7.
- Backup/monitoring production.
- Reseller/API.
- Đa ngôn ngữ.

Lưu ý: Không để nút chết. Nút khóa phải phản hồi rõ ràng để người dùng hiểu đây là giới hạn có chủ đích, không phải bot lỗi.

Các phần đó nằm trong bản workshop/mentoring **Bot Bán Hàng 24/7 bằng AI Agent**.

## Cài đặt nhanh

```bash
npm install
cp .env.example .env
```

Sửa `.env`:

```env
BOT_TOKEN=token_botfather_cua_ban
ADMIN_IDS=telegram_id_cua_ban
```

Chạy bot:

```bash
npm start
```

Test core flow không cần Telegram token:

```bash
npm run smoke
```

## Flow trải nghiệm

1. `/start` để mở menu.
2. Bấm **Sản phẩm**.
3. Chọn sản phẩm.
4. Nếu thiếu số dư, bấm **Nạp demo**.
5. Mua sản phẩm.
6. Bot giao payload/license demo tự động.
7. Admin dùng `/admin` xem số liệu cơ bản.

## Gợi ý sản phẩm số phù hợp

- Ebook / PDF.
- Template Notion/Canva/Prompt.
- Link khóa học riêng tư.
- License/key phần mềm tự sở hữu.
- File tài liệu, checklist, script.
- Gói tư vấn/booking lịch.

Không khuyến khích bán tài khoản crack/share hoặc sản phẩm vi phạm điều khoản nền tảng.

## Muốn bản chạy thật 24/7?

Bản triển khai thật cần thêm:

- Tích hợp VietQR/SePay/Casso.
- Webhook xác thực và chống trùng giao dịch.
- Domain hoặc Cloudflare Tunnel.
- VPS/PM2/systemd.
- Admin nhập stock, ẩn sản phẩm, broadcast.
- Backup SQLite/Postgres.
- Cá nhân hóa theo ngành hàng.

Nếu muốn nhận checklist triển khai bản thật, inbox/comment: **BOT247**.

## Định vị cho video/phễu

Tiêu đề gợi ý:

> Tôi open-source bot Telegram bán hàng tự động 24/7 — ai không biết code cũng có thể học cách vận hành bằng AI Agent

CTA:

> Muốn nhận bộ checklist + video setup miễn phí? Comment `BOT247`.

---

Bản demo này được thiết kế làm “chim mồi”: đủ để học và thử, nhưng vẫn để lại nhu cầu rõ ràng cho phần triển khai production.
