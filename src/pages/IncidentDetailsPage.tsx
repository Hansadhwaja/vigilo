import React, { useState } from "react";
import { ArrowLeft, AlertTriangle, MapPin, Clock, User, Camera, MessageSquare, Shield, FileText, CheckCircle, Clock4, ZoomIn, X, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Dialog, DialogContent } from "../components/ui/dialog";
import { useNavigate, useParams } from "react-router-dom";
import { useGetIncidentByIdQuery } from "../apis/incidentsApi";
import { getStatusColor, getStatusStyle } from "../utils/statusColors";

// Helper functions
const formatDate = (iso?: string) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
};

const formatDateTime = (iso?: string) => {
  if (!iso) return { date: "—", time: "—" };
  try {
    const date = new Date(iso);
    return {
      date: date.toLocaleDateString("en-AU", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
  } catch {
    return { date: iso, time: "—" };
  }
};

export default function IncidentDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Image viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch incident details from API
  const { data: incidentResponse, isLoading, isError, error } = useGetIncidentByIdQuery(id || "", {
    skip: !id,
  });

  const incident = incidentResponse?.data;
  console.log("Incident Data:", incident);

  const onBack = () => {
    navigate("/incidents");
  };

  // Open image viewer
  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setViewerOpen(true);
  };

  // Navigate images in viewer
  const goToNextImage = () => {
    const images = incident?.images || [];
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const goToPreviousImage = () => {
    const images = incident?.images || [];
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!incident && !isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold mb-2">No incident found</h3>
          <p className="text-lg text-gray-500">Please select an incident to view details</p>
          <div className="mt-6">
            <Button variant="outline" onClick={onBack} className="text-lg px-6 py-2">
              Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading Incident Details...</p>
        </div>
      </div>
    );
  }

  const currentImages = incident?.images || [];
  // ✅ CHANGED: Use createdAt instead of time
  const dateTime = formatDateTime(incident?.createdAt);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-8xl mx-auto px-0 py-0">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                onClick={onBack}
                className="flex items-center gap-2 hover:bg-white text-lg px-4 py-2"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back</span>
              </Button>

              <div className="h-8 w-px bg-gray-300" />

              <div>
                <div className="flex items-center gap-4">
                  <AlertTriangle className="h-7 w-7 text-red-600" />
                  <h1 className="text-3xl font-bold text-gray-900">Incident Details</h1>
                  {incident?.status && (
                    <Badge
  className="border-2 text-lg font-semibold px-4 py-1.5"
  style={getStatusStyle(incident.status)}
>
  {getStatusColor(incident.status).label}
</Badge>

                  )}
                </div>
                <p className="text-lg text-gray-600 mt-2 ml-11">
                  Full incident information including location and evidence documentation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Incident Information Card */}
            <Card className="border-2 border-gray-200 shadow-sm bg-white">
              <CardHeader className="border-b-2 border-gray-200 pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-900">
                  <FileText className="h-6 w-6" />
                  Incident Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  {/* Incident Name - ✅ CHANGED: Use name directly from API */}
                  <div className="col-span-2">
                    <Label className="text-lg font-semibold text-gray-900 mb-2 block">Incident Name</Label>
                    <div className="text-lg text-gray-700 capitalize">
                      {incident?.name || "—"}
                    </div>
                  </div>

                  {/* Severity - Keep if exists */}
                  {incident?.severity && (
                    <div>
                      <Label className="text-lg font-semibold text-gray-900 mb-2 block">Severity</Label>
                      <div className="text-lg text-gray-700 capitalize">{incident.severity}</div>
                    </div>
                  )}

                  {/* Location - ✅ CHANGED: location is a string, not object */}
                  <div className="col-span-2">
                    <Label className="text-lg font-semibold text-gray-900 mb-2 block">Location</Label>
                    <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg border-2 border-gray-100">
                      <MapPin className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                      <div className="text-lg text-gray-700 capitalize">{incident?.location || "—"}</div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Description */}
                <div>
                  <Label className="text-lg font-semibold text-gray-900 mb-2 block">Description</Label>
                  <div className="mt-3 p-5 bg-gray-50 rounded-lg border-2 border-gray-100">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {incident?.description || "No description provided"}
                    </p>
                  </div>
                </div>

                {/* Actions Taken - Keep if exists */}
                {incident?.actionsTaken && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <Label className="text-lg font-semibold text-gray-900 mb-2 block">Actions Taken</Label>
                      <div className="mt-3 p-5 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <p className="text-lg text-gray-700 leading-relaxed">{incident.actionsTaken}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Guard Report - Keep if exists */}
            {incident?.guardMessage && (
              <Card className="border-2 border-gray-200 shadow-sm bg-white">
                <CardHeader className="border-b-2 border-gray-200 pb-4">
                  <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-900">
                    <MessageSquare className="h-6 w-6" />
                    Guard Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="text-lg font-semibold text-gray-900 w-32">Guard:</div>
                      <div className="text-lg text-gray-700">{incident?.assigned || "—"}</div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="text-lg font-semibold text-gray-900 w-32">Message:</div>
                      <div className="text-lg text-gray-700 flex-1">{incident.guardMessage}</div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="text-lg font-semibold text-gray-900 w-32">Reported:</div>
                      {/* ✅ CHANGED: Use createdAt instead of time */}
                      <div className="text-lg text-gray-700">{incident?.createdAt ? new Date(incident.createdAt).toLocaleString() : "—"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Evidence Images Card - ✅ CORRECT: images is array */}
            {currentImages.length > 0 && (
              <Card className="border-2 border-gray-200 shadow-sm bg-white">
                <CardHeader className="border-b-2 border-gray-200 pb-4">
                  <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-900">
                    <Camera className="h-6 w-6" />
                    Evidence Images
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {currentImages.map((src: string, idx: number) => (
                      <div
                        key={idx}
                        className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all group cursor-pointer"
                        onClick={() => openImageViewer(idx)}
                      >
                        <img
                          src={src}
                          alt={`Evidence ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* View icon overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ZoomIn className="h-8 w-8 text-white" />
                        </div>

                        {/* Image counter */}
                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          {idx + 1} / {currentImages.length}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-3">Click on any image to view in full screen</p>
                </CardContent>
              </Card>
            )}

            {/* Reporter Information Card - ✅ CORRECT */}
            {incident?.reporter && (
              <Card className="border-2 border-gray-200 shadow-sm bg-white">
                <CardHeader className="border-b-2 border-gray-200 pb-4">
                  <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-900">
                    <User className="h-6 w-6" />
                    Reporter Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="text-lg font-semibold text-gray-900 w-24">Name:</div>
                      <div className="text-lg text-gray-700">{incident.reporter.name}</div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="text-lg font-semibold text-gray-900 w-24">ID:</div>
                      <div className="text-sm text-gray-600 font-mono break-all">{incident.reporter.id}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT - Sidebar */}
          <div className="space-y-6">
            {/* Date & Time Card */}
            <Card className="border-2 border-gray-200 shadow-sm bg-white">
              <CardHeader className="border-b-2 border-gray-200 pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-900">
                  <Clock className="h-6 w-6" />
                  Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div>
                  <Label className="text-lg font-semibold text-gray-900 mb-2 block">Date</Label>
                  <div className="text-lg text-gray-700">{dateTime.date}</div>
                </div>

                <Separator />

                <div>
                  <Label className="text-lg font-semibold text-gray-900 mb-2 block">Time</Label>
                  <div className="text-lg text-gray-700">{dateTime.time}</div>
                </div>
              </CardContent>
            </Card>

            {/* Shift Information - ✅ CORRECT */}
            {incident?.shift && (
              <Card className="border-2 border-gray-200 shadow-sm bg-white">
                <CardHeader className="border-b-2 border-gray-200 pb-4">
                  <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-900">
                    <Shield className="h-6 w-6" />
                    Shift Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label className="text-lg font-semibold text-gray-900 mb-2 block">Shift Type</Label>
                    <div className="text-lg text-gray-700 capitalize">{incident.shift.type}</div>
                  </div>
                  <div>
                    <Label className="text-lg font-semibold text-gray-900 mb-2 block">Shift ID</Label>
                    <div className="text-sm text-gray-600 font-mono break-all leading-relaxed">
                      {incident.shift.id}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Incident Metadata Card */}
            <Card className="border-2 border-gray-200 shadow-sm bg-white">
              <CardHeader className="border-b-2 border-gray-200 pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-900">
                  <AlertTriangle className="h-6 w-6" />
                  Incident Metadata
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* ✅ Status - Keep if exists */}
                {incident?.status && (
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold text-gray-900">Status:</Label>
                    <Badge
                      className="text-lg font-semibold px-4 py-1.5 border-2"
                      style={getStatusStyle(incident.status)}
                    >
                      {incident.status}
                    </Badge>
                  </div>
                )}
                
                {/* Priority Level - Keep if exists */}
                {incident?.priorityLevel && (
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold text-gray-900">Priority:</Label>
                    <div className="text-lg text-gray-700 capitalize">{incident.priorityLevel}</div>
                  </div>
                )}
                
                {/* ✅ CHANGED: Use createdAt */}
                <div>
                  <Label className="text-lg font-semibold text-gray-900 mb-2 block">Created:</Label>
                  <div className="text-lg text-gray-700">{formatDate(incident?.createdAt)}</div>
                </div>
                
                {/* ✅ CORRECT: updatedAt exists */}
                {incident?.updatedAt && (
                  <div>
                    <Label className="text-lg font-semibold text-gray-900 mb-2 block">Last Updated:</Label>
                    <div className="text-lg text-gray-700">{formatDate(incident.updatedAt)}</div>
                  </div>
                )}
                
                <div>
                  <Label className="text-lg font-semibold text-gray-900 mb-2 block">Incident ID:</Label>
                  <div className="text-sm text-gray-600 font-mono break-all leading-relaxed">{incident?.id}</div>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Guard Status - ✅ NEW: Show assignedGuard status */}
            <Card className="border-2 border-gray-200 shadow-sm bg-white">
              <CardHeader className="border-b-2 border-gray-200 pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-900">
                  <User className="h-6 w-6" />
                  Assignment Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                  {incident?.assignedGuard ? (
                    <div>
                      <Badge className="bg-green-100 text-green-800 border-2 border-green-200 text-lg font-semibold px-4 py-1.5">
                        Assigned
                      </Badge>
                      <div className="mt-3 text-lg text-gray-700">
                        Guard assigned to this incident
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Badge className="bg-yellow-100 text-yellow-800 border-2 border-yellow-200 text-lg font-semibold px-4 py-1.5">
                        Unassigned
                      </Badge>
                      <div className="mt-3 text-sm text-gray-600">
                        No guard currently assigned
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Client Notification Card - Keep if exists */}
            {incident?.clientNotified !== undefined && (
              <Card className="border-2 border-gray-200 shadow-sm bg-white">
                <CardHeader className="border-b-2 border-gray-200 pb-4">
                  <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-900">
                    <User className="h-6 w-6" />
                    Client Communication
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold text-gray-900">Client Notified:</Label>
                    <Badge
                      className={`text-lg font-semibold px-4 py-1.5 border-2 ${
                        incident.clientNotified
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-red-100 text-red-800 border-red-200"
                      }`}
                    >
                      {incident.clientNotified ? "Yes" : "No"}
                    </Badge>
                  </div>
                  {incident.clientNotified && (
                    <div className="text-sm text-gray-600 p-3 bg-green-50 rounded border-l-4 border-green-500 mt-4">
                      Client has been informed of this incident and current status.
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* FULL SCREEN IMAGE VIEWER MODAL */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <div className="relative w-full h-[95vh] flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={() => setViewerOpen(false)}
              className="absolute top-4 right-4 z-50 h-10 w-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-4 z-50 bg-black/60 text-white px-4 py-2 rounded-lg text-sm font-medium">
              {currentImageIndex + 1} / {currentImages.length}
            </div>

            {/* Previous button */}
            {currentImages.length > 1 && (
              <button
                onClick={goToPreviousImage}
                className="absolute left-4 z-50 h-12 w-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Main image */}
            <img
              src={currentImages[currentImageIndex]}
              alt={`Evidence ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Next button */}
            {currentImages.length > 1 && (
              <button
                onClick={goToNextImage}
                className="absolute right-4 z-50 h-12 w-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
