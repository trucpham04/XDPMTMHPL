import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  Briefcase,
  Clock,
  Globe,
  GraduationCap,
  Loader2,
  MapPin,
  User as UserIcon,
  X,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { User } from "@/types/User";
import { useFriends } from "@/hooks/useFriends";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { uploadImagesToCloudinary } from "@/utils/cloudiary";
import { UserPlus, MessageCircle, UserCheck, UserMinus } from "lucide-react";
import axios from "axios";
import { NewPostDialog } from "@/components/post/NewPostDialog";
import usePost from "@/hooks/usePost";
import { FeedItem, Post } from "@/types/Post";
import { PostList } from "@/components/post/PostList";
import { CommentDialog } from "@/components/post/CommentDialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useMedia } from "@/hooks/useMedia";
import { Media } from "@/types/media";

function parseCreatedAt(createdAtArray: number[]) {
  if (!Array.isArray(createdAtArray) || createdAtArray.length < 6) return null;

  const [year, month, day, hour, minute, second, nanosecond] = createdAtArray;

  const date = new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    second,
    Math.floor(nanosecond / 1_000_000),
  );

  return date;
}

const Profile: React.FC = () => {
  const { user } = useAuthContext();
  const { user_id } = useParams();
  const { getUserById, updateUserProfile, loading } = useUser();
  const { getFriends, loading: friendsLoading } = useFriends();
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    profilePictureUrl: "",
    coverPhotoUrl: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilePreview, setSelectedFilePreview] = useState<string | null>(
    null,
  );
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [isFriendRequestSent, setIsFriendRequestSent] = useState(false);
  const [isFriendRequestReceived, setIsFriendRequestReceived] = useState(false);
  const [showFriendMenu, setShowFriendMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCoverPhotoDialogOpen, setIsCoverPhotoDialogOpen] = useState(false);
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [selectedCoverPreview, setSelectedCoverPreview] = useState<
    string | null
  >(null);
  const [friends, setFriends] = useState<User[]>([]);
  const {
    loading: mediaLoading,
    error: mediaError,
    images,
    videos,
    getImagesByUserId,
    getVideosByUserId,
  } = useMedia();

  const isOwnProfile = user?.id === Number(user_id);

  useEffect(() => {
    getUserById(Number(user_id)).then((res) => {
      setCurrentUser(res || undefined);

      if (user?.id === Number(user_id)) {
        setFormData({
          firstName: res?.firstName || "",
          lastName: res?.lastName || "",
          bio: res?.bio || "",
          profilePictureUrl: res?.profilePicture || "",
          coverPhotoUrl: res?.coverPhotoUrl || "",
        });
      }
    });
    getFriends(Number(user_id)).then(setFriends);
    if (user?.id !== Number(user_id)) {
      setIsLoading(true);
      axios
        .get(
          `http://127.0.0.1:8090/friend-service/api/friends/status?otherUserId=${user_id}`,
          {
            withCredentials: true,
          },
        )
        .then((res) => {
          console.log("Phản hồi từ API trạng thái:", res.data);
          setIsFriend(res.data.isFriend);
          console.log("Trạng thái bạn bè", setIsFriend);
          setIsFriendRequestSent(res.data.isFriendRequestSent);
          setIsFriendRequestReceived(res.data.isFriendRequestReceived);
        })
        .catch((err) => {
          console.error("Lỗi kiểm tra trạng thái:", err);
          setIsFriend(false);
          setIsFriendRequestSent(false);
          setIsFriendRequestReceived(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    if (user_id) {
      getImagesByUserId(Number(user_id));
      getVideosByUserId(Number(user_id));
    }
  }, [user_id, user?.id, isFriend, getImagesByUserId, getVideosByUserId]);

  const handleFriendRequest = async (action: string) => {
    setIsLoading(true);
    try {
      if (action === "send") {
        await axios.post(
          `http://127.0.0.1:8090/friend-service/api/friends/requests/sent/${user_id}`,
          {},
          { withCredentials: true },
        );
        setIsFriendRequestSent(true);
      } else if (action === "cancel") {
        await axios.delete(
          `http://127.0.0.1:8090/friend-service/api/friends/cancel/${user_id}`,
          { withCredentials: true },
        );
        setIsFriendRequestSent(false);
      } else if (action === "accept") {
        await axios.post(
          `http://127.0.0.1:8090/friend-service/api/friends/accept/${user_id}`,
          {},
          { withCredentials: true },
        );
        setIsFriend(true);
        setIsFriendRequestReceived(false);
      } else if (action === "unfriend") {
        await axios.delete(
          `http://127.0.0.1:8090/friend-service/api/friends/remove/${user_id}`,
          { withCredentials: true },
        );
        setIsFriend(false);
        setShowFriendMenu(false);
      }
    } catch (error) {
      console.error(`Lỗi khi ${action} lời mời kết bạn:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedCoverFile(file);
      const previewUrl = URL.createObjectURL(file);
      setSelectedCoverPreview(previewUrl);
    }
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFormData({ ...formData, profilePictureUrl: "" });
      setSelectedFilePreview(previewUrl);
    }
  };

  const handleSubmit = async () => {
    try {
      let updatedFormData = { ...formData };

      // Handle profile picture upload
      if (selectedFile) {
        const urls = await uploadImagesToCloudinary([selectedFile]);
        if (urls.length > 0) {
          updatedFormData.profilePictureUrl = urls[0];
        }
      }

      // Handle cover photo upload
      if (selectedCoverFile) {
        const urls = await uploadImagesToCloudinary([selectedCoverFile]);
        if (urls.length > 0) {
          updatedFormData.coverPhotoUrl = urls[0];
        }
      }

      await updateUserProfile(updatedFormData);
      setIsUpdateDialogOpen(false);
      getUserById(Number(user_id)).then((res) => {
        setCurrentUser(res || undefined);
      });
    } catch (err) {
      console.error("Cập nhật thất bại", err);
    }
  };

  const [openCommentIndex, setOpenCommentIndex] = useState<number | null>(null);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const userId = user?.id || 0;
  const [openingPost, setOpeningPost] = useState<Post | null>(null);

  const { fetchPostById, fetchPostsByUserId, addComment, likePost, sharePost } =
    usePost();

  const handleImageClick = (postIndex: number, imageIndex: number) => {
    console.log(`Clicked image ${imageIndex} in post ${postIndex}`);
  };

  const handleLikeClick = (postId: number) => {};

  const handleCommentClick = async (postId: number) => {
    const post = await fetchPostById(postId);
    if (post) {
      setOpeningPost(post);
      setOpenCommentIndex(postId);
    }
  };

  const handleShareClick = (postId: number) => {
    sharePost(postId, { userId: userId });
  };

  const handleCloseComment = () => {
    setOpenCommentIndex(null);
  };

  const handleSubmitComment = (commentText: string) => {};

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-100">
      {/* Cover Photo Section */}
      <div className="bg-muted-foreground relative h-80 w-full max-w-6xl rounded-b-lg border-0">
        <img
          src={currentUser?.coverPhotoUrl || ""}
          className="h-80 w-full rounded-b-lg border-0 object-cover"
        />
      </div>

      {/* Profile Main Section */}
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="absolute -top-24 left-8 flex items-center">
          <div className="relative">
            <Avatar className="h-44 w-44 border-4 border-white bg-gray-200 shadow-xl">
              <AvatarImage
                src={currentUser?.profilePictureUrl || undefined}
                className="object-cover"
              />
              <AvatarFallback>
                <UserIcon className="h-24 w-24" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Name, Friends, Actions */}
        <div className="mb-4 ml-56 flex flex-col pt-4 pb-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                {currentUser?.firstName || "User"}{" "}
                {currentUser?.lastName || "Name"}
              </h1>
            </div>
            <div className="mt-4 flex gap-2 md:mt-0">
              {isOwnProfile ? (
                <>
                  <Button>Add to story</Button>
                  <Dialog
                    open={isUpdateDialogOpen}
                    onOpenChange={setIsUpdateDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline">Edit profile</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                firstName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lastName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) =>
                              setFormData({ ...formData, bio: e.target.value })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="profile-picture">
                            Profile Picture
                          </Label>
                          <Input
                            id="profile-picture"
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                          />
                          {selectedFilePreview && (
                            <img
                              src={selectedFilePreview}
                              alt="Profile preview"
                              className="max-h-48 w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="cover-photo">Cover Photo</Label>
                          <Input
                            id="cover-photo"
                            type="file"
                            accept="image/*"
                            onChange={handleCoverPhotoChange}
                          />
                          {selectedCoverPreview && (
                            <img
                              src={selectedCoverPreview}
                              alt="Cover preview"
                              className="max-h-48 w-full object-cover"
                            />
                          )}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleSubmit}>Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <div className="flex gap-2">
                  {isFriend ? (
                    <Button
                      onClick={() => handleFriendRequest("unfriend")}
                      disabled={isLoading}
                    >
                      <UserMinus className="mr-2 h-4 w-4" />
                      Unfriend
                    </Button>
                  ) : isFriendRequestSent ? (
                    <Button
                      onClick={() => handleFriendRequest("cancel")}
                      disabled={isLoading}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel Request
                    </Button>
                  ) : isFriendRequestReceived ? (
                    <Button
                      onClick={() => handleFriendRequest("accept")}
                      disabled={isLoading}
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      Accept Request
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleFriendRequest("send")}
                      disabled={isLoading}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Friend
                    </Button>
                  )}
                  <Link to={`/messages`}>
                    <Button>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="posts" className="mt-6 w-full border-t-1">
          <TabsList className="h-auto w-full justify-start border-gray-200 p-0">
            <TabsTrigger
              value="posts"
              className="max-w-fit cursor-pointer rounded-none border-0 bg-transparent! p-0! pb-1! shadow-none! hover:bg-gray-100 data-[state=active]:border-b-3 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
            >
              <div className="hover:bg-background flex w-full items-center justify-center rounded-md px-10 py-3 font-semibold">
                Posts
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="friends"
              className="max-w-fit cursor-pointer rounded-none border-0 bg-transparent! p-0! pb-1! shadow-none! hover:bg-gray-100 data-[state=active]:border-b-3 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
            >
              <div className="hover:bg-background flex w-full items-center justify-center rounded-md px-10 py-3 font-semibold">
                Friends
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="photos"
              className="max-w-fit cursor-pointer rounded-none border-0 bg-transparent! p-0! pb-1! shadow-none! hover:bg-gray-100 data-[state=active]:border-b-3 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
            >
              <div className="hover:bg-background flex w-full items-center justify-center rounded-md px-10 py-3 font-semibold">
                Photos
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="videos"
              className="max-w-fit cursor-pointer rounded-none border-0 bg-transparent! p-0! pb-1! shadow-none! hover:bg-gray-100 data-[state=active]:border-b-3 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
            >
              <div className="hover:bg-background flex w-full items-center justify-center rounded-md px-10 py-3 font-semibold">
                Videos
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            <div className="mx-auto flex w-full max-w-6xl gap-6">
              <div className="w-90 flex-shrink-0">
                <div className="rounded-lg bg-white p-4 shadow">
                  <h3 className="mb-2 text-xl font-semibold">Intro</h3>

                  {currentUser?.bio && (
                    <div className="mb-2 border-b border-gray-200">
                      <div className="mb-2 rounded py-2 text-center text-sm text-gray-700">
                        {currentUser.bio}
                      </div>
                    </div>
                  )}

                  <div className="mb-2 flex items-center justify-start gap-2 text-base text-gray-600">
                    <MapPin size={20} />
                    <span className="text-nowrap">Sống tại</span>
                    <span className="font-medium">Thành phố Hồ Chí Minh</span>
                  </div>

                  <div className="mb-2 flex items-center gap-2 text-base text-gray-600">
                    <GraduationCap size={20} />
                    Học tại <span className="font-medium">Đại học Sài Gòn</span>
                  </div>

                  <div className="mb-2 flex items-center gap-2 text-base text-gray-600">
                    <Briefcase size={20} />
                    Làm việc tại{" "}
                    <span className="font-medium">FPT Software</span>
                  </div>

                  <div className="mb-2 flex items-center gap-2 text-base text-gray-600">
                    <Globe size={20} />
                    <a
                      href="https://trucpham.is-a.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      trucpham.is-a.dev
                    </a>
                  </div>

                  <div className="mb-2 flex items-center gap-2 text-base text-gray-600">
                    <Clock size={20} />
                    Tham gia vào{" "}
                    {parseCreatedAt(
                      currentUser?.createdAt || [],
                    )?.toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Main Feed */}
              <main className="flex flex-1 flex-col gap-4">
                {/* Post creation box (if owner) */}
                {user?.id == Number(user_id) && <NewPostDialog />}

                {/* Post List */}
                <div className="rounded-lg bg-white p-4 shadow">
                  <h3 className="text-xl font-semibold">Posts</h3>
                </div>

                <PostList
                  userId={Number(user_id)}
                  onImageClick={handleImageClick}
                  onLikeClick={handleLikeClick}
                  onCommentClick={handleCommentClick}
                  onShareClick={handleShareClick}
                />

                {/* Comment Dialog */}
                {openCommentIndex !== null && openingPost && (
                  <CommentDialog
                    post={openingPost}
                    postIndex={openCommentIndex}
                    isOpen={true}
                    onClose={handleCloseComment}
                    onLikeClick={() => handleLikeClick(openCommentIndex)}
                    onCommentClick={() => {}}
                    onImageClick={handleImageClick}
                    onSubmitComment={handleSubmitComment}
                  />
                )}
              </main>
            </div>
          </TabsContent>

          <TabsContent value="photos" className="mt-6">
            <div className="mx-auto w-full max-w-6xl">
              {mediaLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : mediaError ? (
                <div className="text-center text-red-500">{mediaError}</div>
              ) : images && images.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={`${image.postId}-${index}`}
                      className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
                      onClick={() => handleImageClick(image.postId, index)}
                    >
                      <img
                        src={image.url}
                        alt={`Photo ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  No photos to display
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="mt-6">
            <div className="mx-auto w-full max-w-5xl">
              {mediaLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : mediaError ? (
                <div className="text-center text-red-500">{mediaError}</div>
              ) : videos && videos.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {videos.map((video, index) => (
                    <div
                      key={`${video.postId}-${index}`}
                      className="relative aspect-video cursor-pointer overflow-hidden rounded-lg"
                      onClick={() => handleImageClick(video.postId, index)}
                    >
                      <video
                        src={video.url}
                        className="h-full w-full object-cover"
                        controls
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  No videos to display
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="friends" className="mt-6">
            <div className="mx-auto w-full max-w-5xl">
              <div className="rounded-lg bg-white p-4 shadow">
                <h3 className="mb-4 text-xl font-semibold">Friends</h3>
                {friendsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : friends.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {friends.map((friend) => (
                      <Link
                        key={friend.id}
                        to={`/profile/${friend.id}`}
                        className="flex items-center gap-4 rounded-lg p-2 transition hover:bg-gray-50"
                      >
                        <Avatar className="h-20 w-20 rounded-md">
                          <AvatarImage
                            src={friend.profilePictureUrl || undefined}
                            className="object-cover"
                          />
                          <AvatarFallback>
                            <UserIcon className="h-10 w-10" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-base font-medium">
                          {friend.firstName} {friend.lastName}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No friends to display
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
