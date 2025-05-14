import React, { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/User";
import { Link } from "react-router-dom";
import { useSearch } from "@/hooks/useSearch";

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
  const { users, loading, searchUsers, saveSearchHistory } = useSearch();

  useEffect(() => {
    if (!query.trim()) return;
    searchUsers(query, currentUserId);
  }, [query, currentUserId, searchUsers]);

  const handleUserClick = async (user: User) => {
    await saveSearchHistory(
      currentUserId,
      user.id,
      `${user.firstName} ${user.lastName}`,
    );
  };

  return (
    <>
      <h2 className="mb-4 text-xl font-bold">People</h2>
      {loading ? (
        <p className="text-gray-500">Đang tìm kiếm...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500">Không tìm thấy kết quả.</p>
      ) : (
        <ul className="space-y-4">
          {users.map((user) => (
            <li key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.profilePictureUrl || undefined} />
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
