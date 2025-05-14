import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { UserRound, Bell, Users } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Conversation } from "@/types/Message";
import { useEffect, useState } from "react";
import useMessage from "@/hooks/useMessage";
import { User } from "@/types/User";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface MessagesInfoProps extends React.ComponentProps<"div"> {
  conversation?: Conversation;
}

function MessagesInfo({ className, conversation }: MessagesInfoProps) {
  const [groupMembers, setGroupMembers] = useState<User[]>([]);
  const { getGroupMembers } = useMessage();

  useEffect(() => {
    const loadGroupMembers = async () => {
      if (conversation?.groupChat && conversation?.id) {
        const members = await getGroupMembers(conversation.id);
        setGroupMembers(members);
      }
    };

    loadGroupMembers();
  }, [conversation, getGroupMembers]);

  const getAvatarFallback = () => {
    if (!conversation) return "";
    if (conversation.groupChat) {
      return conversation.name.substring(0, 2).toUpperCase();
    }
    const firstName = conversation.otherUser?.firstName || "";
    const lastName = conversation.otherUser?.lastName || "";
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  const getDisplayName = () => {
    if (!conversation) return "";
    if (conversation.groupChat) {
      return conversation.name;
    }
    const firstName = conversation.otherUser?.firstName || "";
    const lastName = conversation.otherUser?.lastName || "";
    return `${firstName} ${lastName}`;
  };

  return (
    <>
      <Sidebar side="right" className={cn(className)}>
        <SidebarContent>
          <div className="mt-14 flex flex-col items-center justify-center gap-4">
            <Avatar className="bg-muted flex h-30 w-30 items-center justify-center">
              {conversation?.groupChat ? (
                <Users className="size-8" />
              ) : (
                <>
                  <AvatarImage
                    src={
                      conversation?.groupChat
                        ? undefined
                        : conversation?.otherUser?.profilePictureUrl ||
                          undefined
                    }
                  />
                  <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                </>
              )}
            </Avatar>

            <div>
              <div className="text-2xl font-semibold">{getDisplayName()}</div>

              <div className="my-3 flex justify-center gap-6">
                <Tooltip delayDuration={700}>
                  <TooltipTrigger className="flex flex-col items-center justify-center gap-1">
                    {conversation?.groupChat ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <Users className="size-5" />
                      </Button>
                    ) : (
                      <Link
                        to={`/profile/${conversation?.otherUser?.id}`}
                        className="rounded-full"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                        >
                          <UserRound className="size-5" />
                        </Button>
                      </Link>
                    )}
                    <div className="text-xs">Hồ sơ</div>
                  </TooltipTrigger>
                  <TooltipContent>Hồ sơ</TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={700}>
                  <TooltipTrigger className="flex flex-col items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Bell className="size-5" />
                    </Button>
                    <div className="text-xs">Tắt thông báo</div>
                  </TooltipTrigger>
                  <TooltipContent>Tắt thông báo</TooltipContent>
                </Tooltip>
              </div>
            </div>

            {conversation?.groupChat && (
              <div className="w-full px-4">
                <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm font-medium">
                  <Users className="size-4" />
                  <span>Thành viên ({groupMembers.length})</span>
                </div>
                <div className="flex flex-col gap-2">
                  {groupMembers.map((member) => (
                    <Link
                      to={`/profile/${member.id}`}
                      key={member.id}
                      className="hover:bg-accent flex items-center gap-2 rounded-lg p-2"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={member.profilePictureUrl || undefined}
                        />
                        <AvatarFallback>
                          {member.firstName.charAt(0) +
                            member.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {member.firstName} {member.lastName}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {member.username}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SidebarContent>
      </Sidebar>
    </>
  );
}

export default MessagesInfo;
