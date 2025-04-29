import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { NavLink } from "react-router-dom";
import { Conversation } from "../../types";

function MessagesSidebarItem({
  className,
  conservation,
  ...props
}: React.ComponentProps<"div"> & { conservation: Conversation }) {
  return (
    <>
      <div {...props}>
        <NavLink
          to={`/messages/${conservation.id}`}
          className={({ isActive }) =>
            cn(
              "flex items-center space-x-2 rounded-lg p-2 pr-3 hover:bg-gray-100",
              isActive ? "bg-gray-100" : "",
              className,
            )
          }
        >
          <Avatar className="h-14 w-14 border">
            <AvatarImage />
            <AvatarFallback>
              {/* {conservation.name.slice(0, 2).toUpperCase()} */}
            </AvatarFallback>
          </Avatar>

          <div className="hidden w-full sm:block">
            <div className="flex items-center justify-between">
              <div>{conservation.name}</div>
              <div className={cn("text-sm font-normal")}></div>
            </div>
          </div>
        </NavLink>
      </div>
    </>
  );
}

export default MessagesSidebarItem;
