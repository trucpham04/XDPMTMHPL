import { useState, FormEvent } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";

interface MessageInputProps extends React.HTMLAttributes<HTMLFormElement> {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

function MessageInput({
  onSendMessage,
  disabled = false,
  className,
  ...props
}: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex items-center gap-2 border-t p-3", className)}
      {...props}
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        disabled={disabled}
        className="flex-1 rounded-md border p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
      />
      <Button
        type="submit"
        disabled={!message.trim() || disabled}
        className="rounded-md bg-blue-600 px-4 py-5 text-white hover:bg-blue-700 disabled:bg-blue-300"
      >
        <SendIcon className="h-4 w-4" />
        Send
      </Button>
    </form>
  );
}

export default MessageInput;
