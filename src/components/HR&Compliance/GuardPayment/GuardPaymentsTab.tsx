"use client";

import SectionCard from "@/components/common/Card/SectionCard";
import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useGetAllGuardsQuery } from "@/apis/guardsApi";

import GuardPaymentSearchFilters from "./GuardPaymentSearchFilters";
import GuardPaymentStats from "./GuardPaymentStatCards";
import GeneratePaymentModal from "./Modal/GeneratePaymentModal";
import PaymentList from "./PaymentList";
import { useExportGuardPaymentsMutation, useGetAllGuardPaymentsQuery } from "@/apis/invoiceApis";
import { Button } from "@/components/ui/button";
import Loader from "@/components/common/Loader";
import { Download } from "lucide-react";
import { toast } from "sonner";

const GuardPaymentsTab = () => {
    const { getParam } = useQueryParams();

    const fromDate = getParam("fromDate");
    const toDate = getParam("toDate");
    const guardId = getParam("guardId");
    const search = getParam("search");

    const debouncedSearch = useDebounce(search, 500);

    const { data: guardsRes, isLoading: isGuardsLoading } = useGetAllGuardsQuery();

    const guards = guardsRes?.data ?? [];

    const { data } = useGetAllGuardPaymentsQuery({
        search: debouncedSearch,
        guardId,
        fromDate,
        toDate,
    });

    const guardPayments = data?.data?.payments ?? [];

    const [exportGuardPayment, { isLoading: isExporting }] = useExportGuardPaymentsMutation();

    const handleExport = async () => {
        try {
            const blob = await exportGuardPayment(undefined).unwrap();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `guard-payment-report-${Date.now()}.csv`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
            toast.success("Guard Payments Exported Successfully");
        } catch (error) {
            console.log(error);
            toast.error("Error while exporting Guard Payments")
        }
    }

    return (
        <SectionCard
            title="Guard Payments"
            description="Process payroll and track payment status across your workforce"
            others={
                <div className="flex gap-2 items-center">
                    <GeneratePaymentModal />
                    <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                        onClick={handleExport}
                        disabled={isExporting}
                    >

                        {isExporting ? <Loader /> : (
                            <>
                                <Download className="h-4 w-4" />
                                Export
                            </>


                        )}
                    </Button>

                </div>}
        >
            <div className="space-y-4">
                <GuardPaymentStats />

                <GuardPaymentSearchFilters
                    guards={guards}
                    isGuardsLoading={isGuardsLoading}
                />

                <PaymentList guardPayments={guardPayments} />
            </div>
        </SectionCard>
    );
};

export default GuardPaymentsTab;