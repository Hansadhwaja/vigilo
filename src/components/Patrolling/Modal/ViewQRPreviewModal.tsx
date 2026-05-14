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

const ViewQRPreviewModal = () => {
    const [open, setOpen] = useState(false);
    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogContent className="max-w-md p-6 rounded-2xl">

                {/* Close Button */}
                <button
                    // onClick={() => setQrPreview(null)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black"
                >

                </button>

                {/* Title */}
                <div className="text-center font-semibold text-gray-700 mb-4">
                    {qrPreview?.name}
                </div>

                {/* QR Image */}
                <img
                    src={qrPreview?.url}
                    alt="QR Preview"
                    className="w-64 h-64 mx-auto object-contain"
                />

                {/* Download */}
                <div className="mt-5 flex justify-center">
                    <Button
                        size="sm"
                        onClick={() =>
                            qrPreview &&
                            downloadQR(qrPreview.url, qrPreview.name)
                        }
                    >
                        Download QR
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default ViewQRPreviewModal