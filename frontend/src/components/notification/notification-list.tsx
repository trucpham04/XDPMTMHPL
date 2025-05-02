import { NotificationCard } from "./notification-card";
import { Notification } from "../../types/Notification";
import { Loader2 } from "lucide-react";

interface NotificationsListProps {
  notifications: Notification[];
  onDeleteNotification: (id: string) => void;
  onAcceptFriendRequest?: (id: string) => void;
  onDeclineFriendRequest?: (id: string) => void;
  isLoading: boolean;
}

export function NotificationsList({
  notifications,
  onDeleteNotification,
  isLoading,
}: NotificationsListProps) {
  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-8 text-center text-gray-500">No notifications</div>
      ) : (
        <>
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onDelete={onDeleteNotification}
            />
          ))}
        </>
      )}
    </div>
  );
}
