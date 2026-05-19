import { Label } from "@/components/ui/label";
import {
    MapPin,
    FileText,
    AlertTriangle,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";

import SectionCard from "../common/Card/SectionCard";

interface Props {
    incident: any;
}

const IncidentInfoCard = ({
    incident,
}: Props) => {
    return (
        <SectionCard
            title="Incident Information"
            icon={<FileText className="h-5 w-5" />}
        >
            <div className="space-y-8">
                {/* INCIDENT NAME */}
                <div className="space-y-3">
                    <Label
                        className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-slate-500
            "
                    >
                        Incident Name
                    </Label>

                    <div
                        className="
              rounded-2xl
              border
              border-slate-200
              bg-linear-to-br
              from-slate-50
              to-white
              p-5
              shadow-sm
            "
                    >
                        <div className="flex items-start gap-4">
                            <div
                                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-orange-100
                  text-orange-600
                  shadow-sm
                "
                            >
                                <AlertTriangle className="h-6 w-6" />
                            </div>

                            <div className="space-y-1">
                                <h3
                                    className="
                    text-2xl
                    font-bold
                    tracking-tight
                    text-slate-800
                  "
                                >
                                    {incident?.name || "—"}
                                </h3>

                                <p className="text-sm text-slate-500">
                                    Security Incident Report
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* LOCATION */}
                <div className="space-y-3">
                    <Label
                        className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-slate-500
            "
                    >
                        Location
                    </Label>

                    <div
                        className="
              flex
              items-start
              gap-4
              rounded-2xl
              border
              border-slate-200
              bg-linear-to-br
              from-slate-50
              to-white
              p-5
              shadow-sm
            "
                    >
                        <div
                            className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-blue-100
                text-blue-600
                shadow-sm
                shrink-0
              "
                        >
                            <MapPin className="h-6 w-6" />
                        </div>

                        <div className="space-y-2">
                            <p
                                className="
                  text-base
                  leading-7
                  text-slate-700
                "
                            >
                                {incident?.location || "—"}
                            </p>

                            <div
                                className="
                  inline-flex
                  items-center
                  rounded-full
                  bg-blue-50
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-blue-700
                "
                            >
                                Incident Location
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="bg-slate-200" />

                {/* DESCRIPTION */}
                <div className="space-y-3">
                    <Label
                        className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-slate-500
            "
                    >
                        Description
                    </Label>

                    <div
                        className="
              rounded-2xl
              border
              border-slate-200
              bg-linear-to-br
              from-slate-50
              to-white
              p-6
              shadow-sm
            "
                    >
                        <p
                            className="
                text-base
                leading-8
                text-slate-700
              "
                        >
                            {incident?.description ||
                                "No description provided"}
                        </p>
                    </div>
                </div>
            </div>
        </SectionCard>
    );
};

export default IncidentInfoCard;