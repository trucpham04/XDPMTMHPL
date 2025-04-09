import { useEffect, useState } from "react";
import { ArrowLeft}  from "lucide-react";
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

  // Gọi API để lấy danh sách bạn bè khi component được mount
  useEffect(() => {
    axios.get("http://localhost:8080/friends") // Đổi URL API theo backend của bạn
      .then(response => {
        console.log("Dữ liệu nhận được:", response.data);
        setFriends(response.data);
      })
      .catch(error => console.error("Lỗi khi lấy danh sách bạn bè:", error));
  }, []);

  // Hàm xóa bạn bè
  const handleRemoveFriend = (id: number) => {
    axios.delete(`http://localhost:8080/friends/${id}`) // API xóa bạn bè
      .then(() => {
        setFriends(friends.filter(friend => friend.id !== id));
      })
      .catch(error => console.error("Lỗi khi xóa bạn bè:", error));
  };

  return (
    <>
      <div className="w-90 left-0 bg-white shadow-sm h-screen">
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
              <div key={friend.id} className="w-full py-3 px-2 flex flex-col hover:bg-gray-200 rounded-lg"
                  onClick={() => setSelectedFriend(friend.id)}
              >
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
                  <button className="bg-blue-500 text-white w-30 px-4 py-1 rounded hover:bg-blue-600"
                      onClick={(e)=>{
                        e.stopPropagation();
                        navigate("/messages")}}
                  >
                    Nhắn tin
                  </button>
                  <button
                    className="bg-gray-400 text-white px-4 py-1 w-30 rounded hover:bg-gray-500"
                    onClick={(e) =>{
                      e.stopPropagation();
                      handleRemoveFriend(friend.id)}}
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
      {selectedFriend !== null && (
        <div className="flex-1">
          <FriendProfile friendId={selectedFriend} onClose={() => setSelectedFriend(null)} />
        </div>
      )}

    </>
    
  );
};

export default AllFriend;
