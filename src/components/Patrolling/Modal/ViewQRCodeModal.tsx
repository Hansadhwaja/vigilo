import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {

    QrCode,
    Shield,
    MapPin,
    Wifi,
    Copy,
    Download,
} from "lucide-react";


const ViewQRCodeModal = ({
    selectedCheckpoint,
}: {
    selectedCheckpoint: any;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>QR Code: {selectedCheckpoint?.name}</DialogTitle>
                    <DialogDescription>
                        GPS-verified QR code for checkpoint scanning
                    </DialogDescription>
                </DialogHeader>

                {selectedCheckpoint && (
                    <div className="space-y-4">
                        {/* QR Code Visual */}
                        <div className="flex justify-center">
                            <div className="w-48 h-48 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center shadow-inner">
                                <div className="text-center">
                                    <QrCode className="h-16 w-16 mx-auto mb-2 text-gray-700" />
                                    <div className="text-xl font-medium text-gray-800">QR Code</div>
                                    <div className="text-lg text-gray-600 mt-1 font-mono bg-gray-100 px-2 py-1 rounded">
                                        {selectedCheckpoint.qrCode}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Checkpoint Details */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">GPS Coordinates</h4>
                                <div className="space-y-1 text-xl text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        <span>Lat: {selectedCheckpoint.coordinates?.lat || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        <span>Lng: {selectedCheckpoint.coordinates?.lng || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Verification</h4>
                                <div className="space-y-1 text-xl text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Wifi className="h-3 w-3" />
                                        <span>Range: {selectedCheckpoint.range || 20}m</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Shield className="h-3 w-3" />
                                        <span>Priority: {selectedCheckpoint.priority || 'Medium'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {selectedCheckpoint.description && (
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <h4 className="font-medium text-blue-900 text-xl mb-1">Instructions</h4>
                                <p className="text-xl text-blue-800">{selectedCheckpoint.description}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                // onClick={() => generateQRCodeForCheckpoint(selectedCheckpoint)}
                                className="flex items-center gap-2"
                            >
                                <Copy className="h-4 w-4" />
                                Copy QR Data
                            </Button>
                            <Button className="flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                Print Label
                            </Button>
                        </div>
                    </div>
                )}

                <div className="flex justify-end pt-4 border-t">
                    <Button variant="outline" onClick={() => setShowQRDialog(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewQRCodeModal;