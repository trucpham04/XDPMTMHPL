import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Friend {
  id: number;
  name: string;
  avatar: string;
  mutualFriends: number;
  isAdded: boolean;
}

const initialSuggestions: Friend[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    mutualFriends: 3,
    isAdded: false,
  },
  {
    id: 2,
    name: "Trần Thị B",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    mutualFriends: 5,
    isAdded: false,
  },
  {
    id: 3,
    name: "Phạm Văn C",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    mutualFriends: 2,
    isAdded: false,
  },
];

const FriendSuggest: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Friend[]>(initialSuggestions);
  const handleAddFriend = (id: number) => {
    setSuggestions((prev) =>
      prev.map((friend) =>
        friend.id === id ? { ...friend, isAdded: true } : friend
      )
    );
  };

  const navigate = useNavigate();
  
  return (
    <div className="w-full bg-white shadow-sm h-screen">
      <div className="p-2">
        <button onClick={() => navigate("/friends")} className="p-2">
          <ArrowLeft size={24} className="text-gray-500 cursor-pointer" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Gợi ý kết bạn</h2>
        <ul>
          {suggestions.map((friend) => (
            <li
              key={friend.id}
              className="flex items-center justify-between py-3 px-2 hover:bg-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-medium">{friend.name}</p>
                  <p className="text-sm text-gray-500">
                    {friend.mutualFriends} bạn chung
                  </p>
                </div>
              </div>
              <button
                className={`px-4 py-1 rounded-md text-white ${
                  friend.isAdded ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                }`}
                onClick={() => handleAddFriend(friend.id)}
                disabled={friend.isAdded}
              >
                {friend.isAdded ? "Đã gửi" : "Kết bạn"}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
    </div>
  );
};

export default FriendSuggest;
