import { Post, PostRequest, LikeRequest, Like, CommentRequest, Comment, SharedPost, ShareRequest } from "@/types/Post_new";
import apiClient from "./apiClient";

const serviceName = "post-service";

class PostService {
  /**
   * Tạo bài viết mới
   */
  async createPost(postRequest: PostRequest): Promise<Post> {
    try {
      return await apiClient.post<Post>(`${serviceName}/api/posts`, postRequest);
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  }

  /**
   * Lấy bài viết theo ID
   */
  async getPostById(postId: number): Promise<Post> {
    return apiClient.get<Post>(`${serviceName}/api/posts/${postId}`);
  }

  /**
   * Lấy tất cả bài viết của người dùng
   */
  async getPostsByUserId(userId: number): Promise<Post[]> {
    return apiClient.get<Post[]>(`${serviceName}/api/posts/user/${userId}`);
  }

  /**
   * Xoá bài viết
   */
  async deletePost(postId: number): Promise<void> {
    return apiClient.delete<void>(`${serviceName}/api/posts/${postId}`);
  }

  /**
   * Thích bài viết
   */
  async likePost(postId: number, likeRequest: LikeRequest): Promise<Like> {
    return apiClient.post<Like>(`${serviceName}/api/posts/${postId}/likes`, likeRequest);
  }

  /**
   * Bỏ thích bài viết
   */
  async unlikePost(postId: number, userId: number): Promise<void> {
    return apiClient.delete<void>(`${serviceName}/api/posts/${postId}/likes?userId=${userId}`);
  }

  /**
   * Đếm số lượt thích của bài viết
   */
  async countLikes(postId: number): Promise<number> {
    return apiClient.get<number>(`${serviceName}/api/posts/${postId}/likes/count`);
  }

  /**
   * Kiểm tra người dùng đã thích bài viết chưa
   */
  async checkUserLiked(postId: number, userId: number): Promise<boolean> {
    return apiClient.get<boolean>(`${serviceName}/api/posts/${postId}/likes/check?userId=${userId}`);
  }

  /**
   * Lấy tất cả lượt thích của bài viết
   */
  async getLikes(postId: number): Promise<Like[]> {
    return apiClient.get<Like[]>(`${serviceName}/api/posts/${postId}/likes`);
  }

  /**
   * Thêm bình luận cho bài viết
   */
  async addComment(postId: number, commentRequest: CommentRequest): Promise<Comment> {
    return apiClient.post<Comment>(`${serviceName}/api/comments/${postId}`, commentRequest);
  }

  /**
   * Xoá bình luận
   */
  async deleteComment(commentId: number): Promise<void> {
    return apiClient.delete<void>(`${serviceName}/api/comments/${commentId}`);
  }

  /**
   * Lấy tất cả bình luận của bài viết
   */
  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    return apiClient.get<Comment[]>(`${serviceName}/api/comments/post/${postId}`);
  }

  /**
   * Chia sẻ bài viết
   */
  async sharePost(postId: number, shareRequest: ShareRequest): Promise<SharedPost> {
    return apiClient.post<SharedPost>(`${serviceName}/api/posts/${postId}/shares`, {
      ...shareRequest,
      content: shareRequest.content || "",      // optional fallback
      viewer: shareRequest.viewer || "PUBLIC",  // optional fallback
    });
  }

  /**
   * Lấy tất cả bài viết đã chia sẻ
   */
  async getSharesByPostId(postId: number): Promise<SharedPost[]> {
    const shares = await apiClient.get<SharedPost[]>(`${serviceName}/api/posts/${postId}/shares`);
    return shares || [];
  }

  /**
   * Lấy tất cả bài viết đã chia sẻ bởi người dùng
   */
  async getSharesByUserId(userId: number): Promise<SharedPost[]> {
    const shares = await apiClient.get<SharedPost[]>(`${serviceName}/api/posts/${userId}/shares/user`);
    return shares || [];
  }

  /**
   * Xoá chia sẻ
   */
  async deleteShare(sharedPostId: number): Promise<void> {
    return apiClient.delete<void>(`${serviceName}/api/posts/shares/${sharedPostId}`);
  }
}

export const postService = new PostService();
export default postService;
