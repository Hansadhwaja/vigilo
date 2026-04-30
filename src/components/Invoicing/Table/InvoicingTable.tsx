
import { Column, DataTable, RowWithId } from '@/components/common/Table/DataTable'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InvoiceType } from '@/types';
import { Download, Eye } from 'lucide-react'
import { Link } from 'react-router-dom';

interface InvoicingTableProps {
    invoices: InvoiceType[];
}

export const InvoicingTable = ({ invoices }: InvoicingTableProps) => {

    const columns: Column<InvoiceType & RowWithId>[] = [
        {
            key: 'id',
            header: 'Invoice ID',
        },
        {
            key: 'client',
            header: 'Client',
        },
        {
            key: 'services',
            header: 'Service Provided',
        },
        {
            key: 'period',
            header: 'Period/Days',
        },
        {
            key: 'amount',
            header: 'Amount',
        },
        {
            key: 'status',
            header: 'Status',
            render: (row) => <Badge>{row.status}</Badge>
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