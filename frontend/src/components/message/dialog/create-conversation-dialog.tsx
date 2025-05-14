import { useState, useEffect } from "react";
import { useFriends } from "@/hooks/useFriends";
import { User } from "@/types/User";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuthContext } from "@/contexts/AuthContext";

interface CreateConversationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateConversation: (name: string, selectedFriends: User[]) => void;
}

export function CreateConversationDialog({
  isOpen,
  onClose,
  onCreateConversation,
}: CreateConversationDialogProps) {
  const [friends, setFriends] = useState<User[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<User[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<User[]>([]);
  const [conversationName, setConversationName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { getFriends, loading } = useFriends();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchFriends = async () => {
      if (user?.id) {
        const friendsList = await getFriends(user.id);
        setFriends(friendsList);
        setFilteredFriends(friendsList);
      }
    };
    fetchFriends();
  }, [user?.id]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFriends(friends);
    } else {
      const filtered = friends.filter(
        (friend) =>
          friend.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          friend.lastName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredFriends(filtered);
    }
  }, [searchQuery, friends]);

  const handleFriendSelect = (friend: User) => {
    setSelectedFriends((prev) => {
      const isSelected = prev.some((f) => f.id === friend.id);
      if (isSelected) {
        return prev.filter((f) => f.id !== friend.id);
      } else {
        return [...prev, friend];
      }
    });
  };

  const handleCreate = () => {
    if (selectedFriends.length > 0) {
      onCreateConversation(conversationName, selectedFriends);
      setConversationName("");
      setSelectedFriends([]);
      setSearchQuery("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tạo cuộc trò chuyện mới</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              placeholder="Tên cuộc trò chuyện"
              value={conversationName}
              onChange={(e) => setConversationName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm bạn bè..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="max-h-[200px] overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-4">Đang tải...</div>
              ) : filteredFriends.length === 0 ? (
                <div className="text-muted-foreground py-4 text-center">
                  Không tìm thấy bạn bè
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFriends.map((friend) => (
                    <div
                      key={friend.id}
                      className="hover:bg-accent flex items-center space-x-2 rounded-lg p-2"
                    >
                      <Checkbox
                        id={`friend-${friend.id}`}
                        checked={selectedFriends.some(
                          (f) => f.id === friend.id,
                        )}
                        onCheckedChange={() => handleFriendSelect(friend)}
                      />
                      <label
                        htmlFor={`friend-${friend.id}`}
                        className="flex flex-1 cursor-pointer items-center space-x-2"
                      >
                        <div className="bg-muted h-8 w-8 rounded-full">
                          {friend.profilePictureUrl ? (
                            <img
                              src={friend.profilePictureUrl}
                              alt={`${friend.firstName} ${friend.lastName}`}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm font-medium">
                              {friend.firstName[0]}
                              {friend.lastName[0]}
                            </div>
                          )}
                        </div>
                        <span>
                          {friend.firstName} {friend.lastName}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            onClick={handleCreate}
            disabled={selectedFriends.length === 0}
          >
            Tạo cuộc trò chuyện
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
