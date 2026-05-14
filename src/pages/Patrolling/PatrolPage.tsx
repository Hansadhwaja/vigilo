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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { useGetAllClientsQuery } from "@/apis/usersApi";
import { useCreatePatrolSiteMutation, useGetAllPatrolSitesQuery, useCreateSubSiteMutation, useCreateCheckpointMutation, useCreatePatrolRunMutation } from "@/apis/patrollingAPI";
import { useGetAllGuardsQuery } from "@/apis/guardsApi";
import { useGetAllOrdersQuery } from "@/apis/ordersApi";
import {
  useDeletePatrolSiteMutation,
  useDeletePatrolSubSiteMutation,
  useDeleteCheckpointMutation,
  useDeletePatrolRunMutation,
  useGetAllPatrolRunsForAdminQuery,
  useGetPatrolRunByIdForAdminQuery,
  useLazyDownloadQRQuery,
  useLazyDownloadSiteQRsPdfQuery

} from "@/apis/patrollingAPI";
import { getStatusStyle } from "@/utils/statusColors";
import { useNavigate, useParams } from "react-router-dom";
import CustomHeader from "@/components/common/Header/CustomHeader";
import PatrollingStats from "@/components/Patrolling/PatrollingStats";
import PatrollingSearchFilters from "@/components/Patrolling/PatrollingSearchFilers";
import CreatePatrolModal from "@/components/Patrolling/Modal/CreatePatrolModal";

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



