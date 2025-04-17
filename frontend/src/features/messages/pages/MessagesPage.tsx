import { cn } from "@/lib/utils";
import MessagesMain from "../components/main/messages-main";

function MessagesPage({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <>
      <MessagesMain className={cn(className)} {...props} />
    </>
  );
}

export default MessagesPage;
