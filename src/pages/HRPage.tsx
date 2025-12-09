import React, { useState, useMemo, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, Eye, User, Shield, AlertCircle, Mail, Phone, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useNavigate } from "react-router-dom";
import { useCreateGuardByAdminMutation, useGetAllGuardsQuery } from "../apis/guardsApi";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../components/ui/pagination";

// Sample compliance data (keep this as it's not coming from API yet)
const complianceItems = [
  {
    id: "COMP-001",
    guardId: "GRD-002",
    guardName: "Sarah Johnson",
    type: "License Renewal",
    description: "Security License expires in 2 months",
    dueDate: "2024-12-20",
    status: "Pending",
    priority: "High"
  },
  {
    id: "COMP-002",
    guardId: "GRD-004",
    guardName: "Lisa Rodriguez", 
    type: "License Renewal",
    description: "Security License expires in 1 month",
    dueDate: "2024-11-15",
    status: "Overdue",
    priority: "Critical"
  },
  {
    id: "COMP-003",
    guardId: "GRD-001",
    guardName: "John Smith",
    type: "Training Required",
    description: "Annual refresher training due",
    dueDate: "2024-11-30",
    status: "Scheduled",
    priority: "Medium"
  },
  {
    id: "COMP-004",
    guardId: "GRD-003",
    guardName: "Mike Chen",
    type: "Medical Check",
    description: "Annual medical examination",
    dueDate: "2024-12-05",
    status: "Completed",
    priority: "Low"
  }
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

  const [createGuardByAdmin] =
        useCreateGuardByAdminMutation();


  const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        address: "",
        password: "",
      });

      const handleChange = (
        field: string,
        value: string
      ) => {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }));
      };

       const handleAddingGuard = async () => {
        if (!formData.name || !formData.email || !formData.password) {
          alert("Name, Email & Password are required!");
          return;
        }

        try {
          const res = await createGuardByAdmin(formData).unwrap();
          console.log("Guard created:", res);
          setShowAddDialog(false);

          // Reset form
          setFormData({
            name: "",
            email: "",
            mobile: "",
            address: "",
            password: "",
          });

        } catch (err) {
          console.error("Error creating guard:", err);
          alert("Failed to create guard");
        }
      };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (currentPage !== 1) {
        setCurrentPage(1); // Reset to first page only when search changes, not on mount
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]); // Removed currentPage from dependencies

  // Fetch guards from API with pagination and search
  const { data: guardsResponse, isLoading, isError, error, isFetching } = useGetAllGuardsQuery(
    {
      limit: itemsPerPage,
      page: currentPage,
      search: debouncedSearch || undefined,
    },
    {
      // Refetch when any parameter changes
      refetchOnMountOrArgChange: true,
    }
  );

  // Extract guards data from API response
  const guards = guardsResponse?.data || [];
  const apiPagination = guardsResponse?.pagination;

  // Filter compliance items
  const filteredCompliance = useMemo(() => {
    return compliance.filter(item => {
      const matchesSearch = item.guardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = complianceFilter === "all" || item.status.toLowerCase() === complianceFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }, [compliance, searchTerm, complianceFilter]);

  // Calculate metrics
  const totalGuards = apiPagination?.total || guards.length;
  // Note: getAllGuards doesn't return latestStatic, so we can't calculate active guards accurately
  // You would need a separate endpoint or different logic
  const activeGuards = guards.length; // Placeholder - update when you have the data
  const pendingCompliance = compliance.filter(c => ["Pending", "Overdue"].includes(c.status)).length;

  // Use API pagination
  const totalPages = apiPagination?.totalPages || 1;

  const handleAddGuard = () => {
    setShowAddDialog(true);
  };

  const handleViewDetails = (guardId: string) => {
    navigate(`/guard-details/${guardId}`);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // Page reset is handled in the useEffect debounce
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
    <div className="space-y-3">
      {/* Compact Header with Inline Summary */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1">
          <h1 className="mb-1">HR & Compliance</h1>
          <p className="text-gray-600 text-sm">Manage guards, assignments & compliance</p>
        </div>
        
        {/* Inline Summary Badges */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
            <User className="h-4 w-4 text-blue-600" />
            <div>
              <div className="font-bold text-blue-700">{totalGuards}</div>
              <div className="text-xs text-blue-600">Total</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
            <Shield className="h-4 w-4 text-green-600" />
            <div>
              <div className="font-bold text-green-700">{activeGuards}</div>
              <div className="text-xs text-green-600">Guards</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <div>
              <div className="font-bold text-orange-700">{pendingCompliance}</div>
              <div className="text-xs text-orange-600">Issues</div>
            </div>
          </div>
          
          <Button onClick={handleAddGuard} className="flex items-center gap-2 ml-2">
            <Plus className="h-4 w-4" />
            Add Guard
          </Button>
        </div>
      </div>

      {/* Tabs for HR and Compliance */}
      <Tabs defaultValue="guards" className="space-y-3">
        <TabsList>
          <TabsTrigger value="guards">Guard Management</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Tracking</TabsTrigger>
        </TabsList>

        {/* Guards Tab */}
        <TabsContent value="guards">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Guard Directory</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Compact Filters */}
              <div className="flex flex-wrap gap-2 items-center mb-4 bg-gray-50 p-3 rounded-lg border">
                <Filter className="h-4 w-4 text-gray-500" />
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                  <Input
                    placeholder="Search guards..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-9 w-40 h-8"
                  />
                  {isFetching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
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

              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  <p className="mt-2 text-gray-600">Loading guards...</p>
                </div>
              )}

              {/* Error State */}
              {isError && (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600">Failed to load guards</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {error && 'data' in error ? JSON.stringify(error.data) : 'An error occurred'}
                  </p>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !isError && guards.length === 0 && (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No guards found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {searchTerm ? "Try adjusting your search" : "Add your first guard to get started"}
                  </p>
                </div>
              )}

              {/* Guard List */}
              {!isLoading && !isError && guards.length > 0 && (
                <>
                  {/* Guard List Table */}
{/* Guard List Table */}
<Card>
  <CardHeader className="pb-4">
    <CardTitle className="text-xl font-semibold flex items-center gap-2">
      <Users className="h-5 w-5" />
      Guards List
    </CardTitle>
  </CardHeader>

  <CardContent className="p-0">
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 border-b border-gray-200">
            <TableHead className="text-base font-medium text-gray-800">Name</TableHead>
            <TableHead className="text-base font-medium text-gray-800">Email</TableHead>
            <TableHead className="text-base font-medium text-gray-800">Mobile</TableHead>
            <TableHead className="text-base font-medium text-gray-800">Address</TableHead>
            <TableHead className="text-base font-medium text-gray-800">Joined</TableHead>
            <TableHead className="text-base font-medium text-gray-800 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {guards.map((guard: any) => (
            <TableRow 
              key={guard.id} 
              className="border-b border-gray-100 hover:bg-gray-50 transition"
            >
              
              {/* Name */}
              <TableCell className="py-4">
                <div className="text-gray-900 font-medium text-base truncate max-w-40">
                  {guard.name}
                </div>
              </TableCell>

              {/* Email */}
              <TableCell className="py-4">
                <div className="flex items-center gap-2 truncate max-w-52">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-base text-gray-700 truncate">
                    {guard.email}
                  </span>
                </div>
              </TableCell>

              {/* Mobile */}
              <TableCell className="py-4">
                <div className="flex items-center gap-2 truncate max-w-32">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-base text-gray-700 truncate">
                    {guard.mobile}
                  </span>
                </div>
              </TableCell>

              {/* Address */}
              <TableCell className="py-4">
                <span className="text-base text-gray-600 truncate block max-w-60">
                  {guard.address || "—"}
                </span>
              </TableCell>

              {/* Joined */}
              <TableCell className="py-4">
                <span className="text-base text-gray-600">
                  {formatDate(guard.createdAt)}
                </span>
              </TableCell>

              {/* Actions */}
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

                  {/* <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-9 w-9 p-0 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button 
                    size="sm"
                    variant="ghost"
                    className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-gray-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button> */}
                </div>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

    {guards.length === 0 && (
      <div className="text-center py-12 text-gray-500">
        <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <h3 className="font-medium mb-2">No guards found</h3>
        <p className="text-sm">Try adjusting your search or filter criteria</p>
      </div>
    )}
  </CardContent>
</Card>





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

        {/* Compliance Tab */}
        <TabsContent value="compliance">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Compliance Tracking</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Compact Filters */}
              <div className="flex flex-wrap gap-2 items-center mb-4 bg-gray-50 p-3 rounded-lg border">
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

              {/* Compliance Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Guard</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Description</TableHead>
                      <TableHead className="text-xs">Due Date</TableHead>
                      <TableHead className="text-xs">Priority</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompliance.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="text-sm font-medium">{item.guardName}</div>
                            <div className="text-xs text-gray-500">{item.guardId}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{item.type}</TableCell>
                        <TableCell className="text-sm text-gray-600">{item.description}</TableCell>
                        <TableCell className="text-sm">{item.dueDate}</TableCell>
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

      {/* Add Guard Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Guard</DialogTitle>
            <DialogDescription>
              Enter guard information to add them to your workforce
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
  <div className="space-y-1">
    <Label htmlFor="guardName">Full Name</Label>
    <Input
      id="guardName"
      placeholder="Enter guard name"
      value={formData.name}
      onChange={(e) => handleChange("name", e.target.value)}
    />
  </div>

  <div className="space-y-1">
    <Label htmlFor="guardPhone">Phone</Label>
    <Input
      id="guardPhone"
      placeholder="+1 555-0123"
      value={formData.mobile}
      onChange={(e) => handleChange("mobile", e.target.value)}
    />
  </div>

  <div className="space-y-1">
    <Label htmlFor="guardEmail">Email</Label>
    <Input
      id="guardEmail"
      type="email"
      placeholder="guard@vigilo.com"
      value={formData.email}
      onChange={(e) => handleChange("email", e.target.value)}
    />
  </div>

  <div className="space-y-1">
    <Label htmlFor="guardPassword">Password</Label>
    <Input
      id="guardPassword"
      type="password"
      placeholder="Enter password"
      value={formData.password}
      onChange={(e) => handleChange("password", e.target.value)}
    />
  </div>

  <div className="space-y-1">
    <Label htmlFor="guardAddress">Address</Label>
    <Input
      id="guardAddress"
      placeholder="Enter address"
      value={formData.address}
      onChange={(e) => handleChange("address", e.target.value)}
    />
  </div>
</div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() =>{handleAddingGuard(); setShowAddDialog(false)}}>
              Add Guard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}