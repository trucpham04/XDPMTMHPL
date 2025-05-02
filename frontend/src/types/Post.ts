import { User } from "./User";

export interface Post {
  id: number;
  user: User;
  content: string;
  imageUrls: string[];
  videoUrls: string[];
  createdAt: Date;
  updatedAt: Date;
  likes?: number;
  comments?: number;
  shares?: number;
}

export interface Comment {
  id: number;
  post_id: number;
  user: User;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
