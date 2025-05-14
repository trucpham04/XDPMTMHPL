import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FriendProfile from "./FriendProfile";
import { User } from "@/types/User";
import UserAvatar from "@/components/app/userAvatar";
import { useFriend } from "@/hooks/useFriend";

const AllFriend: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFriend, setSelectedFriend] = useState<number | null>(null);
  const { friends, error, fetchFriends, removeFriend, loading } = useFriend();

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const handleRemoveFriend = (id: number, name: string) => {
    if (!window.confirm(`Bạn có chắc muốn hủy kết bạn với ${name}?`)) {
      return;
    }
    removeFriend(id);
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
          {loading ? (
            <p className="py-4 text-center text-gray-500">Đang tải...</p>
          ) : friends.length > 0 ? (
            friends.map((friend) => (
              <div
                key={friend.id}
                className="flex w-full flex-col rounded-lg px-2 py-3 hover:bg-gray-200"
                onClick={() => {
                  navigate("/profile/" + friend.id);
                }}
              >
                <div className="flex w-full">
                  <div className="mr-4 h-12 w-12 rounded-full bg-gray-300">
                    <UserAvatar user={friend} className="size-12" />
                  </div>

                  <div className="flex flex-col">
                    <div className="flex-1">
                      <p className="font-semibold">{`${friend.firstName} ${friend.lastName}`}</p>
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
                        className="w-30 rounded bg-gray-400 px-4 py-1 text-nowrap text-white hover:bg-gray-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFriend(
                            friend.id,
                            friend.firstName + friend.lastName,
                          );
                        }}
                      >
                        Hủy kết bạn
                      </button>
                    </div>
                  </div>
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
