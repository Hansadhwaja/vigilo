import { Shield, LogOut } from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

import { navLinks } from "@/constants";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      toast.success("You have been logged out successfully");

      navigate("/auth", { replace: true });
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <aside
      className={cn(
        "max-lg:hidden flex h-full shrink-0 flex-col border-r border-slate-200 bg-slate-50 transition-all duration-300",
        isOpen ? "w-72 px-4 py-5" : "w-22 px-3 py-5"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <div
          onClick={() => navigate("/", { replace: true })}
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-sky-600 shadow-sm transition-all hover:scale-[1.03]"
        >
          <Shield className="h-5 w-5 text-white" />
        </div>

        {isOpen && (
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold tracking-tight text-slate-900">
              VIGILO
            </h2>
            <p className="text-xs text-slate-500">
              Workforce & Monitoring
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex-1 space-y-1 overflow-y-auto no-scrollbar">
        {navLinks.map((item) => (
          <NavLink
            key={item.label}
            to={item.link}
            className={({ isActive }) =>
              cn(
                "group flex items-center rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200",

                isOpen ? "gap-3" : "justify-center",

                isActive
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
              )
            }
          >
            {({ isActive }) => (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "flex items-center",
                      isOpen ? "gap-3" : "justify-center"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-xl transition-all",

                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 group-hover:bg-white"
                      )}
                    >
                      <item.icon size={18} />
                    </div>

                    {isOpen && (
                      <span className="truncate">
                        {item.label}
                      </span>
                    )}
                  </div>
                </TooltipTrigger>

                {!isOpen && (
                  <TooltipContent side="right">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            )}
          </NavLink>
        ))}
      </nav>

      <Separator className="my-4 bg-slate-200" />

      {/* Footer */}
      <div className="space-y-3">
        <Button
          onClick={handleLogout}
          variant="destructive"
          className={cn(
            "h-11 rounded-2xl font-medium transition-all text-red-500 hover:bg-red-100 hover:text-red-600",

            isOpen
              ? "w-full justify-start gap-3 px-4"
              : "w-11 justify-center p-0"
          )}
        >
          <LogOut className="h-4 w-4" />

          {isOpen && <span>Logout</span>}
        </Button>

        {isOpen && (
          <div className="px-1 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Vigilo
          </div>
        )}
      </div>
    </aside>
  );
}