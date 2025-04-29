import MessagesMain from "@/components/message/main/messages-main";
import { cn } from "@/lib/utils";

function MessagesPage({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <>
      <MessagesMain className={cn(className)} {...props} />
    </>
  );
}

export default MessagesPage;
