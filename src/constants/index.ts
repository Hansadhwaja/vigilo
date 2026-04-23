import { Bell, Building2, Euro, LayoutDashboard, Map, MessageSquareText, Radar, Settings, Timer, TriangleAlert, User } from "lucide-react";

export const navLinks = [
    {
        icon: LayoutDashboard,
        label: "Dashboard",
        link: "/dashboard"
    },
    {
        icon: Timer,
        label: "Scheduling",
        link: "/scheduling"
    },
    {
        icon: Building2,
        label: "Client Management",
        link: "/clients"
    },
    {
        icon: TriangleAlert,
        label: "Incidents",
        link: "/incidents"
    },
    {
        icon: Bell,
        label: "Alarms",
        link: "/alarms"
    },
    {
        icon: Map,
        label: "Map",
        link: "/map"
    },
    {
        icon: MessageSquareText,
        label: "Messages",
        link: "/messages"
    },
    {
        icon: Radar,
        label: "Patrolling",
        link: "/patrol"
    },
    {
        icon: User,
        label: "HR & Compliance",
        link: "/hr"
    },
    {
        icon: Euro,
        label: "Invoicing",
        link: "/invoicing"
    },
    {
        icon: Settings,
        label: "Settings",
        link: "/settings"
    },
];

//Messages
export const avatarColors = [
    "from-violet-500 to-purple-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-red-500",
    "from-blue-500 to-indigo-600",
    "from-pink-500 to-rose-600",
    "from-amber-500 to-yellow-600",
];

export const EMOJI_SET = [
    "😀", "😁", "😂", "😅", "😊", "😍", "😘", "😎",
    "🤝", "👏", "👍", "🙏", "🔥", "🎉", "✅", "💬",
    "📌", "📷", "📎", "🛡️",
];