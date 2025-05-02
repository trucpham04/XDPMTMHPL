import AppNavBar from "@/components/app/app-navbar";
import MessagesContainer from "../message/messages-container";

export default function Layout() {
  return (
    <>
      <AppNavBar />
      <div className="mt-14 flex h-fit justify-center">
        <div className="w-full">
          <MessagesContainer className="max-h-[calc(100vh-56px)] min-h-[calc(100vh-56px)]" />
        </div>
      </div>
    </>
  );
}
