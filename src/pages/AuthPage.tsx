import React, { useState } from "react";
import { Shield} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useLoginMutation } from "../apis/authApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async () => {
  try {
    const res = await login({ email, password }).unwrap();
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));

    toast.success(res.message || "Login successful!");
    navigate("/dashboard");
  } catch (error: any) {
    toast.error(error?.data?.message || "Login failed!");
  }
};

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
          <p className="text-sm text-gray-600">Admin Login Portal</p>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vigilo.com"
                required
                className="mt-1 border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative mt-1">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-4 pr-10 border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-400"
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                </div>
              </div>
            </div>

            {/* Login Button */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-b from-gray-800 to-gray-900 text-white font-semibold py-2 rounded-lg transition-all duration-200 mt-4"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
