export interface User {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export interface SearchHistory {
  id: number;
  searchText: string;
  searcherId?: number; // nếu cần
  targetUser?:  User; // 👈 thêm cái này để tiện dùng
  user?: User;
  createdAt?: string; // nếu có dùng thời gian
}
