import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FriendProfile from "./FriendProfile";
import axios from "axios";

type FriendRequest = {
  id: number;
  name: string;
  mutualFriends: number;
  avatar: string;
  time: string;
};

const FriendRequests: React.FC = () => {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<number | null>(null);
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
      .get("http://localhost:8090/friend-service/api/friends/requests", {
        headers: {
          Authorization: "Bearer fake-token",
        },
      })
      .then((response) => {
        const fetchedRequests = response.data.map((req: any) => ({
          id: req.id,
          name: req.firstName + " " + req.lastName,
          mutualFriends: req.mutualFriends,
          avatar: req.avatar,
          time: calculateTimeSince(req.time),
        }));

        setRequests(fetchedRequests);
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

  const handleAccept = (id: number) => {
    console.log("Accepting friend request with id:", id);
    axios
      .post(
        `http://localhost:8090/friend-service/api/friends/requests/accept/${id}`,
        null,
        {
          headers: {
            Authorization: "Bearer fake-token",
          },
        },
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
        `http://localhost:8090/friend-service/api/friends/requests/delete/${id}`,
        {
          headers: {
            Authorization: "Bearer fake-token",
          },
        },
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
            <a href="/sentRequest" className="text-blue-500 hover:underline">
              Xem lời mời đã gửi
            </a>
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
                  <div className="mr-4 h-12 w-12 rounded-full bg-gray-300"></div>
                  <div className="flex-1">
                    <p className="font-semibold">{request.name}</p>
                    <p className="flex justify-between text-sm text-gray-500">
                      <span>{request.mutualFriends} bạn chung</span>
                      <span>{request.time}</span>
                    </p>
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
