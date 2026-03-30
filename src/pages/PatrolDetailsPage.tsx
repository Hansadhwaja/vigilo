"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
import { toast } from "react-hot-toast";
import jsPDF from "jspdf";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import {
  Activity,
  ArrowLeft,
  MapPin,
  Clock,
  User,
  CheckCircle,
  AlertTriangle,
  Shield,
  RefreshCw,
  FileText,
  Flag,
  Mail,
  Phone,
  Eye,
  Navigation,
  ChevronDown,
  ChevronUp,
  Edit,
} from "lucide-react";
import {
  useEditPatrolRunMutation,
  EditPatrolRunRequest,
  useGetAllPatrolSitesQuery,
  useGetPatrolRunByIdForAdminQuery,
  useLazyDownloadSiteQRsPdfQuery,
} from "../apis/patrollingAPI";
import { useGetAllGuardsQuery } from "../apis/guardsApi";

export default function PatrolDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, refetch } =
    useGetPatrolRunByIdForAdminQuery(id as string, {
      skip: !id,
    });

  const [editPatrolRun, { isLoading: isUpdatingPatrol }] =
    useEditPatrolRunMutation();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    startDateTime: "",
    estimatedCompletion: "",
    addSites: [] as string[],
    addSubSites: [] as Array<{
      parentSiteId: string;
      subSiteId: string;
    }>,
    addCheckpoints: [] as Array<{
      parentType: "site" | "subSite";
      parentId: string;
      checkpointId: string;
    }>,
    removeSiteIds: [] as string[],
    removeSubSiteIds: [] as string[],
    removeCheckpointIds: [] as string[],
    updateSites: {} as Record<
      string,
      {
        name: string;
        address: string;
        latitude: string;
        longitude: string;
        description: string;
        // status: string;
      }
    >,
    updateSubSites: {} as Record<
      string,
      {
        name: string;
        description: string;
        // status: string;
        unitPrice: string;
        estimatedDuration: string;
        latitude: string;
        longitude: string;
      }
    >,
    updateCheckpoints: {} as Record<
      string,
      {
        name: string;
        latitude: string;
        longitude: string;
        verificationRange: string;
        priorityLevel: "low" | "medium" | "high";
        description: string;
        // status: string;
      }
    >,
    guardIds: [] as string[],
  });

  const [triggerDownloadSitePdf] = useLazyDownloadSiteQRsPdfQuery();
  const { data: allSitesResponse } = useGetAllPatrolSitesQuery(
    { page: 1, limit: 200 },
    { skip: !showEditDialog }
  );

  const { data: allGuardsResponse } = useGetAllGuardsQuery(
    { page: 1, limit: 200 },
    { skip: !showEditDialog }
  );

  const patrolData = data?.data;
  const patrol = patrolData?.patrol;
  console.log("Patrol Data:", patrolData);
  const order = patrolData?.order;
  const client = patrolData?.client;
  const guards = patrolData?.guards || [];
  const sites = patrolData?.sites || [];
  const allSites = allSitesResponse?.data || [];
  const allGuards = allGuardsResponse?.data || [];

  const [showExportDialog, setShowExportDialog] = useState(false);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [openSites, setOpenSites] = useState<{ [key: string]: boolean }>({});
  const toggleOpen = (siteId: string) => {
  setOpenSites((prev) => ({
    ...prev,
    [siteId]: !prev[siteId],
  }));
};

  const handleDownloadSiteQR = async (site: any) => {
  if (!site?.id) {
    toast.error("Site ID missing");
    return;
  }

  try {
    const blob = await triggerDownloadSitePdf({ siteId: site.id }).unwrap();

    const url = URL.createObjectURL(blob);

    const safeName = (site.name || "site")
      .replace(/[^a-zA-Z0-9-_ ]/g, "")
      .trim();

    const fileName = `${safeName || "site"}-qr.pdf`;

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    toast.success("QR PDF downloaded");
  } catch (err) {
    console.error(err);
    toast.error("Download failed");
  }
};

  const toggleSelection = (key: "addSites" | "removeSiteIds" | "removeSubSiteIds" | "removeCheckpointIds", value: string) => {
    setEditForm((prev) => {
      const exists = prev[key].includes(value);
      return {
        ...prev,
        [key]: exists ? prev[key].filter((id) => id !== value) : [...prev[key], value],
      };
    });
  };

  const toggleAddSubSite = (parentSiteId: string, subSiteId: string) => {
    setEditForm((prev) => {
      const exists = prev.addSubSites.some(
        (item) => item.parentSiteId === parentSiteId && item.subSiteId === subSiteId
      );

      return {
        ...prev,
        addSubSites: exists
          ? prev.addSubSites.filter(
              (item) => !(item.parentSiteId === parentSiteId && item.subSiteId === subSiteId)
            )
          : [...prev.addSubSites, { parentSiteId, subSiteId }],
      };
    });
  };

  const toggleAddCheckpoint = (
    parentType: "site" | "subSite",
    parentId: string,
    checkpointId: string
  ) => {
    setEditForm((prev) => {
      const exists = prev.addCheckpoints.some(
        (item) =>
          item.parentType === parentType &&
          item.parentId === parentId &&
          item.checkpointId === checkpointId
      );

      return {
        ...prev,
        addCheckpoints: exists
          ? prev.addCheckpoints.filter(
              (item) =>
                !(
                  item.parentType === parentType &&
                  item.parentId === parentId &&
                  item.checkpointId === checkpointId
                )
            )
          : [...prev.addCheckpoints, { parentType, parentId, checkpointId }],
      };
    });
  };

  const toggleGuardSelection = (guardId: string) => {
    setEditForm((prev) => {
      const exists = prev.guardIds.includes(guardId);
      return {
        ...prev,
        guardIds: exists
          ? prev.guardIds.filter((id) => id !== guardId)
          : [...prev.guardIds, guardId],
      };
    });
  };

  const resetEditForm = () => {
    setEditForm({
      startDateTime: "",
      estimatedCompletion: "",
      addSites: [],
      addSubSites: [],
      addCheckpoints: [],
      removeSiteIds: [],
      removeSubSiteIds: [],
      removeCheckpointIds: [],
      updateSites: {},
      updateSubSites: {},
      updateCheckpoints: {},
      guardIds: [],
    });
  };

  const toDateTimeLocalValue = (dateString?: string | null) => {
    if (!dateString) return "";

    const parsedDate = new Date(dateString);
    if (Number.isNaN(parsedDate.getTime())) return "";

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    const hours = String(parsedDate.getHours()).padStart(2, "0");
    const minutes = String(parsedDate.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const parseNumberField = (value: string) => {
    if (value === "") return undefined;
    const parsedValue = Number(value);
    return Number.isNaN(parsedValue) ? undefined : parsedValue;
  };

  const handleOpenEditDialog = () => {
    const siteUpdates = Object.fromEntries(
      sites.map((site: any) => [
        site.id,
        {
          name: site.name || "",
          address: site.address || "",
          latitude: String(site.latitude ?? ""),
          longitude: String(site.longitude ?? ""),
          description: site.description || "",
          status: site.status || "pending",
        },
      ])
    );

    const subSiteUpdates = Object.fromEntries(
      sites.flatMap((site: any) =>
        (site.subSites || []).map((sub: any) => [
          sub.id,
          {
            name: sub.name || "",
            description: sub.description || "",
            status: sub.status || "pending",
            unitPrice: String(sub.unitPrice ?? ""),
            estimatedDuration: String(sub.estimatedDuration ?? ""),
            latitude: String(sub.latitude ?? ""),
            longitude: String(sub.longitude ?? ""),
          },
        ])
      )
    );

    const checkpointUpdates = Object.fromEntries(
      sites.flatMap((site: any) => {
        const siteCheckpoints = (site.checkpoints || []).map((cp: any) => [
          cp.id,
          {
            name: cp.name || "",
            latitude: String(cp.latitude ?? ""),
            longitude: String(cp.longitude ?? ""),
            verificationRange: String(cp.verificationRange ?? ""),
            priorityLevel: (cp.priorityLevel || "low") as "low" | "medium" | "high",
            description: cp.description || "",
            status: cp.status || "pending",
          },
        ]);

        const subSiteCheckpoints = (site.subSites || []).flatMap((sub: any) =>
          (sub.checkpoints || []).map((cp: any) => [
            cp.id,
            {
              name: cp.name || "",
              latitude: String(cp.latitude ?? ""),
              longitude: String(cp.longitude ?? ""),
              verificationRange: String(cp.verificationRange ?? ""),
              priorityLevel: (cp.priorityLevel || "low") as "low" | "medium" | "high",
              description: cp.description || "",
              status: cp.status || "pending",
            },
          ])
        );

        return [...siteCheckpoints, ...subSiteCheckpoints];
      })
    );

    setEditForm({
      startDateTime: toDateTimeLocalValue(patrol?.startTime),
      estimatedCompletion: toDateTimeLocalValue(patrol?.estimatedCompletion),
      addSites: [],
      addSubSites: [],
      addCheckpoints: [],
      removeSiteIds: [],
      removeSubSiteIds: [],
      removeCheckpointIds: [],
      updateSites: siteUpdates,
      updateSubSites: subSiteUpdates,
      updateCheckpoints: checkpointUpdates,
      guardIds: guards.map((guard: any) => guard.id),
    });
    setShowEditDialog(true);
  };

  const handleSubmitEdit = async () => {
    if (!id) return;

    try {
      const updateSitesPayload = Object.entries(editForm.updateSites).map(
        ([siteId, site]) => ({
          siteId,
          ...site,
          latitude: parseNumberField(site.latitude),
          longitude: parseNumberField(site.longitude),
        })
      );

      const updateSubSitesPayload = Object.entries(editForm.updateSubSites).map(
        ([subSiteId, subSite]) => ({
          subSiteId,
          ...subSite,
          unitPrice: parseNumberField(subSite.unitPrice),
          estimatedDuration: parseNumberField(subSite.estimatedDuration),
          latitude: parseNumberField(subSite.latitude),
          longitude: parseNumberField(subSite.longitude),
        })
      );

      const updateCheckpointsPayload = Object.entries(editForm.updateCheckpoints).map(
        ([checkpointId, checkpoint]) => ({
          checkpointId,
          ...checkpoint,
          latitude: parseNumberField(checkpoint.latitude),
          longitude: parseNumberField(checkpoint.longitude),
          verificationRange: parseNumberField(checkpoint.verificationRange),
        })
      );

      const payload: EditPatrolRunRequest = {
        ...(editForm.startDateTime ? { startDateTime: editForm.startDateTime } : {}),
        ...(editForm.estimatedCompletion
          ? { estimatedCompletion: editForm.estimatedCompletion }
          : {}),
        ...(editForm.addSites.length ? { addSites: editForm.addSites } : {}),
        ...(editForm.removeSiteIds.length
          ? { removeSiteIds: editForm.removeSiteIds }
          : {}),
        ...(editForm.addSubSites.length ? { addSubSites: editForm.addSubSites } : {}),
        ...(editForm.removeSubSiteIds.length
          ? { removeSubSiteIds: editForm.removeSubSiteIds }
          : {}),
        ...(editForm.addCheckpoints.length
          ? { addCheckpoints: editForm.addCheckpoints }
          : {}),
        ...(editForm.removeCheckpointIds.length
          ? { removeCheckpointIds: editForm.removeCheckpointIds }
          : {}),
        ...(updateSitesPayload.length ? { updateSites: updateSitesPayload } : {}),
        ...(updateSubSitesPayload.length
          ? { updateSubSites: updateSubSitesPayload }
          : {}),
        ...(updateCheckpointsPayload.length
          ? { updateCheckpoints: updateCheckpointsPayload }
          : {}),
        ...(editForm.guardIds.length ? { guardIds: editForm.guardIds } : {}),
      };

      await editPatrolRun({
        patrolRunId: id,
        body: payload,
      }).unwrap();

      toast.success("Patrol run updated successfully");
      setShowEditDialog(false);
      resetEditForm();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update patrol run");
    }
  };

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!patrol) return <div className="p-6">No data found.</div>;

  const formatDate = (date?: string | null) =>
    date ? new Date(date).toLocaleString() : "-";

  const statusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "missed":
        return "bg-red-100 text-red-700";
      case "absent":
        return "bg-red-100 text-red-800";  
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setViewerOpen(true);
  };

  const formatDateOnly = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const allSubSitesFromMaster = allSites.flatMap((site: any) =>
  (site.subSites || []).map((sub: any) => ({
    id: sub.id,
    name: sub.name,
    siteName: site.name,
  }))
);

