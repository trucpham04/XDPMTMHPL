import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/contexts/AuthContext";
import { User as UserIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import PostList from "@/components/post/PostList";
import { mockPosts } from "../main/Home";
import NewPostDialog from "@/components/app/new-post-dialog";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { User } from "@/types/User";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { uploadImagesToCloudinary } from "@/utils/cloudiary";

const Profile: React.FC = () => {
  const { user } = useAuthContext();
  const { user_id } = useParams();
  const { getUserById, updateUserProfile, loading } = useUser();
  const [currentUser, setCurrentUser] = useState<User>();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    profilePictureUrl: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilePreview, setSelectedFilePreview] = useState<string | null>(
    null,
  );
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  // Fetch user data first
  useEffect(() => {
    getUserById(Number(user_id)).then((res) => {
      setCurrentUser(res);

      // Initialize form data when currentUser is loaded and it's the logged-in user
      if (user?.id === Number(user_id)) {
        setFormData({
          firstName: res.firstName,
          lastName: res.lastName,
          bio: res.bio || "",
          profilePictureUrl: res.profilePicture || "",
        });
      }
    });
  }, [user_id, user?.id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFormData({ ...formData, profilePictureUrl: "" }); // Reset previous image URL
      setSelectedFilePreview(previewUrl);
    }
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = formData.profilePictureUrl;

      if (selectedFile) {
        const urls = await uploadImagesToCloudinary([selectedFile]);
        if (urls.length > 0) {
          imageUrl = urls[0];
        }
      }

      await updateUserProfile({
        ...formData,
        profilePictureUrl: imageUrl,
      }).then(() => setIsUpdateDialogOpen(false));

      getUserById(Number(user_id)).then((res) => {
        setCurrentUser(res);
      });
    } catch (err) {
      console.error("Cập nhật thất bại", err);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-100">
      {/* Ảnh bìa */}
      <div className="relative h-80 w-full bg-gray-300">
        {currentUser?.cover_photo_url ? (
          <img
            src={currentUser.cover_photo_url}
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
          <AvatarImage src={currentUser?.profilePictureUrl} />
          <AvatarFallback>
            <UserIcon className="h-24 w-24" />
          </AvatarFallback>
        </Avatar>
        <div className="mt-20 text-center">
          <h1 className="text-3xl font-bold">
            {`${currentUser?.firstName} ${currentUser?.lastName}`}{" "}
          </h1>
          {user?.id == Number(user_id) && (
            <Dialog
              open={isUpdateDialogOpen}
              onOpenChange={setIsUpdateDialogOpen}
            >
              <DialogTrigger>
                <Button className="mt-4 px-6 py-2">
                  Chỉnh sửa trang cá nhân
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">
                  Chỉnh sửa thông tin cá nhân
                </h2>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-600">
                      Họ
                    </label>
                    <input
                      type="text"
                      placeholder="Họ"
                      className="input rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-600">
                      Tên
                    </label>
                    <input
                      type="text"
                      placeholder="Tên"
                      className="input rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-600">
                      Bio
                    </label>
                    <textarea
                      placeholder="Bio"
                      className="input rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-600">
                      Ảnh đại diện
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="file-input max-w-md rounded-md border border-gray-300 px-4 py-2 text-ellipsis focus:ring-2 focus:ring-blue-500"
                      onChange={handleImageChange}
                    />
                    {selectedFilePreview ? (
                      <div className="mt-4 flex justify-center">
                        <img
                          src={selectedFilePreview}
                          alt="Preview"
                          className="h-32 w-32 rounded-full border border-gray-300 object-cover"
                        />
                      </div>
                    ) : formData.profilePictureUrl ? (
                      <div className="mt-4 flex justify-center">
                        <img
                          src={formData.profilePictureUrl}
                          alt="Current profile"
                          className="h-32 w-32 rounded-full border border-gray-300 object-cover"
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <Button
                    variant="secondary"
                    className="px-4 py-2 text-sm"
                    disabled={loading}
                    onClick={() => {
                      setSelectedFilePreview(null);
                      setSelectedFile(null);
                      // Reset form data to current user data
                      if (currentUser) {
                        setFormData({
                          firstName: currentUser.firstName,
                          lastName: currentUser.lastName,
                          bio: currentUser.bio || "",
                          profilePictureUrl: currentUser.profilePicture || "",
                        });
                      }
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    className="bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    Lưu thay đổi
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Danh sách bài viết */}
      <div className="mt-6 w-full max-w-5xl space-y-4">
        {/* Hộp tạo bài viết */}
        {user?.id == Number(user_id) && <NewPostDialog />}

        <PostList posts={mockPosts} />
      </div>
    </div>
  );
};

export default Profile;
