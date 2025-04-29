import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/contexts/AuthContext";
import { User } from "lucide-react";
import { useParams } from "react-router-dom";
import PostList from "@/components/post/PostList";
import { mockPosts } from "../main/Home";
import NewPostDialog from "@/components/app/new-post-dialog";

const Profile: React.FC = () => {
  const { user } = useAuthContext();
  const { user_id } = useParams();

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-100">
      {/* Ảnh bìa */}
      <div className="relative h-80 w-full bg-gray-300">
        {user?.cover_photo_url ? (
          <img
            src={user.cover_photo_url}
            alt="Cover"
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src="https://placehold.co/1200x400?text=\n"
            alt="Cover"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Ảnh đại diện + Thông tin cá nhân */}
      <div className="relative -mt-20 flex w-full max-w-5xl flex-col items-center rounded-lg bg-white p-6 shadow-lg">
        <Avatar className="absolute -top-20 h-40 w-40 border-4 border-white">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>
            <User className="h-24 w-24" />
          </AvatarFallback>
        </Avatar>
        <div className="mt-20 text-center">
          <h1 className="text-3xl font-bold">Nguyễn Văn A</h1>
          {/* <p className="text-muted-foreground text-lg">
            Web Developer | React Enthusiast
          </p> */}
          {user?.id == user_id && (
            <Button className="mt-4 px-6 py-2">Chỉnh sửa trang cá nhân</Button>
          )}
        </div>
      </div>

      {/* <div className="mt-4 flex h-auto w-full flex-col rounded-2xl bg-white p-2 shadow-lg">
        <div className="text-xl">Bio</div>
        <div>This is a bio</div>
      </div> */}

      {/* Danh sách bài viết */}
      <div className="mt-6 w-full max-w-5xl space-y-4">
        {/* Hộp tạo bài viết */}
        {user?.id == user_id && <NewPostDialog />}

        <PostList posts={mockPosts} />
      </div>
    </div>
  );
};

export default Profile;
