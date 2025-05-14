import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFriend } from "@/hooks/useFriend";
import UserAvatar from "@/components/app/userAvatar";

const DEFAULT_AVATAR = "https://placehold.co/150?text=No+Image";

const FriendList: React.FC = () => {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(10);
  const {
    requests,
    fetchRequests,
    acceptRequest,
    deleteRequest,
    loading,
    error,
  } = useFriend();

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const handleAddFriend = (id: number, name: string) => {
    axios
      .post(`http://127.0.0.1:8090/friend-service/api/friends/sent/${id}`)
      .then(() => {
        setSuggest(suggest.filter((friend) => friend.id !== id));
        setError1(null);
      })
      .catch((error) => {
        console.error("Lỗi khi thêm bạn bè:", error);
        setError1(`Không thể gửi kết bạn với ${name}. Vui lòng thử lại.`);
      });
  };

  return (
    <div className="m-8">
      <div className="flex">
        <h2 className="mb-4 text-xl font-bold text-black">Lời mời kết bạn</h2>
        <a
          className="mr-2 ml-auto cursor-pointer text-base text-blue-500"
          onClick={() => navigate("/friends/requests")}
        >
          Xem tất cả
        </a>
      </div>
      {error && <p className="py-2 text-center text-red-500">{error}</p>}
      {loading ? (
        <p className="py-4 text-center text-gray-500">Đang tải...</p>
      ) : requests.length > 0 ? (
        <div className="grid grid-cols-5 gap-2">
          {requests.slice(0, visibleCount).map((friend) => (
            <div
              key={friend.id}
              className="cursor-pointer overflow-hidden rounded-lg bg-white text-white shadow-md"
              onClick={() => navigate("/profile/" + friend.id)}
            >
              <img
                src={friend.profilePictureUrl || DEFAULT_AVATAR}
                alt={friend.firstName}
                className="h-40 w-full object-cover"
              />
              <div className="m-2">
                <p className="font-medium text-black">
                  {friend.firstName} {friend.lastName}
                </p>
                <div className="mt-2 flex flex-col justify-center space-y-2 font-bold">
                  <button
                    className="rounded-md bg-blue-500 py-1.5 text-base hover:bg-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      acceptRequest(friend.id);
                    }}
                  >
                    Xác nhận
                  </button>
                  <button
                    className="rounded-md bg-gray-200 py-1.5 text-base text-black hover:bg-gray-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteRequest(friend.id);
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-gray-500">
            Không có lời mời kết bạn nào
          </p>
        )}

        {visibleCount1 < requests1.length && (
          <div className="mt-2 flex justify-center py-2 hover:bg-gray-200">
            <div className="flex items-center">
              <a onClick={handleShowMore1} className="text-base">
                Xem thêm
              </a>
              <ChevronDown className="text-base text-blue-500" />
            </div>
          ))}
        </div>
      ) : (
        <p className="py-4 text-center text-gray-500">
          Không có lời mời kết bạn nào
        </p>
      )}

      {visibleCount < requests.length && (
        <div className="mt-2 flex justify-center py-2 hover:bg-gray-200">
          <div className="flex items-center">
            <a onClick={handleShowMore} className="cursor-pointer text-base">
              Xem thêm
            </a>
            <ChevronDown className="text-base text-blue-500" />
          </div>
        )}
      </div>
      <hr className="ml-8 mr-8 border-t-2 border-gray-300"/>
      <div className="m-8">
        <div className="flex">
          <h2 className="mb-4 text-xl font-bold text-black">Những người bạn có thể biết</h2>
          <a
            className="mr-2 ml-auto text-base text-blue-500"
            onClick={() => navigate("/friends/suggest")}
          >
            Xem tất cả
          </a>
        </div>
        {suggest.length > 0 ? (
          <div className="grid grid-cols-5 gap-2">
            {suggest.slice(0, visibleCount1).map((friend) => (
              <div
                key={friend.id}
                className="cursor-pointer overflow-hidden rounded-lg bg-white text-white shadow-md"
                onClick={() => navigate("/profile/" + friend.id)}
              >
                <img
                  src={friend.profilePictureUrl || DEFAULT_AVATAR}
                  alt={`${friend.firstName} ${friend.lastName}`}
                  className="h-40 w-full object-cover"
                  onError={(e) => {
                    // Fallback if the image fails to load
                    (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                  }}
                />
                <div className="m-2">
                  <p className="font-medium text-black">
                    {friend.firstName} {friend.lastName}
                  </p>
                  {/* <p className="text-base text-gray-500">
                    {friend.mutualFriends} Bạn chung
                  </p> */}
                  <div className="mt-2 flex flex-col justify-center space-y-2 font-bold">
                    <button
                      className="rounded-md bg-blue-500 py-1.5 text-base hover:bg-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddFriend(
                          friend.id,
                          friend.firstName + friend.lastName,
                        );
                      }}
                    >
                      Xác nhận
                    </button>
                    {/* <button
                      className="rounded-md bg-gray-200 py-1.5 text-base text-black hover:bg-gray-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete1(friend.id);
                      }}
                    >
                      Xóa
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-gray-500">
            Không có bạn bè gợi ý nào
          </p>
        )}

        {visibleCount1 < requests1.length && (
          <div className="mt-2 flex justify-center py-2 hover:bg-gray-200">
            <div className="flex items-center">
              <a onClick={handleShowMore1} className="text-base">
                Xem thêm
              </a>
              <ChevronDown className="text-base text-blue-500" />
            </div>
          </div>
        )}
      </div>
    </>
    
  );
};

export default FriendList;
