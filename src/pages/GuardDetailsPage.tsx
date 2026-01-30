import React from "react";
import { ArrowLeft, Phone, Mail, MapPin, User, Building, Clock, AlertCircle, Calendar, Award, Activity, TrendingUp, ExternalLink, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { useNavigate, useParams } from "react-router-dom";
import { useGetGuardByIdQuery } from "../apis/guardsApi";

export default function GuardDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: guardResponse, isLoading, isError, error } = useGetGuardByIdQuery(id || "", {
    skip: !id,
  });

  const guardData = guardResponse?.data;
  const guard = guardData?.guard;
  const activity = guardData?.activity || [];

  const handleBack = () => {
    navigate("/hr");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      active: "bg-blue-500 text-white",
      ongoing: "bg-blue-500 text-white",
      completed: "bg-green-500 text-white",
      cancelled: "bg-red-500 text-white",
      pending: "bg-yellow-600 text-white",
      scheduled: "bg-indigo-500 text-white",
      accepted: "bg-green-500 text-white",
      upcoming: "bg-purple-500 text-white",
      overtime_ended: "bg-orange-500 text-white",
    };
    return statusMap[status?.toLowerCase().replace(/\s+/g, '_')] || "bg-gray-500 text-white";
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-lg text-gray-600">Loading guard details...</p>
        </div>
      </div>
    );
  }

  if (isError || !guard) {
    return (
      <div className="h-screen">
        <div className="p-6">
          <Button variant="outline" onClick={handleBack} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Guards
          </Button>
          <div className="text-center py-16">
            <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Failed to Load Guard Details</h2>
            <p className="text-lg mb-6">
              {error && 'data' in error ? JSON.stringify(error.data) : 'Guard not found'}
            </p>
            <Button onClick={handleBack}>Return to Guards List</Button>
          </div>
        </div>
      </div>
    );
  }

  const totalShifts = activity.length;
  const completedShifts = activity.filter((a: any) => a.shiftStatus === 'completed').length;
  const totalHoursWorked = activity.reduce((sum: number, a: any) => sum + Math.abs(a.timesheet?.totalHours || 0), 0);
  const totalOvertimeHours = activity.reduce((sum: number, a: any) => sum + (a.timesheet?.overtime?.hours || 0), 0);

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* FIXED HEADER - Name on Left, Stats on Right */}
      <div className="flex-shrink-0 bg-white border-b shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* LEFT: Back Button + Name */}
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleBack} size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Separator orientation="vertical" className="h-10" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{guard.name}</h1>
                <p className="text-xl text-gray-500">ID: {guard.id.slice(0, 12).toUpperCase()}</p>
              </div>
            </div>

            {/* RIGHT: Stats Cards (Compact) */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg px-4 py-2 shadow">
                <Activity className="h-5 w-5 opacity-80" />
                <div>
                  <p className="text-lg opacity-90">Shifts</p>
                  <p className="text-xl font-bold">{totalShifts}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg px-4 py-2 shadow">
                <Award className="h-5 w-5 opacity-80" />
                <div>
                  <p className="text-lg opacity-90">Done</p>
                  <p className="text-xl font-bold">{completedShifts}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg px-4 py-2 shadow">
                <Clock className="h-5 w-5 opacity-80" />
                <div>
                  <p className="text-lg opacity-90">Hours</p>
                  <p className="text-xl font-bold">{totalHoursWorked.toFixed(0)}h</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg px-4 py-2 shadow">
                <TrendingUp className="h-5 w-5 opacity-80" />
                <div>
                  <p className="text-lg opacity-90">OT</p>
                  <p className="text-xl font-bold">{totalOvertimeHours.toFixed(1)}h</p>
                </div>
              </div>

              <Separator orientation="vertical" className="h-10 mx-2" />

              <a href={`tel:${guard.mobile}`}>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              </a>
              <a href={`mailto:${guard.email}`}>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex gap-6 p-6">
          {/* LEFT SIDEBAR - FIXED */}
          <div className="w-80 flex-shrink-0">
            <Card className="sticky top-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-indigo-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border">
                    <Phone className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-lg text-gray-500 mb-1">Phone</p>
                      <p className="text-xl font-semibold text-gray-900">{guard.mobile}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border">
                    <Mail className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-lg text-gray-500 mb-1">Email</p>
                      <p className="text-xl font-semibold text-gray-900 break-words">{guard.email}</p>
                    </div>
                  </div>
                  
                  {guard.address && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border">
                      <MapPin className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-lg text-gray-500 mb-1">Address</p>
                        <p className="text-xl font-semibold text-gray-900">{guard.address}</p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Employment Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-xl text-gray-600">Joined</span>
                      <span className="text-xl font-semibold text-gray-900">{formatDate(guard.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-xl text-gray-600">Total Shifts</span>
                      <span className="text-xl font-semibold text-blue-600">{totalShifts}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-xl text-gray-600">Success Rate</span>
                      <span className="text-xl font-semibold text-green-600">
                        {totalShifts > 0 ? Math.round((completedShifts / totalShifts) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT CONTENT - SCROLLABLE with HIDDEN SCROLLBAR */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <style>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
            
            <Card className="shadow-lg">
              <CardHeader className="bg-linear-to-r from-gray-50 to-blue-50 border-b pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Calendar className="h-6 w-6 text-blue-600" />
                    Shift Activity History
                  </CardTitle>
                  <Badge variant="secondary" className="text-xl px-3 py-1">
                    {activity.length} Records
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {activity.length === 0 ? (
                  <div className="text-center py-16">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Activity History</h3>
                    <p className="text-base text-gray-500">This guard hasn't been assigned to any shifts yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activity.map((shift: any, index: number) => (
                      <div 
                        key={index} 
                        className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all bg-white"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Building className="h-4 w-4 text-blue-600" />
                              <h3 className="text-lg font-bold text-gray-900">{shift.order.locationName}</h3>
                              <Badge className={`${getStatusColor(shift.assignmentStatus)} text-lg px-2 py-0.5`}>
                                {shift.assignmentStatus.replace(/_/g, ' ').toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xl text-gray-600 ml-6">
                              <MapPin className="h-3 w-3" />
                              <span>{shift.order.locationAddress}</span>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/scheduling/${shift.shiftId}`)}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>

                        <Separator className="my-3" />

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="bg-gray-50 rounded p-2">
                            <p className="text-lg text-gray-500 mb-1">Date</p>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-blue-500" />
                              <span className="text-xl font-semibold">{formatDate(shift.date)}</span>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 rounded p-2">
                            <p className="text-lg text-gray-500 mb-1">Type</p>
                            <span className="text-xl font-semibold capitalize">{shift.order.serviceType}</span>
                          </div>
                          
                          <div className="bg-gray-50 rounded p-2">
                            <p className="text-lg text-gray-500 mb-1">Start</p>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-green-500" />
                              <span className="text-xl font-semibold">{formatTime(shift.startTime)}</span>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 rounded p-2">
                            <p className="text-lg text-gray-500 mb-1">End</p>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-red-500" />
                              <span className="text-xl font-semibold">{formatTime(shift.endTime)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Timesheet */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                          <h4 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            Timesheet
                          </h4>
                          <div className="grid grid-cols-2 gap-3 mb-2">
                            <div>
                              <p className="text-lg text-gray-600 mb-1">Clock In</p>
                              <p className="text-xl font-semibold">
                                {shift.timesheet.clockInTime ? formatDateTime(shift.timesheet.clockInTime) : "—"}
                              </p>
                            </div>
                            <div>
                              <p className="text-lg text-gray-600 mb-1">Clock Out</p>
                              <p className="text-xl font-semibold">
                                {shift.timesheet.clockOutTime ? formatDateTime(shift.timesheet.clockOutTime) : "—"}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white rounded p-2 border border-blue-200">
                              <p className="text-lg text-gray-600 mb-1">Total Hours</p>
                              <p className="text-lg font-bold text-blue-600">
                                {Math.abs(shift.timesheet.totalHours).toFixed(2)}h
                              </p>
                            </div>
                            <div className="bg-white rounded p-2 border border-orange-200">
                              <p className="text-lg text-gray-600 mb-1">Overtime</p>
                              <p className="text-lg font-bold text-orange-600">
                                {shift.timesheet.overtime?.hours.toFixed(2) || '0.00'}h
                              </p>
                            </div>
                          </div>

                          {shift.timesheet.overtime && shift.timesheet.overtime.hours > 0 && (
                            <div className="mt-2 pt-2 border-t border-blue-200">
                              <p className="text-lg text-gray-600 mb-1 font-medium">Overtime Period</p>
                              <div className="flex items-center gap-2 text-lg">
                                <span className="font-semibold">
                                  {formatDateTime(shift.timesheet.overtime.startTime)}
                                </span>
                                <ChevronRight className="h-3 w-3 text-gray-400" />
                                <span className="font-semibold">
                                  {formatDateTime(shift.timesheet.overtime.endTime)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
