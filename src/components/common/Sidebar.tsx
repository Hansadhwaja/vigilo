import React, { useState } from "react";
import {
  Shield,
  Menu,
  X,
  Activity,
  Map,
  Calendar,
  Users,
  FileWarning,
  MessageSquare,
  Settings,
  Bell,
  Route,
  BadgeCheck,
  Building2,
  Users2,
  Receipt,
  LogOut
} from "lucide-react";

import DashboardIcon from "../../images/material-symbols_dashboard-rounded.svg";
import SchedulingIcon from "../../public/lets-icons_clock-fill.svg";
import ClientIcon from "../../public/mingcute_building-1-fill.svg";
import IncidentIcon from "../../public/fluent-mdl2_incident-triangle.svg";
import AlarmIcon from "../../public/mingcute_notification-fill.svg";
import MapIcon from "../../public/solar_map-bold.svg";
import MessageIcon from "../../public/tabler_message-filled.svg";
import PatrolingIcon from "../../public/mingcute_bulb-fill.svg";
import HRIcon from "../../public/duo-icons_user.svg";
import InvoicingIcon from "../../public/Frame.svg";
import SettingsIcon from "../../public/material-symbols_settings.svg";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { classNames } from "../../utils/helpers";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { navLinks } from "../../constants";
import { cn } from "../ui/utils";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  liveRevenue: number;
}

interface SideItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  open: boolean;
}

// Simple tooltip for collapsed icons
function Tooltip({ children, content, show }: { children: React.ReactNode; content: string; show: boolean }) {
  if (!show) return <>{children}</>;

  return (
    <div className="group/tooltip relative">
      {children}
      <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg 
                      opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible
                      transition-all duration-150 whitespace-nowrap z-50 shadow-xl
                      pointer-events-none">
        {content}
        <div className="absolute right-full top-1/2 -translate-y-1/2 
                        border-6 border-transparent border-r-gray-900" />
      </div>
    </div>
  );
}

// Image with fallback
function IconImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={classNames("bg-white/20 rounded flex items-center justify-center", className)}>
        <span className="text-xs font-bold">{alt.charAt(0)}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}

function SideItem({ icon, label, active, onClick, open }: SideItemProps) {
  return (
    <Tooltip content={label} show={!open}>
      <button
        onClick={onClick}
        className={classNames(
          "w-full flex items-center gap-3 px-3 py-2 text-lg font-bold transition-all duration-200 rounded-lg",
          active ? "bg-white/15" : "hover:bg-white/10",
          !open && "justify-center"
        )}
      >
        <span
          className={classNames(
            "h-6 w-6 transition-all duration-200 filter flex-shrink-0",
            "drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]",
            "transform hover:scale-110 hover:-translate-y-0.5",
            active && "drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] scale-105"
          )}
        >
          {icon}
        </span>
        {open && <span className="font-bold whitespace-nowrap">{label}</span>}
      </button>
    </Tooltip>
  );
}

