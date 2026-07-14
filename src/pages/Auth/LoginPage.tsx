import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { useLoginMutation } from "@/store/apis/authApi";

import { LoginForm } from "@/components/Auth/Form/LoginForm";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { LoginFormValues } from "@/schemas/auth/auth.schemas";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const year = useMemo(() => new Date().getFullYear(), []);

  const handleLogin = async (values: LoginFormValues) => {
    try {
      const response = await login(values).unwrap();

      dispatch(
        setCredentials({
          token: response.token,
          user: response.user,
        }),
      );

      toast.success(response.message || "Login successful!");

      navigate("/", { replace: true });
    } catch (error: any) {
      const message =
        error?.data?.error?.message ||
        error?.data?.message ||
        "Invalid email or password";

      toast.error(message);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        <Card className="border-border bg-card text-card-foreground shadow-lg">
          <CardHeader className="space-y-5 text-center">
            {/* Mobile Branding */}
            <div className="space-y-5 lg:hidden">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-border bg-background shadow-sm">
                <img
                  src="/assets/logo/logo.png"
                  alt="VIGILO"
                  className="size-9 object-contain"
                />
              </div>

              <div className="flex items-center justify-center gap-2 text-foreground">
                <ShieldCheck className="size-4" />

                <span className="text-xs font-semibold uppercase tracking-widest">
                  Vigilo Security
                </span>
              </div>
            </div>

            {/* Page Heading */}
            <div className="space-y-2">
              <CardTitle className="text-2xl text-foreground">
                Welcome back
              </CardTitle>

              <CardDescription className="text-muted-foreground">
                Enter your credentials to access your dashboard
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>

              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  New to Vigilo?
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          © {year} VIGILO Security Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
