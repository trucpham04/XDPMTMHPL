<<<<<<< Updated upstream
import { createRoot } from "react-dom/client";
import React from "react";
=======
// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import React from "react";
// import ReactDOM from "react-dom/client";
>>>>>>> Stashed changes
import "@/styles/index.css";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { NotificationWebSocketProvider } from "./contexts/NotificationWebSocketContext.tsx";

import { Provider } from "react-redux";
import { store } from "../src/features/messages/store/store.ts";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
<<<<<<< Updated upstream
    <AuthProvider>
      <NotificationWebSocketProvider>
        <App />
      </NotificationWebSocketProvider>
    </AuthProvider>
  </React.StrictMode>,
=======
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
>>>>>>> Stashed changes
);
