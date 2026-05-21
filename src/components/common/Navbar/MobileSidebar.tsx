import {
    Shield,
    Menu,
    LogOut,
} from "lucide-react";

import {
    useState,
} from "react";

import {
    Link,
    NavLink,
    useNavigate,
} from "react-router-dom";

import { toast } from "sonner";

import { navLinks } from "@/constants";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const MobileSidebar = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        try {
            localStorage.removeItem("user");
            localStorage.removeItem("token");

            toast.success(
                "You have been logged out successfully"
            );

            navigate("/auth", { replace: true });
        } catch (error) {
            toast.error(
                "Logout failed. Please try again."
            );
        }
    };

    return (
        <Sheet
            open={open}
            onOpenChange={setOpen}
        >
            {/* Trigger */}
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                >
                    <Menu className="size-5" />
                </Button>
            </SheetTrigger>

            {/* Panel */}
            <SheetContent
                side="left"
                className="flex flex-col bg-slate-50 p-4"
            >
                {/* Header */}
                <SheetHeader>
                    <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                        <div
                            onClick={() => navigate("/", { replace: true })}
                            className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-xl  shadow-sm transition-all hover:scale-[1.03]"
                        >
                            <img src={"/assets/logo/logo.png"} alt="logo" />
                        </div>


                        <div className="min-w-0">
                            <h2 className="truncate text-lg font-bold tracking-tight text-slate-900">
                                VIGILO
                            </h2>
                            <p className="text-xs text-slate-500">
                                Workforce & Monitoring
                            </p>
                        </div>

                    </div>
                </SheetHeader>

                {/* Nav */}
                <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
                    {navLinks.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.link}
                            className={({ isActive }) =>
                                cn(
                                    "group flex items-center rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200 gap-3",

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
                                                "flex items-center gap-3"
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


                                            <span className="truncate">
                                                {item.label}
                                            </span>

                                        </div>
                                    </TooltipTrigger>


                                    <TooltipContent side="right">
                                        {item.label}
                                    </TooltipContent>

                                </Tooltip>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <Separator className="bg-slate-200" />

                {/* Footer */}
                <SheetFooter className="space-y-2">
                    <Button
                        onClick={handleLogout}
                        variant="destructive"
                        className={cn(
                            "h-11 rounded-2xl font-medium transition-all text-red-500 hover:bg-red-100 hover:text-red-600 w-full justify-center gap-3 px-4"
                        )}
                    >
                        <LogOut />

                        Logout
                    </Button>

                    <div className="px-1 text-center text-xs text-slate-400">
                        © {new Date().getFullYear()} Vigilo
                    </div>

                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default MobileSidebar;