import { useState } from "react";

import { Patrol } from "@/apis/patrollingAPI";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
    Camera,
    FileText,
    QrCode,
    Clock3,
    Shield,
    MapPin,
    CheckCircle2,
    AlertTriangle,
    Eye,
} from "lucide-react";

import { getStatusColor } from "@/utils/statusColors";
import { customFormatDateTime } from "@/lib/utils";

const getCheckpointStatusColor = (
    status: string
) => {
    switch (status?.toLowerCase()) {
        case "completed":
            return "bg-emerald-100 text-emerald-700 border-emerald-200";

        case "missed":
            return "bg-red-100 text-red-700 border-red-200";

        case "pending":
            return "bg-yellow-100 text-yellow-700 border-yellow-200";

        default:
            return "bg-gray-100 text-gray-700 border-gray-200";
    }
};

const ViewProofOfServiceModal = ({
    patrol,
}: {
    patrol: Patrol;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Proof of Service Report</DialogTitle>
                    <DialogDescription>
                        Comprehensive patrol completion report for client delivery
                    </DialogDescription>
                </DialogHeader>

                {selectedPatrol && (
                    <div className="space-y-6">
                        {/* Report Header */}
                        <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h3 className="font-semibold mb-2">Patrol Summary</h3>
                                <div className="space-y-1 text-xl">
                                    <div><strong>Patrol ID:</strong> {selectedPatrol.patrolId}</div>
                                    <div><strong>Guard:</strong> {selectedPatrol.guardName}</div>
                                    <div><strong>Vehicle:</strong> {selectedPatrol.vehicle}</div>
                                    <div><strong>Client:</strong> {selectedPatrol.clientName}</div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Performance Metrics</h3>
                                <div className="space-y-1 text-xl">
                                    <div><strong>Duration:</strong> {selectedPatrol.billing.actualHours || 'N/A'}h</div>
                                    <div><strong>Completion:</strong> {selectedPatrol.totalCheckpoints > 0 ? Math.round((selectedPatrol.completedCheckpoints / selectedPatrol.totalCheckpoints) * 100) : 0}%</div>
                                    <div><strong>QR Scans:</strong> {selectedPatrol.proofOfService.qrScans}</div>
                                    <div><strong>Route Compliance:</strong> {selectedPatrol.routeDeviation ? '❌ Deviation' : '✅ On Route'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Checkpoint Timeline */}
                        <div>
                            <h3 className="font-semibold mb-3">Checkpoint Timeline</h3>
                            <div className="space-y-2">
                                {selectedPatrol.sites.map((site: any) => (
                                    <>
                                        {site.checkpoints.map((checkpoint: any) => (
                                            <div key={checkpoint.id} className="flex items-center justify-between p-3 border rounded">
                                                <div>
                                                    <div className="font-medium">{checkpoint.name}</div>
                                                    <div className="text-xl text-gray-600">{site.name}</div>
                                                </div>
                                                <div className="text-right text-xl">
                                                    <div className={checkpoint.scannedAt ? 'text-green-600' : 'text-gray-500'}>
                                                        {checkpoint.scannedAt ? '✅ Completed' : '⏳ Pending'}
                                                    </div>
                                                    {checkpoint.scannedAt && (
                                                        <div className="text-lg text-gray-500">
                                                            {new Date(checkpoint.scannedAt).toLocaleString()}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        {site.subSites.map((sub: any) =>
                                            sub.checkpoints.map((checkpoint: any) => (
                                                <div key={checkpoint.id} className="flex items-center justify-between p-3 border rounded">
                                                    <div>
                                                        <div className="font-medium">{checkpoint.name}</div>
                                                        <div className="text-xl text-gray-600">
                                                            {site.name} - {sub.name}
                                                        </div>
                                                    </div>
                                                    <div className="text-right text-xl">
                                                        <div className={checkpoint.scannedAt ? 'text-green-600' : 'text-gray-500'}>
                                                            {checkpoint.scannedAt ? '✅ Completed' : '⏳ Pending'}
                                                        </div>
                                                        {checkpoint.scannedAt && (
                                                            <div className="text-lg text-gray-500">
                                                                {new Date(checkpoint.scannedAt).toLocaleString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </>
                                ))}
                            </div>
                        </div>

                        {/* Evidence Summary */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 border rounded-lg">
                                <QrCode className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                                <div className="font-bold text-xl">{selectedPatrol.proofOfService.qrScans}</div>
                                <div className="text-xl text-gray-600">QR Code Scans</div>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                                <Camera className="h-8 w-8 mx-auto mb-2 text-green-600" />
                                <div className="font-bold text-xl">{selectedPatrol.proofOfService.photos}</div>
                                <div className="text-xl text-gray-600">Photo Evidence</div>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                                <FileText className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                                <div className="font-bold text-xl">{selectedPatrol.proofOfService.notes}</div>
                                <div className="text-xl text-gray-600">Incident Notes</div>
                            </div>
                        </div>

                        {/* Billing Information */}
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-semibold mb-2">Billing Summary</h3>
                            <div className="grid grid-cols-2 gap-4 text-xl">
                                <div><strong>Hourly Rate:</strong> ${selectedPatrol.billing.hourlyRate}/hr</div>
                                <div><strong>Total Hours:</strong> {selectedPatrol.billing.actualHours || selectedPatrol.billing.estimatedHours}h</div>
                                <div><strong>Total Amount:</strong> ${selectedPatrol.billing.actualHours ? calculatePatrolRevenue(selectedPatrol).toFixed(2) : (selectedPatrol.billing.estimatedHours * selectedPatrol.billing.hourlyRate).toFixed(2)}</div>
                                <div><strong>Status:</strong> {selectedPatrol.billing.clientInvoiced ? 'Invoiced' : 'Pending Invoice'}</div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setShowProofDialog(false)}>
                        Close
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => {
                            toast.info("Email functionality would be implemented here");
                        }}>
                            Email to Client
                        </Button>
                        <Button onClick={() => {
                            handleExportPatrolData('pdf');
                            setShowProofDialog(false);
                        }}>
                            Generate PDF
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewProofOfServiceModal;