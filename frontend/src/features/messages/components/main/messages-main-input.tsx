import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

function MessagesMainInput({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <>
      <div className="flex h-15 gap-2 border-t p-3 px-6">
        <Input />
        <Button className="w-16">
          <Send className="size-5!" />
        </Button>
      </div>
    </>
  );
}

export default MessagesMainInput;
