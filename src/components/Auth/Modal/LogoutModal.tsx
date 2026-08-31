import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import { useAppDispatch } from "@/store/hooks";
import { clearCredentials } from "@/store/slices/authSlice";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { baseApi } from "@/store/apis/baseApi";

interface LogoutModalProps {
  children: ReactNode;
}

const LogoutModal = ({ children }: LogoutModalProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearCredentials());
    dispatch(baseApi.util.resetApiState());
    toast.success("Logout Successful");
    navigate("/login", { replace: true });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <LogOut className="h-5 w-5 text-red-600" />
          </div>

          <AlertDialogTitle>Log out of your account?</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to log out? You will need to sign in again to
            access your dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700"
          >
            Log out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutModal;
