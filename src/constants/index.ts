import { Bell, Building2, Euro, LayoutDashboard, Map, MessageSquareText, Radar, Settings, Timer, TriangleAlert, User } from "lucide-react";

export const navLinks = [
    {
        icon: LayoutDashboard,
        label: "Dashboard",
        link: "/"
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

//Scheduling
export const upcomingReminders = [
    {
        id: "REM-001",
        type: "Shift Start",
        message: "Night shift starting in 30 minutes",
        time: new Date().toISOString(),
        assignee: "Lisa Rodriguez",
    },
    {
        id: "REM-002",
        type: "Patrol Assignment",
        message: "Vehicle patrol assignment due",
        time: new Date(Date.now() + 3600000).toISOString(),
        assignee: "Mike Chen",
    },
];

export const TIMEZONE = "Asia/Kolkata";

export const timeSlots = [
    { time: "06:00", label: "6 am" },
    { time: "08:00", label: "8 am" },
    { time: "10:00", label: "10 am" },
    { time: "12:00", label: "12 pm" },
    { time: "14:00", label: "2 pm" },
    { time: "16:00", label: "4 pm" },
    { time: "18:00", label: "6 pm" },
    { time: "20:00", label: "8 pm" },
    { time: "22:00", label: "10 pm" },
    { time: "00:00", label: "12 am" },
    { time: "02:00", label: "2 am" },
    { time: "04:00", label: "4 am" },
];

//Invoicing
export const services = [
    { label: "Static", value: "static" },
    { label: "Patrol", value: "patrol" },
    { label: "Premium Security", value: "premiumSecurity" },
    { label: "Standard Patrol", value: "standardPatrol" },
    { label: "24/7 Monitoring", value: "24/7Monitoring" },
    { label: "Healthcare Security", value: "healthcareSecurity" },
    { label: "Industrial Security", value: "industrialSecurity" },
];