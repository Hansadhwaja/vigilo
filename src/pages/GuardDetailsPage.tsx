import React from "react";
import { ArrowLeft, Send, Edit, Phone, Mail, MapPin, User, Building, Award, CheckCircle, FileText, AlertCircle, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { useNavigate, useParams } from "react-router-dom";
import { useGetGuardByIdQuery } from "../apis/guardsApi";

export default function GuardDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Fetch guard details from API
  const { data: guardResponse, isLoading, isError, error } = useGetGuardByIdQuery(id || "", {
    skip: !id, // Skip query if no id is provided
  });

  const guard = guardResponse?.data;

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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">Loading guard details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError || !guard) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 mb-4"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Guards
          </Button>
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Guard Details</h2>
            <p className="text-gray-600 mb-4">
              {error && 'data' in error ? JSON.stringify(error.data) : 'Guard not found or an error occurred'}
            </p>
            <Button onClick={handleBack}>Return to Guards List</Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-50 shadow-sm py-1">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Guards
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold">{guard.name}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Assignment */}
            {guard.latestStatic && (
              <Card className="border-2 border-blue-100">
                <CardHeader className="bg-blue-50 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-blue-600" />
                      Last Assignment
                    </CardTitle>
                    {/* <Badge className={getStatusColor(guard.latestStatic.status)}>
                      {guard.latestStatic.status}
                    </Badge> */}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Assignment Type</div>
                        <div className="font-semibold text-lg capitalize">{guard.latestStatic.type}</div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Description</div>
                        <div className="text-gray-900">{guard.latestStatic.description}</div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Location</div>
                        <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
                          <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-semibold">{guard.latestStatic.Order.locationAddress}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              Service Type: <span className="font-medium capitalize">{guard.latestStatic.Order.serviceType}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Start Time</div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-green-600" />
                            <span className="font-semibold">{formatDateTime(guard.latestStatic.startTime)}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">End Time</div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-red-600" />
                            <span className="font-semibold">{formatDateTime(guard.latestStatic.endTime)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm text-blue-900">
                          <span className="font-semibold">Order ID:</span> {guard.latestStatic.orderId}
                        </div>
                        <div className="text-sm text-blue-900 mt-1">
                          <span className="font-semibold">Assignment ID:</span> {guard.latestStatic.id}
                        </div>
                      </div> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No Current Assignment */}
            {!guard.latestStatic && (
              <Card className="border-2 border-gray-200">
                <CardHeader className="bg-gray-50 pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-gray-600" />
                    Last Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No active assignment</p>
                    <p className="text-sm text-gray-500 mt-1">This guard is currently available</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Address Information */}
            {guard.address && (
              <Card className="border-2 border-green-100">
                <CardHeader className="bg-green-50 pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    Address Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <div className="text-gray-900">{guard.address}</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Right Side (1/3) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Information */}
            <Card className="border-2 border-indigo-100 lg:sticky lg:top-24">
              <CardHeader className="bg-indigo-50 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-600" />
                  Contact Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border-2 border-gray-200">
                    <Phone className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Phone Number</div>
                      <div className="font-semibold">{guard.mobile}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border-2 border-gray-200">
                    <Mail className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs text-gray-600 mb-1">Email Address</div>
                      <div className="font-semibold text-sm break-all">{guard.email}</div>
                    </div>
                  </div>
                  {guard.address && (
                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border-2 border-gray-200">
                      <MapPin className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Address</div>
                        <div className="font-semibold text-sm">{guard.address}</div>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Quick Actions */}
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</div>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-indigo-50"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-indigo-50"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Reports
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Employment Details */}
            <Card className="border-2 border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4 text-gray-600" />
                  Employment Info
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Joined Date</span>
                  <span className="font-semibold text-sm">{formatDate(guard.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Employee ID</span>
                  <span className="font-semibold text-sm font-mono break-all">{guard.id}</span>
                </div>
                {guard.latestStatic && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    {/* <span className="text-sm text-gray-600">Status</span>
                    <Badge className={getStatusColor(guard.latestStatic.status)}>
                      {guard.latestStatic.status}
                    </Badge> */}
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