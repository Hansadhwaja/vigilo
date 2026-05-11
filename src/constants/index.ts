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

//Compliances
export const complianceItems = [
    {
        id: "1",
        guardId: "G001",
        guardName: "John Doe",
        type: "Background Check",
        description: "Annual background verification",
        dueDate: "2024-09-15",
        priority: "High",
        status: "Completed",
    },
    {
        id: "2",
        guardId: "G002",
        guardName: "Jane Smith",
        type: "First Aid Training",
        description: "Bi-annual first aid certification",
        dueDate: "2024-10-01",
        priority: "Medium",
        status: "Scheduled",
    },
];

//Guard Payment
export const payments = [
    {
        src: "",
        name: "Rahul Sharma",
        post: "Senior Security Guard",
        id: "PAY-2026-001",
        period: "Apr 1 – 15, 2026",
        hours: 80,
        ot: 4,
        hourlyPrice: 45,
        otPrice: 67,
        status: "approved",
    },
    {
        src: "",
        name: "Amit Verma",
        post: "Night Shift Guard",
        id: "PAY-2026-002",
        period: "Apr 1 – 15, 2026",
        hours: 72,
        ot: 6,
        hourlyPrice: 40,
        otPrice: 60,
        status: "pending",
    },
    {
        src: "",
        name: "Priya Singh",
        post: "Reception Security Officer",
        id: "PAY-2026-003",
        period: "Apr 1 – 15, 2026",
        hours: 84,
        ot: 2,
        hourlyPrice: 42,
        otPrice: 63,
        status: "approved",
    },
    {
        src: "",
        name: "Sanjay Patel",
        post: "Warehouse Security Guard",
        id: "PAY-2026-004",
        period: "Apr 1 – 15, 2026",
        hours: 90,
        ot: 8,
        hourlyPrice: 38,
        otPrice: 57,
        status: "processing",
    },
    {
        src: "",
        name: "Neha Das",
        post: "Female Security Officer",
        id: "PAY-2026-005",
        period: "Apr 1 – 15, 2026",
        hours: 76,
        ot: 5,
        hourlyPrice: 44,
        otPrice: 66,
        status: "approved",
    },
    {
        src: "",
        name: "Vikram Reddy",
        post: "Event Security Guard",
        id: "PAY-2026-006",
        period: "Apr 1 – 15, 2026",
        hours: 68,
        ot: 10,
        hourlyPrice: 41,
        otPrice: 61,
        status: "pending",
    },
    {
        src: "",
        name: "Anjali Mehta",
        post: "Control Room Operator",
        id: "PAY-2026-007",
        period: "Apr 1 – 15, 2026",
        hours: 88,
        ot: 3,
        hourlyPrice: 46,
        otPrice: 69,
        status: "approved",
    },
    {
        src: "",
        name: "Rohit Nayak",
        post: "Patrolling Guard",
        id: "PAY-2026-008",
        period: "Apr 1 – 15, 2026",
        hours: 74,
        ot: 7,
        hourlyPrice: 39,
        otPrice: 58,
        status: "processing",
    },
];