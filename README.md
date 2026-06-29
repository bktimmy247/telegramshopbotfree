# Bot Bán Hàng Telegram 24/7 - Free Demo

Đây là bản demo mã nguồn mở để học cách xây dựng một bot Telegram bán sản phẩm số tự động.

Mục tiêu của project là minh họa các thành phần cơ bản của một shop bot:

- danh mục sản phẩm,
- ví nội bộ demo,
- đơn hàng,
- stock/license mẫu,
- giao payload tự động,
- lưu dữ liệu bằng SQLite.

Project phù hợp cho mục đích học tập, nghiên cứu, demo sản phẩm và làm nền tảng để phát triển thêm.

## Tính năng trong bản demo

- Menu Telegram bằng nút bấm.
- Danh mục sản phẩm số.
- Ví demo.
- Nạp tiền demo bằng nút bấm.
- Mua sản phẩm bằng số dư demo.
- Tự động giao payload/license demo.
- Lưu users/products/stock/orders bằng SQLite.
- Lệnh `/admin` xem thống kê cơ bản.
- Một số module nâng cao được hiển thị ở trạng thái khóa để minh họa roadmap phát triển.

## Các module nâng cao đang khóa

Các module dưới đây chỉ là placeholder trong bản demo. Khi bấm vào, bot sẽ giải thích mục đích của module để người học hiểu kiến trúc tổng thể.

- Thanh toán VietQR/SePay/Casso.
- Import stock/license hàng loạt.
- Broadcast khách hàng.
- Dashboard doanh thu.
- Webhook bảo mật.
- Deploy 24/7.
- Backup/monitoring.
- Reseller/API.
- Đa ngôn ngữ.

Các module này chưa được triển khai trong bản free demo.

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

1. Gửi `/start` để mở menu.
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
- License/key phần mềm do bạn sở hữu.
- File tài liệu, checklist, script.
- Gói tư vấn/booking lịch.

Không khuyến khích dùng project để bán tài khoản crack/share, sản phẩm vi phạm bản quyền hoặc vi phạm điều khoản nền tảng.

## Roadmap kỹ thuật

Một bản triển khai đầy đủ có thể mở rộng thêm:

- Webhook thanh toán thật.
- Xác thực giao dịch và chống xử lý trùng.
- Admin dashboard.
- Import/export dữ liệu.
- Deploy VPS hoặc cloud.
- Backup database.
- Log và monitoring.
- Phân quyền admin/operator.

## Cấu trúc project

```text
src/
  bot.js      # Telegram bot handlers
  db.js       # SQLite schema + business logic
  smoke.js    # Local smoke test

.env.example
README.md
```

## Lưu ý bảo mật

- Không commit `.env`.
- Không commit database thật.
- Không đưa token bot lên GitHub.
- Không xử lý thanh toán thật nếu chưa có xác thực webhook và idempotency.

---

Bản demo này chỉ dùng cho học tập và thử nghiệm. Nếu dùng trong môi trường thật, cần rà soát bảo mật, thanh toán, backup và vận hành 24/7.
