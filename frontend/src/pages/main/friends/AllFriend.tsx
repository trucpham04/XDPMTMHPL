import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockFriends = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    mutualFriends: 10,
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "Trần Thị B",
    mutualFriends: 8,
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 3,
    name: "Phạm Văn C",
    mutualFriends: 5,
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
];

const AllFriend = () => {
  const [friends, setFriends] = useState(mockFriends);
  const navigate = useNavigate();

  const handleRemoveFriend = (id: number) => {
    setFriends(friends.filter((friend) => friend.id !== id));
  };

  return (
    <div className="h-screen w-full bg-white shadow-sm">
      <div className="p-2">
        <div className="mb-4 items-center justify-between">
          <button onClick={() => navigate("/friends")} className="p-2">
            <ArrowLeft size={24} className="cursor-pointer text-gray-500" />
          </button>
          <h2 className="flex items-center text-2xl font-bold">
            Danh sách bạn bè{" "}
            <span className="ml-2 rounded-full bg-gray-200 px-2 py-1 text-sm font-semibold text-gray-700">
              {friends.length}
            </span>
          </h2>
        </div>

        {friends.length > 0 ? (
          friends.map((friend) => (
            <div
              key={friend.id}
              className="flex w-full flex-col rounded-lg px-2 py-3 hover:bg-gray-200"
            >
              <div className="flex w-full">
                <div className="mr-4 h-12 w-12 rounded-full bg-gray-300">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="mr-4 h-12 w-12 rounded-full"
                  />
                </div>

                <div className="flex-1">
                  <p className="font-semibold">{friend.name}</p>
                  <p className="text-sm text-gray-500">
                    {friend.mutualFriends} bạn chung
                  </p>
                </div>
              </div>
              <div className="mt-1 ml-auto flex-1 space-x-2">
                <button className="w-30 rounded bg-blue-500 px-4 py-1 text-white hover:bg-blue-600">
                  Nhắn tin
                </button>
                <button
                  className="w-30 rounded bg-gray-400 px-4 py-1 text-nowrap text-white hover:bg-gray-500"
                  onClick={() => handleRemoveFriend(friend.id)}
                >
                  Hủy kết bạn
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="py-4 text-center text-gray-500">Không có bạn bè nào</p>
        )}
      </div>
    </div>
  );
};

export default AllFriend;
