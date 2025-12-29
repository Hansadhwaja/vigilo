import React from "react";
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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

function SideItem({ icon, label, active, onClick, open }: SideItemProps) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "w-full flex items-center gap-3 px-3 py-2 text-lg font-bold transition-all duration-200",
        active ? "bg-white/15" : "hover:bg-white/10"
      )}
    >
      <span
        className={classNames(
          "h-5 w-5 transition-all duration-200 filter",
          "drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]",
          "transform hover:scale-110 hover:-translate-y-0.5",
          active && "drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] scale-105"
        )}
      >
        {icon}
      </span>
      {open && <span className="font-bold">{label}</span>}
    </button>
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
        "h-full transition-all duration-300 border-r border-gray-200 bg-gradient-to-b from-gray-800 via-gray-600 to-gray-900 text-white flex flex-col",
        isOpen ? "w-72" : "w-20"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b border-white/10">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 grid place-items-center shadow-lg">
          <Shield className="h-6 w-6" />
        </div>
        {isOpen && (
          <div>
            <div className="text-lg font-semibold tracking-wide">VIGILO</div>
            <div className="text-sm text-white/70">Workforce & Monitoring</div>
          </div>
        )}
        <div className="ml-auto">
          <Button size="icon" variant="ghost" className="text-white" onClick={onToggle}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* System Status */}
      {isOpen && (
        <Card className="m-3 bg-white/5 border-white/10 text-white">
          <CardHeader className="p-4 pb-0">
            <div className="flex items-center gap-2 text-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
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
      <nav className="flex-1 overflow-y-auto py-2 bg-[rgba(88,80,80,0)]">
        <SideItem
          icon={<img src={DashboardIcon} className="h-5 w-5"/> }
          label="Dashboard"
          active={activeTab === "dashboard"}
          onClick={() => onTabChange("dashboard")}
          open={isOpen}
        />
        <SideItem
          icon={<img src={SchedulingIcon} className="h-5 w-5"/>}
          label="Scheduling"
          active={activeTab === "scheduling"}
          onClick={() => onTabChange("scheduling")}
          open={isOpen}
        />
        {/* <SideItem
          icon={<Calendar />}
          label="Shifts"
          active={activeTab === "shifts"}
          onClick={() => onTabChange("shifts")}
          open={isOpen}
        /> */}
        <SideItem
          icon={<img src={ClientIcon} className="h-5 w-5"/>}
          label="Clients Management"
          active={activeTab === "clients"}
          onClick={() => onTabChange("clients")}
          open={isOpen}
        />
        <SideItem
          icon={<img src={IncidentIcon} className="h-5 w-5"/>}
          label="Incidents"
          active={activeTab === "incidents"}
          onClick={() => onTabChange("incidents")}
          open={isOpen}
        />
        <SideItem
          icon={<img src={AlarmIcon} className="h-5 w-5"/>}
          label="Alarms"
          active={activeTab === "alarms"}
          onClick={() => onTabChange("alarms")}
          open={isOpen}
        />
        <SideItem
          icon={<img src={MapIcon} className="h-5 w-5"/>}
          label="Map"
          active={activeTab === "map"}
          onClick={() => onTabChange("map")}
          open={isOpen}
        />
        <SideItem
          icon={<img src={MessageIcon} className="h-5 w-5"/>}
          label="Messages"
          active={activeTab === "messages"}
          onClick={() => onTabChange("messages")}
          open={isOpen}
        />
        <SideItem
          icon={<img src={PatrolingIcon} className="h-5 w-5"/>}
          label="Patrolling"
          active={activeTab === "patrol"}
          onClick={() => onTabChange("patrol")}
          open={isOpen}
        />
        <SideItem
          icon={<img src={HRIcon} className="h-5 w-5"/>}
          label="HR & Compliance"
          active={activeTab === "hr"}
          onClick={() => onTabChange("hr")}
          open={isOpen}
        />
        <SideItem
          icon={<img src={InvoicingIcon} className="h-5 w-5"/>}
          label="Invoicing"
          active={activeTab === "invoicing"}
          onClick={() => onTabChange("invoicing")}
          open={isOpen}
        />
        <SideItem
          icon={<img src={SettingsIcon} className="h-5 w-5"/>}
          label="Settings & Vehicles"
          active={activeTab === "settings"}
          onClick={() => onTabChange("settings")}
          open={isOpen}
        />
      </nav>

      {/* Footer with Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-lg font-semibold bg-red-600 hover:bg-red-700 transition-all duration-200"
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
