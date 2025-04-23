import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { SquarePen } from "lucide-react";

function MessagesSidebarHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <>
      <div
        className={cn("flex h-14 items-center justify-between px-2", className)}
        {...props}
      >
        <div className="text-2xl font-semibold">Chats</div>
        <Button
          variant={"secondary"}
          className="hidden h-10 w-10 cursor-pointer rounded-full sm:block"
        >
          <SquarePen className="size-5!" />
        </Button>
      </div>
    </>
  );
}

export default MessagesSidebarHeader;
