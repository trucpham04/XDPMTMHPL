import { createRoot } from "react-dom/client";
import React from "react";
import "@/styles/index.css";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { NotificationWebSocketProvider } from "./contexts/NotificationWebSocketContext.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationWebSocketProvider>
        <App />
        <Toaster position="top-right" richColors />
      </NotificationWebSocketProvider>
    </AuthProvider>
  </React.StrictMode>,
);
