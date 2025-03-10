import { cn } from "@/lib/utils";

function MessagesMainContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <>
      <div className={cn("", className)}></div>
    </>
  );
}

export default MessagesMainContent;
