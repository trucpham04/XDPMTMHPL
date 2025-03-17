// src/components/search/search-dropdown.tsx
import { X } from "lucide-react";
import { User } from "@/API/UserServiceInterface";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import history_clock from "@/assets/logos/history_clock.png";

interface SearchDropdownProps {
  history: User[]; 
  onSelect: (value: string) => void;
  onDelete: (userId: number) => void; 
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ history, onSelect, onDelete }) => {
  console.log("Dropdown nhận history:", history);
  return (
    <div className="absolute mt-1 w-full bg-white border rounded-xl shadow-lg z-50">
      {/* Header */}
      <div className="p-2 text-sm font-medium text-gray-500 flex justify-between items-center">
        <span>Recent</span>
        <button className="text-blue-500 hover:underline text-sm">Edit</button>
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <div className="p-2 text-gray-400 text-sm">No recent searches</div>
      ) : (
        history.map((user) => (
          <div
            key={user.id}
            className="p-2 flex justify-between items-center hover:bg-gray-100 cursor-pointer group"
          >
            {/* Avatar + Tên */}
            <div
              className="flex items-center gap-2"
              onClick={() => onSelect(user.name)}
            >
              <Avatar className="h-6 w-6">
  {user.avatarUrl ? (
    <>
      <AvatarImage src={user.avatarUrl} />
      <AvatarFallback>{user.name[0]}</AvatarFallback>
    </>
  ) : (
    <img src={history_clock} alt="icon" className="h-6 w-6 rounded-full" />
  )}
</Avatar>

              <span className="text-sm text-gray-800">{user.name}</span>
            </div>

            {/* Nút X */}
            <button
              onClick={(e) => {
                e.stopPropagation(); 
                onDelete(user.id);
              }}
              className="p-1 rounded-full hover:bg-gray-200"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchDropdown;
