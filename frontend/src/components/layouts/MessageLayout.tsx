import { SidebarProvider } from "@/components/ui/sidebar";
import AppNavBar from "@/components/app/app-navbar";
import MessageContainer from "@/features/messages/components/message-container";

export default function Layout() {
  return (
    <>
      <AppNavBar />
      <div className="mt-14">
        <SidebarProvider
          className="min-h-[calc(100vh-56px)]!"
          style={
            {
              "--sidebar-width": "20rem",
              "--sidebar-width-mobile": "20rem",
            } as React.CSSProperties
          }
        >
          <MessageContainer />
        </SidebarProvider>
      </div>
    </>
  );
}
