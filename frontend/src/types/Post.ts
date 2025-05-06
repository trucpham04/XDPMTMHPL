import { User } from "./User";

export interface MultiFile {
  url: string;
  type: "image" | "video";
}

export interface Post {
  postId: number;
  userId: number;
  content: string;
  multiFile: MultiFile[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  viewer: string;
  author: User;
}

export interface SharedPost {
  sharedPostId: number;
  originalPostId: number;
  userId: number;
  createdAt: string;
  content: string;
  viewer: string;
  originalPost: Post;
  author: User;
}

export type FeedItem =
  | { type: "post"; data: Post }
  | { type: "share"; data: SharedPost };

export interface PostRequest {
  userId: number;
  content: string;
  multiFile?: MultiFile[];
  viewer: string;
}

export interface Like {
  likeId: number;
  postId: number;
  userId: number;
  createdAt: string;
}

export interface LikeRequest {
  userId: number;
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface CommentRequest {
  userId: number;
  content: string;
}

export interface ShareRequest {
  userId: number;
  content?: string;
  viewer?: string;
}
