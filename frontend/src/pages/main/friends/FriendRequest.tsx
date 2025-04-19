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
      .get("http://localhost:8082/api/friends/requests", {
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
        setError("Không thể tải danh sách lời mời kết bạn. Vui lòng thử lại sau.");
      });
  };

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const handleAccept = (id: number) => {
    console.log("Accepting friend request with id:", id);
    axios
      .post(`http://localhost:8082/api/friends/requests/accept/${id}`, null, {
        headers: {
          Authorization: "Bearer fake-token",
        },
      })
      .then(() => {
        fetchFriendRequests(); 
        setError(null);
      })
      .catch((error) => {
        console.error("Lỗi khi chấp nhận lời mời:", error);
        const errorMessage = error.response?.data || "Không thể chấp nhận lời mời. Vui lòng thử lại.";
        setError(errorMessage);
      });
  };

  const handleDelete = (id: number) => {
    axios
      .delete(`http://localhost:8082/api/friends/requests/delete/${id}`, {
        headers: {
          Authorization: "Bearer fake-token",
        },
      })
      .then(() => {
        fetchFriendRequests(); 
        setError(null);
      })
      .catch((error) => {
        console.error("Lỗi khi xóa lời mời:", error);
        const errorMessage = error.response?.data || "Không thể xóa lời mời. Vui lòng thử lại.";
        setError(errorMessage);
      });
  };

  const navigate = useNavigate();
  return (
    <>
      <div className="w-90 fixed left-0 bg-white shadow-sm h-screen">
        <div className="p-2">
          <div className=" items-center justify-between mb-4">
            <button onClick={() => navigate("/friends")} className="p-2">
              <ArrowLeft size={24} className="text-gray-500 cursor-pointer" />
            </button>
            <h2 className="text-2xl font-bold flex items-center">
              Lời mời kết bạn{" "}
              <span className="ml-2 bg-gray-200 text-gray-700 text-sm font-semibold px-2 py-1 rounded-full">
                {requests.length}
              </span>
            </h2>
            <a href="/sentRequest" className="text-blue-500 hover:underline">
              Xem lời mời đã gửi
            </a>
          </div>

        
            {requests.length > 0 ? (
              requests.map((request) => (
                <div key={request.id} className="w-full  py-3 px-2 flex flex-col hover:bg-gray-200 rounded-lg"
                onClick={() => {
                  if (selectedFriend !== request.id) {
                    setSelectedFriend(request.id);
                  }
                }}
                >
                  <div className="flex w-full">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                    <div className="flex-1">
                      <p className="font-semibold">{request.name}</p>
                      <p className="text-sm text-gray-500 flex justify-between">
                        <span>{request.mutualFriends} bạn chung</span>
                        <span>{request.time}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 ml-auto space-x-2 mt-1">
                    <button
                      className="bg-blue-500 text-white w-30 px-4 py-1 rounded hover:bg-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                         handleAccept(request.id)}}
                    >
                      Xác nhận
                    </button>
                    <button
                      className="bg-gray-300 px-4 py-1  w-30 rounded hover:bg-gray-400"
                      onClick={(e) => {
                        e.stopPropagation();
                         handleDelete(request.id)}}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Không có lời mời kết bạn nào</p>
            )}
          
        </div>
      </div>
      {selectedFriend !== null && (
        <div className="flex-1">
          <FriendProfile friendId={selectedFriend} onClose={() => setSelectedFriend(null)} />
        </div>
      )}
    </>
    
  );
};

export default FriendRequests;
