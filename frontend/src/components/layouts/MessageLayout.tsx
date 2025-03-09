import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import MessageSidebar from "@/features/messages/components/message-sidebar";
import AppNavBar from "@/components/app/app-navbar";
import { Outlet } from "react-router-dom";
import MessageMain from "@/features/messages/components/message-main";

export default function Layout() {
  return (
    <>
      <AppNavBar />
      <div className="mt-14 h-[calc(100vh-56px)]">
        <SidebarProvider
          className="min-h-[calc(100vh-56px)]!"
          style={
            {
              "--sidebar-width": "20rem",
              "--sidebar-width-mobile": "20rem",
            } as React.CSSProperties
          }
        >
          <MessageSidebar />
          <SidebarInset>
            {/* <MessageHeader /> */}
            <MessageMain>
              <Outlet />
            </MessageMain>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </>
  );
}
