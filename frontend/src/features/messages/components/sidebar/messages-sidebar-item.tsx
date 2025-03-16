import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { MessagesSidebarItemType } from "../../types/messages-sidebar-item-type";
import { NavLink } from "react-router-dom";

function MessagesSidebarItem({
  className,
  conservation,
  ...props
}: React.ComponentProps<"div"> & { conservation: MessagesSidebarItemType }) {
  const isUnread = conservation.unreadMessages > 0 ? true : false;

  return (
    <>
      <div
        className={cn("", isUnread ? "font-semibold" : "", className)}
        {...props}
      >
        <NavLink
          to={`/messages/${conservation.id}`}
          className={({ isActive }) =>
            cn(
              "flex items-center space-x-2 rounded-lg p-2 pr-3 hover:bg-gray-100",
              isActive ? "bg-gray-100" : "",
            )
          }
        >
          <Avatar className="h-14 w-14 border">
            <AvatarImage src={conservation.avatar} />
            <AvatarFallback>
              {conservation.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="hidden w-full sm:block">
            <div className="flex items-center justify-between">
              <div>{conservation.name}</div>
              <div
                className={cn(
                  "text-sm font-normal",
                  isUnread ? "" : "text-gray-500",
                )}
              >
                {conservation.lastMessageTime}
              </div>
            </div>
            <div className="text-sm">{conservation.lastMessage}</div>
          </div>
        </NavLink>
      </div>
    </>
  );
}

export default MessagesSidebarItem;
