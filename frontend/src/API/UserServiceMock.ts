// src/API/UserServiceMock.ts
import { User } from "./UserServiceInterface";

// Hàm mock users giả lập kết quả từ backend
export const getAllUsers = async (name: string): Promise<{ data: User[] }> => {
  const mockUsers: User[] = [
    { id: 1, name: "Alice", avatarUrl: "https://i.pravatar.cc/40?img=1" },
    { id: 2, name: "Bob", avatarUrl: "https://i.pravatar.cc/40?img=2" },
    { id: 3, name: "Charlie", avatarUrl: "https://i.pravatar.cc/40?img=3" },
    { id: 4, name: "David", avatarUrl: "https://i.pravatar.cc/40?img=4" },
    { id: 5, name: "Eva", avatarUrl: "https://i.pravatar.cc/40?img=5" },
  ];

  const filtered = mockUsers.filter(user =>
    user.name.toLowerCase().includes(name.toLowerCase())
  );

  return { data: filtered };
};
