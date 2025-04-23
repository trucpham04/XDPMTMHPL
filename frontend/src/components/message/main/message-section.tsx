import { cn } from "@/lib/utils";
import Message from "./message";
import { ChatMessage } from "../../types";

// Remove WebSocket-related props and just accept messages directly
interface MessagesSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  messages: ChatMessage[];
  currentUserId?: number;
}

function getMessageClassName(
  message: ChatMessage,
  prevMessage: ChatMessage,
  nextMessage: ChatMessage,
  currentUserId: number,
) {
  // Existing getMessageClassName function remains the same
  const isCurrentUser = message.senderId === currentUserId;
  const isFirstOfGroup =
    !prevMessage || prevMessage.senderId !== message.senderId;
  const isLastOfGroup =
    !nextMessage || nextMessage.senderId !== message.senderId;

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
  currentUserId = 1,
  ...props
}: MessagesSectionProps) {
  // No WebSocket or state management here, just render messages passed as props
  return (
    <div className={cn("flex w-full flex-col gap-1 p-4", className)} {...props}>
      {/* Messages list */}
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
            key={message.id || `${message.senderId}-${index}`} // Use unique id if available
            message={message}
            isCurrentUser={message.senderId === currentUserId}
            className={messageClassName}
          />
        );
      })}
    </div>
  );
}

export default MessagesSection;
