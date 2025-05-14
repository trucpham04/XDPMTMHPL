import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import { CreateConversationDialog } from "../dialog/create-conversation-dialog";
import { User } from "@/types/User";
import { useMessage } from "@/hooks/useMessage";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";

function MessagesSidebarHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { createConversation, getUserConversations } = useMessage();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleCreateConversation = async (
    name: string,
    selectedFriends: User[],
  ) => {
    if (!user) return;

    const conversationData = {
      name: name || `${selectedFriends.map((f) => f.firstName).join(", ")}`,
      groupChat: selectedFriends.length > 1,
      participantIds: [user.id, ...selectedFriends.map((f) => f.id)],
    };

    const newConversation = await createConversation(conversationData);
    if (newConversation) {
      await getUserConversations(user.id);
      navigate(`/messages/${newConversation.id}`);
    }
  };

  return (
    <>
      <div
        className={cn("flex h-14 items-center justify-between px-2", className)}
        {...props}
      >
        <div className="text-2xl font-semibold">Tin nhắn</div>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 cursor-pointer rounded-full"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <SquarePen className="size-5" />
        </Button>
      </div>
      <CreateConversationDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateConversation={handleCreateConversation}
      />
    </>
  );
}

export default MessagesSidebarHeader;
