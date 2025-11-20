// Sample data for the VIGILO application

export const sampleGuards = [
  { id: "g1", name: "A. Khan", status: "On Duty", lat: -37.81, lng: 144.96, phone: "+61 400 111 111", licences: ["VIC Sec", "First Aid"], siteId: "s1" },
  { id: "g2", name: "S. Singh", status: "On Patrol", lat: -37.815, lng: 144.97, phone: "+61 400 222 222", licences: ["VIC Sec"], siteId: "s2" },
  { id: "g3", name: "M. Chen", status: "On Break", lat: -37.818, lng: 144.955, phone: "+61 400 333 333", licences: ["VIC Sec", "WWCC"], siteId: "s1" },
  { id: "g4", name: "J. Ali", status: "Off Duty", lat: -37.82, lng: 144.965, phone: "+61 400 444 444", licences: ["NSW Sec"], siteId: null },
];

export const availableGuards = [
  { id: "g1", name: "A. Khan", roles: ["Static", "Patrol"], licences: ["VIC Sec", "First Aid"] },
  { id: "g2", name: "S. Singh", roles: ["Static", "Patrol"], licences: ["VIC Sec"] },
  { id: "g3", name: "M. Chen", roles: ["Static"], licences: ["VIC Sec", "WWCC"] },
  { id: "g4", name: "J. Ali", roles: ["Patrol"], licences: ["NSW Sec"] },
  { id: "g5", name: "Lisa Rodriguez", roles: ["Static", "Patrol"], licences: ["VIC Sec", "First Aid"] },
  { id: "g6", name: "David Wilson", roles: ["Patrol"], licences: ["VIC Sec"] }
];

export const sampleSites = [
  { id: "s1", name: "Docklands Precinct", bounds: { x: 120, y: 60, w: 260, h: 140 } },
  { id: "s2", name: "CBD Mall", bounds: { x: 440, y: 90, w: 220, h: 120 } },
];

