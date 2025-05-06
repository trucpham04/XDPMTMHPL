import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { User } from "@/types/User";
import { Link } from "react-router-dom";

// interface User {
//   id: number;
//   firstName: string;
//   lastName: string;
//   avatarUrl: string;
//   relationStatus: "FRIEND" | "NOT_FRIEND" | "REQUEST_SENT" | "REQUEST_RECEIVED";
// }

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
        await axios
          .get<User[]>("http://127.0.0.1:8090/user-service/api/users/search", {
            params: {
              query: query.trim(),
              currentUserId,
            },
          })
          .then((res) => setResults(res.data));
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

      await axios.post(
        "http://localhost:8090/search-service/api/search/history",
        null,
        {
          params,
        },
      );

      console.log(
        "✅ Đã lưu lịch sử tìm kiếm cho:",
        user.firstName,
        user.lastName,
      );
    } catch (error) {
      console.error("❌ Lỗi khi lưu lịch sử người dùng:", error);
    }
  };

  return (
    <>
      <h2 className="mb-4 text-xl font-bold">People</h2>
      {loading ? (
        <p className="text-gray-500">Đang tìm kiếm...</p>
      ) : results.length == 0 ? (
        <p className="text-gray-500">Không tìm thấy kết quả.</p>
      ) : (
        <ul className="space-y-4">
          {results.map((user) => (
            <li key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.profilePictureUrl || ""} />
                  <AvatarFallback>
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Link to={`/profile/${user.id}`}>
                    <p
                      className="cursor-pointer font-medium hover:underline"
                      onClick={() => handleUserClick(user)}
                    >
                      {user.firstName} {user.lastName}
                    </p>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default PeopleResults;
