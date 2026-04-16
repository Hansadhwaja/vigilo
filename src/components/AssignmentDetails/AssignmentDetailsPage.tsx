import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  ArrowLeft,
  User,
  MapPin,
  Clock,
  Calendar,
  FileText,
  Phone,
  Mail,
  Edit,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Bell,
  Users,
  AlertTriangle,
} from "lucide-react";
import { 
  useGetStaticShiftDetailsForAdminQuery,
  useDeleteScheduleMutation 
} from "../../apis/schedulingAPI";
import EditAssignmentDialog from "../ui/EditAssignmentDialog";
import { toast } from "sonner";

export default function AssignmentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ STATE MANAGEMENT
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // ✅ API HOOKS
  const { data: response, isLoading, isError, refetch } = useGetStaticShiftDetailsForAdminQuery(id || "");
  const [deleteSchedule, { isLoading: isDeleting }] = useDeleteScheduleMutation();

  // ✅ DYNAMIC CALCULATIONS
  const calculations = useMemo(() => {
    if (!response?.data) return null;
    
    const { guards, shift } = response.data;

    // Calculate status distribution
    const statusCounts = {
      accepted: guards.filter(g => g.assignmentStatus.toLowerCase() === 'accepted').length,
      pending: guards.filter(g => g.assignmentStatus.toLowerCase() === 'pending').length,
      active: guards.filter(g => g.assignmentStatus.toLowerCase().includes('active')).length,
      completed: guards.filter(g => g.assignmentStatus.toLowerCase() === 'completed').length,
      overtime_ended: guards.filter(g => g.assignmentStatus.toLowerCase() === 'overtime_ended').length,
    };

    // Calculate guard types
    const guardTypes = {
      patrol: shift.type.toLowerCase() === 'patrol' ? guards.length : 0,
      static: shift.type.toLowerCase() === 'static' ? guards.length : 0,
    };

    // Generate shift code from ID
    const shiftCode = `SCH-${shift.id.slice(0, 8).toUpperCase()}`;

    // Calculate duration
    const start = new Date(shift.startTime);
    const end = new Date(shift.endTime);
    const durationHours = Math.abs(end.getTime() - start.getTime()) / 36e5;

    return {
      statusCounts,
      guardTypes,
      shiftCode,
      durationHours,
    };
  }, [response]);

  // ✅ DELETE HANDLER
  const handleDelete = async () => {
    if (!id) return;

    // Custom toast confirmation
    toast.custom((t) => (
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg max-w-md">
        <div className="flex-1">
          <div className="font-semibold text-red-900">Delete Schedule?</div>
          <div className="text-sm text-red-700 mt-1">
            This will permanently delete shift {calculations?.shiftCode}. This action cannot be undone.
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => toast.dismiss(t)}
            className="px-3 py-1 rounded bg-red-100 hover:bg-red-200 text-red-800 font-medium text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t);
              try {
                const result = await deleteSchedule({ id }).unwrap();
                toast.success(result.message || "Shift deleted successfully!");
                
                setTimeout(() => {
                  navigate("/scheduling");
                }, 500);
              } catch (error: any) {
                console.error("Delete error:", error);
                toast.error(error?.data?.message || "Failed to delete shift");
              }
            }}
            className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  // ✅ EDIT SUCCESS HANDLER
  const handleEditSuccess = () => {
    refetch();
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      active: "bg-blue-500 text-white",
      ongoing: "bg-blue-500 text-white",
      completed: "bg-green-500 text-white",
      cancelled: "bg-red-500 text-white",
      pending: "bg-yellow-500 text-white",
      scheduled: "bg-indigo-500 text-white",
      accepted: "bg-green-500 text-white",
      upcoming: "bg-purple-500 text-white",
      overtime_ended: "bg-orange-500 text-white",
    };
    return statusMap[status?.toLowerCase().replace(/\s+/g, '_')] || "bg-gray-500 text-white";
  };

  const getTypeBadge = (type: string) => {
    return type?.toLowerCase() === "patrol"
      ? "bg-orange-100 text-orange-700"
      : "bg-blue-100 text-blue-700";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 text-lg">Loading shift details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !response?.data) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/scheduling")} 
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Schedule
        </Button>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <p className="text-red-600 font-semibold text-lg mb-2">Failed to load shift details</p>
            <p className="text-gray-600">Shift not found or an error occurred</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { shift, client, order, guards, incidents } = response.data;

  // ✅ Prepare assignment object for EditAssignmentDialog
  const assignmentForEdit = {
    shiftId: shift.id,
    guardId: guards[0]?.id || "",
    guardName: guards[0]?.name || "",
    name: guards[0]?.name || "",
    orderId: shift.orderId || order.id,
    orderLocationName: order.locationName,
    orderName: order.locationName,
    description: shift.description,
    rawStartISO: shift.startTime,
    rawEndISO: shift.endTime,
    start: shift.startTime,
    end: shift.endTime,
    time: `${formatTime(shift.startTime)} - ${formatTime(shift.endTime)}`,
    status: shift.status,
    type: shift.type,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-1">
      <div className="max-w-8xl mx-auto px-0 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate("/scheduling")} 
              className="flex items-center gap-2 hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shift Details</h1>
              <p className="text-xl text-gray-500 mt-1">{calculations?.shiftCode}</p>
            </div>
          </div>
          
          {/* ✅ ACTION BUTTONS */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 hover:bg-gray-100"
              onClick={() => setIsEditDialogOpen(true)}
              disabled={isDeleting}
            >
              <Edit className="h-4 w-4" />
              Edit Shift
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shift Information Card */}
 <Card className="shadow-sm">
  <CardHeader className="pb-4">
    <div className="flex items-start justify-between">
      <div>
        <CardTitle className="text-xl font-semibold text-gray-900">Shift Information</CardTitle>
      </div>
      <div className="flex gap-2">
        <Badge className={`${getTypeBadge(shift.type)} text-xl px-3 py-1 capitalize`}>
          {shift.type}
        </Badge>
        <Badge className={`${getStatusColor(shift.status)} text-xl px-3 py-1`}>
          {shift.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
      </div>
    </div>
  </CardHeader>
  <CardContent className="space-y-6">
    {/* Shift Date & Times */}
    <div className="grid grid-cols-2 gap-6">
      <div>
        <p className="text-lg font-semibold text-gray-900 mb-1">Shift Date</p>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <p className="text-lg text-gray-500">{formatDate(shift.date)}</p>
        </div>
      </div>
      <div>
        <p className="text-lg font-semibold text-gray-900 mb-1">Guards Assigned</p>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-400" />
          <p className="text-lg text-gray-500">
            {guards.length} {guards.length === 1 ? 'Guard' : 'Guards'}
          </p>
        </div>
      </div>
    </div>

    {/* Shift Times */}
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      <h4 className="text-lg font-semibold text-gray-900 mb-3">Shift Times</h4>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-lg font-semibold text-gray-900 mb-1">Start</p>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <p className="text-lg text-gray-500">{formatTime(shift.startTime)}</p>
          </div>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-900 mb-1">End</p>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <p className="text-lg text-gray-500">{formatTime(shift.endTime)}</p>
          </div>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-900 mb-1">Duration</p>
          <p className="text-lg text-gray-500">
            {calculations?.durationHours.toFixed(1)}h
          </p>
        </div>
      </div>
    </div>

    {/* Description */}
    {shift.description && (
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
        <p className="text-lg text-gray-500 leading-relaxed">{shift.description}</p>
      </div>
    )}
  </CardContent>
</Card>

            {/* Client Information Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900">Client Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-lg">
                      {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{client.name}</h3>
                    <div className="space-y-2 mt-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{client.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>+{client.mobile}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Details Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900">Location Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                <p className="text-lg text-gray-900 mb-1">Location Name</p>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-green-600 mt-1 shrink-0" />
                  <h3 className="font-semibold text-gray-900 text-lg">{order.locationName}</h3>
                </div>
                </div>
                <div>
                <p className="text-lg text-gray-900 mb-1">Location Address</p>
                <p className="text-gray-700">{order.locationAddress}</p>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <Badge variant="outline" className="px-3 py-1 capitalize">
                {order.serviceType}
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                {order.guardsRequired} Guard{order.guardsRequired > 1 ? 's' : ''} Required
                </Badge>
              </div>

              {order.description && (
                <div className="pt-3 border-t">
                <p className="text-gray-700">{order.description}</p>
                </div>
              )}
              </CardContent>
            </Card>

            {/* Assigned Guards Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900">
                  Assigned Guards ({guards.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {guards.map((guard) => (
                  <div key={guard.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{guard.name}</h4>
                          <p className="text-xl text-gray-600">{guard.email}</p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(guard.assignmentStatus)}`}>
                        {guard.assignmentStatus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-xl">{guard.phone}</span>
                    </div>

                    {/* Timesheet Section */}
                    <div className="border-t pt-3">
                      <p className="text-xl font-semibold text-gray-700 mb-3">Timesheet</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-lg text-gray-500 mb-1">Clock In</p>
                          <p className="font-medium text-gray-900 text-xl">
                            {guard.timesheet.clockInTime 
                              ? formatTime(guard.timesheet.clockInTime)
                              : "Not clocked in"}
                          </p>
                        </div>
                        <div>
                          <p className="text-lg text-gray-500 mb-1">Clock Out</p>
                          <p className="font-medium text-gray-900 text-xl">
                            {guard.timesheet.clockOutTime 
                              ? formatTime(guard.timesheet.clockOutTime)
                              : "Not clocked out"}
                          </p>
                        </div>
                        <div>
                          <p className="text-lg text-gray-500 mb-1">Total Hours</p>
                          <p className="font-medium text-gray-900 text-xl">
                            {Math.abs(guard.timesheet.totalHours).toFixed(2)} hrs
                          </p>
                        </div>
                        <div>
                          <p className="text-lg text-gray-500 mb-1">Overtime</p>
                          <p className="font-medium text-orange-600 text-xl">
                            {guard.timesheet.overtime.hours.toFixed(2)} hrs
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Incidents Section */}
            {incidents && incidents.length > 0 && (
              <Card className="shadow-sm border-orange-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Incidents ({incidents.length})
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {incidents.map((incident: any, idx: number) => (
                    <div key={idx} className="bg-orange-50 rounded-lg p-4 mb-3 last:mb-0">
                      <p className="text-gray-900">{incident.description || 'No description'}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Real-Time Status */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <CardTitle className="text-lg font-bold text-gray-900">Real-Time Status</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {calculations?.statusCounts.accepted || 0}
                    </p>
                    <p className="text-lg text-gray-600 mt-1">Accepted</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {calculations?.statusCounts.pending || 0}
                    </p>
                    <p className="text-lg text-gray-600 mt-1">Pending</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {calculations?.statusCounts.active || 0}
                    </p>
                    <p className="text-lg text-gray-600 mt-1">Active</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-600">
                      {calculations?.statusCounts.completed || 0}
                    </p>
                    <p className="text-lg text-gray-600 mt-1">Completed</p>
                  </div>
                </div>
                <p className="text-lg text-gray-500 text-center">
                  Updates every 2 seconds
                </p>
              </CardContent>
            </Card>

            {/* Shift Summary */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-900">Shift Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600 text-xl">Total Guards</span>
                  <span className="font-semibold text-gray-900">{guards.length}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600 text-xl">Patrol Guards</span>
                  <span className="font-semibold text-gray-900">{calculations?.guardTypes.patrol || 0}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600 text-xl">Static Guards</span>
                  <span className="font-semibold text-gray-900">{calculations?.guardTypes.static || 0}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 text-xl">Guards Required</span>
                  <span className="font-semibold text-gray-900">{order.guardsRequired}</span>
                </div>
              </CardContent>
            </Card>

            {/* Location Images Card */}
            {order.images && order.images.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-gray-600" />
                    <CardTitle className="text-lg font-bold text-gray-900">Location Images</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {order.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <div className="aspect-square rounded-lg bg-gray-200 overflow-hidden">
                          <img 
                            src={img} 
                            alt={`Location ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/200?text=No+Image';
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-lg text-gray-500 mt-3 text-center">
                    Reference images for guard orientation
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-gray-50">
                  <Bell className="h-4 w-4" />
                  Notify All Guards
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-gray-50">
                  <Phone className="h-4 w-4" />
                  Contact Client
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ✅ EDIT DIALOG */}
      <EditAssignmentDialog
        assignment={assignmentForEdit}
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleEditSuccess}
        guards={guards || []}
        orders={[order]}
      />
    </div>
  );
}
