import React from "react";
import { ArrowLeft, AlertTriangle, MapPin, Clock, User, Camera, MessageSquare, Shield, FileText, CheckCircle, Clock4 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";

interface IncidentDetailsPageProps {
  incident: any;
  onBack: () => void;
}

export default function IncidentDetailsPage({ incident, onBack }: IncidentDetailsPageProps) {
  if (!incident) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="font-medium mb-2">No incident selected</h3>
          <p className="text-sm text-gray-500">Please select an incident to view details</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved": return "bg-green-100 text-green-800 border-green-200";
      case "in progress": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-orange-100 text-orange-800 border-orange-200";
      case "low": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getReporterIcon = (reportedBy: string) => {
    switch (reportedBy.toLowerCase()) {
      case "guard": return <User className="h-5 w-5 text-blue-600" />;
      case "client": return <User className="h-5 w-5 text-green-600" />;
      case "system": return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      default: return <User className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Incidents
        </Button>
        
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h1 className="text-2xl font-bold">Incident Details</h1>
            <Badge className={`${getStatusColor(incident.status)}`}>
              {incident.status}
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">
            Complete incident report with evidence and guard documentation
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Add Note
          </Button>
          <Button 
            className={
              incident.status === "Resolved" 
                ? "bg-yellow-600 hover:bg-yellow-700" 
                : "bg-green-600 hover:bg-green-700"
            }
          >
            {incident.status === "Resolved" ? "Reopen Incident" : "Mark Resolved"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Incident Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Incident ID</Label>
                  <div className="text-2xl font-bold text-blue-600 mt-1">{incident.id}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Type</Label>
                  <div className="mt-1">
                    <Badge variant="outline" className="text-base px-3 py-1">
                      {incident.type}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Severity Level</Label>
                  <div className="mt-1">
                    <Badge className={`text-base px-3 py-1 ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Priority</Label>
                  <div className="mt-1">
                    <Badge variant="outline" className="text-base px-3 py-1">
                      Level {incident.priorityLevel}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Location Details */}
              <div>
                <Label className="text-lg font-medium text-gray-900 mb-3 block">Location Information</Label>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-lg">{incident.site}</div>
                      <div className="text-gray-600 mt-1">{incident.location?.name}</div>
                      {incident.location?.coordinates && (
                        <div className="text-sm text-gray-500 mt-2 font-mono">
                          GPS: {incident.location.coordinates.lat.toFixed(6)}, {incident.location.coordinates.lng.toFixed(6)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Date and Time */}
              <div>
                <Label className="text-lg font-medium text-gray-900 mb-3 block">Date & Time</Label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium text-lg">
                        {new Date(incident.time).toLocaleDateString('en-AU', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-gray-600 mt-1">
                        {new Date(incident.time).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guard Report */}
          {incident.guardMessage && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Guard Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-lg">{incident.assigned}</div>
                        <div className="text-sm text-gray-600">Responding Guard</div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded border">
                      <p className="text-gray-800 leading-relaxed text-base">
                        {incident.guardMessage}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock4 className="h-4 w-4" />
                      <span>Reported at {new Date(incident.time).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Additional Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {incident.description && (
                <div>
                  <Label className="text-base font-medium text-gray-900">Description</Label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-800 leading-relaxed">{incident.description}</p>
                  </div>
                </div>
              )}
              
              {incident.actionsTaken && (
                <div>
                  <Label className="text-base font-medium text-gray-900">Actions Taken</Label>
                  <div className="mt-2 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <p className="text-gray-800 leading-relaxed">{incident.actionsTaken}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(incident.status)}`}>
                  {incident.status === "Resolved" ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Clock4 className="h-5 w-5" />
                  )}
                  <span className="font-medium">{incident.status}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-white rounded border">
                  <div className="text-xs text-gray-500">Severity</div>
                  <div className="font-medium mt-1">{incident.severity}</div>
                </div>
                <div className="p-3 bg-white rounded border">
                  <div className="text-xs text-gray-500">Priority</div>
                  <div className="font-medium mt-1">Level {incident.priorityLevel}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Personnel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personnel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Assigned Guard</Label>
                  <div className="flex items-center gap-3 mt-2 p-3 bg-blue-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{incident.assigned}</div>
                      <div className="text-xs text-gray-600">Primary Responder</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-600">Reported By</Label>
                  <div className="flex items-center gap-3 mt-2 p-3 bg-gray-50 rounded-lg">
                    {getReporterIcon(incident.reportedBy)}
                    <div>
                      <div className="font-medium">{incident.reporterName}</div>
                      <div className="text-xs text-gray-600">{incident.reportedBy}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photo Evidence */}
          {incident.photo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Evidence Photo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border rounded-lg overflow-hidden">
                    <img 
                      src={incident.photo} 
                      alt="Incident evidence" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    Photo taken by {incident.assigned}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Client Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-600">Client Notified</Label>
                  <Badge className={incident.clientNotified 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                  }>
                    {incident.clientNotified ? "Yes" : "No"}
                  </Badge>
                </div>
                
                {incident.clientNotified && (
                  <div className="text-xs text-gray-500 p-2 bg-green-50 rounded">
                    Client has been informed of this incident and current status.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}