import {
    Building,
    Car,
    Clock,
    Eye,
    MapPin,
    QrCode,
    Target,
} from "lucide-react";

import { AdminPatrolRun, useDeletePatrolRunMutation } from "@/apis/patrollingAPI";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { getStatusStyle } from "@/utils/statusColors";
import { formatTime } from "@/lib/utils";
import { Link } from "react-router-dom";
import DeleteModal from "../common/Modal/DeleteModal";
import { toast } from "sonner";
import { useState } from "react";

type PatrolCardProps = {
    patrol: AdminPatrolRun;
};

const PatrolCard = ({ patrol }: PatrolCardProps) => {

    const [deletePatrolRun, { isLoading }] = useDeletePatrolRunMutation();

    const handleDelete = async () => {
        try {
            await deletePatrolRun(patrol.id).unwrap();
            toast.success("Patrol deleted successfully");
        } catch (error) {
            toast.error("Error deleting patrol");
        }
    }

    return (
        <Card className="border border-slate-200 shadow-sm transition-all hover:border-slate-300 hover:shadow-md p-0">
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                            <QrCode className="h-5 w-5 text-slate-700" />
                        </div>

                        <div className="flex justify-between gap-4 items-center flex-1">
                            <div className="space-y-2">
                                <div className="flex  gap-2 items-center">
                                    <h3 className="truncate text-sm font-semibold text-slate-900 uppercase">
                                        #{patrol.patrolId.slice(0, 8)}
                                    </h3>
                                    <Badge
                                        className="capitalize"
                                        style={getStatusStyle(patrol.status)}
                                    >
                                        {patrol.status}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">

                                    <div className="flex items-center gap-1">
                                        <Car className="h-3.5 w-3.5" />
                                        <span>{patrol.vehicleId || "N/A"}</span>
                                    </div>

                                    <div className="flex items-center gap-1 min-w-0">
                                        <MapPin className="h-3.5 w-3.5 shrink-0" />

                                        <span className="truncate max-w-[140px]">
                                            {patrol.locationName}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 flex-1">
                                <div className="flex-1">
                                    <div className="mb-1 flex items-center justify-between text-[11px]">
                                        <span className="font-medium text-slate-600">
                                            {patrol.completedCheckpoints}/
                                            {patrol.totalCheckpoints} checkpoints
                                        </span>

                                        <span className="text-slate-500">
                                            {patrol.completionPercentage || 0}%
                                        </span>
                                    </div>

                                    <Progress
                                        value={patrol.completionPercentage || 0}
                                        className="h-1.5"
                                    />
                                </div>

                                <div className="items-center gap-3 text-xs text-slate-500 flex">
                                    <div className="flex items-center gap-1">
                                        <Building className="h-3.5 w-3.5" />
                                        <span>{patrol.totalSites}</span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Target className="h-3.5 w-3.5" />
                                        <span>{patrol.totalSubSites}</span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>
                                            {formatTime(patrol.startDateTime)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-lg"
                            asChild
                        >
                            <Link to={`/patrol/${patrol.id}`}>
                                <Eye className="h-4 w-4" />
                            </Link>

                        </Button>

                        <DeleteModal
                            title="Patrol"
                            onConfirm={handleDelete}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PatrolCard;

