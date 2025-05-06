# Đồ án Xây dựng phần mềm theo mô hình phân lớp

## Yêu cầu hệ thống

### 1. Yêu cầu phần cứng

- **RAM**: Tối thiểu 8GB, khuyến nghị 16GB để đảm bảo hiệu suất khi chạy Docker và các dịch vụ liên quan.
- **CPU**: Tối thiểu 2GHz, khuyến nghị 3GHz hoặc cao hơn để xử lý nhanh các tác vụ Back-end và Front-end.
- **Dung lượng ổ cứng**: Tối thiểu 10GB để lưu trữ mã nguồn, file âm nhạc và video, và các container Docker.
- **Kết nối mạng**: Cần kết nối Internet ổn định để tải các dependency, truy cập Cloudinary (lưu trữ file âm nhạc và video).

### 2. Yêu cầu phần mềm

- **Hệ điều hành**: Hỗ trợ Windows 10/11, Linux (Ubuntu 20.04+), hoặc macOS (12+).  
  *Lưu ý: Hướng dẫn bên dưới tập trung cho hệ điều hành Windows.*
- **Phần mềm cần cài đặt trước**:
  - [Docker Desktop](https://www.docker.com/products/docker-desktop): Dùng để chạy ứng dụng trong container.
  - Trình duyệt hiện đại: Google Chrome (90+), Firefox (85+), hoặc Microsoft Edge (90+).

---

## Hướng dẫn cài đặt và chạy ứng dụng với Docker

### 1. Cài đặt Docker Desktop

- Truy cập trang chính thức của Docker: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
- Tải và cài đặt Docker Desktop cho Windows:
  - Yêu cầu **Windows 10/11 Pro hoặc Enterprise**.
  - Nếu dùng **Windows Home**, cần bật **WSL 2**.
- Sau khi cài đặt, khởi động Docker Desktop và đảm bảo Docker đang chạy (biểu tượng Docker xuất hiện trên thanh taskbar).

---

### 2. Clone mã nguồn từ repository

Mở **Command Prompt** hoặc **PowerShell**, sau đó thực hiện:

```bash
git clone https://github.com/trucpham04/XDPMTMHPL.git
cd XDPMTMHPL
````

---

### 3. Chạy ứng dụng bằng Docker

Thực hiện lệnh sau để build và khởi động ứng dụng:

```bash
docker-compose up --build
```

Lệnh này sẽ:

* Build các container cho **Front-end** và **Back-end**.
* Khởi chạy ứng dụng với cấu hình từ file `docker-compose.yml`.

---

### 4. Truy cập ứng dụng

* **Front-end**: [http://localhost:5173](http://localhost:5173)