export const sampleIncidents = [
  { 
    id: "I-1001", 
    site: "Docklands Precinct", 
    location: {
      name: "Main Entrance - Level 1",
      coordinates: { lat: -37.8136, lng: 144.9631 }
    },
    type: "Trespass", 
    severity: "Medium", 
    status: "Pending", 
    time: "2024-09-22 10:24:00",
    dateTime: new Date("2024-09-22T10:24:00"),
    assigned: "A. Khan",
    assignedId: "g1",
    reportedBy: "Guard",
    reporterName: "A. Khan",
    photo: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=1000&auto=format&fit=crop",
    guardMessage: "Unauthorized individual attempting to access restricted areas. Individual has been escorted off premises. No resistance encountered. Area secured.",
    description: "Male approximately 30 years old, wearing dark clothing, attempted to access the building through the main entrance without proper identification.",
    actionsTaken: "Individual was approached and asked for identification. When unable to provide access credentials, was escorted off the premises. Security sweep conducted to ensure no unauthorized access.",
    clientNotified: true,
    priorityLevel: 2
  },
  { 
    id: "I-1002", 
    site: "CBD Mall", 
    location: {
      name: "Food Court Area - Level 2",
      coordinates: { lat: -37.8150, lng: 144.9700 }
    },
    type: "Medical Emergency", 
    severity: "High", 
    status: "Resolved", 
    time: "2024-09-22 09:10:00",
    dateTime: new Date("2024-09-22T09:10:00"),
    assigned: "S. Singh",
    assignedId: "g2",
    reportedBy: "Client",
    reporterName: "Mall Management",
    photo: "https://images.unsplash.com/photo-1584467735867-4d4f9e0c47cc?q=80&w=1000&auto=format&fit=crop",
    guardMessage: "Responded to medical emergency. Elderly female customer collapsed near food court. First aid administered immediately. Ambulance called and patient transported to hospital. Family contacted. Incident report completed.",
    description: "Customer collapsed in food court area. Initial assessment indicated possible cardiac event.",
    actionsTaken: "Immediate first aid provided, ambulance called, area secured, family contacted, incident documentation completed",
    clientNotified: true,
    priorityLevel: 1
  },
  { 
    id: "I-1003", 
    site: "Docklands Precinct", 
    location: {
      name: "Parking Garage B - Level -2",
      coordinates: { lat: -37.8140, lng: 144.9625 }
    },
    type: "Theft", 
    severity: "Low", 
    status: "Resolved", 
    time: "2024-09-21 16:45:00",
    dateTime: new Date("2024-09-21T16:45:00"),
    assigned: "M. Chen",
    assignedId: "g3",
    reportedBy: "Client",
    reporterName: "Building Security",
    photo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1000&auto=format&fit=crop",
    guardMessage: "Minor theft reported in parking garage. CCTV footage reviewed. Suspect identified and images provided to police. Victim statement taken. Case closed pending police action.",
    description: "Vehicle broken into, personal items stolen from passenger compartment. No significant damage to vehicle.",
    actionsTaken: "Scene secured, CCTV reviewed, police report filed, victim assisted with insurance claim process",
    clientNotified: true,
    priorityLevel: 3
  },
  { 
    id: "I-1004", 
    site: "CBD Mall", 
    location: {
      name: "Retail Store 47 - Level 1",
      coordinates: { lat: -37.8148, lng: 144.9695 }
    },
    type: "Alarm Activation", 
    severity: "Medium", 
    status: "Pending", 
    time: "2024-09-22 14:30:00",
    dateTime: new Date("2024-09-22T14:30:00"),
    assigned: "S. Singh",
    assignedId: "g2",
    reportedBy: "System",
    reporterName: "Automated Alarm System",
    photo: "https://images.unsplash.com/photo-1541975797233-d3cc4824e2e7?q=80&w=1000&auto=format&fit=crop",
    guardMessage: "Silent alarm activated at retail store. Conducting thorough inspection. No signs of forced entry. Store manager contacted. Checking with alarm company for system malfunction. Will update once investigation complete.",
    description: "Silent alarm triggered at retail store during business hours. Cause under investigation.",
    actionsTaken: "Immediate response to location, area inspection, alarm company contacted, store management notified",
    clientNotified: true,
    priorityLevel: 2
  },
  { 
    id: "I-1005", 
    site: "Tech Park Campus", 
    location: {
      name: "Building A - Server Room",
      coordinates: { lat: -37.8200, lng: 144.9800 }
    },
    type: "Security Breach", 
    severity: "High", 
    status: "Pending", 
    time: "2024-09-22 13:15:00",
    dateTime: new Date("2024-09-22T13:15:00"),
    assigned: "A. Khan",
    assignedId: "g1",
    reportedBy: "Guard",
    reporterName: "J. Ali",
    photo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=1000&auto=format&fit=crop",
    guardMessage: "Unauthorized access attempt detected at server room. Door was found ajar with access keypad showing forced entry signs. IT security notified immediately. Area cordoned off pending investigation. No equipment appears missing but full audit required.",
    description: "Potential unauthorized access to secure server room. Access keypad shows signs of tampering.",
    actionsTaken: "Area secured, IT security notified, incident escalated to management, forensic team requested",
    clientNotified: true,
    priorityLevel: 1
  },
  { 
    id: "I-1006", 
    site: "Hospital Campus", 
    location: {
      name: "Emergency Department - Main Floor",
      coordinates: { lat: -37.8220, lng: 144.9620 }
    },
    type: "Disturbance", 
    severity: "Medium", 
    status: "Resolved", 
    time: "2024-09-21 22:30:00",
    dateTime: new Date("2024-09-21T22:30:00"),
    assigned: "Lisa Rodriguez",
    assignedId: "g5",
    reportedBy: "Staff",
    reporterName: "Nurse Station",
    photo: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400",
    guardMessage: "Responded to disruptive individual in emergency department. Patient's family member became agitated about wait time. Provided de-escalation support to medical staff. Situation calmed without further incident.",
    description: "Family member became agitated and confrontational with medical staff regarding patient wait time.",
    actionsTaken: "De-escalation techniques applied, provided support to medical staff, situation resolved peacefully",
    clientNotified: true,
    priorityLevel: 2
  },
  { 
    id: "I-1007", 
    site: "Industrial Park West", 
    location: {
      name: "Gate 3 - Vehicle Checkpoint",
      coordinates: { lat: -37.8100, lng: 144.9400 }
    },
    type: "Unauthorized Vehicle", 
    severity: "High", 
    status: "Pending", 
    time: "2024-09-22 06:15:00",
    dateTime: new Date("2024-09-22T06:15:00"),
    assigned: "David Wilson",
    assignedId: "g6",
    reportedBy: "Guard",
    reporterName: "David Wilson",
    photo: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=400",
    guardMessage: "Unknown vehicle attempted to breach gate 3 security checkpoint. Driver could not provide valid authorization. Vehicle registration checked - not on approved list. Police notified as precautionary measure.",
    description: "Unregistered vehicle attempted unauthorized entry at industrial gate checkpoint during early morning hours.",
    actionsTaken: "Vehicle stopped at checkpoint, identification requested, police contacted, incident documented",
    clientNotified: true,
    priorityLevel: 1
  },
  { 
    id: "I-1008", 
    site: "University Campus", 
    location: {
      name: "Student Library - Level 3",
      coordinates: { lat: -37.8250, lng: 144.9750 }
    },
    type: "Theft", 
    severity: "Low", 
    status: "Closed", 
    time: "2024-09-21 14:20:00",
    dateTime: new Date("2024-09-21T14:20:00"),
    assigned: "M. Chen",
    assignedId: "g3",
    reportedBy: "Student",
    reporterName: "Student Services",
    photo: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400",
    guardMessage: "Student reported missing laptop from library study area. CCTV review showed no suspicious activity. Item likely taken by opportunity. Campus security protocols reviewed with library staff.",
    description: "Student laptop left unattended in library study area went missing during busy period.",
    actionsTaken: "CCTV review conducted, library staff interviewed, campus security reminders issued",
    clientNotified: false,
    priorityLevel: 3
  },
  { 
    id: "I-1009", 
    site: "Marina District", 
    location: {
      name: "Dock C - Berth 15",
      coordinates: { lat: -37.8080, lng: 144.9580 }
    },
    type: "Safety Hazard", 
    severity: "Medium", 
    status: "Resolved", 
    time: "2024-09-22 11:45:00",
    dateTime: new Date("2024-09-22T11:45:00"),
    assigned: "J. Ali",
    assignedId: "g4",
    reportedBy: "Marina Staff",
    reporterName: "Harbor Master",
    photo: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
    guardMessage: "Oil spill reported on dock walkway creating slip hazard. Area immediately cordoned off. Harbor cleanup crew contacted. Warning signs posted. All foot traffic diverted to alternate routes.",
    description: "Small oil spill on dock walkway creating potential slip hazard for marina users.",
    actionsTaken: "Area secured, cleanup crew contacted, alternative routes established, incident logged",
    clientNotified: true,
    priorityLevel: 2
  },
  { 
    id: "I-1010", 
    site: "Hotel Downtown", 
    location: {
      name: "Hotel Lobby - Ground Floor",
      coordinates: { lat: -37.8160, lng: 144.9650 }
    },
    type: "Suspicious Activity", 
    severity: "Medium", 
    status: "Pending", 
    time: "2024-09-22 20:15:00",
    dateTime: new Date("2024-09-22T20:15:00"),
    assigned: "Lisa Rodriguez",
    assignedId: "g5",
    reportedBy: "Hotel Staff",
    reporterName: "Front Desk Manager",
    photo: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
    guardMessage: "Front desk reported individual loitering in lobby for extended period without checking in. Subject appeared to be monitoring guest activity. Approached for wellness check - individual left premises when questioned.",
    description: "Unknown individual observed loitering in hotel lobby for over 2 hours, appearing to monitor guest activities.",
    actionsTaken: "Subject approached and questioned, left premises voluntarily, incident documented",
    clientNotified: true,
    priorityLevel: 2
  },
  { 
    id: "I-1011", 
    site: "Airport Terminal", 
    location: {
      name: "Terminal A - Security Checkpoint",
      coordinates: { lat: -37.8300, lng: 144.9400 }
    },
    type: "Security Alert", 
    severity: "High", 
    status: "Resolved", 
    time: "2024-09-21 08:30:00",
    dateTime: new Date("2024-09-21T08:30:00"),
    assigned: "A. Khan",
    assignedId: "g1",
    reportedBy: "TSA",
    reporterName: "TSA Supervisor",
    photo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400",
    guardMessage: "Security screening detected prohibited item in passenger luggage. Area cleared as precaution. Bomb squad notified. Item determined to be harmless vintage electronics. Normal operations resumed after 45 minutes.",
    description: "Prohibited item detected during routine security screening triggered enhanced security protocols.",
    actionsTaken: "Area evacuation, bomb squad consultation, item inspection, normal operations restored",
    clientNotified: true,
    priorityLevel: 1
  },
  { 
    id: "I-1012", 
    site: "Sports Complex", 
    location: {
      name: "Main Arena - Section B",
      coordinates: { lat: -37.8120, lng: 144.9680 }
    },
    type: "Medical Emergency", 
    severity: "High", 
    status: "Resolved", 
    time: "2024-09-22 19:45:00",
    dateTime: new Date("2024-09-22T19:45:00"),
    assigned: "S. Singh",
    assignedId: "g2",
    reportedBy: "Event Staff",
    reporterName: "Arena Manager",
    photo: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400",
    guardMessage: "Spectator collapsed during event in main arena. First aid administered immediately. Paramedics called and patient transported to hospital. Event briefly paused then resumed. Family contacted and provided updates.",
    description: "Arena spectator suffered apparent cardiac episode during sporting event.",
    actionsTaken: "First aid provided, emergency services called, family contacted, patient transported to hospital",
    clientNotified: true,
    priorityLevel: 1
  }
];


