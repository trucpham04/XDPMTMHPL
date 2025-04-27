import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FriendProfile from "./FriendProfile";
import axios from "axios";

type Friend = {
  id: number;
  name: string;
  mutualFriends: number;
  avatar: string;
};

const AllFriend: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const navigate = useNavigate();
  const [selectedFriend, setSelectedFriend] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchFriends = () => {
    axios
      .get("http://localhost:8090/friend-service/api/friends", {
        headers: {
          Authorization: "Bearer fake-token",
        },
      })
      .then((response) => {
        const fetchedFriends = response.data.map((friend: any) => ({
          id: friend.id,
          name: friend.firstName + " " + friend.lastName,
          mutualFriends: friend.mutualFriends,
          avatar: friend.avatar,
        }));
        setFriends(fetchedFriends);
        setError(null);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách bạn bè:", error);
        setError("Không thể tải danh sách bạn bè. Vui lòng thử lại sau.");
      });
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleRemoveFriend = (id: number, name: string) => {
    if (!window.confirm(`Bạn có chắc muốn hủy kết bạn với ${name}?`)) {
      return;
    }
    axios
      .delete(`http://localhost:8090/friend-service/api/friends/${id}`, {
        headers: {
          Authorization: "Bearer fake-token",
        },
      })
      .then(() => {
        setFriends(friends.filter((friend) => friend.id !== id));
        setError(null);
      })
      .catch((error) => {
        console.error("Lỗi khi xóa bạn bè:", error);
        setError(`Không thể hủy kết bạn với ${name}. Vui lòng thử lại.`);
      });
  };
  return (
    <>
      <div className="left-0 h-screen w-90 bg-white shadow-sm">
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

          {error && <p className="py-2 text-center text-red-500">{error}</p>}
          {friends.length > 0 ? (
            friends.map((friend) => (
              <div
                key={friend.id}
                className="flex w-full flex-col rounded-lg px-2 py-3 hover:bg-gray-200"
                onClick={() => setSelectedFriend(friend.id)}
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
                  <button
                    className="w-30 rounded bg-blue-500 px-4 py-1 text-white hover:bg-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/messages");
                    }}
                  >
                    Nhắn tin
                  </button>
                  <button
                    className="w-30 rounded bg-gray-400 px-4 py-1 text-white hover:bg-gray-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFriend(friend.id, friend.name);
                    }}
                  >
                    Hủy kết bạn
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="py-4 text-center text-gray-500">
              Không có bạn bè nào
            </p>
          )}
        </div>
      </div>
      {selectedFriend !== null && (
        <div className="flex-1">
          <FriendProfile
            friendId={selectedFriend}
            onClose={() => setSelectedFriend(null)}
          />
        </div>
      )}
    </>
  );
};

export default AllFriend;
