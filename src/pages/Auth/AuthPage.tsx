import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/apis/authApi";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Shield } from "lucide-react";
import {
  LoginForm,
  LoginFormValues,
} from "@/components/Auth/Form/LoginForm";
import { Button } from "@/components/ui/button";

const AuthPage = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (values: LoginFormValues) => {
    try {
      const res = await login(values).unwrap();

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      toast.success(res.message || "Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      const message =
        error?.data?.error?.message ||
        error?.data?.message ||
        "Invalid email or password";

      toast.error(message);
    }
  };

  return (
    <div className="w-full h-600">
      <div className="w-400 h-400 border bg-red-400">
        Hello
      </div>
    </div>
  );
}
export default AuthPage;