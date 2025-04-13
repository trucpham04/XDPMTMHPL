import { ChevronDown   } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";



type FriendRequest = {
    id: number;
    name: string;
    mutualFriends: number;
    avatar: string;
    time: string; // Thời gian tính từ requestDate
  };
  
  // Hàm tính thời gian kể từ ngày gửi lời mời
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



const FriendList: React.FC = ()=>{
        const navigate = useNavigate();
      
        // State cho "Lời mời kết bạn"
        const [visibleCount1, setVisibleCount1] = useState(10);
        const [requests1, setRequests1] = useState<FriendRequest[]>([]);
        const [error1, setError1] = useState<string | null>(null); // Lưu lỗi nếu có
      
        const handleShowMore1 = () => {
          setVisibleCount1((prev) => prev + 10);
        };
      
        // Lấy danh sách lời mời kết bạn từ API
        const fetchFriendRequests = () => {
          axios
            .get("http://localhost:8080/api/friends/requests", {
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
                time: calculateTimeSince(req.requestDate),
              }));
              setRequests1(fetchedRequests);
              setError1(null);
            })
            .catch((error) => {
              console.error("Lỗi khi lấy danh sách lời mời kết bạn:", error);
              setError1("Không thể tải danh sách lời mời kết bạn. Vui lòng thử lại sau.");
            });
        };
      
        // Gọi API khi component được render
        useEffect(() => {
          fetchFriendRequests();
        }, []);
      
        // Xử lý "Xác nhận" lời mời
        const handleAccept1 = (id: number) => {
          console.log("Accepting friend request with id:", id);
          axios
            .post(`http://localhost:8080/api/friends/requests/accept/${id}`, null, {
              headers: {
                Authorization: "Bearer fake-token",
              },
            })
            .then(() => {
              fetchFriendRequests(); // Cập nhật danh sách lời mời
              setError1(null);
            })
            .catch((error) => {
              console.error("Lỗi khi chấp nhận lời mời:", error);
              const errorMessage = error.response?.data || "Không thể chấp nhận lời mời. Vui lòng thử lại.";
              setError1(errorMessage);
            });
        };
      
        // Xử lý "Xóa" lời mời
        const handleDelete1 = (id: number) => {
          console.log("Deleting friend request with id:", id);
          axios
            .delete(`http://localhost:8080/api/friends/requests/delete/${id}`, {
              headers: {
                Authorization: "Bearer fake-token",
              },
            })
            .then(() => {
              fetchFriendRequests(); // Cập nhật danh sách lời mời
              setError1(null);
            })
            .catch((error) => {
              console.error("Lỗi khi xóa lời mời:", error);
              const errorMessage = error.response?.data || "Không thể xóa lời mời. Vui lòng thử lại.";
              setError1(errorMessage);
            });
        };

   
    return (
        <div className=" m-8 ">
            <div className="flex">
                <h2 className="text-black text-xl font-bold mb-4">Lời mời kết bạn</h2>
                <a className="text-base ml-auto mr-2 text-blue-500"
                    onClick={() => navigate("/friends/requests")}
                >
                    Xem tất cả
                </a>
            </div>
            {requests1.length > 0 ? (
                <div className="grid grid-cols-5 gap-2">
                    {requests1.slice(0,visibleCount1).map((friend) =>
                        <div key={friend.id} className="bg-white rounded-lg text-white overflow-hidden shadow-md cursor-pointer"
                            onClick={()=> navigate("/friends/profile")}
                        >
                        <img src={friend.avatar} alt={friend.name} className="w-full " />
                        <div className="m-2">
                            <p className="text-black font-medium">{friend.name}</p>
                            <p className="text-base text-gray-500">{friend.mutualFriends} Bạn chung</p>
                            <div className="flex flex-col justify-center space-y-2 mt-2 font-bold">
                                <button className="bg-blue-500  py-1.5 rounded-md text-base hover:bg-blue-600"
                                        onClick={(e) =>{
                                            e.stopPropagation();
                                             handleAccept1(friend.id)}}
                                >
                                    Xác nhận
                                </button>
                                <button className="bg-gray-200  py-1.5 rounded-md text-base text-black hover:bg-gray-300"
                                onClick={(e) =>{
                                    e.stopPropagation();
                                     handleDelete1(friend.id)}}
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                        
                    </div>)}
                </div>
            ):(
                <p className="text-gray-500 text-center py-4">Không có lời mời kết bạn nào</p>
            )}

            {visibleCount1 < requests1.length && (
            <div className="flex justify-center mt-2 py-2 hover:bg-gray-200">
                <div className="flex items-center ">
                    <a onClick={handleShowMore1} className="text-base">Xem thêm</a>
                    <ChevronDown className="text-base text-blue-500" />
                </div>
            </div>
            )}
            {/* <hr className="my-4 border-t-2 border-gray-300 font-bold" />  */}
        </div>
        
    )
        
    
};

export default FriendList;