import React, { useState, useMemo, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import jsPDF from "jspdf";
import { 
  Plus, 
  Clock, 
  MapPin, 
  Car, 
  User, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  QrCode, 
  Route, 
  Timer, 
  Flag,
  Navigation,
  Play,
  Pause,
  Square,
  Activity,
  Camera,
  FileText,
  Calendar,
  Search,
  Filter,
  Download,
  MapIcon,
  Zap,
  TrendingUp,
  Users,
  Shield,
  Building,
  Target,
  Crosshair,
  Wifi,
  DollarSign,
  Copy,
  Settings,
  Loader2
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Progress } from "../components/ui/progress";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import { sampleVehicles, availableGuards, clientList } from "../data/sampleData";
import { toast } from "sonner";
import { useGetAllClientsQuery } from "./../apis/usersApi";
import { PatrolCheckpoint, useCreatePatrolSiteMutation, useGetAllPatrolSitesQuery, useCreateSubSiteMutation, useCreateCheckpointMutation, useCreatePatrolRunMutation } from "./../apis/patrollingAPI";
import { useGetAllGuardsQuery } from "../apis/guardsApi";
import { useGetAllOrdersQuery } from "../apis/ordersApi";
import {
  useDeletePatrolSiteMutation,
  useDeletePatrolSubSiteMutation,
  useDeleteCheckpointMutation,
    useDeletePatrolRunMutation,
    useGetAllPatrolRunsForAdminQuery,
    useGetPatrolRunByIdForAdminQuery,
    useLazyDownloadQRQuery,
    useLazyDownloadSiteQRsPdfQuery

} from "./../apis/patrollingAPI";
import { getStatusColor, getStatusStyle } from "../utils/statusColors";
import { useNavigate, useParams } from "react-router-dom";
  



// Enhanced patrol data structure
const samplePatrols = [
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

const availableVehicles = [
  { id: "V-11", callsign: "Alpha-1", status: "Available" },
  { id: "V-17", callsign: "Bravo-2", status: "Available" },
  { id: "V-22", callsign: "Charlie-3", status: "Maintenance" },
  { id: "V-25", callsign: "Delta-4", status: "Available" }
];

// Enhanced patrol tracking and billing logic
const calculatePatrolRevenue = (patrol: any) => {
  if (!patrol.billing.actualHours) return 0;
  return patrol.billing.actualHours * patrol.billing.hourlyRate;
};

const generateProofOfService = (patrol: any) => {
  return {
    patrolId: patrol.patrolId,
    guardName: patrol.guardName,
    vehicle: patrol.vehicle,
    client: patrol.clientName,
    startTime: patrol.actualStartTime,
    endTime: patrol.actualEndTime,
    totalTime: patrol.billing.actualHours,
    checkpointsCompleted: patrol.completedCheckpoints,
    totalCheckpoints: patrol.totalCheckpoints,
    completionRate: patrol.totalCheckpoints > 0 ? (patrol.completedCheckpoints / patrol.totalCheckpoints * 100) : 0,
    qrScans: patrol.proofOfService.qrScans,
    photos: patrol.proofOfService.photos,
    notes: patrol.proofOfService.notes,
    issuesFound: patrol.issuesFound,
    routeCompliance: !patrol.routeDeviation,
    generatedAt: new Date()
  };
};

const dummyVehicles = [
  { id: crypto.randomUUID(), callsign: "V-Alpha" },
  { id: crypto.randomUUID(), callsign: "V-Bravo" },
  { id: crypto.randomUUID(), callsign: "V-Charlie" },
];

export default function PatrolPage() {
  const [patrols, setPatrols] = useState(samplePatrols);
  const [selectedPatrol, setSelectedPatrol] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showProofDialog, setShowProofDialog] = useState(false);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [liveTracking, setLiveTracking] = useState<{[key: string]: any}>({});
const [debouncedSearch, setDebouncedSearch] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const navigate = useNavigate();
const { id } = useParams<{ id: string }>();

const [triggerDownloadQR] = useLazyDownloadQRQuery();
const [triggerDownloadSitePdf] = useLazyDownloadSiteQRsPdfQuery();



  const {
  data: clientsResponse,
  isLoading: clientsLoading,
  isError: clientsError,
} = useGetAllClientsQuery();

const clientList = clientsResponse?.data || [];

const [
  createPatrolSite,
  { isLoading: isCreatingSite }
] = useCreatePatrolSiteMutation();

const { data, isLoading, isError } = useGetAllPatrolSitesQuery({
  page: 1,
  limit: 50,
});

const [createSubSite, { isLoading: isCreatingSubSite }] =
  useCreateSubSiteMutation();

  const [createCheckpoint, { isLoading: isCreatingCheckpoint }] =
  useCreateCheckpointMutation();

  const { data: guardsResponse } = useGetAllGuardsQuery({
  limit: 50,
  page: 1,
});

const guards =
  guardsResponse?.data?.filter(
    (guard: any) =>
      !["ongoing", "overtime", "overtime_started"].includes(
        guard.status?.toLowerCase()
      )
  ) || [];

const [createPatrolRun, { isLoading: isCreating }] =
  useCreatePatrolRunMutation();

  const { data: ordersResponse } = useGetAllOrdersQuery({
  
});

const orders =
  ordersResponse?.data?.filter(
    (order: any) =>
       order.status === "upcoming" && order.serviceType ==="patrol"
  ) || [];

const [deletePatrolRun, { isLoading: isDeleting }] =
  useDeletePatrolRunMutation();

const [deleteSiteApi, { isLoading: deletingSite }] =
  useDeletePatrolSiteMutation();
  const { data: getPatrolById, isLoading: isProofLoading } =
      useGetPatrolRunByIdForAdminQuery(id as string, {
        skip: !id,
      });

const [deleteSubSiteApi, { isLoading: deletingSubSite }] =
  useDeletePatrolSubSiteMutation();

const [deleteCheckpointApi, { isLoading: deletingCheckpoint }] =
  useDeleteCheckpointMutation();

  const {
  data: patrolResponse,
  isFetching,
} = useGetAllPatrolRunsForAdminQuery({
  page: currentPage,
  limit: 10,
  status: filterStatus,
  search: debouncedSearch,
});

const Patrols = patrolResponse?.data || [];
const apiPagination = patrolResponse?.pagination;
const totalPages = apiPagination?.totalPages || 1;




useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchTerm);
    setCurrentPage(1); // reset page on new search
  }, 500);

  return () => clearTimeout(timer);
}, [searchTerm]);

useEffect(() => {
  if (currentPage > totalPages) {
    setCurrentPage(totalPages || 1);
  }
}, [currentPage, totalPages]);

  const today = new Date().toISOString().split("T")[0];

// Filter only today's patrol runs
const todayPatrols = Patrols.filter(
  p => p.startDateTime?.split("T")[0] === today
);

const totalPatrols = todayPatrols.length;

// Sum of completion percentages
const totalCompletion = todayPatrols.reduce(
  (sum, patrol) => sum + (patrol.completionPercentage || 0),
  0
);



  const activePatrols = Patrols.filter(p => p.status === "ongoing").length;
  const pendingPatrols=Patrols.filter(p=> p.status === "pending").length;
  const completionRate =
  totalPatrols > 0
    ? (totalCompletion / totalPatrols).toFixed(2)
    : 0;


  // Form state for creating patrol
  const [formData, setFormData] = useState({
    patrolId: "",
    orderId: "",
    guardIds: [] as string[],
    vehicleId: "", 
    startDateTime: "",
    estimatedCompletion: "",
    siteIds: [] as string[],
    notes: "",
    unitPrice: 0
  });

  // Enhanced site and checkpoint management
  const [showSiteManager, setShowSiteManager] = useState(false);
  const [showSubSiteDialog, setShowSubSiteDialog] = useState(false);
  const [showCheckpointDialog, setShowCheckpointDialog] = useState(false);
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [selectedSubSite, setSelectedSubSite] = useState<any>(null);
  const [qrPreview, setQrPreview] = useState<{ url: string; name: string } | null>(null);
  const [siteFormData, setSiteFormData] = useState({
    name: "",
    address: "",
    coordinates: { lat: "", lng: "" },
    clientId: "",
    description: ""
  });
  

  const [subSiteFormData, setSubSiteFormData] = useState({
    name: "",
    unitPrice: "",
    description: "",
    estimatedDuration: ""
  });

  const [checkpointFormData, setCheckpointFormData] = useState({
    name: "",
    coordinates: { lat: "", lng: "" },
    range: "20",
    description: "",
    priority: "medium"
  });

  // Enhanced available sites with comprehensive structure
