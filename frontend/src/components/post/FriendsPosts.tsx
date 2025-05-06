import React, { useEffect, useState } from "react";
import { PostItem } from "./PostItem";
import { SharedPostItem } from "./SharedPostItem";
import { postService } from "@/services/postService";
import { Post, SharedPost, FeedItem } from "@/types/Post";
import { User } from "@/types/User";

interface FriendsPostsProps {
  friends: User[];
  onImageClick: (postId: number, imageIndex: number) => void;
  onLikeClick: (postId: number) => void;
  onCommentClick: (postId: number) => void;
  onShareClick: (postId: number) => void;
}

export const FriendsPosts: React.FC<FriendsPostsProps> = ({
  friends,
  onImageClick,
  onLikeClick,
  onCommentClick,
  onShareClick,
}) => {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        // Fetch posts and shares for each friend
        const postsArrays = await Promise.all(
          friends.map((f) => postService.getPostsByUserId(f.id)),
        );
        const sharesArrays = await Promise.all(
          friends.map((f) => postService.getSharesByUserId(f.id)),
        );

        // Flatten
        const posts: Post[] = postsArrays.flat();
        const shares: SharedPost[] = sharesArrays.flat();

        // Build list with timestamps
        const timedItems: { item: FeedItem; timestamp: number }[] = [];

        posts.forEach((post) => {
          timedItems.push({
            item: { type: "post", data: post },
            timestamp: new Date(post.createdAt).getTime(),
          });
        });

        shares.forEach((share) => {
          timedItems.push({
            item: { type: "share", data: share },
            timestamp: new Date(share.createdAt).getTime(),
          });
        });

        // Sort by timestamp desc
        timedItems.sort((a, b) => b.timestamp - a.timestamp);

        // Extract sorted FeedItems
        const sortedFeed = timedItems.map((t) => t.item);

        setFeed(sortedFeed);
        console.log("Sorted feed:", sortedFeed);
      } catch (error) {
        console.error("Error fetching feed:", error);
      } finally {
        setLoading(false);
      }
    };

    if (friends.length) fetchFeed();
    else setLoading(false);
  }, [friends]);

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
