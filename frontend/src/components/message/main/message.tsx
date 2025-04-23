import { cn } from "@/lib/utils";
import { MessagesMainItemType } from "../../types/messages-sidebar-item-type";

function Message({
  message,
  className,
  isCurrentUser,
  ...props
}: React.ComponentProps<"div"> & { message: MessagesMainItemType } & {
  isCurrentUser: boolean;
}) {
  return (
    <>
      <div
        className={cn(
          "flex w-full",
          isCurrentUser ? "justify-end" : "justify-start",
        )}
      >
        <div
          className={cn(
            "bg-accent w-fit max-w-3/5 rounded-3xl px-3 py-2",
            className,
          )}
          {...props}
        >
          {message.content}
        </div>
      </div>
    </>
  );
}

export default Message;
