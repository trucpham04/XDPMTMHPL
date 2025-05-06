import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { Link } from "react-router-dom";

// Define extended props interface to include WebSocket properties
interface MessagesMainHeaderProps extends React.ComponentProps<"div"> {
  isConnected?: boolean;
  conversationId?: string | number;
}

function MessagesMainHeader({
  className,
  isConnected,
  conversationId,
  ...props
}: MessagesMainHeaderProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <>
      <div
        className={cn("flex items-center justify-between p-4", className)}
        {...props}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage />
            <AvatarFallback>TP</AvatarFallback>
          </Avatar>

          <div className="flex items-center gap-2">
            <Link to={"/messages"}>Name</Link>

            {/* Display connection status if conversationId exists */}
            {conversationId && (
              <div
                className={`rounded-full px-2 py-0.5 text-xs ${isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {isConnected ? "Connected" : "Disconnected"}
              </div>
            )}
          </div>
        </div>

        {/* <Button
          className="cursor-pointer rounded-full"
          variant={"secondary"}
          onClick={toggleSidebar}
          size={"icon"}
        >
          <Info className="size-5!" />
        </Button> */}
      </div>
    </>
  );
}

export default MessagesMainHeader;
