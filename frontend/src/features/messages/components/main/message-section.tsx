import { cn } from "@/lib/utils";
import { MessagesMainItemType } from "../../types/messages-sidebar-item-type";
import Message from "./message";

interface MessagesSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  messages: MessagesMainItemType[];
  currentUserId?: number;
}

function getMessageClassName(
  message: MessagesMainItemType,
  prevMessage: MessagesMainItemType,
  nextMessage: MessagesMainItemType,
  currentUserId: number,
) {
  const isCurrentUser = message.sender_id === currentUserId;
  const isFirstOfGroup =
    !prevMessage || prevMessage.sender_id !== message.sender_id;
  const isLastOfGroup =
    !nextMessage || nextMessage.sender_id !== message.sender_id;

  return cn(
    isFirstOfGroup && isLastOfGroup
      ? "my-2" // Single message
      : isFirstOfGroup
        ? "mt-2" // First in group
        : isLastOfGroup
          ? "mb-2" // Last in group
          : "",

    isFirstOfGroup && isCurrentUser && "rounded-br-sm",
    isFirstOfGroup && !isCurrentUser && "rounded-bl-sm",

    isLastOfGroup && isCurrentUser && "rounded-tr-sm",
    isLastOfGroup && !isCurrentUser && "rounded-tl-sm",

    !isFirstOfGroup && !isLastOfGroup && isCurrentUser && "rounded-r-sm",
    !isFirstOfGroup && !isLastOfGroup && !isCurrentUser && "rounded-l-sm",

    isFirstOfGroup && isLastOfGroup && "rounded-3xl",
  );
}

function MessagesSection({
  messages,
  className,
  currentUserId = 1, // Default to 1 but allow override
  ...props
}: MessagesSectionProps) {
  return (
    <div className={cn("flex w-full flex-col gap-1 p-4", className)} {...props}>
      {messages.map((message, index) => {
        const prevMessage = messages[index - 1];
        const nextMessage = messages[index + 1];
        const messageClassName = getMessageClassName(
          message,
          prevMessage,
          nextMessage,
          currentUserId,
        );

        return (
          <Message
            key={message.sender_id || `${message.sender_id}-${index}`} // Use unique id if available
            message={message}
            isCurrentUser={message.sender_id === currentUserId}
            className={messageClassName}
          />
        );
      })}
    </div>
  );
}

export default MessagesSection;
