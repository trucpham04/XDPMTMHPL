import React, { useEffect, useState } from "react";
import { PostItem } from "./PostItem";
import { SharedPostItem } from "./SharedPostItem";
import { postService } from "@/services/postService";
import { FeedItem } from "@/types/Post";

interface PostListProps {
  userId: number;
  onImageClick: (postId: number, imageIndex: number) => void;
  onLikeClick: (postId: number) => void;
  onCommentClick: (postId: number) => void;
  onShareClick: (postId: number) => void;
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
      setLoading(true);
      try {
        const [posts, sharedPosts] = await Promise.all([
          postService.getPostsByUserId(userId),
          postService.getSharesByUserId(userId),
        ]);

        const timedItems: { item: FeedItem; timestamp: number }[] = [];

        posts.forEach((post) => {
          timedItems.push({
            item: { type: "post", data: post },
            timestamp: new Date(post.createdAt).getTime(),
          });
        });

        sharedPosts.forEach((share) => {
          timedItems.push({
            item: { type: "share", data: share },
            timestamp: new Date(share.createdAt).getTime(),
          });
        });

        timedItems.sort((a, b) => b.timestamp - a.timestamp);

        setFeed(timedItems.map((t) => t.item));
      } catch (err) {
        console.error("Lỗi khi tải bài viết:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading)
    return (
      <div className="text-muted-foreground mt-4 w-full text-center">
        Đang tải nội dung...
      </div>
    );
  if (!feed.length)
    return (
      <div className="text-muted-foreground mt-4 w-full text-center">
        Không có bài viết nào để hiển thị
      </div>
    );

  return (
    <div className="mt-4 w-full space-y-6">
      {feed.map((item, index) =>
        item.type === "post" ? (
          <PostItem
            key={`post-${item.data.postId}`}
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
            onShareClick={onShareClick}
            author={item.data.author}
          />
        ),
      )}
    </div>
  );
};
