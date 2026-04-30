import { InvoiceType } from "@/types";
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

//Invoice
export const dummyInvoices: InvoiceType[] = [
    {
        id: "INV-001",
        client: "Acme Corp",
        services: ["Web Development", "UI Design"],
        period: "Mar 2026",
        amount: 25000,
        status: "Paid",
        dueDate: "2026-03-31",
    },
    {
        id: "INV-002",
        client: "TechNova Solutions",
        services: ["Mobile App Development"],
        period: "Apr 2026",
        amount: 40000,
        status: "Pending",
        dueDate: "2026-04-30",
    },
    {
        id: "INV-003",
        client: "GreenLeaf Pvt Ltd",
        services: ["SEO Optimization", "Content Writing"],
        period: "Feb 2026",
        amount: 15000,
        status: "Overdue",
        dueDate: "2026-02-28",
    },
    {
        id: "INV-004",
        client: "ByteBridge",
        services: ["Backend Development"],
        period: "Apr 2026",
        amount: 32000,
        status: "Pending",
        dueDate: "2026-05-05",
    },
    {
        id: "INV-005",
        client: "PixelCraft Studio",
        services: ["Branding", "Graphic Design"],
        period: "Jan 2026",
        amount: 18000,
        status: "Paid",
        dueDate: "2026-01-31",
    },
];