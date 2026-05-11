"use client";

import { Guard } from "@/apis/guardsApi";

import {
    Mail,
    MapPin,
    Phone,
    User,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

import { Button } from "@/components/ui/button";

import { Link } from "react-router-dom";

const GuardContactCard = ({
    guard,
}: {
    guard: Guard;
}) => {
    return (
        <Card className="border-2 border-gray-200 shadow-sm bg-white">

            <CardHeader className="border-b-2 border-gray-200 pb-4">

                <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-900">

                    <User className="h-6 w-6" />

                    Contact Information

                </CardTitle>

            </CardHeader>

            <CardContent className="p-6 space-y-5">

                {/* Phone */}
                <div className="space-y-2">

                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">

                        <Phone className="h-4 w-4" />

                        Phone Number

                    </div>

                    <div className="flex items-center justify-between gap-3">

                        <p className="text-lg font-semibold text-gray-900">
                            {guard.mobile}
                        </p>

                        <Button
                            size="sm"
                            variant="outline"
                            asChild
                        >
                            <Link to={`tel:${guard.mobile}`}>
                                Call
                            </Link>
                        </Button>

                    </div>
                </div>

                <Separator />

                {/* Email */}
                <div className="space-y-2">

                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">

                        <Mail className="h-4 w-4" />

                        Email Address

                    </div>

                    <div className="flex items-start justify-between gap-3">

                        <p className="text-base font-medium text-gray-900 break-all">
                            {guard.email}
                        </p>

                        <Button
                            size="sm"
                            variant="outline"
                            asChild
                        >
                            <Link to={`mailto:${guard.email}`}>
                                Email
                            </Link>
                        </Button>

                    </div>
                </div>

                <Separator />

                {/* Address */}
                <div className="space-y-2">

                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">

                        <MapPin className="h-4 w-4" />

                        Address

                    </div>

                    <p className="text-base text-gray-700 leading-relaxed">
                        {guard.address || "No address available"}
                    </p>

                </div>

            </CardContent>
        </Card>
    );
};

export default GuardContactCard;