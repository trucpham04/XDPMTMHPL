import MessagesMain from "@/components/message/main/messages-main";
import { useAuthContext } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

function MessagesPage({ className, ...props }: React.ComponentProps<"div">) {
  const { user } = useAuthContext();

  if (!user) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground text-lg">
          Vui lòng đăng nhập để xem tin nhắn
        </p>
      </div>
    );
  }

  return (
    <>
      <MessagesMain
        className={cn(className)}
        currentUserId={user.id}
        {...props}
      />
    </>
  );
}

export default MessagesPage;
