// NotificationWebSocketContext.tsx
import { createContext, useContext } from "react";
import { useNotificationWebSocket as useNotificationWebSocketHook } from "@/hooks/useNotificationWebSocket";
import type { ReactNode } from "react";

const NotificationWebSocketContext = createContext<
  ReturnType<typeof useNotificationWebSocketHook> | undefined
>(undefined);

interface NotificationWebSocketProviderProps {
  children: ReactNode;
}

export const NotificationWebSocketProvider = ({
  children,
}: NotificationWebSocketProviderProps) => {
  const notificationWebsocket = useNotificationWebSocketHook();

  return (
    <NotificationWebSocketContext.Provider value={notificationWebsocket}>
      {children}
    </NotificationWebSocketContext.Provider>
  );
};

export const useNotificationWebSocketContext = () => {
  const context = useContext(NotificationWebSocketContext);
  if (!context) {
    throw new Error(
      "useNotificationWebSocket must be used within an NotificationWebSocketProvider",
    );
  }
  return context;
};
