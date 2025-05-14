import { cn } from "@/lib/utils";
import Message from "./message";
import { ChatMessage } from "@/types/Message";
import { useEffect, useRef } from "react";

interface MessagesSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  messages: ChatMessage[];
  currentUserId: number;
}

function getMessageClassName(
  message: ChatMessage,
  prevMessage: ChatMessage,
  nextMessage: ChatMessage,
  currentUserId: number,
) {
  const isCurrentUser = message.senderId === currentUserId;
  const isFirstOfGroup =
    !prevMessage || prevMessage.senderId !== message.senderId;
  const isLastOfGroup =
    !nextMessage || nextMessage.senderId !== message.senderId;

  return cn(
    isFirstOfGroup && isLastOfGroup
      ? "my-2"
      : isFirstOfGroup
        ? "mt-2"
        : isLastOfGroup
          ? "mb-2"
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
  currentUserId,
  ...props
}: MessagesSectionProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!currentUserId) return null;

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
          <div key={message.id || `${message.senderId}-${index}`}>
            {(!prevMessage || prevMessage.senderId !== message.senderId) && (
              <div
                className={cn(
                  "mb-1 text-sm text-gray-500",
                  message.senderId === currentUserId
                    ? "text-right"
                    : "text-left",
                )}
              >
                {message.senderFullName}
              </div>
            )}
            <Message
              message={message}
              isCurrentUser={message.senderId === currentUserId}
              className={messageClassName}
            />
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessagesSection;
