"use client";

import { MoreHorizontal, ThumbsUp, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Post } from "@/types/Post";
import UserAvatar from "../app/userAvatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useAuthContext } from "@/contexts/AuthContext";
import CommentDialog from "./CommentDialog";
import { Link } from "react-router-dom";

export default function PostItem({ post }: { post: Post }) {
  const { user } = useAuthContext();

  return (
    <div className="flex h-auto flex-col rounded-2xl bg-white p-2 shadow-lg">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center space-x-2">
          <Link to={`/profile/${post.user.id}`}>
            <UserAvatar user={post.user} className="h-10 w-10" />
          </Link>
          <div>
            <Link to={`/profile/${post.user.id}`}>
              <p className="font-semibold">{post.user.fullName}</p>
            </Link>
            <span className="text-sm text-gray-500">16 giờ trước</span>
          </div>
        </div>

        {user?.id === post.user.id && (
          <Popover>
            <PopoverTrigger>
              <MoreHorizontal className="cursor-pointer text-gray-500" />
            </PopoverTrigger>
            <PopoverContent className="flex w-fit flex-col p-1">
              <Button
                variant="ghost"
                className="inline-flex cursor-pointer justify-start"
              >
                Chỉnh sửa bài viết
              </Button>

              <Button
                variant="ghost"
                className="inline-flex cursor-pointer justify-start"
              >
                Xóa bài viết
              </Button>
            </PopoverContent>
          </Popover>
        )}
      </div>

      <div className="flex h-auto flex-col items-center justify-center gap-2">
        <div className="ml-2 flex h-auto w-full items-center justify-start">
          <p>{post.content}</p>
        </div>
        {post.imageUrls && post.imageUrls.length > 0 && (
          <Carousel className="inline-flex w-full max-w-[500px] items-center justify-center">
            <CarouselContent className="w-5/6">
              {post.imageUrls.map((idx) => (
                <CarouselItem key={idx}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square w-1/1 items-center justify-center p-6">
                        <span className="text-sm font-semibold">{idx + 1}</span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </div>

      {(post?.likes || post?.comments || post?.shares) && (
        <div className="mt-4 flex items-center justify-between border-t pt-2">
          <div className="ml-4 flex space-x-4 text-sm text-gray-500">
            {post?.likes && <span>{post.likes} lượt thích</span>}
          </div>
          <div className="mr-4 flex space-x-4 text-sm text-gray-500">
            {post?.comments && <span>{post.comments} bình luận</span>}
            {post?.shares && <span>{post.shares} chia sẻ</span>}
          </div>
        </div>
      )}

      <div className="mt-2 flex justify-around border-t pt-2">
        <Button
          variant="ghost"
          className="flex flex-1 cursor-pointer items-center space-x-2 text-black"
        >
          <ThumbsUp className="size-5!" fill="black" />

          <span>Thích</span>
        </Button>

        <CommentDialog postId={post.id} />

        <Button
          variant="ghost"
          className="flex flex-1 cursor-pointer items-center space-x-2"
        >
          <Share2 className="size-5!" color="gray" />
          <span>Chia sẻ</span>
        </Button>
      </div>
    </div>
  );
}
