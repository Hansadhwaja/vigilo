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

const ViewPatrolModal = ({
    patrol,
}: {
    patrol: Patrol;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                >
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-6xl max-h-[92vh] overflow-y-auto rounded-2xl border bg-linear-to-br from-slate-50 via-white to-slate-100 p-0">

                {/* Header */}
                <DialogHeader className="border-b bg-white/80 backdrop-blur px-6 py-5 sticky top-0 z-20">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <DialogTitle className="text-2xl font-bold text-gray-900">
                                Patrol Details
                            </DialogTitle>

                            <DialogDescription className="mt-1 text-sm text-gray-500">
                                Comprehensive patrol information and checkpoint activity
                            </DialogDescription>
                        </div>

                        <Badge
                            className={`capitalize border px-4 py-1 text-sm font-semibold ${getStatusColor(
                                patrol.status
                            )}`}
                        >
                            {patrol.status}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="space-y-6 p-6">

                    {/* Top Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Basic Info */}
                        <div className="rounded-2xl border bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-5">
                                <Shield className="h-5 w-5 text-blue-600" />

                                <h3 className="text-lg font-semibold text-gray-900">
                                    Patrol Information
                                </h3>
                            </div>

                            <div className="space-y-4">

                                <div className="flex justify-between gap-4">
                                    <span className="text-sm text-gray-500">
                                        Patrol ID
                                    </span>

                                    <span className="font-mono text-sm text-gray-900 break-all text-right">
                                        {patrol.patrolId}
                                    </span>
                                </div>

                                <Separator />

                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">
                                        Guard
                                    </span>

                                    <span className="font-medium text-gray-900">
                                        -
                                    </span>
                                </div>

                                <Separator />

                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">
                                        Vehicle
                                    </span>

                                    <span className="font-medium text-gray-900">
                                        -
                                    </span>
                                </div>

                                <Separator />

                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">
                                        Client
                                    </span>

                                    <span className="font-medium text-gray-900">
                                        -
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Timing */}
                        <div className="rounded-2xl border bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-5">
                                <Clock3 className="h-5 w-5 text-orange-500" />

                                <h3 className="text-lg font-semibold text-gray-900">
                                    Timing Information
                                </h3>
                            </div>

                            <div className="space-y-4">

                                <div className="rounded-xl border bg-slate-50 p-4">
                                    <p className="text-sm uppercase tracking-wide text-gray-500">
                                        Start Time
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-gray-900">
                                        {
                                            customFormatDateTime(
                                                patrol.startTime
                                            ).date
                                        }
                                    </p>

                                    <p className="text-sm text-gray-600">
                                        {
                                            customFormatDateTime(
                                                patrol.startTime
                                            ).time
                                        }
                                    </p>
                                </div>

                                {patrol.endTime && (
                                    <div className="rounded-xl border bg-emerald-50 p-4">
                                        <p className="text-sm uppercase tracking-wide text-emerald-600">
                                            End Time
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-gray-900">
                                            {
                                                customFormatDateTime(
                                                    patrol.endTime
                                                ).date
                                            }
                                        </p>

                                        <p className="text-sm text-gray-600">
                                            {
                                                customFormatDateTime(
                                                    patrol.endTime
                                                ).time
                                            }
                                        </p>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>

                    {/* Checkpoints */}
                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <MapPin className="h-5 w-5 text-emerald-600" />

                            <h3 className="text-lg font-semibold text-gray-900">
                                Patrol Checkpoints
                            </h3>
                        </div>

                        <div className="space-y-5">
                            {patrol.sites.map((site: any) => (
                                <div
                                    key={site.id}
                                    className="rounded-2xl border bg-slate-50/70 p-5"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900">
                                                {site.name}
                                            </h4>

                                            <p className="text-sm text-gray-500">
                                                Site Location
                                            </p>
                                        </div>

                                        <Badge variant="outline">
                                            {site.subsites.length} Subsites
                                        </Badge>
                                    </div>

                                    <div className="space-y-4">
                                        {site.subsites.map((subsite: any) => (
                                            <div
                                                key={subsite.id}
                                                className="rounded-xl border bg-white p-4"
                                            >
                                                <h5 className="font-semibold text-gray-800 mb-4">
                                                    {subsite.name}
                                                </h5>

                                                <div className="space-y-3">
                                                    {subsite.checkpoints.map(
                                                        (checkpoint: any) => (
                                                            <div
                                                                key={checkpoint.id}
                                                                className="rounded-xl border bg-slate-50 p-4"
                                                            >
                                                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                                                                    <div className="space-y-2 flex-1">
                                                                        <div className="flex items-center gap-2">
                                                                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />

                                                                            <p className="font-semibold text-gray-900">
                                                                                {checkpoint.name}
                                                                            </p>
                                                                        </div>

                                                                        <div className="text-sm text-gray-600">
                                                                            QR Code:{" "}
                                                                            <span className="font-mono">
                                                                                {checkpoint.qrCode}
                                                                            </span>
                                                                        </div>

                                                                        {checkpoint.scannedAt && (
                                                                            <div className="text-sm text-gray-500">
                                                                                Scanned at:{" "}
                                                                                {new Date(
                                                                                    checkpoint.scannedAt
                                                                                ).toLocaleString()}
                                                                            </div>
                                                                        )}

                                                                        {checkpoint.issues?.length >
                                                                            0 && (
                                                                                <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                                                                                    <div className="flex items-start gap-2">
                                                                                        <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />

                                                                                        <div>
                                                                                            <p className="text-sm font-medium text-orange-700">
                                                                                                Issues Reported
                                                                                            </p>

                                                                                            <p className="text-sm text-orange-600 mt-1">
                                                                                                {checkpoint.issues.join(
                                                                                                    ", "
                                                                                                )}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                    </div>

                                                                    <div className="flex items-center gap-2">
                                                                        <Badge
                                                                            className={`border capitalize ${getCheckpointStatusColor(
                                                                                checkpoint.status
                                                                            )}`}
                                                                        >
                                                                            {
                                                                                checkpoint.status
                                                                            }
                                                                        </Badge>

                                                                        <Button
                                                                            size="icon"
                                                                            variant="outline"
                                                                            className="h-9 w-9"
                                                                        >
                                                                            <QrCode className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Proof of Service */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                        <div className="rounded-2xl border bg-linear-to-br from-blue-50 to-indigo-100 p-6 text-center shadow-sm">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                                <QrCode className="h-7 w-7 text-blue-600" />
                            </div>

                            <div className="mt-4 text-3xl font-bold text-gray-900">
                                {patrol.proofOfService.qrScans}
                            </div>

                            <div className="mt-1 text-sm text-gray-600">
                                QR Scans
                            </div>
                        </div>

                        <div className="rounded-2xl border bg-linear-to-br from-emerald-50 to-green-100 p-6 text-center shadow-sm">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                                <Camera className="h-7 w-7 text-emerald-600" />
                            </div>

                            <div className="mt-4 text-3xl font-bold text-gray-900">
                                {patrol.proofOfService.photos}
                            </div>

                            <div className="mt-1 text-sm text-gray-600">
                                Photos Uploaded
                            </div>
                        </div>

                        <div className="rounded-2xl border bg-linear-to-br from-purple-50 to-fuchsia-100 p-6 text-center shadow-sm">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                                <FileText className="h-7 w-7 text-purple-600" />
                            </div>

                            <div className="mt-4 text-3xl font-bold text-gray-900">
                                {patrol.proofOfService.notes}
                            </div>

                            <div className="mt-1 text-sm text-gray-600">
                                Notes Added
                            </div>
                        </div>

                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewPatrolModal;