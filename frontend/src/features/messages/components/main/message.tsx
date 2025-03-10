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
          "w-full px-4",
          isCurrentUser ? "flex justify-end" : "",
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "bg-accent w-fit max-w-2/5 rounded-t-3xl px-3 py-2",
            isCurrentUser
              ? "rounded-br-xs rounded-bl-3xl"
              : "rounded-br-3xl rounded-bl-xs",
          )}
        >
          {" "}
          {message.content}
        </div>
      </div>
    </>
  );
}

export default Message;