export default function Sidebar({
  isOpen,
  onToggle,
  activeTab,
  onTabChange,
  liveRevenue,
}: SidebarProps) {
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
      className={classNames(
        "h-full transition-all duration-300 ease-in-out border-r border-blue-300/30 text-white flex flex-col bg-blue-900 ",
        isOpen ? "w-72" : "w-20"
      )}

    >
      {/* Header with Menu Button on Top */}
      <div className="flex items-center gap-3 p-3 border-b border-white/10">
        <Button
          size="icon"
          variant="ghost"
          className="text-white hover:bg-white/10 flex-shrink-0"
          onClick={onToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {isOpen && (
          <>
            <div
              onClick={() => navigate("/dashboard", { replace: true })}
              className="h-10 w-10 rounded-xl backdrop-blur-sm
                         grid place-items-center shadow-lg cursor-pointer 
                         hover:scale-105 transition-transform shrink-0"
              style={{ backgroundColor: "#2360FF" }}
            >
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-semibold tracking-wide">VIGILO</div>
              <div className="text-sm text-white/70">Workforce & Monitoring</div>
            </div>
          </>
        )}
      </div>

      {/* System Status */}
      {isOpen && (
        <Card className="m-3 bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <CardHeader className="p-4 pb-0">
            <div className="flex items-center gap-2 text-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <Activity className="h-4 w-4" />
              System Status
            </div>
            <CardTitle className="text-base">All systems operational</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-2">
            <Progress value={96} />
            <div className="text-sm text-white/70 flex justify-between">
              <span>Revenue: ${Math.round(liveRevenue / 1000)}k</span>
              <span>96% uptime</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      {/* <nav
        className="flex-1 overflow-y-auto py-2 px-2"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`
          nav::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <SideItem
          icon={<IconImage src={DashboardIcon} alt="Dashboard" className="h-6 w-6" />}
          label="Dashboard"
          active={activeTab === "dashboard"}
          onClick={() => onTabChange("dashboard")}
          open={isOpen}
        />
        <SideItem
          icon={<IconImage src={SchedulingIcon} alt="Scheduling" className="h-6 w-6" />}
          label="Scheduling"
          active={activeTab === "scheduling"}
          onClick={() => onTabChange("scheduling")}
          open={isOpen}
        />
        <SideItem
          icon={<IconImage src={ClientIcon} alt="Clients" className="h-6 w-6" />}
          label="Clients Management"
          active={activeTab === "clients"}
          onClick={() => onTabChange("clients")}
          open={isOpen}
        />
        <SideItem
          icon={<IconImage src={IncidentIcon} alt="Incidents" className="h-6 w-6" />}
          label="Incidents"
          active={activeTab === "incidents"}
          onClick={() => onTabChange("incidents")}
          open={isOpen}
        />
        <SideItem
          icon={<IconImage src={AlarmIcon} alt="Alarms" className="h-6 w-6" />}
          label="Alarms"
          active={activeTab === "alarms"}
          onClick={() => onTabChange("alarms")}
          open={isOpen}
        />
        <SideItem
          icon={<IconImage src={MapIcon} alt="Map" className="h-6 w-6 " />}
          label="Map"
          active={activeTab === "map"}
          onClick={() => onTabChange("map")}
          open={isOpen}
        />
        <SideItem
          icon={<IconImage src={MessageIcon} alt="Messages" className="h-6 w-6" />}
          label="Messages"
          active={activeTab === "messages"}
          onClick={() => onTabChange("messages")}
          open={isOpen}
        />
        <SideItem
          icon={<IconImage src={PatrolingIcon} alt="Patrolling" className="h-6 w-6" />}
          label="Patrolling"
          active={activeTab === "patrol"}
          onClick={() => onTabChange("patrol")}
          open={isOpen}
        />
        <SideItem
          icon={<IconImage src={HRIcon} alt="HR" className="h-6 w-6" />}
          label="HR & Compliance"
          active={activeTab === "hr"}
          onClick={() => onTabChange("hr")}
          open={isOpen}
        />
        <SideItem
          icon={<IconImage src={InvoicingIcon} alt="Invoicing" className="h-6 w-6" />}
          label="Invoicing"
          active={activeTab === "invoicing"}
          onClick={() => onTabChange("invoicing")}
          open={isOpen}
        />
        <SideItem
          icon={<IconImage src={SettingsIcon} alt="Settings" className="h-6 w-6" />}
          label="Settings"
          active={activeTab === "settings"}
          onClick={() => onTabChange("settings")}
          open={isOpen}
        />
      </nav> */}

      <nav className="p-2 space-y-1">
        {navLinks.map(item => (
          <NavLink to={item.link} key={item.label} className={({ isActive }) => cn(
            "flex gap-2 items-center px-3 py-2 hover:bg-white/15 rounded-md cursor-pointer",
            isActive && "bg-white/15"
          )}>
            <Tooltip>
              <ToolipTrigger>
   <item.icon size={20} />
              {isOpen && (<p>{item.label}</p>)}
              </ToolipTrigger>
              <TooltipContent>
                {item.label}
              </TooltipContent>
           
            </Tooltip>
          </NavLink>
        ))}
      </nav>

      {/* Footer with Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className={classNames(
            "w-full flex items-center gap-2 py-2 px-3 rounded-lg text-lg font-semibold hover:opacity-90 transition-all duration-200",
            !isOpen && "justify-center"
          )}
          style={{ backgroundColor: "#FC0000" }}
        >
          <LogOut className="h-4 w-4" />
          {isOpen && <span>Logout</span>}
        </button>
        {isOpen && (
          <div className="mt-3 text-sm text-white/70 text-center">
            © {new Date().getFullYear()} Vigilo
          </div>
        )}
      </div>
    </aside>
  );
}
