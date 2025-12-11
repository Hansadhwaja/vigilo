import React from "react";
import { ArrowLeft, MapPin, Clock, User, Camera, MessageSquare, FileText, Badge as BadgeIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOrderByIdQuery } from "../apis/ordersApi"; // <-- make sure this exists

// small date/time helpers (local)
const formatDate = (iso?: string) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
};

const formatTime = (isoOrTime?: string) => {
  if (!isoOrTime) return "—";
  // if it's an ISO string, convert; otherwise parse as time string
  try {
    const d = new Date(isoOrTime);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
  } catch {}
  return isoOrTime;
};

const getStatusColor = (status: string) => {
  switch ((status || "").toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "upcoming":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelled":
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function OrderDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: orderResponse, isLoading, isError } = useGetOrderByIdQuery(id || "", {
    skip: !id,
  });

  // your API shape: { data: { ...order } } or maybe direct — check and adapt below
  // handle both common shapes:
  const order = orderResponse?.data ?? orderResponse ?? null;

  const onBack = () => navigate("/clients"); // or '/orders' depending where you want to go

  if (!order && !isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BadgeIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="font-medium mb-2">No order found</h3>
          <p className="text-sm text-gray-500">Please select an order to view details</p>
          <div className="mt-4">
            <Button variant="outline" onClick={onBack}>Back</Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading Order Details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold">Complete Order Details</h1>
            <Badge className={`${getStatusColor(order.status)}`}>
              {order.status}
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">Full order information including location and requirements</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" /> Service Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Service Type</Label>
                  <div className="font-medium text-lg mt-1">{order.serviceType}</div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Guards Required</Label>
                  <div className="font-medium text-lg mt-1">{order.guardsRequired ?? "—"}</div>
                </div>

                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-600">Location</Label>
                  <div className="mt-1 text-base">{order.locationAddress ?? "—"}</div>
                </div>

                   {/* ⬇️ SHOW FIELD ONLY IF locationName IS EMPTY / NULL */}
    {order.locationName && (
      <div className="md:col-span-2">
        <Label className="text-sm font-medium text-gray-600">Location Name</Label>
        <div className="mt-1 text-base">{order.locationName ?? "—"}</div>
      </div>
    )}

                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-600">Coordinates</Label>
                  <div className="text-sm text-gray-600 mt-1 font-mono">
                    Lat: {order.siteService?.coordinates?.[1] ?? "—"}, Lng: {order.siteService?.coordinates?.[0] ?? "—"}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-gray-600">Description</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-800">{order.description || "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with schedule & status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div><strong>Start Date:</strong> {formatDate(order.startDate)}</div>
              <div><strong>End Date:</strong> {formatDate(order.endDate)}</div>
              <div><strong>Start Time:</strong> {formatTime(order.startTime)}</div>
              <div><strong>End Time:</strong> {formatTime(order.endTime)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BadgeIcon className="h-5 w-5" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <strong>Status:</strong>
                <Badge className={`ml-2 ${getStatusColor(order.status)}`}>{order.status}</Badge>
              </div>
              <div><strong>Created:</strong> {formatDate(order.createdAt)}</div>
              <div><strong>Last Updated:</strong> {formatDate(order.updatedAt)}</div>
              <div className="break-words"><strong>Order ID:</strong> {order.id}</div>
            </CardContent>
          </Card>

          {/* Images */}
          {order.images && order.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Location Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {order.images.map((src: string, idx: number) => (
                    <div key={idx} className="rounded overflow-hidden border">
                      <img src={src} alt={`Location ${idx + 1}`} className="w-full h-32 object-cover" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
