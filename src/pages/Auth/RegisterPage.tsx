import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { useRegisterMutation } from "@/store/apis/authApi";

import RegisterForm from "@/components/Auth/Form/RegisterForm";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { RegisterFormValues } from "@/schemas/auth/auth.schemas";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const year = useMemo(() => new Date().getFullYear(), []);

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      const response = await register(values).unwrap();
      
      if (!response.success) {
        toast.error(response.error.message);
        return;
      }

      toast.success(response.message || "Account created successfully!");

      navigate("/login", { replace: true });
    } catch (error: any) {
      const message =
        error?.data?.error?.message ||
        error?.data?.message ||
        "Unable to create account";

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
                <ShieldCheck className="size-5" />

                <span className="text-sm font-semibold uppercase tracking-widest">
                  Vigilo Security
                </span>
              </div>
            </div>

            {/* Page Heading */}
            <div className="space-y-2">
              <CardTitle className="text-3xl text-foreground">
                Create Account
              </CardTitle>

              <CardDescription className="text-base text-muted-foreground">
                Register to start managing your security operations
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 lg:pt-6">
            <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>

              <div className="relative flex justify-center text-sm uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Already registered?
                </span>
              </div>
            </div>

            <p className="text-center text-base text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground lg:hidden">
          © {year} VIGILO Security Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
