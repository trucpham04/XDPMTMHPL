import AppNavBar from "@/components/app/app-navbar";
import MessageContainer from "@/features/messages/components/messages-container";

export default function Layout() {
  return (
    <>
      <AppNavBar />
      <div className="mt-14 flex h-fit justify-center">
        <div className="w-full">
          <MessageContainer className="max-h-[calc(100vh-56px)] min-h-[calc(100vh-56px)]" />
        </div>
      </div>
    </>
  );
}
