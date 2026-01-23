import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Calendar, Clock, User, MapPin, FileText, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

interface EditAssignmentDialogProps {
  assignment: any;
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  guards: any[];
  orders: any[];
}

export default function EditAssignmentDialog({
  assignment,
  open,
  onClose,
  onSave,
  guards,
  orders,
}: EditAssignmentDialogProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    guardId: "",
    orderId: "",
    type: "",
    description: "",
    startTime: "",
    endTime: "",
    status: "",
  });

  useEffect(() => {
    if (assignment) {
      setFormData({
        guardId: assignment.guardId || "",
        orderId: assignment.orderId || "",
        type: assignment.type || "",
        description: assignment.description || "",
        startTime: assignment.start
          ? new Date(assignment.start).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "",
        endTime: assignment.end
          ? new Date(assignment.end).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "",
        status: assignment.status || "pending",
      });
    }
  }, [assignment]);

  const handleSave = () => {
    if (!formData.guardId || !formData.orderId) {
      toast.error("Please select guard and order");
      return;
    }
    onSave({ ...assignment, ...formData });
    onClose();
  };

  const handleViewDetails = () => {
    navigate(`/scheduling/${assignment.id}`);
    onClose();
  };

  if (!assignment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "completed":
        return "bg-green-100 text-green-700 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Edit Assignment</DialogTitle>
            <Badge className={getStatusColor(formData.status)}>
              {formData.status}
            </Badge>
          </div>
          <DialogDescription>
            Update assignment details or view full information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Guard Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Guard
            </Label>
            <Select value={formData.guardId} onValueChange={(val:any) => setFormData({ ...formData, guardId: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Select guard" />
              </SelectTrigger>
              <SelectContent>
                {guards.map((guard) => (
                  <SelectItem key={guard.id} value={guard.id}>
                    {guard.name} - {guard.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Order Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Order/Location
            </Label>
            <Select value={formData.orderId} onValueChange={(val:any) => setFormData({ ...formData, orderId: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Select order" />
              </SelectTrigger>
              <SelectContent>
                {orders.map((order) => (
                  <SelectItem key={order.id} value={order.id}>
                    {order.locationName} - {order.locationAddress}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type Selection */}
          <div className="space-y-2">
            <Label>Assignment Type</Label>
            <Select value={formData.type} onValueChange={(val:any) => setFormData({ ...formData, type: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="guard">Guard Duty</SelectItem>
                <SelectItem value="patrol">Patrol</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Start Time
              </Label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                End Time
              </Label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(val:any) => setFormData({ ...formData, status: val })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Description
            </Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add notes or special instructions..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={handleViewDetails}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            View Full Details
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
