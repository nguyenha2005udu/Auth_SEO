# Báo cáo: NextAuth, phân quyền và SEO

Ngày thực hiện: 23/10/2026. Dự án mẫu LearnSpace, Next.js 15.5.28, Auth.js 5.0.0-beta.32, React 19, TypeScript strict. Tạo mới vì thư mục ban đầu không có mã nguồn đồ án.

## Các lớp bảo vệ

```mermaid
flowchart TD
    A[Trình duyệt gửi cookie httpOnly / SameSite] --> B[Middleware: xác thực JWT và kiểm tra role]
    B -->|Chưa có phiên| L[/login]
    B -->|user vào admin| F[/403]
    B --> C[Page: requirePermission trước khi lấy dữ liệu]
    C --> D[Server Action: requirePermission và zod]
    D --> E[Tầng dữ liệu: tự kiểm tra admin trước khi đọc hoặc ghi]
    E --> G[Kho dữ liệu demo phía server]
```

JWT mã hóa chứa id và role; session chỉ công khai dữ liệu cần cho giao diện. Credentials dùng hash bcrypt cost 12, kiểm tra schema và bộ đếm đăng nhập sai. GitHub OAuth luôn mặc định `user`; không cho client tự gửi role. Logout xóa cookie trong trình duyệt.

| Truy cập / thao tác | Khách | user | admin |
| --- | --- | --- | --- |
| Trang công khai | Cho phép | Cho phép | Cho phép |
| Dashboard | → login | Cho phép | Cho phép |
| Trang admin | → login | → 403 | Cho phép |
| Action xóa | Từ chối | Từ chối | Cho phép sau khi validate |

Trang `/dashboard/permissions` là trường hợp kiểm chứng quan trọng: Middleware cho user đi qua nhưng action xóa vẫn tự từ chối. Kiểm tra page và tầng dữ liệu cũng dùng chung chính sách `can()`.

## SEO và render

Trang chủ `/` dùng SSG, canonical `/`, ảnh OG, JSON-LD Organization. Hai trang `/products/1`, `/products/2` dùng ISR 60 giây, metadata động, canonical riêng, ảnh OG động 1200×630, JSON-LD Product/Offer và BreadcrumbList. Dashboard và admin dùng SSR theo phiên, noindex/nofollow. Có sitemap, robots, layout lồng, loading/error/not-found. Nội dung, canonical, OG và JSON-LD đã kiểm tra trực tiếp trong HTML trả về.

## Lighthouse trước và sau

Không có ứng dụng gốc để đo lịch sử trước triển khai. “Trước” ở đây là **bản đối chứng dựng từ cùng dự án**, bật `SEO_BASELINE=1` để bỏ description, metadata riêng/canonical và JSON-LD; giữ nguyên nội dung, CSS, chiến lược render và ảnh OG. Đây không phải phép so sánh React SPA với Next.js, cũng không phải điểm của đồ án cũ.

Đo bằng Lighthouse 13.5.0, Chrome headless, cấu hình mobile mặc định với simulated throttling, URL localhost, `next build` + `next start`, mỗi trang một lượt mỗi phiên bản. HTML/JSON gốc trong `reports/`; mốc thời gian UTC nằm trong JSON. Điểm có thể dao động theo tải máy; không suy ra quan hệ nhân quả từ chênh lệch nhỏ về Performance.

| Trang | Performance trước → sau | SEO trước → sau | LCP trước → sau | CLS trước → sau |
| --- | --- | --- | --- | --- |
| `/` | 100 → 100 | 91 → 100 | 1.92s → 1.83s | 0 → 0 |
| `/products/1` | 99 → 100 | 91 → 100 | 1.86s → 0.93s | 0 → 0 |

Accessibility 100 ở cả hai phiên bản. Best Practices trang chủ 96 (thiếu favicon gây 404), trang sản phẩm 100. Việc thiếu favicon không làm sai số điểm SEO đã ghi. SEO tăng chủ yếu nhờ thêm meta description; canonical và JSON-LD bổ sung ý nghĩa cho công cụ tìm kiếm nhưng không đồng nghĩa tự tăng điểm Lighthouse. LCP khác nhau có thể do tải máy, cache và simulated throttling; cần nhiều lượt đo để kết luận về hiệu năng.

Lighthouse SEO không kiểm tra đầy đủ JSON-LD và khả năng hiển thị rich result. Canonical và structured data được kiểm tra thêm bằng HTML nguồn; chưa xác minh bằng dịch vụ Google Rich Results Test. Không có URL deploy để chạy PageSpeed Insights và chưa có dữ liệu CrUX/INP từ người dùng thật. LCP ở đây là số đo lab; CLS bằng 0 trong các lượt đo.

## Kiểm thử và phạm vi bàn giao

- Build production và TypeScript strict thành công; không dùng `any` trong mã ứng dụng.
- Ba test ma trận quyền: guest, user và admin.
- Kiểm thử Chrome: mật khẩu sai, hai tài khoản đúng role, cookie httpOnly/SameSite, Middleware chặn khách/sai role, action user bị từ chối độc lập Middleware, input sai bị chặn, admin xóa thành công, logout, SEO nguồn và ảnh OG. 16 kiểm tra trình duyệt đều đạt ở lượt cuối; chi tiết lưu trong `reports/e2e.json`.
- `npm audit` sau khi override PostCSS bản vá: 0 lỗ hổng ở lần kiểm tra ngày 23/10/2026. Lockfile được bàn giao để tái lập dependency.
- GitHub OAuth đã tích hợp nhưng **chưa xác nhận đăng nhập thực tế**, vì chưa có OAuth Client ID/Secret. Hướng dẫn callback và cấu hình trong README.

Kho user tĩnh, rate limiter trong RAM, file JSON dùng cho demo một tiến trình; chưa phù hợp triển khai nhiều instance. Danh mục công khai cố định để minh họa SEO; thao tác xóa ảnh hưởng danh mục quản trị. JWT có hạn 1 giờ, thay đổi quyền trong kho chưa thu hồi token đã cấp. Khi đưa vào đồ án thật cần database, rate limiter dùng chung, cơ chế cập nhật/thu hồi quyền và bỏ tài khoản mẫu. Không có secret trong gói ZIP; chạy seed để tạo secret cục bộ.

## Tài liệu đối chiếu

Hai bộ slide do người dùng cung cấp: buổi 7 (SSG/SSR/ISR, App Router) và buổi 8 (đặc biệt các slide 22, 27, 39–42 về bảo vệ nhiều lớp, action và tiêu chí bài tập). Nội dung slide là tài liệu tham khảo; phạm vi triển khai theo bốn yêu cầu người dùng nêu.

- [Next.js — Authentication](https://nextjs.org/learn/dashboard-app/adding-authentication)
- [Next.js — Metadata và ảnh OG](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js — JSON-LD](https://nextjs.org/docs/app/guides/json-ld)
- [Auth.js — Credentials](https://authjs.dev/getting-started/providers/credentials)
