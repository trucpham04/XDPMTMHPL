export interface User {
  id: number;
  email: string;
  password?: string; // Password thường không được trả về sau khi tạo hoặc đăng nhập
  firstName: string;
  lastName: string;
  dateOfBirth?: string | null; // Hoặc string nếu luôn có
  gender?: string | null; // Hoặc string nếu luôn có
  createdAt?: string; // Hoặc string nếu luôn có
  avatarUrl?: string | null; // Cho phép không có avatar
}