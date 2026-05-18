
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Alarm } from '@/types';

const ViewAlarmModal = ({ alarm }: { alarm: Alarm }) => {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "bg-red-100 text-red-800";
            case "critical":
                return "bg-red-100 text-red-800";
            case "medium":
                return "bg-yellow-100 text-yellow-800";
            case "low":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getSLAColor = (sinceMins: number, slaTargetMins: number) => {
        if (!slaTargetMins || slaTargetMins <= 0) return "text-gray-600";
        const percentage = (sinceMins / slaTargetMins) * 100;
        if (percentage >= 90) return "text-red-600";
        if (percentage >= 70) return "text-yellow-600";
        return "text-green-600";
    };

    return (
        <Dialog>
            <DialogContent className="max-w-4xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Alarm Details
                    </DialogTitle>
                    <DialogDescription className="text-gray-500">
                        Comprehensive alarm information and response tracking
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">

                    {/* TOP GRID */}
                    <div className="grid grid-cols-2 gap-6">

                        {/* Alarm Information */}
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h3 className="font-semibold text-lg mb-3 text-gray-800">
                                Alarm Information
                            </h3>

                            <div className="space-y-2 text-sm">

                                <div className="flex justify-between">
                                    <span className="text-gray-500">Site</span>
                                    <span className="font-medium">{alarm.site}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">Type</span>
                                    <span className="font-medium">{alarm.type}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">Location</span>
                                    <span className="font-medium">
                                        {alarm.location || "Not specified"}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Priority</span>

                                    <Badge className={`${getPriorityColor(alarm.priority)}`}>
                                        {alarm.priority}
                                    </Badge>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">Time Since</span>
                                    <span>{alarm.sinceMins} minutes</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">SLA Time</span>
                                    <span>{alarm.slaTargetMins} minutes</span>
                                </div>

                            </div>
                        </div>


                        {/* Monitoring Details (NEW SECTION) */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h3 className="font-semibold text-lg mb-3 text-blue-800">
                                Monitoring Details
                            </h3>

                            <div className="space-y-2 text-sm">

                                <div className="flex justify-between">
                                    <span className="text-gray-500">Monitoring Company</span>
                                    <span className="font-medium">
                                        {alarm.monitoringCompany || "Not Provided"}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">License</span>
                                    <span className="font-medium">
                                        {alarm.license || "Not Provided"}
                                    </span>
                                </div>

                            </div>
                        </div>
                    </div>


                    {/* RESPONSE STATUS */}
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="font-semibold text-lg mb-3 text-green-800">
                            Response Status
                        </h3>

                        <div className="grid grid-cols-2 gap-4 text-sm">

                            <div className="flex justify-between">
                                <span className="text-gray-500">Status -</span>
                                <span className="font-medium capitalize mr-60">
                                    {"N/A"}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Assigned Guard -</span>
                                <span className="mr-45">
                                    {alarm.assigned || "Unassigned"}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">ETA -</span>
                                <span className="mr-65">
                                    {alarm.eta || "Not calculated"}
                                </span>
                            </div>

                            {alarm.responseTime && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Response Time</span>
                                    <span>{alarm.responseTime} minutes</span>
                                </div>
                            )}

                            {alarm.completedAt && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Resolved At</span>
                                    <span>
                                        {new Date(alarm.completedAt).toLocaleString()}
                                    </span>
                                </div>
                            )}

                        </div>
                    </div>


                    {/* DESCRIPTION */}
                    {alarm.description && (
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h3 className="font-semibold text-lg mb-2">
                                Description
                            </h3>

                            <p className="text-sm text-gray-700">
                                {alarm.description}
                            </p>
                        </div>
                    )}


                    {/* SLA STATUS */}
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <h3 className="font-semibold text-lg mb-3 text-red-700">
                            SLA Status
                        </h3>

                        <div className="space-y-3">

                            <div className="flex justify-between text-sm">
                                <span>Time Elapsed</span>

                                <span
                                    className={getSLAColor(
                                        alarm.sinceMins,
                                        alarm.slaTargetMins
                                    )}
                                >
                                    {alarm.sinceMins}m / {alarm.slaTargetMins}m
                                </span>
                            </div>

                            {alarm.slaTargetMins > 0 && (
                                <Progress
                                    value={Math.min(
                                        (alarm.sinceMins /
                                            alarm.slaTargetMins) *
                                        100,
                                        100
                                    )}
                                    className="h-3"
                                />
                            )}

                            {alarm.slaTargetMins > 0 &&
                                alarm.sinceMins >
                                alarm.slaTargetMins && (
                                    <div className="text-red-600 font-medium text-sm">
                                        ⚠️ SLA Breach:{" "}
                                        {alarm.sinceMins -
                                            alarm.slaTargetMins}{" "}
                                        minutes overdue
                                    </div>
                                )}

                        </div>
                    </div>

                </div>


                <DialogClose asChild>
                    <Button
                        variant="outline"
                    >
                        Close
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}

export default ViewAlarmModal