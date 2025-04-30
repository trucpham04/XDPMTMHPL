import React from "react";
import { MoreHorizontal } from "lucide-react";
import { ImageGallery } from "./ImageGallery";
import { InteractionBar } from "./InteractionBar";
import { Post, SharedPost } from "@/types/Post_new";

interface SharedPostItemProps {
    sharedPostId: number;
    originalPostId: number;
    userId: number;
    createdAt: string;
    content: string;
    viewer: string;
    originalPost: Post;  // Changed to Post instead of SharedPost["data"]
    postIndex: number;
    onImageClick: (postIndex: number, imageIndex: number) => void;
    onLikeClick: (index: number) => void;
    onCommentClick: (index: number) => void;
}

export const SharedPostItem: React.FC<SharedPostItemProps> = ({
    sharedPostId,
    originalPostId,
    userId,
    createdAt,
    content,
    viewer,
    originalPost,
    postIndex,
    onImageClick,
    onLikeClick,
    onCommentClick,
}) => {
    return (
        <div className="mt-8 flex flex-col rounded-2xl bg-white p-4 shadow-lg">
            {/* Shared Info */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <img
                        src={`https://i.pravatar.cc/150?img=${userId}`}
                        alt="Avatar"
                        className="h-10 w-10 rounded-full"
                    />
                    <div>
                        <p className="font-semibold">User {userId}</p>
                        <span className="text-sm text-gray-500">{new Date(createdAt).toLocaleString()}</span>
                    </div>
                </div>
                <MoreHorizontal className="cursor-pointer text-gray-500" />
            </div>

            {/* Share Content */}
            <div className="mt-4">
                <p className="text-left">{content}</p>
            </div>

            {/* Original Post Box */}
            <div className="mt-4 rounded-lg border bg-gray-50 p-4">
                <div className="flex items-center space-x-2">
                    <img
                        src="https://via.placeholder.com/40"
                        alt="Original User"
                        className="h-10 w-10 rounded-full"
                    />
                    <div>
                        <p className="font-semibold">{originalPost.userId}</p>
                        <span className="text-sm text-gray-500">Trước đó</span>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="text-left">{originalPost.content}</p>
                    <ImageGallery
                        multiFiles={originalPost.multiFile}  // Ensure multiFile is used here
                        postIndex={postIndex}
                        onImageClick={onImageClick}
                    />
                </div>

                <InteractionBar
                    likes={originalPost.likes}
                    isLiked={originalPost.isLiked}
                    commentsCount={originalPost.comments}
                    shares={originalPost.shares}
                    onLikeClick={() => onLikeClick(postIndex)}
                    onCommentClick={() => onCommentClick(postIndex)}
                    onShareClick={() => { }}
                />
            </div>
        </div>
    );
};
