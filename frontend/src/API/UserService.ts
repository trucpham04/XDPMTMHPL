import axios from 'axios';
import { User } from './UserServiceInterface';

/**
 * Gọi API để lấy danh sách người dùng theo tên.
 * @param name - Tên người dùng cần tìm
 * @returns Promise<User[]> - Mảng người dùng khớp với tên
 */
export const getAllUsers = async (name: string): Promise<User[]> => {
  const response = await axios.get("/api/users", {
    params: { name }
  });

  // Kiểm tra dữ liệu trả về hợp lệ không
  if (!Array.isArray(response.data)) {
    console.error("API không trả về mảng:", response.data);
    return []; // Trả mảng rỗng nếu dữ liệu không đúng
  }

  return response.data as User[];
};
