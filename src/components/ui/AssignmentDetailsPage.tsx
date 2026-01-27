import React from "react";
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
  ImageIcon,
} from "lucide-react";
import { useGetStaticShiftDetailsForAdminQuery } from "../../apis/schedulingAPI";

export default function AssignmentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ Fetch from API using RTK Query
  const { data: response, isLoading, isError } = useGetStaticShiftDetailsForAdminQuery(id || "");

  // Helper functions
  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      active: "bg-blue-100 text-blue-700 border-blue-300",
      ongoing: "bg-blue-100 text-blue-700 border-blue-300",
      completed: "bg-green-100 text-green-700 border-green-300",
      cancelled: "bg-red-100 text-red-700 border-red-300",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
      upcoming: "bg-purple-100 text-purple-700 border-purple-300",
    };
    return statusMap[status?.toLowerCase()] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  const getTypeColor = (type: string) => {
    return type?.toLowerCase() === "patrol"
      ? "bg-orange-100 text-orange-700 border-orange-300"
      : "bg-green-100 text-green-700 border-green-300";
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
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading shift details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !response?.data) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => navigate("/scheduling")} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Schedule
        </Button>
        <Card className="border-red-200">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 font-semibold mb-2">Failed to load shift details</p>
            <p className="text-gray-600 text-sm">Shift not found or an error occurred</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { shift, client, order, guards } = response.data;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate("/scheduling")} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Schedule
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-bold mb-2">Shift Assignment Details</CardTitle>
              <div className="flex gap-2">
                <Badge className={getStatusColor(shift.status)}>{shift.status}</Badge>
                <Badge className={getTypeColor(shift.type)}>{shift.type}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Client Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-purple-600" />
              Client Information
            </h3>
            <div className="bg-purple-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{client.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{client.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{client.mobile}</span>
              </div>
            </div>
          </div>

          {/* Guards Information */}
          {guards.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Assigned Guards ({guards.length})
              </h3>
              <div className="space-y-3">
                {guards.map((guard) => (
                  <div key={guard.id} className="bg-blue-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{guard.name}</span>
                      </div>
                      <Badge className={getStatusColor(guard.assignmentStatus)}>
                        {guard.assignmentStatus}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{guard.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{guard.phone}</span>
                    </div>

                    {/* Timesheet */}
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <div className="text-sm font-medium text-gray-700 mb-2">Timesheet</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Clock In:</span>{" "}
                          <span className="font-medium">
                            {guard.timesheet.clockInTime ? formatTime(guard.timesheet.clockInTime) : "Not clocked in"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Clock Out:</span>{" "}
                          <span className="font-medium">
                            {guard.timesheet.clockOutTime ? formatTime(guard.timesheet.clockOutTime) : "Not clocked out"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Total Hours:</span>{" "}
                          <span className="font-medium">{guard.timesheet.totalHours} hrs</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Overtime:</span>{" "}
                          <span className="font-medium">{guard.timesheet.overtime.hours} hrs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Location Details
            </h3>
            <div className="bg-green-50 rounded-lg p-4 space-y-3">
              <div>
                <div className="font-medium text-lg">{order.locationName}</div>
                <div className="text-gray-600">{order.locationAddress}</div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="bg-white">{order.serviceType}</Badge>
                <Badge variant="outline" className="bg-white">
                  {order.guardsRequired} Guard{order.guardsRequired > 1 ? "s" : ""} Required
                </Badge>
              </div>
              {order.siteService?.coordinates && (
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Coordinates:</span> {order.siteService.coordinates[1]}, {order.siteService.coordinates[0]}
                </div>
              )}
              {order.images?.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Site Images ({order.images.length})
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {order.images.map((img, idx) => (
                      <a
                        key={idx}
                        href={img}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Image {idx + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Schedule
            </h3>
            <div className="bg-purple-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Start Date</div>
                  <div className="font-medium">{formatDate(shift.date)}</div>
                </div>
                {shift.endDate && shift.endDate !== shift.date && (
                  <div>
                    <div className="text-sm text-gray-500">End Date</div>
                    <div className="font-medium">{formatDate(shift.endDate)}</div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Start Time</div>
                  <div className="font-medium">{formatTime(shift.startTime)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">End Time</div>
                  <div className="font-medium">{formatTime(shift.endTime)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {shift.description && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                Description
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{shift.description}</p>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t text-sm text-gray-500">
            Created on: {formatDate(shift.createdAt)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
