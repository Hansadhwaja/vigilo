"use client";

import UserAvatar from "@/components/common/Avatar/UserAvatar";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
    Eye,
    Edit,
    Clock3,
} from "lucide-react";

import { GuardPayment } from "@/types";
import { formatCurrency } from "@/lib/utils";

const PaymentCard = ({ payment }: { payment: GuardPayment }) => {
    return (
        <Card className="rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-md transition-all p-0">
            <CardContent className="p-3">

                <Accordion type="single" collapsible>

                    <AccordionItem value="details" className="border-none">

                        {/* HEADER ONLY SUMMARY */}
                        <AccordionTrigger className="hover:no-underline p-0 flex justify-center items-center">

                            <div className="flex items-center justify-between w-full gap-4">

                                {/* LEFT */}
                                <div className="flex items-center gap-3 min-w-0">

                                    <UserAvatar
                                        src=""
                                        name={payment.guard.name}
                                    />

                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-900 truncate">
                                            {payment.guard.name}
                                        </p>
                                        <p className="text-sm text-slate-500 truncate">
                                            {payment.guard.email}
                                        </p>
                                    </div>

                                </div>

                                {/* CENTER STATS */}
                                <div className="hidden md:flex items-center gap-3">

                                    <div className="px-3 py-1.5 rounded-lg bg-slate-50 border">
                                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                                            <Clock3 className="h-3 w-3" />
                                            Hours
                                        </p>
                                        <p className="text-sm font-semibold">
                                            {payment.totalHours}h
                                        </p>
                                    </div>

                                    <div className="px-3 py-1.5 rounded-lg bg-slate-50 border">
                                        <p className="text-[11px] text-slate-500">
                                            Rate
                                        </p>
                                        <p className="text-sm font-semibold">
                                            ${payment.hourlyRate}
                                        </p>
                                    </div>

                                    <div className="px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-100">
                                        <p className="text-[11px] text-orange-600">
                                            Overtime
                                        </p>
                                        <p className="text-sm font-semibold text-orange-600">
                                            +{payment.overtimeHours}h
                                        </p>
                                    </div>

                                </div>

                                {/* RIGHT SUMMARY */}
                                <div className="text-right leading-tight">
                                    <p className="text-[11px] text-slate-500">
                                        Total
                                    </p>
                                    <p className="text-base font-bold text-emerald-600">
                                        {formatCurrency(Number(payment.totalPay))}
                                    </p>
                                </div>

                                <Badge
                                    className={`capitalize text-[11px] px-2 py-0.5 rounded-full ${
                                        payment.status === "paid"
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                            : payment.status === "pending"
                                            ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                            : "bg-slate-100 text-slate-600 border"
                                    }`}
                                >
                                    {payment.status}
                                </Badge>

                            </div>

                        </AccordionTrigger>

                        {/* EXPANDED SECTION */}
                        <AccordionContent className="pt-4 space-y-4">

                            {/* HOURS + RATE */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">

                                <div className="rounded-lg border bg-slate-50 p-3">
                                    <p className="text-sm text-slate-500">Regular Hours</p>
                                    <p className="text-sm font-semibold">
                                        {payment.regularHours}h
                                    </p>
                                </div>

                                <div className="rounded-lg border bg-slate-50 p-3">
                                    <p className="text-sm text-slate-500">Overtime</p>
                                    <p className="text-sm font-semibold text-orange-600">
                                        {payment.overtimeHours}h
                                    </p>
                                </div>

                                <div className="rounded-lg border bg-slate-50 p-3">
                                    <p className="text-sm text-slate-500">Base Pay</p>
                                    <p className="text-sm font-medium">
                                        {formatCurrency(Number(payment.basePay))}
                                    </p>
                                </div>

                            </div>

                            {/* BREAKDOWN */}
                            <div className="rounded-lg border bg-slate-50 p-3 text-sm space-y-1">

                                <div className="flex justify-between">
                                    <span>Overtime</span>
                                    <span>{formatCurrency(Number(payment.overtimePay))}</span>
                                </div>

                                <div className="flex justify-between text-red-500">
                                    <span>Tax</span>
                                    <span>-{formatCurrency(Number(payment.taxDeduction))}</span>
                                </div>

                                <div className="flex justify-between text-red-500">
                                    <span>Other</span>
                                    <span>-{formatCurrency(Number(payment.otherDeductions))}</span>
                                </div>

                            </div>

                            {/* ACTIONS (NOW HERE ✅) */}
                            <div className="flex justify-end gap-2 pt-2">

                                <Button size="sm" variant="outline">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                </Button>

                                <Button size="sm">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>

                            </div>

                        </AccordionContent>

                    </AccordionItem>

                </Accordion>

            </CardContent>
        </Card>
    );
};

export default PaymentCard;