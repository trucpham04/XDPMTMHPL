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
  profilePicture?: string;
  profilePictureUrl?: string | null;
  bio?: string | null;
  cover_photo_url?: string | null;
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
}
