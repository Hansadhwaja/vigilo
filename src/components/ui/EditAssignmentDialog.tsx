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
import { Checkbox } from "../ui/checkbox";
import { Calendar, Clock, User, MapPin, FileText, ExternalLink, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEditScheduleMutation } from "../../apis/schedulingAPI";
import { getStatusColor, getStatusStyle } from "../../utils/statusColors";

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
  const [guardsOpen, setGuardsOpen] = useState(false);
  
  const [editSchedule, { isLoading: isSaving }] = useEditScheduleMutation();

  const [formData, setFormData] = useState({
    description: "",
    startTime: "",
    endTime: "",
    date: "",
    endDate: "",
    guardIds: [] as string[],
  });

  useEffect(() => {
    if (assignment && open) {
      const extractDate = (isoString: string): string => {
        if (!isoString) return "";
        try {
          return new Date(isoString).toISOString().split('T')[0];
        } catch {
          return "";
        }
      };

      const extractTime = (isoString: string): string => {
        if (!isoString) return "";
        try {
          const date = new Date(isoString);
          return date.toTimeString().slice(0, 5);
        } catch {
          return "";
        }
      };

      setFormData({
        description: assignment.description || "",
        startTime: extractTime(assignment.rawStartISO || assignment.start),
        endTime: extractTime(assignment.rawEndISO || assignment.end),
        date: extractDate(assignment.rawStartISO || assignment.start),
        endDate: extractDate(assignment.rawEndISO || assignment.end),
        guardIds: assignment.guardId ? [assignment.guardId] : [],
      });
    }
  }, [assignment, open]);

  const handleSave = async () => {
    if (!assignment?.shiftId) {
      toast.error("Shift ID not found");
      return;
    }

    const updateData: any = {};
    
    if (formData.description && formData.description !== assignment.description) {
      updateData.description = formData.description;
    }
    if (formData.startTime) {
      updateData.startTime = formData.startTime;
    }
    if (formData.endTime) {
      updateData.endTime = formData.endTime;
    }
    if (formData.date) {
      updateData.date = formData.date;
    }
    if (formData.endDate) {
      updateData.endDate = formData.endDate;
    }
    if (formData.guardIds.length > 0) {
      updateData.guardIds = formData.guardIds;
    }

    if (Object.keys(updateData).length === 0) {
      toast.error("No changes detected");
      return;
    }

    try {
      const result = await editSchedule({
        id: assignment.shiftId,
        data: updateData,
      }).unwrap();

      toast.success(result.message || "Shift updated successfully!");
      onSave(result.data);
      onClose();
    } catch (error: any) {
      console.error("Edit error:", error);
      toast.error(error?.data?.message || "Failed to update shift");
    }
  };

  const handleViewDetails = () => {
    if (!assignment.shiftId) {
      toast.error("Shift ID not found");
      console.error("Assignment data:", assignment);
      return;
    }
    
    console.log("Navigating with shiftId:", assignment.shiftId);
    navigate(`/scheduling/${assignment.shiftId}`);
    onClose();
  };

  if (!assignment) return null;

  // ✅ FIX: Get status from assignment
  const currentStatus = assignment.guardStatus || assignment.status || "pending";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Edit Assignment</DialogTitle>
            {/* ✅ FIXED: Use currentStatus variable */}
            <Badge 
              className="border-2"
              style={getStatusStyle(currentStatus)}
            >
              {getStatusColor(currentStatus).label}
            </Badge>
          </div>
          <DialogDescription>
            Update shift details (only fill fields you want to change)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
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
              disabled={isSaving}
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                disabled={isSaving}
              />
            </div>
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
                disabled={isSaving}
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
                disabled={isSaving}
              />
            </div>
          </div>

          {/* Multi-select Guards */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Select Guards (Multiple)
            </Label>
            <Select open={guardsOpen} onOpenChange={setGuardsOpen}>
              <SelectTrigger disabled={isSaving}>
                <SelectValue
                  placeholder={
                    formData.guardIds.length > 0
                      ? `${formData.guardIds.length} guard(s) selected`
                      : "Select Guards"
                  }
                />
              </SelectTrigger>

              <SelectContent
                className="max-h-56 overflow-y-auto z-50"
                style={{ maxHeight: "14rem", overflowY: "auto" }}
              >
                {guards && guards.length > 0 ? (
                  guards.map((guard: any) => {
                    const isChecked = formData.guardIds.includes(guard.id);

                    return (
                      <div
                        key={guard.id}
                        className="flex items-center px-2 py-1 space-x-2 cursor-pointer hover:bg-gray-100 rounded-md"
                        onClick={(e) => {
                          e.stopPropagation();

                          if (isChecked) {
                            setFormData({
                              ...formData,
                              guardIds: formData.guardIds.filter(
                                (id: string) => id !== guard.id
                              ),
                            });
                          } else {
                            setFormData({
                              ...formData,
                              guardIds: [...formData.guardIds, guard.id],
                            });
                          }
                        }}
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked: any) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                guardIds: [...formData.guardIds, guard.id],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                guardIds: formData.guardIds.filter(
                                  (id: string) => id !== guard.id
                                ),
                              });
                            }
                          }}
                          onClick={(e: { stopPropagation: () => any }) =>
                            e.stopPropagation()
                          }
                        />

                        <span className="text-sm">
                          {guard.name} ({guard.mobile || guard.email})
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-3 text-sm text-gray-500">
                    No Guards available
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Current Assignment Info with Status */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 border">
            <h4 className="font-semibold text-sm text-gray-700">Current Assignment Info</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Guard:</strong> {assignment.guardName || assignment.name}</p>
              <p><strong>Location:</strong> {assignment.orderLocationName || assignment.orderName || "N/A"}</p>
              <p><strong>Current Time:</strong> {assignment.time}</p>
              <div className="flex items-center gap-2 pt-1">
                <strong>Status:</strong> 
                <Badge 
                  size="sm"
                  className="border"
                  style={getStatusStyle(currentStatus)}
                >
                  {getStatusColor(currentStatus).label}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={handleViewDetails}
            className="flex items-center gap-2"
            disabled={isSaving}
          >
            <ExternalLink className="h-4 w-4" />
            View Full Details
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              style={{ backgroundColor: "#2360FF" }}
              className="hover:opacity-90"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
