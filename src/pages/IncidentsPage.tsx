import React from "react";
import { Plus, Eye, MapPin, Clock, User, Camera, MessageSquare, AlertTriangle, CheckCircle, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../components/ui/pagination";
import { useGetAllIncidentsQuery } from "../apis/incidentsApi";
import { useNavigate } from "react-router-dom";


interface IncidentsPageProps {
  list: any[];
  filter: string;
  setFilter: (filter: string) => void;
  onOpen: (record: any) => void;
}

export default function IncidentsPage({ list, filter, setFilter, onOpen }: IncidentsPageProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  //fetch incidents from api
  const { data: incidentsResponse, isLoading, isError, error, isFetching } = useGetAllIncidentsQuery(
      {
        limit: itemsPerPage,
        page: currentPage,
        status: filter === "all" ? undefined : filter,
      },
      {
        // Refetch when any parameter changes
        refetchOnMountOrArgChange: true,
      }
    );
  const incident = incidentsResponse?.data || [];
  console.log("Fetched Incidents:", incident);
  console.log("Incidents Name:", incident[0]?.location?.name);
  
  const filtered = incident.filter((i: any) => {
    const matchesFilter = filter === "all" ? true : i.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = searchTerm === "" ? true : 
      i.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.assigned.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleViewDetails = (incidentId: string) => {
    navigate(`/incidents/${incidentId}`);
  };

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentIncidents = filtered.slice(startIndex, endIndex);

  const getStatusColor = (status?: string) => {
  if (!status) return "bg-gray-100 text-gray-800";
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "in progress": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity?: string) => {
  if (!severity) return "bg-gray-100 text-gray-800";
  switch (severity.toLowerCase()) {
    case "high": return "bg-red-100 text-red-800";
    case "medium": return "bg-orange-100 text-orange-800";
    case "low": return "bg-gray-100 text-gray-800";
    default: return "bg-gray-100 text-gray-800";
  }
};


  const getReporterIcon = (reportedBy: string) => {
    switch (reportedBy.toLowerCase()) {
      case "guard": return <User className="h-4 w-4 text-blue-600" />;
      case "client": return <User className="h-4 w-4 text-green-600" />;
      case "system": return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">Loading Incidents...</p>
        </div>
      </div>
    );
  }
  
  
  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-1">Incident Management</h1>
          <p className="text-gray-600 text-sm">View and manage incidents raised by guards and clients</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
          <Clock className="h-5 w-5 text-yellow-600" />
          <div>
            <div className="font-bold text-yellow-700">{incident.filter(i => i.status === "Pending").length}</div>
            <div className="text-xs text-yellow-600">Pending</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <div className="font-bold text-green-700">{incident.filter(i => i.status === "Resolved").length}</div>
            <div className="text-xs text-green-600">Resolved</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <div>
            <div className="font-bold text-red-700">{incident.filter(i => i.severity === "High").length}</div>
            <div className="text-xs text-red-600">High Priority</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
          <Calendar className="h-5 w-5 text-blue-600" />
          <div>
            <div className="font-bold text-blue-700">{incident.filter(i => {
              const today = new Date();
              const incidentDate = new Date(i.time);
              return incidentDate.toDateString() === today.toDateString();
            }).length}</div>
            <div className="text-xs text-blue-600">Today</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Incidents</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="in progress">In Progress</SelectItem>
          </SelectContent>
        </Select>
        
        <Input
          placeholder="Search incidents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
        />
        
        <div className="ml-auto text-sm text-gray-600">
          Showing {currentIncidents.length} of {filtered.length} incidents (Page {currentPage} of {totalPages})
        </div>
      </div>

      {/* Incidents Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Incident Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  {/* <TableHead className="text-sm text-gray-700">Incident ID</TableHead> */}
                  <TableHead className="text-sm text-gray-700">Location</TableHead>
                  <TableHead className="text-sm text-gray-700">Description</TableHead>
                  <TableHead className="text-sm text-gray-700">Assigned Guard</TableHead>
                  <TableHead className="text-sm text-gray-700">Date/Time</TableHead>
                  <TableHead className="text-sm text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentIncidents.map((incident: any) => (
                  <TableRow key={incident.id} className="border-b border-gray-100 hover:bg-gray-50">
                    {/* <TableCell className="py-4">
                      <span className="font-medium text-blue-600">{incident.id}</span>
                    </TableCell> */}
                    
                    <TableCell className="py-4">
                      <div>
                        
                        <div className="text-lg text-gray-900 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          {incident.location?.name}
                        </div>
                      </div>
                    </TableCell>             
                    
                    <TableCell className="py-4">
                      <div className="font-medium text-gray-900">{incident.site}</div>
                    </TableCell>
                    
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                           <span className="text-white font-medium text-xs">
                            {incident.assigned
                              ? incident.assigned
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                                  .slice(0, 2)
                              : "NA"}
                          </span>
                        </div>
                        <span className="text-sm text-gray-700">{incident.assigned || "Not Assigned"}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="py-4">
                      <div>
                        <div className="text-sm text-gray-900">
                          {new Date(incident.time).toLocaleDateString('en-US', { 
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          })}
                        </div>
                        <div className="text-sm text-gray-500 mt-0.5">
                          {new Date(incident.time).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(incident.id)}
                        className="h-8 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {currentIncidents.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="font-medium mb-2">No incidents found</h3>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}