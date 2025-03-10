import { cn } from "@/lib/utils";
import { MessagesMainItemType } from "../../types/messages-sidebar-item-type";
import Message from "./message";

function MessagesMainContent({
  className,
  // messages,
  ...props
}: React.ComponentProps<"div">) {
  const messages: MessagesMainItemType[] = [];
  for (let i = 0; i < 20; i++) {
    messages.push({
      sender_id: i + 1,
      content: "Hello, how are you?",
      time: "10:00 AM",
    });
  }

  return (
    <>
      <div className={cn("flex flex-col gap-1", className)}>
        {messages.map((message) => (
          <Message
            key={message.sender_id}
            message={message}
            isCurrentUser={message.sender_id % 2 === 0}
            className=""
          />
        ))}
      </div>
    </>
  );
}

export default MessagesMainContent;
