import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  relationStatus: "FRIEND" | "NOT_FRIEND" | "REQUEST_SENT" | "REQUEST_RECEIVED";
}

interface Props {
  query: string;
  currentUserId: number;
}

const PeopleResults: React.FC<Props> = ({ query, currentUserId }) => {
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get<User[]>(
          "http://localhost:8090/search-service/api/users/search/users",
          {
            params: {
              query: query.trim(),
              currentUserId,
            },
          },
        );
        setResults(response.data);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, currentUserId]);

  const handleUserClick = async (user: User) => {
    try {
      const params = {
        searcherId: currentUserId,
        userId: user.id,
        searchText: `${user.firstName} ${user.lastName}`,
      };

      await axios.post("http://localhost:8080/api/search/history", null, {
        params,
      });

      console.log(
        "✅ Đã lưu lịch sử tìm kiếm cho:",
        user.firstName,
        user.lastName,
      );
    } catch (error) {
      console.error("❌ Lỗi khi lưu lịch sử người dùng:", error);
    }
  };

  const renderButton = (status: User["relationStatus"]) => {
    switch (status) {
      case "FRIEND":
        return (
          <button className="rounded bg-blue-500 px-3 py-1 text-sm text-white">
            Message
          </button>
        );
      case "NOT_FRIEND":
        return (
          <button className="rounded bg-green-500 px-3 py-1 text-sm text-white">
            Add Friend
          </button>
        );
      case "REQUEST_SENT":
        return (
          <button className="rounded bg-yellow-500 px-3 py-1 text-sm text-white">
            Cancel Request
          </button>
        );
      case "REQUEST_RECEIVED":
        return (
          <button className="rounded bg-indigo-500 px-3 py-1 text-sm text-white">
            Accept
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <h2 className="mb-4 text-xl font-bold">People</h2>
      {loading ? (
        <p className="text-gray-500">Đang tìm kiếm...</p>
      ) : results.length === 0 ? (
        <p className="text-gray-500">Không tìm thấy kết quả.</p>
      ) : (
        <ul className="space-y-4">
          {results.map((user) => (
            <li key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatarUrl || ""} />
                  <AvatarFallback>
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p
                    className="cursor-pointer font-medium hover:underline"
                    onClick={() => handleUserClick(user)}
                  >
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user.relationStatus === "FRIEND" ? "Friend" : ""}
                  </p>
                </div>
              </div>
              {renderButton(user.relationStatus)}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default PeopleResults;
