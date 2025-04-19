export interface Post {
  id: number;
  content?: string | null;
  privacyLevel?: string | null;
  status?: string | null;
  createdAt: string;
  updatedAt: string;
  author?: Author | null;
}

export interface Author {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  fullName: string; // Được server trả về sẵn
}
