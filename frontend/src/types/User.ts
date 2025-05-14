export interface User {
  id: number;
  username?: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  dateOfBirth?: string | null;
  gender?: string | null;
  createdAt?: string;
  requestTime?: string;
  mutualFriends?: number;
  // createdAt?: number[];
  profilePicture?: string;
  profilePictureUrl?: string | null;
  bio?: string | null;
  coverPhotoUrl?: string | null;
  isActive?: boolean;
  roles: {
    id: number;
    name: string;
  }[];
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  profilePictureUrl?: string;
  coverPhotoUrl?: string;
}
