import React, { useEffect, useState } from "react";
import { PostItem } from "./PostItem";
import { SharedPostItem } from "./SharedPostItem";
import { postService } from "@/services/postService";
import { Post, SharedPost, FeedItem } from "@/types/Post_new";


interface PostListProps {
  userId: number;
  onImageClick: (postIndex: number, imageIndex: number) => void;
  onLikeClick: (postIndex: number) => void;
  onCommentClick: (postIndex: number) => void;
  onShareClick: (postIndex: number) => void;
}

export const PostList: React.FC<PostListProps> = ({
  userId,
  onImageClick,
  onLikeClick,
  onCommentClick,
  onShareClick,
}) => {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [posts, sharedPosts] = await Promise.all([
          postService.getPostsByUserId(userId),
          postService.getSharesByUserId(userId),
        ]);

        const feedItems: FeedItem[] = [
          ...posts.map((post: Post): FeedItem => ({ type: "post", data: post })),
          ...sharedPosts.map((share: SharedPost): FeedItem => ({
            type: "share",
            data: share,
          })),
        ];

        setFeed(feedItems.sort(() => Math.random() - 0.5));
      } catch (err) {
        console.error("Lỗi khi tải bài viết:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) return <div>Đang tải bài viết...</div>;

  return (
    <div className="space-y-6">
      {feed.map((item, index) =>
        item.type === "post" ? (
          <PostItem
            key={`post-${item.data.id}`}
            post={item.data}
            index={index}
            onImageClick={onImageClick}
            onLikeClick={onLikeClick}
            onCommentClick={onCommentClick}
            onShareClick={onShareClick}
          />
        ) : (
          <SharedPostItem
            key={`share-${item.data.sharedPostId}`}
            sharedPostId={item.data.sharedPostId}
            originalPostId={item.data.originalPostId}
            userId={item.data.userId}
            createdAt={item.data.createdAt}
            content={item.data.content}
            viewer={item.data.viewer}
            originalPost={item.data.originalPost}
            postIndex={index}
            onImageClick={onImageClick}
            onLikeClick={onLikeClick}
            onCommentClick={onCommentClick}
          />
        )
      )}
    </div>
  );
};
