import { useState, FormEvent } from "react";
import { cn } from "@/lib/utils";

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
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
      >
        Send
      </button>
    </form>
  );
}

export default MessageInput;
