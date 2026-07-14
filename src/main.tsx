import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "./components/ui/sonner.tsx";
import { router } from "./routes/router.tsx";
import { store } from "./store/store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <TooltipProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </TooltipProvider>
    </Provider>
  </React.StrictMode>,
);
