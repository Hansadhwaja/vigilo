
import { useGenerateInvoicePDFMutation } from '@/apis/invoiceApis';
import Loader from '@/components/common/Loader';
import { Column, DataTable, RowWithId } from '@/components/common/Table/DataTable'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { InvoiceType } from '@/types';
import { Download, Eye } from 'lucide-react'
import { useState } from 'react';
import { toast } from 'sonner';

interface InvoicingTableProps {
    invoices: InvoiceType[];
}

export const InvoicingTable = ({ invoices }: InvoicingTableProps) => {

    const [loadingInvoiceId, setLoadingInvoiceId] = useState<string | null>(null);
    const [generateInvoicePDF, { isLoading }] = useGenerateInvoicePDFMutation();

    const handleGeneratePdf = async (id: string) => {
        setLoadingInvoiceId(id);
        try {
            const res = await generateInvoicePDF(id).unwrap();
            window.open(res?.data?.invoiceUrl, "_blank");
            toast.success("Invoice Fetched Successfully");

        } catch (error) {
            toast.error("Error while fetching invoice pdf");
        } finally {

            setLoadingInvoiceId(null);
        }
    }

    const columns: Column<InvoiceType & RowWithId>[] = [
        {
            key: 'invoiceNumber',
            header: 'Invoice ID',
        },
        {
            key: 'clientName',
            header: 'Client',
        },
        {
            key: 'services',
            header: 'Service Provided',
            render: (row) => {
                const s = row.services;

                if (!s) return "-";

                const parts = [];

                if (s.orders > 0) parts.push(`${s.orders} Orders`);
                if (s.custom > 0) parts.push(`${s.custom} Custom`);
                if (s.alarms > 0) parts.push(`${s.alarms} Alarms`);

                return parts.length > 0 ? parts.join(", ") : "-";
            }
        },
        {
            key: 'billingPeriod',
            header: 'Period/Days',
        },
        {
            key: 'amount',
            header: 'Amount',
            render: row => formatCurrency(row.amount)
        },
        {
            key: 'status',
            header: 'Status',
            render: (row) => <Badge className='capitalize'>{row.status}</Badge>
        },
        {
            key: 'dueDate',
            header: 'Due Date',
        },
        {
            key: 'actions',
            header: 'Actions',
            align: 'center',
            render: (row) => (
                <div className="flex gap-2 justify-center items-center">
                    <Button
                        variant="outline"
                        size="sm"
                        className='cursor-pointer'
                        onClick={() => handleGeneratePdf(row.id)}
                        disabled={loadingInvoiceId === row.id}
                    >
                        {loadingInvoiceId === row.id
                            ? <Loader />
                            : <Download size={14} />
                        }
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            data={invoices}
            emptyText="No invoice available."
        />
    )
}

export default InvoicingTable