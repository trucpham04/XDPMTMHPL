export interface Friend {
  id: number;
  user1Id: number;
  user2Id: number;
  friendshipDate: string;
}

export interface FriendRequest {
  id: number;
  senderId: number;
  receiverId: number;
  time: string;
}
