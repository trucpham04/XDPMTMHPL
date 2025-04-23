"use client";

import { Post } from "@/types/Post";
import PostItem from "./PostItem";
import { cn } from "@/lib/utils";

/**
 * Component to display a list of posts
 *
 * @param {Array} posts - Array of post objects to be displayed
 */
export default function PostList({
  posts,
  className,
}: {
  posts: Post[];
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full", className)}>
      <div className="flex flex-col gap-4">
        {posts.map((post, index) => (
          <PostItem key={index} post={post} />
        ))}
      </div>
    </div>
  );
}
