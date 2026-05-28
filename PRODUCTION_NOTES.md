# Ghi chú Triển khai Thực tế (Production Notes)

Danh sách các công việc bảo mật và cấu hình bắt buộc phải hoàn thiện trước khi đưa dự án lên máy chủ Production:

## 1. Bảo mật Docker Compose (`docker-compose.yml`)
- **[QUAN TRỌNG] Đóng cổng Database**: Xóa phần `ports` (khai báo `5432:5432`) của container `db`. Database chỉ nên được gọi từ mạng nội bộ bởi `backend`, tuyệt đối không mở ra ngoài Internet.
- **[QUAN TRỌNG] Đóng cổng Redis**: Xóa phần `ports` (khai báo `6379:6379`) của container `cache`.
- **Mật khẩu Database**: Thay đổi `POSTGRES_PASSWORD: exam_password` thành một mật khẩu mạnh và truyền vào thông qua biến môi trường (hoặc Docker Secrets).

## 2. Bảo mật Backend & Frontend
- **JWT Secret**: Biến `JWT_SECRET` đã được cấu hình chế độ STRICT. Hệ thống sẽ **báo lỗi sập ngang (PANIC)** nếu thiếu biến này trong file `.env`. Đảm bảo file `.env` trên Server phải có giá trị này.
- Thay đổi `DATABASE_URL` trong `.env` trên Server sao cho khớp với mật khẩu mới.
