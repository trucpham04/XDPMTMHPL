import { Post } from "@/types/Post";
import PostList from "@/components/post/PostList";
import { User } from "@/types/User";
import NewPostDialog from "@/components/app/new-post-dialog";

const mockUser: User = {
  id: 2,
  username: "johndoe",
  email: "johndoe@example.com",
  firstName: "John",
  lastName: "Doe",
  fullName: "John Doe",
  dateOfBirth: "1990-01-01",
  gender: "male",
  createdAt: "2024-01-01T10:00:00Z",
  profilePicture: "https://example.com/profiles/johndoe.jpg",
  bio: "Love traveling and photography.",
};

export const mockPosts: Post[] = [
  {
    id: 101,
    user: mockUser,
    content: "Had an amazing trip to the mountains! 🏔️",
    imageUrls: ["https://example.com/images/mountain1.jpg"],
    videoUrls: [],
    createdAt: new Date("2025-04-20T10:00:00"),
    updatedAt: new Date("2025-04-20T10:00:00"),
  },
  {
    id: 102,
    user: mockUser,
    content: "Throwback to my favorite beach vacation! 🌊☀️",
    imageUrls: [
      "https://example.com/images/beach1.jpg",
      "https://example.com/images/beach2.jpg",
    ],
    videoUrls: ["https://example.com/videos/beachwalk.mp4"],
    createdAt: new Date("2025-04-18T14:30:00"),
    updatedAt: new Date("2025-04-18T14:30:00"),
    likes: 120,
    comments: 45,
    shares: 10,
  },
  {
    id: 103,
    user: mockUser,
    content: "My new setup for streaming games 🎮🔥",
    imageUrls: ["https://example.com/images/setup.jpg"],
    videoUrls: [],
    createdAt: new Date("2025-04-17T09:45:00"),
    updatedAt: new Date("2025-04-17T09:45:00"),
    likes: 120,
    comments: 45,
    shares: 10,
  },
  {
    id: 104,
    user: mockUser,
    content: "Quick vlog update: life, work, and everything else!",
    imageUrls: [],
    videoUrls: ["https://example.com/videos/vlog1.mp4"],
    createdAt: new Date("2025-04-15T17:20:00"),
    updatedAt: new Date("2025-04-15T17:20:00"),
    likes: 120,
    comments: 45,
    shares: 10,
  },
  {
    id: 105,
    user: mockUser,
    content: "Captured this stunning sunset yesterday! 🌇",
    imageUrls: ["https://example.com/images/sunset.jpg"],
    videoUrls: [],
    createdAt: new Date("2025-04-14T18:00:00"),
    updatedAt: new Date("2025-04-14T18:00:00"),
    likes: 120,
    comments: 45,
    shares: 10,
  },
];

const Home: React.FC = () => {
  return (
    <div className="flex h-screen justify-center">
      <div className="flex h-auto w-[1000px] flex-col p-4">
        {/* Thanh đăng bài viết */}
        <NewPostDialog />

        {/* Bài viết */}
        <PostList posts={mockPosts} className="py-4" />
      </div>
    </div>
  );
};

export default Home;