export const sampleAlarms = [
  { 
    id: "A-2001", 
    site: "CBD Mall", 
    type: "Door Forced", 
    priority: "Critical",
    priorityLevel: 1, 
    assigned: "A. Khan",
    assignedId: "g1",
    eta: "5 min", 
    slaTargetMins: 15, 
    sinceMins: 4, 
    monitoringCompany: "City Retail Monitoring Pty Ltd", 
    license: "MON-CITY-002", 
    licenseDetails: "License: MON-CITY-002",
    unitPrice: 55, 
    completed: false, 
    completedAt: undefined,
    createdAt: new Date(),
    description: "Emergency door forced open in main entrance. Immediate response required.",
    location: "Main Entrance - Ground Floor"
  },
  { 
    id: "A-2002", 
    site: "Docklands Precinct", 
    type: "Panic Button", 
    priority: "Critical",
    priorityLevel: 1, 
    assigned: "S. Singh",
    assignedId: "g2",
    eta: "3 min", 
    slaTargetMins: 10, 
    sinceMins: 7, 
    monitoringCompany: "Alpha Monitoring Pty Ltd", 
    license: "MON-ALPHA-001", 
    licenseDetails: "License: MON-ALPHA-001",
    unitPrice: 55, 
    completed: false, 
    completedAt: undefined,
    createdAt: new Date(),
    description: "Panic button activated in Level 3 office area. Security guard requested immediately.",
    location: "Level 3 - Office Suite 301"
  },
  { 
    id: "A-2003", 
    site: "CBD Mall", 
    type: "Motion After Hours", 
    priority: "Medium",
    priorityLevel: 2, 
    assigned: undefined,
    assignedId: undefined,
    eta: undefined, 
    slaTargetMins: 20, 
    sinceMins: 12, 
    monitoringCompany: "City Retail Monitoring Pty Ltd", 
    license: "MON-CITY-002", 
    licenseDetails: "License: MON-CITY-002",
    unitPrice: 55, 
    completed: false, 
    completedAt: undefined,
    createdAt: new Date(),
    description: "Motion detection triggered in retail area after hours. Investigation required.",
    location: "Retail Level - Store Section B"
  },
  { 
    id: "A-2004", 
    site: "Tech Park Campus", 
    type: "Fire Alarm", 
    priority: "High",
    priorityLevel: 1, 
    assigned: "M. Chen",
    assignedId: "g3",
    eta: "7 min", 
    slaTargetMins: 12, 
    sinceMins: 3, 
    monitoringCompany: "TechPark Security Pty Ltd", 
    license: "MON-TECH-003", 
    licenseDetails: "License: MON-TECH-003",
    unitPrice: 75, 
    completed: false, 
    completedAt: undefined,
    createdAt: new Date(),
    description: "Fire alarm system activated in server room. Immediate evacuation and investigation protocol required.",
    location: "Building A - Server Room Level B1"
  },
  { 
    id: "A-2005", 
    site: "Harbour View Plaza", 
    type: "Medical Emergency", 
    priority: "Critical",
    priorityLevel: 1, 
    assigned: "J. Ali",
    assignedId: "g4",
    eta: "4 min", 
    slaTargetMins: 8, 
    sinceMins: 2, 
    monitoringCompany: "Harbour Security Services", 
    license: "MON-HARB-004", 
    licenseDetails: "License: MON-HARB-004",
    unitPrice: 65, 
    completed: false, 
    completedAt: undefined,
    createdAt: new Date(),
    description: "Medical emergency reported in parking garage. First aid certified guard required immediately.",
    location: "Parking Garage Level P2"
  },
  { 
    id: "A-2006", 
    site: "Corporate Tower", 
    type: "Intrusion", 
    priority: "High",
    priorityLevel: 1, 
    assigned: "Lisa Rodriguez",
    assignedId: "g5",
    eta: "6 min", 
    slaTargetMins: 15, 
    sinceMins: 18, 
    monitoringCompany: "Metro Security Group", 
    license: "MON-METRO-005", 
    licenseDetails: "License: MON-METRO-005",
    unitPrice: 80, 
    completed: true, 
    completedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
    resolvedAt: new Date(Date.now() - 30 * 60 * 1000),
    createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    description: "Unauthorized entry detected at rear service entrance. Perimeter breach confirmed.",
    location: "Service Entrance - Rear Loading Dock"
  },
  { 
    id: "A-2007", 
    site: "Hospital Campus", 
    type: "Security Alert", 
    priority: "High",
    priorityLevel: 1, 
    assigned: "David Wilson",
    assignedId: "g6",
    eta: "8 min", 
    slaTargetMins: 12, 
    sinceMins: 5, 
    monitoringCompany: "Healthcare Security Services", 
    license: "MON-HEALTH-006", 
    licenseDetails: "License: MON-HEALTH-006",
    unitPrice: 70, 
    completed: false, 
    completedAt: undefined,
    createdAt: new Date(),
    description: "Security alert triggered in restricted medical area. Unauthorized access attempt detected.",
    location: "ICU Wing - Level 4"
  },
  // ... add remaining alarms similarly, replacing `null` with `undefined` for optional fields
];


