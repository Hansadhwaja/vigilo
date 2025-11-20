import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, Eye, User, Phone, Mail, MapPin, Building, Calendar, Clock, FileText, Image, CheckCircle, XCircle, Send } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../components/ui/pagination";
import { useGetAllOrdersQuery, useCancelOrderMutation, useAcceptOrderMutation } from "../apis/ordersApi";
import { AlertCircle } from "lucide-react";

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

  // Calculate metrics
  const totalOrders = apiPagination?.total || 0;
  const activeOrders = orders.filter(o => o.status === "ongoing").length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.guardsRequired * 1000), 0); // Estimated
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Pagination
  const totalPages = apiPagination?.totalPages || 1;

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setShowDetailsDialog(true);
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
          <p className="text-gray-600 text-sm">Manage security service orders & contracts</p>
        </div>
                
        {/* Inline Summary Cards */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
            <Building className="h-4 w-4 text-blue-600" />
            <div>
              <div className="font-bold text-blue-700">{totalOrders}</div>
              <div className="text-xs text-blue-600">Total</div>
            </div>
          </div>
                    
          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <div>
              <div className="font-bold text-green-700">{activeOrders}</div>
              <div className="text-xs text-green-600">Active</div>
            </div>
          </div>
                    
          <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
            <Building className="h-4 w-4 text-purple-600" />
            <div>
              <div className="font-bold text-purple-700">${totalRevenue.toLocaleString()}</div>
              <div className="text-xs text-purple-600">Estimated</div>
            </div>
          </div>
                    
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
            <Building className="h-4 w-4 text-orange-600" />
            <div>
              <div className="font-bold text-orange-700">${avgOrderValue.toLocaleString()}</div>
              <div className="text-xs text-orange-600">Avg Value</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Directory and Personal Details */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="directory">Order Directory</TabsTrigger>
          <TabsTrigger value="personal">Order Details</TabsTrigger>
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
              size="sm"
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
                  <p className="text-sm text-gray-500 mt-1">
                    {error && 'data' in error ? JSON.stringify(error.data) : 'An error occurred'}
                  </p>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !isError && orders.length === 0 && (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No orders found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {searchTerm || statusFilter !== "all" || serviceTypeFilter !== "all"
                      ? "Try adjusting your filters"
                      : "No orders available"}
                  </p>
                </div>
              )}

              {/* Order List */}
              {!isLoading && !isError && orders.length > 0 && (
                <>
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <Card key={order.id} className="border border-gray-200 hover:border-gray-300 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* Order Info */}
                              <div>
                                <div className="font-medium text-gray-900 capitalize">
                                  {order.serviceType.replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  <MapPin className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs text-gray-600 truncate">
                                    {order.locationAddress}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  ID: {order.id.slice(0, 8)}...
                                </div>
                              </div>
                                            
                              {/* Schedule Details */}
                              <div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs text-gray-600">
                                    {formatDate(order.startDate)} - {formatDate(order.endDate)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  <Clock className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs text-gray-600">
                                    {formatTime(order.startTime)} - {formatTime(order.endTime)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  <User className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs text-gray-600">
                                    {order.guardsRequired} guard{order.guardsRequired > 1 ? 's' : ''} required
                                  </span>
                                </div>
                              </div>
                                            
                              {/* Status & Actions */}
                              <div className="flex items-center justify-between">
                                <div>
                                  <Badge className={getStatusColor(order.status)}>
                                    {order.status}
                                  </Badge>
                                  <div className="text-xs text-gray-500 mt-2">
                                    Created: {formatDate(order.createdAt)}
                                  </div>
                                </div>
                                                  
                                {/* Action Buttons */}
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleViewDetails(order)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  {order.status === "pending" && (
                                    <>
                                      <Button
                                        size="sm"
                                        onClick={() => handleAction(order, "accept")}
                                        className="h-8 px-2 text-xs bg-green-600 hover:bg-green-700"
                                        disabled={isAccepting}
                                      >
                                        Accept
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleAction(order, "reject")}
                                        className="h-8 px-2 text-xs border-red-200 text-red-600 hover:bg-red-50"
                                        disabled={isCancelling}
                                      >
                                        Reject
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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

        {/* Order Details Tab */}
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
              size="sm"
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
              <CardTitle className="text-lg">Detailed Order Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {!isLoading && !isError && orders.length > 0 && (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <Card key={order.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Service Information */}
                          <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              Service Information
                            </h3>
                            <div className="space-y-2 pl-6">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-gray-400" />
                                <span className="text-sm capitalize">
                                  {order.serviceType.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                <span className="text-sm">{order.locationAddress}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{order.guardsRequired} Guards Required</span>
                              </div>
                              <div className="text-sm text-gray-600 mt-2">
                                <strong>Description:</strong>
                                <p className="mt-1">{order.description}</p>
                              </div>
                            </div>
                          </div>

                          {/* Schedule & Status */}
                          <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Schedule & Status
                            </h3>
                            <div className="space-y-2 pl-6">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Status:</span>
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Start Date:</span>
                                <span className="text-sm font-medium">{formatDate(order.startDate)}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">End Date:</span>
                                <span className="text-sm font-medium">{formatDate(order.endDate)}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Time:</span>
                                <span className="text-sm font-medium">
                                  {formatTime(order.startTime)} - {formatTime(order.endTime)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Created:</span>
                                <span className="text-sm font-medium">{formatDate(order.createdAt)}</span>
                              </div>
                              <div className="flex gap-2 mt-4">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewDetails(order)}
                                  className="flex-1"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View Full
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1"
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
                      <div className="text-sm text-gray-600">
                        Lat: {selectedOrder.siteService.coordinates[1]}, 
                        Lng: {selectedOrder.siteService.coordinates[0]}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-sm text-gray-600">{selectedOrder.description}</p>
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