import UserAvatar from "@/components/common/Avatar/UserAvatar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
} from "@/components/ui/card";

import { GuardPayment } from "@/types";

import {
    BadgeDollarSign,
    Clock3,
    Edit,
    Eye,
} from "lucide-react";

import { formatCurrency } from "@/lib/utils";

const PaymentCard = ({
    payment,
}: {
    payment: GuardPayment;
}) => {
    return (
        <Card className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md p-0">
            <CardContent className="p-0">
                {/* TOP BAR */}

                <div className="flex items-center justify-between border-b bg-slate-50 px-6 py-4">
                    <div className="flex items-center gap-4">
                        <UserAvatar
                            src=""
                            name={
                                payment.guard
                                    .name
                            }
                        />

                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                {
                                    payment.guard
                                        .name
                                }
                            </h2>

                            <p className="text-sm text-slate-500">
                                {
                                    payment.guard
                                        .email
                                }
                            </p>
                        </div>
                    </div>

                    <Badge
                        className={`
                            capitalize border px-3 py-1 text-xs font-medium
                            ${payment.status ===
                                "paid"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : payment.status ===
                                    "pending"
                                    ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                                    : "border-slate-200 bg-slate-100 text-slate-700"
                            }
                        `}
                    >
                        {payment.status}
                    </Badge>
                </div>

                {/* BODY */}

                <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-4">
                    {/* HOURS */}

                    <div className="rounded-xl border bg-slate-50 p-4">
                        <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
                            <Clock3 className="h-4 w-4" />
                            Hours Summary
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">
                                    Regular
                                </span>

                                <span className="font-medium">
                                    {
                                        payment.regularHours
                                    }
                                    h
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">
                                    Overtime
                                </span>

                                <span className="font-medium text-orange-600">
                                    +
                                    {
                                        payment.overtimeHours
                                    }
                                    h
                                </span>
                            </div>

                            <div className="border-t pt-2" />

                            <div className="flex items-center justify-between">
                                <span className="font-medium">
                                    Total
                                </span>

                                <span className="text-lg font-bold">
                                    {
                                        payment.totalHours
                                    }
                                    h
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* RATE */}

                    <div className="rounded-xl border bg-slate-50 p-4">
                        <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
                            <BadgeDollarSign className="h-4 w-4" />
                            Rate Details
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">
                                    Regular
                                </span>

                                <span className="font-medium">
                                    $
                                    {
                                        payment.hourlyRate
                                    }
                                    /hr
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">
                                    Overtime
                                </span>

                                <span className="font-medium text-orange-600">
                                    $
                                    {
                                        payment.overtimeHourlyRate
                                    }
                                    /hr
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* BREAKDOWN */}

                    <div className="rounded-xl border bg-slate-50 p-4">
                        <div className="mb-3 text-sm text-slate-500">
                            Payment Breakdown
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">
                                    Base Pay
                                </span>

                                <span>
                                    {formatCurrency(
                                        Number(
                                            payment.basePay
                                        )
                                    )}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">
                                    Overtime
                                </span>

                                <span>
                                    {formatCurrency(
                                        Number(
                                            payment.overtimePay
                                        )
                                    )}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">
                                    Tax
                                </span>

                                <span className="text-red-500">
                                    -
                                    {formatCurrency(
                                        Number(
                                            payment.taxDeduction
                                        )
                                    )}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">
                                    Other
                                </span>

                                <span className="text-red-500">
                                    -
                                    {formatCurrency(
                                        Number(
                                            payment.otherDeductions
                                        )
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* TOTAL */}

                    <div className="flex flex-col justify-between rounded-xl border bg-linear-to-br from-emerald-50 to-emerald-100 p-5">
                        <div>
                            <p className="text-sm text-emerald-700">
                                Total Payment
                            </p>

                            <h3 className="mt-2 text-4xl font-bold text-emerald-700">
                                {formatCurrency(
                                    Number(
                                        payment.totalPay
                                    )
                                )}
                            </h3>

                            <p className="mt-2 text-xs text-slate-500">
                                Payment ID:
                            </p>

                            <p className="truncate text-xs font-mono text-slate-600">
                                {payment.id}
                            </p>
                        </div>

                        <div className="mt-6 flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                            </Button>

                            <Button
                                size="sm"
                                className="flex-1"
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PaymentCard;