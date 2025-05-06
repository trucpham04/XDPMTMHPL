import {
  Post,
  PostRequest,
  LikeRequest,
  Like,
  CommentRequest,
  Comment,
  SharedPost,
  ShareRequest,
} from "@/types/Post";
import apiClient from "./apiClient";

const serviceName = "post-service";

class PostService {
  /**
   * Tạo bài viết mới
   */
  async createPost(postRequest: PostRequest): Promise<Post> {
    try {
      return await apiClient.post<Post>(
        `${serviceName}/api/posts`,
        postRequest,
      );
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
    return apiClient.post<Like>(
      `${serviceName}/api/posts/${postId}/likes`,
      likeRequest,
    );
  }

  /**
   * Bỏ thích bài viết
   */
  async unlikePost(postId: number, userId: number): Promise<void> {
    return apiClient.delete<void>(
      `${serviceName}/api/posts/${postId}/likes?userId=${userId}`,
    );
  }

  /**
   * Đếm số lượt thích của bài viết
   */
  async countLikes(postId: number): Promise<number> {
    return apiClient.get<number>(
      `${serviceName}/api/posts/${postId}/likes/count`,
    );
  }

  /**
   * Kiểm tra người dùng đã thích bài viết chưa
   */
  async checkUserLiked(postId: number, userId: number): Promise<boolean> {
    return apiClient.get<boolean>(
      `${serviceName}/api/posts/${postId}/likes/check?userId=${userId}`,
    );
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
  async addComment(
    postId: number,
    commentRequest: CommentRequest,
  ): Promise<Comment> {
    return apiClient.post<Comment>(
      `${serviceName}/api/posts/${postId}/comments`,
      commentRequest,
    );
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
    return apiClient.get<Comment[]>(
      `${serviceName}/api/posts/${postId}/comments`,
    );
  }

  /**
   * Chia sẻ bài viết
   */
  async sharePost(
    postId: number,
    shareRequest: ShareRequest,
  ): Promise<SharedPost> {
    return apiClient.post<SharedPost>(
      `${serviceName}/api/posts/${postId}/shares`,
      {
        ...shareRequest,
        content: shareRequest.content || "", // optional fallback
        viewer: shareRequest.viewer || "PUBLIC", // optional fallback
      },
    );
  }

  /**
   * Lấy tất cả bài viết đã chia sẻ
   */
  async getSharesByPostId(postId: number): Promise<SharedPost[]> {
    const shares = await apiClient.get<SharedPost[]>(
      `${serviceName}/api/posts/${postId}/shares`,
    );
    return shares || [];
  }

  /**
   * Lấy tất cả bài viết đã chia sẻ bởi người dùng
   */
  async getSharesByUserId(userId: number): Promise<SharedPost[]> {
    const shares = await apiClient.get<SharedPost[]>(
      `${serviceName}/api/posts/shares/user/${userId}`,
    );
    return shares || [];
  }

  /**
   * Xoá chia sẻ
   */
  async deleteShare(postId: number, sharedPostId: number): Promise<void> {
    return apiClient.delete<void>(
      `${serviceName}/api/posts/${postId}/shares/${sharedPostId}`,
    );
  }

  /**
   * Tìm kiếm bài viết
   */
  async searchPosts(keyword: string): Promise<Post[]> {
    return apiClient.get<Post[]>(`${serviceName}/api/posts/search`, {
      params: { keyword },
    });
  }

  /**
   * Cập nhật bài viết
   */
  async updatePost(postId: number, postRequest: PostRequest): Promise<Post> {
    return apiClient.put<Post>(
      `${serviceName}/api/posts/${postId}`,
      postRequest,
    );
  }
}

export const postService = new PostService();
export default postService;
