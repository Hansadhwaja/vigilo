"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Dialog, DialogContent } from "../components/ui/dialog";
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
} from "lucide-react";
import { useGetPatrolRunByIdForAdminQuery } from "../apis/patrollingAPI";

export default function PatrolDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } =
    useGetPatrolRunByIdForAdminQuery(id as string, {
      skip: !id,
    });

  const patrolData = data?.data;
  const patrol = patrolData?.patrol;
  const order = patrolData?.order;
  const client = patrolData?.client;
  const guards = patrolData?.guards || [];
  const sites = patrolData?.sites || [];

  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [open, setOpen] = useState(false)

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

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-600" />
              Patrol Run Details
              <span className="text-gray-500 font-medium">
                {patrol.patrolId}
              </span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Comprehensive patrol run monitoring and progress tracking
            </p>
          </div>
        </div>

        <Badge className={statusColor(patrol.status)}>
          {patrol.status}
        </Badge>
      </div>

      {/* PROGRESS SECTION */}
      <Card>
        <CardContent className="space-y-6 pt-6">

          <div>
            <p className="text-sm text-muted-foreground">Overall Progress</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-3xl font-bold text-purple-600">
                {patrol.completionPercentage}%
              </span>
              <Progress value={patrol.completionPercentage} className="w-64" />
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
              <CardTitle className="flex"><Activity className="h-4 w-4 " />Patrol Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <Info label="Description" value={patrol.description} />
              <Info label="Start Time" value={formatDate(patrol.startTime)} />
              <Info label="Estimated Completion"
                value={formatDate(patrol.estimatedCompletion)} />
              <Info label="Created At"
                value={formatDate(patrol.createdAt)} />
              <Info label="Vehicle ID"
                value={patrol.vehicleId} />
            </CardContent>
          </Card>

          {/* Location Details */}
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <Info label="Location Name" value={order?.locationName} />
              <Info label="Address" value={order?.locationAddress} />
              <Info label="Service Type" value={order?.serviceType} />

              {order?.images?.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {order.images.map((img: string, index: number) => (
                    <img
                      key={index}
                      src={img}
                      onClick={() => openImageViewer(index)}
                      className="rounded-lg object-cover h-52 w-full cursor-pointer"
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ======================= SITES & CHECKPOINTS ======================= */}

<Card className="rounded-2xl shadow-sm">
  <CardHeader>
    <CardTitle>
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
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-orange-500 text-white font-semibold">
                {i + 1}
              </div>

              <div>
                <p className="font-semibold">{site.name}</p>
                <p className="text-xs text-muted-foreground">
                  {site.address}
                </p>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-4">
              <Badge className={statusColor(site.status)}>
                {site.status}
              </Badge>

              <p className="text-sm text-muted-foreground">
                {completedCheckpoints}/{totalCheckpoints} completed
              </p>

              <button
                onClick={() => setOpen(!open)}
                className="p-1 rounded-md hover:bg-muted transition"
              >
                {open ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* ================= COLLAPSIBLE CONTENT ================= */}
          {open && (
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
                              <p className="font-medium text-sm">
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

                          <p className="text-xs text-muted-foreground">
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
                      <p className="font-medium text-sm">
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

                      <p className="text-xs text-muted-foreground">
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
    <CardTitle>Client Information</CardTitle>
  </CardHeader>

  <CardContent className="space-y-4 text-sm">
    {/* Avatar + Name */}
    <div className="flex items-center gap-3">
      <img
        src={client?.avatar || "https://via.placeholder.com/48"}
        alt={client?.name}
        className="h-12 w-12 rounded-full object-cover border"
      />
      <div>
        <p className="font-semibold text-base">{client?.name}</p>
        <p className="text-muted-foreground text-xs">
          {client?.id}
        </p>
      </div>
    </div>

    {/* Email */}
    <div className="flex items-center gap-2 text-muted-foreground">
      <Mail className="h-4 w-4" />
      <span>{client?.email}</span>
    </div>

    {/* Phone */}
    <div className="flex items-center gap-2 text-muted-foreground">
      <Phone className="h-4 w-4" />
      <span>{client?.mobile}</span>
    </div>

    {/* Action Buttons */}
    <div className="space-y-2 pt-2">
      <Button variant="outline" className="w-full justify-start gap-2">
        <Mail className="h-4 w-4" />
        Send Email
      </Button>

      <Button variant="outline" className="w-full justify-start gap-2">
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
    <CardTitle>
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
            className="h-10 w-10 rounded-full object-cover border"
          />
          <div>
            <p className="font-medium">{guard.name}</p>
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
  <p className="text-xs text-muted-foreground">
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
              <CardTitle>Quick Statistics</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
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
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Status
              </Button>

              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>

              <Button variant="outline" className="w-full justify-start">
                <Flag className="w-4 h-4 mr-2" />
                Report Issue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-3xl">
          {order?.images && (
            <img
              src={order.images[currentImageIndex]}
              className="rounded-md w-full"
            />
          )}
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