export const sampleVehicles = [
  { 
    id: "V-11", 
    callsign: "Alpha-1", 
    status: "Active", 
    odo: 45200, 
    fuel: 78, 
    lastServiceKm: 42000,
    lat: -37.8136,
    lng: 144.9631,
    speed: 35,
    heading: 145,
    driver: "A. Khan",
    lastUpdate: "30s ago",
    route: [
      { lat: -37.8136, lng: 144.9631, timestamp: "10:45" },
      { lat: -37.8145, lng: 144.9640, timestamp: "10:47" },
      { lat: -37.8155, lng: 144.9650, timestamp: "10:50" }
    ],
    destination: "CBD Mall Level 1",
    eta: "11:15",
    engineTemp: 92,
    batteryLevel: 88
  },
  { 
    id: "V-17", 
    callsign: "Bravo-2", 
    status: "Active", 
    odo: 67800, 
    fuel: 45, 
    lastServiceKm: 65000,
    lat: -37.8200,
    lng: 144.9500,
    speed: 0,
    heading: 0,
    driver: "S. Singh",
    lastUpdate: "2m ago",
    route: [
      { lat: -37.8200, lng: 144.9500, timestamp: "14:00" },
      { lat: -37.8195, lng: 144.9505, timestamp: "14:05" }
    ],
    destination: "Harbour View Plaza",
    eta: "14:30",
    engineTemp: 85,
    batteryLevel: 94
  },
  { 
    id: "V-22", 
    callsign: "Charlie-3", 
    status: "Maintenance", 
    odo: 23400, 
    fuel: 92, 
    lastServiceKm: 20000,
    lat: -37.8180,
    lng: 144.9480,
    speed: 0,
    heading: 0,
    driver: null,
    lastUpdate: "1h ago",
    route: [],
    destination: "Service Center",
    eta: null,
    engineTemp: 0,
    batteryLevel: 76
  },
];

