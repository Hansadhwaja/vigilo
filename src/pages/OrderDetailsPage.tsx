import React, { useState } from "react";
import { ArrowLeft, MapPin, Clock, User, Camera, FileText, Badge as BadgeIcon, Edit, Save, X, Mail, Phone, MapPinIcon, Upload, Trash2 } from "lucide-react";
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
import { useUploadImageMutation } from "../apis/usersApi";
import { toast } from "react-hot-toast";
import { getStatusColor, getStatusStyle } from "../utils/statusColors";

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
    images: [] as string[], // ✅ Added images array
  });

  // ✅ Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);

  const { data: orderResponse, isLoading, isError } = useGetOrderByIdQuery(id || "", {
    skip: !id,
  });

  const [editOrder, { isLoading: isEditing }] = useEditOrderMutation();
  const [uploadImage] = useUploadImageMutation(); // ✅ Upload mutation

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
      images: order.images || [], // ✅ Load existing images
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

  // ✅ Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith("image")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      setUploadingImage(true);
      
      const formData = new FormData();
      formData.append("image", file);
      
      const response = await uploadImage(formData).unwrap();
      
      // Add new image to the array
      setEditFormData(prev => ({
        ...prev,
        images: [...prev.images, response.imageUrl]
      }));
      
      toast.success("Image uploaded successfully");
      e.target.value = ""; // Reset input
    } catch (err: any) {
      console.error("Failed to upload image:", err);
      toast.error(err?.data?.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  // ✅ Handle image delete
  const handleImageDelete = (indexToDelete: number) => {
    setEditFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToDelete)
    }));
    toast.success("Image removed");
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

      // ✅ Include images in payload
      payload.images = editFormData.images;

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
        
        {/* Header */}
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
                  <Badge 
                    className="border-2 text-lg font-semibold px-4 py-1.5"
                    style={getStatusStyle(order.status)}
                  >
                    {getStatusColor(order.status).label}
                  </Badge>
                </div>
                <p className="text-lg text-gray-600 mt-2 ml-11">
                  Full order information including location and requirements
                </p>
              </div>
            </div>

            {/* Action Buttons */}
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
          
          {/* LEFT - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Service Information Card */}
            <Card className="border-2 border-gray-200 shadow-sm bg-white">
              <CardHeader className="border-b-2 border-gray-200 pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-900">
                  <FileText className="h-6 w-6" />
                  Service Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  
                  {/* Service Type */}
                  <div>
                    <Label className="text-base font-semibold text-gray-900 mb-2 block">Service Type</Label>
                    {!isEditMode ? (
                      <div className="text-base text-gray-700 capitalize">
                        {order.serviceType?.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                    ) : (
                      <Select
                        value={editFormData.serviceType}
                        onValueChange={(value: string) => handleFormChange("serviceType", value)}
                      >
                        <SelectTrigger className="h-11 text-base">
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
                    <Label className="text-base font-semibold text-gray-900 mb-2 block">Guards Required</Label>
                    {!isEditMode ? (
                      <div className="text-base text-gray-700">{order.guardsRequired ?? "—"}</div>
                    ) : (
                      <Input
                        type="number"
                        min="1"
                        value={editFormData.guardsRequired}
                        onChange={(e) => handleFormChange("guardsRequired", e.target.value)}
                        className="h-11 text-base"
                      />
                    )}
                  </div>

                  {/* Location Name */}
                  {(order.locationName || isEditMode) && (
                    <div className="col-span-2">
                      <Label className="text-base font-semibold text-gray-900 mb-2 block">Location Name</Label>
                      {!isEditMode ? (
                        <div className="text-base text-gray-700">{order.locationName ?? "—"}</div>
                      ) : (
                        <Input
                          value={editFormData.locationName}
                          onChange={(e) => handleFormChange("locationName", e.target.value)}
                          className="h-11 text-base"
                          placeholder="e.g., Mumbai Central Office"
                        />
                      )}
                    </div>
                  )}

                  {/* Location Address */}
                  <div className="col-span-2">
                    <Label className="text-base font-semibold text-gray-900 mb-2 block">Location Address</Label>
                    {!isEditMode ? (
                      <div className="text-base text-gray-700">{order.locationAddress ?? "—"}</div>
                    ) : (
                      <Input
                        value={editFormData.locationAddress}
                        onChange={(e) => handleFormChange("locationAddress", e.target.value)}
                        className="h-11 text-base"
                        placeholder="Full address"
                      />
                    )}
                  </div>

                  {/* Coordinates */}
                  <div className="col-span-2">
                    <Label className="text-base font-semibold text-gray-900 mb-2 block">Coordinates</Label>
                    {!isEditMode ? (
                      <div className="text-base text-gray-600 font-mono">
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
                          className="h-11 text-base"
                        />
                        <Input
                          type="number"
                          step="0.000001"
                          value={editFormData.siteServiceLng}
                          onChange={(e) => handleFormChange("siteServiceLng", e.target.value)}
                          placeholder="Longitude"
                          className="h-11 text-base"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Description */}
                <div>
                  <Label className="text-base font-semibold text-gray-900 mb-2 block">Description</Label>
                  {!isEditMode ? (
                    <div className="mt-3 p-5 bg-gray-50 rounded-lg border-2 border-gray-100">
                      <p className="text-base text-gray-700 leading-relaxed">{order.description || "No description provided"}</p>
                    </div>
                  ) : (
                    <Textarea
                      value={editFormData.description}
                      onChange={(e) => handleFormChange("description", e.target.value)}
                      className="mt-2 text-base min-h-25"
                      rows={4}
                      placeholder="Standard patrol services for industrial estate and warehouse units"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* ✅ Location Images Card - WITH UPLOAD/DELETE */}
            <Card className="border-2 border-gray-200 shadow-sm bg-white">
              <CardHeader className="border-b-2 border-gray-200 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-900">
                    <Camera className="h-6 w-6" />
                    Location Images
                  </CardTitle>
                  
                  {/* ✅ Upload button in edit mode */}
                  {isEditMode && (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={uploadingImage}
                        className="flex items-center gap-2"
                        onClick={(e: { preventDefault: () => void; currentTarget: { previousElementSibling: { click: () => void; }; }; }) => {
                          e.preventDefault();
                          e.currentTarget.previousElementSibling?.click();
                        }}
                      >
                        {uploadingImage ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            Upload Image
                          </>
                        )}
                      </Button>
                    </label>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {editFormData.images.length > 0 || (!isEditMode && order.images?.length > 0) ? (
                  <div className="grid grid-cols-3 gap-4">
                    {(isEditMode ? editFormData.images : order.images || []).map((src: string, idx: number) => (
                      <div 
                        key={idx} 
                        className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-400 transition-all group"
                      >
                        <img 
                          src={src} 
                          alt={`Location ${idx + 1}`} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                        />
                        
                        {/* ✅ Delete button in edit mode */}
                        {isEditMode && (
                          <button
                            onClick={() => handleImageDelete(idx)}
                            className="absolute top-2 right-2 h-8 w-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors opacity-0 group-hover:opacity-100"
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-base text-gray-600">No images uploaded</p>
                    {isEditMode && (
                      <p className="text-sm text-gray-500 mt-1">Click "Upload Image" to add photos</p>
                    )}
                  </div>
                )}
                
                {isEditMode && editFormData.images.length > 0 && (
                  <p className="text-sm text-gray-500 mt-3">
                    Max size: 5MB per image. Hover over an image to delete it.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Client Information Card */}
            {order.client && (
              <Card className="border-2 border-gray-200 shadow-sm bg-white">
                <CardHeader className="border-b-2 border-gray-200 pb-4">
                  <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-900">
                    <User className="h-6 w-6" />
                    Client Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="text-base font-semibold text-gray-900 w-24">Name:</div>
                      <div className="text-base text-gray-700">{order.client.name}</div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="text-base font-semibold text-gray-900 w-24">Email:</div>
                      <div className="text-base text-gray-700">{order.client.email}</div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="text-base font-semibold text-gray-900 w-24">Mobile:</div>
                      <div className="text-base text-gray-700">{order.client.mobile}</div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="text-base font-semibold text-gray-900 w-24">Address:</div>
                      <div className="text-base text-gray-700 flex-1">{order.client.address}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT - Sidebar */}
          <div className="space-y-6">
            
            {/* Schedule Card */}
            <Card className="border-2 border-gray-200 shadow-sm bg-white">
              <CardHeader className="border-b-2 border-gray-200 pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-900">
                  <Clock className="h-6 w-6" />
                  Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                
                {/* Start Date */}
                <div>
                  <Label className="text-base font-semibold text-gray-900 mb-2 block">Start Date</Label>
                  {!isEditMode ? (
                    <div className="text-base text-gray-700">{formatDate(order.startDate)}</div>
                  ) : (
                    <Input
                      type="date"
                      value={editFormData.startDate}
                      onChange={(e) => handleFormChange("startDate", e.target.value)}
                      className="h-11 text-base"
                    />
                  )}
                </div>

                {/* End Date */}
                <div>
                  <Label className="text-base font-semibold text-gray-900 mb-2 block">End Date</Label>
                  {!isEditMode ? (
                    <div className="text-base text-gray-700">{formatDate(order.endDate)}</div>
                  ) : (
                    <Input
                      type="date"
                      value={editFormData.endDate}
                      onChange={(e) => handleFormChange("endDate", e.target.value)}
                      className="h-11 text-base"
                    />
                  )}
                </div>

                <Separator />

                {/* Start Time */}
                <div>
                  <Label className="text-base font-semibold text-gray-900 mb-2 block">Start Time</Label>
                  {!isEditMode ? (
                    <div className="text-base text-gray-700">{formatTime(order.startTime)}</div>
                  ) : (
                    <Input
                      type="time"
                      value={editFormData.startTime}
                      onChange={(e) => handleFormChange("startTime", e.target.value)}
                      className="h-11 text-base"
                    />
                  )}
                </div>

                {/* End Time */}
                <div>
                  <Label className="text-base font-semibold text-gray-900 mb-2 block">End Time</Label>
                  {!isEditMode ? (
                    <div className="text-base text-gray-700">{formatTime(order.endTime)}</div>
                  ) : (
                    <Input
                      type="time"
                      value={editFormData.endTime}
                      onChange={(e) => handleFormChange("endTime", e.target.value)}
                      className="h-11 text-base"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Status Card */}
            <Card className="border-2 border-gray-200 shadow-sm bg-white">
              <CardHeader className="border-b-2 border-gray-200 pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-900">
                  <BadgeIcon className="h-6 w-6" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold text-gray-900">Status:</Label>
                  <Badge 
                    className="text-base font-semibold px-4 py-1.5 border-2"
                    style={getStatusStyle(order.status)}
                  >
                    {getStatusColor(order.status).label}
                  </Badge>
                </div>
                <div>
                  <Label className="text-base font-semibold text-gray-900 mb-2 block">Created:</Label>
                  <div className="text-base text-gray-700">{formatDate(order.createdAt)}</div>
                </div>
                <div>
                  <Label className="text-base font-semibold text-gray-900 mb-2 block">Last Updated:</Label>
                  <div className="text-base text-gray-700">{formatDate(order.updatedAt)}</div>
                </div>
                <div>
                  <Label className="text-base font-semibold text-gray-900 mb-2 block">Order ID:</Label>
                  <div className="text-sm text-gray-600 font-mono break-all leading-relaxed">{order.id}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
