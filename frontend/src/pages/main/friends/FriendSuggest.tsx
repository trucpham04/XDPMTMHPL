import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FriendProfile from "./FriendProfile";
import axios from "axios";
import { User } from "@/types/User";
import UserAvatar from "@/components/app/userAvatar";

axios.defaults.withCredentials = true;
const FriendSuggest: React.FC = () => {
  const [friendSuggests, setFriendSuggets] = useState<User[]>([]);
  const navigate = useNavigate();
  const [selectedFriend, setSelectedFriend] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sentRequests, setSentRequests] = useState<number[]>([]);

  const fetchFriends = () => {
    axios
      .get("http://127.0.0.1:8090/friend-service/api/friends/suggest")
      .then((response) => {
        setFriendSuggets(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách bạn bè gợi ý:", error);
        setError("Không thể tải danh sách bạn bè gợi ý. Vui lòng thử lại sau.");
      });
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleAddFriend = (id: number, name: string) => {
    axios
      .post(
        `http://127.0.0.1:8090/friend-service/api/friends/requests/sent/${id}`,
      )
      .then(() => {
        setSentRequests([...sentRequests, id]);
        setError(null);
      })
      .catch((error) => {
        console.error("Lỗi khi thêm bạn bè:", error);
        setError(`Không thể gửi kết bạn với ${name}. Vui lòng thử lại.`);
      });
  };

  const handleCancelRequest = (id: number, name: string) => {
    axios
      .delete(
        `http://127.0.0.1:8090/friend-service/api/friends/requests/cancel/${id}`,
      )
      .then(() => {
        setSentRequests(sentRequests.filter((requestId) => requestId !== id));
        setError(null);
      })
      .catch((error) => {
        console.error("Lỗi khi hủy lời mời kết bạn:", error);
        setError(
          `Không thể hủy lời mời kết bạn với ${name}. Vui lòng thử lại.`,
        );
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
              Gợi ý kết bạn{" "}
              <span className="ml-2 rounded-full bg-gray-200 px-2 py-1 text-sm font-semibold text-gray-700">
                {friendSuggests.length}
              </span>
            </h2>
          </div>

          {error && <p className="py-2 text-center text-red-500">{error}</p>}
          {friendSuggests.length > 0 ? (
            friendSuggests.map((friend) => (
              <div
                key={friend.id}
                className="flex w-full flex-col rounded-lg px-2 py-3 hover:bg-gray-200"
                onClick={() => {
                  navigate("/profile/" + friend.id);
                  // setSelectedFriend(friend.id);
                }}
              >
                <div className="flex w-full">
                  <UserAvatar
                    user={friend}
                    className="mr-4 size-14 rounded-full object-cover"
                  />

                  <div className="flex flex-1 flex-col">
                    <div className="flex-1">
                      <p className="font-semibold">{`${friend.firstName} ${friend.lastName}`}</p>
                      <p className="text-sm text-gray-500">
                        {friend.mutualFriends} bạn chung
                      </p>
                    </div>

                    <div className="mt-1 ml-auto flex w-full flex-1 justify-end space-x-2">
                      {sentRequests.includes(friend.id) ? (
                        <button
                          className="w-30 cursor-pointer rounded bg-gray-500 px-4 py-1 text-nowrap text-white hover:bg-gray-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelRequest(
                              friend.id,
                              friend.firstName + friend.lastName,
                            );
                          }}
                        >
                          Hủy lời mời
                        </button>
                      ) : (
                        <button
                          className="w-30 cursor-pointer rounded bg-blue-500 px-4 py-1 text-nowrap text-white hover:bg-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddFriend(
                              friend.id,
                              friend.firstName + friend.lastName,
                            );
                          }}
                        >
                          Kết bạn
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="py-4 text-center text-gray-500">
              Không có bạn bè gợi ý nào
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

export default FriendSuggest;
