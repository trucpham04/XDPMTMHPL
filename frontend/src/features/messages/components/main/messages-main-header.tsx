import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Info } from "lucide-react";
import { Link } from "react-router-dom";
function MessagesMainHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { toggleSidebar } = useSidebar();
  return (
    <>
      <div className="z-10 flex h-14 w-full items-center justify-between px-4 shadow-md">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage />
            <AvatarFallback>TP</AvatarFallback>
          </Avatar>

          <div>
            <Link to={"/messages"}>Name</Link>
          </div>
        </div>
        <Button
          className="cursor-pointer rounded-full"
          variant={"secondary"}
          onClick={toggleSidebar}
          size={"icon"}
        >
          <Info className="size-5!" />
        </Button>
      </div>
    </>
  );
}

export default MessagesMainHeader;
