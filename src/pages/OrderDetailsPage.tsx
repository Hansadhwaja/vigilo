import React, { useState } from "react";
import { ArrowLeft, MapPin, Clock, User, Camera, MessageSquare, FileText, Badge as BadgeIcon, Edit, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOrderByIdQuery, useEditOrderMutation } from "../apis/ordersApi";
import { toast } from "react-hot-toast";

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

const formatDateForInput = (iso?: string) => {
  if (!iso) return "";
  try {
    return new Date(iso).toISOString().split('T')[0];
  } catch {
    return "";
  }
};

const formatTime = (isoOrTime?: string) => {
  if (!isoOrTime) return "—";
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
    case "ongoing":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "upcoming":
      return "bg-purple-100 text-purple-800 border-purple-200";
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

  // ===== STATE FOR EDIT MODE =====
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    serviceType: "",
    locationName: "",
    locationAddress: "",
    siteServiceLat: "",
    siteServiceLng: "",
    guardsRequired: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });

  const { data: orderResponse, isLoading, isError } = useGetOrderByIdQuery(id || "", {
    skip: !id,
  });

  const [editOrder, { isLoading: isEditing }] = useEditOrderMutation();

  const order = orderResponse?.data ?? orderResponse ?? null;

  const onBack = () => navigate("/clients");

  // ===== EDIT MODE FUNCTIONS =====
  const handleEditClick = () => {
    if (!order) return;

    // Check if order can be edited
    if (order.status === "complete" || order.status === "cancelled") {
      toast.error("Cannot edit completed or cancelled orders");
      return;
    }

    // Populate form with current data
    setEditFormData({
      serviceType: order.serviceType || "",
      locationName: order.locationName || "",
      locationAddress: order.locationAddress || "",
      siteServiceLat: order.siteService?.coordinates?.[1]?.toString() || "",
      siteServiceLng: order.siteService?.coordinates?.[0]?.toString() || "",
      guardsRequired: order.guardsRequired?.toString() || "",
      description: order.description || "",
      startDate: formatDateForInput(order.startDate),
      endDate: formatDateForInput(order.endDate),
      startTime: order.startTime || "",
      endTime: order.endTime || "",
    });

    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleFormChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEdit = async () => {
    if (!order) return;

    try {
      // Build the payload
      const payload: any = {};

      if (editFormData.serviceType) payload.serviceType = editFormData.serviceType;
      if (editFormData.locationName) payload.locationName = editFormData.locationName;
      if (editFormData.locationAddress) payload.locationAddress = editFormData.locationAddress;
      if (editFormData.guardsRequired) payload.guardsRequired = parseInt(editFormData.guardsRequired);
      if (editFormData.description) payload.description = editFormData.description;
      if (editFormData.startDate) payload.startDate = editFormData.startDate;
      if (editFormData.endDate) payload.endDate = editFormData.endDate;
      if (editFormData.startTime) payload.startTime = editFormData.startTime;
      if (editFormData.endTime) payload.endTime = editFormData.endTime;

      // Handle coordinates
      if (editFormData.siteServiceLat && editFormData.siteServiceLng) {
        payload.siteService = {
          lat: parseFloat(editFormData.siteServiceLat),
          lng: parseFloat(editFormData.siteServiceLng)
        };
      }

      await editOrder({
        id: order.id,
        body: payload
      }).unwrap();

      toast.success("Order updated successfully");
      setIsEditMode(false);
    } catch (err: any) {
      console.error("Failed to update order:", err);
      toast.error(err?.data?.message || "Failed to update order");
    }
  };

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

        {/* ===== EDIT BUTTONS ===== */}
        <div className="flex gap-2">
          {!isEditMode ? (
            <>
              <Button 
                variant="outline"
                onClick={handleEditClick}
                disabled={order.status === "complete" || order.status === "cancelled"}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Order
              </Button>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={handleSaveEdit}
                disabled={isEditing}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                {isEditing ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </Button>
              <Button 
                variant="outline"
                onClick={handleCancelEdit}
                disabled={isEditing}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </>
          )}
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
                {/* Service Type */}
                <div>
                  <Label className="text-sm font-medium text-gray-600">Service Type</Label>
                  {!isEditMode ? (
                    <div className="font-medium text-lg mt-1 capitalize">
                      {order.serviceType?.replace(/([A-Z])/g, " $1").trim()}
                    </div>
                  ) : (
                    <Select
                      value={editFormData.serviceType}
                      onValueChange={(value) => handleFormChange("serviceType", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="static">Static</SelectItem>
                        <SelectItem value="premiumSecurity">Premium Security</SelectItem>
                        <SelectItem value="standardPatrol">Standard Patrol</SelectItem>
                        <SelectItem value="24/7Monitoring">24/7 Monitoring</SelectItem>
                        <SelectItem value="healthcareSecurity">Healthcare Security</SelectItem>
                        <SelectItem value="industrialSecurity">Industrial Security</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Guards Required */}
                <div>
                  <Label className="text-sm font-medium text-gray-600">Guards Required</Label>
                  {!isEditMode ? (
                    <div className="font-medium text-lg mt-1">{order.guardsRequired ?? "—"}</div>
                  ) : (
                    <Input
                      type="number"
                      min="1"
                      value={editFormData.guardsRequired}
                      onChange={(e) => handleFormChange("guardsRequired", e.target.value)}
                      className="mt-1"
                    />
                  )}
                </div>

                {/* Location Name */}
                {(order.locationName || isEditMode) && (
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium text-gray-600">Location Name</Label>
                    {!isEditMode ? (
                      <div className="mt-1 text-base">{order.locationName ?? "—"}</div>
                    ) : (
                      <Input
                        value={editFormData.locationName}
                        onChange={(e) => handleFormChange("locationName", e.target.value)}
                        className="mt-1"
                        placeholder="e.g., Mumbai Office"
                      />
                    )}
                  </div>
                )}

                {/* Location Address */}
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-600">Location Address</Label>
                  {!isEditMode ? (
                    <div className="mt-1 text-base">{order.locationAddress ?? "—"}</div>
                  ) : (
                    <Input
                      value={editFormData.locationAddress}
                      onChange={(e) => handleFormChange("locationAddress", e.target.value)}
                      className="mt-1"
                      placeholder="Full address"
                    />
                  )}
                </div>

                {/* Coordinates */}
                <div className={isEditMode ? "" : "md:col-span-2"}>
                  <Label className="text-sm font-medium text-gray-600">
                    {isEditMode ? "Latitude" : "Coordinates"}
                  </Label>
                  {!isEditMode ? (
                    <div className="text-sm text-gray-600 mt-1 font-mono">
                      Lat: {order.siteService?.coordinates?.[1] ?? "—"}, Lng: {order.siteService?.coordinates?.[0] ?? "—"}
                    </div>
                  ) : (
                    <Input
                      type="number"
                      step="0.000001"
                      value={editFormData.siteServiceLat}
                      onChange={(e) => handleFormChange("siteServiceLat", e.target.value)}
                      className="mt-1"
                      placeholder="e.g., 28.7041"
                    />
                  )}
                </div>

                {isEditMode && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Longitude</Label>
                    <Input
                      type="number"
                      step="0.000001"
                      value={editFormData.siteServiceLng}
                      onChange={(e) => handleFormChange("siteServiceLng", e.target.value)}
                      className="mt-1"
                      placeholder="e.g., 77.1025"
                    />
                  </div>
                )}
              </div>

              <Separator />

              {/* Description */}
              <div>
                <Label className="text-sm font-medium text-gray-600">Description</Label>
                {!isEditMode ? (
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-800">{order.description || "—"}</p>
                  </div>
                ) : (
                  <Textarea
                    value={editFormData.description}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                    className="mt-2"
                    rows={4}
                    placeholder="Order description and requirements..."
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with schedule & status */}
        <div className="space-y-6">
          {/* Schedule Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Start Date */}
              <div>
                <strong>Start Date:</strong>
                {!isEditMode ? (
                  <span className="ml-2">{formatDate(order.startDate)}</span>
                ) : (
                  <Input
                    type="date"
                    value={editFormData.startDate}
                    onChange={(e) => handleFormChange("startDate", e.target.value)}
                    className="mt-1"
                  />
                )}
              </div>

              {/* End Date */}
              <div>
                <strong>End Date:</strong>
                {!isEditMode ? (
                  <span className="ml-2">{formatDate(order.endDate)}</span>
                ) : (
                  <Input
                    type="date"
                    value={editFormData.endDate}
                    onChange={(e) => handleFormChange("endDate", e.target.value)}
                    className="mt-1"
                  />
                )}
              </div>

              {/* Start Time */}
              <div>
                <strong>Start Time:</strong>
                {!isEditMode ? (
                  <span className="ml-2">{formatTime(order.startTime)}</span>
                ) : (
                  <Input
                    type="time"
                    value={editFormData.startTime}
                    onChange={(e) => handleFormChange("startTime", e.target.value)}
                    className="mt-1"
                  />
                )}
              </div>

              {/* End Time */}
              <div>
                <strong>End Time:</strong>
                {!isEditMode ? (
                  <span className="ml-2">{formatTime(order.endTime)}</span>
                ) : (
                  <Input
                    type="time"
                    value={editFormData.endTime}
                    onChange={(e) => handleFormChange("endTime", e.target.value)}
                    className="mt-1"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Status Card */}
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
              <div className="break-words"><strong>Order ID:</strong> <span className="text-xs font-mono">{order.id}</span></div>
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

          {/* Client Information (if available) */}
          {order.client && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div><strong>Name:</strong> {order.client.name}</div>
                <div><strong>Email:</strong> {order.client.email}</div>
                <div><strong>Mobile:</strong> {order.client.mobile}</div>
                <div><strong>Address:</strong> {order.client.address}</div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