const availableSites = data?.data?.map((site) => ({
  id: site.id,
  name: site.name,
  address: site.address,

  // map subSites -> subsites (UI friendly)
  subsites: site.subSites.map((sub) => ({
    id: sub.id,
    name: sub.name,
    description: "",
    unitPrice: sub.unitPrice,
    checkpoints: sub.checkpoints.map((cp) => ({
      id: cp.id,
      name: cp.name,
      qrCode: cp.qr?.qrUrl || "No QR",
      range: cp.verificationRange,
      latitude: cp.latitude || 0,
      longitude: cp.longitude || 0,
      verificationRange: cp.verificationRange || 20,
      priorityLevel: cp.priorityLevel || "medium",
      
      qr: cp.qr,
    })),
  })),

  // direct site checkpoints (important)
  checkpoints: site.checkpoints.map((cp) => ({
    id: cp.id, // ensure checkpoint ID is included
    name: cp.name,
    qrCode: cp.qr?.qrUrl || "No QR",
    range: cp.verificationRange,
    latitude: cp.latitude || 0,
    longitude: cp.longitude || 0,
    verificationRange: cp.verificationRange || 20,
    priorityLevel: cp.priorityLevel || "medium",
    
    qr: cp.qr,
  })),
})) || [];

const selectedSites = useMemo(
  () =>
    formData.siteIds
      .map((siteId) => availableSites.find((site) => site.id === siteId))
      .filter(Boolean) as any[],
  [formData.siteIds, availableSites]
);

