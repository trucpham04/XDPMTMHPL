// src/pages/search/PeopleResults.tsx
import React, { useEffect, useState } from "react";
import { User } from "@/API/UserServiceInterface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAllUsers } from "@/API/UserServiceMock"; //  dùng mock

export const fetchUsers = async (): Promise<User[]> => {
  const result = await getAllUsers(""); // Lấy toàn bộ user mock
  return result.data;
};

interface Props {
  query: string;
}

const PeopleResults: React.FC<Props> = ({ query }) => {
  const [results, setResults] = useState<User[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      const allUsers = await fetchUsers();
      const filtered = allUsers.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase()),
      );
      setResults(filtered);
    };
    fetchResults();
  }, [query]);

  return (
    <>
      <h2 className="mb-4 text-xl font-bold">People</h2>
      {results.length === 0 ? (
        <p className="text-gray-500">No results found.</p>
      ) : (
        <ul className="space-y-4">
          {results.map((user) => (
            <li key={user.id} className="flex items-center justify-between">
              <div
                className="flex cursor-pointer items-center gap-3"
                onClick={() => {
                  const stored = localStorage.getItem("searchHistory");
                  const prev: User[] = stored ? JSON.parse(stored) : [];
                  const exists = prev.some((u) => u.id === user.id);
                  const updated = exists ? prev : [user, ...prev.slice(0, 7)];
                  localStorage.setItem(
                    "searchHistory",
                    JSON.stringify(updated),
                  );
                }}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatarUrl || ""} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="cursor-pointer font-medium hover:underline">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Friend · X mutual friends
                  </p>
                </div>
              </div>
              <button className="rounded bg-blue-500 px-3 py-1 text-sm text-white">
                Message
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default PeopleResults;

// const fetchUsers = async (): Promise<User[]> => {
//   return [
//     { id: 1, name: "Trang Thủy", avatarUrl: "" },
//     { id: 2, name: "Truaang", avatarUrl: "" },
//     { id: 3, name: "Hoàng Traaung", avatarUrl: "" },
//     { id: 4, name: "Trang hi", avatarUrl: "" },
//     { id: 6, name: "lala", avatarUrl: "" },
//     { id: 7, name: "beta", avatarUrl: "" },
//     { id: 8, name: "gann", avatarUrl: "" },
//     { id: 9, name: "huara", avatarUrl: "" },
//     { id: 10, name: "tama", avatarUrl: "" },
//     { id: 11, name: "jihoom", avatarUrl: "" },
//     { id: 12, name: "khook", avatarUrl: "" },
//     { id: 13, name: "nona", avatarUrl: "" },
//   ];
// };
