import { cn } from "@/lib/utils";
import MessagesMain from "./main/messages-main";
import MessagesSidebar from "./sidebar/messages-sidebar";
import { MessagesSidebarItemType } from "../types/messages-sidebar-item-type";
import { SidebarProvider } from "@/components/ui/sidebar";
import MessagesInfo from "./info/messages-info";
const conversations: MessagesSidebarItemType[] = [];
const numberOfItems = 20; // số lượng đối tượng bạn muốn tạo

for (let i = 0; i < numberOfItems; i++) {
  conversations.push({
    id: (i + 1).toString(), // id thay đổi theo index của vòng lặp
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits/",
    lastMessage: "Hello, how are you?",
    lastMessageTime: "10:00 AM",
    unreadMessages: 2,
  });
}

function MessagesContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <>
      <div className={cn("flex", className)} {...props}>
        <MessagesSidebar
          className="relative w-30 border-r sm:w-80"
          conversations={conversations}
        />

        <SidebarProvider
          className="min-h-full! flex-1"
          style={
            {
              "--sidebar-width": "24rem",
              "--sidebar-width-icon": "",
            } as React.CSSProperties
          }
        >
          <MessagesMain />
          <MessagesInfo className="mt-14" />
        </SidebarProvider>
      </div>
    </>
  );
}

export default MessagesContainer;
