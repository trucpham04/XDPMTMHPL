# Đồ án Xây dựng phần mềm theo mô hình phân lớp

## Hướng dẫn tải một phần của repository bằng Git

### Các bước thực hiện
#### 1. Clone repository nhưng không checkout toàn bộ
Mở terminal và chạy lệnh sau:
```sh
git clone --no-checkout https://github.com/trucpham04/XDPMTMHPL.git
```

#### 2. Di chuyển vào thư mục repository
```sh
cd XDPMTMHPL
```

#### 3. Khởi tạo chế độ sparse-checkout
```sh
git sparse-checkout init --cone
```
Lệnh này bật chế độ sparse-checkout.

#### 4. Chọn thư mục hoặc file cần tải
Ví dụ, để chỉ tải thư mục `frontend`, `user_service` và file `docker-compose.yml`, chạy:
```sh
git sparse-checkout set frontend user_service docker-compose.yml
```

#### 5. Hoàn tất quá trình checkout
```sh
git checkout
```
Lệnh này sẽ tải xuống các file và thư mục đã chọn.

