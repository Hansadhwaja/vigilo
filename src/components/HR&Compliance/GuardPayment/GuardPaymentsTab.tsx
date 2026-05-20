"use client";

import SectionCard from "@/components/common/Card/SectionCard";
import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useGetAllGuardsQuery } from "@/apis/guardsApi";

import GuardPaymentSearchFilters from "./GuardPaymentSearchFilters";
import GuardPaymentStats from "./GuardPaymentStatCards";
import GeneratePaymentModal from "./Modal/GeneratePaymentModal";
import PaymentList from "./PaymentList";
import { useGetAllGuardPaymentsQuery } from "@/apis/invoiceApis";

const GuardPaymentsTab = () => {
    const { getParam } = useQueryParams();

    const fromDate = getParam("fromDate");
    const toDate = getParam("toDate");
    const guardId = getParam("guardId");
    const search = getParam("search");

    const debouncedSearch = useDebounce(search, 500);

    const { data: guardsRes, isLoading: isGuardsLoading } =
        useGetAllGuardsQuery();

    const guards = guardsRes?.data ?? [];

    const { data } = useGetAllGuardPaymentsQuery({
        search: debouncedSearch,
        guardId,
        fromDate,
        toDate,
    });

    const guardPayments = data?.data?.payments ?? [];

    return (
        <SectionCard
            title="Guard Payments"
            description="Process payroll and track payment status across your workforce"
            others={<GeneratePaymentModal />}
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