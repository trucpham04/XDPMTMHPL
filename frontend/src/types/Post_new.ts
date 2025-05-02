export interface MultiFile {
    url: string;
    type: 'image' | 'video';
  }
  
  export interface Post {
    id: number;
    userId: number;
    content: string;
    multiFile: MultiFile[];
    createdAt: Date;
    updatedAt: Date;
    likes: number;
    comments: number;
    shares: number;
    isLiked: boolean;
  }
  
  export interface SharedPost {
    sharedPostId: number;
    originalPostId: number;
    userId: number;
    createdAt: string;
    content: string;
    viewer: string;
    originalPost: Post;
  }
  
  export type FeedItem =
    | { type: "post"; data: Post }
    | { type: "share"; data: SharedPost };
  
  
  export interface PostRequest {
    userId: number;
    content: string;
    multiFile?: MultiFile[];
  }
  
  export interface Like {
    id: number;
    postId: number;
    userId: number;
    createdAt: Date;
  }
  
  export interface LikeRequest {
    userId: number;
  }
  
  export interface Comment {
    id: number;
    postId: number;
    userId: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface CommentRequest {
    userId: number;
    content: string;
  }
  
  export interface SharedPost {
    sharedPostId: number;
    originalPostId: number;
    userId: number;
  }
  
  export interface ShareRequest {
    userId: number;
    content?: string;
    viewer?: string;
  }
  