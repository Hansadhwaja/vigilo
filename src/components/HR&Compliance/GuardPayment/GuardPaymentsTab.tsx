import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useQueryParams } from '@/lib/hooks/useQueryParams';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useGetAllTimeSheetsQuery } from '@/apis/schedulingAPI';
import { useGetAllGuardsQuery } from '@/apis/guardsApi';
import GuardPaymentSearchFilters from './GuardPaymentSearchFilters';
import GuardPaymentStats from './GuardPaymentStatCards';
import GeneratePaymentModal from './Modal/GeneratePaymentModal';
import PaymentList from './PaymentList';
import { useGetAllGuardPaymentsQuery } from '@/apis/invoiceApis';

const GuardPaymentsTab = () => {
    const {
        getParam,
        setMultipleParams,
    } = useQueryParams();

    const fromDate = getParam("fromDate");
    const toDate = getParam("toDate");
    const guardId = getParam("guardId");
    const search = getParam("search");
    const page = getParam("page");
    const limit = getParam("limit");
    const debouncedSearch = useDebounce(search, 500);

    const { data: guardsRes, isLoading: isGuardsLoading } = useGetAllGuardsQuery();
    const guards = guardsRes?.data ?? [];

    const { data: timeSheetRes, isLoading, isError, isFetching, error } = useGetAllTimeSheetsQuery({
        search: debouncedSearch,
        guardId,
        fromDate,
        toDate
    });

    const timeSheets = timeSheetRes?.data ?? [];

    const { data } = useGetAllGuardPaymentsQuery(undefined);
    const guardPayments = data?.data?.payments ?? [];


    return (
        <Card className='p-0'>
            <CardHeader className="p-2 flex justify-between items-center">
                <div>
                    <CardTitle className="text-lg font-semibold">Guard Payments</CardTitle>
                    <CardDescription>Process payroll and track payment status across your workforce</CardDescription>
                </div>
                <GeneratePaymentModal />
            </CardHeader>
            <CardContent className="p-2 space-y-4">
                <GuardPaymentStats />
                <GuardPaymentSearchFilters
                    guards={guards}
                    isGuardsLoading={isGuardsLoading}
                />
                <PaymentList guardPayments={guardPayments} />
            </CardContent>
        </Card>
    )
}

export default GuardPaymentsTab