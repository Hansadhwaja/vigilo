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

const ViewExportModal = ({
    patrol,
}: {
    patrol: Patrol;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Export Patrol Data</DialogTitle>
                    <DialogDescription>
                        Choose format for exporting patrol records and proof-of-service reports
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-4">
                    <Button
                        // onClick={() => handleExportPatrolData('csv')}
                        className="flex flex-col items-center gap-2 h-20"
                        variant="outline"
                    >
                        <FileText className="h-8 w-8" />
                        <span>Export CSV</span>
                    </Button>

                    <Button
                        onClick={() => handleExportPatrolData('pdf')}
                        className="flex flex-col items-center gap-2 h-20"
                        variant="outline"
                    >
                        <Download className="h-8 w-8" />
                        <span>Proof-of-Service PDF</span>
                    </Button>
                </div>

                <div className="text-xl text-gray-600">
                    <p>CSV: Raw patrol data for analysis and billing</p>
                    <p>PDF: Client reports with GPS tracks, QR scan proof, and photos</p>
                </div>

                <div className="flex justify-end pt-4">
                    <Button variant="outline" onClick={() => setShowExportDialog(false)}>
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewExportModal;