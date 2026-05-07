import { useState, useEffect, useMemo } from "react";
import { Search, Filter, Edit, Trash2, Eye, User, Phone, Mail, MapPin, Building, Calendar, Clock, FileText, Image, CheckCircle, XCircle, Send, Save, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCancelOrderMutation,
  useAcceptOrderMutation,
  useDeleteClientMutation,
  useEditOrderMutation,
  useGetAllClientsQuery
} from "@/apis/ordersApi";

import {
  useEditClientMutation,
  useUploadImageMutation,
} from "@/apis/usersApi";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CustomHeader from "@/components/common/Header/CustomHeader";
import OrderStats from "@/components/ClientManagement/Order/OrderStats";
import ClientOperationsTabs from "@/components/ClientManagement/Tabs/ClientOperationsTabs";

export default function ClientsPage() {
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [editClientData, setEditClientData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    avatar: "",
  });

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<"accept" | "reject" | null>(null);
  const [actionMessage, setActionMessage] = useState("");
  const [activeTab, setActiveTab] = useState("directory");
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [debouncedClientSearch, setDebouncedClientSearch] = useState("");

  const navigate = useNavigate();

  const [showEditDialog, setShowEditDialog] = useState(false);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedClientSearch(clientSearchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [clientSearchTerm]);

  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [acceptOrder, { isLoading: isAccepting }] = useAcceptOrderMutation();
  const [editOrder, { isLoading: isEditing }] = useEditOrderMutation();
  const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();
  const [editClient, { isLoading: isEditingClientMutation }] = useEditClientMutation();
  const [uploadImage] = useUploadImageMutation();

  const { data, isLoading: isLoadingClients, isError: isErrorClients } = useGetAllClientsQuery({
    search: debouncedClientSearch || undefined,
    page: 1,
    limit: 100,
  });


  const clients = data?.data;
  const clientsList = clients ? (Array.isArray(clients) ? clients : [clients]) : [];

  // Filter clients by search
  const filteredClients = useMemo(() => {
    if (!clientsList || clientsList.length === 0) return [];
    if (!debouncedClientSearch) return clientsList;

    const searchLower = debouncedClientSearch.toLowerCase();
    return clientsList.filter(client =>
      client.name?.toLowerCase().includes(searchLower) ||
      client.email?.toLowerCase().includes(searchLower) ||
      client.mobile?.toLowerCase().includes(searchLower) ||
      client.address?.toLowerCase().includes(searchLower)
    );
  }, [clientsList, debouncedClientSearch]);


  const handleDeleteClient = async (clientId: string) => {
    if (!clientId) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this client?");
    if (!confirmDelete) return;

    try {
      const response = await deleteClient({ id: clientId }).unwrap();
      toast.success("Client deleted successfully");
    } catch (error) {
      toast.error("Failed to delete client");
    }
  };

  const handleViewDetails = (orderId: string) => {
    navigate(`/clients/${orderId}`);
  };

  const handleAction = (order: any, action: "accept" | "reject") => {
    setSelectedOrder(order);
    setActionType(action);
    setActionMessage("");
    setShowActionDialog(true);
  };

  const handleAcceptReject = async () => {
    if (!selectedOrder) return;

    try {
      if (actionType === "accept") {

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startDate = new Date(selectedOrder.startDate);
        startDate.setHours(0, 0, 0, 0);

        if (startDate < today) {
          const daysLate = Math.floor(
            (today.getTime() - startDate.getTime()) /
            (1000 * 60 * 60 * 24)
          );

          const confirmLate = window.confirm(
            `⚠️ WARNING: This order's start date was ${daysLate} day(s) ago.\n\n` +
            `Are you sure you want to accept an expired order?`
          );

          if (!confirmLate) return;
        }

        await acceptOrder(selectedOrder.id).unwrap();
        toast.success("Order accepted successfully");

      } else if (actionType === "reject") {
        console.log("Sending request:", {
          id: selectedOrder.id,
          reason: actionMessage,
        });


        if (!actionMessage.trim()) {
          toast.error("Please provide a rejection reason");
          return;
        }

        await cancelOrder({
          id: selectedOrder.id,
          reason: actionMessage,
        }).unwrap();

        toast.success("Order rejected successfully");
      }

      setShowActionDialog(false);
      setActionMessage("");

    } catch (err: any) {
      console.error("Failed to process order:", err);
      toast.error(err?.data?.message || "Failed to process order");
    }
  };

  // ===== EDIT ORDER FUNCTIONS =====
  const handleEditClick = (order: any) => {
    // Check if order can be edited
    if (order.status === "completed" || order.status === "cancelled") {
      toast.error("Cannot edit completed or cancelled orders");
      return;
    }

    // Format dates for input fields (YYYY-MM-DD)
    const formatDateForInput = (dateString: string) => {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    // Populate form with current order data
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

    setSelectedOrder(order);
    setShowEditDialog(true);
  };

  const handleEditFormChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditSubmit = async () => {
    if (!selectedOrder) return;

    try {
      // Build the payload
      const payload: any = {};

      // Only include changed fields
      if (editFormData.serviceType) payload.serviceType = editFormData.serviceType;
      if (editFormData.locationName) payload.locationName = editFormData.locationName;
      if (editFormData.locationAddress) payload.locationAddress = editFormData.locationAddress;
      if (editFormData.guardsRequired) payload.guardsRequired = parseInt(editFormData.guardsRequired);
      if (editFormData.description) payload.description = editFormData.description;
      if (editFormData.startDate) payload.startDate = editFormData.startDate;
      if (editFormData.endDate) payload.endDate = editFormData.endDate;
      if (editFormData.startTime) payload.startTime = editFormData.startTime;
      if (editFormData.endTime) payload.endTime = editFormData.endTime;

      // Handle siteService coordinates
      if (editFormData.siteServiceLat && editFormData.siteServiceLng) {
        payload.siteService = {
          lat: parseFloat(editFormData.siteServiceLat),
          lng: parseFloat(editFormData.siteServiceLng)
        };
      }

      // Call the edit API
      await editOrder({
        id: selectedOrder.id,
        body: payload
      }).unwrap();

      //  console.log("🚀 Editing order with payload:", payload);
      toast.success("Order updated successfully");
      setShowEditDialog(false);
      setSelectedOrder(null);
    } catch (err: any) {
      console.error("Failed to update order:", err);
      toast.error(err?.data?.message || "Failed to update order");
    }
  };


  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };



  // Handler to start editing client
  const handleEditClientClick = () => {
    if (selectedClient) {
      setEditClientData({
        name: selectedClient.name,
        email: selectedClient.email,
        mobile: selectedClient.mobile,
        address: selectedClient.address,
        avatar: selectedClient.avatar || "",
      });
      setIsEditingClient(true);
    }
  };

  // Handler to save edited client
  const handleSaveClient = async () => {
    if (!selectedClient) return;

    try {
      await editClient({
        id: selectedClient.id,
        body: editClientData,
      }).unwrap();

      toast.success("Client updated successfully");
      setIsEditingClient(false);
      setShowClientDialog(false);
    } catch (err: any) {
      console.error("Failed to update client:", err);
      toast.error(err?.data?.message || "Failed to update client");
    }
  };

  // Handler for form changes
  const handleClientFormChange = (field: string, value: string) => {
    setEditClientData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler for avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      setUploadingAvatar(true);

      const formData = new FormData();
      formData.append('image', file);

      const response = await uploadImage(formData).unwrap();

      console.log('🎯 Upload response:', response);
      console.log('🎯 New avatar URL:', response.imageUrl);

      handleClientFormChange("avatar", response.imageUrl);

      toast.success("Avatar uploaded successfully");
      e.target.value = '';
    } catch (err: any) {
      console.error("Failed to upload avatar:", err);
      toast.error(err?.data?.message || "Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="space-y-6 overflow-y-auto min-w-0 min-h-0 h-full">

      <CustomHeader
        title="Order Management"
        description="Manage security service orders & contracts"
      />
      <OrderStats
        totalOrders={2}
        activeOrders={3}
        totalRevenue={4}
        avgOrderValue={1}

      />

      <ClientOperationsTabs />

  

 

      <Dialog open={showClientDialog} onOpenChange={(open) => {
        setShowClientDialog(open);
        if (!open) {
          setIsEditingClient(false);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Client Details
              </DialogTitle>
              {!isEditingClient && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditClientClick}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </DialogHeader>

          {selectedClient && (
            <div className="space-y-6 py-4">
              {/* Avatar Section - UPDATED WITH UPLOAD */}
              <div className="flex flex-col items-center gap-4 pb-4 border-b">
                {!isEditingClient ? (
                  <>
                    {selectedClient.avatar ? (
                      <img
                        src={selectedClient.avatar}
                        alt={selectedClient.name}
                        className="h-24 w-24 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                        <User className="h-12 w-12 text-white" />
                      </div>
                    )}
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-900">{selectedClient.name}</h3>
                      <p className="text-lg text-gray-500 mt-1">Client ID: {selectedClient.id.slice(0, 8)}...</p>
                    </div>
                  </>
                ) : (
                  <div className="w-full space-y-4">
                    {/* Avatar Preview */}
                    <div className="flex justify-center">
                      {editClientData.avatar ? (
                        <div className="relative">
                          <img
                            src={editClientData.avatar}
                            alt="Avatar preview"
                            className="h-24 w-24 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                            onError={(e) => {
                              e.currentTarget.src = '';
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          {/* Remove avatar button */}
                          <button
                            onClick={() => handleClientFormChange("avatar", "")}
                            className="absolute -top-2 -right-2 h-8 w-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                            type="button"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200">
                          <User className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Upload Section */}
                    <div>
                      <Label className="text-lg font-semibold text-gray-700 mb-2 block">
                        Profile Picture
                      </Label>

                      {/* Upload Button */}
                      <div className="flex gap-2">
                        <label className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            disabled={uploadingAvatar}
                            className="hidden"
                          />
                          <div className={`
                            flex items-center justify-center gap-2 px-4 py-2.5 
                            border-2 border-dashed border-gray-300 rounded-lg 
                            cursor-pointer hover:border-blue-400 hover:bg-blue-50 
                            transition-all text-lg font-medium text-gray-700
                            ${uploadingAvatar ? 'opacity-50 cursor-not-allowed' : ''}
                          `}>
                            {uploadingAvatar ? (
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
                          </div>
                        </label>
                      </div>
                      <p className="text-lg text-gray-500 mt-1.5">
                        Max size: 5MB • Supported: JPG, PNG, GIF, WebP
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Client Information Grid */}
              <div className="grid grid-cols-1 gap-5">
                {/* Name */}
                <div>
                  <Label className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    Full Name
                  </Label>
                  {!isEditingClient ? (
                    <div className="text-base font-medium text-gray-900 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {selectedClient.name}
                    </div>
                  ) : (
                    <Input
                      value={editClientData.name}
                      onChange={(e) => handleClientFormChange("name", e.target.value)}
                      className="h-11 text-base"
                      placeholder="Enter full name"
                    />
                  )}
                </div>

                {/* Email */}
                <div>
                  <Label className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    Email Address
                  </Label>
                  {!isEditingClient ? (
                    <div className="text-base text-gray-900 p-3 bg-gray-50 rounded-lg border border-gray-200 break-all">
                      {selectedClient.email}
                    </div>
                  ) : (
                    <Input
                      type="email"
                      value={editClientData.email}
                      onChange={(e) => handleClientFormChange("email", e.target.value)}
                      className="h-11 text-base"
                      placeholder="email@example.com"
                    />
                  )}
                </div>

                {/* Mobile */}
                <div>
                  <Label className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    Mobile Number
                  </Label>
                  {!isEditingClient ? (
                    <div className="text-base text-gray-900 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {selectedClient.mobile}
                    </div>
                  ) : (
                    <Input
                      type="tel"
                      value={editClientData.mobile}
                      onChange={(e) => handleClientFormChange("mobile", e.target.value)}
                      className="h-11 text-base"
                      placeholder="+91 1234567890"
                    />
                  )}
                </div>

                {/* Address */}
                <div>
                  <Label className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    Address
                  </Label>
                  {!isEditingClient ? (
                    <div className="text-base text-gray-900 p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-15">
                      {selectedClient.address || "—"}
                    </div>
                  ) : (
                    <Textarea
                      value={editClientData.address}
                      onChange={(e) => handleClientFormChange("address", e.target.value)}
                      className="text-base min-h-20"
                      placeholder="Enter full address"
                      rows={3}
                    />
                  )}
                </div>

                {/* Verification Badge (if available) */}
                {selectedClient.isVerified !== undefined && !isEditingClient && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-lg font-semibold text-gray-700">Account Status:</span>
                    <Badge className={selectedClient.isVerified
                      ? "bg-green-100 text-green-800 border-green-300"
                      : "bg-yellow-100 text-yellow-800 border-yellow-300"
                    }>
                      {selectedClient.isVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="border-t pt-4 flex gap-2">
            {!isEditingClient ? (
              <Button
                onClick={() => setShowClientDialog(false)}
                className="w-full"
                variant="outline"
              >
                Close
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => setIsEditingClient(false)}
                  variant="outline"
                  disabled={isEditingClientMutation}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveClient}
                  disabled={isEditingClientMutation}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isEditingClientMutation ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>
              {actionType === "accept" && "Accept Order"}
              {actionType === "reject" && "Reject Order"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "accept" &&
                "Confirm accepting this order and starting the service."}
              {actionType === "reject" &&
                "Provide a reason for rejecting this order."}
            </DialogDescription>
          </DialogHeader>

          {actionType === "reject" && (
            <div className="space-y-4 pt-2">
              <Label htmlFor="message">Rejection Reason</Label>
              <Textarea
                id="message"
                placeholder="Please provide a reason for rejection..."
                value={actionMessage}
                onChange={(e) => setActionMessage(e.target.value)}
                rows={3}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-6">
            <Button
              variant="outline"
              onClick={() => setShowActionDialog(false)}
            >
              Cancel
            </Button>

            <Button
              onClick={handleAcceptReject}
              className={actionType === "reject" ? "bg-red-600 hover:bg-red-700" : ""}
              disabled={isAccepting || isCancelling}
            >
              {(isAccepting || isCancelling) && (
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
              )}
              {actionType === "accept" && "Accept Order"}
              {actionType === "reject" && "Reject Order"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

}
