import { useEffect, useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FriendProfile from "./FriendProfile";
import UserAvatar from "@/components/app/userAvatar";
import { useFriend } from "@/hooks/useFriend";

import axios from "axios";

axios.defaults.withCredentials = true;
const FriendRequests: React.FC = () => {
  const [selectedFriend, setSelectedFriend] = useState<number | null>(null);
  const [showSentRequests, setShowSentRequests] = useState(false);
  const navigate = useNavigate();
  const {
    requests,
    sentRequests,
    error,
    fetchRequests,
    fetchSentRequests,
    acceptRequest,
    deleteRequest,
    cancelRequest,
    loading,
  } = useFriend();

  useEffect(() => {
    fetchRequests();
    fetchSentRequests();
  }, [fetchRequests, fetchSentRequests]);

  const handleAccept = (id: number) => {
    acceptRequest(id);
  };

  const handleDelete = (id: number) => {
    deleteRequest(id);
  };

  const handleCancel = (id: number) => {
    cancelRequest(id);
  };

  return (
    <>
      <div className="fixed left-0 h-screen w-90 bg-white shadow-sm">
        <div className="p-2">
          <div className="mb-4 items-center justify-between">
            <button onClick={() => navigate("/friends")} className="p-2">
              <ArrowLeft size={24} className="cursor-pointer text-gray-500" />
            </button>
            <h2 className="flex items-center text-2xl font-bold">
              Lời mời kết bạn{" "}
              <span className="ml-2 rounded-full bg-gray-200 px-2 py-1 text-sm font-semibold text-gray-700">
                {requests.length}
              </span>
            </h2>
            <button
              onClick={() => {
                fetchSentRequests();
                setShowSentRequests(true);
              }}
              className="text-blue-500 hover:underline"
            >
              Xem lời mời đã gửi
            </button>
            {showSentRequests && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-lg">
                  <div className="mb-4 flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold">Lời mời đã gửi</h2>
                      <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-sm font-semibold text-gray-700">
                        {sentRequests.length}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowSentRequests(false)}
                      className="ml-auto p-1"
                    >
                      <X size={20} className="text-gray-600" />
                    </button>
                  </div>

                  {error && (
                    <p className="mb-2 text-sm text-red-500">{error}</p>
                  )}

                  {sentRequests.length > 0 ? (
                    <ul className="max-h-[400px] space-y-3 overflow-y-auto">
                      {sentRequests.map((request) => (
                        <li
                          key={request.id}
                          className="flex items-center justify-between rounded-md bg-gray-100 px-3 py-2 hover:bg-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            <UserAvatar className="h-10 w-10" user={request} />
                            <div>
                              <p className="font-medium">{`${request.firstName} ${request.lastName}`}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCancel(request.id)}
                            className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                          >
                            Hủy
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="py-8 text-center text-gray-500">
                      Không có lời mời nào đã gửi
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {error && <p className="py-2 text-center text-red-500">{error}</p>}
          {loading ? (
            <p className="py-4 text-center text-gray-500">Đang tải...</p>
          ) : requests.length > 0 ? (
            requests.map((request) => (
              <div
                key={request.id}
                className="flex w-full flex-col rounded-lg px-2 py-3 hover:bg-gray-200"
                onClick={() => {
                  setSelectedFriend(request.id);
                }}
              >
                <div className="flex w-full">
                  <div className="mr-4 h-12 w-12 rounded-full bg-gray-300">
                    <UserAvatar user={request} className="size-12" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex-1">
                      <p className="font-semibold">{`${request.firstName} ${request.lastName}`}</p>
                    </div>
                    <div className="mt-1 ml-auto flex-1 space-x-2">
                      <button
                        className="w-30 rounded bg-blue-500 px-4 py-1 text-white hover:bg-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAccept(request.id);
                        }}
                      >
                        Chấp nhận
                      </button>
                      <button
                        className="w-30 rounded bg-gray-400 px-4 py-1 text-nowrap text-white hover:bg-gray-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(request.id);
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="py-4 text-center text-gray-500">
              Không có lời mời kết bạn nào
            </p>
          )}
        </div>
      </div>
      {selectedFriend !== null && (
        <div className="flex-1">
          <FriendProfile
            friendId={selectedFriend}
            onClose={() => setSelectedFriend(null)}
          />
        </div>
      )}
    </>
  );
};

export default FriendRequests;
