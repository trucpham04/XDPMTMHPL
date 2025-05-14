import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Conversation } from "@/types/Message";
import { Info, Users } from "lucide-react";

interface MessagesMainHeaderProps extends React.ComponentProps<"div"> {
  isConnected?: boolean;
  conversation?: Conversation;
}

function MessagesMainHeader({
  className,
  isConnected,
  conversation,
  ...props
}: MessagesMainHeaderProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <>
      <div
        className={cn("flex items-center justify-between p-4", className)}
        {...props}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            {conversation?.groupChat ? (
              <Users className="text-muted-foreground size-8" />
            ) : (
              <>
                <AvatarImage
                  src={conversation?.otherUser?.profilePictureUrl || undefined}
                />
                <AvatarFallback>
                  {conversation?.otherUser.firstName[0]}
                  {conversation?.otherUser.lastName[0]}
                </AvatarFallback>
              </>
            )}
          </Avatar>

          <div className="flex items-center gap-2">
            {conversation?.groupChat ? (
              <div className="text-sm font-medium">{conversation?.name}</div>
            ) : (
              <div className="text-sm font-medium">
                {conversation?.otherUser.firstName}{" "}
                {conversation?.otherUser.lastName}
              </div>
            )}

            {conversation && (
              <div
                className={`rounded-full px-2 py-0.5 text-xs ${isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {isConnected ? "Connected" : "Disconnected"}
              </div>
            )}
          </div>
        </div>

        <Button
          className="cursor-pointer rounded-full"
          variant={"secondary"}
          onClick={toggleSidebar}
          size={"icon"}
        >
          <Info className="size-5!" />
        </Button>
      </div>
    </>
  );
}

export default MessagesMainHeader;
