export type MessagesSidebarItemType = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadMessages: number;
};

export type MessagesMainItemType = {
  sender_id: number;
  content: string;
  time: string;
};
