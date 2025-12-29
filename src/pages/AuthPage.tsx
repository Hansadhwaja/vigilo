import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useLoginMutation } from "../apis/authApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await login({
        email: email.trim(),
        password: password.trim(),
      }).unwrap();

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      toast.success(res.message || "Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      console.log("Login response:", error);

      const errorMessage =
        error?.data?.error?.message ||
        error?.data?.message ||
        "Invalid email or password";

      toast.error(errorMessage);
    }
  };

  const isButtonDisabled =
    !email || !password || !isEmailValid || isLoading;

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-b from-gray-800 via-gray-600 to-gray-900 p-4 overflow-hidden">
      <Card className="w-full max-w-md bg-white text-gray-900 shadow-2xl p-8">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 grid place-items-center shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-semibold tracking-wide">
              VIGILO ADMIN
            </CardTitle>
          </div>
          <p className="text-xl text-gray-600">Admin Login Portal</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="text-xl font-medium text-gray-700"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="mt-1 border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-400"
              />
              {email && !isEmailValid && (
                <p className="text-sm text-red-500 mt-1">
                  Please enter a valid email address
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="text-xl font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="pl-4 pr-10 border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-400"
                />
                <div
                  className={`absolute inset-y-0 right-3 flex items-center ${
                    password
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  onClick={() =>
                    password && setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isButtonDisabled}
              className="w-full bg-gradient-to-b from-gray-800 to-gray-900 text-white font-semibold py-2 rounded-lg transition-all duration-200 mt-4"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
