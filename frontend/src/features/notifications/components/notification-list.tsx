import { useState } from "react";
import { NotificationCard } from "./notification-card";
import { Notification } from "../types/notification";
import { NotificationService } from "../services/notificationServices";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

interface NotificationsListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDeleteNotification: (id: string) => void;
  onAcceptFriendRequest?: (id: string) => void;
  onDeclineFriendRequest?: (id: string) => void;
  isLoading: boolean;
}

export function NotificationsList({
  notifications,
  onMarkAsRead,
  onDeleteNotification,
  onAcceptFriendRequest,
  onDeclineFriendRequest,
  isLoading,
}: NotificationsListProps) {
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((notification) => !notification.isRead);

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      // This will be handled by the parent component to refresh notifications
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <Tabs defaultValue="all" className="w-[200px]">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setFilter("all")}>
              All
            </TabsTrigger>
            <TabsTrigger value="unread" onClick={() => setFilter("unread")}>
              Unread
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAllAsRead}
          disabled={!notifications.some((n) => !n.isRead)}
        >
          Mark all as read
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No {filter === "unread" ? "unread " : ""}notifications
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
              onDelete={onDeleteNotification}
              onAcceptFriendRequest={onAcceptFriendRequest}
              onDeclineFriendRequest={onDeclineFriendRequest}
            />
          ))}
        </div>
      )}
    </div>
  );
}