const getTotalCheckpointsForSite = (site: any) => {
  const siteLevelCheckpoints = site.checkpoints?.length || 0;
  const subSiteCheckpoints = (site.subsites || []).reduce(
    (total: number, subsite: any) => total + (subsite.checkpoints?.length || 0),
    0
  );

  return siteLevelCheckpoints + subSiteCheckpoints;
};

  // Enhanced GPS tracking simulation
  useEffect(() => {
    const interval = setInterval(() => {
      patrols.forEach(patrol => {
        if (patrol.status === "Active") {
          // Simulate GPS updates for active patrols
          setLiveTracking(prev => ({
            ...prev,
            [patrol.id]: {
              currentLocation: patrol.currentLocation,
              lastUpdate: new Date(),
              speed: Math.floor(Math.random() * 60) + 20, // 20-80 km/h
              heading: Math.floor(Math.random() * 360),
              gpsSignal: Math.random() > 0.1 ? "Strong" : "Weak",
              etaToNext: Math.floor(Math.random() * 15) + 5 // 5-20 minutes
            }
          }));
        }
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [patrols]);

  const handleDeletePatrol = async (id: string) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this patrol run?"
  );

  if (!confirmDelete) return;

  try {
    await deletePatrolRun(id).unwrap();
    toast.success("Patrol run deleted successfully");
  } catch (error: any) {
    toast.error(error?.data?.message || "Failed to delete patrol run");
  }
};

  const handleDeleteSite = async (siteId: string) => {
  try {
    await deleteSiteApi(siteId).unwrap();

    setFormData((prev) => ({
      ...prev,
      siteIds: prev.siteIds.filter((id) => id !== siteId),
    }));

    toast.success("Site deleted successfully");
  } catch (error: any) {
    toast.error(error?.data?.message || "Failed to delete site");
  }
};

const handleDeleteSubSite = async (subSiteId: string) => {
  try {
    await deleteSubSiteApi(subSiteId).unwrap();
    toast.success("Sub-site deleted successfully");
  } catch (error: any) {
    toast.error(error?.data?.message || "Failed to delete sub-site");
  }
};

const handleDeleteCheckpoint = async (checkpointId: string) => {
  try {
    await deleteCheckpointApi(checkpointId).unwrap();
    toast.success("Checkpoint deleted successfully");
  } catch (error: any) {
    toast.error(error?.data?.message || "Failed to delete checkpoint");
  }
};

  // Calculate enhanced metrics
  const metrics = useMemo(() => {
    const activePatrols = Patrols.filter(p => p.status === "Active").length;
    const scheduledPatrols = patrols.filter(p => p.status === "Scheduled").length;
    const completedToday = patrols.filter(p => p.status === "Completed" && 
      new Date(p.actualEndTime || p.estimatedCompletion).toDateString() === new Date().toDateString()).length;
    const totalCheckpoints = patrols.reduce((sum, p) => sum + p.totalCheckpoints, 0);
    const completedCheckpoints = patrols.reduce((sum, p) => sum + p.completedCheckpoints, 0);
    const completionRate = totalCheckpoints > 0 ? Math.round((completedCheckpoints / totalCheckpoints) * 100) : 0;
    
    // Revenue calculations
    const dailyRevenue = patrols
      .filter(p => p.status === "Completed" && p.billing.actualHours)
      .reduce((sum, p) => sum + calculatePatrolRevenue(p), 0);
    
    const routeDeviations = patrols.filter(p => p.routeDeviation).length;
    const onTimeCompletion = patrols.filter(
      (p) =>
        p.status === "Completed" &&
        p.actualEndTime &&
        new Date(p.actualEndTime) <= new Date(p.estimatedCompletion)
    ).length;

    return {
      activePatrols,
      scheduledPatrols,
      completedToday,
      completionRate,
      dailyRevenue,
      routeDeviations,
      onTimeCompletion
    };
  }, [patrols]);

  // Filter patrols
  const filteredPatrols = patrols.filter(patrol => {
    const matchesStatus = filterStatus === "all" || patrol.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = !searchTerm || 
      patrol.guardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patrol.patrolId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patrol.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const handleCreatePatrol = () => { 
    setFormData({
      patrolId: crypto.randomUUID(),
      orderId: "", // Placeholder for order association
      guardIds: [],
      vehicleId: "",
      startDateTime: "",
      estimatedCompletion: "",
      siteIds: [],
      notes: "",
      unitPrice: 0
    });
    setShowCreateDialog(true);
  };

  const handleSavePatrol = async () => {
  try {
    if (
      !formData.guardIds ||
      !formData.vehicleId ||
      formData.siteIds.length === 0
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      orderId: formData.orderId,
      patrolId: formData.patrolId,
      guardIds: formData.guardIds,
      unitPrice:formData.unitPrice,
      vehicleId: formData.vehicleId,
      startDateTime: new Date(formData.startDateTime).toISOString(),
      estimatedCompletion: new Date(formData.estimatedCompletion).toISOString(),
      description: formData.notes || "",
      siteIds: formData.siteIds,
    };

    const response = await createPatrolRun(payload).unwrap();

    toast.success("Patrol created successfully", {
      description: `Patrol ID: ${response?.data?.patrol?.patrolId}`,
    });

    // Reset form
    setFormData({
      patrolId: "",
      orderId: "",
      guardIds: [],
      vehicleId: "",
      startDateTime: "",
      estimatedCompletion: "",
      notes: "",
      unitPrice: 0,
      siteIds: [],
    });

    setShowCreateDialog(false);

  } catch (error: any) {
    console.error(error);
    toast.error(
      error?.data?.message || "Failed to create patrol"
    );
  }
};

  // Enhanced patrol operations
  const handleStartPatrol = useCallback((patrol: any) => {
    const updatedPatrol = {
      ...patrol,
      status: "Active",
      actualStartTime: new Date().toISOString(),
      currentLocation: "Route started"
    };
    
    setPatrols(prev => prev.map(p => p.id === patrol.id ? updatedPatrol : p));
    
    toast.success(`Patrol ${patrol.patrolId} started`, {
      description: `Guard ${patrol.guardName} is now en route`
    });
  }, []);

  const handleCompletePatrol = useCallback((patrol: any) => {
    const actualHours = patrol.actualStartTime ? 
      (new Date().getTime() - new Date(patrol.actualStartTime).getTime()) / (1000 * 60 * 60) : 
      patrol.billing.estimatedHours;
    
    const updatedPatrol = {
      ...patrol,
      status: "Completed",
      actualEndTime: new Date().toISOString(),
      completedCheckpoints: patrol.totalCheckpoints, // Auto-complete for demo
      billing: {
        ...patrol.billing,
        actualHours: Math.round(actualHours * 10) / 10,
        clientInvoiced: false
      }
    };
    
    setPatrols(prev => prev.map(p => p.id === patrol.id ? updatedPatrol : p));
    
    const revenue = calculatePatrolRevenue(updatedPatrol);
    toast.success(`Patrol ${patrol.patrolId} completed`, {
      description: `Duration: ${updatedPatrol.billing.actualHours}h | Revenue: ${revenue.toFixed(2)}`
    });
  }, []);

  const calculateDurationInHours = (start: string, end: string) => {
  const diff =
    new Date(end).getTime() - new Date(start).getTime();

  return diff > 0 ? (diff / (1000 * 60 * 60)).toFixed(2) : 0;
};

  const transformPatrolForProof = (data: any) => {
  const { patrol, client, guards, sites } = data;

  const allCheckpoints = sites.flatMap((site: any) => [
    ...site.checkpoints.map((cp: any) => ({
      ...cp,
      siteName: site.name,
      subSiteName: null,
    })),
    ...site.subSites.flatMap((sub: any) =>
      sub.checkpoints.map((cp: any) => ({
        ...cp,
        siteName: site.name,
        subSiteName: sub.name,
      }))
    ),
  ]);

  const qrScans = allCheckpoints.filter(
    (cp: any) => cp.scannedAt !== null
  ).length;

  return {
    id: patrol.id,
    patrolId: patrol.patrolId,
    guardName: guards?.[0]?.name || "N/A",
    vehicle: patrol.vehicleId,
    clientName: client?.name || "N/A",
    startTime: patrol.startTime,
    endTime: patrol.estimatedCompletion,
    totalCheckpoints: patrol.totalCheckpoints,
    completedCheckpoints: patrol.completedCheckpoints,
    routeDeviation: patrol.hasDeviation,
    sites,
    proofOfService: {
      qrScans,
      photos: 0, // update later if backend supports
      notes: 0,
    },
    billing: {
      actualHours: calculateDurationInHours(
        patrol.startTime,
        patrol.estimatedCompletion
      ),
      estimatedHours: calculateDurationInHours(
        patrol.startTime,
        patrol.estimatedCompletion
      ),
      hourlyRate: 0,
      clientInvoiced: false,
    },
  };
};

  const handleSimulateQRScan = (checkpoint: any, patrol: any) => {
    // Simulate QR code scanning
    const updatedCheckpoint = {
      ...checkpoint,
      status: "completed",
      scannedAt: new Date().toISOString(),
      arrivalTime: new Date().toISOString()
    };
    
    toast.success(`QR Code scanned: ${checkpoint.name}`, {
      description: `Checkpoint verified for patrol ${patrol.patrolId}`
    });
    
    setShowQRDialog(false);
  };

  const handleGenerateProofOfService = async (patrol: any) => {
  try {
    if (!getPatrolById) {
      toast.error("Patrol data not available");
      return;
    }

    const transformedData = transformPatrolForProof(getPatrolById);

    setSelectedPatrol(transformedData);
    setShowProofDialog(true);
  } catch (error: any) {
    toast.error(error?.data?.message || "Failed to fetch patrol details");
  }
};

  const handleExportPatrolData = async (format: 'csv' | 'pdf') => {
  if (format === 'csv') {
    exportCSV();
  } else {
    await exportPDF();
  }

  setShowExportDialog(false);
};

const exportDataSource = Patrols;

const exportCSV = () => {
  if (!Patrols.length) {
    toast.error("No patrol data available");
    return;
  }

  const exportData = Patrols.map((patrol) => {
    const guardNames = patrol.guards?.length
      ? patrol.guards.map((g: any) => g.name).join(" | ")
      : "No Guard Assigned";

    return {
      "Patrol ID": patrol.patrolId,
      "Status": patrol.status,
      "Vehicle ID": patrol.vehicleId,
      "Client Name": patrol.clientName,
      "Client Email": patrol.clientEmail,
      "Location": patrol.locationName,
      "Order Start Date": new Date(patrol.orderStartDate).toLocaleDateString(),
      "Order Start Time": patrol.orderStartTime,
      "Order Status": patrol.orderStatus,
      "Start DateTime": new Date(patrol.startDateTime).toLocaleString(),
      "Estimated Completion": new Date(patrol.estimatedCompletion).toLocaleString(),
      "Total Sites": patrol.totalSites,
      "Completed Sites": patrol.completedSites,
      "Total SubSites": patrol.totalSubSites,
      "Completed SubSites": patrol.completedSubSites,
      "Total Checkpoints": patrol.totalCheckpoints,
      "Completed Checkpoints": patrol.completedCheckpoints,
      "Completion %": patrol.completionPercentage,
      "Route Deviation": patrol.hasDeviation ? "Yes" : "No",
      "Guards": guardNames,
    };
  });

  // CSV with proper escaping
  const headers = Object.keys(exportData[0]);

  const csvRows = [
    headers.join(","),
    ...exportData.map(row =>
      headers
        .map(field => `"${String((row as Record<string, any>)[field]).replace(/"/g, '""')}"`)
        .join(",")
    )
  ];

  const blob = new Blob([csvRows.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `patrol-export-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  toast.success("CSV export completed");
};
const exportPDF = async () => {
  if (!Patrols.length) {
    toast.error("No patrol data available");
    return;
  }

  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(16);
  doc.text("Patrol Proof of Service Report", 14, y);
  y += 10;

  doc.setFontSize(10);

  Patrols.forEach((patrol, index) => {
      const guardNames = patrol.guards?.length
        ? patrol.guards.map((g: any) => g.name).join(" | ")
        : "No Guard Assigned";
  
      doc.setFont("", "bold");
      doc.text(`Patrol ID: ${patrol.patrolId}`, 14, y);
      doc.setFont("", "normal");
    y += 6;

    doc.text(`Client: ${patrol.clientName}`, 14, y);
    y += 6;

    doc.text(`Location: ${patrol.locationName}`, 14, y);
    y += 6;

    doc.text(`Vehicle: ${patrol.vehicleId}`, 14, y);
    y += 6;

    doc.text(`Guards: ${guardNames}`, 14, y);
    y += 6;

    doc.text(`Status: ${patrol.status}`, 14, y);
    y += 6;

    doc.text(
      `Checkpoints: ${patrol.completedCheckpoints}/${patrol.totalCheckpoints}`,
      14,
      y
    );
    y += 6;

    doc.text(`Completion: ${patrol.completionPercentage}%`, 14, y);
    y += 6;

    doc.text(
      `Route Deviation: ${patrol.hasDeviation ? "Yes" : "No"}`,
      14,
      y
    );
    y += 8;

    doc.line(14, y, 195, y);
    y += 10;

    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save(`patrol-proof-${new Date().toISOString().slice(0, 10)}.pdf`);

  toast.success("PDF exported successfully");
};

  const handleViewDetails = (patrolId: string) => {
    navigate(`/patrol/${patrolId}`);
  };

  const handleViewQR = (checkpoint: any) => {
    setSelectedCheckpoint(checkpoint);
    setShowQRDialog(true);
  };

  

const downloadSiteQRPdf = async (site: any) => {
  if (!site?.id) {
    toast.error("Site ID is missing");
    return;
  }

  try {
    const blob = await triggerDownloadSitePdf({ siteId: site.id }).unwrap();
    const objectUrl = URL.createObjectURL(blob);

    const safeName = (site.name || "site").replace(/[^a-zA-Z0-9-_ ]/g, "").trim();
    const fileName = `${safeName || "site"}-qr.pdf`;

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(objectUrl);
    toast.success("Site QR PDF downloaded");
  } catch (error) {
    console.error("Site QR PDF download failed", error);
    toast.error("Failed to download site QR PDF");
  }
};

  const downloadQR = async (url: string, name: string) => {
  if (!url) {
    toast.error("QR image URL is missing");
    return;
  }

  try {
    const safeName = (name || "checkpoint").replace(/[^a-zA-Z0-9-_ ]/g, "").trim();
    const fileName = `${safeName || "checkpoint"}-QR.svg`;

      const blob = await triggerDownloadQR({ url, name: safeName || "checkpoint" }).unwrap();

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);

      toast.success("QR downloaded successfully");
  } catch (error) {
    console.error("QR download failed", error);
      toast.error("QR download blocked by server CORS policy");
  }
};
  // Enhanced site management functions
  const handleCreateSite = () => {
    setSiteFormData({
      name: "",
      address: "",
      coordinates: { lat: "", lng: "" },
      clientId: "",
      description: ""
    });
    setSelectedSite(null);
    setShowSiteManager(true);
  };

  const handleSaveSite = async () => {
  try {
    // Basic validation
    if (
      !siteFormData.name ||
      !siteFormData.address ||
      !siteFormData.coordinates.lat ||
      !siteFormData.coordinates.lng ||
      !siteFormData.clientId
    ) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      name: siteFormData.name,
      address: siteFormData.address,
      latitude: Number(siteFormData.coordinates.lat),
      longitude: Number(siteFormData.coordinates.lng),
      clientId: siteFormData.clientId,
      description: siteFormData.description || undefined,
    };

    const response = await createPatrolSite(payload).unwrap();

    console.log("Site created:", response);

    // ✅ Close dialog
    setShowSiteManager(false);

    // ✅ Reset form
    setSiteFormData({
      name: "",
      address: "",
      coordinates: { lat: "", lng: "" },
      clientId: "",
      description: "",
    });

  } catch (error) {
    console.error("Create site failed:", error);
  }
};

  const handleAddSubSite = (siteId: string) => {
    const site = availableSites.find(s => s.id === siteId);
    setSelectedSite(site);
    setSubSiteFormData({
      name: "",
      unitPrice: "",
      description: "",
      estimatedDuration: ""
    });
    setShowSubSiteDialog(true);
  };

  const handleSaveSubSite = async () => {
  if (!selectedSite) {
    toast.error("No site selected");
    return;
  }

  // Basic validation
  if (!subSiteFormData.name.trim()) {
    toast.error("Sub-site name is required");
    return;
  }

  try {
    const payload = {
      siteId: selectedSite.id,
      name: subSiteFormData.name,
      unitPrice: Number(subSiteFormData.unitPrice),
      estimatedDuration: Number(subSiteFormData.estimatedDuration),
      description: subSiteFormData.description,
    };

    const response = await createSubSite(payload).unwrap();

    toast.success(response.message || "Sub-site created successfully");

    // Close dialog
    setShowSubSiteDialog(false);

    // Reset form
    setSubSiteFormData({
      name: "",
      unitPrice: "",
      description: "",
      estimatedDuration: "",
    });

  } catch (error: any) {
    toast.error(
      error?.data?.message || "Failed to create sub-site"
    );
  }
};

  const handleAddCheckpoint = (
  siteId: string,
  subSiteId?: string
) => {
  const site = availableSites.find(s => s.id === siteId);

  const subSite = subSiteId
    ? site?.subsites.find(ss => ss.id === subSiteId)
    : undefined;

  setSelectedSite(site);
  setSelectedSubSite(subSite);

  setCheckpointFormData({
    name: "",
    coordinates: { lat: "", lng: "" },
    range: "20",
    description: "",
    priority: "medium"
  });

  setShowCheckpointDialog(true);
};

  const handleSaveCheckpoint = async () => {
  if (!selectedSite) return;

  try {
    const payload: any = {
      name: checkpointFormData.name,
      latitude: Number(checkpointFormData.coordinates.lat),
      longitude: Number(checkpointFormData.coordinates.lng),
      verificationRange: Number(checkpointFormData.range),
      priorityLevel: checkpointFormData.priority,
      description: checkpointFormData.description,
    };

    // 🔥 Decide automatically
    if (selectedSubSite) {
      payload.subSiteId = selectedSubSite.id;
    } else {
      payload.siteId = selectedSite.id;
    }

    await createCheckpoint(payload).unwrap();

    toast.success("Checkpoint created successfully");

    setShowCheckpointDialog(false);
  } catch (error) {
    console.error(error);
    toast.error("Failed to create checkpoint");
  }
};

  const handleAddSiteToPatrol = (site: any) => {
    setFormData(prev => {
      if (prev.siteIds.includes(site.id)) {
        return prev;
      }

      return {
        ...prev,
        siteIds: [...prev.siteIds, site.id],
      };
    });
    
    toast.success("Site added to patrol", {
      description: `${site.name} with ${site.subsites.length} sub-sites added`
    });
  };

  const toggleSiteSelection = (site: any) => {
    setFormData((prev) => {
      const alreadySelected = prev.siteIds.includes(site.id);

      return {
        ...prev,
        siteIds: alreadySelected
          ? prev.siteIds.filter((id) => id !== site.id)
          : [...prev.siteIds, site.id],
      };
    });
  };

const generateQRCodeForCheckpoint = (checkpoint: any) => {

  console.log("CHECKPOINT DATA 👉", checkpoint);

  const qrData = {
    checkpointId: checkpoint.id,

    qrId: checkpoint.qr?.id ?? null,
    qrCode: checkpoint.qr?.qrUrl ?? null,

    latitude:
      checkpoint.qr?.latitude ??
      checkpoint.latitude ??
      null,

    longitude:
      checkpoint.qr?.longitude ??
      checkpoint.longitude ??
      null,
    name: checkpoint.name,

    range: checkpoint.verificationRange ?? null,

    timestamp: new Date().toISOString(),
  };

  navigator.clipboard
    .writeText(JSON.stringify(qrData, null, 2))
    .then(() => {
      toast.success("QR code data copied", {
        description:
          "QR code information copied to clipboard for printing",
      });
    });
};

const handleQrIconAction = (checkpoint: any) => {
  generateQRCodeForCheckpoint(checkpoint);

  const qrUrl = checkpoint.qr?.qrUrl;
  if (!qrUrl) {
    toast.error("QR not available");
    return;
  }

  setQrPreview({
    url: qrUrl,
    name: checkpoint.name || "checkpoint",
  });
};

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-gray-100 text-gray-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCheckpointStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-3">
      {/* Compact Header with Summary Cards Inline */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1">
          <h1 className="mb-1">Patrol Management</h1>
          <p className="text-gray-600 text-xl">QR Scanning, Real-time Tracking & Proof of Service</p>
        </div>
        
        {/* Enhanced Inline Summary Cards */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
            <Activity className="h-4 w-4 text-green-600" />
            <div>
              <div className="font-bold text-green-700">{activePatrols}</div>
              <div className="text-lg text-green-600">Active</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
            <Clock className="h-4 w-4 text-blue-600" />
            <div>
              <div className="font-bold text-blue-700">{pendingPatrols}</div>
              <div className="text-lg text-blue-600">Pending</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
            <Shield className="h-4 w-4 text-purple-600" />
            <div>
              <div className="font-bold text-purple-700">{completionRate}%</div>
              <div className="text-lg text-purple-600">Completion</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
            <TrendingUp className="h-4 w-4 text-orange-600" />
            <div>
              <div className="font-bold text-orange-700">${metrics.dailyRevenue.toFixed(0)}</div>
              <div className="text-lg text-orange-600">Daily Revenue</div>
            </div>
          </div>
          
          {/* <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
            <Route className="h-4 w-4 text-yellow-600" />
            <div>
              <div className="font-bold text-yellow-700">{metrics.routeDeviations}</div>
              <div className="text-lg text-yellow-600">Deviations</div>
            </div>
          </div> */}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowExportDialog(true)} 
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          
          <Button onClick={handleCreatePatrol} disabled={isLoading} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Patrol
          </Button>
        </div>
      </div>

      {/* Compact Filters Row */}
      <div className="flex flex-wrap gap-2 items-center bg-white p-3 rounded-lg border">
  <Filter className="h-4 w-4 text-gray-500" />

  {/* Search */}
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />

    <Input
      placeholder="Search patrols..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-9 w-40 h-8"
    />

    {isFetching && (
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <div className="h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
      </div>
    )}
  </div>

  {/* Status Filter */}
  <Select
    value={filterStatus}
    onValueChange={(value: React.SetStateAction<string>) => {
  setFilterStatus(value);
  setCurrentPage(1);
}}
  >
    <SelectTrigger className="w-38 h-8">
      <SelectValue placeholder="Status" />
    </SelectTrigger>
    <SelectContent>
  <SelectItem value="all">All Status</SelectItem>
  <SelectItem value="accepted">Accepted</SelectItem>
  <SelectItem value="rejected">Rejected</SelectItem>
  <SelectItem value="pending">Pending</SelectItem>
  <SelectItem value="upcoming">Upcoming</SelectItem>
  <SelectItem value="ongoing">Ongoing</SelectItem>
  <SelectItem value="delayed">Delayed</SelectItem>
  <SelectItem value="absent">Absent</SelectItem>
  <SelectItem value="scheduled">Scheduled</SelectItem>
  <SelectItem value="active">Active</SelectItem>
  <SelectItem value="completed">Completed</SelectItem>
</SelectContent>
  </Select>

  {/* Clear Button */}
  <Button
    variant="outline"
    size="sm"
    onClick={() => {
  setFilterStatus("all");
  setSearchTerm("");
  setDebouncedSearch("");
  setCurrentPage(1);
}}
    className="h-8"
  >
    Clear
  </Button>
</div>

      {/* Main Patrol List - Compact Layout */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Patrol Operations</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">

  {/* Loader */}
  {isFetching && (
    <div className="text-center py-8">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
      <p className="mt-2 text-gray-600">Loading patrols...</p>
    </div>
  )}

  {/* Patrol List */}
  {!isFetching && (
    <div className="space-y-3">
      {Patrols.length === 0 && (
        <div className="text-center py-8 border rounded-lg bg-gray-50 text-gray-600">
          No patrol runs found
        </div>
      )}

      {Patrols.map((patrol) => (
        <Card
          key={patrol.id}
          className="border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">

                {/* Patrol Info */}
                <div>
                  <div className="font-medium text-gray-900 max-w-[200px] truncate pt-2 ">
                    {patrol.patrolId}
                  </div>

                  <div className="text-xl text-gray-600">
                    {patrol.guards?.[0]?.name || "No Guard Assigned"}
                  </div>

                  <div className="flex items-center gap-1 mt-1">
                    <Car className="h-5 w-5 text-gray-400" />
                    <span className="text-lg text-gray-600 max-w-[200px] truncate">
                      {patrol.vehicleId || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Client & Location */}
                <div>
                  <div className="text-xl text-gray-900 max-w-[200px] truncate">
                    {patrol.clientName}
                  </div>

                  <div className="flex items-center gap-1">
                    <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
                    <span className="text-lg text-gray-600 max-w-[300px] truncate">
                      {patrol.locationName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-lg text-gray-600">
                      {new Date(patrol.startDateTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Progress & Details */}
                <div className="pl-5">
                  <div className="text-xl text-gray-900 mb-1">
                    {patrol.completedCheckpoints}/{patrol.totalCheckpoints} Checkpoints
                  </div>

                  <Progress
                    value={patrol.completionPercentage || 0}
                    className="h-2"
                  />

                  <div className="flex items-center gap-3 mt-1 text-lg text-gray-600">
                    <div className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      <span>{patrol.totalSites} sites</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      <span>{patrol.totalSubSites} sub-sites</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <QrCode className="h-3 w-3" />
                      <span>{patrol.completedCheckpoints} scanned</span>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center justify-between">
                  <div className="pl-5">
                    <Badge 
                                          className="font-medium border-2"
                                           style={getStatusStyle(patrol.status)}
                                                                            >
                                                {patrol.status}
                                                    </Badge>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(patrol.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>

                    {patrol.completedCheckpoints > 0 && (
  <Button
  size="sm"
  variant="outline"
  className="h-8 px-2 text-lg"
  onClick={() => handleGenerateProofOfService(patrol)}
  disabled={isProofLoading}
>
  <FileText className="h-3 w-3 mr-1" />
  {isProofLoading ? "Loading..." : "Proof"}
</Button>
)}

<Button
  size="sm"
  variant="destructive"
  className="h-8 w-8 p-0"
  onClick={() => handleDeletePatrol(patrol.id)}
  disabled={isDeleting}
>
  <Trash2 className="h-3 w-3" />
</Button>
                  </div>
                </div>

              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      setCurrentPage((prev) => prev - 1);
                    }
                  }}
                  className={`${
                    currentPage === 1
                      ? "pointer-events-none opacity-40 cursor-not-allowed"
                      : "cursor-pointer hover:bg-gray-100"
                  } transition-colors`}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                    isActive={page === currentPage}
                    className={`cursor-pointer transition-all ${
                      page === currentPage
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) {
                      setCurrentPage((prev) => prev + 1);
                    }
                  }}
                  className={`${
                    currentPage === totalPages
                      ? "pointer-events-none opacity-40 cursor-not-allowed"
                      : "cursor-pointer hover:bg-gray-100"
                  } transition-colors`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )}

</CardContent>
      </Card>

      {/* Patrol Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patrol Details</DialogTitle>
            <DialogDescription>
              Comprehensive patrol information and checkpoint status
            </DialogDescription>
          </DialogHeader>
          
          {selectedPatrol && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Patrol Information</h3>
                    <div className="space-y-2">
                      <div><strong>Patrol ID:</strong> {selectedPatrol.patrolId}</div>
                      <div><strong>Guard:</strong> {selectedPatrol.guardName}</div>
                      <div><strong>Vehicle:</strong> {selectedPatrol.vehicle}</div>
                      <div><strong>Client:</strong> {selectedPatrol.clientName}</div>
                      <div>
                        <strong>Status:</strong> 
                        <Badge className={`ml-2 ${getStatusColor(selectedPatrol.status)}`}>
                          {selectedPatrol.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Timing</h3>
                    <div className="space-y-2">
                      <div><strong>Start Time:</strong> {new Date(selectedPatrol.startTime).toLocaleString()}</div>
                      <div><strong>Est. Completion:</strong> {new Date(selectedPatrol.estimatedCompletion).toLocaleString()}</div>
                      {selectedPatrol.actualStartTime && (
                        <div><strong>Actual Start:</strong> {new Date(selectedPatrol.actualStartTime).toLocaleString()}</div>
                      )}
                      {selectedPatrol.actualEndTime && (
                        <div><strong>Actual End:</strong> {new Date(selectedPatrol.actualEndTime).toLocaleString()}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkpoints */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Checkpoints</h3>
                <div className="space-y-3">
                  {selectedPatrol.sites.map((site: any) => (
                    <div key={site.id} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{site.name}</h4>
                      {site.subsites.map((subsite: any) => (
                        <div key={subsite.id} className="ml-4">
                          <h5 className="text-xl font-medium text-gray-700 mb-2">{subsite.name}</h5>
                          <div className="grid gap-2">
                            {subsite.checkpoints.map((checkpoint: any) => (
                              <div key={checkpoint.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <div className="flex-1">
                                  <div className="font-medium">{checkpoint.name}</div>
                                  <div className="text-xl text-gray-600">QR: {checkpoint.qrCode}</div>
                                  {checkpoint.scannedAt && (
                                    <div className="text-lg text-gray-500">
                                      Scanned: {new Date(checkpoint.scannedAt).toLocaleString()}
                                    </div>
                                  )}
                                  {checkpoint.issues.length > 0 && (
                                    <div className="text-lg text-orange-600 mt-1">
                                      Issues: {checkpoint.issues.join(", ")}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={getCheckpointStatusColor(checkpoint.status)}>
                                    {checkpoint.status}
                                  </Badge>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleViewQR(checkpoint)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <QrCode className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Proof of Service */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <QrCode className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-bold text-2xl">{selectedPatrol.proofOfService.qrScans}</div>
                  <div className="text-xl text-gray-600">QR Scans</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Camera className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="font-bold text-2xl">{selectedPatrol.proofOfService.photos}</div>
                  <div className="text-xl text-gray-600">Photos</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="font-bold text-2xl">{selectedPatrol.proofOfService.notes}</div>
                  <div className="text-xl text-gray-600">Notes</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>QR Code: {selectedCheckpoint?.name}</DialogTitle>
            <DialogDescription>
              GPS-verified QR code for checkpoint scanning
            </DialogDescription>
          </DialogHeader>
          
          {selectedCheckpoint && (
            <div className="space-y-4">
              {/* QR Code Visual */}
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center shadow-inner">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 mx-auto mb-2 text-gray-700" />
                    <div className="text-xl font-medium text-gray-800">QR Code</div>
                    <div className="text-lg text-gray-600 mt-1 font-mono bg-gray-100 px-2 py-1 rounded">
                      {selectedCheckpoint.qrCode}
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkpoint Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">GPS Coordinates</h4>
                  <div className="space-y-1 text-xl text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>Lat: {selectedCheckpoint.coordinates?.lat || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>Lng: {selectedCheckpoint.coordinates?.lng || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Verification</h4>
                  <div className="space-y-1 text-xl text-gray-600">
                    <div className="flex items-center gap-1">
                      <Wifi className="h-3 w-3" />
                      <span>Range: {selectedCheckpoint.range || 20}m</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      <span>Priority: {selectedCheckpoint.priority || 'Medium'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedCheckpoint.description && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 text-xl mb-1">Instructions</h4>
                  <p className="text-xl text-blue-800">{selectedCheckpoint.description}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => generateQRCodeForCheckpoint(selectedCheckpoint)}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy QR Data
                </Button>
                <Button className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Print Label
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setShowQRDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Create Patrol Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog} >
        <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] p-8 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Patrol Run</DialogTitle>
            <DialogDescription>
              Set up comprehensive patrol with sites, sub-sites, and checkpoints
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patrolId">Patrol ID</Label>
                <Input
                  id="patrolId"
                  value={formData.patrolId}
                  onChange={(e) => setFormData({...formData, patrolId: e.target.value})}
                  placeholder="P-2024-001"
                  className="bg-gray-50"
                  disabled
                />
              </div>
              
              <div>
  <Label>Assign Guards</Label>

  <Select>
    <SelectTrigger>
      <SelectValue
        placeholder={
          formData.guardIds.length > 0
            ? `${formData.guardIds.length} guard(s) selected`
            : "Select guards"
        }
      />
    </SelectTrigger>

    <SelectContent className="max-h-80 overflow-y-auto">
  {guards.length === 0 ? (
    <div className="px-3 py-2 text-sm text-gray-500 select-none">
      No available guards
    </div>
  ) : (
    guards.map((guard: any) => {
      const isSelected = formData.guardIds.includes(guard.id);

      return (
        <div
          key={guard.id}
          className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
          onClick={() => {
            if (isSelected) {
              setFormData({
                ...formData,
                guardIds: formData.guardIds.filter(
                  (id) => id !== guard.id
                ),
              });
            } else {
              setFormData({
                ...formData,
                guardIds: [...formData.guardIds, guard.id],
              });
            }
          }}
        >
          <input type="checkbox" checked={isSelected} readOnly />
          <User className="h-4 w-4" />
          {guard.name}
        </div>
      );
    })
  )}
</SelectContent>
  </Select>
</div>
              
                          <div>
              <Label htmlFor="vehicle">Assign Vehicle</Label>
              <Select
                value={formData.vehicleId}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, vehicleId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>

                <SelectContent className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                  {dummyVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        {vehicle.callsign}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

                          <div>
                <Label htmlFor="order">Assign Order</Label>
                <Select
                  value={formData.orderId}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, orderId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select order" />
                  </SelectTrigger>

                  <SelectContent className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
  {orders.length === 0 ? (
    <div className="px-3 py-2 text-sm text-gray-500">
      No upcoming patrol orders
    </div>
  ) : (
    orders.map((order: any) => (
      <SelectItem key={order.id} value={order.id}>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="font-medium max-w-xs flex-1">
            {order.locationName || order.locationAddress}
          </span>
        </div>
      </SelectItem>
    ))
  )}
</SelectContent>
                </Select>
              </div>
              
              {/* <div>
                <Label htmlFor="status">Initial Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
              
              <div>
                <Label htmlFor="startTime">Start Date & Time</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={formData.startDateTime}
                  onChange={(e) => setFormData({...formData, startDateTime: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="estimatedCompletion">Estimated Completion</Label>
                <Input
                  id="estimatedCompletion"
                  type="datetime-local"
                  value={formData.estimatedCompletion}
                  onChange={(e) => setFormData({...formData, estimatedCompletion: e.target.value})}
                />
              </div>
              <div>
  <Label htmlFor="unitPrice">Unit Price (₹ per hour)</Label>
  <Input
    id="unitPrice"
    type="number"
    min="0"
    placeholder="Enter unit price"
    value={formData.unitPrice}
    onChange={(e) =>
      setFormData({
        ...formData,
        unitPrice: Number(e.target.value),
      })
    }
  />
</div>
            </div>

            {/* Site Management Section */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Patrol Sites & Checkpoints</h3>
                  <p className="text-xl text-gray-600">Add sites with sub-sites and checkpoints for this patrol</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCreateSite}
                    className="flex items-center gap-2"
                  >
                    <Building className="h-4 w-4" />
                    Create Site
                  </Button>
                </div>
              </div>

              {/* Site Selector */}
              <div className="space-y-3">
                <Label>Select Sites</Label>
                <Select>
                  <SelectTrigger className="w-full md:w-[420px]">
                    <SelectValue
                      placeholder={
                        selectedSites.length > 0
                          ? `${selectedSites.length} site(s) selected`
                          : "Select sites"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent className="max-h-80 overflow-y-auto">
                    {availableSites.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gray-500">No sites available</div>
                    ) : (
                      availableSites.map((site) => {
                        const isSelected = formData.siteIds.includes(site.id);

                        return (
                          <div
                            key={site.id}
                            className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => toggleSiteSelection(site)}
                          >
                            <input type="checkbox" checked={isSelected} readOnly />
                            <Building className="h-4 w-4 text-blue-600" />
                            <span className="truncate">{site.name}</span>
                          </div>
                        );
                      })
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Sites */}
<div className="space-y-5 max-h-[500px] overflow-y-auto pr-2">

  {selectedSites.map((site) => (
    <Card
      key={site.id}
      className="w-full border border-gray-200 shadow-sm hover:shadow-md transition"
    >
      <CardContent className="p-5">

        {/* =========================
            SITE HEADER
        ========================== */}
        <div className="flex justify-between items-start gap-4">

          <div className="flex-1 min-w-0">

            <div className="flex items-center gap-3 flex-wrap">
              <Building className="h-5 w-5 text-blue-600 flex-shrink-0" />

              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {site.name}
              </h3>

              <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                {site.subsites.length} Sub-Sites
              </Badge>

              <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">
                {getTotalCheckpointsForSite(site)} Total Checkpoints
              </Badge>

              {site.checkpoints.length > 0 && (
                <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                  {site.checkpoints.length} Site Check points
                </Badge>
              )}
            </div>

            <p className="text-sm text-gray-500 mt-1 truncate">
              {site.address}
            </p>
          </div>

          <div className="flex items-center gap-2">

          <Button
  size="sm"
  variant="outline"
  onClick={() => downloadSiteQRPdf(site)}
>
  Download All QR
</Button>

    {/* Delete Site */}
    <Button
      size="icon"
      variant="ghost"
      className="text-red-500 hover:text-red-600"
      onClick={() => handleDeleteSite(site.id)}
disabled={deletingSite}
    >
      <Trash2 className="h-4 w-4" />
    </Button>

          <Button
            size="sm"
            variant="outline"
            className="whitespace-nowrap"
            onClick={() => toggleSiteSelection(site)}
          >
            <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
            Selected
          </Button>
        </div>
        </div>

        {/* =========================
            SITE CHECKPOINTS
        ========================== */}
        {site.checkpoints.length >= 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">

            <div className="text-sm font-semibold text-yellow-800 mb-3 flex justify-between items-center">
              Site Level Checkpoints

              <Badge className="text-xs ">
    {site.checkpoints.length} CP
  </Badge>
            </div>

            

            <div className="space-y-2">
              {site.checkpoints.map((checkpoint: any) => (
                <div
                  key={checkpoint.id}
                  className="flex items-center justify-between bg-white p-3 rounded-md border"
                >
                  <div className="flex items-center gap-3 min-w-0">

                    <Crosshair className="h-4 w-4 text-orange-500 flex-shrink-0" />

                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">
                        {checkpoint.name}
                      </div>

                      <div 
                      className="flex items-center gap-2 mt-1 flex-wrap "
                      >
                        <Badge onClick={() => {
                            navigator.clipboard.writeText(checkpoint.qr!.qrUrl);
                            toast.success("QR URL copied"); 
                          }}
                         className="text-xs bg-gray-500 max-w-[650px] hover:cursor-pointer">
                          QR: {checkpoint.qrCode}
                        </Badge>

                        <Badge className="text-xs bg-purple-50 text-purple-700">
                          {checkpoint.range}m
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
  <Button
    size="lg"
    variant="ghost"
    onClick={() => handleQrIconAction(checkpoint)}
  >
    <QrCode className="h-10 w-10" />
  </Button>

  <Button
    size="icon"
    variant="ghost"
    className="text-red-500 hover:text-red-600"
    onClick={() => handleDeleteCheckpoint(checkpoint.id)}
disabled={deletingCheckpoint}
  >
    <Trash2 className="h-4 w-4" />
  </Button>

</div>
                </div>
              ))}
              <Button
                      size="sm"
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-700"
                      onClick={() => handleAddCheckpoint(site.id, undefined)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Site Checkpoint
                    </Button>
            </div>
          </div>
        )}

        {/* =========================
            SUB SITES
        ========================== */}
        {site.subsites.length >= 0 && (
          <div className="mt-5 space-y-4">

            {site.subsites.map((subsite: any) => (
              <div
                key={subsite.id}
                className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
              >
                {/* Subsite Header */}
                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3 min-w-0">
                    <Target className="h-4 w-4 text-green-600 flex-shrink-0" />

                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">
                        {subsite.name}
                      </div>

                      {subsite.description && (
                        <p className="text-xs text-gray-500 truncate">
                          {subsite.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">

  <Badge className="bg-green-50 text-green-700 text-xs">
    ${subsite.unitPrice}
  </Badge>

  <Badge className="text-xs">
    {subsite.checkpoints.length} CP
  </Badge>

  {/* Delete SubSite */}
  <Button
    size="icon"
    variant="ghost"
    className="text-red-500 hover:text-red-600"
    onClick={() => handleDeleteSubSite(subsite.id)}
disabled={deletingSubSite}
  >
    <Trash2 className="h-4 w-4" />
  </Button>

</div>
                </div>

                {/* Subsite Checkpoints */}
                  <div className="mt-3 space-y-2">

                    {subsite.checkpoints.length > 0 ? (
                      subsite.checkpoints.map((checkpoint: any) => (
                        <div
                          key={checkpoint.id}
                          className="flex items-center justify-between bg-white p-3 rounded-md border"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Crosshair className="h-4 w-4 text-orange-500 flex-shrink-0" />

                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate">
                                {checkpoint.name}
                              </div>

                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <Badge
                                  onClick={() => {
                                    navigator.clipboard.writeText(checkpoint.qr!.qrUrl);
                                    toast.success("QR URL copied");
                                  }}
                                  className="text-xs bg-gray-500  max-w-[650px] hover:cursor-pointer"
                                >
                                  QR: {checkpoint.qrCode}
                                </Badge>

                                <Badge className="text-xs bg-purple-50 text-purple-700">
                                  {checkpoint.range}m
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
  <Button
    size="lg"
    variant="ghost"
    onClick={() => handleQrIconAction(checkpoint)}
  >
    <QrCode className="h-4 w-4" />
  </Button>

  <Button
    size="icon"
    variant="ghost"
    className="text-red-500 hover:text-red-600"
    onClick={() => handleDeleteCheckpoint(checkpoint.id)}
disabled={deletingCheckpoint}
  >
    <Trash2 className="h-4 w-4" />
  </Button>

</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-gray-400 italic">
                        No checkpoints added yet
                      </div>
                    )}

                    {/* ALWAYS show Add Checkpoint button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-700"
                      onClick={() => handleAddCheckpoint(site.id, subsite.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add SubSite Checkpoint
                    </Button>

                  </div>
              </div>
            ))}

            <Button
              size="sm"
              variant="ghost"
              className="text-green-600 hover:text-green-700"
              onClick={() => handleAddSubSite(site.id)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Sub-Site
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  ))}
</div>

              {/* Selected Sites Summary */}
              {selectedSites.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Selected Sites for Patrol:</h4>
                  <div className="space-y-2">
                    {selectedSites.map((site) => (
                      <div key={site.id} className="flex items-center justify-between text-xl">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-blue-600" />
                          <span>{site.name}</span>
                          <Badge variant="outline" className="text-lg">
                            {getTotalCheckpointsForSite(site)} checkpoints
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            siteIds: prev.siteIds.filter((id) => id !== site.id)
                          }))}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Special instructions, requirements, or notes for this patrol..."
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSavePatrol}
              disabled={
                formData.guardIds.length === 0 ||
                !formData.vehicleId ||
                !formData.orderId ||
                formData.siteIds.length === 0 ||
                formData.unitPrice <= 0
              }
            >
              Create Patrol Run
            </Button>
          </div>
          
        </DialogContent>
      </Dialog>
      <Dialog
  open={!!qrPreview}
  onOpenChange={(open) => {
    if (!open) setQrPreview(null);
  }}
>
  <DialogContent className="max-w-md p-6 rounded-2xl">

    {/* Close Button */}
    <button
      onClick={() => setQrPreview(null)}
      className="absolute top-3 right-3 text-gray-500 hover:text-black"
    >
      
    </button>

    {/* Title */}
    <div className="text-center font-semibold text-gray-700 mb-4">
      {qrPreview?.name}
    </div>

    {/* QR Image */}
    <img
      src={qrPreview?.url}
      alt="QR Preview"
      className="w-64 h-64 mx-auto object-contain"
    />

    {/* Download */}
    <div className="mt-5 flex justify-center">
      <Button
        size="sm"
        onClick={() =>
          qrPreview &&
          downloadQR(qrPreview.url, qrPreview.name)
        }
      >
        Download QR
      </Button>
    </div>

  </DialogContent>
</Dialog>
      

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Patrol Data</DialogTitle>
            <DialogDescription>
              Choose format for exporting patrol records and proof-of-service reports
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              onClick={() => handleExportPatrolData('csv')}
              className="flex flex-col items-center gap-2 h-20"
              variant="outline"
            >
              <FileText className="h-8 w-8" />
              <span>Export CSV</span>
            </Button>
            
            <Button
              onClick={() => handleExportPatrolData('pdf')}
              className="flex flex-col items-center gap-2 h-20"
              variant="outline"
            >
              <Download className="h-8 w-8" />
              <span>Proof-of-Service PDF</span>
            </Button>
          </div>
          
          <div className="text-xl text-gray-600">
            <p>CSV: Raw patrol data for analysis and billing</p>
            <p>PDF: Client reports with GPS tracks, QR scan proof, and photos</p>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Proof of Service Dialog */}
      <Dialog open={showProofDialog} onOpenChange={setShowProofDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Proof of Service Report</DialogTitle>
            <DialogDescription>
              Comprehensive patrol completion report for client delivery
            </DialogDescription>
          </DialogHeader>
          
          {selectedPatrol && (
            <div className="space-y-6">
              {/* Report Header */}
              <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold mb-2">Patrol Summary</h3>
                  <div className="space-y-1 text-xl">
                    <div><strong>Patrol ID:</strong> {selectedPatrol.patrolId}</div>
                    <div><strong>Guard:</strong> {selectedPatrol.guardName}</div>
                    <div><strong>Vehicle:</strong> {selectedPatrol.vehicle}</div>
                    <div><strong>Client:</strong> {selectedPatrol.clientName}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Performance Metrics</h3>
                  <div className="space-y-1 text-xl">
                    <div><strong>Duration:</strong> {selectedPatrol.billing.actualHours || 'N/A'}h</div>
                    <div><strong>Completion:</strong> {selectedPatrol.totalCheckpoints > 0 ? Math.round((selectedPatrol.completedCheckpoints / selectedPatrol.totalCheckpoints) * 100) : 0}%</div>
                    <div><strong>QR Scans:</strong> {selectedPatrol.proofOfService.qrScans}</div>
                    <div><strong>Route Compliance:</strong> {selectedPatrol.routeDeviation ? '❌ Deviation' : '✅ On Route'}</div>
                  </div>
                </div>
              </div>

              {/* Checkpoint Timeline */}
              <div>
                <h3 className="font-semibold mb-3">Checkpoint Timeline</h3>
                <div className="space-y-2">
                  {selectedPatrol.sites.map((site: any) => (
  <>
    {site.checkpoints.map((checkpoint: any) => (
      <div key={checkpoint.id} className="flex items-center justify-between p-3 border rounded">
        <div>
          <div className="font-medium">{checkpoint.name}</div>
          <div className="text-xl text-gray-600">{site.name}</div>
        </div>
        <div className="text-right text-xl">
          <div className={checkpoint.scannedAt ? 'text-green-600' : 'text-gray-500'}>
            {checkpoint.scannedAt ? '✅ Completed' : '⏳ Pending'}
          </div>
          {checkpoint.scannedAt && (
            <div className="text-lg text-gray-500">
              {new Date(checkpoint.scannedAt).toLocaleString()}
            </div>
          )}
        </div>
      </div>
    ))}

    {site.subSites.map((sub: any) =>
      sub.checkpoints.map((checkpoint: any) => (
        <div key={checkpoint.id} className="flex items-center justify-between p-3 border rounded">
          <div>
            <div className="font-medium">{checkpoint.name}</div>
            <div className="text-xl text-gray-600">
              {site.name} - {sub.name}
            </div>
          </div>
          <div className="text-right text-xl">
            <div className={checkpoint.scannedAt ? 'text-green-600' : 'text-gray-500'}>
              {checkpoint.scannedAt ? '✅ Completed' : '⏳ Pending'}
            </div>
            {checkpoint.scannedAt && (
              <div className="text-lg text-gray-500">
                {new Date(checkpoint.scannedAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      ))
    )}
  </>
))}
                </div>
              </div>

              {/* Evidence Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <QrCode className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-bold text-xl">{selectedPatrol.proofOfService.qrScans}</div>
                  <div className="text-xl text-gray-600">QR Code Scans</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Camera className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="font-bold text-xl">{selectedPatrol.proofOfService.photos}</div>
                  <div className="text-xl text-gray-600">Photo Evidence</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="font-bold text-xl">{selectedPatrol.proofOfService.notes}</div>
                  <div className="text-xl text-gray-600">Incident Notes</div>
                </div>
              </div>

              {/* Billing Information */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">Billing Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-xl">
                  <div><strong>Hourly Rate:</strong> ${selectedPatrol.billing.hourlyRate}/hr</div>
                  <div><strong>Total Hours:</strong> {selectedPatrol.billing.actualHours || selectedPatrol.billing.estimatedHours}h</div>
                  <div><strong>Total Amount:</strong> ${selectedPatrol.billing.actualHours ? calculatePatrolRevenue(selectedPatrol).toFixed(2) : (selectedPatrol.billing.estimatedHours * selectedPatrol.billing.hourlyRate).toFixed(2)}</div>
                  <div><strong>Status:</strong> {selectedPatrol.billing.clientInvoiced ? 'Invoiced' : 'Pending Invoice'}</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setShowProofDialog(false)}>
              Close
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                toast.info("Email functionality would be implemented here");
              }}>
                Email to Client
              </Button>
              <Button onClick={() => {
                handleExportPatrolData('pdf');
                setShowProofDialog(false);
              }}>
                Generate PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Site Management Dialog */}
      <Dialog open={showSiteManager} onOpenChange={setShowSiteManager}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Create New Site</DialogTitle>
            <DialogDescription>
              Create a major site that will contain sub-sites and checkpoints
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={siteFormData.name}
                onChange={(e) => setSiteFormData({...siteFormData, name: e.target.value})}
                placeholder="e.g., Airport Terminal Complex"
              />
            </div>
            
            <div>
              <Label htmlFor="siteAddress">Address</Label>
              <Textarea
                id="siteAddress"
                value={siteFormData.address}
                onChange={(e) => setSiteFormData({...siteFormData, address: e.target.value})}
                placeholder="Full address of the site..."
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="siteLat">Latitude</Label>
                <Input
                  id="siteLat"
                  type="number"
                  step="any"
                  value={siteFormData.coordinates.lat}
                  onChange={(e) => setSiteFormData({
                    ...siteFormData, 
                    coordinates: {...siteFormData.coordinates, lat: e.target.value}
                  })}
                  placeholder="-37.8136"
                />
              </div>
              
              <div>
                <Label htmlFor="siteLng">Longitude</Label>
                <Input
                  id="siteLng"
                  type="number"
                  step="any"
                  value={siteFormData.coordinates.lng}
                  onChange={(e) => setSiteFormData({
                    ...siteFormData, 
                    coordinates: {...siteFormData.coordinates, lng: e.target.value}
                  })}
                  placeholder="144.9631"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="siteClient">Client</Label>
              <Select value={siteFormData.clientId} onValueChange={(value: any) => setSiteFormData({...siteFormData, clientId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
  {clientsLoading && (
    <SelectItem value="loading" disabled>
      Loading clients...
    </SelectItem>
  )}

  {clientsError && (
    <SelectItem value="error" disabled>
      Failed to load clients
    </SelectItem>
  )}

  {!clientsLoading && !clientsError && clientList.length === 0 && (
    <SelectItem value="empty" disabled>
      No clients found
    </SelectItem>
  )}

  {!clientsLoading &&
    !clientsError &&
    clientList.map((client) => (
      <SelectItem key={client.id} value={client.id}>
        {client.name}
      </SelectItem>
    ))}
</SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="siteDescription">Description</Label>
              <Textarea
                id="siteDescription"
                value={siteFormData.description}
                onChange={(e) => setSiteFormData({...siteFormData, description: e.target.value})}
                placeholder="Description of the site and security requirements..."
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowSiteManager(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveSite}
              disabled={
                isCreatingSite ||
                !siteFormData.name ||
                !siteFormData.address ||
                !siteFormData.coordinates.lat ||
                !siteFormData.coordinates.lng ||
                !siteFormData.clientId
              }
            >
              {isCreatingSite ? "Creating..." : "Create Site"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sub-Site Creation Dialog */}
      <Dialog open={showSubSiteDialog} onOpenChange={setShowSubSiteDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Create Sub-Site</DialogTitle>
            <DialogDescription>
              Add a sub-site to {selectedSite?.name} with pricing and checkpoint capacity
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="subSiteName">Sub-Site Name</Label>
              <Input
                id="subSiteName"
                value={subSiteFormData.name}
                onChange={(e) => setSubSiteFormData({...subSiteFormData, name: e.target.value})}
                placeholder="e.g., Terminal 1 Main Area"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="unitPrice">Unit Price ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="unitPrice"
                    type="number"
                    value={subSiteFormData.unitPrice}
                    onChange={(e) => setSubSiteFormData({...subSiteFormData, unitPrice: e.target.value})}
                    placeholder="150"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="estimatedDuration">Est. Duration (mins)</Label>
                <div className="relative">
                  <Timer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="estimatedDuration"
                    type="number"
                    value={subSiteFormData.estimatedDuration}
                    onChange={(e) => setSubSiteFormData({...subSiteFormData, estimatedDuration: e.target.value})}
                    placeholder="60"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="subSiteDescription">Description</Label>
              <Textarea
                id="subSiteDescription"
                value={subSiteFormData.description}
                onChange={(e) => setSubSiteFormData({...subSiteFormData, description: e.target.value})}
                placeholder="Description of this sub-site area and specific requirements..."
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowSubSiteDialog(false)}>
              Cancel
            </Button>
            <Button
  onClick={handleSaveSubSite}
  disabled={isCreatingSubSite}
  className="flex items-center gap-2"
>
  {isCreatingSubSite && (
    <Loader2 className="h-4 w-4 animate-spin" />
  )}
  {isCreatingSubSite ? "Creating..." : "Create Sub-Site"}
</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Checkpoint Creation Dialog */}
      <Dialog open={showCheckpointDialog} onOpenChange={setShowCheckpointDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Create Checkpoint</DialogTitle>
            <DialogDescription>
              Add a checkpoint to {selectedSubSite?.name || selectedSite?.name} with GPS coordinates and QR code
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="checkpointName">Checkpoint Name</Label>
              <Input
                id="checkpointName"
                value={checkpointFormData.name}
                onChange={(e) => setCheckpointFormData({...checkpointFormData, name: e.target.value})}
                placeholder="e.g., Main Gate Security Point"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="checkpointLat">GPS Latitude</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="checkpointLat"
                    type="number"
                    step="any"
                    value={checkpointFormData.coordinates.lat}
                    onChange={(e) => setCheckpointFormData({
                      ...checkpointFormData, 
                      coordinates: {...checkpointFormData.coordinates, lat: e.target.value}
                    })}
                    placeholder="-37.8136"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="checkpointLng">GPS Longitude</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="checkpointLng"
                    type="number"
                    step="any"
                    value={checkpointFormData.coordinates.lng}
                    onChange={(e) => setCheckpointFormData({
                      ...checkpointFormData, 
                      coordinates: {...checkpointFormData.coordinates, lng: e.target.value}
                    })}
                    placeholder="144.9631"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="range">Verification Range (meters)</Label>
                <div className="relative">
                  <Wifi className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="range"
                    type="number"
                    value={checkpointFormData.range}
                    onChange={(e) => setCheckpointFormData({...checkpointFormData, range: e.target.value})}
                    placeholder="20"
                    className="pl-10"
                  />
                </div>
                <p className="text-lg text-gray-500 mt-1">GPS tolerance for QR scan verification</p>
              </div>
              
              <div>
                <Label htmlFor="priority">Priority Level</Label>
                <Select value={checkpointFormData.priority} onValueChange={(value: any) => setCheckpointFormData({...checkpointFormData, priority: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="checkpointDescription">Description</Label>
              <Textarea
                id="checkpointDescription"
                value={checkpointFormData.description}
                onChange={(e) => setCheckpointFormData({...checkpointFormData, description: e.target.value})}
                placeholder="Specific instructions or details for this checkpoint..."
                rows={3}
              />
            </div>

            {/* QR Code Preview */}
            {/* {checkpointFormData.name && (
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <QrCode className="h-4 w-4 text-blue-600" />
                  <span className="text-xl font-medium">Generated QR Code:</span>
                </div>
                <div className="text-xl text-gray-600 font-mono bg-white p-2 rounded border">
                  QR-{selectedSite?.name.substring(0,3).toUpperCase() || "XXX"}-{checkpointFormData.name.substring(0,2).toUpperCase() || "XX"}-{Date.now().toString().slice(-3)}
                </div>
                <p className="text-lg text-gray-500 mt-1">This QR code will be auto-generated and linked to GPS coordinates</p>
              </div>
            )} */}
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowCheckpointDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCheckpoint}
            isLoading={isCreatingCheckpoint}
            className="flex items-center gap-2"
            >
              {isCreatingCheckpoint && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Create Checkpoint
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
    </div>
  );
}