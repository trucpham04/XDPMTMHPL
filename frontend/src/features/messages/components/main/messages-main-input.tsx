import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

function MessagesMainInput({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <>
      <div className="flex h-15 gap-3 p-3">
        <Input />
        <Button className="w-16">
          <Send className="size-5!" />
        </Button>
      </div>
    </>
  );
}

export default MessagesMainInput;
