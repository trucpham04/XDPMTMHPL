import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockRequests = [
  { id: 1, name: "Cường Mai", mutualFriends: 87, time: "2 ngày" },
  { id: 2, name: "Bé Bông", mutualFriends: 15, time: "44 tuần" },
  { id: 3, name: "Thanh Truyền", mutualFriends: 8, time: "2 năm" },
  { id: 4, name: "Trúc Giang", mutualFriends: 12, time: "2 năm" },
  { id: 5, name: "Hưng Thịnh", mutualFriends: 20, time: "35 tuần" },
];

const FriendRequests = () => {
  const [requests, setRequests] = useState(mockRequests);

  const handleAccept = (id: number) => {
    setRequests(requests.filter((req) => req.id !== id));
  };

  const handleDelete = (id: number) => {
    setRequests(requests.filter((req) => req.id !== id));
  };

  const navigate = useNavigate();
  return (
    
    <div className="w-full bg-white shadow-sm h-screen">
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
          <a href="#" className="text-blue-500 hover:underline">
            Xem lời mời đã gửi
          </a>
        </div>

       
          {requests.length > 0 ? (
            requests.map((request) => (
              <div key={request.id} className="w-full  py-3 px-2 flex flex-col hover:bg-gray-200 rounded-lg">
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
                    onClick={() => handleAccept(request.id)}
                  >
                    Xác nhận
                  </button>
                  <button
                    className="bg-gray-300 px-4 py-1  w-30 rounded hover:bg-gray-400"
                    onClick={() => handleDelete(request.id)}
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
  );
};

export default FriendRequests;
