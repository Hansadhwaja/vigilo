import React from "react";
import { ArrowLeft, Phone, Mail, MapPin, User, Building, Clock, AlertCircle, Calendar, Activity, ExternalLink, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { useNavigate, useParams } from "react-router-dom";
import { useGetGuardByIdQuery } from "../apis/guardsApi";
import { getStatusColor, getStatusStyle } from "../utils/statusColors";
import { Label } from "../components/ui/label";

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading Guard Details...</p>
        </div>
      </div>
    );
  }

  if (isError || !guard) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-8xl mx-auto px-6 py-8">
          <Button variant="outline" onClick={handleBack} className="mb-6 text-lg px-6 py-2">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Guards
          </Button>
          <div className="text-center py-16">
            <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Failed to Load Guard Details</h2>
            <p className="text-lg mb-6 text-gray-600">
              {error && 'data' in error ? JSON.stringify(error.data) : 'Guard not found'}
            </p>
            <Button onClick={handleBack} className="text-lg px-6 py-2">Return to Guards List</Button>
          </div>
        </div>
      </div>
    );
  }

  const totalShifts = activity.length;
  const completedShifts = activity.filter((a: any) => a.shiftStatus === 'completed' || a.shiftStatus === 'overtime_ended').length;
  const totalHoursWorked = activity.reduce((sum: number, a: any) => sum + Math.abs(a.timesheet?.totalHours || 0), 0);
  const totalOvertimeHours = activity.reduce((sum: number, a: any) => sum + (a.timesheet?.overtime?.hours || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-8xl mx-auto px-0 py-0">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="flex items-center gap-2 hover:bg-white text-lg px-4 py-2"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back</span>
              </Button>

              <div className="h-8 w-px bg-gray-300" />

              <div>
                <div className="flex items-center gap-4">
                  <User className="h-7 w-7 text-blue-600" />
                  <h1 className="text-3xl font-bold text-gray-900">{guard.name}</h1>
                </div>
                <p className="text-lg text-gray-600 mt-2 ml-11">
                  Complete guard profile with contact information and shift history
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <a href={`tel:${guard.mobile}`}>
                <Button variant="outline" className="text-lg font-medium px-5 py-2.5 h-auto border-2">
                  <Phone className="h-5 w-5 mr-2" />
                  Call
                </Button>
              </a>
              <a href={`mailto:${guard.email}`}>
                <Button variant="outline" className="text-lg font-medium px-5 py-2.5 h-auto border-2">
                  <Mail className="h-5 w-5 mr-2" />
                  Email
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT - Main Content (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="border-2 border-gray-200 shadow-sm bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Activity className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Shifts</p>
                      <p className="text-2xl font-bold text-gray-900">{totalShifts}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 shadow-sm bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <Activity className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Completed</p>
                      <p className="text-2xl font-bold text-gray-900">{completedShifts}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 shadow-sm bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Hours</p>
                      <p className="text-2xl font-bold text-gray-900">{totalHoursWorked.toFixed(0)}h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 shadow-sm bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Overtime</p>
                      <p className="text-2xl font-bold text-gray-900">{totalOvertimeHours.toFixed(1)}h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Shift Activity History */}
            <Card className="border-2 border-gray-200 shadow-sm bg-white">
              <CardHeader className="border-b-2 border-gray-200 pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-900">
                  <Calendar className="h-6 w-6" />
                  Shift Activity History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {activity.length === 0 ? (
                  <div className="text-center py-16">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Activity History</h3>
                    <p className="text-lg text-gray-500">This guard hasn't been assigned to any shifts yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activity.map((shift: any, index: number) => (
                      <div
                        key={index}
                        className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all bg-white"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Building className="h-5 w-5 text-blue-600" />
                              <h3 className="text-lg font-bold text-gray-900 capitalize">{shift.order.locationName}</h3>
                              <Badge
                                className="text-sm px-3 py-1 border-2"
                                style={getStatusStyle(shift.assignmentStatus)}
                              >
                                {getStatusColor(shift.assignmentStatus).label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 ml-8">
                              <MapPin className="h-4 w-4" />
                              <span className="capitalize">{shift.order.locationAddress}</span>
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

                        <Separator className="my-4" />

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-gray-50 rounded-lg p-3 border">
                            <p className="text-sm text-gray-600 mb-1">Date</p>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span className="text-lg font-semibold">{formatDate(shift.date)}</span>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3 border">
                            <p className="text-sm text-gray-600 mb-1">Service Type</p>
                            <span className="text-lg font-semibold capitalize">
                              {shift.order.serviceType.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3 border">
                            <p className="text-sm text-gray-600 mb-1">Start Time</p>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-green-500" />
                              <span className="text-lg font-semibold">{formatTime(shift.startTime)}</span>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3 border">
                            <p className="text-sm text-gray-600 mb-1">End Time</p>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-red-500" />
                              <span className="text-lg font-semibold">{formatTime(shift.endTime)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Timesheet */}
                        <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-100">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-600" />
                            Timesheet Details
                          </h4>
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Clock In</p>
                              <p className="text-lg font-semibold">
                                {shift.timesheet.clockInTime ? formatDateTime(shift.timesheet.clockInTime) : "—"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Clock Out</p>
                              <p className="text-lg font-semibold">
                                {shift.timesheet.clockOutTime ? formatDateTime(shift.timesheet.clockOutTime) : "—"}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-lg p-3 border-2 border-blue-200">
                              <p className="text-sm text-gray-600 mb-1">Total Hours</p>
                              <p className="text-lg font-bold text-blue-600">
                                {Math.abs(shift.timesheet.totalHours).toFixed(2)}h
                              </p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border-2 border-orange-200">
                              <p className="text-sm text-gray-600 mb-1">Overtime Hours</p>
                              <p className="text-lg font-bold text-orange-600">
                                {shift.timesheet.overtime?.hours?.toFixed(2) || '0.00'}h
                              </p>
                            </div>
                          </div>

                          {shift.timesheet.overtime && shift.timesheet.overtime.hours > 0 && shift.timesheet.overtime.startTime && (
                            <div className="mt-3 pt-3 border-t-2 border-blue-200">
                              <p className="text-sm text-gray-600 mb-2 font-medium">Overtime Period</p>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-semibold">
                                  {formatDateTime(shift.timesheet.overtime.startTime)}
                                </span>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                                <span className="font-semibold">
                                  {shift.timesheet.overtime.endTime ? formatDateTime(shift.timesheet.overtime.endTime) : "Ongoing"}
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

          {/* RIGHT - Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="border-2 border-gray-200 shadow-sm bg-white">
              <CardHeader className="border-b-2 border-gray-200 pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-900">
                  <User className="h-6 w-6" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="text-lg font-semibold text-gray-900 w-20">Phone:</div>
                  <div className="text-lg text-gray-700">{guard.mobile}</div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-lg font-semibold text-gray-900 w-20">Email:</div>
                  <div className="text-lg text-gray-700 break-all">{guard.email}</div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-lg font-semibold text-gray-900 w-20">Address:</div>
                  <div className="text-lg text-gray-700">{guard.address}</div>
                </div>
              </CardContent>
            </Card>

            {/* Employment Details */}
            <Card className="border-2 border-gray-200 shadow-sm bg-white">
              <CardHeader className="border-b-2 border-gray-200 pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-900">
                  <Calendar className="h-6 w-6" />
                  Employment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label className="text-lg font-semibold text-gray-900 mb-2 block">Joined Date</Label>
                  <div className="text-lg text-gray-700">{formatDate(guard.createdAt)}</div>
                </div>
                <div>
                  <Label className="text-lg font-semibold text-gray-900 mb-2 block">Guard ID</Label>
                  <div className="text-sm text-gray-600 font-mono break-all leading-relaxed">{guard.id}</div>
                </div>
                {totalShifts > 0 && (
                  <div>
                    <Label className="text-lg font-semibold text-gray-900 mb-2 block">Completion Rate</Label>
                    <div className="text-lg text-gray-700">
                      {Math.round((completedShifts / totalShifts) * 100)}% ({completedShifts}/{totalShifts} shifts)
                    </div>
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
