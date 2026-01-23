import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
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
} from "lucide-react";

export default function AssignmentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // TODO: Fetch assignment by ID from your API
  // const { data: assignment } = useGetAssignmentByIdQuery(id);

  // Dummy data for now
  const assignment = {
    id: id,
    guardName: "Deepak Guard1",
    guardEmail: "deepak@example.com",
    guardPhone: "+91 9876543210",
    orderName: "Aparna Hills Security",
    locationAddress: "Aparna Hills, Hyderabad, India",
    type: "guard",
    status: "upcoming",
    startTime: "15:38",
    endTime: "16:38",
    date: "2026-01-23",
    description: "Regular security shift at main entrance",
    createdAt: "2026-01-20",
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "completed":
        return "bg-green-100 text-green-700 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      case "upcoming":
        return "bg-purple-100 text-purple-700 border-purple-300";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
    }
  };

  const getTypeColor = (type: string) => {
    return type === "patrol"
      ? "bg-orange-100 text-orange-700 border-orange-300"
      : "bg-green-100 text-green-700 border-green-300";
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate("/scheduling")}
          className="flex items-center gap-2"
        >
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
              <CardTitle className="text-2xl font-bold mb-2">
                Assignment Details
              </CardTitle>
              <div className="flex gap-2">
                <Badge className={getStatusColor(assignment.status)}>
                  {assignment.status}
                </Badge>
                <Badge className={getTypeColor(assignment.type)}>
                  {assignment.type}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Guard Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Guard Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{assignment.guardName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{assignment.guardEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{assignment.guardPhone}</span>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Location Details
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="font-medium">{assignment.orderName}</div>
              <div className="text-gray-600">{assignment.locationAddress}</div>
            </div>
          </div>

          {/* Time & Date */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Schedule
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Date:</span>
                <span className="text-gray-600">
                  {new Date(assignment.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Time:</span>
                <span className="text-gray-600">
                  {assignment.startTime} - {assignment.endTime}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-600" />
              Description & Notes
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{assignment.description}</p>
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">
              Created on: {new Date(assignment.createdAt).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
