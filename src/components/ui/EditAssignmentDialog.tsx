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
import { Calendar, Clock, User, MapPin, FileText, ExternalLink, Loader2, AlertCircle, X, Users } from "lucide-react";
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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

      // ✅ PRE-SELECT ALL GUARDS FOR THIS SHIFT
      const allGuardsForThisShift = assignment.allGuardIdsForShift || [assignment.guardId];

      setFormData({
        description: assignment.description || "",
        startTime: extractTime(assignment.rawStartISO || assignment.start),
        endTime: extractTime(assignment.rawEndISO || assignment.end),
        date: extractDate(assignment.rawStartISO || assignment.start),
        endDate: extractDate(assignment.rawEndISO || assignment.end),
        guardIds: allGuardsForThisShift, // ✅ ALL guards, not just one!
      });
      
      setErrors({});
    }
  }, [assignment, open]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.description || formData.description.trim() === "") {
      newErrors.description = "Description is required";
    }

    if (!formData.date) {
      newErrors.date = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    }

    if (formData.guardIds.length === 0) {
      newErrors.guardIds = "At least one guard must be selected";
    }

    if (formData.date && formData.endDate) {
      const startDate = new Date(formData.date);
      const endDate = new Date(formData.endDate);
      
      if (endDate < startDate) {
        newErrors.endDate = "End date cannot be before start date";
      }
    }

    if (formData.date && formData.endDate && formData.date === formData.endDate) {
      if (formData.startTime && formData.endTime) {
        const [startHour, startMinute] = formData.startTime.split(':').map(Number);
        const [endHour, endMinute] = formData.endTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;
        
        if (endMinutes <= startMinutes) {
          newErrors.endTime = "End time must be after start time";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!assignment?.shiftId) {
      toast.error("Shift ID not found");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    const updateData: any = {
      description: formData.description,
      startTime: formData.startTime,
      endTime: formData.endTime,
      date: formData.date,
      endDate: formData.endDate,
      guardIds: formData.guardIds, // ✅ Sends ALL selected guards
    };

    try {
      const result = await editSchedule({
        id: assignment.shiftId,
        data: updateData,
      }).unwrap();
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

  const currentStatus = assignment.guardStatus || assignment.status || "pending";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4 pr-8">
            <DialogTitle className="text-xl font-bold">Edit Shift Assignment</DialogTitle>
            <Badge 
              className="border-2 shrink-0"
              style={getStatusStyle(currentStatus)}
            >
              {getStatusColor(currentStatus).label}
            </Badge>
          </div>
          <DialogDescription className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Editing shift with <strong>{formData.guardIds.length} guard(s)</strong> assigned. 
            You can add or remove guards from this shift.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Description */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base font-medium">
              <FileText className="h-4 w-4" />
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: "" });
              }}
              placeholder="Add notes or special instructions..."
              rows={3}
              disabled={isSaving}
              className={`text-base ${errors.description ? "border-red-500" : ""}`}
            />
            {errors.description && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Date and Time - 2x2 Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <Label className="text-base font-medium">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => {
                  setFormData({ ...formData, date: e.target.value });
                  if (errors.date) setErrors({ ...errors, date: "" });
                }}
                disabled={isSaving}
                className={`text-base ${errors.date ? "border-red-500" : ""}`}
              />
              {errors.date && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.date}
                </p>
              )}
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label className="text-base font-medium">
                End Date <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => {
                  setFormData({ ...formData, endDate: e.target.value });
                  if (errors.endDate) setErrors({ ...errors, endDate: "" });
                }}
                disabled={isSaving}
                className={`text-base ${errors.endDate ? "border-red-500" : ""}`}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.endDate}
                </p>
              )}
            </div>

            {/* Start Time */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-base font-medium">
                <Clock className="h-4 w-4" />
                Start Time <span className="text-red-500">*</span>
              </Label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => {
                  setFormData({ ...formData, startTime: e.target.value });
                  if (errors.startTime) setErrors({ ...errors, startTime: "" });
                }}
                disabled={isSaving}
                className={`text-base ${errors.startTime ? "border-red-500" : ""}`}
              />
              {errors.startTime && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.startTime}
                </p>
              )}
            </div>

            {/* End Time */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-base font-medium">
                <Clock className="h-4 w-4" />
                End Time <span className="text-red-500">*</span>
              </Label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) => {
                  setFormData({ ...formData, endTime: e.target.value });
                  if (errors.endTime) setErrors({ ...errors, endTime: "" });
                }}
                disabled={isSaving}
                className={`text-base ${errors.endTime ? "border-red-500" : ""}`}
              />
              {errors.endTime && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.endTime}
                </p>
              )}
            </div>
          </div>

          {/* Multi-select Guards */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base font-medium">
              <User className="h-4 w-4" />
              Assign Guards (Multiple) <span className="text-red-500">*</span>
            </Label>
            <Select open={guardsOpen} onOpenChange={setGuardsOpen}>
              <SelectTrigger 
                disabled={isSaving}
                className={`text-base ${errors.guardIds ? "border-red-500" : ""}`}
              >
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
                          
                          if (errors.guardIds) setErrors({ ...errors, guardIds: "" });
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
                            
                            if (errors.guardIds) setErrors({ ...errors, guardIds: "" });
                          }}
                          onClick={(e: { stopPropagation: () => any }) =>
                            e.stopPropagation()
                          }
                        />

                        <span className="text-base">
                          {guard.name} ({guard.mobile || guard.email})
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-3 text-base text-gray-500">
                    No Guards available
                  </div>
                )}
              </SelectContent>
            </Select>
            {errors.guardIds && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.guardIds}
              </p>
            )}
          </div>

          {/* Current Assignment Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 border">
            <h4 className="font-semibold text-base text-gray-700">Current Assignment Info</h4>
            <div className="space-y-1 text-base text-gray-600">
              <p><strong>Location Name:</strong> {assignment.orderName || "N/A"}</p>
    <p><strong>Location Address:</strong> {assignment.orderAddress || "N/A"}</p>

              <div className="flex items-center gap-2 pt-1">
                <strong>Status:</strong> 
                <Badge 
                  className="border text-sm"
                  style={getStatusStyle(currentStatus)}
                >
                  {getStatusColor(currentStatus).label}
                </Badge>
              </div>
              {/* ✅ Show all currently assigned guards */}
              <div className="pt-2 border-t">
                <strong>Currently Assigned Guards:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.guardIds.map(guardId => {
                    const guard = guards.find(g => g.id === guardId);
                    return (
                      <Badge key={guardId} variant="outline" className="text-sm">
                        {guard?.name || guardId}
                      </Badge>
                    );
                  })}
                </div>
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
