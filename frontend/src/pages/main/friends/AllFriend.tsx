import { useState } from "react";
import { ArrowLeft}  from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockFriends = [
  { id: 1, name: "Nguyễn Văn A", mutualFriends: 10, avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 2, name: "Trần Thị B", mutualFriends: 8, avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 3, name: "Phạm Văn C", mutualFriends: 5, avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
];

const AllFriend = () => {
  const [friends, setFriends] = useState(mockFriends);
  const navigate = useNavigate();

  const handleRemoveFriend = (id: number) => {
    setFriends(friends.filter((friend) => friend.id !== id));
  };

  return (
    <div className="w-full bg-white shadow-sm h-screen">
      <div className="p-2">
          <div className=" items-center justify-between mb-4">
              <button onClick={() => navigate("/friends")} className="p-2">
                <ArrowLeft size={24} className="text-gray-500 cursor-pointer" />
              </button>
              <h2 className="text-2xl font-bold flex items-center">
                Danh sách bạn bè{" "}
                <span className="ml-2 bg-gray-200 text-gray-700 text-sm font-semibold px-2 py-1 rounded-full">
                  {friends.length}
                </span>
              </h2>
              
            </div>

        {friends.length > 0 ? (
          friends.map((friend) => (
            <div key={friend.id} className="w-full py-3 px-2 flex flex-col hover:bg-gray-200 rounded-lg">
              <div className="flex w-full">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                </div>

                
                <div className="flex-1">
                  <p className="font-semibold">{friend.name}</p>
                  <p className="text-sm text-gray-500">{friend.mutualFriends} bạn chung</p>
                </div>
              </div>
              <div className="flex-1 ml-auto space-x-2 mt-1">
                <button className="bg-blue-500 text-white w-30 px-4 py-1 rounded hover:bg-blue-600">
                  Nhắn tin
                </button>
                <button
                  className="bg-gray-400 text-white px-4 py-1 w-30 rounded hover:bg-gray-500"
                  onClick={() => handleRemoveFriend(friend.id)}
                >
                  Hủy kết bạn
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">Không có bạn bè nào</p>
        )}
      </div>
    </div>
  );
};

export default AllFriend;
