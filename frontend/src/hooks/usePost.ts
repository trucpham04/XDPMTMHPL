import { useState, useCallback } from "react";
import {
  Post,
  PostRequest,
  LikeRequest,
  CommentRequest,
  Comment,
  SharedPost,
  ShareRequest,
  Like,
} from "@/types/Post";
import postService from "@/services/postService";

export const usePost = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [shares, setShares] = useState<SharedPost[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [userLiked, setUserLiked] = useState<boolean>(false);

  // Create a new post
  const createPost = useCallback(
    async (postData: PostRequest): Promise<Post | null> => {
      setLoading(true);
      setError(null);
      try {
        const newPost = await postService.createPost(postData);
        return newPost;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create post";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Get post by ID
  const fetchPostById = useCallback(async (postId: number) => {
    setLoading(true);
    setError(null);
    try {
      const post = await postService.getPostById(postId);
      setCurrentPost(post);
      return post;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch post";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all posts by a user
  const fetchPostsByUserId = useCallback(async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const userPosts = await postService.getPostsByUserId(userId);
      setPosts(userPosts);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch posts";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a post
  const deletePost = useCallback(
    async (postId: number) => {
      setLoading(true);
      setError(null);
      try {
        await postService.deletePost(postId);
        // If deleted post is currently selected, clear it
        if (currentPost?.postId === postId) {
          setCurrentPost(null);
        }
        // Remove the deleted post from posts array if it exists there
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete post";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [currentPost],
  );

  // Like a post
  const likePost = useCallback(
    async (postId: number, likeData: LikeRequest) => {
      try {
        await postService.likePost(postId, likeData);
        setUserLiked(true);
        setLikeCount((prev) => prev + 1);
      } catch (err) {
        setError("Failed to like post");
      }
    },
    [],
  );

  // Unlike a post
  const unlikePost = useCallback(async (postId: number, userId: number) => {
    try {
      await postService.unlikePost(postId, userId);
      setUserLiked(false);
      setLikeCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      setError("Failed to unlike post");
    }
  }, []);

  // Count likes for a post
  const countLikes = useCallback(async (postId: number) => {
    try {
      const count = await postService.countLikes(postId);
      setLikeCount(count);
      return count;
    } catch (err) {
      setError("Failed to count likes");
      return 0;
    }
  }, []);

  // Check if user has liked a post
  const checkUserLiked = useCallback(async (postId: number, userId: number) => {
    try {
      const hasLiked = await postService.checkUserLiked(postId, userId);
      setUserLiked(hasLiked);
      return hasLiked;
    } catch (err) {
      setError("Failed to check if user liked post");
      return false;
    }
  }, []);

  // Get all likes for a post
  const fetchLikes = useCallback(async (postId: number) => {
    try {
      const likesData = await postService.getLikes(postId);
      setLikes(likesData);
      return likesData;
    } catch (err) {
      setError("Failed to fetch likes");
      return [];
    }
  }, []);

  // Add a comment
  const addComment = useCallback(
    async (
      postId: number,
      commentData: CommentRequest,
    ): Promise<Comment | null> => {
      try {
        const comment = await postService.addComment(postId, commentData);
        // Update comments state if we're already viewing this post's comments
        setComments((prevComments) => [...prevComments, comment]);
        return comment;
      } catch (err) {
        setError("Failed to add comment");
        return null;
      }
    },
    [],
  );

  // Delete a comment
  const deleteComment = useCallback(async (commentId: number) => {
    try {
      await postService.deleteComment(commentId);
      // Remove the deleted comment from state
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId),
      );
    } catch (err) {
      setError("Failed to delete comment");
    }
  }, []);

  // Fetch comments for a post
  const fetchComments = useCallback(async (postId: number) => {
    try {
      const data = await postService.getCommentsByPostId(postId);
      setComments(data);
      return data;
    } catch (err) {
      setError("Failed to fetch comments");
    }
  }, []);

  // Share a post
  const sharePost = useCallback(
    async (postId: number, data: ShareRequest): Promise<SharedPost | null> => {
      try {
        const sharedPost = await postService.sharePost(postId, data);
        // Update shares state if we're viewing shares for this post
        setShares((prevShares) => [...prevShares, sharedPost]);
        return sharedPost;
      } catch (err) {
        setError("Failed to share post");
        return null;
      }
    },
    [],
  );

  // Fetch all shares for a post
  const fetchSharesByPostId = useCallback(async (postId: number) => {
    try {
      const data = await postService.getSharesByPostId(postId);
      setShares(data);
      return data;
    } catch (err) {
      setError("Failed to fetch shared posts");
      return [];
    }
  }, []);

  // Fetch shares by user
  const fetchSharesByUser = useCallback(
    async (postId: number, userId: number) => {
      try {
        const data = await postService.getSharesByUserId(postId, userId);
        setShares(data);
      } catch (err) {
        setError("Failed to fetch shared posts");
      }
    },
    [],
  );

  // Delete a shared post
  const deleteShare = useCallback(
    async (postId: number, sharedPostId: number) => {
      try {
        await postService.deleteShare(postId, sharedPostId);
        // Remove the deleted share from state
        setShares((prevShares) =>
          prevShares.filter((share) => share.sharedPostId !== sharedPostId),
        );
      } catch (err) {
        setError("Failed to delete shared post");
      }
    },
    [],
  );

  const searchPosts = useCallback(async (keyword: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await postService.searchPosts(keyword);
      setPosts(results);
      return results;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to search posts";
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePost = useCallback(
    async (postId: number, postData: PostRequest) => {
      setLoading(true);
      setError(null);
      try {
        const updatedPost = await postService.updatePost(postId, postData);
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.postId === postId ? updatedPost : post,
          ),
        );
        if (currentPost?.postId === postId) {
          setCurrentPost(updatedPost);
        }
        return updatedPost;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update post";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    posts,
    currentPost,
    comments,
    shares,
    likes,
    likeCount,
    userLiked,
    createPost,
    fetchPostById,
    fetchPostsByUserId,
    deletePost,
    likePost,
    unlikePost,
    countLikes,
    checkUserLiked,
    fetchLikes,
    addComment,
    deleteComment,
    fetchComments,
    sharePost,
    fetchSharesByPostId,
    fetchSharesByUser,
    deleteShare,
    searchPosts,
    updatePost,
  };
};

export default usePost;
