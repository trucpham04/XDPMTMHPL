// src/components/search/search-results.tsx
import React from "react";
import { User } from "@/API/UserServiceInterface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


interface SearchResultsProps {
    users: User[];
    onSelect: (user: User) => void; // trả nguyên user
  }
  

const SearchResults: React.FC<SearchResultsProps> = ({ users, onSelect }) => {
  return (
    <div className="absolute mt-1 w-full bg-white border rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
      {users.length === 0 ? (
        <div className="p-2 text-sm text-gray-400">Không tìm thấy người dùng</div>
      ) : (
        users.map((user) => {
          const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || "Unknown";
          return (
            <div
              key={user.id}
              onClick={() => onSelect(user)}
              className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatarUrl || ""} />
                <AvatarFallback>{displayName[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-700">{displayName}</span>
            </div>
          );
        })
      )}
    </div>
  );
};

export default SearchResults;
