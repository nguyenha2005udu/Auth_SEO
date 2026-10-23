# LearnSpace — Bài thực hành Next.js nâng cao

Đọc theo buổi 7 (SSG/ISR/SSR, App Router) và buổi 8 (Auth.js, phân quyền nhiều lớp, SEO). Thư mục được cung cấp ban đầu không có dự án; đây là dự án mẫu độc lập, không phải bản sửa của đồ án có sẵn.

## Chạy dự án

Node.js 22.13+ (đã kiểm tra bằng Node 26), npm.

```sh
npm ci
npm run seed
# Chỉnh .env.local nếu cần GitHub và tên miền thật
npm run build
npm start
```

Mở http://localhost:3000. `npm run dev` dùng khi phát triển.

Tài khoản demo (chỉ dùng cho bài tập):

| Email | Mật khẩu | Vai trò |
| --- | --- | --- |
| admin@example.com | Admin@123456 | admin |
| user@example.com | User@123456 | user |

`npm run seed` sinh hash bcrypt cost 12 vào `lib/users.ts` và tạo khóa phiên ngẫu nhiên trong `.env.local` nếu chưa tồn tại. Không ghi đè cấu hình môi trường đã có. Không commit `.env.local`; `.env.example` chỉ có tên biến. Tài khoản demo là dữ liệu mẫu có chủ đích, cần thay khi triển khai thật.

## GitHub OAuth

Tạo OAuth App trong GitHub → Settings → Developer settings → OAuth Apps.

- Homepage URL: `http://localhost:3000`
- Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
- Điền `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` trong `.env.local` rồi build/chạy lại.
- Khi deploy, đổi `AUTH_URL`, `SITE_URL`, homepage và callback sang tên miền HTTPS thật. Không đặt secret dưới tiền tố `NEXT_PUBLIC_`.

OAuth mặc định luôn là `user`. Không cấp admin từ email do client gửi, OAuth profile hay form. Không bật tự động liên kết tài khoản Credentials và GitHub theo email. OAuth chưa được kiểm thử end-to-end do chưa có Client ID/Secret của người dùng.

## Mã nguồn chính

- `auth.config.ts`: cấu hình nhẹ dùng trong Middleware, JWT/session callbacks.
- `auth.ts`: GitHub + Credentials, bcrypt, zod, giới hạn 5 lần đăng nhập sai/email/phút.
- `types/next-auth.d.ts`: Session, User và JWT; `Role = 'admin' | 'user'`, không dùng `any`.
- `middleware.ts`: giải mã/xác thực phiên; `/dashboard/*` cần đăng nhập, `/admin/*` cần admin.
- `lib/permissions.ts`, `lib/guard.ts`: chính sách và kiểm tra tập trung.
- `app/admin/page.tsx`, `app/dashboard/page.tsx`: kiểm tra server trước khi render.
- `app/admin/actions.ts`: kiểm tra admin rồi validate ID bằng zod.
- `lib/data.ts`: tự kiểm tra quyền lần nữa trước khi đọc/ghi file.
- `/dashboard/permissions`: trang thử trực tiếp action bằng user. Middleware cho user truy cập dashboard nhưng action xóa vẫn phải từ chối.

Action xóa lưu ID vào `data/deleted.json`, làm mục đó biến mất trong danh mục quản trị. Hai khóa học công khai là dữ liệu minh họa cố định phục vụ đo SEO, không phải danh mục CRUD trực tiếp. Xóa `data/deleted.json` để khôi phục danh mục quản trị.

## Render và SEO

- `/`: SSG; metadata riêng, canonical, Open Graph image và JSON-LD Organization.
- `/products/1`, `/products/2`: ISR 60 giây, generateStaticParams, generateMetadata; canonical, ảnh OG động, Product/Offer và BreadcrumbList.
- `/dashboard`, `/admin`: SSR theo phiên; metadata noindex/nofollow.
- Có layout lồng, loading, error, not-found, sitemap và robots.
- Dữ liệu JSON-LD escape dấu `<`. Nội dung không cần JS client để công cụ tìm kiếm đọc được.

`SITE_URL` phải là tên miền thật trước khi nộp URL deploy; canonical localhost chỉ dùng khi chạy cục bộ.

## Kiểm chứng

```sh
npm run typecheck
npm test
# Chạy npm start ở terminal khác trước hai lệnh sau
npx playwright install chromium
node scripts/e2e.mjs
npm run audit:seo -- after
```

E2E dùng Chromium riêng của Playwright (cài bằng lệnh phía trên). Script Lighthouse nhận `CHROME_PATH` để đổi trình duyệt. Script E2E xóa dữ liệu mẫu trong `data/` sau khi chạy, chỉ dùng trên môi trường test. E2E cần cài dependency dev.

Bản đối chứng để tái đo:

```sh
# Dừng server đang chạy trước khi build
SEO_BASELINE=1 npm run build
SEO_BASELINE=1 npm start
# Terminal khác
npm run audit:seo -- before
# Dừng server rồi trở lại bản đầy đủ
npm run build
npm start
npm run audit:seo -- after
```

Biến `SEO_BASELINE` bỏ canonical, metadata riêng và JSON-LD. Cùng nội dung, CSS, SSG/ISR và ảnh OG để tách tác động SEO. Không đặt biến này ở môi trường bàn giao.

## Phạm vi demo

Kho người dùng tĩnh, giới hạn đăng nhập trong RAM và file JSON dùng cho học tập trên một tiến trình. Khi chạy nhiều instance cần database, bộ đếm dùng chung và truy vấn theo userId cho dữ liệu cá nhân. Phiên JWT hết hạn sau 1 giờ; thay đổi role trong kho mẫu chưa thu hồi token đã phát, cần đăng xuất/đăng nhập lại hoặc thêm phiên bản token/kiểm tra trạng thái tài khoản từ database. Chưa có deploy công khai, PageSpeed Insights, dữ liệu người dùng thật hoặc xác minh Google Rich Results Test.

Xem `BAO_CAO.md` và `reports/` để đọc số đo thực tế và giới hạn phép đo.
