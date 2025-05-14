"use client";

import { cn } from "@/lib/utils";
import MessagesMain from "./main/messages-main";
import MessagesSidebar from "./sidebar/messages-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import MessagesInfo from "./info/messages-info";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import useMessage from "@/hooks/useMessage";
import { useAuthContext } from "@/contexts/AuthContext";

function MessagesContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { id } = useParams<{ id: string }>();
  const { getUserConversations, conversations } = useMessage();
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) return;
    getUserConversations();
  }, [getUserConversations, user]);

  if (!user) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground mt-10 text-lg">
          Vui lòng đăng nhập để xem tin nhắn
        </p>
      </div>
    );
  }

  const currentConversation = conversations.find(
    (conversation) => conversation.id === Number(id),
  );

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
          defaultOpen={false}
        >
          {id ? (
            <>
              <MessagesMain currentUserId={user.id} conversationId={id} />
              <MessagesInfo
                className="mt-14"
                conversation={currentConversation}
              />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-muted-foreground text-lg">
                Chọn một cuộc trò chuyện để bắt đầu
              </p>
            </div>
          )}
        </SidebarProvider>
      </div>
    </>
  );
}

export default MessagesContainer;
