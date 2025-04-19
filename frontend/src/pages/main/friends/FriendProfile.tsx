import React from "react";

interface FriendProfileProps {
    friendId: number;
    onClose: () => void;
  }
  const FriendProfile: React.FC<FriendProfileProps> = ({ friendId, onClose }) => {
    if (friendId === null) return null;
    return (
      <div className="m-8">
        <h2 className="text-2xl font-bold">Trang cá nhân</h2>
        <p>ID bạn bè: {friendId}</p>
        
      </div>
    );
  };
export default FriendProfile;

