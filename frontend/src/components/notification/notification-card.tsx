import { formatDistanceToNow } from "date-fns";
import { Notification, NotificationType } from "../../types/Notification";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  ThumbsUp,
  MessageCircle,
  UserPlus,
  Check,
  X,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NotificationCardProps {
  notification: Notification;
  onDelete: (id: string) => void;
  onAcceptFriendRequest?: (id: string) => void;
  onDeclineFriendRequest?: (id: string) => void;
}

// Icon mapping for easier scalability
const NOTIFICATION_ICONS: Record<NotificationType, React.ReactNode> = {
  NEW_MESSAGE: <MessageSquare className="size-5 text-blue-500" />,
  POST_LIKE: <ThumbsUp className="size-5 text-pink-500" />,
  POST_COMMENT: <MessageCircle className="size-5 text-green-500" />,
  FRIEND_REQUEST: <UserPlus className="size-5 text-violet-500" />,
};

const NotificationActions = ({
  type,
  notificationId,
  onAccept,
  onDecline,
}: {
  type: NotificationType;
  notificationId: string;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}) => {
  if (type !== "FRIEND_REQUEST") return null;

  return (
    <div className="mt-2 flex gap-2">
      <Button
        size="sm"
        className="flex items-center gap-1"
        onClick={(e) => {
          e.stopPropagation();
          onAccept?.(notificationId);
        }}
      >
        <Check className="h-4 w-4" />
        Accept
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={(e) => {
          e.stopPropagation();
          onDecline?.(notificationId);
        }}
      >
        <X className="h-4 w-4" />
        Decline
      </Button>
    </div>
  );
};

export function NotificationCard({
  notification,
  onDelete,
  onAcceptFriendRequest,
  onDeclineFriendRequest,
}: NotificationCardProps) {
  const { id, sender, type, message, createdAt } = notification;

  return (
    <Card
      className={cn(
        "relative mb-2 rounded-lg p-4 shadow-sm transition-colors hover:bg-gray-50",
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Avatar className="size-12">
          <AvatarImage src={sender.profilePicture} alt={sender.firstName} />
          <AvatarFallback>
            {sender.firstName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Notification Content */}
        <div className="flex-1">
          <div className="flex items-center gap-1">
            {/* Notification Icon */}
            {NOTIFICATION_ICONS[type]}
            <span className="font-medium">
              {sender.firstName} {sender.lastName}
            </span>

            {/* Message */}
            <div className="text-gray-700">{message}</div>
          </div>

          {/* Actions */}
          <NotificationActions
            type={type}
            notificationId={id}
            onAccept={onAcceptFriendRequest}
            onDecline={onDeclineFriendRequest}
          />

          {/* Timestamp */}
          <div className="mt-1 text-xs text-gray-500">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </div>
        </div>

        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onDelete(id)}
              className="text-red-500"
            >
              Delete notification
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
