import MessagesMain from "@/components/message/main/messages-main";
import { useAuthContext } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

function MessagesPage({ className, ...props }: React.ComponentProps<"div">) {
  const { user } = useAuthContext();
  return (
    <>
      <MessagesMain
        className={cn(className)}
        currentUserId={user?.id}
        {...props}
      />
    </>
  );
}

export default MessagesPage;
