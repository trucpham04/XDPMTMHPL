import { useCallback, useState } from "react";
import { User } from "@/types/User";
import friendService from "../services/friendService";

export const useFriend = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<User[]>([]);
  const [sentRequests, setSentRequests] = useState<User[]>([]);

  // Lấy danh sách bạn bè
  const getAllFriends = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await friendService.getAllFriends();
      setFriends(res);
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to fetch friends");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy danh sách lời mời kết bạn nhận được
  const getAllFriendRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await friendService.getAllFriendRequests();
      setFriendRequests(res);
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to fetch friend requests");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy danh sách lời mời đã gửi
  const getAllRequestsSent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await friendService.getAllRequestsSent();
      setSentRequests(res);
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to fetch sent requests");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Gửi lời mời kết bạn
  const sendFriendRequest = useCallback(async (receiverId: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await friendService.sendFriendRequest(receiverId);
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to send friend request");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Chấp nhận lời mời kết bạn
  const acceptFriendRequest = useCallback(async (senderId: number) => {
    setLoading(true);
    setError(null);
    try {
      await friendService.acceptFriendRequest(senderId);
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to accept friend request");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Hủy lời mời kết bạn
  const removeFriendRequest = useCallback(async (senderId: number) => {
    setLoading(true);
    setError(null);
    try {
      await friendService.removeFriendRequest(senderId);
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to remove friend request");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Xoá bạn
  const removeFriend = useCallback(async (user2Id: number) => {
    setLoading(true);
    setError(null);
    try {
      await friendService.removeFriend(user2Id);
      setFriends((prev) => prev.filter((f) => f.id !== user2Id));
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to remove friend");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    friends,
    friendRequests,
    sentRequests,
    getAllFriends,
    getAllFriendRequests,
    getAllRequestsSent,
    sendFriendRequest,
    acceptFriendRequest,
    removeFriendRequest,
    removeFriend,
  };
};

export default useFriend;