export const demoTrend = [
  { name: "Mon", incidents: 6, alarms: 9, ontime: 92, revenue: 12840, margin: 18.5 },
  { name: "Tue", incidents: 5, alarms: 7, ontime: 94, revenue: 11650, margin: 19.2 },
  { name: "Wed", incidents: 9, alarms: 10, ontime: 88, revenue: 15280, margin: 17.8 },
  { name: "Thu", incidents: 4, alarms: 6, ontime: 95, revenue: 10920, margin: 20.1 },
  { name: "Fri", incidents: 7, alarms: 11, ontime: 90, revenue: 16450, margin: 19.6 },
  { name: "Sat", incidents: 3, alarms: 5, ontime: 97, revenue: 8760, margin: 21.3 },
  { name: "Sun", incidents: 2, alarms: 4, ontime: 98, revenue: 7890, margin: 22.1 },
];

export const revenueStreams = [
  { name: "Alarm Response", value: 45200, change: 8.3, color: "#22c55e" },
  { name: "Guard Services", value: 78400, change: 4.7, color: "#3b82f6" },
  { name: "Vehicle Patrol", value: 23600, change: -2.1, color: "#f59e0b" },
  { name: "Compliance", value: 12800, change: 12.4, color: "#8b5cf6" },
];

export const liveMetrics = {
  currentShiftCost: 1247.50,
  hourlyRevenue: 890.25,
  responseTimeAvg: 4.2,
  clientSatisfaction: 94.7,
  activeBilling: 15,
  overdueInvoices: 3,
};

