import { useCallback, useState } from "react";
import { User } from "@/types/User";
import { friendService } from "@/services/friendService";

export function useFriend() {
  const [friends, setFriends] = useState<User[]>([]);
  const [requests, setRequests] = useState<User[]>([]);
  const [sentRequests, setSentRequests] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFriends = useCallback(async () => {
    setLoading(true);
    try {
      const data = await friendService.getAllFriends();
      setFriends(data);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách bạn bè.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await friendService.getFriendRequests();
      setRequests(data);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách lời mời kết bạn.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSentRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await friendService.getSentRequests();
      setSentRequests(data);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách lời mời đã gửi.");
    } finally {
      setLoading(false);
    }
  }, []);

  const acceptRequest = useCallback(
    async (id: number) => {
      await friendService.acceptRequest(id);
      fetchRequests();
    },
    [fetchRequests],
  );

  const deleteRequest = useCallback(
    async (id: number) => {
      await friendService.deleteRequest(id);
      fetchRequests();
    },
    [fetchRequests],
  );

  const cancelRequest = useCallback(
    async (id: number) => {
      await friendService.cancelRequest(id);
      fetchSentRequests();
    },
    [fetchSentRequests],
  );

  const removeFriend = useCallback(
    async (id: number) => {
      await friendService.removeFriend(id);
      fetchFriends();
    },
    [fetchFriends],
  );

  return {
    friends,
    requests,
    sentRequests,
    loading,
    error,
    fetchFriends,
    fetchRequests,
    fetchSentRequests,
    acceptRequest,
    deleteRequest,
    cancelRequest,
    removeFriend,
  };
}

export default useFriend;
