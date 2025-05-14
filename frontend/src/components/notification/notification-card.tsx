import React from "react";
import { Notification, NotificationType } from "@/types/Notification";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, ThumbsUp, UserPlus, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import UserAvatar from "../app/userAvatar";

interface NotificationCardProps {
  notification: Notification;
  onDelete: () => void;
  onMarkAsRead: () => void;
}

// Icon mapping for easier scalability
const NOTIFICATION_ICONS: Record<NotificationType, React.ReactNode> = {
  NEW_MESSAGE: <MessageSquare className="size-5 text-blue-500" />,
  POST_LIKE: <ThumbsUp className="size-5 text-pink-500" />,
  POST_COMMENT: <MessageSquare className="size-5 text-green-500" />,
  FRIEND_REQUEST: <UserPlus className="size-5 text-violet-500" />,
  FRIEND_REQUEST_ACCEPTED: <Check className="size-5 text-green-500" />,
};

const NotificationActions = ({
  type,
  notificationId,
  onAccept,
  onDecline,
}: {
  type: NotificationType;
  notificationId: number;
  onAccept?: (id: number) => void;
  onDecline?: (id: number) => void;
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
  onMarkAsRead,
}: NotificationCardProps) {
  const { id, type, message, createdAt, isRead, sender } = notification;

  return (
    <Card
      className={cn(
        "relative mb-2 rounded-lg p-4 shadow-sm transition-colors hover:bg-gray-50",
        !isRead && "bg-blue-50",
      )}
      onClick={onMarkAsRead}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <UserAvatar className="size-14" user={sender || null} />

        {/* Notification Content */}
        <div className="flex-1">
          <div className="flex items-center gap-1">
            {/* Notification Icon */}
            {NOTIFICATION_ICONS[type]}
            <span className="font-medium">
              {sender?.firstName} {sender?.lastName}
            </span>

            {/* Message */}
            <div className="text-gray-700">{message}</div>
          </div>

          {/* Actions */}
          <NotificationActions type={type} notificationId={id} />

          {/* Timestamp */}
          <div className="mt-1 text-xs text-gray-500">
            {formatDistanceToNow(new Date(createdAt), {
              addSuffix: true,
              includeSeconds: true,
            })}
          </div>
        </div>

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