export const clientList = [
  { id: "c1", name: "Harbour Group", sites: 3, kpiResponse: 92, kpiPatrol: 96, openReq: 1 },
  { id: "c2", name: "City Retail", sites: 5, kpiResponse: 89, kpiPatrol: 91, openReq: 3 },
  { id: "c3", name: "Tech Park", sites: 2, kpiResponse: 94, kpiPatrol: 98, openReq: 0 },
  { id: "c4", name: "Metro Shopping", sites: 4, kpiResponse: 87, kpiPatrol: 93, openReq: 2 },
  { id: "c5", name: "Industrial Complex", sites: 6, kpiResponse: 91, kpiPatrol: 89, openReq: 1 },
  { id: "c6", name: "Office Plaza", sites: 3, kpiResponse: 96, kpiPatrol: 94, openReq: 0 },
  { id: "c7", name: "Warehouse District", sites: 8, kpiResponse: 88, kpiPatrol: 92, openReq: 4 },
  { id: "c8", name: "Hospital Campus", sites: 2, kpiResponse: 97, kpiPatrol: 99, openReq: 0 },
  { id: "c9", name: "University", sites: 12, kpiResponse: 85, kpiPatrol: 87, openReq: 6 },
  { id: "c10", name: "Airport Terminal", sites: 1, kpiResponse: 99, kpiPatrol: 95, openReq: 1 },
];

export const contractorList = [
  { id: "x1", name: "AusWide Experts", compliant: true, insExpiry: "2026-06-30", abn: "12 345 678 901" },
  { id: "x2", name: "NightOps Pty Ltd", compliant: false, insExpiry: "2025-08-15", abn: "23 456 789 012" },
];

export const licences = [
  { person: "A. Khan", type: "VIC Security", number: "SEC-88231", expiry: "2026-03-12", ok: true },
  { person: "S. Singh", type: "VIC Security", number: "SEC-66119", expiry: "2025-09-05", ok: true },
  { person: "M. Chen", type: "WWCC", number: "WWC-32111", expiry: "2025-09-20", ok: false },
  { person: "J. Ali", type: "NSW Security", number: "SEC-00910", expiry: "2025-10-02", ok: true },
];

export const payrollVsInvoice = [
  { name: "Site A", payroll: 8200, invoice: 9800 },
  { name: "Site B", payroll: 12500, invoice: 13800 },
  { name: "Site C", payroll: 6700, invoice: 7300 },
  { name: "Site D", payroll: 15300, invoice: 17200 },
];

// Map configuration
export const mapConfig = {
  width: 800,
  height: 400,
  // convert lat/lng-ish to local SVG coords (simple mock projection)
  project(lat: number, lng: number) {
    const x = (lng - 144.94) * 10000; // scale
    const y = (-(lat - -37.84)) * 10000;
    return { x, y };
  },
};