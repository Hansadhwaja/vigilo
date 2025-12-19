import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, Eye, User, Phone, Mail, MapPin, Building, Calendar, Clock, FileText, Image, CheckCircle, XCircle, Send } from "lucide-react";
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
import { useGetAllOrdersQuery, useCancelOrderMutation, useAcceptOrderMutation, useDeleteClientMutation } from "../apis/ordersApi";
import { AlertCircle } from "lucide-react";
import { useGetAllClientsQuery } from "../apis/ordersApi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ClientsPage() {
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
const navigate = useNavigate();


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

  const orders = ordersResponse?.data || [];
  const apiPagination = ordersResponse?.pagination;

const { data } = useGetAllClientsQuery();

const clients = data?.data; 
const clientsList = clients ? (Array.isArray(clients) ? clients : [clients]) : [];
console.log("Clients List:", clientsList);
console.log("Raw Clients Data:", data);

const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();

const handleDeleteClient = async (clientId: string) => {
  if (!clientId) return;

  const confirmDelete = window.confirm("Are you sure you want to delete this client?");
  if (!confirmDelete) return;

  try {
    const response = await deleteClient({ id: clientId }).unwrap();
    console.log(response);

    toast.success("Client deleted successfully");
  } catch (error) {
    toast.error("Failed to delete client");
  }
};



  // Calculate metrics
  const totalOrders = apiPagination?.total || 0;
  const activeOrders = orders.filter(o => o.status === "ongoing").length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.guardsRequired * 1000), 0); // Estimated
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
        await acceptOrder(selectedOrder.id).unwrap();
      } else if (actionType === "reject") {
        await cancelOrder(selectedOrder.id).unwrap();
      }
      setShowActionDialog(false);
      setActionMessage("");
    } catch (err) {
      console.error("Failed to process order:", err);
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
    // Convert 24-hour time to 12-hour format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
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
                className="pl-9 w-40 h-8"
              />
              {isFetching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                </div>
              )}
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 h-8">
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
              <SelectTrigger className="w-36 h-8">
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="premiumSecurity">Premium Security</SelectItem>
                <SelectItem value="standardPatrol">Standard Patrol</SelectItem>
                <SelectItem value="24/7Monitoring">24/7 Monitoring</SelectItem>
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

              {/* Order List */}
              {!isLoading && !isError && orders.length > 0 && (
                <>
                 <div className="overflow-x-auto rounded-lg border border-gray-200">
  <table className="w-full text-lg text-left">
    <thead className="bg-gray-50 border-b">
      <tr>
        <th className="px-4 py-3 font-medium text-gray-700">Service Type</th>
        <th className="px-4 py-3 font-medium text-gray-700">Location</th>
        <th className="px-4 py-3 font-medium text-gray-700">Schedule</th>
        {/* <th className="px-4 py-3 font-medium text-gray-700">Time</th> */}
        <th className="px-4 py-3 font-medium text-gray-700">Guards</th>
        <th className="px-4 py-3 font-medium text-gray-700">Status</th>
        <th className="px-4 py-3 font-medium text-gray-700">Created</th>
        <th className="px-4 py-3 font-medium text-gray-700 text-right">Actions</th>
      </tr>
    </thead>

    <tbody className="divide-y">
      {orders.map((order) => (
        <tr key={order.id} className="hover:bg-gray-50 transition-colors">

          {/* Service Type */}
          <td className="px-4 py-3 font-medium text-gray-900 capitalize">
            {order.serviceType.replace(/([A-Z])/g, " $1").trim()}
            <div className="text-xs text-gray-500">
              ID: {order.id.slice(0, 8)}...
            </div>
          </td>

          {/* Location */}
          <td className="px-4 py-3 text-gray-700 max-w-[180px] truncate">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-gray-400" />
              {order.locationAddress}
            </div>
          </td>

          {/* Schedule */}
          <td className="px-4 py-3 text-gray-700">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-gray-400" />
              {formatDate(order.startDate)} – {formatDate(order.endDate)}
            </div>
          </td>

          {/* Time */}
          {/* <td className="px-4 py-3 text-gray-700">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-gray-400" />
              {formatTime(order.startTime)} – {formatTime(order.endTime)}
            </div>
          </td> */}

          {/* Guards Required */}
          <td className="px-4 py-3 text-gray-700">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3 text-gray-400" />
              {order.guardsRequired} guard{order.guardsRequired > 1 ? "s" : ""}
            </div>
          </td>

          {/* Status */}
          <td className="px-4 py-3">
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
          </td>

          {/* Created At */}
          <td className="px-4 py-3 text-gray-600 text-xs">
            {formatDate(order.createdAt)}
          </td>

          {/* Actions */}
          <td className="px-4 py-3 text-right">
            <div className="flex items-center justify-end gap-2">

              {/* View */}
              <Button
                size="lg"
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => handleViewDetails(order.id)}
              >
                <Eye className="h-4 w-4" />
              </Button>

              {/* Accept/Reject for pending */}
              {order.status === "pending" && (
                <>
                  <Button
                    size="lg"
                    className="h-8 px-2 text-lg bg-green-600 hover:bg-green-700"
                    onClick={() => handleAction(order, "accept")}
                    disabled={isAccepting}
                  >
                    Accept
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="h-8 px-2 text-lg border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleAction(order, "reject")}
                    disabled={isCancelling}
                  >
                    Reject
                  </Button>
                </>
              )}
            </div>
          </td>

        </tr>
      ))}
    </tbody>
  </table>
</div>


                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-4">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1) {
                                  setCurrentPage(prev => prev - 1);
                                }
                              }}
                              className={currentPage === 1 ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer"}
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
                                className="cursor-pointer"
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
                              className={currentPage === totalPages ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer"}
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
                placeholder="Search orders..."
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
              {!isLoading && !isError  && clientsList.length>0 && (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
  <table className="w-full text-lg text-left">
    
    {/* Table Header */}
    <thead className="bg-gray-50 border-b">
      <tr>
        <th className="px-4 py-3 font-medium text-gray-700">Name</th>
        <th className="px-4 py-3 font-medium text-gray-700">Email</th>
        <th className="px-4 py-3 font-medium text-gray-700">Phone</th>
        <th className="px-4 py-3 font-medium text-gray-700">Address</th>
        <th className="px-4 py-3 font-medium text-gray-700 text-right">Actions</th>
      </tr>
    </thead>

    {/* Table Body */}
    <tbody className="divide-y">
      {clientsList.map((client) => (
        <tr key={client.id} className="hover:bg-gray-50 transition-colors">

          {/* Name */}
          <td className="px-4 py-3 font-medium text-gray-900">
            {client.name}
          </td>

          {/* Email */}
          <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate">
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4 text-gray-400" />
              {client.email}
            </div>
          </td>

          {/* Phone */}
          <td className="px-4 py-3 text-gray-700 max-w-[150px] truncate">
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4 text-gray-400" />
              {client.mobile}
            </div>
          </td>

          {/* Address */}
          <td className="px-4 py-3 text-gray-600 max-w-[220px] truncate">
            {client.address || "—"}
          </td>

          {/* Actions */}
          <td className="px-4 py-3 text-right">
            <div className="flex justify-end gap-2">

              {/* View Button */}
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

              {/* Delete Button */}
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

      {/* Client Details Dialog */}
      <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Client Details</DialogTitle>
    </DialogHeader>

    {selectedClient && (
      <div className="space-y-3 mt-2">
        
        <div className="flex justify-between">
          <span className="font-medium">Name:</span>
          <span>{selectedClient.name}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Email:</span>
          <span>{selectedClient.email}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Mobile:</span>
          <span>{selectedClient.mobile}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Address:</span>
          <span className="text-right">{selectedClient.address}</span>
        </div>

      </div>
    )}

    <DialogFooter className="mt-4">
      <Button onClick={() => setShowClientDialog(false)}>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>


      {/* Order Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Order Details</DialogTitle>
            <DialogDescription>
              Full order information including location and requirements
            </DialogDescription>
          </DialogHeader>
                    
          {selectedOrder && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Service Information</h3>
                  <div className="space-y-2">
                    <div><strong>Service Type:</strong> {selectedOrder.serviceType}</div>
                    <div><strong>Guards Required:</strong> {selectedOrder.guardsRequired}</div>
                    <div><strong>Location:</strong> {selectedOrder.locationAddress}</div>
                    <div>
                      <strong>Coordinates:</strong> 
                      <div className="text-lg text-gray-600">
                        Lat: {selectedOrder.siteService.coordinates[1]}, 
                        Lng: {selectedOrder.siteService.coordinates[0]}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-lg text-gray-600">{selectedOrder.description}</p>
                </div>
              </div>

              {/* Schedule & Status */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Schedule</h3>
                  <div className="space-y-2">
                    <div><strong>Start Date:</strong> {formatDate(selectedOrder.startDate)}</div>
                    <div><strong>End Date:</strong> {formatDate(selectedOrder.endDate)}</div>
                    <div><strong>Start Time:</strong> {formatTime(selectedOrder.startTime)}</div>
                    <div><strong>End Time:</strong> {formatTime(selectedOrder.endTime)}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Order Status</h3>
                  <div className="space-y-2">
                    <div>
                      <strong>Status:</strong>
                      <Badge className={`ml-2 ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </Badge>
                    </div>
                    <div><strong>Created:</strong> {formatDate(selectedOrder.createdAt)}</div>
                    <div><strong>Last Updated:</strong> {formatDate(selectedOrder.updatedAt)}</div>
                    <div><strong>Order ID:</strong> {selectedOrder.id}</div>
                  </div>
                </div>

                {selectedOrder.images && selectedOrder.images.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Location Images</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedOrder.images.map((image: string, index: number) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Location ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
                    
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
          </div>
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