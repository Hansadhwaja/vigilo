import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProctedRoute";
import { Toaster } from "sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import AuthPage from "./pages/Auth/AuthPage";
import MainLayout from "./components/Layout/MainLayout";

export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />

          <Route path="/*" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
          />
        </Routes>
        <Toaster
          position="top-right"
          richColors
        />
      </TooltipProvider>
    </BrowserRouter>
  );
}