const allCheckpointsFromMaster = allSites.flatMap((site: any) => {
  const siteCheckpoints = (site.checkpoints || []).map((cp: any) => ({
    id: cp.id,
    name: cp.name,
    source: `${site.name}`,
  }));

  const subSiteCheckpoints = (site.subSites || []).flatMap((sub: any) =>
    (sub.checkpoints || []).map((cp: any) => ({
      id: cp.id,
      name: cp.name,
      source: `${site.name} / ${sub.name}`,
    }))
  );

  return [...siteCheckpoints, ...subSiteCheckpoints];
});

const formatTimeOnly = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).toLowerCase();
};

const handleExportPatrolData = async (format: 'csv' | 'pdf') => {
  if (format === 'csv') {
    exportCSV();
  } else {
    await exportPDF();
  }

  setShowExportDialog(false);
};
const exportCSV = () => {
  if (!patrol) {
    toast.error("No patrol data available");
    return;
  }

  const guardNames = guards.length
    ? guards.map((g: any) => `${g.name} (${g.guardStatus})`).join(" | ")
    : "No Guards Assigned";

  // Flatten Sites & Checkpoints
  const siteDetails = sites.map((site: any) => {
    const siteCheckpoints = site.checkpoints?.length
      ? site.checkpoints.map((c: any) => c.name).join(" | ")
      : "None";

    const subSiteDetails = site.subSites?.length
      ? site.subSites.map((sub: any) => {
          const subCheckpoints = sub.checkpoints?.length
            ? sub.checkpoints.map((c: any) => c.name).join(" | ")
            : "None";
          return `${sub.name} [${subCheckpoints}]`;
        }).join(" || ")
      : "None";

    return `${site.name} | CP: ${siteCheckpoints} | SubSites: ${subSiteDetails}`;
  }).join(" ### ");

  const exportData = {
    "Patrol ID": patrol.patrolId,
    "Status": patrol.status,
    "Vehicle ID": patrol.vehicleId,
    "Start Time": patrol.startTime,
    "Estimated Completion": patrol.estimatedCompletion,
    "Completion %": patrol.completionPercentage,
    "Total Sites": patrol.totalSites,
    "Completed Sites": patrol.completedSites,
    "Total SubSites": patrol.totalSubSites,
    "Completed SubSites": patrol.completedSubSites,
    "Total Checkpoints": patrol.totalCheckpoints,
    "Completed Checkpoints": patrol.completedCheckpoints,
    "Missed Checkpoints": patrol.missedCheckpoints,
    "Route Deviation": patrol.hasDeviation ? "Yes" : "No",

    "Order Location": order?.locationName,
    "Order Address": order?.locationAddress,
    "Order Service Type": order?.serviceType,
    "Order Start Date": order?.startDate,
    "Order Start Time": order?.startTime,
    "Order Status": order?.status,

    "Client Name": client?.name,
    "Client Email": client?.email,
    "Client Mobile": client?.mobile,

    "Guards": guardNames,
    "Sites & Checkpoints": siteDetails,
    "Created At": patrol.createdAt,
  };

  const headers = Object.keys(exportData);

  const csvRows = [
    headers.join(","),
    headers
      .map(field =>
        `"${String((exportData as Record<string, any>)[field] ?? "").replace(/"/g, '""')}"`
      )
      .join(","),
  ];

  const blob = new Blob([csvRows.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `patrol-${patrol.patrolId}.csv`;
  link.click();
  URL.revokeObjectURL(url);

  toast.success("CSV exported successfully");
};

const exportPDF = async () => {
  if (!patrol) {
    toast.error("No patrol data available");
    return;
  }

  const doc = new jsPDF();
  let y = 20;

  const addLine = (label: string, value: any) => {
    doc.setFont("", "bold");
    doc.text(label, 14, y);
    doc.setFont("", "normal");
    doc.text(String(value ?? "N/A"), 70, y);
    y += 7;

    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  };

  doc.setFontSize(16);
  doc.text("Patrol Proof of Service Report", 14, y);
  y += 12;
  doc.setFontSize(11);

  // Patrol Section
  addLine("Patrol ID:", patrol.patrolId);
  addLine("Status:", patrol.status);
  addLine("Vehicle ID:", patrol.vehicleId);
  addLine("Start Time:", patrol.startTime);
  addLine("Estimated Completion:", patrol.estimatedCompletion);
  addLine("Completion %:", patrol.completionPercentage + "%");
  addLine(
    "Checkpoints:",
    `${patrol.completedCheckpoints}/${patrol.totalCheckpoints}`
  );
  addLine("Route Deviation:", patrol.hasDeviation ? "Yes" : "No");

  y += 5;

  // Client Section
  doc.setFont("", "bold");
  doc.text("Client Details", 14, y);
  y += 8;

  addLine("Name:", client?.name);
  addLine("Email:", client?.email);
  addLine("Mobile:", client?.mobile);

  y += 5;

  // Guards Section
  doc.setFont("", "bold");
  doc.text("Assigned Guards", 14, y);
  y += 8;

  guards.forEach((g: any) => {
    addLine(
      g.name,
      `Status: ${g.guardStatus} | ClockIn: ${g.clockInTime ?? "N/A"}`
    );
  });

  y += 5;

  // Sites Section
  doc.setFont("", "bold");
  doc.text("Sites & Checkpoints", 14, y);
  y += 8;

  sites.forEach((site: any) => {
    addLine("Site:", site.name);

    site.checkpoints?.forEach((cp: any) => {
      addLine(
        ` - CP: ${cp.name}`,
        `Status: ${cp.status}`
      );
    });

    site.subSites?.forEach((sub: any) => {
      addLine(" - SubSite:", sub.name);

      sub.checkpoints?.forEach((scp: any) => {
        addLine(
          `   • CP: ${scp.name}`,
          `Status: ${scp.status}`
        );
      });
    });
  });

  doc.save(`patrol-${patrol.patrolId}.pdf`);

  toast.success("PDF exported successfully");
};
  return (
   <div className="p-6 space-y-6 bg-gray-50 min-h-screen text-[15px]">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div>
            <h1 className="text-3xl font-semibold flex items-center gap-3">
  <Shield className="w-7 h-7 text-purple-600" />
              Patrol Run Details
              <span className="text-gray-500 font-medium">
                {patrol.patrolId}
              </span>
            </h1>
            <p className="text-base text-muted-foreground">
              Comprehensive patrol run monitoring and progress tracking
            </p>
          </div>
        </div>

        <Badge className={statusColor(patrol.status)}>
          {patrol.status}
        </Badge>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleOpenEditDialog}
            className="flex items-center gap-2"
            variant="outline"
            disabled={patrol.status === "completed"}
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>

          <Button
            onClick={() => setShowExportDialog(true)}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* PROGRESS SECTION */}
      <Card>
        <CardContent className="space-y-6 pt-6">

          <div>
            <p className="text-base text-muted-foreground">Overall Progress</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-4xl font-bold text-purple-600">
                {patrol.completionPercentage}%
              </span>
              <Progress value={patrol.completionPercentage} className="w-72 h-3" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <StatCard title="Sites"
              value={`${patrol.completedSites}/${patrol.totalSites}`} />

            <StatCard title="Sub-Sites"
              value={`${patrol.completedSubSites}/${patrol.totalSubSites}`} />

            <StatCard title="Checkpoints"
              value={`${patrol.completedCheckpoints}/${patrol.totalCheckpoints}`} />

            <StatCard title="Missed"
              value={patrol.totalCheckpoints - patrol.completedCheckpoints }
              danger />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-6">

          {/* Patrol Info */}
<Card>
  <CardHeader className="flex">
    <CardTitle className="flex text-lg">
  <Activity className="h-5 w-5 mr-2" />
      Patrol Information
    </CardTitle>
  </CardHeader>

  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
    
    <Info label="Description" value={patrol.description} />
    
    {/* Start Time */}
    <div>
      <p className="text-muted-foreground text-sm">Start Time</p>
      <p className="font-semibold text-base">{formatDateOnly(patrol.startTime)}</p>
      <p className="font-semibold text-base">{formatTimeOnly(patrol.startTime)}</p>
    </div>

    {/* Estimated Completion */}
    <div>
      <p className="text-muted-foreground text-sm">Estimated Completion</p>
      <p className="font-semibold text-base">
        {formatDateOnly(patrol.estimatedCompletion)}
      </p>
      <p className="font-semibold text-base">
        {formatTimeOnly(patrol.estimatedCompletion)}
      </p>
    </div>

    {/* Created At */}
    <div>
      <p className="text-muted-foreground text-sm">Created At</p>
      <p className="font-semibold text-base">
        {formatDateOnly(patrol.createdAt)}
      </p>
      <p className="font-semibold text-base">
        {formatTimeOnly(patrol.createdAt)}
      </p>
    </div>

    <Info label="Vehicle ID" value={patrol.vehicleId} />
  </CardContent>
</Card>

          {/* Location Details */}
          <Card className="rounded-2xl shadow-sm">
  <CardHeader className="flex flex-row items-center gap-2">
    <MapPin className="h-5 w-5 text-muted-foreground" />
    <CardTitle className="text-lg">Location Details</CardTitle>
  </CardHeader>

  <CardContent className="space-y-6 text-base">

    {/* Location Info Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-medium text-lg">
      <Info label="Location Name " value={order?.locationName} />
      <Info label="Service Type" value={order?.serviceType} />
      <Info label="Address" value={order?.locationAddress} />
    </div>

    {/* Images Section */}
    {(order?.images?.length ?? 0) > 0 && (
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">
          Location Images ({order?.images?.length ?? 0})
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {order?.images?.map((img: string, index: number) => (
            <img
              key={index}
              src={img}
              onClick={() => openImageViewer(index)}
              className="rounded-xl object-cover h-40 w-full cursor-pointer hover:scale-105 transition-transform duration-200 shadow-sm"
            />
          ))}
        </div>
      </div>
    )}
  </CardContent>
</Card>

          {/* ======================= SITES & CHECKPOINTS ======================= */}

<Card className="rounded-2xl shadow-sm">
  <CardHeader>
    <CardTitle className="text-lg">
      Sites & Checkpoints ({sites.length} sites)
    </CardTitle>
  </CardHeader>

  <CardContent className="space-y-6">
    {sites.map((site: any, i: number) => {
      

      const totalCheckpoints =
        (site.checkpoints?.length || 0) +
        (site.subSites?.reduce(
          (acc: number, sub: any) =>
            acc + (sub.checkpoints?.length || 0),
          0
        ) || 0)

      const completedCheckpoints = 0 // You can calculate dynamically later

      return (
        <div
          key={site.id}
          className="border rounded-xl bg-white"
        >
          {/* ================= SITE HEADER ================= */}
          <div className="flex justify-between items-center p-5">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white font-semibold text-base">
                {i + 1}
              </div>

              <div>
                <p className="font-semibold text-lg">{site.name}</p>
                <p className="text-sm text-muted-foreground">
                  {site.address}
                </p>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-3">

  <Button
    size="sm"
    variant="outline"
    onClick={() => handleDownloadSiteQR(site)}
  >
    Download QR
  </Button>

  <Badge className={statusColor(site.status)}>
    {site.status}
  </Badge>

  <p className="text-sm text-muted-foreground">
    {completedCheckpoints}/{totalCheckpoints} completed
  </p>

  <button
    onClick={() => toggleOpen(site.id)}
    className="p-1 rounded-md hover:bg-muted transition"
  >
    {openSites[site.id] ? (
      <ChevronUp className="w-6 h-6" />
    ) : (
      <ChevronDown className="w-6 h-6" />
    )}
  </button>

</div>
          </div>

          {/* ================= COLLAPSIBLE CONTENT ================= */}
          {openSites[site.id] && (
            <div className="px-5 pb-5 space-y-5 border-t">
              
              {/* SITE DESCRIPTION */}
              {site.description && (
                <div className="bg-muted/40 rounded-lg p-3 text-sm">
                  <p className="text-muted-foreground text-xs mb-1">
                    Description
                  </p>
                  <p>{site.description}</p>
                </div>
              )}

              {/* LAT LNG */}
              <p className="text-xs text-muted-foreground">
                Lat: {site.latitude} | Lng: {site.longitude}
              </p>

              {/* SUB SITES */}
              {site.subSites?.length > 0 && (
                <div className="space-y-4">
                  <p className="text-sm font-medium">
                    Sub-Sites ({site.subSites.length})
                  </p>

                  {site.subSites.map((sub: any) => (
                    <div
                      key={sub.id}
                      className="border rounded-xl p-4 bg-blue-50/40 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{sub.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {sub.description}
                          </p>
                          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                            <span>₹ {sub.unitPrice}</span>
                            <span>{sub.estimatedDuration} min</span>
                          </div>
                        </div>

                        <Badge className={statusColor(sub.status)}>
                          {sub.status}
                        </Badge>
                      </div>

                      {/* SubSite Checkpoints */}
                      {sub.checkpoints?.map((cp: any) => (
                        <div
                          key={cp.id}
                          className="border rounded-lg p-3 bg-white space-y-2"
                        >
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium text-base">
                                {cp.name}
                              </p>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline">
                                  {cp.priorityLevel}
                                </Badge>
                                <Badge className={statusColor(cp.status)}>
                                  {cp.status}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground">
                            {cp.description}
                          </p>

                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                              {cp.latitude}, {cp.longitude}
                            </span>
                            <span>
                              Range: {cp.verificationRange}m
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* SITE LEVEL CHECKPOINTS */}
              {site.checkpoints?.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium">
                    Site Checkpoints ({site.checkpoints.length})
                  </p>

                  {site.checkpoints.map((cp: any) => (
                    <div
                      key={cp.id}
                      className="border rounded-lg p-3 bg-white space-y-2"
                    >
                      <p className="font-medium text-base">
                        {cp.name}
                      </p>

                      <div className="flex gap-2">
                        <Badge variant="outline">
                          {cp.priorityLevel}
                        </Badge>
                        <Badge className={statusColor(cp.status)}>
                          {cp.status}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {cp.description}
                      </p>

                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          {cp.latitude}, {cp.longitude}
                        </span>
                        <span>
                          Range: {cp.verificationRange}m
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )
    })}
  </CardContent>
</Card>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">

          {/* Client Info */}
          <Card className="rounded-2xl shadow-sm">
  <CardHeader className="flex flex-row items-center gap-2">
    <User className="h-5 w-5 text-muted-foreground" />
    <CardTitle className="text-lg">Client Information</CardTitle>
  </CardHeader>

  <CardContent className="space-y-4 text-sm">
    {/* Avatar + Name */}
    <div className="flex items-center gap-3">
      <img
        src={client?.avatar || "https://via.placeholder.com/48"}
        alt={client?.name}
        className="h-14 w-14 rounded-full object-cover border"
      />
      <div>
        <p className="font-semibold text-lg">{client?.name}</p>
        <p className="text-sm text-muted-foreground">
          {client?.id}
        </p>
      </div>
    </div>

    {/* Email */}
    <div className="flex items-center gap-2 text-muted-foreground">
      <Mail className="h-5 w-5" />
      <span>{client?.email}</span>
    </div>

    {/* Phone */}
    <div className="flex items-center gap-2 text-muted-foreground">
      <Phone className="h-5 w-5" />
      <span>{client?.mobile}</span>
    </div>

    {/* Action Buttons */}
    <div className="space-y-2 pt-2">
      <Button variant="outline" className="w-full justify-start gap-2 text-base py-5">
        <Mail className="h-4 w-4" />
        Send Email
      </Button>

      <Button variant="outline" className="w-full justify-start gap-2 text-base py-5">
        <Phone className="h-4 w-4" />
        Call Client
      </Button>
    </div>
  </CardContent>
</Card>

{/* ================= ASSIGNED GUARDS ================= */}
<Card className="rounded-2xl shadow-sm">
  <CardHeader className="flex flex-row items-center gap-2">
    <User className="h-5 w-5 text-muted-foreground" />
    <CardTitle className="text-lg">
      Assigned Guards ({guards.length})
    </CardTitle>
  </CardHeader>

  <CardContent className="space-y-4">
    {guards.map((guard: any) => (
      <div
        key={guard.id}
        className="border rounded-xl p-4 space-y-3"
      >
        {/* Avatar + Name */}
        <div className="flex items-center gap-3">
          <img
            src={guard?.avatar || "https://via.placeholder.com/40"}
            alt={guard?.name}
            className="h-12 w-12 rounded-full object-cover border"
          />
          <div>
           <p className="font-medium text-lg">{guard.name}</p>
            <p className="text-xs text-muted-foreground">
              {guard.email}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <Badge className={statusColor(guard.guardStatus)}>
          {guard.guardStatus}
        </Badge>

        {/* Assigned Date (optional if you have it) */}
        {guard.assignedAt && (
  <p className="text-sm text-muted-foreground">
    Assigned:{" "}
    {new Date(guard.assignedAt).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}
  </p>
)}
      </div>
    ))}
  </CardContent>
</Card>

          {/* Quick Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Statistics</CardTitle>
            </CardHeader>
            <CardContent className="text-base space-y-3">
              <StatRow label="Total Sites" value={patrol.totalSites} />
              <StatRow label="Total Sub-Sites" value={patrol.totalSubSites} />
              <StatRow label="Total Checkpoints" value={patrol.totalCheckpoints} />
              <Separator />
              <StatRow label="Completed"
                value={patrol.completedCheckpoints}
                green />
              <StatRow label="Pending"
                value={patrol.totalCheckpoints - patrol.completedCheckpoints}
                yellow />
              <StatRow label="Missed"
                value={patrol.totalCheckpoints - patrol.completedCheckpoints}
                red />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <RefreshCw className="w-5 h-5 mr-2" />
                Refresh Status
              </Button>

              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-5 h-5 mr-2" />
                Generate Report
              </Button>

              <Button variant="outline" className="w-full justify-start">
                <Flag className="w-5 h-5 mr-2" />
                Report Issue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-xl w-full">
  {order?.images && (
    <img
      src={order.images[currentImageIndex]}
      className="rounded-lg w-full max-h-[70vh] object-contain"
    />
  )}
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

      {/* Edit Patrol Dialog */}
      <Dialog
        open={showEditDialog}
        onOpenChange={(value) => {
          setShowEditDialog(value);
          if (!value) resetEditForm();
        }}
      >
        <DialogContent className="max-w-6xl w-[96vw] max-h-[92vh] overflow-y-auto p-0">
          <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6 space-y-6">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-2xl">Edit Patrol Run</DialogTitle>
              <DialogDescription className="text-base">
                Manage guards, schedule, and full site structure updates from one workspace.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-xl border border-blue-100 bg-white/90 p-4 space-y-3 shadow-sm">
                <p className="font-semibold text-sm uppercase tracking-wide text-blue-700">Schedule</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Start Date & Time</p>
                    <input
                      type="datetime-local"
                      className="w-full border rounded-md px-3 py-2 bg-white"
                      value={editForm.startDateTime}
                      onChange={(e) =>
                        setEditForm((prev) => ({ ...prev, startDateTime: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Estimated Completion</p>
                    <input
                      type="datetime-local"
                      className="w-full border rounded-md px-3 py-2 bg-white"
                      value={editForm.estimatedCompletion}
                      onChange={(e) =>
                        setEditForm((prev) => ({ ...prev, estimatedCompletion: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-white/90 p-4 space-y-3 shadow-sm">
                <p className="font-semibold text-sm uppercase tracking-wide text-emerald-700">
                  Assign Guards
                </p>
                <div className="space-y-2 max-h-44 overflow-y-auto border rounded-md p-3 bg-white">
                  {allGuards.map((guard: any) => (
                    <label key={guard.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.guardIds.includes(guard.id)}
                        onChange={() => toggleGuardSelection(guard.id)}
                      />
                      <span>{guard.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 bg-white/90 p-4 space-y-4 shadow-sm">
                <p className="font-semibold text-sm uppercase tracking-wide text-slate-700">Add Items</p>

                <div>
                  <p className="text-sm font-medium mb-2">Add Sites</p>
                  <div className="space-y-2 max-h-36 overflow-y-auto border rounded-md p-3">
                    {allSites
                      .filter((site: any) => !sites.some((current: any) => current.id === site.id))
                      .map((site: any) => (
                        <label key={site.id} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editForm.addSites.includes(site.id)}
                            onChange={() => toggleSelection("addSites", site.id)}
                          />
                          {site.name}
                        </label>
                      ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Add Sub-Sites To Existing Sites</p>
                  <div className="space-y-3 max-h-52 overflow-y-auto border rounded-md p-3">
                    {sites.map((site: any) => {
                      const existingSubIds = new Set((site.subSites || []).map((sub: any) => sub.id));
                      const availableSubSites = allSubSitesFromMaster.filter(
                        (sub: any) => !existingSubIds.has(sub.id)
                      );

                      return (
                        <div key={site.id} className="border rounded-md p-2">
                          <p className="font-medium text-sm mb-2">{site.name}</p>
                          <div className="space-y-1">
                            {availableSubSites.length === 0 && (
                              <p className="text-xs text-muted-foreground">No available sub-sites.</p>
                            )}
                            {availableSubSites.map((sub: any) => (
                              <label key={`${site.id}-${sub.id}`} className="flex items-center gap-2 text-xs cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editForm.addSubSites.some(
                                    (item) => item.parentSiteId === site.id && item.subSiteId === sub.id
                                  )}
                                  onChange={() => toggleAddSubSite(site.id, sub.id)}
                                />
                                {sub.siteName} / {sub.name}
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Add Checkpoints</p>
                  <div className="space-y-3 max-h-64 overflow-y-auto border rounded-md p-3">
                    {sites.map((site: any) => (
                      <div key={`site-cp-${site.id}`} className="border rounded-md p-2 space-y-2">
                        <p className="font-medium text-xs">Site: {site.name}</p>
                        {allCheckpointsFromMaster.map((cp: any) => (
                          <label key={`site-${site.id}-${cp.id}`} className="flex items-center gap-2 text-xs cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editForm.addCheckpoints.some(
                                (item) =>
                                  item.parentType === "site" &&
                                  item.parentId === site.id &&
                                  item.checkpointId === cp.id
                              )}
                              onChange={() => toggleAddCheckpoint("site", site.id, cp.id)}
                            />
                            {cp.source} / {cp.name}
                          </label>
                        ))}
                      </div>
                    ))}

                    {sites.flatMap((site: any) =>
                      (site.subSites || []).map((sub: any) => (
                        <div key={`sub-cp-${sub.id}`} className="border rounded-md p-2 space-y-2">
                          <p className="font-medium text-xs">Sub-Site: {site.name} / {sub.name}</p>
                          {allCheckpointsFromMaster.map((cp: any) => (
                            <label key={`sub-${sub.id}-${cp.id}`} className="flex items-center gap-2 text-xs cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editForm.addCheckpoints.some(
                                  (item) =>
                                    item.parentType === "subSite" &&
                                    item.parentId === sub.id &&
                                    item.checkpointId === cp.id
                                )}
                                onChange={() => toggleAddCheckpoint("subSite", sub.id, cp.id)}
                              />
                              {cp.source} / {cp.name}
                            </label>
                          ))}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-rose-100 bg-white/90 p-4 space-y-4 shadow-sm">
                <p className="font-semibold text-sm uppercase tracking-wide text-rose-700">Remove Items</p>

                <div>
                  <p className="text-sm font-medium mb-2">Remove Sites</p>
                  <div className="space-y-2 max-h-28 overflow-y-auto border rounded-md p-3">
                    {sites.map((site: any) => (
                      <label key={site.id} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.removeSiteIds.includes(site.id)}
                          onChange={() => toggleSelection("removeSiteIds", site.id)}
                        />
                        {site.name}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Remove Sub-Sites</p>
                  <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-3">
                    {sites.flatMap((site: any) =>
                      (site.subSites || []).map((sub: any) => (
                        <label key={sub.id} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editForm.removeSubSiteIds.includes(sub.id)}
                            onChange={() => toggleSelection("removeSubSiteIds", sub.id)}
                          />
                          {site.name} / {sub.name}
                        </label>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Remove Checkpoints</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
                    {sites.flatMap((site: any) => {
                      const siteCheckpoints = (site.checkpoints || []).map((cp: any) => ({
                        id: cp.id,
                        label: `${site.name} / ${cp.name}`,
                      }));

                      const subSiteCheckpoints = (site.subSites || []).flatMap((sub: any) =>
                        (sub.checkpoints || []).map((cp: any) => ({
                          id: cp.id,
                          label: `${site.name} / ${sub.name} / ${cp.name}`,
                        }))
                      );

                      return [...siteCheckpoints, ...subSiteCheckpoints].map((cp) => (
                        <label key={cp.id} className="flex items-center gap-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editForm.removeCheckpointIds.includes(cp.id)}
                            onChange={() => toggleSelection("removeCheckpointIds", cp.id)}
                          />
                          {cp.label}
                        </label>
                      ));
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-violet-100 bg-white/95 p-4 space-y-4 shadow-sm">
              <p className="font-semibold text-sm uppercase tracking-wide text-violet-700">
                Update Existing Site Structure
              </p>

              <div className="space-y-3">
                <p className="text-sm font-medium">Sites</p>
                <div className="space-y-4 max-h-72 overflow-y-auto border rounded-md p-3">
                  {sites.map((site: any) => (
                    <div key={`update-site-${site.id}`} className="border rounded-md p-3 bg-slate-50/60 space-y-2">
                      <p className="text-sm font-semibold">{site.name}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input
                          className="border rounded-md px-2 py-1 text-sm"
                          value={editForm.updateSites[site.id]?.name || ""}
                          placeholder="Site Name"
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              updateSites: {
                                ...prev.updateSites,
                                [site.id]: {
                                  ...prev.updateSites[site.id],
                                  name: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                        <input
                          className="border rounded-md px-2 py-1 text-sm"
                          value={editForm.updateSites[site.id]?.address || ""}
                          placeholder="Address"
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              updateSites: {
                                ...prev.updateSites,
                                [site.id]: {
                                  ...prev.updateSites[site.id],
                                  address: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                        {/* <select
                          className="border rounded-md px-2 py-1 text-sm bg-white"
                          value={editForm.updateSites[site.id]?.status || "pending"}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              updateSites: {
                                ...prev.updateSites,
                                [site.id]: {
                                  ...prev.updateSites[site.id],
                                  status: e.target.value,
                                },
                              },
                            }))
                          }
                        >
                          <option value="pending">pending</option>
                          <option value="upcoming">upcoming</option>
                          <option value="completed">completed</option>
                          <option value="missed">missed</option>
                        </select> */}
                        <input
                          className="border rounded-md px-2 py-1 text-sm"
                          value={editForm.updateSites[site.id]?.latitude || ""}
                          placeholder="Latitude"
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              updateSites: {
                                ...prev.updateSites,
                                [site.id]: {
                                  ...prev.updateSites[site.id],
                                  latitude: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                        <input
                          className="border rounded-md px-2 py-1 text-sm"
                          value={editForm.updateSites[site.id]?.longitude || ""}
                          placeholder="Longitude"
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              updateSites: {
                                ...prev.updateSites,
                                [site.id]: {
                                  ...prev.updateSites[site.id],
                                  longitude: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                        <input
                          className="border rounded-md px-2 py-1 text-sm md:col-span-3"
                          value={editForm.updateSites[site.id]?.description || ""}
                          placeholder="Description"
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              updateSites: {
                                ...prev.updateSites,
                                [site.id]: {
                                  ...prev.updateSites[site.id],
                                  description: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">Sub-Sites</p>
                <div className="space-y-4 max-h-72 overflow-y-auto border rounded-md p-3">
                  {sites.flatMap((site: any) =>
                    (site.subSites || []).map((sub: any) => (
                      <div key={`update-sub-${sub.id}`} className="border rounded-md p-3 bg-slate-50/60 space-y-2">
                        <p className="text-sm font-semibold">{site.name} / {sub.name}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <input
                            className="border rounded-md px-2 py-1 text-sm"
                            value={editForm.updateSubSites[sub.id]?.name || ""}
                            placeholder="Sub-Site Name"
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                updateSubSites: {
                                  ...prev.updateSubSites,
                                  [sub.id]: {
                                    ...prev.updateSubSites[sub.id],
                                    name: e.target.value,
                                  },
                                },
                              }))
                            }
                          />
                          {/* <select
                            className="border rounded-md px-2 py-1 text-sm bg-white"
                            value={editForm.updateSubSites[sub.id]?.status || "pending"}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                updateSubSites: {
                                  ...prev.updateSubSites,
                                  [sub.id]: {
                                    ...prev.updateSubSites[sub.id],
                                    status: e.target.value,
                                  },
                                },
                              }))
                            }
                          >
                            <option value="pending">pending</option>
                            <option value="upcoming">upcoming</option>
                            <option value="completed">completed</option>
                            <option value="missed">missed</option>
                          </select> */}
                          <input
                            className="border rounded-md px-2 py-1 text-sm"
                            value={editForm.updateSubSites[sub.id]?.unitPrice || ""}
                            placeholder="Unit Price"
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                updateSubSites: {
                                  ...prev.updateSubSites,
                                  [sub.id]: {
                                    ...prev.updateSubSites[sub.id],
                                    unitPrice: e.target.value,
                                  },
                                },
                              }))
                            }
                          />
                          <input
                            className="border rounded-md px-2 py-1 text-sm"
                            value={editForm.updateSubSites[sub.id]?.estimatedDuration || ""}
                            placeholder="Estimated Duration"
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                updateSubSites: {
                                  ...prev.updateSubSites,
                                  [sub.id]: {
                                    ...prev.updateSubSites[sub.id],
                                    estimatedDuration: e.target.value,
                                  },
                                },
                              }))
                            }
                          />
                          {/* <input
                            className="border rounded-md px-2 py-1 text-sm"
                            value={editForm.updateSubSites[sub.id]?.latitude || ""}
                            placeholder="Latitude"
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                updateSubSites: {
                                  ...prev.updateSubSites,
                                  [sub.id]: {
                                    ...prev.updateSubSites[sub.id],
                                    latitude: e.target.value,
                                  },
                                },
                              }))
                            }
                          />
                          <input
                            className="border rounded-md px-2 py-1 text-sm"
                            value={editForm.updateSubSites[sub.id]?.longitude || ""}
                            placeholder="Longitude"
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                updateSubSites: {
                                  ...prev.updateSubSites,
                                  [sub.id]: {
                                    ...prev.updateSubSites[sub.id],
                                    longitude: e.target.value,
                                  },
                                },
                              }))
                            }
                          /> */}
                          <input
                            className="border rounded-md px-2 py-1 text-sm md:col-span-3"
                            value={editForm.updateSubSites[sub.id]?.description || ""}
                            placeholder="Description"
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                updateSubSites: {
                                  ...prev.updateSubSites,
                                  [sub.id]: {
                                    ...prev.updateSubSites[sub.id],
                                    description: e.target.value,
                                  },
                                },
                              }))
                            }
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">Checkpoints</p>
                <div className="space-y-4 max-h-80 overflow-y-auto border rounded-md p-3">
                  {sites.flatMap((site: any) => {
                    const siteCheckpoints = (site.checkpoints || []).map((cp: any) => ({
                      ...cp,
                      label: `${site.name} / ${cp.name}`,
                    }));

                    const subSiteCheckpoints = (site.subSites || []).flatMap((sub: any) =>
                      (sub.checkpoints || []).map((cp: any) => ({
                        ...cp,
                        label: `${site.name} / ${sub.name} / ${cp.name}`,
                      }))
                    );

                    return [...siteCheckpoints, ...subSiteCheckpoints].map((cp: any) => (
                      <div key={`update-cp-${cp.id}`} className="border rounded-md p-3 bg-slate-50/60 space-y-2">
                        <p className="text-sm font-semibold">{cp.label}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <input
                            className="border rounded-md px-2 py-1 text-sm"
                            value={editForm.updateCheckpoints[cp.id]?.name || ""}
                            placeholder="Checkpoint Name"
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                updateCheckpoints: {
                                  ...prev.updateCheckpoints,
                                  [cp.id]: {
                                    ...prev.updateCheckpoints[cp.id],
                                    name: e.target.value,
                                  },
                                },
                              }))
                            }
                          />
                          <select
                            className="border rounded-md px-2 py-1 text-sm bg-white"
                            value={editForm.updateCheckpoints[cp.id]?.priorityLevel || "low"}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                updateCheckpoints: {
                                  ...prev.updateCheckpoints,
                                  [cp.id]: {
                                    ...prev.updateCheckpoints[cp.id],
                                    priorityLevel: e.target.value as "low" | "medium" | "high",
                                  },
                                },
                              }))
                            }
                          >
                            <option value="low">low</option>
                            <option value="medium">medium</option>
                            <option value="high">high</option>
                          </select>
                          {/* <select
                            className="border rounded-md px-2 py-1 text-sm bg-white"
                            value={editForm.updateCheckpoints[cp.id]?.status || "pending"}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                updateCheckpoints: {
                                  ...prev.updateCheckpoints,
                                  [cp.id]: {
                                    ...prev.updateCheckpoints[cp.id],
                                    status: e.target.value,
                                  },
                                },
                              }))
                            }
                          >
                            <option value="pending">pending</option>
                            <option value="upcoming">upcoming</option>
                            <option value="completed">completed</option>
                            <option value="missed">missed</option>
                          </select> */}
                          <input
                            className="border rounded-md px-2 py-1 text-sm"
                            value={editForm.updateCheckpoints[cp.id]?.latitude || ""}
                            placeholder="Latitude"
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                updateCheckpoints: {
                                  ...prev.updateCheckpoints,
                                  [cp.id]: {
                                    ...prev.updateCheckpoints[cp.id],
                                    latitude: e.target.value,
                                  },
                                },
                              }))
                            }
                          />
                          <input
                            className="border rounded-md px-2 py-1 text-sm"
                            value={editForm.updateCheckpoints[cp.id]?.longitude || ""}
                            placeholder="Longitude"
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                updateCheckpoints: {
                                  ...prev.updateCheckpoints,
                                  [cp.id]: {
                                    ...prev.updateCheckpoints[cp.id],
                                    longitude: e.target.value,
                                  },
                                },
                              }))
                            }
                          />
                          <input
                            className="border rounded-md px-2 py-1 text-sm"
                            value={editForm.updateCheckpoints[cp.id]?.verificationRange || ""}
                            placeholder="Verification Range"
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                updateCheckpoints: {
                                  ...prev.updateCheckpoints,
                                  [cp.id]: {
                                    ...prev.updateCheckpoints[cp.id],
                                    verificationRange: e.target.value,
                                  },
                                },
                              }))
                            }
                          />
                          <input
                            className="border rounded-md px-2 py-1 text-sm md:col-span-3"
                            value={editForm.updateCheckpoints[cp.id]?.description || ""}
                            placeholder="Description"
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                updateCheckpoints: {
                                  ...prev.updateCheckpoints,
                                  [cp.id]: {
                                    ...prev.updateCheckpoints[cp.id],
                                    description: e.target.value,
                                  },
                                },
                              }))
                            }
                          />
                        </div>
                      </div>
                    ));
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitEdit} disabled={isUpdatingPatrol}>
                {isUpdatingPatrol ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* Reusable Components */

function Info({ label, value }: any) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="font-medium">{value || "-"}</p>
    </div>
  );
}

function StatCard({ title, value, danger }: any) {
  return (
    <div className={`rounded-lg p-4 border text-center
      ${danger ? "bg-red-50 text-red-600" : "bg-gray-50"}`}>
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{title}</p>
    </div>
  );
}

function StatRow({ label, value, green, yellow, red }: any) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className={
        green ? "text-green-600" :
        yellow ? "text-yellow-600" :
        red ? "text-red-600" :
        ""
      }>
        {value}
      </span>
    </div>
  );
}
