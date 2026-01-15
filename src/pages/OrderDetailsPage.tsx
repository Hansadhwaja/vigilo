import React, { useState } from "react";
import { ArrowLeft, MapPin, Clock, User, Camera, FileText, Badge as BadgeIcon, Edit, Save, X, Mail, Phone, MapPinIcon } from "lucide-react";
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

// Helper functions
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
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "ongoing":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "upcoming":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "completed":
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "cancelled":
    case "rejected":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export default function OrderDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

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

  const handleEditClick = () => {
    if (!order) return;

    if (order.status === "completed" || order.status === "cancelled") {
      toast.error("Cannot edit completed or cancelled orders");
      return;
    }

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
          <BadgeIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold mb-2">No order found</h3>
          <p className="text-lg text-gray-500">Please select an order to view details</p>
          <div className="mt-6">
            <Button variant="outline" onClick={onBack} className="text-lg px-6 py-2">Back</Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading Order Details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-8xl mx-auto px-0 py-0">
        
        {/* Header - BIGGER */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button 
                variant="ghost" 
                onClick={onBack} 
                className="flex items-center gap-2 hover:bg-white text-lg px-4 py-2"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back</span>
              </Button>
              
              <div className="h-8 w-px bg-gray-300" />
              
              <div>
                <div className="flex items-center gap-4">
                  <FileText className="h-7 w-7 text-gray-700" />
                  <h1 className="text-3xl font-bold text-gray-900">Complete Order Details</h1>
                  <Badge className={`${getStatusColor(order.status)} border-2 text-lg font-semibold px-4 py-1.5`}>
                    {order.status}
                  </Badge>
                </div>
                <p className="text-lg text-gray-600 mt-2 ml-11">
                  Full order information including location and requirements
                </p>
              </div>
            </div>

            {/* Action Buttons - BIGGER */}
            <div className="flex gap-3">
              {!isEditMode ? (
                <Button 
                  variant="outline"
                  onClick={handleEditClick}
                  disabled={order.status === "completed" || order.status === "cancelled"}
                  className="flex items-center gap-2 border-2 border-gray-300 text-lg font-medium px-5 py-2.5 h-auto"
                >
                  <Edit className="h-5 w-5" />
                  Edit Order
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={isEditing}
                    className="flex items-center gap-2 text-lg font-medium px-5 py-2.5 h-auto border-2"
                  >
                    <X className="h-5 w-5" />
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveEdit}
                    disabled={isEditing}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-medium px-6 py-2.5 h-auto"
                  >
                    {isEditing ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                    ) : (
                      <Save className="h-5 w-5" />
                    )}
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT - Main Content (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Service Information Card - BIGGER TEXT */}
            <Card className="border-2 border-gray-200 shadow-sm bg-white">
              <CardHeader className="border-b-2 border-gray-200 pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-3 text-gray-900">
                  <FileText className="h-6 w-6" />
                  Service Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  
                  {/* Service Type */}
                  <div>
                    <Label className="text-lg font-semibold text-gray-700 mb-2 block">Service Type</Label>
                    {!isEditMode ? (
                      <div className="font-semibold text-gray-900 text-lg capitalize">
                        {order.serviceType?.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                    ) : (
                      <Select
                        value={editFormData.serviceType}
                        onValueChange={(value) => handleFormChange("serviceType", value)}
                      >
                        <SelectTrigger className="h-11 text-lg">
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
                    <Label className="text-lg font-semibold text-gray-700 mb-2 block">Guards Required</Label>
                    {!isEditMode ? (
                      <div className="font-semibold text-gray-900 text-lg">{order.guardsRequired ?? "—"}</div>
                    ) : (
                      <Input
                        type="number"
                        min="1"
                        value={editFormData.guardsRequired}
                        onChange={(e) => handleFormChange("guardsRequired", e.target.value)}
                        className="h-11 text-lg"
                      />
                    )}
                  </div>

                  {/* Location Name */}
                  {(order.locationName || isEditMode) && (
                    <div className="col-span-2">
                      <Label className="text-lg font-semibold text-gray-700 mb-2 block">Location Name</Label>
                      {!isEditMode ? (
                        <div className="text-gray-900 text-lg font-medium">{order.locationName ?? "—"}</div>
                      ) : (
                        <Input
                          value={editFormData.locationName}
                          onChange={(e) => handleFormChange("locationName", e.target.value)}
                          className="h-11 text-lg"
                          placeholder="e.g., Mumbai Central Office"
                        />
                      )}
                    </div>
                  )}

                  {/* Location Address */}
                  <div className="col-span-2">
                    <Label className="text-lg font-semibold text-gray-700 mb-2 block">Location Address</Label>
                    {!isEditMode ? (
                      <div className="text-gray-900 text-lg">{order.locationAddress ?? "—"}</div>
                    ) : (
                      <Input
                        value={editFormData.locationAddress}
                        onChange={(e) => handleFormChange("locationAddress", e.target.value)}
                        className="h-11 text-lg"
                        placeholder="Full address"
                      />
                    )}
                  </div>

                  {/* Coordinates */}
                  <div className="col-span-2">
                    <Label className="text-lg font-semibold text-gray-700 mb-2 block">Coordinates</Label>
                    {!isEditMode ? (
                      <div className="text-lg text-gray-600 font-mono">
                        Lat: {order.siteService?.coordinates?.[1] ?? "—"}, Lng: {order.siteService?.coordinates?.[0] ?? "—"}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          type="number"
                          step="0.000001"
                          value={editFormData.siteServiceLat}
                          onChange={(e) => handleFormChange("siteServiceLat", e.target.value)}
                          placeholder="Latitude"
                          className="h-11 text-lg"
                        />
                        <Input
                          type="number"
                          step="0.000001"
                          value={editFormData.siteServiceLng}
                          onChange={(e) => handleFormChange("siteServiceLng", e.target.value)}
                          placeholder="Longitude"
                          className="h-11 text-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Description */}
                <div>
                  <Label className="text-lg font-semibold text-gray-700 mb-2 block">Description</Label>
                  {!isEditMode ? (
                    <div className="mt-3 p-5 bg-gray-50 rounded-lg border-2 border-gray-100">
                      <p className="text-lg text-gray-800 leading-relaxed">{order.description || "No description provided"}</p>
                    </div>
                  ) : (
                    <Textarea
                      value={editFormData.description}
                      onChange={(e) => handleFormChange("description", e.target.value)}
                      className="mt-2 text-lg min-h-[100px]"
                      rows={4}
                      placeholder="Standard patrol services for industrial estate and warehouse units"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Location Images Card - BIGGER */}
            {order.images && order.images.length > 0 && (
              <Card className="border-2 border-gray-200 shadow-sm bg-white">
                <CardHeader className="border-b-2 border-gray-200 pb-4">
                  <CardTitle className="text-lg font-bold flex items-center gap-3 text-gray-900">
                    <Camera className="h-6 w-6" />
                    Location Images
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-4">
                    {order.images.map((src: string, idx: number) => (
                      <div 
                        key={idx} 
                        className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-400 transition-all group cursor-pointer"
                      >
                        <img 
                          src={src} 
                          alt={`Location ${idx + 1}`} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Client Information Card - BIGGER */}
            {order.client && (
              <Card className="border-2 border-gray-200 shadow-sm bg-white">
                <CardHeader className="border-b-2 border-gray-200 pb-4">
                  <CardTitle className="text-lg font-bold flex items-center gap-3 text-gray-900">
                    <User className="h-6 w-6" />
                    Client Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="text-lg font-semibold text-gray-700 w-24">Name:</div>
                      <div className="text-lg font-semibold text-gray-900">{order.client.name}</div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="text-lg font-semibold text-gray-700 w-24">Email:</div>
                      <div className="text-lg text-gray-800">{order.client.email}</div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="text-lg font-semibold text-gray-700 w-24">Mobile:</div>
                      <div className="text-lg text-gray-800">{order.client.mobile}</div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="text-lg font-semibold text-gray-700 w-24">Address:</div>
                      <div className="text-lg text-gray-800 flex-1">{order.client.address}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT - Sidebar - BIGGER */}
          <div className="space-y-6">
            
            {/* Schedule Card */}
            <Card className="border-2 border-gray-200 shadow-sm bg-white">
              <CardHeader className="border-b-2 border-gray-200 pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-3 text-gray-900">
                  <Clock className="h-6 w-6" />
                  Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                
                {/* Start Date */}
                <div>
                  <Label className="text-lg font-semibold text-gray-700 mb-2 block">Start Date</Label>
                  {!isEditMode ? (
                    <div className="font-semibold text-gray-900 text-lg">{formatDate(order.startDate)}</div>
                  ) : (
                    <Input
                      type="date"
                      value={editFormData.startDate}
                      onChange={(e) => handleFormChange("startDate", e.target.value)}
                      className="h-11 text-lg"
                    />
                  )}
                </div>

                {/* End Date */}
                <div>
                  <Label className="text-lg font-semibold text-gray-700 mb-2 block">End Date</Label>
                  {!isEditMode ? (
                    <div className="font-semibold text-gray-900 text-lg">{formatDate(order.endDate)}</div>
                  ) : (
                    <Input
                      type="date"
                      value={editFormData.endDate}
                      onChange={(e) => handleFormChange("endDate", e.target.value)}
                      className="h-11 text-lg"
                    />
                  )}
                </div>

                <Separator />

                {/* Start Time */}
                <div>
                  <Label className="text-lg font-semibold text-gray-700 mb-2 block">Start Time</Label>
                  {!isEditMode ? (
                    <div className="font-semibold text-gray-900 text-lg">{formatTime(order.startTime)}</div>
                  ) : (
                    <Input
                      type="time"
                      value={editFormData.startTime}
                      onChange={(e) => handleFormChange("startTime", e.target.value)}
                      className="h-11 text-lg"
                    />
                  )}
                </div>

                {/* End Time */}
                <div>
                  <Label className="text-lg font-semibold text-gray-700 mb-2 block">End Time</Label>
                  {!isEditMode ? (
                    <div className="font-semibold text-gray-900 text-lg">{formatTime(order.endTime)}</div>
                  ) : (
                    <Input
                      type="time"
                      value={editFormData.endTime}
                      onChange={(e) => handleFormChange("endTime", e.target.value)}
                      className="h-11 text-lg"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Status Card - BIGGER */}
            <Card className="border-2 border-gray-200 shadow-sm bg-white">
              <CardHeader className="border-b-2 border-gray-200 pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-3 text-gray-900">
                  <BadgeIcon className="h-6 w-6" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold text-gray-700">Status:</Label>
                  <Badge className={`${getStatusColor(order.status)} text-lg font-bold px-4 py-1.5 border-2`}>
                    {order.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-lg font-semibold text-gray-700 mb-2 block">Created:</Label>
                  <div className="text-lg text-gray-800">{formatDate(order.createdAt)}</div>
                </div>
                <div>
                  <Label className="text-lg font-semibold text-gray-700 mb-2 block">Last Updated:</Label>
                  <div className="text-lg text-gray-800">{formatDate(order.updatedAt)}</div>
                </div>
                <div>
                  <Label className="text-lg font-semibold text-gray-700 mb-2 block">Order ID:</Label>
                  <div className="text-lg text-gray-600 font-mono break-all leading-relaxed">{order.id}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
