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

  const formatDateOnly = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTimeOnly = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).toLowerCase();
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
    {order?.images?.length > 0 && (
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">
          Location Images ({order.images.length})
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {order.images.map((img: string, index: number) => (
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
                  <ChevronUp className="w-6 h-6" />
                ) : (
                  <ChevronDown className="w-6 h-6" />
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