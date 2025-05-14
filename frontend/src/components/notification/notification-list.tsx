import React from "react";
import { Notification } from "@/types/Notification";
import { Loader2 } from "lucide-react";
import { NotificationCard } from "./notification-card";

interface NotificationsListProps {
  notifications: Notification[];
  onDeleteNotification: (id: number) => void;
  onMarkAsRead: (id: number) => void;
  isLoading: boolean;
}

export const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  onDeleteNotification,
  onMarkAsRead,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        Chưa có thông báo
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onDelete={() => onDeleteNotification(notification.id)}
          onMarkAsRead={() => onMarkAsRead(notification.id)}
        />
      ))}
    </div>
  );
};
