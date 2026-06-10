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
import { authFeatures } from "@/constants";
import { useMemo } from "react";

const RightSide = () => {
    const navigate = useNavigate();
    const year = useMemo(() => {
        return new Date().getFullYear();
    }, []);

    const [login, { isLoading }] = useLoginMutation();

    const handleLogin = async (values: LoginFormValues) => {
        try {
            const res = await login(values).unwrap();

            localStorage.setItem(
                "token",
                res.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(res.user)
            );

            toast.success(
                res.message ||
                "Login successful!"
            );

            navigate("/");
        } catch (error: any) {
            const message =
                error?.data?.error?.message ||
                error?.data?.message ||
                "Invalid email or password";

            toast.error(message);
        }
    };
    return (
        <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
            <div className="w-full max-w-xl">
                <Card className="overflow-hidden border border-white/20 bg-white/95 backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] p-0">
                    <CardHeader className="p-6">
                        <div className="text-center">

                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-lg ring-1 ring-slate-100">
                                <img
                                    src="/assets/logo/logo.png"
                                    alt="VIGILO"
                                    className="h-10 w-10 object-contain"
                                />
                            </div>

                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
                                Security Operations Platform
                            </p>

                            <CardTitle className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight  text-slate-900 " >
                                Welcome Back
                            </CardTitle>

                            <p className="mt-2 text-sm text-slate-500">
                                Sign in to access your dashboard
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6 space-y-4">
                        <LoginForm
                            onSubmit={handleLogin}
                            isLoading={isLoading}
                        />

                        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                            <div className="flex items-start gap-3">
                                <div
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100"
                                >
                                    <Shield className="h-4 w-4 text-blue-700" />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                        Secure Access
                                    </p>

                                    <p className="mt-1 text-sm leading-relaxed text-slate-500">
                                        Authorized personnel only.
                                        All login activities are
                                        encrypted, monitored, and
                                        audited for compliance.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-slate-400 text-center">
                            © {year} VIGILO Security Platform
                        </p>

                    </CardContent>
                </Card>

            </div>
        </div>
    )
}

export default RightSide