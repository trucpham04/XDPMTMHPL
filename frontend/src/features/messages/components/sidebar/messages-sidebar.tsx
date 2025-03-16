import { cn } from "@/lib/utils";

import MessageSidebarItem from "./messages-sidebar-item";
import MessageSidebarHeader from "./messages-sidebar-header";

import { MessagesSidebarItemType } from "../../types/messages-sidebar-item-type";

function MessagesSidebar({
  className,
  conversations,
  ...props
}: React.ComponentProps<"div"> & { conversations: MessagesSidebarItemType[] }) {
  return (
    <>
      <div className={cn("px-2", className)} {...props}>
        <MessageSidebarHeader className="" />
        <div className="flex max-h-[calc(100vh-56px-56px)] flex-col space-y-2 overflow-auto">
          {conversations.map((item) => (
            <MessageSidebarItem key={item.id} conservation={item} />
          ))}
        </div>
      </div>
    </>
  );
}

export default MessagesSidebar;
