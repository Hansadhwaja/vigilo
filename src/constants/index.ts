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

//Patrolling
export const samplePatrols = [
    {
        id: "PAT-001",
        patrolId: "P-2024-001",
        guardName: "A. Khan",
        guardId: "g1",
        vehicleId: "V-11",
        vehicle: "Alpha-1",
        status: "Active",
        clientId: "c1",
        clientName: "Harbour Group",
        startTime: "2024-12-22 06:00",
        estimatedCompletion: "2024-12-22 10:00",
        actualStartTime: "2024-12-22 06:00",
        actualEndTime: null,
        currentLocation: "Metro Bank Tower - Main Entrance",
        routeDeviation: false,
        sites: [
            {
                id: "site-a",
                name: "Metro Bank Tower",
                clientId: "c1",
                subsites: [
                    {
                        id: "subsite-a1",
                        name: "Main Building",
                        unitPrice: 150,
                        estimatedDuration: 60,
                        description: "Primary building patrol area",
                        checkpoints: [
                            {
                                id: "cp-001",
                                name: "Main Entrance",
                                coordinates: { lat: -37.8136, lng: 144.9631 },
                                range: 20,
                                qrCode: "QR-MBT-ME-001",
                                status: "completed",
                                arrivalTime: "2024-12-22 06:15",
                                departureTime: "2024-12-22 06:20",
                                scannedAt: "2024-12-22 06:17",
                                issues: [],
                                priority: "high",
                                description: "Main entrance security checkpoint"
                            },
                            {
                                id: "cp-002",
                                name: "Parking Garage Level B1",
                                coordinates: { lat: -37.8138, lng: 144.9633 },
                                range: 25,
                                qrCode: "QR-MBT-PG-002",
                                status: "pending",
                                arrivalTime: null,
                                departureTime: null,
                                scannedAt: null,
                                issues: [],
                                priority: "medium",
                                description: "Underground parking security point"
                            }
                        ]
                    }
                ]
            }
        ],
        totalCheckpoints: 2,
        completedCheckpoints: 1,
        issuesFound: 0,
        proofOfService: {
            qrScans: 1,
            photos: 2,
            notes: 0
        },
        billing: {
            hourlyRate: 50,
            estimatedHours: 4,
            actualHours: null,
            clientInvoiced: false
        }
    },
    {
        id: "PAT-002",
        patrolId: "P-2024-002",
        guardName: "S. Singh",
        guardId: "g2",
        vehicleId: "V-17",
        vehicle: "Bravo-2",
        status: "Scheduled",
        clientId: "c2",
        clientName: "City Retail",
        startTime: "2024-12-22 14:00",
        estimatedCompletion: "2024-12-22 18:00",
        actualStartTime: null,
        actualEndTime: null,
        currentLocation: null,
        routeDeviation: false,
        sites: [
            {
                id: "site-b",
                name: "CBD Mall Complex",
                clientId: "c2",
                subsites: [
                    {
                        id: "subsite-b1",
                        name: "Shopping Center",
                        unitPrice: 200,
                        estimatedDuration: 90,
                        description: "Main retail area with high foot traffic",
                        checkpoints: [
                            {
                                id: "cp-003",
                                name: "Food Court",
                                coordinates: { lat: -37.8150, lng: 144.9700 },
                                range: 30,
                                qrCode: "QR-CBD-FC-003",
                                status: "pending",
                                arrivalTime: null,
                                departureTime: null,
                                scannedAt: null,
                                issues: [],
                                priority: "medium",
                                description: "Food court security checkpoint"
                            },
                            {
                                id: "cp-004",
                                name: "Parking Structure",
                                coordinates: { lat: -37.8152, lng: 144.9702 },
                                range: 25,
                                qrCode: "QR-CBD-PS-004",
                                status: "pending",
                                arrivalTime: null,
                                departureTime: null,
                                scannedAt: null,
                                issues: [],
                                priority: "low",
                                description: "Parking area security point"
                            },
                            {
                                id: "cp-005",
                                name: "Loading Dock",
                                coordinates: { lat: -37.8148, lng: 144.9698 },
                                range: 20,
                                qrCode: "QR-CBD-LD-005",
                                status: "pending",
                                arrivalTime: null,
                                departureTime: null,
                                scannedAt: null,
                                issues: [],
                                priority: "high",
                                description: "Loading dock security checkpoint"
                            }
                        ]
                    }
                ]
            }
        ],
        totalCheckpoints: 3,
        completedCheckpoints: 0,
        issuesFound: 0,
        proofOfService: {
            qrScans: 0,
            photos: 0,
            notes: 0
        },
        billing: {
            hourlyRate: 45,
            estimatedHours: 4,
            actualHours: null,
            clientInvoiced: false
        }
    },
    {
        id: "PAT-003",
        patrolId: "P-2024-003",
        guardName: "M. Chen",
        guardId: "g3",
        vehicleId: "V-11",
        vehicle: "Alpha-1",
        status: "Completed",
        clientId: "c1",
        clientName: "Harbour Group",
        startTime: "2024-12-21 20:00",
        estimatedCompletion: "2024-12-22 04:00",
        actualStartTime: "2024-12-21 20:10",
        actualEndTime: "2024-12-22 04:05",
        currentLocation: null,
        routeDeviation: true,
        sites: [
            {
                id: "site-d",
                name: "Industrial Zone",
                clientId: "c1",
                subsites: [
                    {
                        id: "subsite-d1",
                        name: "Warehouse District",
                        unitPrice: 120,
                        estimatedDuration: 240,
                        description: "Industrial warehouse complex security",
                        checkpoints: [
                            {
                                id: "cp-006",
                                name: "Gate Control",
                                coordinates: { lat: -37.8200, lng: 144.9500 },
                                range: 15,
                                qrCode: "QR-IZ-GC-006",
                                status: "completed",
                                arrivalTime: "2024-12-21 20:30",
                                departureTime: "2024-12-21 20:35",
                                scannedAt: "2024-12-21 20:32",
                                issues: [],
                                priority: "high",
                                description: "Main gate security control point"
                            },
                            {
                                id: "cp-007",
                                name: "Perimeter Fence",
                                coordinates: { lat: -37.8205, lng: 144.9505 },
                                range: 25,
                                qrCode: "QR-IZ-PF-007",
                                status: "completed",
                                arrivalTime: "2024-12-21 22:15",
                                departureTime: "2024-12-21 22:20",
                                scannedAt: "2024-12-21 22:17",
                                issues: ["Damaged fence section - north side"],
                                priority: "medium",
                                description: "Perimeter fence security checkpoint"
                            }
                        ]
                    }
                ]
            }
        ],
        totalCheckpoints: 2,
        completedCheckpoints: 2,
        issuesFound: 1,
        proofOfService: {
            qrScans: 2,
            photos: 3,
            notes: 1
        },
        billing: {
            hourlyRate: 45,
            estimatedHours: 8,
            actualHours: 8.1,
            clientInvoiced: true
        }
    }
];

export const availableVehicles = [
    { id: "V-11", callsign: "Alpha-1", status: "Available" },
    { id: "V-17", callsign: "Bravo-2", status: "Available" },
    { id: "V-22", callsign: "Charlie-3", status: "Maintenance" },
    { id: "V-25", callsign: "Delta-4", status: "Available" }
];

export const dummyVehicles = [
    { id: crypto.randomUUID(), callsign: "V-Alpha" },
    { id: crypto.randomUUID(), callsign: "V-Bravo" },
    { id: crypto.randomUUID(), callsign: "V-Charlie" },
];

//Orders
export const orderStatus = [
    { label: "Ongoing", value: "ongoing" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Missed", value: "missed" },
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
];