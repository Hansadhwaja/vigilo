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
import { LoginForm, LoginFormValues } from "@/components/Auth/Form/LoginForm";

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
    <div className="h-screen w-screen flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background gradients */}
      <div className="auth-bg-base" />
      <div className="auth-bg-overlay" />

      {/* Animated blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

      {/* Geometric shapes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 border border-white rounded-full" />
        <div className="absolute bottom-20 right-20 w-48 h-48 border-2 border-white rotate-45" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 border border-white rounded-lg rotate-12" />
      </div>

      {/* Card */}
      <Card className="w-full max-w-md bg-white text-gray-900 shadow-2xl p-8 relative z-10">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center items-center gap-3">
            <div className="h-12 w-12 rounded-xl grid place-items-center bg-blue-600 shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-semibold tracking-wide">
              VIGILO ADMIN
            </CardTitle>
          </div>
          <p className="text-xl text-gray-600">Admin Login Portal</p>
        </CardHeader>

        <CardContent>
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;