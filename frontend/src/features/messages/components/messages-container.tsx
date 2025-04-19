"use client";

import { cn } from "@/lib/utils";
import MessagesMain from "./main/messages-main";
import MessagesSidebar from "./sidebar/messages-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import MessagesInfo from "./info/messages-info";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useMessage } from "../hooks/use-message";

function MessagesContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { id } = useParams<{ id: string }>();
  const { getUserConversations, conversations } = useMessage();

  const currentUserId = 1; // Replace with actual user ID from context or props

  useEffect(() => {
    getUserConversations(currentUserId);
    console.log(conversations);
  }, [getUserConversations, currentUserId]);

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
          <MessagesMain currentUserId={1} conversationId={id} />
          <MessagesInfo className="mt-14" />
        </SidebarProvider>
      </div>
    </>
  );
}

export default MessagesContainer;
