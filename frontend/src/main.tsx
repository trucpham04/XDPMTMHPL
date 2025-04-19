// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import React from "react";
// import ReactDOM from "react-dom/client";
import "@/styles/index.css";
import App from "./App.tsx";
import { Toaster } from "./components/ui/sonner.tsx";

import { Provider } from "react-redux";
import { store } from "../src/features/messages/store/store.ts";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
