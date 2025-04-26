import { MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { useEffect, useRef, useState } from "react";
import UserAvatar from "../app/userAvatar";
import { Comment } from "@/types/Post";
import { User } from "@/types/User";
import { mockPosts } from "@/pages/main/Home";
import { useAuthContext } from "@/contexts/AuthContext";

const anotherUser: User = {
  id: 2,
  username: "janesmith",
  email: "janesmith@example.com",
  firstName: "Jane",
  lastName: "Smith",
  fullName: "Jane Smith",
  profilePicture: "https://example.com/profiles/janesmith.jpg",
};

export default function CommentDialog({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const commentContainerRef = useRef<HTMLDivElement>(null);
  const [newComment, setNewComment] = useState("");
  const { user } = useAuthContext();

  const mockComments: Comment[] = [
    {
      id: 201,
      post_id: mockPosts[0].id,
      user: anotherUser,
      content: "Wow, that looks like an awesome place! 😍",
      createdAt: new Date("2025-04-20T11:00:00"),
      updatedAt: new Date("2025-04-20T11:00:00"),
    },
    {
      id: 202,
      post_id: mockPosts[1].id,
      user: anotherUser,
      content: "Those beach vibes are real! 🌴",
      createdAt: new Date("2025-04-18T15:00:00"),
      updatedAt: new Date("2025-04-18T15:00:00"),
    },
    {
      id: 203,
      post_id: mockPosts[2].id,
      user: anotherUser,
      content: "Nice setup! What mic are you using?",
      createdAt: new Date("2025-04-17T10:00:00"),
      updatedAt: new Date("2025-04-17T10:00:00"),
    },
    {
      id: 204,
      post_id: mockPosts[3].id,
      user: anotherUser,
      content: "Great vlog! Looking forward to more updates.",
      createdAt: new Date("2025-04-15T18:00:00"),
      updatedAt: new Date("2025-04-15T18:00:00"),
    },
    {
      id: 205,
      post_id: mockPosts[4].id,
      user: anotherUser,
      content: "That sunset is breathtaking! 🌅",
      createdAt: new Date("2025-04-14T19:00:00"),
      updatedAt: new Date("2025-04-14T19:00:00"),
    },
    {
      id: 201,
      post_id: mockPosts[0].id,
      user: anotherUser,
      content: "Wow, that looks like an awesome place! 😍",
      createdAt: new Date("2025-04-20T11:00:00"),
      updatedAt: new Date("2025-04-20T11:00:00"),
    },
    {
      id: 202,
      post_id: mockPosts[1].id,
      user: anotherUser,
      content: "Those beach vibes are real! 🌴",
      createdAt: new Date("2025-04-18T15:00:00"),
      updatedAt: new Date("2025-04-18T15:00:00"),
    },
    {
      id: 203,
      post_id: mockPosts[2].id,
      user: anotherUser,
      content: "Nice setup! What mic are you using?",
      createdAt: new Date("2025-04-17T10:00:00"),
      updatedAt: new Date("2025-04-17T10:00:00"),
    },
    {
      id: 204,
      post_id: mockPosts[3].id,
      user: anotherUser,
      content: "Great vlog! Looking forward to more updates.",
      createdAt: new Date("2025-04-15T18:00:00"),
      updatedAt: new Date("2025-04-15T18:00:00"),
    },
    {
      id: 205,
      post_id: mockPosts[4].id,
      user: anotherUser,
      content: "That sunset is breathtaking! 🌅",
      createdAt: new Date("2025-04-14T19:00:00"),
      updatedAt: new Date("2025-04-14T19:00:00"),
    },
    {
      id: 201,
      post_id: mockPosts[0].id,
      user: anotherUser,
      content: "Wow, that looks like an awesome place! 😍",
      createdAt: new Date("2025-04-20T11:00:00"),
      updatedAt: new Date("2025-04-20T11:00:00"),
    },
    {
      id: 202,
      post_id: mockPosts[1].id,
      user: anotherUser,
      content: "Those beach vibes are real! 🌴",
      createdAt: new Date("2025-04-18T15:00:00"),
      updatedAt: new Date("2025-04-18T15:00:00"),
    },
    {
      id: 203,
      post_id: mockPosts[2].id,
      user: anotherUser,
      content: "Nice setup! What mic are you using?",
      createdAt: new Date("2025-04-17T10:00:00"),
      updatedAt: new Date("2025-04-17T10:00:00"),
    },
    {
      id: 204,
      post_id: mockPosts[3].id,
      user: anotherUser,
      content: "Great vlog! Looking forward to more updates.",
      createdAt: new Date("2025-04-15T18:00:00"),
      updatedAt: new Date("2025-04-15T18:00:00"),
    },
    {
      id: 205,
      post_id: mockPosts[4].id,
      user: anotherUser,
      content: "That sunset is breathtaking! 🌅",
      createdAt: new Date("2025-04-14T19:00:00"),
      updatedAt: new Date("2025-04-14T19:00:00"),
    },
  ];

  useEffect(() => {
    setComments(mockComments);
  }, []);

  useEffect(() => {
    const el = commentContainerRef.current;
    if (el && comments.length > 0) {
      setTimeout(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }, [comments]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now(),
      user: user, // Note: 'user' is not defined in your code snippet
      content: newComment.trim(),
      createdAt: new Date(),
    };
    setComments((prev) => [...prev, comment]);
    setNewComment("");
    // TODO: call API to persist comment
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="flex flex-1 cursor-pointer items-center space-x-2"
          >
            <MessageCircle className="size-5!" color="gray" />
            <span>Bình luận</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="flex h-200 flex-col gap-0 p-2">
          <DialogTitle className="flex h-fit p-4">Bình luận</DialogTitle>
          <div
            ref={commentContainerRef}
            className="mt-2 flex-1 content-end space-y-2 overflow-y-auto py-4"
          >
            {comments.length > 0 ? (
              comments.map((c) => (
                <div key={c.id} className="flex items-start space-x-2">
                  <UserAvatar user={c.user} className="h-8 w-8" />
                  <div className="bg-muted rounded-xl p-2 px-4">
                    <p className="text-sm font-semibold">{c.user.fullName}</p>
                    <p className="text-sm text-gray-700">{c.content}</p>
                    <span className="text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500">
                Chưa có bình luận nào.
              </p>
            )}
          </div>

          <div className="flex h-fit items-center space-x-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
              placeholder="Viết bình luận..."
              className="flex-1 resize-none"
            />
            <Button onClick={handleAddComment}>Gửi</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
