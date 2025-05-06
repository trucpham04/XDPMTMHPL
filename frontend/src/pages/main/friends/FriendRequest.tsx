import { useEffect, useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FriendProfile from "./FriendProfile";
import axios from "axios";
import { User } from "@/types/User";
import UserAvatar from "@/components/app/userAvatar";

type FriendRequest = {
  id: number;
  name: string;
  mutualFriends: number;
  avatar: string;
  time: string;
};

axios.defaults.withCredentials = true;
const FriendRequests: React.FC = () => {
  const [requests, setRequests] = useState<User[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<number | null>(null);
  const [sentRequests, setSentRequests] = useState<User[]>([]);
  const [showSentRequests, setShowSentRequests] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateTimeSince = (date: string): string => {
    const requestDate = new Date(date);
    const now = new Date();
    const diffInMs = now.getTime() - requestDate.getTime();

    const years = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365));
    if (years > 0) return `${years} năm`;

    const weeks = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
    if (weeks > 0) return `${weeks} tuần`;

    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    return `${days} ngày`;
  };

  const fetchFriendRequests = () => {
    axios
      .get("http://127.0.0.1:8090/friend-service/api/friends/requests")
      .then((response) => {
        // const fetchedRequests = response.data.map((req: any) => ({
        //   id: req.id,
        //   name: req.firstName + " " + req.lastName,
        //   mutualFriends: req.mutualFriends,
        //   avatar: req.avatar,
        //   time: calculateTimeSince(req.time),
        // }));

        setRequests(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách lời mời kết bạn:", error);
        setError(
          "Không thể tải danh sách lời mời kết bạn. Vui lòng thử lại sau.",
        );
      });
  };

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchSentRequests = () => {
    axios
      .get("http://127.0.0.1:8090/friend-service/api/friends/requests/allsent")
      .then((response) => {
        setSentRequests(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách lời mời đã gửi:", error);
        setError(
          "Không thể tải danh sách lời mời đã gửi. Vui lòng thử lại sau."
        );
      });
  };

  useEffect(() => {
    fetchSentRequests();
  }, []);

  const handleCancel = (id: number) => {
    axios
      .delete(`http://127.0.0.1:8090/friend-service/api/friends/requests/cancel/${id}`)
      .then(() => {
        fetchSentRequests();
      })
      .catch((error) => {
        console.error("Lỗi khi hủy lời mời:", error);
        setError("Không thể hủy lời mời. Vui lòng thử lại.");
      });
  };

  const handleAccept = (id: number) => {
    console.log("Accepting friend request with id:", id);
    axios
      .post(
        `http://127.0.0.1:8090/friend-service/api/friends/requests/accept/${id}`,
        null,
      )
      .then(() => {
        fetchFriendRequests();
        setError(null);
      })
      .catch((error) => {
        console.error("Lỗi khi chấp nhận lời mời:", error);
        const errorMessage =
          error.response?.data ||
          "Không thể chấp nhận lời mời. Vui lòng thử lại.";
        setError(errorMessage);
      });
  };

  const handleDelete = (id: number) => {
    axios
      .delete(
        `http://127.0.0.1:8090/friend-service/api/friends/requests/delete/${id}`,
      )
      .then(() => {
        fetchFriendRequests();
        setError(null);
      })
      .catch((error) => {
        console.error("Lỗi khi xóa lời mời:", error);
        const errorMessage =
          error.response?.data || "Không thể xóa lời mời. Vui lòng thử lại.";
        setError(errorMessage);
      });
  };

  const navigate = useNavigate();
  return (
    <>
      <div className="fixed left-0 h-screen w-90 bg-white shadow-sm">
        <div className="p-2">
          <div className="mb-4 items-center justify-between">
            <button onClick={() => navigate("/friends")} className="p-2">
              <ArrowLeft size={24} className="cursor-pointer text-gray-500" />
            </button>
            <h2 className="flex items-center text-2xl font-bold">
              Lời mời kết bạn{" "}
              <span className="ml-2 rounded-full bg-gray-200 px-2 py-1 text-sm font-semibold text-gray-700">
                {requests.length}
              </span>
            </h2>
            <button onClick={() => {
              fetchSentRequests();
              setShowSentRequests(true);
              }}
                className="text-blue-500 hover:underline"
            >
              Xem lời mời đã gửi
            </button> 
            {showSentRequests && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-lg">
                  <div className="mb-4 flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold">Lời mời đã gửi</h2>
                      <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-sm font-semibold text-gray-700">
                        {sentRequests.length}
                      </span>
                    </div>
                    <button onClick={() => setShowSentRequests(false)} className="p-1 ml-auto">
                      <X size={20} className="text-gray-600" />
                    </button>
                  </div>

                  {error && <p className="mb-2 text-sm text-red-500">{error}</p>}

                  {sentRequests.length > 0 ? (
                    <ul className="max-h-[400px] space-y-3 overflow-y-auto">
                      {sentRequests.map((request) => (
                        <li
                          key={request.id}
                          className="flex items-center justify-between rounded-md bg-gray-100 px-3 py-2 hover:bg-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            <UserAvatar className="h-10 w-10" user={request} />
                            <div>
                              <p className="font-medium">{`${request.firstName} ${request.lastName}`}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCancel(request.id)}
                            className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                          >
                            Hủy
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="py-8 text-center text-gray-500">Không có lời mời nào đã gửi</p>
                  )}
                </div>
              </div>
            )}
           
          </div>
          {requests.length > 0 ? (
            requests.map((request) => (
              <div
                key={request.id}
                className="flex w-full flex-col rounded-lg px-2 py-3 hover:bg-gray-200"
                onClick={() => {
                  if (selectedFriend !== request.id) {
                    setSelectedFriend(request.id);
                  }
                }}
              >
                <div className="flex w-full">
                  <UserAvatar className="mr-4 size-12" user={request} />
                  <div className="flex-1">
                    <p className="font-semibold">{`${request.firstName} ${request.lastName}`}</p>
                    {/* <p className="flex justify-between text-sm text-gray-500">
                      <span>{request.mutualFriends} bạn chung</span>
                      <span>{request.time}</span>
                    </p> */}
                  </div>
                </div>
                <div className="mt-1 ml-auto flex-1 space-x-2">
                  <button
                    className="w-30 rounded bg-blue-500 px-4 py-1 text-white hover:bg-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccept(request.id);
                    }}
                  >
                    Xác nhận
                  </button>
                  <button
                    className="w-30 rounded bg-gray-300 px-4 py-1 hover:bg-gray-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(request.id);
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="py-4 text-center text-gray-500">
              Không có lời mời kết bạn nào
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

export default FriendRequests;
