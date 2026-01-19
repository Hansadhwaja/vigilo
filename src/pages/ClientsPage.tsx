import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, Eye, User, Phone, Mail, MapPin, Building, Calendar, Clock, FileText, Image, CheckCircle, XCircle, Send, Save, Upload, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../components/ui/pagination";
import {
  useGetAllOrdersQuery, 
  useCancelOrderMutation, 
  useAcceptOrderMutation, 
  useDeleteClientMutation,  
  useEditOrderMutation,  
  useGetAllClientsQuery      
} from "../apis/ordersApi";

import {
  useGetClientByIdQuery,     
  useEditClientMutation,
  useUploadImageMutation,
} from "../apis/usersApi";

import { AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Toast } from "@heroui/react";

export default function ClientsPage() {
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [editClientData, setEditClientData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    avatar: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<"accept" | "reject" | null>(null);
  const [actionMessage, setActionMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("directory");
  const itemsPerPage = 10;
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const navigate = useNavigate();

  // ===== EDIT ORDER STATE =====
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

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch orders from API
  const { data: ordersResponse, isLoading, isError, error, isFetching } = useGetAllOrdersQuery(
    {
      limit: itemsPerPage,
      page: currentPage,
      status: statusFilter !== "all" ? statusFilter : undefined,
      serviceType: serviceTypeFilter !== "all" ? serviceTypeFilter : undefined,
      search: debouncedSearch || undefined,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // Mutations
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [acceptOrder, { isLoading: isAccepting }] = useAcceptOrderMutation();
  const [editOrder, { isLoading: isEditing }] = useEditOrderMutation();
  const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();
  const [editClient, { isLoading: isEditingClientMutation }] = useEditClientMutation();
  const [uploadImage] = useUploadImageMutation();

  const orders = ordersResponse?.data || [];
  const apiPagination = ordersResponse?.pagination;

  const { data } = useGetAllClientsQuery();

  const clients = data?.data; 
  const clientsList = clients ? (Array.isArray(clients) ? clients : [clients]) : [];

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

  // Calculate metrics
  const totalOrders = apiPagination?.total || 0;
  const activeOrders = orders.filter(o => o.status === "ongoing").length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.guardsRequired * 1000), 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Pagination
  const totalPages = apiPagination?.totalPages || 1;

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
        // ✅ Check if start date has passed
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(selectedOrder.startDate);
        startDate.setHours(0, 0, 0, 0);
        
        if (startDate < today) {
          const daysLate = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          const confirmLate = window.confirm(
            `⚠️ WARNING: This order's start date was ${daysLate} day(s) ago.\n\n` +
            `Are you sure you want to accept an expired order?`
          );
          
          if (!confirmLate) {
            return;
          }
        }
        
        await acceptOrder(selectedOrder.id).unwrap();
        toast.success("Order accepted successfully");
      } else if (actionType === "reject") {
        await cancelOrder(selectedOrder.id).unwrap();
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
 console.log("🚀 Editing order with payload:", payload);
      toast.success("Order updated successfully");
      setShowEditDialog(false);
      setSelectedOrder(null);
    } catch (err: any) {
      console.error("Failed to update order:", err);
      toast.error(err?.data?.message || "Failed to update order");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getOrderUrgency = (order: any) => {
    if (order.status !== "pending") return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(order.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    const daysUntilStart = Math.floor((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilStart < 0) {
      return { type: "expired", days: Math.abs(daysUntilStart), color: "bg-red-50" };
    } else if (daysUntilStart <= 2) {
      return { type: "urgent", days: daysUntilStart, color: "bg-red-50" };
    } 
    
    return null;
  };

  // ===== CLIENT EDIT HANDLERS =====
  
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
    <div className="space-y-3">
      {/* Compact Header with Summary Cards Inline */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1">
          <h1 className="mb-1">Order Management</h1>
          <p className="text-gray-600 text-lg">Manage security service orders & contracts</p>
        </div>
                
        {/* Inline Summary Cards */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
            <Building className="h-4 w-4 text-blue-600" />
            <div>
              <div className="font-bold text-blue-700">{totalOrders}</div>
              <div className="text-lg text-blue-600">Total</div>
            </div>
          </div>
                    
          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <div>
              <div className="font-bold text-green-700">{activeOrders}</div>
              <div className="text-lg text-green-600">Active</div>
            </div>
          </div>
                    
          <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
            <Building className="h-4 w-4 text-purple-600" />
            <div>
              <div className="font-bold text-purple-700">${totalRevenue.toLocaleString()}</div>
              <div className="text-lg text-purple-600">Estimated</div>
            </div>
          </div>
                    
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
            <Building className="h-4 w-4 text-orange-600" />
            <div>
              <div className="font-bold text-orange-700">${avgOrderValue.toLocaleString()}</div>
              <div className="text-lg text-orange-600">Avg Value</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Directory and Personal Details */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-auto">
        <TabsList className="grid w-full h-auto grid-cols-2">
          <TabsTrigger value="directory">Order Management</TabsTrigger>
          <TabsTrigger value="personal">Clients Details</TabsTrigger>
        </TabsList>

        {/* Order Directory Tab */}
        <TabsContent value="directory" className="space-y-3">
          {/* Compact Filters Row */}
          <div className="flex flex-wrap gap-2 items-center bg-white p-3 rounded-lg border">
            <Filter className="h-4 w-4 text-gray-500" />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-auto h-8"
              />
              {isFetching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                </div>
              )}
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-auto h-8">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
              <SelectTrigger className="w-auto h-8">
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="static">Static</SelectItem>
                <SelectItem value="premiumSecurity">Premium Security</SelectItem>
                <SelectItem value="standardPatrol">Standard Patrol</SelectItem>
                <SelectItem value="24/7Monitoring">24/7 Monitoring</SelectItem>
                <SelectItem value="healthcareSecurity">Healthcare Security</SelectItem>
                <SelectItem value="industrialSecurity">Industrial Security</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline"
              size="lg"
              onClick={() => {
                setStatusFilter("all");
                setServiceTypeFilter("all");
                setSearchTerm("");
                setDebouncedSearch("");
                setCurrentPage(1);
              }}
              className="h-8"
            >
              Clear
            </Button>
          </div>

          {/* Main Order Directory */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Security Service Orders</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                  <p className="mt-2 text-gray-600">Loading orders...</p>
                </div>
              )}

              {/* Error State */}
              {isError && (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600">Failed to load orders</p>
                  <p className="text-lg text-gray-500 mt-1">
                    {error && 'data' in error ? JSON.stringify(error.data) : 'An error occurred'}
                  </p>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !isError && orders.length === 0 && (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No orders found</p>
                  <p className="text-lg text-gray-500 mt-1">
                    {searchTerm || statusFilter !== "all" || serviceTypeFilter !== "all"
                      ? "Try adjusting your filters"
                      : "No orders available"}
                  </p>
                </div>
              )}

              {/* Order List - Premium Minimal Design */}
{!isLoading && !isError && orders.length > 0 && (
  <>
    {/* Custom Scrollbar Styles - Add to your global CSS or style tag */}
    <style>{`
      .premium-scroll::-webkit-scrollbar {
        height: 8px;
      }
      
      .premium-scroll::-webkit-scrollbar-track {
        background: #f8fafc;
        border-radius: 4px;
      }
      
      .premium-scroll::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;
        transition: background 0.2s;
      }
      
      .premium-scroll::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
    `}</style>

    <div className="overflow-x-auto premium-scroll rounded-xl border border-gray-200/60 shadow-sm bg-white">
      <table className="w-full text-lg">
        <thead className="bg-linear-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/60">
          <tr>
            <th className="px-6 py-4 font-semibold text-gray-700 text-left">Service</th>
            <th className="px-6 py-4 font-semibold text-gray-700 text-left">Location</th>
            <th className="px-6 py-4 font-semibold text-gray-700 text-left">Schedule</th>
            <th className="px-6 py-4 font-semibold text-gray-700 text-left">Guards</th>
            <th className="px-6 py-4 font-semibold text-gray-700 text-left">Status</th>
            <th className="px-6 py-4 font-semibold text-gray-700 text-left">Created</th>
            <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {orders.map((order) => {
            const urgency = getOrderUrgency(order);
            
            return (
              <tr 
                key={order.id} 
                className={`hover:bg-gray-50/50 transition-all duration-200 ${urgency ? urgency.color : ''}`}
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-lg">
                        {order.serviceType.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      {urgency && urgency.type === "expired" && (
                        <Badge className="bg-red-50 hover:bg-red-60 text-white text-xs px-2 py-0.5 font-medium">
                          EXPIRED · {urgency.days}d
                        </Badge>
                      )}
                      {urgency && urgency.type === "urgent" && (
                        <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-0.5 font-medium">
                          {urgency.days}d left
                        </Badge>
                      )}
                      {urgency && urgency.type === "warning" && (
                        <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-2 py-0.5 font-medium">
                          {urgency.days}d
                        </Badge>
                      )}
                    </div>
                    <div className="text-lg text-gray-500 font-mono">
                      #{order.id.slice(0, 8)}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-start gap-2 max-w-50">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                    <span className="text-lg text-gray-700 line-clamp-2">
                      {order.locationAddress}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                    <div className="text-lg text-gray-700 whitespace-nowrap">
                      {formatDate(order.startDate)} → {formatDate(order.endDate)}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-lg text-gray-700 font-medium">
                      {order.guardsRequired}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <Badge className={`${getStatusColor(order.status)} font-medium`}>
                    {order.status}
                  </Badge>
                </td>

                <td className="px-6 py-4">
                  <span className="text-lg text-gray-600">
                    {formatDate(order.createdAt)}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-9 w-9 p-0 hover:bg-gray-100"
                      onClick={() => handleViewDetails(order.id)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4 text-gray-600" />
                    </Button>

                    {order.status !== "completed" && order.status !== "cancelled" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-9 w-9 p-0 hover:bg-blue-50 text-blue-600"
                        onClick={() => handleEditClick(order)}
                        title="Edit Order"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}

                    {order.status === "pending" && (
                      <div className="flex items-center gap-1.5 ml-2">
                        <Button
                          size="sm"
                          className="h-9 px-3 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                          onClick={() => handleAction(order, "accept")}
                          disabled={isAccepting}
                        >
                          Accept
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-9 px-3 text-lg text-red-600 hover:bg-red-50"
                          onClick={() => handleAction(order, "reject")}
                          disabled={isCancelling}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    {/* Premium Pagination */}
    {totalPages > 1 && (
      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent className="gap-1">
            <PaginationItem>
              <PaginationPrevious 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) {
                    setCurrentPage(prev => prev - 1);
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
                    setCurrentPage(prev => prev + 1);
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
  </>
)}

            </CardContent>
          </Card>
        </TabsContent>

        {/* Client Details Tab */}
        <TabsContent value="personal" className="space-y-3">
          <div className="flex flex-wrap gap-2 items-center bg-white p-3 rounded-lg border">
            <Filter className="h-4 w-4 text-gray-500" />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-40 h-8"
              />
            </div>
            <Button 
              variant="outline"
              size="lg"
              onClick={() => {
                setSearchTerm("");
                setDebouncedSearch("");
              }}
              className="h-8"
            >
              Clear
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Detailed Client Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {!isLoading && !isError && clientsList.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-lg text-left">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 font-medium text-gray-700">Name</th>
                        <th className="px-4 py-3 font-medium text-gray-700">Email</th>
                        <th className="px-4 py-3 font-medium text-gray-700">Phone</th>
                        <th className="px-4 py-3 font-medium text-gray-700">Address</th>
                        <th className="px-4 py-3 font-medium text-gray-700 text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {clientsList.map((client) => (
                        <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {client.name}
                          </td>

                          <td className="px-4 py-3 text-gray-700 max-w-50 truncate">
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4 text-gray-400" />
                              {client.email}
                            </div>
                          </td>

                          <td className="px-4 py-3 text-gray-700 max-w-37.5 truncate">
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4 text-gray-400" />
                              {client.mobile}
                            </div>
                          </td>

                          <td className="px-4 py-3 text-gray-600 max-w-55 truncate">
                            {client.address || "—"}
                          </td>

                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="lg"
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  setSelectedClient(client);
                                  setShowClientDialog(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>

                              <Button
                                size="lg"
                                variant="outline"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteClient(client.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ===== EDIT ORDER DIALOG ===== */}
<Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Edit Order</DialogTitle>
      <DialogDescription>
        Update order details including location, schedule, and requirements
      </DialogDescription>
    </DialogHeader>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="edit-serviceType">Service Type</Label>
        <Select
          value={editFormData.serviceType}
          onValueChange={(value: string) => handleEditFormChange("serviceType", value)}
        >
          <SelectTrigger id="edit-serviceType" className="text-lg">
            <SelectValue placeholder="Select service type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="static" className="text-lg">Static</SelectItem>
            <SelectItem value="premiumSecurity" className="text-lg">Premium Security</SelectItem>
            <SelectItem value="standardPatrol" className="text-lg">Standard Patrol</SelectItem>
            <SelectItem value="24/7Monitoring" className="text-lg">24/7 Monitoring</SelectItem>
            <SelectItem value="healthcareSecurity" className="text-lg">Healthcare Security</SelectItem>
            <SelectItem value="industrialSecurity" className="text-lg">Industrial Security</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-guardsRequired">Guards Required</Label>
        <Input
          id="edit-guardsRequired"
          type="number"
          min="1"
          className="text-lg"
          value={editFormData.guardsRequired}
          onChange={(e) => handleEditFormChange("guardsRequired", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-locationName">Location Name</Label>
        <Input
          id="edit-locationName"
          className="text-lg"
          value={editFormData.locationName}
          onChange={(e) => handleEditFormChange("locationName", e.target.value)}
          placeholder="e.g., Mumbai Central Office"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-locationAddress">Location Address</Label>
        <Input
          id="edit-locationAddress"
          className="text-lg"
          value={editFormData.locationAddress}
          onChange={(e) => handleEditFormChange("locationAddress", e.target.value)}
          placeholder="Full address"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-latitude">Latitude</Label>
        <Input
          id="edit-latitude"
          type="number"
          step="0.000001"
          className="text-lg"
          value={editFormData.siteServiceLat}
          onChange={(e) => handleEditFormChange("siteServiceLat", e.target.value)}
          placeholder="e.g., 19.0596"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-longitude">Longitude</Label>
        <Input
          id="edit-longitude"
          type="number"
          step="0.000001"
          className="text-lg"
          value={editFormData.siteServiceLng}
          onChange={(e) => handleEditFormChange("siteServiceLng", e.target.value)}
          placeholder="e.g., 72.8295"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-startDate">Start Date</Label>
        <Input
          id="edit-startDate"
          type="date"
          className="text-lg"
          value={editFormData.startDate}
          onChange={(e) => handleEditFormChange("startDate", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-endDate">End Date</Label>
        <Input
          id="edit-endDate"
          type="date"
          className="text-lg"
          value={editFormData.endDate}
          onChange={(e) => handleEditFormChange("endDate", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-startTime">Start Time</Label>
        <Input
          id="edit-startTime"
          type="time"
          className="text-lg"
          value={editFormData.startTime}
          onChange={(e) => handleEditFormChange("startTime", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-endTime">End Time</Label>
        <Input
          id="edit-endTime"
          type="time"
          className="text-lg"
          value={editFormData.endTime}
          onChange={(e) => handleEditFormChange("endTime", e.target.value)}
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="edit-description">Description</Label>
        <Textarea
          id="edit-description"
          className="text-lg"
          value={editFormData.description}
          onChange={(e) => handleEditFormChange("description", e.target.value)}
          placeholder="Order description and requirements..."
          rows={3}
        />
      </div>
    </div>

    <DialogFooter>
      <Button
        variant="outline"
        onClick={() => setShowEditDialog(false)}
        disabled={isEditing}
      >
        Cancel
      </Button>
      <Button
        onClick={handleEditSubmit}
        disabled={isEditing}
        className="bg-blue-600 hover:bg-blue-700"
      >
        {isEditing && (
          <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
        )}
        Save Changes
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>


      {/* PREMIUM Client Details Dialog with Avatar Upload & Edit */}
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

                      {/* OR divider */}
                      <div className="flex items-center gap-2 my-3">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-lg text-gray-500 font-medium">OR</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                      </div>

                      {/* URL Input (as fallback) */}
                      <Input
                        value={editClientData.avatar}
                        onChange={(e) => handleClientFormChange("avatar", e.target.value)}
                        placeholder="Paste image URL here"
                        className="h-11 text-base"
                        disabled={uploadingAvatar}
                      />
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

      {/* Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "accept" && "Accept Order"}
              {actionType === "reject" && "Reject Order"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "accept" && "Confirm accepting this order and starting the service."}
              {actionType === "reject" && "Provide a reason for rejecting this order."}
            </DialogDescription>
          </DialogHeader>
                    
          {actionType === "reject" && (
            <div className="space-y-4">
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
                    
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>
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
