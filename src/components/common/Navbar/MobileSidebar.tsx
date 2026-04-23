
import {
    Shield,
    Menu,
    Activity,
    LogOut
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { navLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

interface MobileSidebarProps {
    liveRevenue: number;
}

const MobileSidebar = ({
    liveRevenue,
}: MobileSidebarProps) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

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
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="cursor-pointer" onClick={() => setOpen(true)}>
                <Menu size={16} className="md:hidden" />
            </SheetTrigger>
            <SheetContent
                side="left"
                className={cn(
                    "md:hidden text-white bg-primary-100 p-2"
                )}>

                <SheetHeader>
                    <div className="flex gap-2 items-center">
                        <Link to="/" onClick={() => setOpen(false)} className="h-10 w-10 rounded-xl backdrop-blur-sm grid place-items-center shadow-lg cursor-pointer hover:scale-105 transition-transform shrink-0 bg-blue-500" >
                            <Shield className="h-6 w-6 text-white" />
                        </Link>
                        <div>
                            <div className="text-lg font-semibold">VIGILO</div>
                            <div className="text-xs text-white/70">Workforce & Monitoring</div>
                        </div>
                    </div>
                </SheetHeader>

                <Separator className="bg-white/15" />

                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                    <CardHeader>
                        <div className="flex items-center gap-2 text-xs">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <Activity className="h-4 w-4" />
                            System Status
                        </div>
                        <CardTitle className="text-sm">All systems operational</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Progress value={96} />
                        <div className="text-sm text-white/70 flex justify-between">
                            <span>Revenue: ${Math.round(liveRevenue / 1000)}k</span>
                            <span>96% uptime</span>
                        </div>
                    </CardContent>
                </Card>

                <nav className="space-y-1 overflow-y-auto no-scrollbar flex-1">
                    {navLinks.map(item => (
                        <NavLink
                            to={item.link}
                            key={item.label}
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                                    "hover:bg-white/15",
                                    isActive && "bg-white/15"
                                )
                            }
                        >
                            <Tooltip>
                                <TooltipTrigger className="flex gap-2 items-center cursor-pointer">
                                    <item.icon size={16} />
                                    <p>{item.label}</p>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    {item.label}
                                </TooltipContent>
                            </Tooltip>
                        </NavLink>
                    ))}
                </nav>

                <Separator className="bg-white/15" />

                <SheetFooter >
                    <Button
                        onClick={handleLogout}
                        className={cn(
                            "w-full flex items-center gap-2 hover:opacity-90 transition-all duration-200 bg-red-500 h-10 justify-center"
                        )}
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                    </Button>

                    <div className="mt-3 text-sm text-white/70 text-center">
                        © {new Date().getFullYear()} Vigilo
                    </div>

                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
export default MobileSidebar;