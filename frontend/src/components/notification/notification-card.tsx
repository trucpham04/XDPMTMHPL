import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Notification, NotificationType } from "../../types/Notification";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onAcceptFriendRequest?: (id: string) => void;
  onDeclineFriendRequest?: (id: string) => void;
}

export function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
  onAcceptFriendRequest,
  onDeclineFriendRequest,
}: NotificationCardProps) {
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "like":
        return <ThumbsUp className="h-4 w-4 text-pink-500" />;
      case "comment":
        return <MessageCircle className="h-4 w-4 text-green-500" />;
      case "friend_request":
        return <UserPlus className="h-4 w-4 text-violet-500" />;
      default:
        return null;
    }
  };

  return (
    <Card
      className={cn(
        "relative mb-2 cursor-pointer p-4 transition-colors hover:bg-gray-50",
        !notification.isRead && "border-l-4 border-blue-500 bg-blue-50/50",
      )}
      onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={notification.sender.avatar}
            alt={notification.sender.name}
          />
          <AvatarFallback>
            {notification.sender.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            {getNotificationIcon(notification.type)}
            <span className="text-sm font-medium">
              {notification.sender.name}
            </span>
            {!notification.isRead && (
              <Badge variant="default" className="bg-blue-500 px-1.5 text-xs">
                New
              </Badge>
            )}
          </div>

          <p className="text-sm text-gray-700">{notification.content}</p>

          <div className="mt-1 text-xs text-gray-500">
            {formatDistanceToNow(new Date(notification.timestamp), {
              addSuffix: true,
            })}
          </div>

          {notification.type === "friend_request" && (
            <div className="mt-2 flex gap-2">
              <Button
                size="sm"
                className="flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onAcceptFriendRequest?.(notification.id);
                }}
              >
                <Check className="h-3.5 w-3.5" /> Accept
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeclineFriendRequest?.(notification.id);
                }}
              >
                <X className="h-3.5 w-3.5" /> Decline
              </Button>
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
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
            {notification.isRead ? (
              <DropdownMenuItem onClick={() => onMarkAsRead(notification.id)}>
                Mark as unread
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onMarkAsRead(notification.id)}>
                Mark as read
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onDelete(notification.id)}
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
