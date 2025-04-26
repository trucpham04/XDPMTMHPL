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
  bio?: string | null;
  cover_photo_url?: string | null;
}
