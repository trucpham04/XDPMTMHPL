import MessageSidebar from "@/features/messages/components/message-sidebar";
import { Outlet } from "react-router-dom";
import MessageMain from "@/features/messages/components/message-main";

function MessageContainer() {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-full w-full flex-row">
        <MessageSidebar />
        <MessageMain>
          <Outlet />
        </MessageMain>
      </div>
    </div>
  );
}

export default MessageContainer;