export default function PatrolPage() {
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



  const [createSubSite, { isLoading: isCreatingSubSite }] =
    useCreateSubSiteMutation();

  const [createCheckpoint, { isLoading: isCreatingCheckpoint }] =
    useCreateCheckpointMutation();

  const [createPatrolRun, { isLoading: isCreating }] =
    useCreatePatrolRunMutation();



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
  } = useGetAllPatrolRunsForAdminQuery({
    page: 1,
    limit: 10,
    status: "",
    search: "",
  });

  const patrols = patrolResponse?.data || []

  // const [subSiteFormData, setSubSiteFormData] = useState({
  //   name: "",
  //   unitPrice: "",
  //   description: "",
  //   estimatedDuration: ""
  // });

  // const [checkpointFormData, setCheckpointFormData] = useState({
  //   name: "",
  //   coordinates: { lat: "", lng: "" },
  //   range: "20",
  //   description: "",
  //   priority: "medium"
  // });

  // Enhanced available sites with comprehensive structure


  // const selectedSites = useMemo(
  //   () =>
  //     formData.siteIds
  //       .map((siteId) => availableSites.find((site) => site.id === siteId))
  //       .filter(Boolean) as any[],
  //   [formData.siteIds, availableSites]
  // );

  // const getTotalCheckpointsForSite = (site: any) => {
  //   const siteLevelCheckpoints = site.checkpoints?.length || 0;
  //   const subSiteCheckpoints = (site.subsites || []).reduce(
  //     (total: number, subsite: any) => total + (subsite.checkpoints?.length || 0),
  //     0
  //   );

  //   return siteLevelCheckpoints + subSiteCheckpoints;
  // };

  // Enhanced GPS tracking simulation
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     patrols.forEach(patrol => {
  //       if (patrol.status === "Active") {
  //         // Simulate GPS updates for active patrols
  //         setLiveTracking(prev => ({
  //           ...prev,
  //           [patrol.id]: {
  //             currentLocation: patrol.currentLocation,
  //             lastUpdate: new Date(),
  //             speed: Math.floor(Math.random() * 60) + 20, // 20-80 km/h
  //             heading: Math.floor(Math.random() * 360),
  //             gpsSignal: Math.random() > 0.1 ? "Strong" : "Weak",
  //             etaToNext: Math.floor(Math.random() * 15) + 5 // 5-20 minutes
  //           }
  //         }));
  //       }
  //     });
  //   }, 30000); // Update every 30 seconds

  //   return () => clearInterval(interval);
  // }, [patrols]);

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

  // const handleDeleteSite = async (siteId: string) => {
  //   try {
  //     await deleteSiteApi(siteId).unwrap();

  //     setFormData((prev) => ({
  //       ...prev,
  //       siteIds: prev.siteIds.filter((id) => id !== siteId),
  //     }));

  //     toast.success("Site deleted successfully");
  //   } catch (error: any) {
  //     toast.error(error?.data?.message || "Failed to delete site");
  //   }
  // };

  // const handleDeleteSubSite = async (subSiteId: string) => {
  //   try {
  //     await deleteSubSiteApi(subSiteId).unwrap();
  //     toast.success("Sub-site deleted successfully");
  //   } catch (error: any) {
  //     toast.error(error?.data?.message || "Failed to delete sub-site");
  //   }
  // };

  // const handleDeleteCheckpoint = async (checkpointId: string) => {
  //   try {
  //     await deleteCheckpointApi(checkpointId).unwrap();
  //     toast.success("Checkpoint deleted successfully");
  //   } catch (error: any) {
  //     toast.error(error?.data?.message || "Failed to delete checkpoint");
  //   }
  // };

  // Calculate enhanced metrics
  // const metrics = useMemo(() => {
  //   const activePatrols = Patrols.filter(p => p.status === "Active").length;
  //   const scheduledPatrols = patrols.filter(p => p.status === "Scheduled").length;
  //   const completedToday = patrols.filter(p => p.status === "Completed" &&
  //     new Date(p.actualEndTime || p.estimatedCompletion).toDateString() === new Date().toDateString()).length;
  //   const totalCheckpoints = patrols.reduce((sum, p) => sum + p.totalCheckpoints, 0);
  //   const completedCheckpoints = patrols.reduce((sum, p) => sum + p.completedCheckpoints, 0);
  //   const completionRate = totalCheckpoints > 0 ? Math.round((completedCheckpoints / totalCheckpoints) * 100) : 0;

  //   // Revenue calculations
  //   const dailyRevenue = patrols
  //     .filter(p => p.status === "Completed" && p.billing.actualHours)
  //     .reduce((sum, p) => sum + calculatePatrolRevenue(p), 0);

  //   const routeDeviations = patrols.filter(p => p.routeDeviation).length;
  //   const onTimeCompletion = patrols.filter(
  //     (p) =>
  //       p.status === "Completed" &&
  //       p.actualEndTime &&
  //       new Date(p.actualEndTime) <= new Date(p.estimatedCompletion)
  //   ).length;

  //   return {
  //     activePatrols,
  //     scheduledPatrols,
  //     completedToday,
  //     completionRate,
  //     dailyRevenue,
  //     routeDeviations,
  //     onTimeCompletion
  //   };
  // }, [patrols]);

  // Filter patrols
  // const filteredPatrols = patrols.filter(patrol => {
  //   const matchesStatus = filterStatus === "all" || patrol.status.toLowerCase() === filterStatus.toLowerCase();
  //   const matchesSearch = !searchTerm ||
  //     patrol.guardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     patrol.patrolId.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     patrol.clientName.toLowerCase().includes(searchTerm.toLowerCase());

  //   return matchesStatus && matchesSearch;
  // });

  // const handleCreatePatrol = () => {
  //   setFormData({
  //     patrolId: crypto.randomUUID(),
  //     orderId: "", // Placeholder for order association
  //     guardIds: [],
  //     vehicleId: "",
  //     startDateTime: "",
  //     estimatedCompletion: "",
  //     siteIds: [],
  //     notes: "",
  //     unitPrice: 0
  //   });
  //   setShowCreateDialog(true);
  // };

  // const handleSavePatrol = async () => {
  //   try {
  //     if (
  //       !formData.guardIds ||
  //       !formData.vehicleId ||
  //       formData.siteIds.length === 0
  //     ) {
  //       toast.error("Please fill all required fields");
  //       return;
  //     }

  //     const payload = {
  //       orderId: formData.orderId,
  //       patrolId: formData.patrolId,
  //       guardIds: formData.guardIds,
  //       unitPrice: formData.unitPrice,
  //       vehicleId: formData.vehicleId,
  //       startDateTime: new Date(formData.startDateTime).toISOString(),
  //       estimatedCompletion: new Date(formData.estimatedCompletion).toISOString(),
  //       description: formData.notes || "",
  //       siteIds: formData.siteIds,
  //     };

  //     const response = await createPatrolRun(payload).unwrap();

  //     toast.success("Patrol created successfully", {
  //       description: `Patrol ID: ${response?.data?.patrol?.patrolId}`,
  //     });

  //     // Reset form
  //     setFormData({
  //       patrolId: "",
  //       orderId: "",
  //       guardIds: [],
  //       vehicleId: "",
  //       startDateTime: "",
  //       estimatedCompletion: "",
  //       notes: "",
  //       unitPrice: 0,
  //       siteIds: [],
  //     });

  //     setShowCreateDialog(false);

  //   } catch (error: any) {
  //     console.error(error);
  //     toast.error(
  //       error?.data?.message || "Failed to create patrol"
  //     );
  //   }
  // };

  // Enhanced patrol operations
  // const handleStartPatrol = useCallback((patrol: any) => {
  //   const updatedPatrol = {
  //     ...patrol,
  //     status: "Active",
  //     actualStartTime: new Date().toISOString(),
  //     currentLocation: "Route started"
  //   };

  //   setPatrols(prev => prev.map(p => p.id === patrol.id ? updatedPatrol : p));

  //   toast.success(`Patrol ${patrol.patrolId} started`, {
  //     description: `Guard ${patrol.guardName} is now en route`
  //   });
  // }, []);

  // const handleCompletePatrol = useCallback((patrol: any) => {
  //   const actualHours = patrol.actualStartTime ?
  //     (new Date().getTime() - new Date(patrol.actualStartTime).getTime()) / (1000 * 60 * 60) :
  //     patrol.billing.estimatedHours;

  //   const updatedPatrol = {
  //     ...patrol,
  //     status: "Completed",
  //     actualEndTime: new Date().toISOString(),
  //     completedCheckpoints: patrol.totalCheckpoints, // Auto-complete for demo
  //     billing: {
  //       ...patrol.billing,
  //       actualHours: Math.round(actualHours * 10) / 10,
  //       clientInvoiced: false
  //     }
  //   };

  //   setPatrols(prev => prev.map(p => p.id === patrol.id ? updatedPatrol : p));

  //   const revenue = calculatePatrolRevenue(updatedPatrol);
  //   toast.success(`Patrol ${patrol.patrolId} completed`, {
  //     description: `Duration: ${updatedPatrol.billing.actualHours}h | Revenue: ${revenue.toFixed(2)}`
  //   });
  // }, []);

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

  // const handleSimulateQRScan = (checkpoint: any, patrol: any) => {
  //   // Simulate QR code scanning
  //   const updatedCheckpoint = {
  //     ...checkpoint,
  //     status: "completed",
  //     scannedAt: new Date().toISOString(),
  //     arrivalTime: new Date().toISOString()
  //   };

  //   toast.success(`QR Code scanned: ${checkpoint.name}`, {
  //     description: `Checkpoint verified for patrol ${patrol.patrolId}`
  //   });

  //   setShowQRDialog(false);
  // };

  // const handleGenerateProofOfService = async (patrol: any) => {
  //   try {
  //     if (!getPatrolById) {
  //       toast.error("Patrol data not available");
  //       return;
  //     }

  //     const transformedData = transformPatrolForProof(getPatrolById);

  //     setSelectedPatrol(transformedData);
  //     setShowProofDialog(true);
  //   } catch (error: any) {
  //     toast.error(error?.data?.message || "Failed to fetch patrol details");
  //   }
  // };

  // const handleExportPatrolData = async (format: 'csv' | 'pdf') => {
  //   if (format === 'csv') {
  //     exportCSV();
  //   } else {
  //     await exportPDF();
  //   }

  //   setShowExportDialog(false);
  // };


  // const exportCSV = () => {
  //   if (!Patrols.length) {
  //     toast.error("No patrol data available");
  //     return;
  //   }

  //   const exportData = Patrols.map((patrol) => {
  //     const guardNames = patrol.guards?.length
  //       ? patrol.guards.map((g: any) => g.name).join(" | ")
  //       : "No Guard Assigned";

  //     return {
  //       "Patrol ID": patrol.patrolId,
  //       "Status": patrol.status,
  //       "Vehicle ID": patrol.vehicleId,
  //       "Client Name": patrol.clientName,
  //       "Client Email": patrol.clientEmail,
  //       "Location": patrol.locationName,
  //       "Order Start Date": new Date(patrol.orderStartDate).toLocaleDateString(),
  //       "Order Start Time": patrol.orderStartTime,
  //       "Order Status": patrol.orderStatus,
  //       "Start DateTime": new Date(patrol.startDateTime).toLocaleString(),
  //       "Estimated Completion": new Date(patrol.estimatedCompletion).toLocaleString(),
  //       "Total Sites": patrol.totalSites,
  //       "Completed Sites": patrol.completedSites,
  //       "Total SubSites": patrol.totalSubSites,
  //       "Completed SubSites": patrol.completedSubSites,
  //       "Total Checkpoints": patrol.totalCheckpoints,
  //       "Completed Checkpoints": patrol.completedCheckpoints,
  //       "Completion %": patrol.completionPercentage,
  //       "Route Deviation": patrol.hasDeviation ? "Yes" : "No",
  //       "Guards": guardNames,
  //     };
  //   });

  //   // CSV with proper escaping
  //   const headers = Object.keys(exportData[0]);

  //   const csvRows = [
  //     headers.join(","),
  //     ...exportData.map(row =>
  //       headers
  //         .map(field => `"${String((row as Record<string, any>)[field]).replace(/"/g, '""')}"`)
  //         .join(",")
  //     )
  //   ];

  //   const blob = new Blob([csvRows.join("\n")], {
  //     type: "text/csv;charset=utf-8;",
  //   });

  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = `patrol-export-${new Date().toISOString().slice(0, 10)}.csv`;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  //   URL.revokeObjectURL(url);

  //   toast.success("CSV export completed");
  // };
  // const exportPDF = async () => {
  //   if (!Patrols.length) {
  //     toast.error("No patrol data available");
  //     return;
  //   }

  //   const doc = new jsPDF();
  //   let y = 20;

  //   doc.setFontSize(16);
  //   doc.text("Patrol Proof of Service Report", 14, y);
  //   y += 10;

  //   doc.setFontSize(10);

  //   Patrols.forEach((patrol, index) => {
  //     const guardNames = patrol.guards?.length
  //       ? patrol.guards.map((g: any) => g.name).join(" | ")
  //       : "No Guard Assigned";

  //     doc.setFont("", "bold");
  //     doc.text(`Patrol ID: ${patrol.patrolId}`, 14, y);
  //     doc.setFont("", "normal");
  //     y += 6;

  //     doc.text(`Client: ${patrol.clientName}`, 14, y);
  //     y += 6;

  //     doc.text(`Location: ${patrol.locationName}`, 14, y);
  //     y += 6;

  //     doc.text(`Vehicle: ${patrol.vehicleId}`, 14, y);
  //     y += 6;

  //     doc.text(`Guards: ${guardNames}`, 14, y);
  //     y += 6;

  //     doc.text(`Status: ${patrol.status}`, 14, y);
  //     y += 6;

  //     doc.text(
  //       `Checkpoints: ${patrol.completedCheckpoints}/${patrol.totalCheckpoints}`,
  //       14,
  //       y
  //     );
  //     y += 6;

  //     doc.text(`Completion: ${patrol.completionPercentage}%`, 14, y);
  //     y += 6;

  //     doc.text(
  //       `Route Deviation: ${patrol.hasDeviation ? "Yes" : "No"}`,
  //       14,
  //       y
  //     );
  //     y += 8;

  //     doc.line(14, y, 195, y);
  //     y += 10;

  //     if (y > 270) {
  //       doc.addPage();
  //       y = 20;
  //     }
  //   });

  //   doc.save(`patrol-proof-${new Date().toISOString().slice(0, 10)}.pdf`);

  //   toast.success("PDF exported successfully");
  // };

  const handleViewDetails = (patrolId: string) => {
    navigate(`/patrol/${patrolId}`);
  };

  // const handleViewQR = (checkpoint: any) => {
  //   setSelectedCheckpoint(checkpoint);
  //   setShowQRDialog(true);
  // };

  // const downloadSiteQRPdf = async (site: any) => {
  //   if (!site?.id) {
  //     toast.error("Site ID is missing");
  //     return;
  //   }

  //   try {
  //     const blob = await triggerDownloadSitePdf({ siteId: site.id }).unwrap();
  //     const objectUrl = URL.createObjectURL(blob);

  //     const safeName = (site.name || "site").replace(/[^a-zA-Z0-9-_ ]/g, "").trim();
  //     const fileName = `${safeName || "site"}-qr.pdf`;

  //     const link = document.createElement("a");
  //     link.href = objectUrl;
  //     link.download = fileName;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);

  //     URL.revokeObjectURL(objectUrl);
  //     toast.success("Site QR PDF downloaded");
  //   } catch (error) {
  //     console.error("Site QR PDF download failed", error);
  //     toast.error("Failed to download site QR PDF");
  //   }
  // };

  // const downloadQR = async (url: string, name: string) => {
  //   if (!url) {
  //     toast.error("QR image URL is missing");
  //     return;
  //   }

  //   try {
  //     const safeName = (name || "checkpoint").replace(/[^a-zA-Z0-9-_ ]/g, "").trim();
  //     const fileName = `${safeName || "checkpoint"}-QR.svg`;

  //     const blob = await triggerDownloadQR({ url, name: safeName || "checkpoint" }).unwrap();

  //     const objectUrl = URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.href = objectUrl;
  //     link.download = fileName;

  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     URL.revokeObjectURL(objectUrl);

  //     toast.success("QR downloaded successfully");
  //   } catch (error) {
  //     console.error("QR download failed", error);
  //     toast.error("QR download blocked by server CORS policy");
  //   }
  // };

  // const handleCreateSite = () => {
  //   setSiteFormData({
  //     name: "",
  //     address: "",
  //     coordinates: { lat: "", lng: "" },
  //     clientId: "",
  //     description: ""
  //   });
  //   setSelectedSite(null);
  //   setShowSiteManager(true);
  // };

  // const handleSaveSite = async () => {
  //   try {
  //     // Basic validation
  //     if (
  //       !siteFormData.name ||
  //       !siteFormData.address ||
  //       !siteFormData.coordinates.lat ||
  //       !siteFormData.coordinates.lng ||
  //       !siteFormData.clientId
  //     ) {
  //       alert("Please fill all required fields");
  //       return;
  //     }

  //     const payload = {
  //       name: siteFormData.name,
  //       address: siteFormData.address,
  //       latitude: Number(siteFormData.coordinates.lat),
  //       longitude: Number(siteFormData.coordinates.lng),
  //       clientId: siteFormData.clientId,
  //       description: siteFormData.description || undefined,
  //     };

  //     const response = await createPatrolSite(payload).unwrap();

  //     console.log("Site created:", response);

  //     // ✅ Close dialog
  //     setShowSiteManager(false);

  //     // ✅ Reset form
  //     setSiteFormData({
  //       name: "",
  //       address: "",
  //       coordinates: { lat: "", lng: "" },
  //       clientId: "",
  //       description: "",
  //     });

  //   } catch (error) {
  //     console.error("Create site failed:", error);
  //   }
  // };

  // const handleAddSubSite = (siteId: string) => {
  //   const site = availableSites.find(s => s.id === siteId);
  //   setSelectedSite(site);
  //   setSubSiteFormData({
  //     name: "",
  //     unitPrice: "",
  //     description: "",
  //     estimatedDuration: ""
  //   });
  //   setShowSubSiteDialog(true);
  // };

  // const handleSaveSubSite = async () => {
  //   if (!selectedSite) {
  //     toast.error("No site selected");
  //     return;
  //   }

  //   // Basic validation
  //   if (!subSiteFormData.name.trim()) {
  //     toast.error("Sub-site name is required");
  //     return;
  //   }

  //   try {
  //     const payload = {
  //       siteId: selectedSite.id,
  //       name: subSiteFormData.name,
  //       unitPrice: Number(subSiteFormData.unitPrice),
  //       estimatedDuration: Number(subSiteFormData.estimatedDuration),
  //       description: subSiteFormData.description,
  //     };

  //     const response = await createSubSite(payload).unwrap();

  //     toast.success(response.message || "Sub-site created successfully");

  //     // Close dialog
  //     setShowSubSiteDialog(false);

  //     // Reset form
  //     setSubSiteFormData({
  //       name: "",
  //       unitPrice: "",
  //       description: "",
  //       estimatedDuration: "",
  //     });

  //   } catch (error: any) {
  //     toast.error(
  //       error?.data?.message || "Failed to create sub-site"
  //     );
  //   }
  // };

  // const handleAddCheckpoint = (
  //   siteId: string,
  //   subSiteId?: string
  // ) => {
  //   const site = availableSites.find(s => s.id === siteId);

  //   const subSite = subSiteId
  //     ? site?.subsites.find(ss => ss.id === subSiteId)
  //     : undefined;

  //   setSelectedSite(site);
  //   setSelectedSubSite(subSite);

  //   setCheckpointFormData({
  //     name: "",
  //     coordinates: { lat: "", lng: "" },
  //     range: "20",
  //     description: "",
  //     priority: "medium"
  //   });

  //   setShowCheckpointDialog(true);
  // };

  // const handleSaveCheckpoint = async () => {
  //   if (!selectedSite) return;

  //   try {
  //     const payload: any = {
  //       name: checkpointFormData.name,
  //       latitude: Number(checkpointFormData.coordinates.lat),
  //       longitude: Number(checkpointFormData.coordinates.lng),
  //       verificationRange: Number(checkpointFormData.range),
  //       priorityLevel: checkpointFormData.priority,
  //       description: checkpointFormData.description,
  //     };

  //     // 🔥 Decide automatically
  //     if (selectedSubSite) {
  //       payload.subSiteId = selectedSubSite.id;
  //     } else {
  //       payload.siteId = selectedSite.id;
  //     }

  //     await createCheckpoint(payload).unwrap();

  //     toast.success("Checkpoint created successfully");

  //     setShowCheckpointDialog(false);
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to create checkpoint");
  //   }
  // };

  // const handleAddSiteToPatrol = (site: any) => {
  //   setFormData(prev => {
  //     if (prev.siteIds.includes(site.id)) {
  //       return prev;
  //     }

  //     return {
  //       ...prev,
  //       siteIds: [...prev.siteIds, site.id],
  //     };
  //   });

  //   toast.success("Site added to patrol", {
  //     description: `${site.name} with ${site.subsites.length} sub-sites added`
  //   });
  // };

  // const toggleSiteSelection = (site: any) => {
  //   setFormData((prev) => {
  //     const alreadySelected = prev.siteIds.includes(site.id);

  //     return {
  //       ...prev,
  //       siteIds: alreadySelected
  //         ? prev.siteIds.filter((id) => id !== site.id)
  //         : [...prev.siteIds, site.id],
  //     };
  //   });
  // };

  // const generateQRCodeForCheckpoint = (checkpoint: any) => {

  //   console.log("CHECKPOINT DATA 👉", checkpoint);

  //   const qrData = {
  //     checkpointId: checkpoint.id,

  //     qrId: checkpoint.qr?.id ?? null,
  //     qrCode: checkpoint.qr?.qrUrl ?? null,

  //     latitude:
  //       checkpoint.qr?.latitude ??
  //       checkpoint.latitude ??
  //       null,

  //     longitude:
  //       checkpoint.qr?.longitude ??
  //       checkpoint.longitude ??
  //       null,
  //     name: checkpoint.name,

  //     range: checkpoint.verificationRange ?? null,

  //     timestamp: new Date().toISOString(),
  //   };

  //   navigator.clipboard
  //     .writeText(JSON.stringify(qrData, null, 2))
  //     .then(() => {
  //       toast.success("QR code data copied", {
  //         description:
  //           "QR code information copied to clipboard for printing",
  //       });
  //     });
  // };

  // const handleQrIconAction = (checkpoint: any) => {
  //   generateQRCodeForCheckpoint(checkpoint);

  //   const qrUrl = checkpoint.qr?.qrUrl;
  //   if (!qrUrl) {
  //     toast.error("QR not available");
  //     return;
  //   }

  //   setQrPreview({
  //     url: qrUrl,
  //     name: checkpoint.name || "checkpoint",
  //   });
  // };

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case "pending":
  //       return "bg-yellow-100 text-yellow-800";
  //     case "Scheduled":
  //       return "bg-blue-100 text-blue-800";
  //     case "Completed":
  //       return "bg-gray-100 text-gray-800";
  //     case "Cancelled":
  //       return "bg-red-100 text-red-800";
  //     default:
  //       return "bg-gray-100 text-gray-800";
  //   }
  // };

  // const getCheckpointStatusColor = (status: string) => {
  //   switch (status) {
  //     case "completed":
  //       return "bg-green-100 text-green-800";
  //     case "pending":
  //       return "bg-yellow-100 text-yellow-800";
  //     case "overdue":
  //       return "bg-red-100 text-red-800";
  //     default:
  //       return "bg-gray-100 text-gray-800";
  //   }
  // };

  return (
    <div className="space-y-6 overflow-y-auto min-w-0 min-h-0 h-full">
      <CustomHeader
        title="Patrol Management"
        description="QR Scanning, Real-time Tracking & Proof of Service"
        others={
          <div className="flex justify-end gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>

            <CreatePatrolModal />
          </div>
        }
      />
      <PatrollingStats />
      <PatrollingSearchFilters />
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-lg">Patrol Operations</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">

            {patrols.map((patrol) => (
              <Card
                key={patrol.id}
                className="border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">

                      {/* Patrol Info */}
                      <div>
                        <div className="font-medium text-gray-900 max-w-50 truncate pt-2 ">
                          {patrol.patrolId}
                        </div>

                        <div className="text-xl text-gray-600">
                          {patrol.clientName || "No Guard Assigned"}
                        </div>

                        <div className="flex items-center gap-1 mt-1">
                          <Car className="h-5 w-5 text-gray-400" />
                          <span className="text-lg text-gray-600 max-w-50 truncate">
                            {patrol.vehicleId || "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* Client & Location */}
                      <div>
                        <div className="text-xl text-gray-900 max-w-50 truncate">
                          {patrol.clientName}
                        </div>

                        <div className="flex items-center gap-1">
                          <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
                          <span className="text-lg text-gray-600 max-w-75 truncate">
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
                              // onClick={() => handleGenerateProofOfService(patrol)}
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


          </div>
        </CardContent>
      </Card>
    </div>
  );
}