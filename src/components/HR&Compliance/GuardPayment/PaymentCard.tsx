import UserAvatar from "@/components/common/Avatar/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit, Eye, Clock3, BadgeDollarSign } from "lucide-react";

interface Payment {
    name: string;
    src: string;
    post: string;
    id: string;
    period: string;
    hours: number;
    ot: number;
    hourlyPrice: number;
    otPrice: number;
    status: string;
}

const PaymentCard = ({ payment }: { payment: Payment }) => {
    const totalPay =
        payment.hourlyPrice * payment.hours +
        payment.otPrice * payment.ot;

    return (
        <div className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                {/* LEFT */}
                <div className="flex items-center gap-4 min-w-0">
                    <UserAvatar
                        src={payment.src}
                        name={payment.name}
                    />

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-lg font-semibold text-gray-900 truncate">
                                {payment.name}
                            </h2>

                            <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                                {payment.period}
                            </Badge>
                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                            {payment.post}
                        </p>

                        <p className="text-xs text-gray-400 font-mono mt-2">
                            ID: {payment.id}
                        </p>
                    </div>
                </div>

                {/* CENTER */}
                <div className="flex flex-wrap items-center gap-6">

                    {/* HOURS */}
                    <div className="space-y-2 min-w-[140px]">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Clock3 className="h-4 w-4" />
                            Hours
                        </div>

                        <div>
                            <p className="text-lg font-semibold text-gray-900">
                                {payment.hours}h
                            </p>

                            <p className="text-sm text-orange-600 font-medium">
                                +{payment.ot}h OT
                            </p>
                        </div>
                    </div>

                    <Separator
                        orientation="vertical"
                        className="hidden md:block h-14"
                    />

                    {/* RATE */}
                    <div className="space-y-2 min-w-[140px]">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <BadgeDollarSign className="h-4 w-4" />
                            Rate
                        </div>

                        <div>
                            <p className="text-lg font-semibold text-gray-900">
                                ${payment.hourlyPrice}/hr
                            </p>

                            <p className="text-sm text-orange-600 font-medium">
                                ${payment.otPrice}/hr OT
                            </p>
                        </div>
                    </div>

                    <Separator
                        orientation="vertical"
                        className="hidden md:block h-14"
                    />

                    {/* TOTAL */}
                    <div className="space-y-2 min-w-[180px]">
                        <p className="text-sm text-gray-500">
                            Total Pay
                        </p>

                        <h3 className="text-2xl font-bold text-green-600">
                            ${totalPay}
                        </h3>

                        <p className="text-xs text-gray-500">
                            ${payment.hourlyPrice * payment.hours}
                            {" + "}
                            ${payment.otPrice * payment.ot}
                        </p>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-start xl:items-end gap-4">
                    <Badge
                        className={`
                            capitalize px-3 py-1 text-xs
                            ${payment.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : payment.status === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                            }
                        `}
                    >
                        {payment.status}
                    </Badge>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-lg"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-lg"
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentCard;