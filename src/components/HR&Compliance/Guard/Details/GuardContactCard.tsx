"use client";

import { Guard } from "@/apis/guardsApi";

import {
    Mail,
    MapPin,
    Phone,
    User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SectionCard from "@/components/common/Card/SectionCard";

import { Link } from "react-router-dom";

const GuardContactCard = ({
    guard,
}: {
    guard: Guard;
}) => {
    return (
        <SectionCard
            title="Contact Information"
            icon={<User className="h-5 w-5" />}
        >
            <div className="space-y-6">

                {/* HERO */}
                <div className="
                    relative overflow-hidden
                    rounded-2xl
                    border border-slate-200
                    bg-gradient-to-br
                    from-slate-50
                    to-white
                    p-5
                ">
                    <p className="text-sm text-slate-500">
                        Guard Communication Details
                    </p>

                    <h3 className="mt-1 text-xl font-semibold text-slate-800">
                        Primary Contact Profile
                    </h3>
                </div>

                {/* PHONE */}
                <div className="space-y-2">

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Phone className="h-4 w-4" />
                        Phone Number
                    </div>

                    <div className="flex items-center justify-between gap-3">

                        <p className="text-lg font-semibold text-slate-800">
                            {guard.mobile}
                        </p>

                        <Button size="sm" variant="outline" asChild>
                            <Link to={`tel:${guard.mobile}`}>
                                Call
                            </Link>
                        </Button>

                    </div>
                </div>

                <Separator className="bg-slate-200" />

                {/* EMAIL */}
                <div className="space-y-2">

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Mail className="h-4 w-4" />
                        Email Address
                    </div>

                    <div className="flex items-start justify-between gap-3">

                        <p className="text-base font-medium text-slate-800 break-all">
                            {guard.email}
                        </p>

                        <Button size="sm" variant="outline" asChild>
                            <Link to={`mailto:${guard.email}`}>
                                Email
                            </Link>
                        </Button>

                    </div>
                </div>

                <Separator className="bg-slate-200" />

                {/* ADDRESS */}
                <div className="space-y-2">

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin className="h-4 w-4" />
                        Address
                    </div>

                    <p className="text-base text-slate-700 leading-relaxed">
                        {guard.address || "No address available"}
                    </p>

                </div>

            </div>
        </SectionCard>
    );
};

export default GuardContactCard;