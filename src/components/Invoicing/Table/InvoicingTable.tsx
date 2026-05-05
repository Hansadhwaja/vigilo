
import { Column, DataTable, RowWithId } from '@/components/common/Table/DataTable'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { InvoiceType } from '@/types';
import { Download, Eye } from 'lucide-react'
import { Link } from 'react-router-dom';

interface InvoicingTableProps {
    invoices: InvoiceType[];
}

export const InvoicingTable = ({ invoices }: InvoicingTableProps) => {

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
                    <Link to={`/invoicing/details/${row.id}`}>
                        <Eye size={14} />
                    </Link>

                    <Button variant="outline" size="sm">
                        <Download size={14} />
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