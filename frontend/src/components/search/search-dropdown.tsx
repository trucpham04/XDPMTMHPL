import { X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import history_clock from "@/assets/logos/history_clock.png";
import { useState, useEffect } from "react";
import axios from "axios";
import avatar from "@/assets/logos/avatar.jpg";
<<<<<<< Updated upstream
import { SearchHistory } from "@/types/Search";
=======
import { SearchHistory } from "@/API/HistoryServiceInterface";
>>>>>>> Stashed changes

interface SearchDropdownProps {
  onSelect: (history: SearchHistory) => void;
  userId: number | null;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  onSelect,
  // userId,
}) => {
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [errorHistory, setErrorHistory] = useState<string | null>(null);

  const handleDeleteHistory = async (id: number | undefined) => {
    if (!id) {
      console.warn("⚠️ Không có ID để xóa!");
      return;
    }
    try {
      console.log("🧾 ID cần xóa:", id);
<<<<<<< Updated upstream
      await axios.delete(
        `http://127.0.0.1:8090/search-service/api/search/history/${id}`,
      );
=======
      await axios.delete(`http://localhost:8080/api/search/history/${id}`);
>>>>>>> Stashed changes
      setSearchHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("❌ Lỗi khi xóa lịch sử:", error);
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get<SearchHistory[]>(
<<<<<<< Updated upstream
          `http://127.0.0.1:8090/search-service/api/search/recent-users`,
=======
          `http://localhost:8080/api/search/recent-users`,
>>>>>>> Stashed changes
        );

        response.data.forEach((item, index) => {
          console.log(`📌 Item ${index}:`, item);
          console.log(`   → ID: ${item.id}`);
          console.log("👤 User của item:", item.user);
        });
        console.log("📦 Dữ liệu search history:", response.data);
        // 🔍 Kiểm tra từng phần tử
        response.data.forEach((item, index) => {
          console.log(`📌 Item ${index}:`, item);
        });
        setSearchHistory(response.data);
        setLoadingHistory(false);
      } catch {
        setErrorHistory("❌ Lỗi khi lấy lịch sử tìm kiếm.");
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, []);

  if (loadingHistory) {
    return <div className="p-2 text-sm text-gray-400">Đang tải lịch sử...</div>;
  }

  if (errorHistory) {
    return <div className="p-2 text-sm text-red-400">{errorHistory}</div>;
  }

  return (
    <div className="absolute z-50 mt-1 w-full rounded-xl border bg-white shadow-lg">
      <div className="flex items-center justify-between p-2 text-sm font-medium text-gray-500">
        <span>Recent</span>
        <button className="text-sm text-blue-500 hover:underline">Edit</button>
      </div>

      {searchHistory.length === 0 ? (
        <div className="p-2 text-sm text-gray-400">No recent searches</div>
      ) : (
        searchHistory.map((item) => {
          const isTargetUser = !!item.targetUser;
          const userName = isTargetUser
            ? `${item.targetUser!.firstName} ${item.targetUser!.lastName}`
            : item.searchText;
<<<<<<< Updated upstream

          const avatarSrc = isTargetUser
            ? item.targetUser?.profilePicture || avatar
            : history_clock;

=======
        
          const avatarSrc = isTargetUser
            ? item.targetUser?.avatarUrl || avatar
            : history_clock;
        
>>>>>>> Stashed changes
          return (
            <div
              key={item.id}
              className="group flex cursor-pointer items-center justify-between p-2 hover:bg-gray-100"
              onClick={() => {
                const targetId = item.targetUser?.id ?? null;
                console.log("🧠 Người dùng trong item:", item.targetUser); // Kiểm tra targetUser
                console.log("🎯 targetUserId:", targetId); // Kiểm tra targetUserId
                onSelect(item);
              }}
            >
              <div className="flex items-center gap-2">
                {isTargetUser ? (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={avatarSrc} alt="avatar" />
                    <AvatarFallback>
<<<<<<< Updated upstream
                      {item.targetUser!.firstName?.[0] ||
                        item.targetUser!.lastName?.[0]}
=======
                      {item.targetUser!.firstName?.[0] || item.targetUser!.lastName?.[0]}
>>>>>>> Stashed changes
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <img
                    src={avatarSrc}
                    alt="search"
                    className="h-6 w-6 rounded-full"
                  />
                )}
<<<<<<< Updated upstream

                <span className="text-sm text-gray-800">{userName}</span>
              </div>

=======
        
                <span className="text-sm text-gray-800">{userName}</span>
              </div>
        
>>>>>>> Stashed changes
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  await handleDeleteHistory(item.id);
                }}
                className="rounded-full p-1 hover:bg-gray-200"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
          );
        })
<<<<<<< Updated upstream
      )}
=======
      )}        
>>>>>>> Stashed changes
    </div>
  );
};

export default SearchDropdown;
