import { User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "@/types/User";
import { cn } from "@/lib/utils";

export default function UserAvatar({
  user,
  className,
}: {
  user: User | null;
  className?: string;
}) {
  return (
    <>
      <Avatar className={cn("h-10 w-10 border-2 border-white", className)}>
        <AvatarImage src={user?.profilePictureUrl || undefined} />
        <AvatarFallback>
          <UserIcon className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>
    </>
  );
}
