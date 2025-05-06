import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { NavLink } from "react-router-dom";
import { Conversation } from "@/types/Message";

function MessagesSidebarItem({
  className,
  conversation,
  ...props
}: React.ComponentProps<"div"> & { conversation: Conversation }) {
  return (
    <>
      <div {...props}>
        <NavLink
          to={`/messages/${conversation.id}`}
          className={({ isActive }) =>
            cn(
              "flex items-center space-x-2 rounded-lg p-2 pr-3 hover:bg-gray-100",
              isActive ? "bg-gray-100" : "",
              className,
            )
          }
        >
          <Avatar className="h-14 w-14 border">
            <AvatarImage src={conversation.otherUser.profilePictureUrl} />
            <AvatarFallback>
              {conversation.otherUser.firstName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="hidden w-full sm:block">
            <div className="flex flex-col justify-center">
              <div className="">
                {conversation.otherUser.firstName}{" "}
                {conversation.otherUser.lastName}
              </div>
              {conversation.lastMessage && (
                <div
                  className={cn("text-muted-foreground text-sm font-normal")}
                >
                  {conversation.lastMessage.content}
                </div>
              )}
            </div>
          </div>
        </NavLink>
      </div>
    </>
  );
}

export default MessagesSidebarItem;
