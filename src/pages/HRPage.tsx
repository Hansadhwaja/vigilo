import React, { useState, useMemo, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, Eye, User, Shield, AlertCircle, Mail, Phone, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useCreateGuardByAdminMutation, useGetAllGuardsQuery } from "../apis/guardsApi";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "sonner";

const complianceItems = [
  {
    id: "1",
    guardId: "G001",
    guardName: "John Doe",
    type: "Background Check",
    description: "Annual background verification",
    dueDate: "2024-09-15",
    priority: "High",
    status: "Completed",
  },
  {
    id: "2",
    guardId: "G002",
    guardName: "Jane Smith",
    type: "First Aid Training",
    description: "Bi-annual first aid certification",
    dueDate: "2024-10-01",
    priority: "Medium",
    status: "Scheduled",
  },
];

export default function HRPage() {
  const navigate = useNavigate();
  const [compliance] = useState(complianceItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [complianceFilter, setComplianceFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [createGuardByAdmin] = useCreateGuardByAdminMutation();

  // Form errors state
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    mobile?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data - ONLY name, email, mobile
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddingGuard = async () => {
  setFormErrors({});
  
  const errors: any = {};

  // Name validation
  if (!formData.name || formData.name.trim() === "") {
    errors.name = "Name is required";
  } else if (formData.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  // Email validation
  if (!formData.email || formData.email.trim() === "") {
    errors.email = "Email is required";
  } else {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
  }

  // Phone validation
  if (!formData.mobile || formData.mobile.trim() === "") {
    errors.mobile = "Phone number is required";
  } else {
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    if (!phoneRegex.test(formData.mobile)) {
      errors.mobile = "Phone must be 10-15 digits (numbers only)";
    }
  }

  // Show validation errors
  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    toast.error("Validation Error", {
      description: "Please fix the errors in the form",
    });
    return;
  }

  setIsSubmitting(true);

  try {
    const res = await createGuardByAdmin(formData).unwrap();
    console.log("Guard created:", res);
    
    toast.success("Guard Added Successfully!", {
      description: `${formData.name} has been added to the system`,
      duration: 4000,
    });
    
    setShowAddDialog(false);
    setFormData({
      name: "",
      email: "",
      mobile: "",
    });
    setFormErrors({});
    
  } catch (err: any) {
    console.error("Error creating guard:", err);
    
    // FIXED: Properly extract string message from error object
    let errorMessage = "Failed to add guard. Please try again.";
    
    // Try to extract the actual error message string
    if (err?.data?.message) {
      // If message is an object, stringify it properly
      errorMessage = typeof err.data.message === 'string' 
        ? err.data.message 
        : JSON.stringify(err.data.message);
    } else if (err?.data?.error) {
      errorMessage = typeof err.data.error === 'string' 
        ? err.data.error 
        : JSON.stringify(err.data.error);
    } else if (err?.error) {
      errorMessage = typeof err.error === 'string' 
        ? err.error 
        : "An error occurred";
    } else if (err?.message) {
      errorMessage = typeof err.message === 'string' 
        ? err.message 
        : "An error occurred";
    }

    console.log("Extracted error message:", errorMessage); // Debug log

    // Handle 409 Conflict error
    if (err?.status === 409) {
      toast.error("Duplicate Entry", {
        description: errorMessage,
        duration: 5000,
      });
      
      // Set field-specific errors based on message content
      const lowerMessage = errorMessage.toLowerCase();
      if (lowerMessage.includes("email")) {
        setFormErrors({ email: "This email is already registered" });
      } else if (lowerMessage.includes("phone") || lowerMessage.includes("mobile")) {
        setFormErrors({ mobile: "This phone number is already registered" });
      } else {
        // Generic conflict error on both fields
        setFormErrors({ 
          email: "This email may already be registered",
          mobile: "This phone may already be registered"
        });
      }
      
    } else if (err?.status === 400) {
      toast.error("Validation Error", {
        description: errorMessage,
        duration: 5000,
      });
      
    } else if (err?.status === 500) {
      toast.error("Server Error", {
        description: "Something went wrong on our end. Please try again later.",
        duration: 5000,
      });
      
    } else {
      toast.error("Unable to Add New Guard", {
        description: errorMessage,
        duration: 5000,
      });
    }
    
  } finally {
    setIsSubmitting(false);
  }
};


  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: guardsResponse, isLoading, isError, error, isFetching } = useGetAllGuardsQuery({
    limit: itemsPerPage,
    page: currentPage,
    search: debouncedSearch || undefined,
  });

  const guards = guardsResponse?.data || [];
  const apiPagination = guardsResponse?.pagination;

  const filteredCompliance = useMemo(() => {
    return compliance.filter(item => {
      const matchesSearch = item.guardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = complianceFilter === "all" || item.status.toLowerCase() === complianceFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }, [compliance, searchTerm, complianceFilter]);

  const totalGuards = apiPagination?.total || guards.length;
  const activeGuards = guards.length;
  const pendingCompliance = compliance.filter(c => ["Pending", "Overdue"].includes(c.status)).length;
  const totalPages = apiPagination?.totalPages || 1;

  const handleAddGuard = () => {
    setFormData({
      name: "",
      email: "",
      mobile: "",
    });
    setFormErrors({});
    setShowAddDialog(true);
  };

  const handleViewDetails = (guardId: string) => {
    navigate(`/guard-details/${guardId}`);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-blue-100 text-blue-800";
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

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* FIXED HEADER */}
      <div className="flex-shrink-0 space-y-3 pb-3">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <h1 className="mb-1">HR & Compliance</h1>
            <p className="text-gray-600 text-xl">Manage guards, assignments & compliance</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
              <User className="h-4 w-4 text-blue-600" />
              <div>
                <div className="font-bold text-blue-700">{totalGuards}</div>
                <div className="text-lg text-blue-600">Total</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
              <Shield className="h-4 w-4 text-green-600" />
              <div>
                <div className="font-bold text-green-700">{activeGuards}</div>
                <div className="text-lg text-green-600">Guards</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <div>
                <div className="font-bold text-orange-700">{pendingCompliance}</div>
                <div className="text-lg text-orange-600">Issues</div>
              </div>
            </div>
            
            <Button onClick={handleAddGuard} className="flex items-center gap-2 ml-2">
              <Plus className="h-4 w-4" />
              Add Guard
            </Button>
          </div>
        </div>

        <Tabs defaultValue="guards" className="space-y-3">
          <TabsList>
            <TabsTrigger value="guards">Guard Management</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="guards" className="m-0">
            <Card>
              <CardHeader className="py-1"> 
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 mt-2">
                    <CardTitle className="text-lg font-semibold">Guard Directory</CardTitle>

                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border">
                      <Filter className="h-4 w-4 text-gray-500" />

                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                        <Input
                          placeholder="Search guards...."
                          value={searchTerm}
                          onChange={(e) => handleSearch(e.target.value)}
                          className="pl-9 w-lg h-auto"
                        />
                        {isFetching && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent"></div>
                          </div>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchTerm("");
                          setDebouncedSearch("");
                          setCurrentPage(1);
                        }}
                        className="h-8"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="m-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Compliance Tracking</CardTitle>
                
                <div className="flex flex-wrap gap-2 items-center bg-gray-50 p-3 rounded-lg border">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                    <Input
                      placeholder="Search compliance..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-40 h-8"
                    />
                  </div>
                  <Select value={complianceFilter} onValueChange={setComplianceFilter}>
                    <SelectTrigger className="w-36 h-8">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setComplianceFilter("all");
                      setSearchTerm("");
                    }}
                    className="h-8"
                  >
                    Clear
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="guards">
          <TabsContent value="guards">
            <Card>
              <CardContent className="pt-4">

                {isLoading && (
                  <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                    <p className="mt-2 text-gray-600">Loading guards...</p>
                  </div>
                )}

                {isError && (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                    <p className="text-red-600">Failed to load guards</p>
                    <p className="text-xl text-gray-500 mt-1">
                      {error && 'data' in error ? JSON.stringify(error.data) : 'An error occurred'}
                    </p>
                  </div>
                )}

                {!isLoading && !isError && guards.length === 0 && (
                  <div className="text-center py-8">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No guards found</p>
                    <p className="text-xl text-gray-500 mt-1">
                      {searchTerm ? "Try adjusting your search" : "Add your first guard to get started"}
                    </p>
                  </div>
                )}

                {!isLoading && !isError && guards.length > 0 && (
                  <>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50 border-b border-gray-200">
                            <TableHead className="text-lg font-medium text-gray-800">Name</TableHead>
                            <TableHead className="text-lg font-medium text-gray-800">Email</TableHead>
                            <TableHead className="text-lg font-medium text-gray-800">Mobile</TableHead>
                            <TableHead className="text-lg font-medium text-gray-800">Address</TableHead>
                            <TableHead className="text-lg font-medium text-gray-800">Joined</TableHead>
                            <TableHead className="text-lg font-medium text-gray-800 text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {guards.map((guard: any) => (
                            <TableRow 
                              key={guard.id} 
                              className="border-b border-gray-100 hover:bg-gray-50 transition"
                            >
                              <TableCell className="py-4">
                                <div className="text-gray-900 font-medium text-lg truncate max-w-40">
                                  {guard.name}
                                </div>
                              </TableCell>

                              <TableCell className="py-4">
                                <div className="flex items-center gap-2 truncate max-w-52">
                                  <span className="text-lg text-gray-700 truncate">
                                    {guard.email}
                                  </span>
                                </div>
                              </TableCell>

                              <TableCell className="py-4">
                                <div className="flex items-center gap-2 truncate max-w-32">
                                  <span className="text-lg text-gray-700 truncate">
                                    {guard.mobile}
                                  </span>
                                </div>
                              </TableCell>

                              <TableCell className="py-4">
                                <span className="text-lg text-gray-600 truncate block max-w-60">
                                  {guard.address || "—"}
                                </span>
                              </TableCell>

                              <TableCell className="py-4">
                                <span className="text-lg text-gray-600">
                                  {formatDate(guard.createdAt)}
                                </span>
                              </TableCell>

                              <TableCell className="py-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleViewDetails(guard.id)}
                                    className="h-9 w-9 p-0 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {totalPages > 1 && (
                      <div className="flex justify-center mt-6">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (currentPage > 1) {
                                    setCurrentPage(currentPage - 1);
                                  }
                                }}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
                                    setCurrentPage(currentPage + 1);
                                  }
                                }}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
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

          <TabsContent value="compliance">
            <Card>
              <CardContent className="pt-4">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-lg">Guard</TableHead>
                        <TableHead className="text-lg">Type</TableHead>
                        <TableHead className="text-lg">Description</TableHead>
                        <TableHead className="text-lg">Due Date</TableHead>
                        <TableHead className="text-lg">Priority</TableHead>
                        <TableHead className="text-lg">Status</TableHead>
                        <TableHead className="text-lg text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCompliance.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div>
                              <div className="text-xl font-medium">{item.guardName}</div>
                              <div className="text-lg text-gray-500">{item.guardId}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xl">{item.type}</TableCell>
                          <TableCell className="text-xl text-gray-600">{item.description}</TableCell>
                          <TableCell className="text-xl">{item.dueDate}</TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(item.priority)}>
                              {item.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getComplianceStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1">
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Guard Dialog - ONLY 3 FIELDS */}
      <Dialog open={showAddDialog} onOpenChange={(open) => {
        setShowAddDialog(open);
        if (!open) {
          setFormData({
            name: "",
            email: "",
            mobile: "",
          });
          setFormErrors({});
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Add New Guard
            </DialogTitle>
            <DialogDescription>
              Fill in all required fields to add a new guard
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="guardName" className="flex items-center gap-1">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="guardName"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => {
                  handleChange("name", e.target.value);
                  if (formErrors.name) {
                    setFormErrors(prev => ({ ...prev, name: "" }));
                  }
                }}
                className={formErrors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {formErrors.name && (
                <div className="flex items-start gap-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{formErrors.name}</span>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="guardEmail" className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="guardEmail"
                type="email"
                placeholder="guard@vigilo.com"
                value={formData.email}
                onChange={(e) => {
                  handleChange("email", e.target.value);
                  if (formErrors.email) {
                    setFormErrors(prev => ({ ...prev, email: "" }));
                  }
                }}
                onBlur={(e) => {
                  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                  if (e.target.value && !emailRegex.test(e.target.value)) {
                    setFormErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
                  }
                }}
                className={formErrors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {formErrors.email && (
                <div className="flex items-start gap-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{formErrors.email}</span>
                </div>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="guardPhone" className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="guardPhone"
                type="tel"
                placeholder="9876543210"
                value={formData.mobile}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9+\-\s()]/g, '');
                  handleChange("mobile", value);
                  if (formErrors.mobile) {
                    setFormErrors(prev => ({ ...prev, mobile: "" }));
                  }
                }}
                maxLength={15}
                className={formErrors.mobile ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {formErrors.mobile ? (
                <div className="flex items-start gap-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{formErrors.mobile}</span>
                </div>
              ) : (
                <p className="text-xs text-gray-500">10-15 digits (numbers only)</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => {
                setShowAddDialog(false);
                setFormData({
                  name: "",
                  email: "",
                  mobile: "",
                });
                setFormErrors({});
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddingGuard}
              disabled={isSubmitting}
              className="min-w-[130px]"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Guard
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
